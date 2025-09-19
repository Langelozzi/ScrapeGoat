from pydantic import HttpUrl


async def build_dom_tree(url: HttpUrl):
    return {"url": url, "tree": "tree"}
