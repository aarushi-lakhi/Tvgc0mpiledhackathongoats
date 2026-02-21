import os

from langchain_community.utilities.sql_database import SQLDatabase
from langchain_community.agent_toolkits.sql.base import create_sql_agent
from langchain_google_genai import ChatGoogleGenerativeAI

from database import DB_PATH

_db: SQLDatabase | None = None
_agent = None


def _get_db() -> SQLDatabase:
    global _db
    if _db is None:
        _db = SQLDatabase.from_uri(f"sqlite:///{DB_PATH}")
    return _db


def _get_agent():
    global _agent
    if _agent is None:
        llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=os.environ.get("GOOGLE_API_KEY", ""),
            temperature=0,
        )
        _agent = create_sql_agent(
            llm=llm,
            db=_get_db(),
            agent_type="tool-calling",
            verbose=True,
            top_k=20,
        )
    return _agent


def query(message: str) -> str:
    """Run a natural-language question against the assets database."""
    agent = _get_agent()
    result = agent.invoke({"input": message})
    return result.get("output", str(result))


def reset():
    """Force re-creation of the DB connection and agent (e.g. after new inserts)."""
    global _db, _agent
    _db = None
    _agent = None
