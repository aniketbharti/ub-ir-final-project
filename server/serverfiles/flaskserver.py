from flask import Flask, request, jsonify
from indexer import indexer
from googletrans import Translator
import re

app = Flask(__name__)
translator = Translator()

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
    'GobAgs',
    'GovKathyHochul',
    'GovRonDeSantis',
    'HHSGov',
    'HLGatell',
    'JACVillalobos',
    'jefafabiana',
    'JoeBiden',
    'JoseNarroR',
    'KathyHochul',
    'LaydaSansores',
    'lopezobrador_',
    'm_ebrard',
    'MamataOfficial',
    'mansukhmandviya',
    'MaruCampos_G',
    'MoHFW_INDIA',
    'myogiadityanath',
    'narendramodi',
    'NewYorkStateAG',
    'NIHDirector',
    'NYGovCuomo',
    'OfficeofUT',
    'PhilMurphyNJ',
    'RahulGandhi',
    'rajeshtope11',
    'RashidaTlaib',
    'sambitswaraj',
    'SatyendarJain',
    'SenTedCruz',
    'ShashiTharoor',
    'SSalud_mx',
    'trvrb',
    'VicenteFoxQue',
    'vijayanpinarayi',
    'XavierBecerra',
    'ArvindKejriwal',
    'BarackObama',
    'CDCgov',
    'drharshvardhan',
    'EPN',
    'HHSGov',
    'HLGatell',
    'GovRonDeSantis',
    'GobAgs',
    'JACVillalobos',
    'jefafabiana',
    'JoeBiden',
    'johnson',
    'JoseNarroR',
    'lopezobrador',
    'MamataOfficial',
    'MoHFW',
    'NIHDirector',
    'narendramodi',
    'myogiadityanath',
    'NYGovCuomo',
    'PhilMurphyNJ',
    'RahulGandhi',
    'SatyendarJain',
    'SSalud'
]


@app.route('/search', methods=['POST'])
def search_query():
    query = request.json['query']
    result = query_processing(query)
    return jsonify({'response': result})




@app.route('/pois', methods=['POST'])
def search_pois():
    queries = "poi_name : ("
    for idx, i in enumerate(pois_list):
        queries = queries + ' ' + i
        if (idx != len(pois_list) - 1):
            queries = queries + ' or '
    queries = queries + ' ) '
    result = indexer.search(queries, {
        "qf": "poi_name^3",
        "pf": "poi_name^3"
    })
    return jsonify({'response': result})

@app.route('/country', methods=['POST'])
def search_country():
    queries = "country : ("
    country = ["India", "USA", "Mexico"]
    for idx, i in enumerate(country):
        queries = queries + ' ' + i
        if (idx != len(country) - 1):
            queries = queries + ' or '
    queries = queries + ' ) '
    result = indexer.search(queries, {
        "qf": "country^3",
        "pf": "country^3"
    })
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
