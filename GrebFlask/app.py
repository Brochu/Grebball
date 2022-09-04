from flask import Flask, render_template, jsonify, request
import os
import requests

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/week', methods=['GET'])
def getWeek():
    season = request.args.get('season')
    week = request.args.get('week')

    if season is None or week is None:
        return 'bad request', 400

    url = "https://www.thesportsdb.com/api/v1/json/2/eventsround.php"

    # Gets the results for a given season and week
    # 01 - 18: Regular season
    # 19 - 21: Post season
    # 22: Final game (SuperBowl)

    # Special handling of round values for TheSportDB
    if week == '19':
        realWeek = 160
    elif week == '20':
        realWeek = 125
    elif week == '21':
        realWeek = 150
    elif week == '22':
        realWeek = 200
    else:
        realWeek = week;

    params = { 'id': 4391, 'r': realWeek, 's': season }
    req = requests.get(url = url, params = params)
    return req.json()

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
