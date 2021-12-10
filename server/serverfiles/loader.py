import glob
import os
import pickle
from solr import solr
import string
import numpy as np
import random
import preprocessor as p
p.set_options(p.OPT.MENTION, p.OPT.URL)

path = "../data/pickle"
custom_edit = True
table = str.maketrans(dict.fromkeys(string.punctuation))
retweet_count_idx = np.random.choice(300, 50)
favorite_count_idx = np.random.choice(300, 20)


class Loader:
    def __init__(self) -> None:
        pass

    @staticmethod
    def load_data():
        filelist = glob.glob(os.path.join(path, "*"))
        listdata = []
        for idx, f in enumerate(filelist):
            data = Loader.file_read_write(f)
            if custom_edit:
                keyword = f.split('_')[1].replace('.pkl', '')
                new_list = []
                if(len(data) > 480):
                    for d in data:
                        if 'text_es' in d:
                            d['related_keyword'] = keyword
                            if 'text_hi' in d:
                                d['text_hi'] = p.clean(
                                    d['text_hi']).translate(table)
                            elif 'text_en' in d:
                                d['text_en'] = p.clean(
                                    d['text_en']).translate(table)
                            elif 'text_es':
                                d['text_es'] = p.clean(
                                    d['text_es']).translate(table)
                            if idx in retweet_count_idx:
                                d['retweet_count'] = random.randint(3, 25)
                            else:
                                d['retweet_count'] = 0
                            if idx in favorite_count_idx:
                                d['favorite_count'] = random.randint(3, 25)
                            else:
                                d['favorite_count'] = 0
                            new_list.append(d)
                            if(len(new_list) > 200):
                                break
            listdata.extend(new_list)

        if len(listdata) > 0:
            print(len(listdata))
            solr.create_documents(listdata)

    @staticmethod
    def file_read_write(path):
        data = None
        with open(path, "rb") as output_file:
            data = pickle.load(
                output_file, fix_imports=True, encoding="latin1")
        return data
