import re
from flask import Flask, request, jsonify
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from queryprocessor import queryprocessor
from news import News
from flask_cors import CORS
import matplotlib.pyplot as plt
from wordcloud import WordCloud
# from TopicModeling import TopicModeling


MAX_ROWS = 30000

app = Flask(__name__, static_url_path="/static")
cors = CORS(app)
sia = SentimentIntensityAnalyzer()
newsdata = News()
# topic = TopicModeling()


@app.route('/api/search', methods=['POST'])
def search_query():
    query = request.json['query']
    result = queryprocessor.language_wt_query_processing(query)
    temp_string = ""
    for idx, i in enumerate(result["docs"]):
        replies = queryprocessor.search_general_field(
            "replied_to_tweet_id :" + i['id'], {"rows": MAX_ROWS})
        if len(replies['docs']) > 0:
            for reply in replies['docs']:
                data, lang = get_data_for_sentiment_anlysis(reply)
                reply['sentiments'], reply['sentiments_text'] = analyze_sentiment(
                    data)
        result["docs"][idx]['replies'] = replies['docs']
        result["docs"][idx]['noofreplies'] = len(replies['docs'])
        data, lang = get_data_for_sentiment_anlysis(i)
        result["docs"][idx]['sentiments'], result["docs"][idx]['sentiments_text'] = analyze_sentiment(
            data)
        if lang != 'Hindi':
            temp_string = temp_string + ' ' + re.sub('[^A-Za-z0-9]+', ' ', re.sub(
                r'^https?:\/\/.*[\r\n]*', '', re.sub('\s+', ' ', data), flags=re.MULTILINE))
    if len(temp_string) > 0:
        create_word_cloud(temp_string.split())
    return jsonify({'response': result})


def create_word_cloud(word_list):
    unique_string = (" ").join(word_list)
    wordcloud = WordCloud(background_color='white',
                          width=1000, height=500).generate(unique_string)
    image = "english_wordcloud"
    plt.figure(figsize=(15, 8))
    plt.imshow(wordcloud)
    plt.axis("off")
    plt.savefig("static/"+image+".png", bbox_inches='tight')
    plt.close()


def analyze_sentiment(text):
    try:
        sentiment = sia.polarity_scores(text)
        if sentiment['neu'] > 0.4 and sentiment['neu'] > sentiment['pos'] and sentiment['neu'] > sentiment['neg']:
            sentiment['neu'] = sentiment['neu'] - 0.3
            if sentiment['neg'] > sentiment['pos']:
                sentiment['neg'] += 0.3
            else:
                sentiment['pos'] += 0.3
        if (sentiment['neu'] >= sentiment['pos']) and (sentiment['neu'] >= sentiment['neg']):
            return sentiment, 'Neutral'
        elif (sentiment['pos'] >= sentiment['neu']) and (sentiment['pos'] >= sentiment['neg']):
            return sentiment, 'Positive'
        elif (sentiment['neg'] >= sentiment['pos']) and (sentiment['neg'] >= sentiment['neu']):
            return sentiment, 'Negative'
        return sentiment, 'Neutral'
    except:
        return {}, 'Positive'


@app.route('/api/global', methods=['GET'])
def opensearch():
    result = queryprocessor.search_general_field("*:*", {"rows": MAX_ROWS})
    temp_string = ''
    for idx, i in enumerate(result["docs"]):
        data  = get_data_for_sentiment_anlysis(i)
        if data:
            result["docs"][idx]['sentiments'], result["docs"][idx]['sentiments_text'] = analyze_sentiment(
                data[0])
            if result["docs"][idx]['sentiments_text'] != 'Hindi':
                temp_string = temp_string + ' ' + re.sub('[^A-Za-z0-9]+', ' ', re.sub(
                    r'^https?:\/\/.*[\r\n]*', '', re.sub('\s+', ' ', data[0]), flags=re.MULTILINE))
    return jsonify({'response': result})


def get_data_for_sentiment_anlysis(data):
    if 'text_en' in data and data["text_en"]:
        return data["text_en"], "English"
    elif 'text_hi' in data and data["text_hi"]:
        return data["text_hi"], "Hindi"
    elif 'text_es' in data and data["text_es"]:
        return data["text_es"], "Spanish"


@app.route('/api/getnews', methods=['POST'])
def getnews():
    try:
        query = request.json['query']
        news = newsdata.get_new(query)
        for idx, i in enumerate(news['articles']):
            news['articles'][idx]["sentiments"], news['articles'][idx]['sentiments_text'] = analyze_sentiment(
                i['description'])

        return jsonify({"response": news['articles']})
    except:
        return jsonify({"response": []})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
