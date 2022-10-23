from flask import Blueprint, request

from database import FindPoolerByEmail

PoolerBlueprint = Blueprint('pooler_blueprint', __name__)

@PoolerBlueprint.route('/pooler')
def newPicksIndex():
    pooler = FindPoolerByEmail(request.headers['Pooler-Email'])
    return { 'name': pooler['name'], 'favTeam': pooler['favTeam'] }
