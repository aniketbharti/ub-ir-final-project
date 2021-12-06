import re
from googletrans import Translator
from loader import Loader
from solr import Solr
import json

run_config = "/home/ubuntu/IRProject/Project4/server/config/solr.config.json"
translator = Translator()


class Indexer:
    def __init__(self) -> None:
        self.run_config = self.read_file(run_config)
        if self.run_config["indexer"] == "BM25":
            self.core = Solr(
                "BM25_CORE", "/home/ubuntu/IRProject/Project4/server/config/config_bm25.json", self.run_config["dropcreatecore"], self.run_config["params"])
        else:
            self.core = Solr("VSM_CORE", "/home/ubuntu/IRProject/Project4/server/config/config_vsm.json",
                             self.run_config["dropcreatecore"], self.run_config["params"])
        if self.run_config["resetindexer"]:
            self.core.replace_indexer_schema()
        if self.run_config["uploaddata"]:
            self.load_data()
        self.search = lambda search_query, lang_boost: self.core.search(
            search_query, lang_boost).raw_response['response']

    def load_data(self):
        dataloader = Loader()
        data = dataloader.load_data()
        self.core.create_documents(data)

    def read_file(self, filename):
        data = None
        with open(filename, "r") as json_file:
            data = json.load(json_file)
        return data


indexer = Indexer()
