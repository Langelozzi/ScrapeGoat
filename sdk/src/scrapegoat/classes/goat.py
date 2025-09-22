"""
"""

class Goat:
    """
    """
    def __init__(self, root, thistles: list):
        """
        """
        self.root = root
        self.thistles = thistles

    def feast(self) -> list:
        """
        """
        results = []
        for thistle in self.thistles:
            # TODO: differentiate between SELECT and SCRAPE actions.
            results.extend(thistle.execute(self.root))
        return results
