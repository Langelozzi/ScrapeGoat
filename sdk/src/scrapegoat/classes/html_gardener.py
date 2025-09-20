"""
"""

# IMPORTS
from html.parser import HTMLParser
from html_node import HTMLNode


class HTMLGardener(HTMLParser):
    """
    """
    VOID_TAGS = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}
    AUTO_CLOSE = {
        "li": {"li"},
        "p": {"address", "article", "aside", "blockquote", "div", "dl", "fieldset", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "main", "nav", "ol", "p", "pre", "section", "table", "ul"},
        "dt": {"dt", "dd"},
        "dd": {"dt", "dd"},
        "tr": {"tr"},
        "td": {"td", "th"},
        "th": {"td", "th"}
    }

    def __init__(self):
        """
        """
        super().__init__()
        self.root = None
        self.stack = []

    def _auto_close_before(self, new_tag: str):
        while self.stack:
            current = self.stack[-1].tag
            if current in self.AUTO_CLOSE and new_tag in self.AUTO_CLOSE[current]:
                self.stack.pop()
            else:
                break
        return

    def handle_starttag(self, tag, attributes):
        """
        """
        self._auto_close_before(tag)
        node = HTMLNode(raw=self.get_starttag_text(), tag=tag, attributes=dict(attributes))

        if self.root is None:
            self.root = node
            if tag not in self.VOID_TAGS:
                self.stack.append(node)
            return

        if not self.stack:
            self.root.children.append(node)
        else:
            self.stack[-1].children.append(node)

        if tag not in self.VOID_TAGS:
            self.stack.append(node)
        return

    def handle_endtag(self, tag):
        """
        """
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                break
        return

    def handle_data(self, data):
        """
        """
        if self.stack:
            stripped = data.strip()
            if stripped:
                node = self.stack[-1]
                if node.tag in self.VOID_TAGS:
                    return  
                if node.body:
                    node.body += " " + stripped
                else:
                    node.body = stripped
                node.has_data = True
        return
    
    def append_root_tag(self, raw_html: str) -> str:
        """
        """
        html_lower = raw_html.lower()

        if "<html" not in html_lower:
            raw_html = f"<html>{raw_html}</html>"

        if "<body" not in html_lower:
            raw_html = raw_html.replace("<html>", "<html><body>", 1)
            raw_html = raw_html.replace("</html>", "</body></html>", 1)
        return raw_html


def main():
    """
    """
    html = """
<p>This is <b>bold</b> and <i>italic</i>.</p>
    """

    parser = HTMLGardener()
    wrapped_html = parser.append_root_tag(html)
    parser.feed(wrapped_html)

    print(parser.root.to_dict())
    return


if __name__ == "__main__":
    main()
