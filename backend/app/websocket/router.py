# Real-time WebSocket relay for inventory updates and priority alerts
"""WebSocket API for real-time push events."""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List, Dict, Set
import json
import logging


router = APIRouter()
logger = logging.getLogger(__name__)


class ConnectionManager:
    """Manages active WS connections for real-time relay."""
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        """Send message to all active clients."""
        for connection in list(self.active_connections):
            try:
                await connection.send_text(json.dumps(message))
            except Exception as e:
                logger.error(f"Failed to send WS message: {e}")
                self.disconnect(connection)


manager = ConnectionManager()


@router.websocket("/inventory")
async def inventory_websocket(websocket: WebSocket):
    """Subscribe to real-time inventory updates and priority alerts."""
    await manager.connect(websocket)
    try:
        while True:
            # Wait for any client message (like subscription/filter)
            data = await websocket.receive_text()
            # Simple subscribe echo for now
            await websocket.send_text(json.dumps({"type": "subscribed", "status": "ok"}))
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WS error: {e}")
        manager.disconnect(websocket)
