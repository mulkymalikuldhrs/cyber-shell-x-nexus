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

### Python Version (Fix asyncio issue first)
Replace the `start_websocket_server` function in your `cybershellx_server.py`:

```python
def start_websocket_server():
    import asyncio
    import websockets
    
    # Create new event loop for this thread
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    async def handler(websocket, path):
        try:
            async for message in websocket:
                # Process your WebSocket messages here
                await websocket.send(f"Received: {message}")
        except websockets.exceptions.ConnectionClosed:
            pass
    
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
```

Then run:
```bash
python cybershellx_server.py
```

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