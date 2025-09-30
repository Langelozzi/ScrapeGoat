from textual.app import App
from textual.widgets import Header, Footer, Tree
#from control_panel import ControlPanel

class ScrapeGoatGUI(App):
	def __init__(self, root_node, **kwargs):
		super().__init__(**kwargs)
		self.sub_title = "Tree Visualizer"
		self.root_node = root_node

	def _create_tree_from_root_node(self, node):
		tree = Tree("HTML")
		nodes = {}

		for child in node.preorder_traversal():
			node_label = f"<{child.tag}>"
			if child.tag == "p":
				node_label += f" {child.body}"

			branch = tree.root if child.parent is None else nodes[child.parent.id].branch
			
			if len(child.children) == 0:
				child_branch = branch.add_leaf(node_label)
			else:
				child_branch = branch.add(node_label)

			child.branch = child_branch
			nodes[child.id] = child

		return tree

	def compose(self):
		yield Header(show_clock=True, name="ScrapeGoat")
		yield self._create_tree_from_root_node(self.root_node)
		#yield ControlPanel()
		yield Footer()