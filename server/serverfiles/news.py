from GoogleNews import GoogleNews


class News:
    def __init__(self) -> None:
        self.googlenews = GoogleNews()

    def get_new(self, text):
        self.googlenews.search(text)
        self.googlenews.clear()
        self.googlenews.getpage(2)
        result = self.googlenews.result()
        return result
