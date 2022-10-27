from bson.json_util import loads, dumps
from bson import ObjectId
from flask import Blueprint, request

from database import FindCurrentWeekForPooler, FindPoolerByEmail, InsertNewPicks
from football import GetWeek

PicksBlueprint = Blueprint('picks_blueprint', __name__)

MAX_WEEK = 22

@PicksBlueprint.route('/picks')
def newPicksIndex():
    [season, week] = FindCurrentWeekForPooler(FindPoolerByEmail(request.headers['Pooler-Email']))

    weekinfo = {
        'season': season,
        'week': week+1
    }
    return { 'weekinfo': weekinfo, 'weekdata': GetWeek(weekinfo['season'], weekinfo['week']) }

@PicksBlueprint.route('/picks/new/<strseason>/<strweek>')
def newPicks(strseason, strweek):
    season = int(strseason)
    week = int(strweek)

    weekinfo = {
        'season': season,
        'week': week
    }
    return { 'weekinfo': weekinfo, 'weekdata': GetWeek(season, week) }

@PicksBlueprint.route('/picks/create', methods=['POST'])
def create():
    payload = request.get_json()

    picks = {}
    for matchid in loads(payload['matchids']):
        picks[matchid] = payload[matchid] if matchid in payload else ''

    pooler = FindPoolerByEmail(payload['pooler-email'])
    pickObj = {
        'season': int(payload['season']),
        'week': int(payload['week']),
        #TODO: Get the player id from the logged in pooler map
        'pooler_id': pooler['_id'],
        'pickstring': dumps(picks),
    }

    # Insert new picks in the database
    InsertNewPicks(pickObj)

    return {
        'success': True,
        'errorcode': 0,
    }
