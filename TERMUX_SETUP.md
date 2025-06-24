# Running CyberShellX on Termux

## Quick Start
```bash
# Clone the repository
git clone https://github.com/yourusername/cybershellx.git
cd cybershellx

# Install prerequisites
pkg update && pkg upgrade
pkg install nodejs postgresql python git

# Setup and run React version
npm install
pg_ctl -D $PREFIX/var/lib/postgresql start
createdb cybershellx
export DATABASE_URL="postgresql://$(whoami)@localhost:5432/cybershellx"
npm run db:push
npm run dev

# Access at: http://localhost:5000
```

## Detailed Setup

### Prerequisites
```bash
# Update Termux packages
pkg update && pkg upgrade

# Install required packages
pkg install nodejs postgresql python git

# Install Python packages if using Python version
pip install websockets asyncio
```

### React/Node.js Version (Recommended)
```bash
# Navigate to project directory
cd cybershellx

# Install Node.js dependencies
npm install

# Initialize PostgreSQL if first time
pg_ctl -D $PREFIX/var/lib/postgresql initdb

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

### Python Version (Fix asyncio issue)

**Step 1: Fix your WebSocket server**
Replace the `start_websocket_server` function in your `cybershellx_server.py` around line 253:

```python
def start_websocket_server():
    import asyncio
    import websockets
    import threading
    import logging
    import json
    
    # Create new event loop for this thread
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    async def handle_client(websocket, path):
        try:
            async for message in websocket:
                try:
                    # Parse JSON messages
                    data = json.loads(message)
                    command = data.get('command', '')
                    response = {
                        'type': 'response',
                        'command': command,
                        'output': f"Executed: {command}",
                        'timestamp': str(asyncio.get_event_loop().time())
                    }
                    await websocket.send(json.dumps(response))
                except json.JSONDecodeError:
                    # Handle plain text
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

**Step 2: Start your web server**
Make sure your web server (likely Flask/FastAPI) is actually running on port 5173. Check your Python code for:
```python
app.run(host='0.0.0.0', port=5173, debug=True)
```

**Step 3: Run your server**
```bash
python cybershellx_server.py
```

**Step 4: Access the application**
- WebSocket: ws://localhost:8765
- Web interface: http://localhost:5173

## Access Points
- **React version**: http://localhost:5000
- **Python version**: http://localhost:5173

## Termux-Specific Troubleshooting

### PostgreSQL Issues
```bash
# If PostgreSQL won't start, initialize first
pg_ctl -D $PREFIX/var/lib/postgresql initdb

# Check PostgreSQL status
pg_ctl -D $PREFIX/var/lib/postgresql status

# Restart PostgreSQL
pg_ctl -D $PREFIX/var/lib/postgresql restart
```

### Common Fixes
- **Permission errors**: Run `termux-setup-storage` to grant storage permissions
- **Port conflicts**: Change port in code or kill conflicting processes
- **Node.js issues**: Ensure you're using compatible Node.js version (20+)
- **Database connection**: Verify PostgreSQL is running before starting the app

### Environment Variables
Add to your `.bashrc` or `.zshrc`:
```bash
export DATABASE_URL="postgresql://$(whoami)@localhost:5432/cybershellx"
```

## Features Available
- Interactive terminal interface
- Cybersecurity tool demonstrations  
- Real-time command execution simulation
- WebSocket connections (Python version)
- Dark theme UI with animations