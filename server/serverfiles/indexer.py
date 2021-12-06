import re
from googletrans import Translator
from loader import Loader
from solr import Solr
import json

run_config = "../config/solr.config.json"
translator = Translator()


class Indexer:
    def __init__(self) -> None:
        self.run_config = self.read_file(run_config)
        if self.run_config["indexer"] == "BM25":
            self.core = Solr(
                "BM25_CORE", "../config/config_bm25.json", self.run_config["dropcreatecore"], self.run_config["params"])
        else:
            self.core = Solr("VSM_CORE", "../config/config_vsm.json",
                             self.run_config["dropcreatecore"], self.run_config["params"])
        if self.run_config["resetindexer"]:
            self.core.replace_indexer_schema()
        if self.run_config["uploaddata"]:
            self.load_data()

    def load_data(self):
        dataloader = Loader()
        data = dataloader.load_data()
        self.core.create_documents(data)

    def read_file(self, filename):
        data = None
        with open(filename, "r") as json_file:
            data = json.load(json_file)
        return data

    def query_processing(self, query):
        q = translator.detect(query)
        hashtags = re.findall(r'(?i)\#\w+', query)
        hashtags = [i[1:] for i in hashtags]
        lang = q.lang
        lang = "en" if lang not in ["en", "hi", "es"] else lang
        search_query = self.get_search(query, lang)
        lang_boost = self.get_weights(lang, 0)
        lang_boost_v = self.get_weights(
            lang, 1)
        if(len(hashtags) > 0):
            search_query = search_query + ' or ' + \
                'tweet_hashtags :' + str(hashtags)
            lang_boost = lang_boost + " tweet_hashtags^3"
            lang_boost_v = lang_boost_v + " tweet_hashtags^3"
        res = self.core.search(search_query, lang_boost).raw_response['response']
        data_list = []
        for doc in res['docs']:
            print(doc)
            data_list.append(doc)
        return data_list

    def get_weights(self, lang, model):
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

    def get_search(self, query, lang):
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
