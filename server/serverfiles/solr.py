import os
import pysolr
import requests
from utility import UtilityClass

AWS_IP = '3.142.153.198'

schema = "../config/solr.schema.json"
run_config = "../config/solr.config.json"
solr_setting_config = "../config/config_solr_setting.json"


class Solr:
    def __init__(self) -> None:
        self.solr_url = f'http://{AWS_IP}:8983/solr/'
        self.data_schema = UtilityClass.read_json_file(schema)
        self.run_config = UtilityClass.read_json_file(run_config)
        self.solr_setting_config = UtilityClass.read_json_file(
            solr_setting_config)
        self.dropcreatecore = self.run_config['dropcreatecore']
        if self.run_config['indexer'] == 'BM25':
            self.core_name = 'BM25_CORE'
            ir_model_schema = self.solr_setting_config['bm25']
        else:
            self.core_name = 'VSM_CORE'
            ir_model_schema = self.solr_setting_config['vsm']
        self.connection = pysolr.Solr(
            self.solr_url + self.core_name, always_commit=True, timeout=5000000)

        self.params_config = self.run_config["params"]
        self.b = "0.75"
        self.k = "1.2"
        if self.dropcreatecore:
            self.do_initial_setup()
            self.replace_indexer_schema(ir_model_schema)
        if self.run_config["resetindexer"]:
            self.replace_indexer_schema(ir_model_schema)

    def search(self, query, lang_boast):
        if lang_boast:
            lang_boast["fl"] = self.params_config["fl"]
            if "rows" not in lang_boast:
                lang_boast["rows"] = self.params_config["rows"]
        return self.connection.search(query, **lang_boast)

    def get_trending_topic(self):
        pass

    def add_fields(self):
        if self.data_schema:
            req = requests.post(self.solr_url +
                                self.core_name + "/schema", json=self.data_schema)
            print("Add Fields : " + self.core_name + " ", req)

    def do_initial_setup(self) -> None:
        self.delete_core()
        self.create_core()
        self.add_fields()

    def replace_indexer_schema(self, ir_model_schema) -> None:
        if self.core_name == "BM25":
            for idx, list_data in enumerate(self.ir_model_schema["replace-field-type"]):
                similarity = list_data["similarity"]
                if similarity and "b" in similarity:
                    ir_model_schema["replace-field-type"][idx]["similarity"]["b"] = self.b
                if similarity and "k1" in similarity:
                    ir_model_schema["replace-field-type"][idx]["similarity"]["k1"] = self.k
        req = requests.post(self.solr_url + self.core_name +
                            "/schema", json=ir_model_schema)
        print("Indexer Statergy Change : " + self.core_name + " ", req)

    def replace_auto_suggest(self, searchcomponent, handler) -> None:
        req = requests.post(self.solr_url + self.core_name +
                            "/config", json=searchcomponent)
        print("Search Componet : ", req.content)
        req = requests.post(self.solr_url + self.core_name +
                            "/config", json=handler)
        print("Request  : ", req)

    def create_documents(self, docs):
        print(self.connection.add(docs))

    def create_core(self) -> None:
        print(os.system(
            'sudo su - solr -c "/opt/solr/bin/solr create -c {core} -n data_driven_schema_configs"'.format(
                core=self.core_name)))

    def delete_core(self) -> None:
        print(os.system(
            'sudo su - solr -c "/opt/solr/bin/solr delete -c {core}"'.format(core="VSM_CORE")))
        print(os.system(
            'sudo su - solr -c "/opt/solr/bin/solr delete -c {core}"'.format(core="BM25_CORE")))

    def move_synomyns_file(self) -> None:
        if self.core_name == "VSM_CORE":
            print("Synonyms", os.system(
                'sudo cp "./wordnet/synonyms.txt" "/var/solr/data/VSM_CORE/conf"'))
        else:
            print("Synonyms", os.system(
                'sudo cp "./wordnet/synonyms.txt" "/var/solr/data/BM25_CORE/conf"'))


solr = Solr()
