ScrapeGoat API
=======================

<!--toc:start-->
- [ScrapeGoat API](#scrapegoat-api)
  - [Prerequisites](#prerequisites)
  - [Setup Instructions](#setup-instructions)
  - [Access the App](#access-the-app)
  - [Notes](#notes)
<!--toc:end-->

This is the API for the ScrapeGoat application.
It leverages the ScrapeGoat SDK to provide a web-based UI for using ScrapeGoat

Prerequisites
-------------

Make sure you have the following installed:

- Python 3.11 or newer
- pip (Python package installer)
- make (usually comes preinstalled on macOS and Linux)

Note: On Windows, you can install make via Git Bash or WSL.

Setup Instructions
------------------

1. Create a virtual environment:

    ```bash
    make venv
    ```

2. Activate the virtual environment:

    ```bash
    source .venv/bin/activate
    ```

   On Windows (PowerShell):

    ```bash
   .venv\Scripts\Activate.ps1
    ```

3. Install dependencies:

    ```bash
   make install
    ```

4. Run the development server:

    ```bash
   make run-dev
    ```

Access the App
--------------

- The API will be running at: <http://127.0.0.1:8000>
- Interactive API docs are available at: <http://127.0.0.1:8000/docs>

Notes
-----

- Always activate the virtual environment before running make commands.
- The Makefile was created for use on UNIX based systems.
You may need to run alternative commands on Windows.
- Add new routes inside app/main.py.
