from bson.json_util import loads, dumps
from bson import ObjectId
from flask import Blueprint, session, request, redirect

from database import FindCurrentWeek, InsertNewPicks
from football import GetWeek

PicksBlueprint = Blueprint('picks_blueprint', __name__)

MAX_WEEK = 22
#TODO: Remove test user
poolerid = ObjectId('5f70f0ffd8e2db255c9a0df6')

@PicksBlueprint.route('/picks')
def newPicksIndex():
    [season, week] = FindCurrentWeek()
    return { 'season': season, 'week': week }

@PicksBlueprint.route('/picks/new/<strseason>/<strweek>')
def newPicks(strseason, strweek):
    season = int(strseason)
    week = int(strweek)

    return GetWeek(season, week)

@PicksBlueprint.route('/picks/create', methods=['POST'])
def create():
    picks = {}
    for matchid in loads(request.form['matchids']):
        picks[matchid] = request.form[matchid] if matchid in request.form else ''

    pickObj = {
        'season': int(request.form['season']),
        'week': int(request.form['week']),
        'pooler_id': ObjectId(request.form['pooler_id']),
        'pickstring': dumps(picks),
    }

    # Insert new picks in the database
    InsertNewPicks(pickObj)

    return redirect('/pools')
