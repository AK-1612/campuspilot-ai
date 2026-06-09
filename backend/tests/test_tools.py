import sys, pytest
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[2]))

from backend.agent.tools import (
    qr_lookup,
    profile_detect,
    route_query,
    flag_obstacle
)

def test_qr_lookup_valid():
    result = qr_lookup.invoke({"qr_id": "QR_101"})

    assert "QR_101" in result


def test_qr_lookup_empty():
    result = qr_lookup.invoke({"qr_id": ""})

    assert result is not None


def test_profile_detect_default():
    result = profile_detect.invoke(
        {"user_input": "Take me to the library"}
    )

    assert result == "Invisible"


def test_profile_detect_wheelchair():
    result = profile_detect.invoke(
        {"user_input": "I use a wheelchair"}
    )

    assert result is not None


def test_profile_detect_visual():
    result = profile_detect.invoke(
        {"user_input": "I am visually impaired"}
    )

    assert result is not None


def test_route_query_basic():
    result = route_query.invoke(
        {
            "start_node": "Library",
            "end_node": "CS Lab",
            "profile": "Invisible"
        }
    )

    assert "Library" in result
    assert "CS Lab" in result


def test_route_query_wheelchair():
    result = route_query.invoke(
        {
            "start_node": "Library",
            "end_node": "Admin Block",
            "profile": "Wheelchair"
        }
    )

    assert "Wheelchair" in result


def test_route_query_same_location():
    result = route_query.invoke(
        {
            "start_node": "Library",
            "end_node": "Library",
            "profile": "Invisible"
        }
    )

    assert result is not None


def test_flag_obstacle():
    result = flag_obstacle.invoke(
        {
            "location": "Lift A",
            "description": "Broken"
        }
    )

    assert "Obstacle flagged" in result


def test_flag_obstacle_message():
    result = flag_obstacle.invoke(
        {
            "location": "Corridor 2",
            "description": "Water leakage"
        }
    )

    assert "Water leakage" in result
def test_route_contains_profile():
    result = route_query.invoke({
        "start_node": "Library",
        "end_node": "Lab",
        "profile": "Wheelchair"
    })

    assert "Wheelchair" in result


def test_flag_obstacle_location():
    result = flag_obstacle.invoke({
        "location": "Admin Block",
        "description": "Broken Lift"
    })

    assert "Admin Block" in result