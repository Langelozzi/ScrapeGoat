from textual.app import App
from textual.widgets import Header, Footer, Tree, Button, Label, RichLog
from textual.containers import HorizontalGroup, VerticalGroup

TextNodes = [
	"p", "h1", "h2", "h3", "h4", "h5", "h6"
]

class ControlPanel(HorizontalGroup):
	def __init__(self, **kwargs):
		super().__init__(**kwargs)
		self.current_node = None

	def compose(self):
		yield Label("<no node selected>")
		yield RichLog(max_lines=3)

	def on_ready(self):
		rl = self.query_one(RichLog)
		lab = self.query_one(Label)
		if self.current_node != None:
			lab.update(f"Current Node: <{self.current_node.tag}>")
			rl.write("Raw:" + self.current_node.raw)

class ScrapeGoatGUI(App):
	def __init__(self, root_node, **kwargs):
		super().__init__(**kwargs)
		self.sub_title = "Tree Visualizer"
		self.root_node = root_node
		self.nodes = {}

	def _create_tree_from_root_node(self, node):
		tree = Tree("HTML")
		self.nodes = {}

		for child in node.preorder_traversal():
			node_label = f"<{child.tag}>"
			if child.tag in TextNodes:
				node_label += f" {child.body}"

			branch = tree.root if child.parent is None else self.nodes[child.parent.id].branch
			branch.expand()
			
			if len(child.children) == 0:
				child_branch = branch.add_leaf(node_label)
			else:
				child_branch = branch.add(node_label)

			child.branch = child_branch
			self.nodes[child.id] = child

		return tree

	def compose(self):
		yield Header(show_clock=True, name="ScrapeGoat")
		yield self._create_tree_from_root_node(self.root_node)
		yield Footer()