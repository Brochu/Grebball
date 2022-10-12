import os
from pymongo import MongoClient

DB = MongoClient(os.environ.get('MONGO_URL'))[str(os.environ.get('MONGO_DB_NAME'))]

def FindPoolerById(poolerId):
    foundPoolers = list(DB.poolers.find({ '_id': poolerId }))

    return foundPoolers[0] if len(foundPoolers) > 0 else {}

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

def FindPoolerPickForWeek(poolerId, season, week):
    return list(DB.picks.find({
        'pooler_id': poolerId,
        'season': season,
        'week': week
    }))

def InsertNewPicks(pickObj):
    DB.picks.insert_one(pickObj)
