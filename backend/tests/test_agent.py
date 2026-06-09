import sys, pytest
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[2]))
from backend.agent.agent import CampusPilotAgent


def test_process_query():
    agent = CampusPilotAgent()

    result = agent.process_query(
        "Take me to the library"
    )

    assert "Agent would process" in result


def test_process_query_not_empty():
    agent = CampusPilotAgent()

    result = agent.process_query(
        "Where is the CS Lab?"
    )

    assert len(result) > 0