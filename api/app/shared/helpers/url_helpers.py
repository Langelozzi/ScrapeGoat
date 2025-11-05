from urllib.parse import urlparse


def get_url_domain(url: str) -> str:
    parsed = urlparse(url)
    return str(parsed.hostname) if parsed is not None else ""
