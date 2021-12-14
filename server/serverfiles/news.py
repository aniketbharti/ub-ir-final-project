
from newsapi import NewsApiClient


class News:
    def __init__(self) -> None:
        self.newsapi = NewsApiClient(
            api_key='c5282ff9e9a548cfb680258fd1a9220f')

    def get_new(self, text):
        all_articles = self.newsapi.get_everything(q=text,
                                                   language='en',
                                                   sort_by='relevancy',
                                                   page=1)
        return all_articles
