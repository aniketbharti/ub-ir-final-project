from flask import Flask, request, jsonify
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from queryprocessor import queryprocessor
from news import News
from flask_cors import CORS

MAX_ROWS = 25000

app = Flask(__name__)
cors = CORS(app)
sia = SentimentIntensityAnalyzer()
newsdata = News()


@app.route('/api/search', methods=['POST'])
def search_query():
    query = request.json['query']
    result = queryprocessor.language_wt_query_processing(query)
    temp_list = []
    for idx, i in enumerate(result["docs"]):
        if 'text_en' in i and i["text_en"]:
            data = i["text_en"]
        elif 'text_hi' in i and i["text_hi"]:
            data = i["text_hi"]
        elif 'text_es' in i and i["text_es"]:
            data = i["text_es"]
        result["docs"][idx]['sentiments'] = analyze_sentiment(data)
    return jsonify({'response': result})


@app.route('/api/analyze', methods=["POST"])
def analyze_tweets():
    query_text = request.json['text']
    result = analyze_sentiment(query_text)
    return jsonify({'response': result})


def analyze_sentiment(text):
    return sia.polarity_scores(text)


@app.route('/api/pois', methods=['POST'])
def search_pois():
    query = 'poi_name : *'
    res = queryprocessor.search_general_field(query, {"rows": MAX_ROWS})
    for idx, i in enumerate(res['docs']):
        if 'text_en' in i and i["text_en"]:
            data = i["text_en"]
        elif 'text_hi' in i and i["text_hi"]:
            data = i["text_hi"]
        elif 'text_es' in i and i["text_es"]:
            data = i["text_es"]
        res['docs'][idx]["sentiments"] = analyze_sentiment(data)
    return jsonify({'response': res})


@app.route('/api/getnews', methods=['POST'])
def getnews():
    try:
        query = request.json['query']
        news = newsdata.get_new(query)
        print(news)
        for idx, i in enumerate(news['articles']):
            news['articles'][idx]["sentiments"] = analyze_sentiment(
                i['description'])
        print('kkk')
        return jsonify({"response": news['articles']})
    except:
        return jsonify({"response": []})


@app.route('/api/country', methods=['POST'])
def search_country():
    query = 'country : *'
    res = queryprocessor.search_general_field(query, {"rows": MAX_ROWS})
    for idx, i in enumerate(res['docs']):
        if 'text_en' in i and i["text_en"]:
            data = i["text_en"]
        elif 'text_hi' in i and i["text_hi"]:
            data = i["text_hi"]
        elif 'text_es' in i and i["text_es"]:
            data = i["text_es"]
        res['docs'][idx]["sentiments"] = analyze_sentiment(data)
    return jsonify({'response': res})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
