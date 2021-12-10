import json
import pickle
from bson import json_util


class UtilityClass:
    def __init__(self) -> None:
        pass

    @staticmethod
    def read_json_file(filename):
        data = None
        with open(filename, "r") as json_file:
            data = json.load(json_file)
        return data

    @staticmethod
    def file_read_write(path, mode, data=None):
        if mode == "wb":
            with open(path, mode) as output_file:
                pickle.dump(data, output_file)
        else:
            with open(path, mode) as output_file:
                data = pickle.load(output_file)
            return data

    @staticmethod
    def read_write_json(operation, filepath, data):
        if operation == 'read':
            with open(filepath, "r", encoding='utf-8') as json_file:
                data = json.load(json_file)
        else:
            with open(filepath, "w",  encoding='utf-8') as json_file:
                json.dump(data, json_file, default=json_util.default,
                          ensure_ascii=False)
        return data

