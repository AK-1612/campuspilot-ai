import sys, pytest
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[2]))
from backend.agent.agent import CampusPilotAgent


def test_process_query():
    agent = CampusPilotAgent()
    result = agent.process_query("Take me to the library")

    # result is a dict with response, route_data, intent, intermediate_steps_raw
    assert isinstance(result, dict)
    assert "response" in result
    assert len(result["response"]) > 0
    assert "intent" in result


def test_process_query_not_empty():
    agent = CampusPilotAgent()
    result = agent.process_query("Where is the CS Lab?")

    assert isinstance(result, dict)
    assert len(result) > 0
    assert result.get("response")
