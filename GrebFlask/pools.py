from bson.json_util import loads
from bson import ObjectId
from flask import Blueprint, session, render_template

from database import DB
from football import GetWeek, GetTeamShortName

PoolsBlueprint = Blueprint('pools_blueprint', __name__)

#TODO: Remove test user
poolerid = ObjectId('5f70f0ffd8e2db255c9a0df6')

@PoolsBlueprint.route('/pools')
def index():
    [season, week] = FindCurrentWeek()
    # pooler = loads(session['pooler'])
    pooler = DB.poolers.find({ '_id': poolerid })[0]

    poolers = list(DB.poolers.find({ 'pool_id': pooler['pool_id'] }))

    picks = list(DB.picks.find({
        'pooler_id': pooler['_id'],
        'season': int(season),
        'week': int(week)
    }))

    allpicks = {}
    for p in poolers:
        allpicks[p['name']] = loads(DB.picks.find({
            'pooler_id': p['_id'],
            'season': int(season),
            'week': int(week)
        })[0]['pickstring'])

    if len(picks) > 0:
        picksdata = loads(picks[0]['pickstring'])
    else:
        picksdata = {}

    weekdata = GetWeek(season, week)

    return render_template('home.html',
        GetTeamShortName = GetTeamShortName,
        poolers = poolers,
        picks = picksdata,
        allpicks = allpicks,
        weekdata = weekdata,
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
# Ruby version here
###################################
# class PoolsController < ApplicationController
#   before_action :set_pool, only: [:show, :edit, :update, :destroy]
#
#   # GET /pools
#   # GET /pools.json
#   def index
#     user = User.where(token: session[:user_token]).first
#     if user.nil?
#       redirect_to '/'
#       return
#     end
#
#     @pool = Pooler.where(user_id: user.id).first.pool
#     @poolers = @pool.poolers.to_a
#
#     if !params[:season].nil? && !params[:week].nil?
#       @week_info = {
#         season: params[:season],
#         week: params[:week]
#       }
#     else
#       @week_info = find_current_week(@poolers)
#     end
#
#     if params[:season_total].nil?
#       @week_data = get_week(@week_info[:season].to_s, @week_info[:week].to_s)['events'].map do |x|
#         x[:home_code] = get_shortname(x['strHomeTeam'])
#         x[:home_won] = x['intHomeScore'].to_i > x['intAwayScore'].to_i
#
#         x[:away_code] = get_shortname(x['strAwayTeam'])
#         x[:away_won] = x['intAwayScore'].to_i > x['intHomeScore'].to_i
#         x
#       end
#       picks_data = @poolers.map do |pooler|
#         {
#           p: pooler,
#           picks: pooler.picks.where(season: @week_info[:season], week: @week_info[:week]).first
#         }
#       end
#
#       @results = calculate_week_results(picks_data, @week_data, @week_info[:week])
#       @totals = @results.map do |r|
#         r.reduce(0) { |t, c| t = t + c }
#       end
#     else
#       @results = (1..@week_info[:week]).map do |w|
#         week_data = get_week(@week_info[:season].to_s, w.to_s)['events'].map do |x|
#           x[:home_code] = get_shortname(x['strHomeTeam'])
#           x[:home_won] = x['intHomeScore'].to_i > x['intAwayScore'].to_i
#
#           x[:away_code] = get_shortname(x['strAwayTeam'])
#           x[:away_won] = x['intAwayScore'].to_i > x['intHomeScore'].to_i
#           x
#         end
#         picks_data = @poolers.map do |pooler|
#           {
#             p: pooler,
#             picks: pooler.picks.where(season: @week_info[:season], week: w).first
#           }
#         end
#
#         calculate_week_results(picks_data, week_data, w).map do |r|
#           r.reduce(0) do |t, c|
#             t = c >= 0 ? t + c : t + 0
#           end
#         end
#       end
#
#       @totals = @poolers.each_with_index.map do |_, i|
#         @results.reduce(0) do |t, a|
#           t = t + a[i]
#         end
#       end
#     end
#   end
#
#     def calculate_week_results(picks_data, week_data, week)
#       picks_data.map do |e|
#         if e[:picks].nil?
#           (0...week_data.size).map { |_| -1 }
#         else
#           picks = e[:picks].parse_picks
#           week_data.each_with_index.map do |game, i|
#             curr_pick = e[:picks].json_picks? ? picks[game['idEvent']] : picks[i]
#
#             if (game[:away_won] && curr_pick == game[:away_code]) ||
#                (game[:home_won] && curr_pick == game[:home_code])
#
#               # pooler was right
#               unique = picks_data.one? do |x|
#                 if !x[:picks].nil?
#                   x_picks = x[:picks].parse_picks
#                   other_current = x[:picks].json_picks? ? x_picks[game['idEvent']] : x_picks[i]
#                   other_current == curr_pick
#                 else
#                   false
#                 end
#               end
#
#               correctScore = get_correct_score(week)
#               unique ? (1.5*correctScore).to_i : correctScore
#             else
#               # pooler was wrong OR tie game OR no score
#               tied = (!game[:away_won] && !game[:home_won] &&
#                       !game['intAwayScore'].nil? && !game['intHomeScore'].nil?)
#
#               tied ? 1 : 0
#             end
#           end
#         end
#       end
#     end
# end
