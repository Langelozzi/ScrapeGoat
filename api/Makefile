venv:
	python3 -m venv .venv

install:
	pip install -r requirements.txt

run-dev:
	uvicorn app.main:app --reload

seed-data:
	python scripts/seed_data.py

migrate:
	alembic upgrade head

migrate-create:
	@read -p "Enter migration message: " msg; \
	alembic revision --autogenerate -m "$$msg"

