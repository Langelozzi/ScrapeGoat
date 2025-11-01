def rename_key(d: dict, old_key, new_key) -> dict:
    """Rename a key in a dictionary (modifies in place)"""
    d[new_key] = d.pop(old_key)
    return d
