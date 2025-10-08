from pydantic import HttpUrl
from app.shared.models.html import DOMTree
from app.shared.models.scrape import RetrievalInstruction, ScrapeConfig
from app.shared.models.scrape import ScrapedDataset
from app.shared.data.scraped_data import get_scraped_data

from scrapegoat import HTMLNode, Sheepdog, Shepherd

sheepdog = Sheepdog()
shepherd = Shepherd()


def build_dom_tree(url: HttpUrl) -> DOMTree:
    tree_root = __get_tree_root(str(url))
    return DOMTree(url=url, root=tree_root)


def scrape(config: ScrapeConfig) -> ScrapedDataset:
    tree_root = __get_tree_root(str(config.url))
    query = __build_goatspeek_query(config.retrieval_instructions)
    print(tree_root)
    print(query)
    return get_scraped_data(config.url)


def __get_tree_root(url: str) -> HTMLNode:
    seed = sheepdog.fetch(str(url))
    return shepherd.sow(seed)


def __build_goatspeek_query(instructions: list[RetrievalInstruction]) -> str:
    query = ""

    print(instructions)

    return query
