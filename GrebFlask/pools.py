from bson import ObjectId
from bson.json_util import loads
from flask import Blueprint, session, render_template

from database import DB, FindCurrentWeek, FindPoolInfoByPooler, FindPoolPicksForWeek, FindPoolPicksForSeason
from football import GetWeek, GetTeamShortName, GetWeekLongName

PoolsBlueprint = Blueprint('pools_blueprint', __name__)

#TODO: Remove test user
poolerid = ObjectId('5f70f0ffd8e2db255c9a0df6')

@PoolsBlueprint.route('/pools')
def index():
    [season, week] = FindCurrentWeek()
    return CreateWeekData(season, week)

@PoolsBlueprint.route('/pools/<strseason>/<strweek>')
def get(strseason, strweek):
    season = int(strseason)
    week = int(strweek)
    return CreateWeekData(season, week)

@PoolsBlueprint.route('/pools/<strseason>')
def getSeason(strseason):
    season = int(strseason)
    return CreateSeasonData(season)

def CreateWeekData(season, week):
    matchdata = GetWeek(season, week)
    matchids = [m['idEvent'] for m in matchdata]

    # pooler = loads(session['pooler'])
    pooler = DB.poolers.find({ '_id': poolerid })[0]
    (poolinfo, poolers) = FindPoolInfoByPooler(pooler)

    weekresults = CalcPoolResults(
        matchdata,
        FindPoolPicksForWeek(season, week, poolers, matchids),
        week
    )

    return {
        'pooldata': poolinfo,
        'poolernames': { str(p['_id']):p['name'] for p in poolers },
        'weekdata': { 'season': season, 'week': week },
        'matches': matchdata,
        'results': weekresults,
    }

def CreateSeasonData(season):
    # pooler = loads(session['pooler'])
    pooler = DB.poolers.find({ '_id': poolerid })[0]
    (poolinfo, poolers) = FindPoolInfoByPooler(pooler)

    seasonPicks = FindPoolPicksForSeason(season, poolers)
    results = [ CalcPoolResults(GetWeek(season, w+1), picks, w+1) for w, picks in enumerate(seasonPicks) ]
    totals = [ { res['pid'] : res['total'] for res in result } for w, result in enumerate(results) ]
    fulltotals = { str(pooler['_id']) : 0 for pooler in poolers }

    for t in totals:
        for pid, score in t.items():
            fulltotals[pid] = fulltotals[pid] + score

    return {
        'pooldata': poolinfo,
        'poolernames': { str(p['_id']):p['name'] for p in poolers },
        'seasoninfo': season,
        'totals': totals,
        'fulltotals': fulltotals,
    }

def CalcPoolResults(matches, poolpicks, week):
    results = []

    for poolerid, picks in poolpicks.items():
        total = 0
        res = {}

        for match in matches:
            hscore = int(match['intHomeScore']) if match['intHomeScore'] is not None else 0
            ascore = int(match['intAwayScore']) if match['intAwayScore'] is not None else 0

            hwin = hscore > ascore
            tied = hscore == ascore

            hpick = picks[match['idEvent']] == GetTeamShortName(match['strHomeTeam'])
            rightpick = (hwin and hpick) or (not(hwin) and not(hpick))

            others = [ p[match['idEvent']] if i != poolerid else '' for i, p in poolpicks.items() ]
            unique = not(picks[match['idEvent']] in others)

            if tied:
                score = 1
            elif rightpick and unique:
                score = int(GetCorrectScore(week) * 1.5)
            elif rightpick:
                score = GetCorrectScore(week)
            else:
                score = 0

            res[match['idEvent']] = {
                'pick': picks[match['idEvent']],
                'score': score,
            }

            total = total + score

        results.append({ 'pid': poolerid, 'scores': res, 'total': total })

    return results

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
