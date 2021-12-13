import pickle
from nltk.stem import PorterStemmer
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from sklearn.decomposition import LatentDirichletAllocation
from sklearn.feature_extraction.text import CountVectorizer
import pandas as pd
import numpy as np

nltk.download('stopwords')

ps = PorterStemmer()

train = True
model_path = "/home/ubuntu/IRProject/Project4/server/data/model/lda_model.pk"


class TopicModeling:
    def __init__(self, filename) -> None:
        if train:
            self.df = pd.read_csv(filename)
            self.number_of_topics = 10
            self.model = LatentDirichletAllocation(
                n_components=self.number_of_topics, random_state=0)
            self.df['clean_tweet'] = self.df.tweet.apply(self.preprocess)
        else:
            self.model = pickle.load('lda_model.pk')

    def preprocess(self, data):
        lower = data.lower()
        token = word_tokenize(lower)
        tokens_without_sw = [
            ps.stem(word) for word in token if not word in stopwords.words()]
        return' '.join(tokens_without_sw)

    def train(self) -> None:
        vectorizer = CountVectorizer(
            max_df=0.9, min_df=25, token_pattern='\w+|\$[\d\.]+|\S+')
        tf = vectorizer.fit_transform(self.df['clean_tweet']).toarray()
        tf_feature_names = vectorizer.get_feature_names()
        self.model.fit(tf)
        doc_topic = self.model.transform(tf)
        for n in range(doc_topic.shape[0]):
            topic_most_pr = doc_topic[n].argmax()
            print("doc: {} topic: {}\n".format(n, topic_most_pr))
        topic_words = {}
        for topic, comp in enumerate(self.model.components_):
            word_idx = np.argsort(comp)[::-1][:10]
            # store the words most relevant to the topic
            topic_words[topic] = [tf_feature_names[i] for i in word_idx]
        
        pickle.dump(self.model, open(model_path, 'wb'))
        print(topic_words)

    def predict(self, data):
        data = self.preprocess(data)
        vectorizer = CountVectorizer(
            max_df=0.9, min_df=25, token_pattern='\w+|\$[\d\.]+|\S+')
        tf = vectorizer.fit_transform().toarray()
        tf_feature_names = vectorizer.get_feature_names()
        self.model.predict(tf)
        doc_topic = self.model.transform(tf)
        for n in range(doc_topic.shape[0]):
            topic_most_pr = doc_topic[n].argmax()
            print("doc: {} topic: {}\n".format(n, topic_most_pr))
        topic_words = {}
        for topic, comp in enumerate(self.model.components_):
            word_idx = np.argsort(comp)[::-1][:10]
            topic_words[topic] = [tf_feature_names[i] for i in word_idx]


a = TopicModeling('../data/model/text.csv')
a.train()
