"""
"""

class Goat:
    """
    """
    def __init__(self):
        """
        """
        pass

    def feast(self, root, graze_commands) -> list:
        """
        """
        results = []
        i = 0
        while i < len(graze_commands):
            graze_command = graze_commands[i]
            if graze_command.action.lower() == "select":
                rebased_roots = graze_command.execute(root)
                graze_command_subset = graze_commands[i + 1:]
                for new_root in rebased_roots:
                    results.extend(self.feast(new_root, graze_command_subset))
                return results
            else:
                results.extend(graze_command.execute(root))
            i += 1
        return results
