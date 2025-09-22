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
    INLINE_TAGS = {"b", "i", "strong", "em", "span", "u", "small", "mark", "sub", "sup"}

    def __init__(self):
        """
        """
        super().__init__()
        self.root = None
        self.stack = []

    def _auto_close_before(self, new_tag: str):
        """
        """
        while self.stack:
            current_node = next((n for n in reversed(self.stack) if n is not None), None)
            if current_node is None:
                break

            current_tag = current_node.tag
            if current_tag in self.AUTO_CLOSE and new_tag in self.AUTO_CLOSE[current_tag]:
                while self.stack:
                    popped = self.stack.pop()
                    if popped is current_node:
                        break
            else:
                break

    def handle_starttag(self, tag, attributes):
        """
        """
        self._auto_close_before(tag)

        if tag in self.INLINE_TAGS:
            self.stack.append(None)
            return

        node = HTMLNode(raw=self.get_starttag_text(), tag=tag, attributes=dict(attributes))

        if self.root is None:
            self.root = node
            if tag not in self.VOID_TAGS:
                self.stack.append(node)
            return

        if not self.stack or self.stack[-1] is None:
            parent = next((n for n in reversed(self.stack) if n is not None), self.root)
            parent.children.append(node)
            node.parent = parent
        else:
            parent = self.stack[-1]
            parent.children.append(node)
            node.parent = parent

        if tag not in self.VOID_TAGS:
            self.stack.append(node)
        return

    def handle_endtag(self, tag):
        """
        """
        if self.stack and self.stack[-1] is None:

            self.stack.pop()
            return

        for i in range(len(self.stack)-1, -1, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                break
        return

    def handle_data(self, data):
        """
        """
        stripped = data.strip()
        if not stripped:
            return

        parent = next((n for n in reversed(self.stack) if n is not None), self.root)

        if parent.body:
            parent.body += " " + stripped
        else:
            parent.body = stripped

        parent.has_data = True
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
    
    def grow_tree(self, raw_html: str) -> None:
        """
        """
        self.root = None
        self.stack = []
        self.reset()

        wrapped_html = self.append_root_tag(raw_html)
        self.feed(wrapped_html)
        return

    def get_root(self) -> HTMLNode:
        """
        """
        return self.root


def main():
    """
    """
    html = """<div><span><b><i>Deep</i></b></span></div>"""

    gardener = HTMLGardener()
    gardener.grow_tree(html)
    root = gardener.get_root()

    print(root.to_dict())
    return


if __name__ == "__main__":
    main()
