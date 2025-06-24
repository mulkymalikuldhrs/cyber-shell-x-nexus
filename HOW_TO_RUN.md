# How to Run CyberShellX

## Option 1: React/Node.js Version (Recommended - Already Working)

### On Replit:
- Already running! Check the webview panel
- Access via the URL shown above the console
- No setup needed

### Locally:
```bash
# Install dependencies
npm install

# Set up database (PostgreSQL required)
export DATABASE_URL="postgresql://username:password@localhost:5432/cybershellx"
npm run db:push

# Start the application
npm run dev

# Access at: http://localhost:5000
```

## Option 2: Python Version (Needs Fix)

### Current Issue:
Your Python WebSocket server has an asyncio event loop error.

### To Fix and Run:
1. Edit your `cybershellx_server.py` file
2. Replace the `start_websocket_server` function with:

```python
def start_websocket_server():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    async def handler(websocket, path):
        # Your handler code here
        pass
    
    async def main():
        server = await websockets.serve(handler, "localhost", 8765)
        print("WebSocket server started on ws://localhost:8765")
        await server.wait_closed()
    
    try:
        loop.run_until_complete(main())
    finally:
        loop.close()
```

3. Run your Python script:
```bash
python cybershellx_server.py
```

4. Access at: http://localhost:5173

## Quick Start (Easiest):
The React version is already running on Replit. Just look at the webview panel to see your CyberShellX terminal interface.