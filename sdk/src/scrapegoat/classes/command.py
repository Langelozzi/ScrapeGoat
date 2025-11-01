"""
"""

from abc import ABC, abstractmethod
import os
import json
import csv

from .conditions import InCondition


class Command(ABC):
    """
    """
    @abstractmethod
    def __init__(self, action: str):
        """
        """
        self.action = action

    @abstractmethod
    def execute(self, root) -> any:
        """
        """
        pass


class GrazeCommand(Command):
    """
    """
    def __init__(self, action: str, count: int, element: str, conditions: list=None, flags: list=None):
        """
        """
        super().__init__(action=action)
        self.count = count
        self.element = element
        self.conditions = conditions or []
        self.flags = flags or []

        for cond in self.conditions:
            if isinstance(cond, InCondition) and cond.target == "POSITION" and cond.query_tag is None:
                cond.query_tag = self.element
    
    def _evaluate(self, node, root) -> bool:
        """
        """
        if node.tag_type != self.element:
            return False
        return all(cond.evaluate(node, root) for cond in self.conditions)
    
    def execute(self, root) -> list:
        """
        """
        results = []
        for node in root.preorder_traversal():
            if self._evaluate(node, root):
                results.append(node)
                if self.count > 0 and len(results) >= self.count:
                    break
        return results
    

class ChurnCommand(Command):
    """
    """
    def __init__(self, fields: list = None, ignore_children: bool = False, ignore_grandchildren: bool = False):
        """
        """
        super().__init__(action="extract")
        self.fields = fields
        self.ignore_children = ignore_children
        self.ignore_grandchildren = ignore_grandchildren
    
    def execute(self, node) -> None:
        """
        """
        node.set_extract_instructions(self.fields, self.ignore_children, self.ignore_grandchildren)
        

class DeliverCommand(Command):
    """
    """
    VALID_TYPES = {"csv", "json"}

    def __init__(self, file_type: str, filepath: str = None, filename: str = None):
        """
        """
        super().__init__(action="output")
        self.file_type = file_type
        self.filepath = filepath or os.getcwd()
        base, ext = os.path.splitext(filename or f"output.{file_type}")
        self.filename = base + (ext if ext else f".{file_type}")
        self.full_path = os.path.join(self.filepath, self.filename)

    def execute(self, nodes: list) -> str:
        """
        """
        os.makedirs(self.filepath, exist_ok=True)

        if self.file_type.lower() == "csv":
            self._to_csv(nodes)
        elif self.file_type.lower() == "json":
            self._to_json(nodes)
        return self.full_path
        
    def _flatten_dict(self, d: dict, parent_key: str = '', sep: str = '.') -> dict:
        """
        """
        items = {}
        for k, v in d.items():
            new_key = f"{k}" if parent_key else k
            if isinstance(v, dict):
                items.update(self._flatten_dict(v, new_key, sep=sep))
            else:
                items[new_key] = v
        return items

    def _collect_nodes(self, node_dict: dict, all_nodes: list) -> dict:
        """
        """
        node_copy = node_dict.copy()

        had_children = "children" in node_copy
        children = node_copy.pop("children", [])
        child_ids = []

        for child in children:
            child_flat = self._collect_nodes(child, all_nodes)
            child_ids.append(child_flat.get("id"))
        
        flattened = self._flatten_dict(node_copy)
        if had_children:
            if child_ids == [] or all(cid is None for cid in child_ids):
                flattened["children"] = None
            else:
                flattened["children"] = child_ids

        all_nodes.append(flattened)
        return node_copy


    def _to_csv(self, nodes: list) -> None:
        """
        """
        all_nodes = []
        for node in nodes:
            node_dict = node.to_dict()
            self._collect_nodes(node_dict, all_nodes)

        fieldnames = set()
        for nd in all_nodes:
            fieldnames.update(nd.keys())
        fieldnames = list(fieldnames)

        os.makedirs(self.filepath, exist_ok=True)
        with open(self.full_path, mode='w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            for nd in all_nodes:
                writer.writerow(nd)

    def _to_json(self, nodes: list) -> None:
        """
        """
        nodes_as_dicts = [node.to_dict() for node in nodes]
        with open(self.full_path, mode='w', encoding='utf-8') as jsonfile:
            json.dump(nodes_as_dicts, jsonfile, indent=4)


def main():
    """
    """
    pass


if __name__ == "__main__":
    main()
