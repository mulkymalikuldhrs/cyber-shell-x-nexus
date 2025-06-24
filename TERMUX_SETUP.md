# Running CyberShellX on Termux

## Prerequisites
```bash
# Update Termux packages
pkg update && pkg upgrade

# Install required packages
pkg install nodejs postgresql python git

# Install Python packages if using Python version
pip install websockets asyncio
```

## Setup Steps

### For React/Node.js Version:
```bash
# Clone or download the project files
# If you have the files, navigate to the project directory

# Install Node.js dependencies
npm install

# Start PostgreSQL service
pg_ctl -D $PREFIX/var/lib/postgresql start

# Create database
createdb cybershellx

# Set database URL for Termux PostgreSQL
export DATABASE_URL="postgresql://$(whoami)@localhost:5432/cybershellx"

# Push database schema
npm run db:push

# Start the application
npm run dev
```

### For Python Version (Fix the asyncio issue first):
```bash
# Edit your cybershellx_server.py file
# Add this function to fix the WebSocket server:

def start_websocket_server():
    import asyncio
    import websockets
    
    # Create new event loop for this thread
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    async def handler(websocket, path):
        # Your existing handler code here
        async for message in websocket:
            await websocket.send(f"Received: {message}")
    
    async def main():
        server = await websockets.serve(handler, "localhost", 8765)
        print("WebSocket server started on ws://localhost:8765")
        await server.wait_closed()
    
    try:
        loop.run_until_complete(main())
    except KeyboardInterrupt:
        print("Server stopped")
    finally:
        loop.close()

# Then run your Python script
python cybershellx_server.py
```

## Access the Application
- React version: http://localhost:5000
- Python version: http://localhost:5173

## Troubleshooting Termux
- If PostgreSQL won't start: `pg_ctl -D $PREFIX/var/lib/postgresql initdb` first
- If permission errors: Check Termux storage permissions
- If port conflicts: Change the port in the application code