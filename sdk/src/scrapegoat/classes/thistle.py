"""
"""

from conditions import InCondition

class Thistle:
    """
    """
    def __init__(self, action: str, count: int, element: str, conditions: list, flags: list):
        """
        """
        self.action = action
        self.count = count
        self.element = element
        self.conditions = conditions or []
        self.flags = flags or []

        for cond in self.conditions:
            if isinstance(cond, InCondition) and cond.target == "POSITION" and cond.query_tag is None:
                cond.query_tag = self.element

    def __str__(self):
        """
        """
        return f"Thistle(action={self.action}, count={self.count}, element={self.element}, conditions={self.conditions}, flags={self.flags})"
    
    def to_dict(self) -> dict:
        """
        """
        return {
            "action": self.action,
            "count": self.count,
            "element": self.element,
            "conditions": [str(c) for c in self.conditions],
            "flags": self.flags,
        }
    
    def to_string(self) -> str:
        """
        """
        return str(self.to_dict())
    
    def evaluate(self, node, root) -> bool:
        """
        """
        if node.tag != self.element:
            return False
        return all(cond.evaluate(node, root) for cond in self.conditions)
    
    def execute(self, root) -> list:
        """
        """
        results = []
        for node in root.preorder_traversal():
            if self.evaluate(node, root):
                results.append(node)
                if self.count > 0 and len(results) >= self.count:
                    break
        return results
    

def main():
    """
    """
    pass


if __name__ == "__main__":
    main()
