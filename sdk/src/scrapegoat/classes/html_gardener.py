"""
"""

# IMPORTS
from html.parser import HTMLParser
from html_node import HTMLNode


class HTMLGardener(HTMLParser):
    """
    """
    VOID_TAGS = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}

    def __init__(self):
        """
        """
        super().__init__()
        self.root = None
        self.stack = []

    def handle_starttag(self, tag, attrs):
        """
        """
        node = HTMLNode(raw=self.get_starttag_text(), tag=tag, html_attributes=dict(attrs))

        if self.root is None:
            self.root = node
            if tag not in self.VOID_TAGS:
                self.stack.append(node)
            return

        if not self.stack:
            return

        self.stack[-1].children.append(node)

        if tag not in self.VOID_TAGS:
            self.stack.append(node)

    def handle_endtag(self, tag):
        """
        """
        if self.stack and self.stack[-1].tag == tag:
            self.stack.pop()

    def handle_data(self, data):
        """
        """
        if self.stack:
            stripped = data.strip()
            if stripped:
                node = self.stack[-1]
                if node.body:
                    node.body += " " + stripped
                else:
                    node.body = stripped
                self.stack[-1].has_data = True


def main():
    """
    """
    pass


if __name__ == "__main__":
    main()
