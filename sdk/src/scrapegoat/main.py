"""
"""

from scrapegoat import Shepherd, Sheepdog, Loom


def main():
    """
    """
    sheepdog = Sheepdog()

    html = sheepdog.fetch("https://en.wikipedia.org/wiki/Web_scraping")
    
    shepherd = Shepherd()
    root = shepherd.sow(html)

    Loom(root).weave()


if __name__ == "__main__":
    main()
