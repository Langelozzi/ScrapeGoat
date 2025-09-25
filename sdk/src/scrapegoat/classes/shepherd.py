"""
"""

from .html_gardener import HTMLGardener
from .goat import Goat
from .thistle_interpreter import ThistleInterpreter


class Shepherd:
    """
    """
    def __init__(self):
        """
        """
        self.gardener = HTMLGardener()
        self.interpreter = ThistleInterpreter()
        self.goat = Goat()

    def plant_seed(self, raw_html: str):
        """
        """
        self.gardener.grow_tree(raw_html)
        return self.gardener.get_root()
    
    def lead_goat(self, root, query: str) -> list:
        """
        """
        thistles = self.interpreter.interpret(query)
        results = self.goat.feast(root, thistles)
        return results
