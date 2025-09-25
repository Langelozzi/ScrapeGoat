"""
"""

from scrapegoat import Shepherd, Sheepdog


def main():
    """
    """
    sheepdog = Sheepdog()

    html = sheepdog.fetch("https://en.wikipedia.org/wiki/Web_scraping")

    query = """SCRAPE ALL p IN POSITION=5;"""
    
    shepherd = Shepherd()
    root = shepherd.plant_seed(html)
    results = shepherd.lead_goat(root, query)
    
    for r in results:
        print(r)


if __name__ == "__main__":
    main()
