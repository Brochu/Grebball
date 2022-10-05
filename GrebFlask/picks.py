from bson.json_util import loads, dumps
from bson import ObjectId
from flask import Blueprint, session, render_template, request

from database import DB
from football import GetWeek, GetTeamShortName, GetWeekLongName, GetWeekName
from pools import FindCurrentWeek

PicksBlueprint = Blueprint('picks_blueprint', __name__)

MAX_WEEK = 22
#TODO: Remove test user
poolerid = ObjectId('5f70f0ffd8e2db255c9a0df6')

@PicksBlueprint.route('/picks')
def index():
    #pooler = loads(session['pooler'])
    pooler = DB.poolers.find({ '_id': poolerid })[0]
    [season, _] = FindCurrentWeek()

    seasonpicks = list(DB.picks.find(
        filter = {
        'pooler_id': pooler['_id'],
        'season': season,
        },
        sort = [("week", 1)],
    ))

    picksmap = {}
    for i in range(MAX_WEEK):
        if i < len(seasonpicks):
            picksmap[i+1] = seasonpicks[i]
        else:
            picksmap[i+1] = None

    return render_template('picks.index.html',
        GetWeekName = GetWeekName,
        pooler = pooler,
        season = season,
        picksmap = picksmap,
    )

@PicksBlueprint.route('/picks/new/<strseason>/<strweek>')
def new(strseason, strweek):
    season = int(strseason)
    week = int(strweek)
    weekdata = GetWeek(season, week)
    matchids = [m['idEvent'] for m in weekdata]

    #pooler = loads(session['pooler'])
    pooler = DB.poolers.find({ '_id': poolerid })[0]
    pool = DB.pools.find({ '_id': pooler['pool_id'] })[0]

    return render_template('picks.new.html',
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
        picks[matchid] = request.form[matchid] if matchid in request.form else ''

    pickObj = {
        'season': request.form['season'],
        'week': request.form['week'],
        'pooler_id': dumps(ObjectId(request.form['pooler_id'])),
        'pickstring': dumps(picks),
    }
    #TODO: Send actual request to Mongo to add the picks
    return pickObj
