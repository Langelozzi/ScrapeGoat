from textual.containers import HorizontalGroup
from textual.widgets import Button, Label

class ControlPanel(HorizontalGroup):
	def compose(self):
		yield Label("<no node selected>")