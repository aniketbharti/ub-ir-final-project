
import requests


class News:
    def __init__(self) -> None:
        self.token = '&token=b57d7a775aac393f0c40b1af31c71a57'
        self.url = 'https://gnews.io/api/v4/search?q='

    def get_new(self, text):
        url = self.url + text + self.token
        r = requests.get(url)
        return r.json()
