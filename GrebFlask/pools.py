from bson.json_util import loads
from bson import ObjectId
from flask import Blueprint, session, render_template

from database import DB, FindCurrentWeek
from football import GetWeek, GetTeamShortName, GetWeekLongName

PoolsBlueprint = Blueprint('pools_blueprint', __name__)

#TODO: Remove test user
poolerid = ObjectId('5f70f0ffd8e2db255c9a0df6')

@PoolsBlueprint.route('/pools')
def index():
    [season, week] = FindCurrentWeek()
    return ShowPoolStatus(season, week)

@PoolsBlueprint.route('/pools/<strseason>/<strweek>')
def get(strseason, strweek):
    season = int(strseason)
    week = int(strweek)

    return ShowPoolStatus(season, week)

def ShowPoolStatus(season, week):
    weekdata = GetWeek(season, week)

    # pooler = loads(session['pooler'])
    pooler = DB.poolers.find({ '_id': poolerid })[0]
    pool = DB.pools.find({ '_id': pooler['pool_id'] })[0]
    poolers = list(DB.poolers.find({ 'pool_id': pooler['pool_id'] }))

    #TODO: Try and combine all data in one structure to send to the template
    allpicks = FetchAllPicks(poolers, season, week, weekdata)
    [allscores, alltotals] = CalcWeekResults(weekdata, allpicks, week)

    #TODO: Fix this with post season
    bgcolors = ['red', 'gray', 'green', 'yellow']

    return render_template('home.html',
        GetTeamShortName = GetTeamShortName,

        poolname = pool['name'],
        season = season,
        week = GetWeekLongName(week),

        poolers = poolers,
        weekdata = weekdata,
        picksdata = allpicks,
        allscores = allscores,
        alltotals = alltotals,
        bgcolors = bgcolors,
    )

def FetchAllPicks(poolers, season, week, weekdata):
    allpicks = {}
    for p in poolers:
        possiblepicks = list(DB.picks.find({
            'pooler_id': p['_id'],
            'season': season,
            'week': week
        }))

        if len(possiblepicks) > 0:
            allpicks[p['_id']] = loads(possiblepicks[0]['pickstring'])
        else:
            allpicks[p['_id']] = {}
            for match in weekdata:
                allpicks[p['_id']][match['idEvent']] = ''

    return allpicks

def CalcWeekResults(matches, allpicks, week):
    allscores = {}
    for pid, picks in allpicks.items():
        for match in matches:
            hscore = int(match['intHomeScore']) if match['intHomeScore'] is not None else 0
            ascore = int(match['intAwayScore']) if match['intAwayScore'] is not None else 0

            hwin = hscore > ascore
            tied = hscore == ascore

            hpick = picks[match['idEvent']] == GetTeamShortName(match['strHomeTeam'])
            rightpick = (hwin and hpick) or (not(hwin) and not(hpick))

            others = []
            for i, innerpicks in allpicks.items():
                if i == pid: continue

                others.append(innerpicks[match['idEvent']])
            unique = not(picks[match['idEvent']] in others)

            if not(pid in allscores):
                allscores[pid] = {}

            if tied:
                allscores[pid][match['idEvent']] = 1
            elif rightpick and unique:
                allscores[pid][match['idEvent']] = int(GetCorrectScore(week) * 1.5)
            elif rightpick:
                allscores[pid][match['idEvent']] = GetCorrectScore(week)
            else:
                allscores[pid][match['idEvent']] = 0

    alltotals = {}
    for pid, scores in allscores.items():
        total = 0
        for _, score in scores.items():
            total = total + score
        alltotals[pid] = total

    return allscores, alltotals

def GetCorrectScore(week_num):
    if (type(week_num) == str):
        n = int(week_num)
    else:
        n = week_num

    if   n == 19: return 4
    elif n == 20: return 6
    elif n == 21: return 8
    elif n == 22: return 10
    else:         return 2
