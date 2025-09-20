"""
"""


class HTMLNode:
    _id_counter = 0

    def __init__(
        self,
        raw: str,
        tag: str,
        has_data: bool = False,
        html_attributes: dict[str, any] = None,
        body: str = "",
    ):
        """
        """
        self.id = HTMLNode._id_counter
        HTMLNode._id_counter += 1

        self.raw = raw
        self.tag = tag
        self.has_data = has_data
        self.html_attributes = html_attributes if html_attributes else {}
        self.body = body
        self.children = []
        self.retrieval_instructions = ""
    
    def to_dict(self) -> str:
        """
        """
        return {
            "id": self.id,
            "raw": self.raw,
            "tag": self.tag,
            "hasData": self.has_data,
            "htmlAttributes": self.html_attributes,
            "body": self.body,
            "children": [child.to_dict() for child in self.children],
            "retrievalInstructions": self.retrieval_instructions,
        }
    
    def to_string(self) -> str:
        """
        """
        return f"HTMLNode(id={self.id}, tag={self.tag}, hasData={self.has_data}, attributes={self.html_attributes}, body='{self.body}', children={len(self.children)})"

    def to_html(self, indent=0) -> str:
        """
        """
        attribute_string = " ".join(f'{k}="{v}"' for k, v in self.html_attributes.items())
        if attribute_string:
            opening = f"<{self.tag} {attribute_string}>"
        else:
            opening = f"<{self.tag}>"

        text = f" {self.body}" if self.has_data else ""

        pad = "  " * indent
        result = f"{pad}{opening}{text}\n"

        for child in self.children:
            result += child.to_html(indent + 1)

        result += f"{pad}</{self.tag}>\n"
        return result

    def __str__(self):
        return self.to_string()