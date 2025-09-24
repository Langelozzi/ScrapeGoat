"""
"""

from scrapegoat import Shepherd


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
    query = """SCRAPE ALL p IN POSITION=5;"""
    
    shepherd = Shepherd()
    root = shepherd.plant_seed(html)
    results = shepherd.lead_goat(root, query)
    
    for r in results:
        print(r)


if __name__ == "__main__":
    main()
