"""
"""


class HTMLNode:
    """
    """
    VOID_TAGS = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}
    _id_counter = 0

    def __init__(self, raw: str, tag_type: str, has_data: bool = False, html_attributes: dict[str, any] = None, body: str = "", parent=None):
        """
        """
        self.id = HTMLNode._id_counter
        HTMLNode._id_counter += 1

        self.raw = raw
        self.tag_type = tag_type
        self.has_data = has_data
        self.html_attributes = html_attributes if html_attributes else {}
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
            "tag_type": self.tag_type,
            "has_data": self.has_data,
            "html_attributes": self.html_attributes,
            "body": self.body,
            "children": [child.to_dict() for child in self.children],
            "retrieval_instructions": self.retrieval_instructions,
            "parent": self.parent.id if self.parent else None
        }
    
    def to_string(self) -> str:
        """
        """
        return f"HTMLNode(id={self.id}, tag_type={self.tag_type}, has_data={self.has_data}, html_attributes={self.html_attributes}, body='{self.body}', children={len(self.children)}, parent={self.parent.id if self.parent else None}, retrieval_instructions='{self.retrieval_instructions}')"

    def to_html(self, indent=0) -> str:
        """
        """
        html_attribute_string = " ".join(f'{k}="{v}"' for k, v in self.html_attributes.items())
        if html_attribute_string:
            opening = f"<{self.tag_type} {html_attribute_string}"
        else:
            opening = f"<{self.tag_type}"

        if self.tag_type in self.VOID_TAGS:
            opening += " />"
        else:
            opening += ">"

        text = f" {self.body}" if self.has_data else ""

        pad = "  " * indent
        result = f"{pad}{opening}{text}\n"

        for child in self.children:
            result += child.to_html(indent + 1)

        if self.tag_type not in self.VOID_TAGS:
            result += f"{pad}</{self.tag_type}>\n"
        return result

    def __str__(self):
        return self.to_string()
    
    def get_parent(self):
        """
        """
        return self.parent
    
    def get_children(self):
        """
        """
        return self.children
    
    def get_ancestors(self):
        """
        """
        ancestors = []
        current = self.parent
        while current:
            ancestors.append(current)
            current = current.parent
        return ancestors
    
    def get_descendants(self, tag_type: str = None, **html_attributes) -> list:
        """
        """
        descendants = []
        for child in self.children:
            if (tag_type is None or child.tag_type == tag_type) and all(child.html_attributes.get(k) == v for k, v in html_attributes.items()):
                descendants.append(child)
            descendants.extend(child.get_descendants(tag_type, **html_attributes))
        return descendants
    
    def preorder_traversal(self):
        """
        """
        yield self
        for child in self.children:
            yield from child.preorder_traversal()

    def has_html_attribute(self, key, value=None) -> bool:
        """
        """
        if value is None:
            return key in self.html_attributes
        if self.html_attributes.get(key) is None:
            return False
        return value in self.html_attributes.get(key)
    
    def is_descendant_of(self, tag_type) -> bool:
        """
        """
        return any(ancestor.tag_type == tag_type for ancestor in self.get_ancestors())
    
    def set_retrieval_instructions(self, instruction: str):
        """
        """
        self.retrieval_instructions = instruction


def main():
    """
    """
    pass


if __name__ == "__main__":
    main()
