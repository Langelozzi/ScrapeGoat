from pydantic import HttpUrl
from app.shared.data.tree import get_mock_dom_tree
from app.shared.models.html import ScrapeGoatDOMTree
from app.shared.models.scrape import ScrapeConfig
from app.shared.models.scrape import ScrapedDataset
from app.shared.data.scraped_data import get_scraped_data


def build_dom_tree(url: HttpUrl) -> ScrapeGoatDOMTree:
    return get_mock_dom_tree(url)


def scrape(config: ScrapeConfig) -> ScrapedDataset:
    return get_scraped_data(config.url)
