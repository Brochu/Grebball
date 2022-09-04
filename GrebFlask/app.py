from dotenv import load_dotenv
from flask import Flask, render_template
from pymongo import MongoClient

from football import GetWeek

import os

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/week/<season>/<week>', methods=['GET'])
def getWeek(season, week):
    return GetWeek(season, week)

@app.route('/poolers', methods=['GET'])
def getPoolers():
    client = MongoClient(os.environ.get('MONGO_URL'))

    db = client.pool_football_app_dev
    collection = db.poolers
    alex = collection.find({ 'name': 'Alex' })[0]

    coll = db.picks
    picks = coll.find({ 'pooler_id': alex.get('_id') })

    result = []
    for p in picks:
        result.append(p['pickstring'])

    return result

if __name__ == "__main__":
    load_dotenv()
    port = int(os.environ.get('PORT', 5000))

    app.run(debug=True, host='0.0.0.0', port=port)
