#!/usr/bin/env python3
"""
Fixed WebSocket server for CyberShellX
This replaces the problematic start_websocket_server function
"""

import asyncio
import websockets
import threading
import logging
from typing import Any, Set
import json

# Global set to track connected clients
connected_clients: Set[Any] = set()

def start_websocket_server():
    """Fixed WebSocket server that properly handles asyncio event loops"""
    
    # Create new event loop for this thread
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    async def handle_client(websocket, path):
        """Handle individual WebSocket connections"""
        connected_clients.add(websocket)
        logging.info(f"Client connected. Total clients: {len(connected_clients)}")
        
        try:
            async for message in websocket:
                try:
                    # Parse incoming message
                    data = json.loads(message)
                    command = data.get('command', '')
                    
                    # Process command and send response
                    response = {
                        'type': 'response',
                        'command': command,
                        'output': f"Executed: {command}",
                        'timestamp': str(asyncio.get_event_loop().time())
                    }
                    
                    await websocket.send(json.dumps(response))
                    
                except json.JSONDecodeError:
                    # Handle plain text messages
                    await websocket.send(f"Received: {message}")
                    
        except websockets.exceptions.ConnectionClosed:
            logging.info("Client disconnected")
        except Exception as e:
            logging.error(f"Error handling client: {e}")
        finally:
            connected_clients.discard(websocket)
            logging.info(f"Client removed. Total clients: {len(connected_clients)}")
    
    async def start_server():
        """Start the WebSocket server"""
        server = await websockets.serve(handle_client, "localhost", 8765)
        logging.info("WebSocket server started on ws://localhost:8765")
        await server.wait_closed()
    
    try:
        # Run the server
        loop.run_until_complete(start_server())
    except KeyboardInterrupt:
        logging.info("WebSocket server stopped by user")
    except Exception as e:
        logging.error(f"WebSocket server error: {e}")
    finally:
        loop.close()

def start_websocket_thread():
    """Start WebSocket server in a separate thread"""
    websocket_thread = threading.Thread(target=start_websocket_server, daemon=True)
    websocket_thread.start()
    logging.info("WebSocket server thread started")
    return websocket_thread

# Your main server code would call this instead
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    
    print("CyberShellX v2.1.0 initialized")
    print("Starting WebSocket server on localhost:8765")
    
    # Start WebSocket server
    ws_thread = start_websocket_thread()
    
    print("WebSocket server: ws://localhost:8765")
    print("Web interface will be available at: http://localhost:5173")
    print("Connect your web browser to start using CyberShellX!")
    
    try:
        # Keep main thread alive
        while True:
            import time
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down CyberShellX...")