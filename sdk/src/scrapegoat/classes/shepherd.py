"""
"""

from .gardener import Gardener
from .goat import Goat
from .interpreter import Interpeter
from .milkmaid import Milkmaid
from .milkman import Milkman


class Shepherd:
    """
    """
    def __init__(self):
        """
        """
        self.gardener = Gardener()
        self.interpreter = Interpeter()
        self.goat = Goat()
        self.milkmaid = Milkmaid()
        self.milkman = Milkman()

    def pasture(self, raw_html: str):
        """
        """
        self.gardener.grow_tree(raw_html)
        return self.gardener.get_root()

    def _validate_commands(self, commands: list) -> None:
        """
        """
        pass

    def herd(self, root, query: str) -> set:
        """
        """
        commands = self.interpreter.interpret(query)

        select_scrape_commands = [cmd for cmd in commands if cmd.action in ("scrape", "select")]
        extract_commands = [cmd for cmd in commands if cmd.action == "extract"]
        deliver_commands = [cmd for cmd in commands if cmd.action == "output"]

        results = self.goat.feast(root, select_scrape_commands)

        if extract_commands:
            self.milkmaid.churn(results, extract_commands[0])

        if deliver_commands:
            self.milkman.deliver(results, deliver_commands[0])

        return set(results)


def main():
    """
    """
    pass


if __name__ == "__main__":
    main()
