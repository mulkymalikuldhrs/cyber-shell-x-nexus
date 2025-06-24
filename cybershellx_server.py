
#!/usr/bin/env python3
"""
CyberShellX Web Server
Web interface server for CyberShellX AI
Created by Mulky Maliku Dhaher
"""

import asyncio
import websockets
import json
import threading
import time
from datetime import datetime
from cybershellx import CyberMasterAI
import logging
from http.server import HTTPServer, SimpleHTTPRequestHandler
import os
import webbrowser

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CyberShellXWebServer:
    def __init__(self, host='localhost', websocket_port=8765, http_port=5173):
        self.host = host
        self.websocket_port = websocket_port
        self.http_port = http_port
        self.cyber_ai = CyberMasterAI()
        self.connected_clients = set()
        self.server_running = False
        
    async def handle_client(self, websocket, path):
        """Handle WebSocket client connections"""
        self.connected_clients.add(websocket)
        logger.info(f"New client connected. Total clients: {len(self.connected_clients)}")
        
        try:
            # Send welcome message
            await self.send_to_client(websocket, {
                "type": "system",
                "message": "Connected to CyberShellX AI",
                "status": "connected",
                "session_id": self.cyber_ai.session_id
            })
            
            async for message in websocket:
                try:
                    data = json.loads(message)
                    await self.process_command(websocket, data)
                except json.JSONDecodeError:
                    await self.send_error(websocket, "Invalid JSON format")
                except Exception as e:
                    await self.send_error(websocket, f"Error processing command: {str(e)}")
                    
        except websockets.exceptions.ConnectionClosed:
            logger.info("Client disconnected")
        finally:
            self.connected_clients.discard(websocket)
            
    async def send_to_client(self, websocket, data):
        """Send data to specific client"""
        try:
            await websocket.send(json.dumps(data))
        except websockets.exceptions.ConnectionClosed:
            self.connected_clients.discard(websocket)
            
    async def broadcast(self, data):
        """Broadcast data to all connected clients"""
        if self.connected_clients:
            await asyncio.gather(
                *[self.send_to_client(client, data) for client in self.connected_clients],
                return_exceptions=True
            )
            
    async def send_error(self, websocket, message):
        """Send error message to client"""
        await self.send_to_client(websocket, {
            "type": "error",
            "message": message,
            "timestamp": datetime.now().isoformat()
        })
        
    async def process_command(self, websocket, data):
        """Process incoming commands from web interface"""
        command_type = data.get("type")
        command = data.get("command", "")
        
        # Send acknowledgment
        await self.send_to_client(websocket, {
            "type": "ack",
            "message": f"Processing command: {command}",
            "timestamp": datetime.now().isoformat()
        })
        
        try:
            if command_type == "chat":
                # Handle chat messages
                response = self.cyber_ai.chat_with_ai(command)
                await self.send_to_client(websocket, {
                    "type": "chat_response",
                    "message": response or "No response from AI",
                    "timestamp": datetime.now().isoformat()
                })
                
            elif command_type == "install":
                # Handle tool installation
                tool_name = data.get("tool", "")
                if tool_name:
                    await self.send_to_client(websocket, {
                        "type": "status",
                        "message": f"Installing {tool_name}...",
                        "timestamp": datetime.now().isoformat()
                    })
                    
                    # Run installation in background
                    result = await asyncio.get_event_loop().run_in_executor(
                        None, self.cyber_ai.install_tool, tool_name
                    )
                    
                    await self.send_to_client(websocket, {
                        "type": "install_result",
                        "success": result,
                        "tool": tool_name,
                        "message": f"{'Successfully installed' if result else 'Failed to install'} {tool_name}",
                        "timestamp": datetime.now().isoformat()
                    })
                    
            elif command_type == "pentest":
                # Handle penetration testing
                target = data.get("target", "")
                scan_type = data.get("scan_type", "web")
                
                if target:
                    await self.send_to_client(websocket, {
                        "type": "status",
                        "message": f"Starting {scan_type} pentest on {target}...",
                        "timestamp": datetime.now().isoformat()
                    })
                    
                    # Run pentest in background
                    await asyncio.get_event_loop().run_in_executor(
                        None, self.cyber_ai.automated_pentest, target, scan_type
                    )
                    
                    await self.send_to_client(websocket, {
                        "type": "pentest_complete",
                        "target": target,
                        "scan_type": scan_type,
                        "message": f"Pentest completed for {target}",
                        "timestamp": datetime.now().isoformat()
                    })
                    
            elif command_type == "prepare":
                # Handle environment preparation
                env_type = data.get("environment", "")
                if env_type:
                    await self.send_to_client(websocket, {
                        "type": "status",
                        "message": f"Preparing {env_type} environment...",
                        "timestamp": datetime.now().isoformat()
                    })
                    
                    await asyncio.get_event_loop().run_in_executor(
                        None, self.cyber_ai.prepare_environment, env_type
                    )
                    
                    await self.send_to_client(websocket, {
                        "type": "environment_ready",
                        "environment": env_type,
                        "message": f"{env_type} environment is ready",
                        "timestamp": datetime.now().isoformat()
                    })
                    
            elif command_type == "execute":
                # Handle command execution
                cmd = data.get("command", "")
                if cmd:
                    await self.send_to_client(websocket, {
                        "type": "status",
                        "message": f"Executing: {cmd}",
                        "timestamp": datetime.now().isoformat()
                    })
                    
                    result = await asyncio.get_event_loop().run_in_executor(
                        None, self.cyber_ai.execute_command, cmd, True
                    )
                    
                    await self.send_to_client(websocket, {
                        "type": "command_result",
                        "command": cmd,
                        "output": result or "Command executed",
                        "timestamp": datetime.now().isoformat()
                    })
                    
            elif command_type == "get_tools":
                # Send list of installed tools
                await self.send_to_client(websocket, {
                    "type": "tools_list",
                    "tools": self.cyber_ai.installed_tools,
                    "timestamp": datetime.now().isoformat()
                })
                
            else:
                await self.send_error(websocket, f"Unknown command type: {command_type}")
                
        except Exception as e:
            logger.error(f"Error processing command: {str(e)}")
            await self.send_error(websocket, f"Command execution failed: {str(e)}")
    
    def start_websocket_server(self):
        """Start WebSocket server"""
        logger.info(f"Starting WebSocket server on {self.host}:{self.websocket_port}")
        start_server = websockets.serve(
            self.handle_client, 
            self.host, 
            self.websocket_port
        )
        
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(start_server)
        loop.run_forever()
    
    def start_server(self):
        """Start both WebSocket and HTTP servers"""
        self.server_running = True
        
        # Start WebSocket server in a separate thread
        ws_thread = threading.Thread(target=self.start_websocket_server)
        ws_thread.daemon = True
        ws_thread.start()
        
        # Give time for WebSocket server to start
        time.sleep(2)
        
        logger.info(f"CyberShellX Web Server started!")
        logger.info(f"WebSocket server: ws://{self.host}:{self.websocket_port}")
        logger.info(f"Web interface will be available at: http://{self.host}:{self.http_port}")
        logger.info("Connect your web browser to start using CyberShellX!")
        
        # Keep the main thread alive
        try:
            while self.server_running:
                time.sleep(1)
        except KeyboardInterrupt:
            logger.info("Shutting down server...")
            self.server_running = False

if __name__ == "__main__":
    print("""
╔══════════════════════════════════════════════════════════════════╗
║                  CyberShellX Web Server                          ║
║           Web Interface for CyberShellX AI                       ║
║                                                                  ║
║             Created by Mulky Maliku Dhaher                       ║
╚══════════════════════════════════════════════════════════════════╝
    """)
    
    server = CyberShellXWebServer()
    server.start_server()
