
from newsapi import NewsApiClient


class News:
    def __init__(self) -> None:
        self.newsapi = NewsApiClient(
            api_key='1f9f0090bb384446b52e3ad399ac24cf')

    def get_new(self, text):
        all_articles = self.newsapi.get_everything(q=text,
                                                   language='en',
                                                   sort_by='relevancy',
                                                   page=1)
        return all_articles
