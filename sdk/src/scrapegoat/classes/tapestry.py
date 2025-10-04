from textual.app import App
from textual.widgets import Header, Footer, Tree, Button, Label, RichLog
from textual.containers import HorizontalGroup, VerticalGroup

TextNodes = [
	"p", "h1", "h2", "h3", "h4", "h5", "h6", "span", "li", "a"
]

class ControlPanel(HorizontalGroup):
	def __init__(self, **kwargs):
		super().__init__(**kwargs)
		self.current_node = None

	def compose(self):
		yield Label("<no node selected>")

	def updateNode(self, node):
		self.current_node = node
		lab = self.query_one(Label)
		if node is None:
			lab.update("<no node selected>")
		else:
			info = f"ID: {node.id} | Tag: {node.tag_type}"
			lab.update(info)

class ScrapeGoatGUI(App):
	def __init__(self, root_node, **kwargs):
		super().__init__(**kwargs)
		self.sub_title = "Tree Visualizer"
		self.root_node = root_node
		self.nodes = {}

	def _create_tree_from_root_node(self, node):
		self.nodes = {}
		tree = None

		for child in node.preorder_traversal():
			if tree is None:
				tree = Tree(f"<{child.tag_type}>")
				tree.root._html_node_id = child.id
				child.branch = tree.root
				self.nodes[child.id] = child
				continue

			node_label = f"<{child.tag_type}>"
			if child.tag_type in TextNodes and len(child.body.strip()) > 0:
				node_label += f" {child.body}"

			branch = tree.root if child.parent is None else self.nodes[child.parent.id].branch
			branch.expand()
			
			if len(child.children) == 0:
				child_branch = branch.add_leaf(node_label)
			else:
				child_branch = branch.add(node_label)

			child.branch = child_branch
			child_branch._html_node_id = child.id
			self.nodes[child.id] = child

		return tree

	def on_tree_node_highlighted(self, event: Tree.NodeHighlighted) -> None:
		if self.control_panel:
			self.control_panel.updateNode(self.nodes.get(event.node._html_node_id, None))

	def compose(self):
		yield Header(show_clock=True, name="ScrapeGoat", icon="🐐")
		dom_tree = self._create_tree_from_root_node(self.root_node)
		ctrl = ControlPanel()
		self.control_panel = ctrl
		dom_tree.control_panel = ctrl

		yield dom_tree
		yield ctrl

		yield Footer()