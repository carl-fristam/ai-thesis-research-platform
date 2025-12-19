from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/hello')
def say_hello():
    return jsonify({"message": "Hello from the M4 Python Backend!"})

if __name__ == '__main__':
    app.run(port=5000)
