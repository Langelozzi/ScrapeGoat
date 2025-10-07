from textual.app import App
from textual.widgets import Header, Footer, Tree, Button, Label, TextArea
from textual.containers import HorizontalGroup, VerticalGroup

TextNodes = [
	"p", "h1", "h2", "h3", "h4", "h5", "h6", "span", "li", "a"
]

class ControlPanel(VerticalGroup):
	def __init__(self, **kwargs):
		super().__init__(**kwargs)
		self.current_node = None
		self.query_nodes = []

	def compose(self):
		self.node_label = Label("<no node selected>", id="node-info")
		self.button_add = Button("Add", id="node-add", variant="success")
		self.button_remove = Button("Remove", id="node-remove", variant="error")

		yield HorizontalGroup(
			self.node_label,
			HorizontalGroup(
				self.button_add,
				self.button_remove,
				id="node-buttons",
			)
		)
		yield TextArea("...")

	def update_node(self, node):
		self.current_node = node
		lab = self.node_label
		if node is None:
			lab.update("<no node selected>")
		else:
			info = f"ID: {node.id} | Tag: {node.tag_type}"
			lab.update(info)
	
	def add_node(self):
		if self.current_node and self.current_node not in self.query_nodes:
			self.query_nodes.append(self.current_node)
			text_area = self.query_one(TextArea)
			
			if text_area.text == "...":
				text_area.text = ""
			
			text_area.text += self.current_node.retrieval_instructions + "\n"
	
	def remove_node(self):
		if self.current_node and self.current_node in self.query_nodes:
			self.query_nodes.remove(self.current_node)
			text_area = self.query_one(TextArea)
			lines = text_area.text.split("\n")
			lines = [line for line in lines if line.strip() != self.current_node.retrieval_instructions]
			text_area.text = "\n".join(lines) if lines else "..."

class Loom(App):
	CSS_PATH = "../gui-styles/tapestry.tcss"
	BINDINGS = []

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
			branch.allow_expand = False
			
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
			self.control_panel.update_node(self.nodes.get(event.node._html_node_id, None))

	def on_button_pressed(self, event: Button.Pressed) -> None:
		if event.button.id == "node-add":
			if self.control_panel and self.control_panel.current_node:
				self.control_panel.add_node()
		elif event.button.id == "node-remove":
			if self.control_panel and self.control_panel.current_node:
				self.control_panel.remove_node()

	def compose(self):
		yield Header(show_clock=True, name="ScrapeGoat", icon="🐐")
		dom_tree = self._create_tree_from_root_node(self.root_node)
		ctrl = ControlPanel()
		self.control_panel = ctrl
		dom_tree.control_panel = ctrl

		yield dom_tree
		yield ctrl

		yield Footer()

	def weave(self):
		self.run()