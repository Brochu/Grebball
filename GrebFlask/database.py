import os

from bson.json_util import loads
from pymongo import MongoClient

DB = MongoClient(os.environ.get('MONGO_URL'))[str(os.environ.get('MONGO_DB_NAME'))]

def FindPoolInfoByPooler(pooler):
    pool = DB.pools.find({ '_id': pooler['pool_id'] })[0]
    del pool['_id']

    poolers = list(DB.poolers.find({ 'pool_id': pooler['pool_id'] }))
    return (pool, poolers)

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

def FindPoolPicksForWeek(season, week, poolers, matchids):
    poolerids = []
    picks = []

    for p in poolers:
        poolerids.append(str(p['_id']))
        possiblepicks = list(DB.picks.find({
            'pooler_id': p['_id'],
            'season': season,
            'week': week
        }))

        if len(possiblepicks) > 0:
            picks.append(loads(possiblepicks[0]['pickstring']))
        else:
            picks.append({ m:'na' for m in matchids })

    return dict(zip(poolerids, picks))

def FindPoolPicksForSeason(season, poolers):
    picks = []

    for w in range(1, 23):
        incomplete = False
        picks.append({});

        for p in poolers:
            possiblepicks = list(DB.picks.find({
                'pooler_id': p['_id'],
                'season': season,
                'week': w
            }))

            if len(possiblepicks) > 0:
                picks[len(picks)-1][str(p['_id'])] = loads(possiblepicks[0]['pickstring'])
            else:
                incomplete = True

        if incomplete:
            break

    return picks

def InsertNewPicks(pickObj):
    DB.picks.insert_one(pickObj)
