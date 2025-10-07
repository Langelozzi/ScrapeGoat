"""
"""

from scrapegoat import Shepherd, Sheepdog, Tapestry


def main():
    """
    """
    sheepdog = Sheepdog()

    html = sheepdog.fetch("https://en.wikipedia.org/wiki/Web_scraping")
    
    shepherd = Shepherd()
    root = shepherd.plant_seed(html)

    # tapestry = Tapestry(root)
    # tapestry.run()

    # query = "SELECT ALL div IF class='mw-heading';SCRAPE 1 h2;"
    # results = shepherd.lead_goat(root, query)
    
    # for r in results:
    #     print(r)


if __name__ == "__main__":
    main()
