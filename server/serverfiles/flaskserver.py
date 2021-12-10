from flask import Flask, request, jsonify
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from queryprocessor import queryprocessor
from news import News
from flask_cors import CORS
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lex_rank import LexRankSummarizer

MAX_ROWS = 25000

app = Flask(__name__)
cors = CORS(app)
sia = SentimentIntensityAnalyzer()
newsdata = News()
summarizer = LexRankSummarizer()


pois_list = [
    'alefrausto',
    'ArvindKejriwal',
    'asadowaisi',
    'BarackObama',
    'CDCgov',
    'ChiPublicHealth',
    'Claudiashein',
    'DougDucey',
    'DrArwady',
    'drharshvardhan',
    'EPN',
    'RahulGandhi',
    'SatyendarJain',
    'SSalud'
]


@app.route('/api/search', methods=['POST'])
def search_query():
    query = request.json['query']
    result = queryprocessor.language_wt_query_processing(query)
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
    result = []
    for idx, i in enumerate(pois_list):
        queries = "poi_name : " + i
        res = queryprocessor.search_general_field(queries, {
            "qf": "poi_name^3",
            "pf": "poi_name^3"
        })
        result.extend(res["docs"])
    for idx, i in enumerate(result):
        if 'text_en' in i and i["text_en"]:
            data = i["text_en"]
        elif 'text_hi' in i and i["text_hi"]:
            data = i["text_hi"]
        elif 'text_es' in i and i["text_es"]:
            data = i["text_es"]
        result[idx]["sentiments"] = analyze_sentiment(data)
    return jsonify({'response': result})


@app.route('/api/getnews', methods=['POST'])
def getnews():
    query = request.json['query']
    news = newsdata.get_new(query)
    for idx, i in enumerate(news['articles']):
        news['articles'][idx]["sentiments"] = analyze_sentiment(i['description'])
    return jsonify({"response": news})


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
