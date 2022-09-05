from flask import Blueprint

PoolsBlueprint = Blueprint('pools_blueprint', __name__)

@PoolsBlueprint.route('/pools')
def index():
    return "This is the pools main page"
