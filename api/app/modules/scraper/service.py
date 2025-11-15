from pydantic import HttpUrl
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.configs.service import get_config
from app.shared.helpers.dict_helpers import rename_key
from app.shared.models.html import DOMTree
from app.shared.models.scrape import NodeOutput, RetrievalInstruction, ScrapeConfig
from app.shared.models.scrape import ScrapedDataset

from scrapegoat import HTMLNode, Sheepdog, Shepherd, Gardener

sheepdog = Sheepdog()
shepherd = Shepherd()
gardener = Gardener()


def build_dom_tree(url: HttpUrl) -> DOMTree:
    tree_root = __get_tree_root(str(url))
    return DOMTree(url=url, root=tree_root)


def scrape(config: ScrapeConfig) -> ScrapedDataset:
    tree_root = __get_tree_root(str(config.url))

    results = []
    for instruction in config.retrieval_instructions:
        data = __scrape_single(tree_root, instruction)
        results.extend(data)

    return ScrapedDataset(url=config.url, data=results)


async def scrape_existing(db: AsyncSession, config_id: str) -> ScrapedDataset:
    config = await get_config(db, config_id)
    if not config:
        raise Exception(f"No config found with id '{config_id}'")
    scrape_config = ScrapeConfig.from_db_model(config)
    return scrape(scrape_config)


### Private helper function ###
def __scrape_single(
    tree_root: HTMLNode, instruction: RetrievalInstruction
) -> list[dict]:
    query = __build_goatspeek_query(instruction)
    scraped_nodes = shepherd.herd_from_node(query=query, root=tree_root)
    raw_results = [node.to_dict() for node in scraped_nodes]
    mapped_results = __remap_dict_keys(raw_results, instruction.output)
    return mapped_results


def __get_tree_root(url: str) -> HTMLNode:
    seed = sheepdog.fetch(fetch_command=str(url))
    return gardener.grow_tree(raw_html=seed)


def __build_goatspeek_query(instruction: RetrievalInstruction) -> str:
    query = instruction.node_query
    extract_statement = __build_extract_statement_from_output(instruction.output)

    return f"{query}{extract_statement}"


def __build_extract_statement_from_output(output: NodeOutput) -> str:
    return f"EXTRACT {output.location};"


def __remap_dict_keys(raw_results: list[dict], output: NodeOutput) -> list[dict]:
    default_key = output.location
    new_key = output.key
    return [rename_key(res, default_key, new_key) for res in raw_results]
