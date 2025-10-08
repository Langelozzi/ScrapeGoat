from pydantic import HttpUrl
from app.shared.models.html import DOMTree
from app.shared.models.scrape import ScrapeConfig
from app.shared.models.scrape import ScrapedDataset
from app.shared.data.scraped_data import get_scraped_data

from scrapegoat import Sheepdog, Shepherd


def build_dom_tree(url: HttpUrl) -> DOMTree:
    sheepdog = Sheepdog()
    seed = sheepdog.fetch(str(url))

    shepherd = Shepherd()
    tree_root = shepherd.sow(seed)

    return DOMTree(url=url, root=tree_root)


def scrape(config: ScrapeConfig) -> ScrapedDataset:
    return get_scraped_data(config.url)
