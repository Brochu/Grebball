import os

from dotenv import load_dotenv
from flask import Flask, render_template

from pools import PoolsBlueprint
from picks import PicksBlueprint

app = Flask(__name__)
app.register_blueprint(PoolsBlueprint)
app.register_blueprint(PicksBlueprint)

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == "__main__":
    load_dotenv()
    port = int(os.environ.get('PORT', 5000))

    app.run(debug=True, host='0.0.0.0', port=port)
