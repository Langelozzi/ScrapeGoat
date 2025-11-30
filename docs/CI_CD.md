# CI/CD Pipeline Documentation

This project uses GitHub Actions to provide automated testing for both the backend API and the frontend application.  
The pipeline is split into two workflows so each part of the project can be validated independently.

---

## 1. API Pipeline (Pytest)

### Configuration
- Triggers on pull requests to **main** and **development**.
- Sets up Python 3.12 and installs backend dependencies.
- Uses caching to speed up repeated installs.
- Runs the API test suite using pytest through `make test`.
- Supplies required environment variables such as database connection and JWT secret.
- Uses concurrency control so older runs for the same PR are cancelled.

### Benefits
- Ensures backend logic, routing, and database interactions work before merging.
- Prevents regressions by running the full test suite automatically.
- Dependency caching reduces execution time.
- Concurrency avoids unnecessary duplicate builds.
- Improves code quality and reliability throughout development.

---

## 2. Frontend Pipeline (Vitest)

### Configuration
- Triggers on pull requests to **main** and **development**.
- Sets up Node.js with dependency caching.
- Installs frontend dependencies using `npm ci` for clean reproducible builds.
- Executes the test suite with Vitest (`npm run test:ci`).

### Benefits
- Confirms that UI components, hooks, and state logic function correctly.
- Catches breaking changes early in the pull request process.
- Ensures stable and predictable test runs through clean installs.
- Helps maintain consistent frontend behavior across updates.

---

## Summary of Benefits

Together, these pipelines provide:
- **Early detection of bugs** in both frontend and backend.
- **Higher code reliability** through automated testing.
- **Consistent build environments** due to pinned versions and clean installs.
- **Faster development cycles** with caching and concurrency management.
- **Better code review quality**, since reviewers see test results before merging.
