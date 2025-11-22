from app.shared.helpers.url_helpers import get_url_domain


def test_get_url_domain_basic():
    assert get_url_domain("https://example.com/path") == "example.com"


def test_get_url_domain_with_port_and_subdomain():
    assert get_url_domain("http://www.example.co.uk:8080/foo") == "www.example.co.uk"


def test_get_url_domain_invalid():
    # urlparse returns None for hostname when parsing invalid URLs; function casts to str
    assert get_url_domain("not a url") == "None"
