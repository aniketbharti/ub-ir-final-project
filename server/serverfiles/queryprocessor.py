import re
from googletrans import Translator
from loader import Loader
from utility import UtilityClass
from solr import solr

run_config = "/home/ubuntu/IRProject/Project4/server/config/solr.config.json"
translator = Translator()

run_config = "/home/ubuntu/IRProject/Project4/server/config/solr.config.json"


class QueryProcessor:
    def __init__(self) -> None:
        self.run_config = UtilityClass.read_json_file(run_config)
        if self.run_config["uploaddata"]:
            Loader.load_data()
        self.search = lambda search_query, lang_boost: solr.search(
            search_query, lang_boost).raw_response['response']

    def language_wt_query_processing(self, query):
        q = translator.detect(query)
        hashtags = re.findall(r'(?i)\#\w+', query)
        hashtags = [i[1:] for i in hashtags]
        lang = q.lang
        lang = "en" if lang not in ["en", "hi", "es"] else lang
        search_query = self.get_lang_wt_search(query, lang)
        lang_boost = self.get_wt_weights(lang, 0)
        lang_boost_v = self.get_wt_weights(
            lang, 1)
        if(len(hashtags) > 0):
            search_query = search_query + ' or ' + \
                'tweet_hashtags :' + str(hashtags)
            lang_boost = lang_boost + " tweet_hashtags^3"
            lang_boost_v = lang_boost_v + " tweet_hashtags^3"
        res = self.search(
            search_query, {
                "qf": "text_en text_hi text_es tweet_hashtags",
                "pf": lang_boost,
                "defType": "dismax"
            })
        return res

    def get_wt_weights(self, lang, model):
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

    def get_lang_wt_search(self, query, lang):
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

    def search_general_field(self, query, params):
        res = self.search(query, params)
        return res


queryprocessor = QueryProcessor()
