#!/usr/bin/env python3
"""
Fix for Python WebSocket server asyncio event loop issue
This addresses the 'RuntimeError: no running event loop' error
"""

import asyncio
import websockets
import threading
import logging

def start_websocket_server():
    """Start WebSocket server with proper event loop handling"""
    
    async def handler(websocket, path):
        """Handle WebSocket connections"""
        try:
            async for message in websocket:
                # Echo the message back or process it
                await websocket.send(f"Echo: {message}")
        except websockets.exceptions.ConnectionClosed:
            pass
    
    async def main():
        """Main async function to start the server"""
        server = await websockets.serve(handler, "localhost", 8765)
        logging.info("WebSocket server started on ws://localhost:8765")
        await server.wait_closed()
    
    # Create new event loop for this thread
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    try:
        loop.run_until_complete(main())
    except KeyboardInterrupt:
        logging.info("WebSocket server stopped")
    finally:
        loop.close()

def start_websocket_thread():
    """Start WebSocket server in a separate thread"""
    websocket_thread = threading.Thread(target=start_websocket_server, daemon=True)
    websocket_thread.start()
    return websocket_thread

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    print("Starting WebSocket server...")
    start_websocket_thread()
    
    # Keep main thread alive
    try:
        while True:
            import time
            time.sleep(1)
    except KeyboardInterrupt:
        print("Shutting down...")