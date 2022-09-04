import os

from dotenv import load_dotenv
from flask import Flask, render_template

from football import GetWeek
from database import GetPoolers

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/week/<season>/<week>', methods=['GET'])
def getWeek(season, week):
    return GetWeek(season, week)

@app.route('/poolers', methods=['GET'])
def getPoolers():
    return GetPoolers();

if __name__ == "__main__":
    load_dotenv()
    port = int(os.environ.get('PORT', 5000))

    app.run(debug=True, host='0.0.0.0', port=port)
