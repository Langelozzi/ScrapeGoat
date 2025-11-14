import pytest
from types import SimpleNamespace

from app.modules.scraper import service as scraper
from app.shared.models.scrape import RetrievalInstruction, NodeOutput, ScrapeConfig


def make_fake_node(value_key, value):
    class FakeNode:
        def to_dict(self):
            return {value_key: value}

    return FakeNode()


def test_build_goatspeek_query_and_extract_statement():
    out = NodeOutput(location="text", key="title")
    instr = RetrievalInstruction(node_query="SCRAPE 1 p IN POSITION 1;", output=out, flags={})

    stmt = scraper.__build_extract_statement_from_output(out)
    assert stmt == "EXTRACT text;"

    q = scraper.__build_goatspeek_query(instr)
    assert q == "SCRAPE 1 p IN POSITION 1;EXTRACT text;"


def test_remap_dict_keys_renames_keys():
    raw = [{"text": "hello"}, {"text": "world"}]
    out = NodeOutput(location="text", key="title")
    remapped = scraper.__remap_dict_keys(raw, out)
    assert all("title" in r and "text" not in r for r in remapped)
    assert remapped[0]["title"] == "hello"


def test_scrape_single_uses_shepherd_and_remaps(monkeypatch):
    out = NodeOutput(location="text", key="title")
    instr = RetrievalInstruction(node_query="SCRAPE 1 p IN POSITION 1;", output=out, flags={})

    # fake shepherd.herd_from_node should receive the built query and return nodes
    def fake_herd_from_node(query, root):
        assert query == "SCRAPE 1 p IN POSITION 1;EXTRACT text;"
        return [make_fake_node("text", "val1"), make_fake_node("text", "val2")]

    monkeypatch.setattr(scraper, "shepherd", SimpleNamespace(herd_from_node=fake_herd_from_node))

    fake_root = SimpleNamespace()
    results = scraper.__scrape_single(fake_root, instr) # type: ignore
    assert isinstance(results, list)
    assert results == [{"title": "val1"}, {"title": "val2"}]


def test_get_tree_root_calls_sheepdog_and_gardener(monkeypatch):
    # sheepdog.fetch should be called with fetch_command=str(url)
    def fake_fetch(fetch_command):
        assert fetch_command == "http://ex/"
        return "<html></html>"

    def fake_grow_tree(raw_html):
        assert raw_html == "<html></html>"
        return make_fake_node("text", "v")

    monkeypatch.setattr(scraper, "sheepdog", SimpleNamespace(fetch=fake_fetch))
    monkeypatch.setattr(scraper, "gardener", SimpleNamespace(grow_tree=fake_grow_tree))

    root = scraper.__get_tree_root("http://ex/")
    assert hasattr(root, "to_dict")


def test_scrape_aggregates_results(monkeypatch):
    # replace __get_tree_root and __scrape_single
    monkeypatch.setattr(scraper, "__get_tree_root", lambda url: "root")
    monkeypatch.setattr(scraper, "__scrape_single", lambda root, instr: [{"title": "x"}])

    cfg = ScrapeConfig(url="http://ex/", retrieval_instructions=[RetrievalInstruction(node_query="d", output=NodeOutput(location="text", key="title"), flags={})]) # type: ignore

    dataset = scraper.scrape(cfg)
    assert dataset.url == cfg.url
    assert dataset.data == [{"title": "x"}]


@pytest.mark.asyncio
async def test_scrape_existing_raises_when_no_config(monkeypatch):
    async def fake_get_config(db, id):
        return None

    monkeypatch.setattr(scraper, "get_config", fake_get_config)

    with pytest.raises(Exception):
        await scraper.scrape_existing(None, "no-id") # type: ignore


@pytest.mark.asyncio
async def test_scrape_existing_calls_scrape(monkeypatch):
    # provide a fake db model that matches ScraperConfig expectations
    fake_db_model = SimpleNamespace(website=SimpleNamespace(url="http://ex/"), retrieval_json=[{"node_query":"d","output":{"location":"text","key":"title"},"flags":{}}])

    async def fake_get_config(db, id):
        return fake_db_model

    monkeypatch.setattr(scraper, "get_config", fake_get_config)

    # monkeypatch scrape to observe input and return a sentinel
    monkeypatch.setattr(scraper, "scrape", lambda cfg: "SENTINEL")

    res = await scraper.scrape_existing(None, "cid") # type: ignore
    assert res == "SENTINEL"
