import io
import json


def rename_key(d: dict, old_key, new_key) -> dict:
    """Rename a key in a dictionary (modifies in place)"""
    d[new_key] = d.pop(old_key)
    return d


def to_json_stream(d: dict) -> io.BytesIO:
    """
    Convert a dictionary to a JSON memory stream for download or upload.
    """
    json_str = json.dumps(d, ensure_ascii=False)
    stream = io.BytesIO(json_str.encode("utf-8"))
    stream.seek(0)
    return stream
