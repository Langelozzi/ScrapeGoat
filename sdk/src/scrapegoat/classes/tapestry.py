from textual.app import App
from textual.widgets import Header, Footer, Button, Label, Tree
from textual.containers import HorizontalGroup

class ControlPanel(HorizontalGroup):
	def compose(self):
		pass

class Tapestry(App):
	def _create_tree_from_root_node(self, node):
		pass

	def compose(self):
		self.sub_title = "Tree Visualizer"
		yield Header(show_clock=True)
		yield Footer()