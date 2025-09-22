"""
"""


class HTMLNode:
    """
    """
    VOID_TAGS = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}
    _id_counter = 0

    def __init__(self, raw: str, tag: str, has_data: bool = False, attributes: dict[str, any] = None, body: str = "", parent=None):
        """
        """
        self.id = HTMLNode._id_counter
        HTMLNode._id_counter += 1

        self.raw = raw
        self.tag = tag
        self.has_data = has_data
        self.attributes = attributes if attributes else {}
        self.body = body
        self.children = []
        self.retrieval_instructions = ""
        self.parent = parent
    
    def to_dict(self) -> str:
        """
        """
        return {
            "id": self.id,
            "raw": self.raw,
            "tag": self.tag,
            "hasData": self.has_data,
            "htmlAttributes": self.attributes,
            "body": self.body,
            "children": [child.to_dict() for child in self.children],
            "retrievalInstructions": self.retrieval_instructions,
            "parent": self.parent.id if self.parent else None
        }
    
    def to_string(self) -> str:
        """
        """
        return f"HTMLNode(id={self.id}, tag={self.tag}, hasData={self.has_data}, attributes={self.attributes}, body='{self.body}', children={len(self.children)}, parent={self.parent.id if self.parent else None})"

    def to_html(self, indent=0) -> str:
        """
        """
        attribute_string = " ".join(f'{k}="{v}"' for k, v in self.attributes.items())
        if attribute_string:
            opening = f"{self.tag} {attribute_string}"
        else:
            opening = f"{self.tag}"

        text = f" {self.body}" if self.has_data else ""

        pad = "  " * indent
        result = f"{pad}{opening}{text}\n"

        for child in self.children:
            result += child.to_html(indent + 1)

        if self.tag not in self.VOID_TAGS:
            result += f"{pad}</{self.tag}>\n"
        return result

    def __str__(self):
        return self.to_string()


def main():
    """
    """
    pass


if __name__ == "__main__":
    main()
