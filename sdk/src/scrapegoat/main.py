"""
"""

from scrapegoat import Goat, HTMLGardener, ThistleInterpreter


def main():
    """
    """
    html = """<html>
  <body>
    <section id="main">
      <div class="container">
        <article>
          <p id="first">Hello</p>
          <p id="second">World</p>
        </article>
        <article>
          <p id="third">Foo</p>
          <p id="fourth">Bar</p>
        </article>
      </div>
    </section>
    <section id="sidebar">
      <div class="container">
        <article>
          <p id="fifth">Ignore Me</p>
        </article>
      </div>
    </section>
  </body>
</html>"""

    gardener = HTMLGardener()
    gardener.grow_tree(html)
    root = gardener.get_root()

    query = """SCRAPE ALL p IN POSITION=5;"""
    interpreter = ThistleInterpreter()
    thistles = interpreter.interpret(query)
    for thistle in thistles:
        print(thistle)

    goat = Goat()
    results = goat.feast(root, thistles)

    for result in results:
        print(result)


if __name__ == "__main__":
    main()
