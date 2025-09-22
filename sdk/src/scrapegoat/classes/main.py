"""
"""

from goat import Goat
from html_gardener import HTMLGardener
from thistle_interpreter import ThistleInterpreter


def main():
    """
    """
    html = """<div><span><b><i>Deep</i></b></span></div>"""

    gardener = HTMLGardener()
    gardener.grow_tree(html)
    root = gardener.get_root()

    query = """SELECT 1 span;"""
    interpreter = ThistleInterpreter()
    thistles = interpreter.interpret(query)
    for thistle in thistles:
        print(thistle)

    goat = Goat(root, thistles)
    results = goat.feast()

    for result in results:
        print(result)


if __name__ == "__main__":
    main()
