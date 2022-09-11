from bson.json_util import loads, dumps
from bson import ObjectId
from flask import Blueprint, session, render_template, request

from database import DB
from football import GetWeek, GetTeamShortName, GetWeekLongName

PicksBlueprint = Blueprint('picks_blueprint', __name__)

#TODO: Remove test user
poolerid = ObjectId('5f70f0ffd8e2db255c9a0df6')

@PicksBlueprint.route('/picks/new/<strseason>/<strweek>')
def new(strseason, strweek):
    season = int(strseason)
    week = int(strweek)
    weekdata = GetWeek(season, week)
    matchids = [m['idEvent'] for m in weekdata]

    #pooler = loads(session['pooler'])
    pooler = DB.poolers.find({ '_id': poolerid })[0]
    pool = DB.pools.find({ '_id': pooler['pool_id'] })[0]

    return render_template('picks.html',
        GetTeamShortName = GetTeamShortName,
        GetWeekLongName = GetWeekLongName,
        season = season,
        week = week,
        weekdata = weekdata,
        matchids = dumps(matchids),
        pooler = pooler,
        pooldata = pool,
    )

@PicksBlueprint.route('/picks/create', methods=['POST'])
def create():
    picks = {}
    for matchid in loads(request.form['matchids']):
        picks[matchid] = request.form[matchid]

    pickObj = {
        'season': request.form['season'],
        'week': request.form['week'],
        'pooler_id': dumps(ObjectId(request.form['pooler_id'])),
        'pickstring': dumps(picks),
    }
    return pickObj
