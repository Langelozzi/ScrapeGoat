# Running Tests

Quick instructions to run the test suite locally.

Activate virtual environment
```bash
source .venv/bin/activate
```

Install test requirements
```bash
pip install -r requirements.txt
```

Run unit tests (-q = quiet, -v = verbose)
```bash
pytest tests/unit -q
```
or
```bash
make test
```

Notes
- If tests require DB access, ensure `DATABASE_URL` points to a test database or that `tests/conftest.py` configures an in-memory/test DB.
- To run all tests:
```bash
pytest -q
```

If tests fail due to migrations, run the migrations locally before running tests or use the provided fixtures to create schema.
