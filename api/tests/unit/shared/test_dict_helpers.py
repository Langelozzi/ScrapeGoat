import pytest
from app.shared.helpers.dict_helpers import rename_key


def test_rename_key_success():
    d = {"a": 1, "b": 2}
    res = rename_key(d, "a", "z")
    assert res is d
    assert "z" in d and "a" not in d and d["z"] == 1


def test_rename_key_missing_key():
    d = {"b": 2}
    with pytest.raises(KeyError):
        rename_key(d, "a", "z")
