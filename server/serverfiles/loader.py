import glob
import os
import pickle


class Loader:
    def __init__(self) -> None:
        self.path = "../data/pickle"

    def load_data(self):
        filelist = glob.glob(os.path.join(self.path, "*"))
        listdata = []
        for f in filelist:
            data = self.file_read_write(f)
            listdata.extend(data)
        return listdata

    def file_read_write(self, path):
        data = None
        with open(path, "rb") as output_file:
            data = pickle.load(
                output_file, fix_imports=True, encoding="latin1")
        return data
