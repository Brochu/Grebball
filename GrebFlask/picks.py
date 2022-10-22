from bson.json_util import loads, dumps
from bson import ObjectId
from flask import Blueprint, session, request

from database import FindCurrentWeek, InsertNewPicks
from football import GetWeek

PicksBlueprint = Blueprint('picks_blueprint', __name__)

MAX_WEEK = 22
#TODO: Remove test user
poolerid = ObjectId('5f70f0ffd8e2db255c9a0df6')

@PicksBlueprint.route('/picks')
def newPicksIndex():
    [season, week] = FindCurrentWeek()

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

    pickObj = {
        'season': int(payload['season']),
        'week': int(payload['week']),
        'pooler_id': ObjectId(payload['pooler_id']),
        'pickstring': dumps(picks),
    }

    # Insert new picks in the database
    InsertNewPicks(pickObj)

    return {
        'success': True,
        'errorcode': 0,
    }
