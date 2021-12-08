from flask import Flask, request, jsonify
import sys
sys.path.insert(0, '..')
from solr.indexer import Indexer

app = Flask(__name__)
indexer = Indexer()


@app.route('/api/search', methods=['GET', 'POST'])
def add_message(uuid):
    query = request.json['query']
    indexer.get_search(query)
    return jsonify({"response": uuid})


if __name__ == '__main__':
    app.run(debug=True)
