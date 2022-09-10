from bson.json_util import loads
from bson import ObjectId
from flask import Blueprint, session, render_template

from database import DB
from football import GetWeek, GetTeamShortName, GetWeekLongName

PoolsBlueprint = Blueprint('pools_blueprint', __name__)

#TODO: Remove test user
poolerid = ObjectId('5f70f0ffd8e2db255c9a0df6')

@PoolsBlueprint.route('/pools')
def index():
    [season, week] = FindCurrentWeek()
    weekdata = GetWeek(season, week)
    # pooler = loads(session['pooler'])
    pooler = DB.poolers.find({ '_id': poolerid })[0]
    pool = DB.pools.find({ '_id': pooler['pool_id'] })[0]
    poolers = list(DB.poolers.find({ 'pool_id': pooler['pool_id'] }))

    allpicks = {}
    for p in poolers:
        allpicks[p['_id']] = loads(DB.picks.find({
            'pooler_id': p['_id'],
            'season': season,
            'week': week
        })[0]['pickstring'])

    otherpicks = {}
    for p in poolers:
        if p['_id'] == pooler['_id']: continue

        foundpicks = list(DB.picks.find({
            'pooler_id': p['_id'],
            'season': season,
            'week': week,
        }))

        jsonpicks = loads(foundpicks[0]['pickstring'])
        for k in jsonpicks:
            if not(k in otherpicks):
                otherpicks[k] = []
            otherpicks[k].append(jsonpicks[k])

    # Used to analyse for unique picks
    picks = loads(DB.picks.find({
            'pooler_id': pooler['_id'],
            'season': season,
            'week': week,
        })[0]['pickstring'])

    #TODO: Need to adapt this for unique picks for other poolers
    uniquepicks = {}
    for k in picks:
        uniquepicks[k] = not(picks[k] in otherpicks[k])

    allscores = {}
    for pid, pick in allpicks.items():
        for match in weekdata:
            hscore = match['intHomeScore']
            ascore = match['intAwayScore']

            hwin = hscore > ascore
            tied = hscore == ascore

            hpick = pick[match['idEvent']] == GetTeamShortName(match['strHomeTeam'])
            rightpick = (hwin and hpick) or (not(hwin) and not(hpick))

            if not(pid in allscores):
                allscores[pid] = {}

            if tied:
                allscores[pid][match['idEvent']] = 1
            elif rightpick:
                allscores[pid][match['idEvent']] = 2
            else:
                allscores[pid][match['idEvent']] = 0

    bgcolors = ['red', 'gray', 'green', '']

    return render_template('home.html',
        GetTeamShortName = GetTeamShortName,
        GetWeekLongName = GetWeekLongName,
        season = season,
        week = week,
        pooldata = pool,
        weekdata = weekdata,
        poolers = poolers,
        picksdata = allpicks,
        allscores = allscores,
        bgcolors = bgcolors,
    )

@PoolsBlueprint.route('/pools/<season>/<week>')
def get(season, week):
    #TODO: Base this logic based on the one above
    print(f'Need to show results for season {season}:{week}')
    return "TODO: NEED TO COPY THIS OFF OFF INDEX"

def FindCurrentWeek():
    seasonPipeline = [{
        '$group': {
            '_id': '$pooler_id',
            'season_max': { '$max': '$season' },
        }
    }]

    maxseason = 1900
    for s in DB.picks.aggregate(seasonPipeline):
        if s['season_max'] > maxseason:
            maxseason = s['season_max']

    weekPipeline = [{
        '$match': { 'season': maxseason }
    },
    {
        '$group': {
            '_id': '$season',
            'week_max': { '$max': '$week' },
        }
    }]

    maxweek = 0
    for s in DB.picks.aggregate(weekPipeline):
        if s['week_max'] > maxweek:
            maxweek = s['week_max']

    return maxseason, maxweek

def CalcWeekResults(matches, picks, week):
    temp = { 'm': matches, 'p': picks, 'w': week }
    return temp

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

###################################
# Python version here
###################################
# def PrintPoolerPicks():
#     # Find all other pool members' ids
#     otherpoolerids = list(map(lambda x: x['_id'], list(DB.poolers.find({ 'pool_id': pooler['pool_id'] }))))
#     otherpoolerids.remove(pooler['_id'])
#     # Print picks found in the DB
#     picks = json.loads(possiblepicks[0]['pickstring'])
#
#     otherpicks = {}
#     for otherid in otherpoolerids:
#         foundpicks = list(DB.picks.find({
#             'pooler_id': otherid,
#             'season': season,
#             'week': weeknum,
#         }))
#
#         jsonpicks = json.loads(foundpicks[0]['pickstring'])
#         for k in jsonpicks:
#             if not(k in otherpicks):
#                 otherpicks[k] = []
#             otherpicks[k].append(jsonpicks[k])
#
#     uniquepicks = {}
#     for k in picks:
#         uniquepicks[k] = not(picks[k] in otherpicks[k])
#
#     score = 0
#     for match in week:
#         hscore = int(match['intHomeScore'])
#         ascore = int(match['intAwayScore'])
#
#         hwin = hscore > ascore
#         tied = hscore == ascore
#
#         hpick = picks[match['idEvent']] == GetTeamShortName(match["strHomeTeam"])
#         rightpick = (hwin and hpick) or (not(hwin) and not(hpick))
#
#         if tied:
#             hwinstr = "-"
#             awinstr = "-"
#
#             score = score + 1
#         else:
#             hwinstr = "*" if hwin else " "
#             awinstr = " " if hwin else "*"
#
#             if rightpick and uniquepicks[match['idEvent']]:
#                 score = score + int(GetWinScore(weeknum) * 1.5)
#             elif rightpick:
#                 score = score + GetWinScore(weeknum)
#
#         print(f'\t{awinstr} [{" " if hpick else "X"}] {ascore} {match["strAwayTeam"]}')
#         print(f'\t{hwinstr} [{"X" if hpick else " "}] {hscore} {match["strHomeTeam"]}')
#         print()
#
#     print(f'Score pour: {GetWeekLongName(weeknum)} de la saison {season} => {score}')
