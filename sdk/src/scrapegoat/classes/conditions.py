"""
"""

from abc import ABC, abstractmethod


class Condition(ABC):
    """
    """
    def __init__(self, negated: bool = False):
        """
        """
        self.negated = negated

    @abstractmethod
    def matches(self, node, root) -> bool:
        """
        """
        pass

    def evaluate(self, node, root) -> bool:
        """
        """
        result = self.matches(node, root)
        return not result if self.negated else result


class WhereCondition(Condition):
    """
    """
    def __init__(self, attribute: str, value: str, negated: bool = False):
        """
        """
        super().__init__(negated)
        self.attribute = attribute
        self.value = value

    def matches(self, node, root) -> bool:
        """
        """
        return node.has_attribute(self.attribute, self.value)

    def __str__(self):
        """
        """
        return f"WhereCondition(attribute={self.attribute}, value={self.value}, negated={self.negated})"
    

class InCondition(Condition):
    """
    """
    def __init__(self, target: str, value=None, negated: bool = False, query_tag: str = None):
        """
        """
        super().__init__(negated)
        self.target = target
        self.value = value
        self.query_tag = query_tag

    def matches(self, node, root) -> bool:
        """
        """
        if self.target == "POSITION":
            if not root:
                raise ValueError("Root node is required for POSITION condition")
            if not self.query_tag:
                raise ValueError("query_tag is required for POSITION condition")
            position = 1
            for n in root.preorder_traversal():
                if n.tag == self.query_tag:
                    if node == n:
                        return position == self.value
                    position += 1
            return False
        else:
            return node.is_descendant_of(self.target)