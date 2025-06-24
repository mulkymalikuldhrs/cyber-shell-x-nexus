# EXACT FIX for Your WebSocket Error

## Step 1: Open your file
```bash
nano /storage/emulated/0/cyber-shell-x-nexus/cybershellx_server.py
```

## Step 2: Find line 253
Look for this problematic code:
```python
start_server = websockets.serve(
```

## Step 3: Replace the entire function
Replace your entire `start_websocket_server` function with this:

```python
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
```

## Step 4: Save and run
```bash
# Save the file (Ctrl+X, Y, Enter in nano)
python cybershellx_server.py
```

This will fix the "RuntimeError: no running event loop" error.