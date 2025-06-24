def start_websocket_server():
    import asyncio
    import websockets
    import logging
    
    # Create new event loop for this thread
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    async def handle_client(websocket, path):
        try:
            async for message in websocket:
                await websocket.send(f"Received: {message}")
        except websockets.exceptions.ConnectionClosed:
            pass
        except Exception as e:
            logging.error(f"Error: {e}")
    
    async def start_server():
        server = await websockets.serve(handle_client, "localhost", 8765)
        logging.info("WebSocket server started on ws://localhost:8765")
        await server.wait_closed()
    
    try:
        loop.run_until_complete(start_server())
    except KeyboardInterrupt:
        logging.info("Server stopped")
    finally:
        loop.close()