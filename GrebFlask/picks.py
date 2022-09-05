from flask import Blueprint

PicksBlueprint = Blueprint('picks_blueprint', __name__)

@PicksBlueprint.route('/picks')
def index():
    return "This is the picks main page"
