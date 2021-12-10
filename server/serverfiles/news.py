
import requests


class News:
    def __init__(self) -> None:
        self.token = '&token=1f9f0090bb384446b52e3ad399ac24cf&lang=en'
        self.url = 'https://gnews.io/api/v4/search?q='

    def get_new(self, text):
        url = self.url + text + self.token
        r = requests.get(url)
        return r.json()
