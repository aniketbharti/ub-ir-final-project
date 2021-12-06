# #Import Packages
# import pandas as pd
# import matplotlib.pyplot as plt
# import seaborn as sns
# import warnings
# warnings.filterwarnings('ignore')
# !pip install neattext
# import neattext.functions as nfx
# !pip install textblob
# from collections import Counter
# !pip install wordcloud
# from wordcloud import WordCloud


# #Load Dataset
# #Dataset Source: https://github.com/gabrielpreda/covid-19-tweets
# def load_dataset():
#   return pd.read_csv("covid19_tweets.csv")

# def dataset_analysis():
#   #Tweets Datatypes
#   print("Data Types:")
#   print(dataset.dtypes)

#   #print(dataset['source'].unique())
#   print()
#   print("Source Count:")
#   print(dataset['source'].value_counts())

#   #plot top value_counts
#   print()
#   plt.figure(figsize = (20, 10))
#   dataset['source'].value_counts().nlargest(30).plot(kind = 'bar')
#   plt.xticks(rotation = 45)
#   plt.show()


# def text_preprocessing():
#   #print(dir(nfx))
#   #Remove All the Hashtags, Mentions, Spaces, URL's, Punctuations
#   dataset['clean_tweet'] = dataset['text'].apply(nfx.remove_hashtags).apply( lambda x: nfx.remove_userhandles(x)).apply(nfx.remove_multiple_spaces).apply(nfx.remove_urls).apply(nfx.remove_puncts)
#   #print(dataset[['text', 'clean_tweet']])

# def sentiment_analysis(text):
#   blob = TextBlob(text).sentiment
#   sentiment_polarity = blob.polarity
#   sentiment_subjectivity = blob.subjectivity
#   if sentiment_polarity > 0:
#     sentiment_label = 'Positive'
#   elif sentiment_polarity < 0:
#     sentiment_label = 'Negative'
#   else:
#     sentiment_label = 'Neutral'
#   result = {'polarity': sentiment_polarity, 'subjectivity':sentiment_subjectivity, 'sentiment':sentiment_label}
#   return result

# def tokenize(tweets):
#   return [token for line in tweets for token in line.split()]

# def get_tokens(tokens, num = 30):
#   word_tokens = Counter(tokens)
#   common = word_tokens.most_common(num)
#   return dict(common)

# def plot_graph(df, title):
#   plt.figure(figsize = (20, 10))
#   plt.title(title)
#   sns.barplot(x = 'words', y = 'scores', data = df)
#   plt.xticks(rotation = 45)
#   plt.show()

# def plot_word_cloud(df, title):
#   word_cloud = WordCloud().generate(df)
#   plt.title(title)
#   plt.imshow(word_cloud, interpolation = 'bilinear')
#   plt.axis('off')
#   plt.show()

# def keyword_extraction(df):
#   #Remove Stopwords and create a list of positive, negative and neutral tweets
#   positive_tweets_list = df[df['sentiment'] == 'Positive']['clean_tweet'].apply(nfx.remove_stopwords).tolist()
#   negative_tweets_list = df[df['sentiment'] == 'Negative']['clean_tweet'].apply(nfx.remove_stopwords).tolist()
#   neutral_tweets_list = df[df['sentiment'] == 'Neutral']['clean_tweet'].apply(nfx.remove_stopwords).tolist()

#   #Perform Tokenization positive, negative and neutral tweets
#   positive_tokens = tokenize(positive_tweets_list)
#   negative_tokens = tokenize(negative_tweets_list)
#   neutral_tokens = tokenize(neutral_tweets_list)

#   #Get Coomon wordrals for Positive, Negative and Neutral tweets
#   pos_common_words = pd.DataFrame(get_tokens(positive_tokens).items(), columns = ['words', 'scores'])
#   neg_common_words = pd.DataFrame(get_tokens(negative_tokens).items(), columns = ['words', 'scores'])
#   neu_common_words = pd.DataFrame(get_tokens(neutral_tokens).items(), columns = ['words', 'scores'])

#   plot_graph(pos_common_words, "Positive Common Words")
#   plot_graph(neg_common_words, "Negative Common Words")
#   plot_graph(neu_common_words, "Neutral Common Words")

#   pos_df = ' '.join(positive_tokens)
#   neg_df = ' '.join(negative_tokens)
#   neu_df = ' '.join(neutral_tokens)

#   plot_word_cloud(pos_df, "Positive Word Cloud")
#   plot_word_cloud(neg_df, "Negative Word Cloud")
#   plot_word_cloud(neu_df, "Neutral Word Cloud")

# def start_prog():
#   #Text Preprocessing
#   text_preprocessing()
#   #Sentiment Analysis
#   df = dataset.join(pd.json_normalize(dataset['clean_tweet'].apply(sentiment_analysis)))
#   #df['sentiment'].value_counts()
#   #df['sentiment'].value_counts().plot(kind = 'bar')
#   sns.countplot(df['sentiment'])
#   keyword_extraction(df)
#   #Entity Extraction

# #Load Dataset
# dataset = load_dataset()
# dataset_analysis()
# #start_prog()

from textblob import TextBlob
import neattext.functions as nfx


class SentimentAnalysis:
    def __init__(self) -> None:
        pass

    def text_preprocessing(self, text):
        return text.apply(nfx.remove_hashtags).apply(lambda x: nfx.remove_userhandles(x)).apply(nfx.remove_multiple_spaces).apply(nfx.remove_urls).apply(nfx.remove_puncts)

    def sentiment_analysis(self, text):
        blob = TextBlob(text).sentiment
        sentiment_polarity = blob.polarity
        sentiment_subjectivity = blob.subjectivity
        if sentiment_polarity > 0:
            sentiment_label = 'Positive'
        elif sentiment_polarity < 0:
            sentiment_label = 'Negative'
        else:
            sentiment_label = 'Neutral'
        result = {'polarity': sentiment_polarity,
                  'subjectivity': sentiment_subjectivity, 'sentiment': sentiment_label}
        return result
