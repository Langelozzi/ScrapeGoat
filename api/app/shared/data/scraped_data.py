import datetime

from pydantic import HttpUrl
from app.shared.models.scrape import ScrapedDataset


def get_scraped_data(url: HttpUrl):
    return ScrapedDataset(
        url=url,
        data=[{"name": "Jerome", "age": 42, "occupation": "Dentist"}],
        createdAt=datetime.datetime.now(),
    )


print("hello")
