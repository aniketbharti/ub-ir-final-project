import os
import pysolr
import json
import requests

AWS_IP = 'localhost'
schema = "../config/solr.schema.json"

class Solr:
    def __init__(self, core_name, ir_model_schema, dropcreatecore) -> None:
        self.solr_url = f'http://{AWS_IP}:8983/solr/'
        self.core_name = core_name
        self.data_schema = self.read_file(schema)
        self.ir_model_schema = self.read_file(ir_model_schema)
        self.connection = pysolr.Solr(
            self.solr_url + core_name, always_commit=True, timeout=5000000)
        self.dropcreatecore = dropcreatecore
        self.b = "0.75"
        self.k = "1.2"
        self.do_initial_setup()

    def add_fields(self):
        if self.data_schema:
            req = requests.post(self.solr_url +
                                self.core_name + "/schema", json=self.data_schema)
            print("Add Fields : " + self.core_name + " ", req)

    def read_file(self, filename):
        data = None
        with open(filename, "r") as json_file:
            data = json.load(json_file)
        return data

    def do_initial_setup(self) -> None:
        if self.dropcreatecore:
            self.delete_core()
            self.create_core()
            self.add_fields()

    def replace_indexer_schema(self) -> None:
        if self.ir_model_schema:
            if self.core_name == "BM25":
                for idx, list_data in enumerate(self.ir_model_schema["replace-field-type"]):
                    similarity = list_data["similarity"]
                    if similarity and "b" in similarity:
                        self.ir_model_schema["replace-field-type"][idx]["similarity"]["b"] = self.b
                    if similarity and "k1" in similarity:
                        self.ir_model_schema["replace-field-type"][idx]["similarity"]["k1"] = self.k
            req = requests.post(self.solr_url + self.core_name +
                                "/schema", json=self.ir_model_schema)
            print("Indexer Statergy Change : " + self.core_name + " ", req)

    def create_documents(self, docs):
        print(self.connection.add(docs))

    def create_core(self) -> None:
        print(os.system(
            'sudo su - solr -c "/opt/solr/bin/solr create -c {core} -n data_driven_schema_configs"'.format(
                core=self.core_name)))
        # self.move_synomyns_file()

    def delete_core(self) -> None:
        print(os.system(
            'sudo su - solr -c "/opt/solr/bin/solr delete -c {core}"'.format(core=self.core_name)))

    def move_synomyns_file(self) -> None:
        if self.core_name == "VSM_CORE":
            print("Synonyms", os.system(
                'sudo cp "./wordnet/synonyms.txt" "/var/solr/data/VSM_CORE/conf"'))
        else:
            print("Synonyms", os.system(
                'sudo cp "./wordnet/synonyms.txt" "/var/solr/data/BM25_CORE/conf"'))
