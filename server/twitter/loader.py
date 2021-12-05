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
            data = self.file_read_write(f, "rb")
            listdata.extend(data)
        return listdata

    def file_read_write(path, mode, data=None):
        if mode == "wb":
            with open(path, mode) as output_file:
                pickle.dump(data, output_file)
        else:
            with open(path, mode) as output_file:
                data = pickle.load(output_file)
            return data
