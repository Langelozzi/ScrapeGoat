from pydantic import HttpUrl
from app.shared.models.html import HtmlNode, ScrapeGoatDOMTree


# Mock realistic DOM tree
root_node = HtmlNode(
    id=1,
    raw="<html>...</html>",
    tag_type="html",
    hasData=False,
    htmlAttributes={},
    body="",
    retrieval_instructions=[],
    children=[
        HtmlNode(
            id=2,
            raw="<head>...</head>",
            tag_type="head",
            hasData=False,
            htmlAttributes={},
            body="",
            retrieval_instructions=[],
            children=[
                HtmlNode(
                    id=3,
                    raw="<title>Test Page</title>",
                    tag_type="title",
                    hasData=True,
                    htmlAttributes={},
                    body="Test Page",
                    retrieval_instructions=[{"action": "extract_text"}],
                    children=[],
                ),
                HtmlNode(
                    id=4,
                    raw='<meta charset="UTF-8">',
                    tag_type="meta",
                    hasData=False,
                    htmlAttributes={"charset": "UTF-8"},
                    body="",
                    retrieval_instructions=[],
                    children=[],
                ),
            ],
        ),
        HtmlNode(
            id=5,
            raw="<body>...</body>",
            tag_type="body",
            hasData=False,
            htmlAttributes={"class": "main-body"},
            body="",
            retrieval_instructions=[],
            children=[
                HtmlNode(
                    id=6,
                    raw='<header id="main-header" class="header">...</header>',
                    tag_type="header",
                    hasData=False,
                    htmlAttributes={"id": "main-header", "class": "header"},
                    body="",
                    retrieval_instructions=[],
                    children=[
                        HtmlNode(
                            id=7,
                            raw='<h1 class="site-title">My Website</h1>',
                            tag_type="h1",
                            hasData=True,
                            htmlAttributes={"class": "site-title"},
                            body="My Website",
                            retrieval_instructions=[{"action": "extract_text"}],
                            children=[],
                        )
                    ],
                ),
                HtmlNode(
                    id=8,
                    raw='<nav class="main-nav">...</nav>',
                    tag_type="nav",
                    hasData=False,
                    htmlAttributes={"class": "main-nav"},
                    body="",
                    retrieval_instructions=[],
                    children=[
                        HtmlNode(
                            id=9,
                            raw='<a href="/" class="nav-link">Home</a>',
                            tag_type="a",
                            hasData=True,
                            htmlAttributes={"href": "/", "class": "nav-link"},
                            body="Home",
                            retrieval_instructions=[
                                {"action": "extract_text"},
                                {"action": "extract_href"},
                            ],
                            children=[],
                        ),
                        HtmlNode(
                            id=10,
                            raw='<a href="/about" class="nav-link">About</a>',
                            tag_type="a",
                            hasData=True,
                            htmlAttributes={"href": "/about", "class": "nav-link"},
                            body="About",
                            retrieval_instructions=[
                                {"action": "extract_text"},
                                {"action": "extract_href"},
                            ],
                            children=[],
                        ),
                    ],
                ),
                HtmlNode(
                    id=11,
                    raw='<main id="content">...</main>',
                    tag_type="main",
                    hasData=False,
                    htmlAttributes={"id": "content"},
                    body="",
                    retrieval_instructions=[],
                    children=[
                        HtmlNode(
                            id=12,
                            raw='<section id="intro" class="section">Welcome!</section>',
                            tag_type="section",
                            hasData=True,
                            htmlAttributes={"id": "intro", "class": "section"},
                            body="Welcome!",
                            retrieval_instructions=[{"action": "extract_text"}],
                            children=[],
                        ),
                        HtmlNode(
                            id=13,
                            raw='<section id="features" class="section">Features listed here</section>',
                            tag_type="section",
                            hasData=True,
                            htmlAttributes={"id": "features", "class": "section"},
                            body="Features listed here",
                            retrieval_instructions=[{"action": "extract_text"}],
                            children=[],
                        ),
                    ],
                ),
                HtmlNode(
                    id=14,
                    raw='<footer id="site-footer" class="footer">© 2025 My Website</footer>',
                    tag_type="footer",
                    hasData=True,
                    htmlAttributes={"id": "site-footer", "class": "footer"},
                    body="© 2025 My Website",
                    retrieval_instructions=[{"action": "extract_text"}],
                    children=[],
                ),
            ],
        ),
    ],
)


def get_mock_dom_tree(url: HttpUrl):
    return ScrapeGoatDOMTree(url=url, root=root_node)
