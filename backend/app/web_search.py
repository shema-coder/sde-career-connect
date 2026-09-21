import os
from typing import Any

from dotenv import load_dotenv
from tavily import TavilyClient

load_dotenv()

TAVILY_API_KEY = os.getenv("TAVILY_API_KEY", "")

if not TAVILY_API_KEY:
    raise RuntimeError("TAVILY_API_KEY is not configured.")

client = TavilyClient(api_key=TAVILY_API_KEY)


def search_web(
    query: str,
    max_results: int = 5,
    include_domains: list[str] | None = None,
) -> list[dict[str, Any]]:
    """
    Search the live web through Tavily and return clean source data.

    include_domains can be used when a question should prioritize
    official institutional sources.
    """

    search_kwargs: dict[str, Any] = {
        "query": query,
        "search_depth": "advanced",
        "max_results": max_results,
        "include_answer": False,
        "include_raw_content": False,
    }

    if include_domains:
        search_kwargs["include_domains"] = include_domains

    response = client.search(**search_kwargs)

    results = []

    for item in response.get("results", []):
        title = (item.get("title") or "").strip()
        url = (item.get("url") or "").strip()
        content = (item.get("content") or "").strip()

        if not url:
            continue

        results.append(
            {
                "title": title,
                "url": url,
                "content": content,
            }
        )

    return results
