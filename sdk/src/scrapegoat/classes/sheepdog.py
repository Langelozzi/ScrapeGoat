"""
"""

# IMPORTS
import requests


class Sheepdog:
    """
    """
    HEADERS = {
        "User-Agent": "Mozilla/5.0 (ScrapeGoat SDK)",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Accept": "*/*",
        "DNT": "1",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
    }
    
    def __init__(self):
        """
        """
        pass

    def fetch(self, url: str) -> str:
        """
        """
        response = requests.get(url, headers=self.HEADERS)
        response.raise_for_status()
        return response.text
    

def main():
    """
    """
    pass


if __name__ == "__main__":
    main()
