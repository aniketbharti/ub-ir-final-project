from flask import Flask, request, jsonify
from indexer import indexer
from googletrans import Translator
import re
from news import News
# from sentimentanalysis import SentimentAnalysis
from flask_cors import CORS
from nltk.sentiment import SentimentIntensityAnalyzer
app = Flask(__name__)
cors = CORS(app)

translator = Translator()
# sentimentanlysis = SentimentAnalysis()
newsdata = News()

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
    result = query_processing(query)
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
    sia = SentimentIntensityAnalyzer()
    return sia.polarity_scores(text)


@app.route('/api/pois', methods=['POST'])
def search_pois():
    result = []
    for idx, i in enumerate(pois_list):
        queries = "poi_name : " + i
        res = indexer.search(queries, {
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
    for idx, i in enumerate(news):
        news[idx]["sentiments"] = analyze_sentiment(i['desc'])
    return jsonify({"response": news})


@app.route('/api/country', methods=['POST'])
def search_country():
    result = []
    country = ["India", "USA", "Mexico"]
    for idx, i in enumerate(country):
        queries = "country : " + i
        res = indexer.search(queries, {
            "qf": "country^3",
            "pf": "country^3",
            "rows": 10000
        })
        result.extend(res['docs'])

    for idx, i in enumerate(result):
        if 'text_en' in i and i["text_en"]:
            data = i["text_en"]
        elif 'text_hi' in i and i["text_hi"]:
            data = i["text_hi"]
        elif 'text_es' in i and i["text_es"]:
            data = i["text_es"]
        result[idx]["sentiments"] = analyze_sentiment(data)

    return jsonify({'response': result})


def query_processing(query):
    q = translator.detect(query)
    hashtags = re.findall(r'(?i)\#\w+', query)
    hashtags = [i[1:] for i in hashtags]
    lang = q.lang
    lang = "en" if lang not in ["en", "hi", "es"] else lang
    search_query = get_search(query, lang)
    lang_boost = get_weights(lang, 0)
    lang_boost_v = get_weights(
        lang, 1)
    if(len(hashtags) > 0):
        search_query = search_query + ' or ' + \
            'tweet_hashtags :' + str(hashtags)
        lang_boost = lang_boost + " tweet_hashtags^3"
        lang_boost_v = lang_boost_v + " tweet_hashtags^3"
    res = indexer.search(
        search_query, {
            "qf": "text_en text_de text_ru tweet_hashtags",
            "pf": lang_boost
        })
    return res


def get_weights(lang, model):
    language = {
        "en": [("text_en", (3, 1.5)), ("text_hi", (2.5, 0.2)), ("text_es", (2, 1.2))],
        "hi": [("text_hi", (3, 1.5)), ("text_en", (2.5, 1.2)), ("text_es", (2, 0.2))],
        "es": [("text_es", (3, 1.5)), ("text_en", (2.5, 1.2)), ("text_hi", (2, 0.2))],
    }
    data = language[lang]
    initial = data.pop(0)
    stringdata = initial[0] + '^' + str(initial[1][model])
    for idx, i in enumerate(data):
        stringdata = stringdata + " " + i[0] + "^" + str(i[1][model])
    return stringdata


def get_search(query, lang):
    language = {
        "en": [("text_en", (3, 3), "en"), ("text_hi", (3, 1.5), "hi"), ("text_es", (3, 2), "es")],
        "es": [("text_es", (3, 3), "es"), ("text_en", (3, 2), "en"), ("text_hi", (3, 1.5), "hi")],
        "hi": [("text_hi", (3, 3), "hi"), ("text_en", (3, 2), "en"), ("text_es", (3, 1.5), "de")],
    }
    data = language[lang]
    initial = data.pop(0)
    indata = initial[0] + " : " + str(query)
    for idx, i in enumerate(data):
        try:
            indata = indata + " or " + i[0] + \
                " : " + str(translator.translate(query, dest=i[2]).text)
        except:
            indata = indata + " or " + i[0] + " : " + str(query)
    return indata


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
