import json
import pytest

from app.shared.helpers.io_helpers import to_json_stream, to_csv_stream


def test_to_json_stream_ok():
    data = [{"x": 1, "y": "a"}, {"x": 2, "y": "b"}]
    s = to_json_stream(data)
    assert hasattr(s, "read")
    content = s.read().decode("utf-8")
    assert json.loads(content) == data


def test_to_json_stream_empty_raises():
    with pytest.raises(ValueError):
        to_json_stream([])


def test_to_csv_stream_ok():
    data = [{"a": "1", "b": "2"}, {"a": "3", "b": "4"}]
    s = to_csv_stream(data)
    content = s.read().decode("utf-8")
    lines = content.splitlines()
    # header + 2 rows
    assert len(lines) == 3
    header = lines[0]
    assert "a" in header and "b" in header


def test_to_csv_stream_empty_raises():
    with pytest.raises(ValueError):
        to_csv_stream([])
