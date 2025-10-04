"""
"""

from classes import Shepherd, Sheepdog
from classes.tapestry import ScrapeGoatGUI


def main():
    """
    """
    sheepdog = Sheepdog()

    html = sheepdog.fetch("https://en.wikipedia.org/wiki/Web_scraping")

    query = "SELECT ALL div IF class='mw-heading';SCRAPE 1 h2;"
    
    shepherd = Shepherd()
    root = shepherd.plant_seed(html)
    ScrapeGoatGUI(root).run()


if __name__ == "__main__":
    main()
