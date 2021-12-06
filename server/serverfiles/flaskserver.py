from flask import Flask, request, jsonify
from indexer import Indexer

app = Flask(__name__)
indexer = Indexer()


@app.route('/', methods=['POST'])
def add_message():
    query = request.json['query']
    result = indexer.query_processing(query)
    return jsonify({'response': result})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
