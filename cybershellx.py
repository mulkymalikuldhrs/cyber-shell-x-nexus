
import os
import sys
import json
import time
import requests
import subprocess
import platform
import uuid
import random
import re
import shutil
from datetime import datetime
from typing import Optional, List, Dict, Tuple

try:
    from colorama import init, Fore, Style
    init(autoreset=True)
except ImportError:
    print("Warning: colorama not installed. Installing now...")
    subprocess.run([sys.executable, "-m", "pip", "install", "colorama"], check=True)
    from colorama import init, Fore, Style
    init(autoreset=True)

# ==================== CONFIGURATION ====================
# API Keys - Your actual keys
OPENAI_API_KEY = "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"
OPENROUTER_API_KEY = "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"

DEFAULT_TOOLS = {
    "pentesting": ["nmap", "sqlmap", "metasploit", "burpsuite", "hydra", "wireshark", "john", "hashcat"],
    "osint": ["maltego", "theharvester", "recon-ng", "spiderfoot", "sherlock", "osintgram"],
    "blockchain": ["ganache", "truffle", "hardhat", "mythril", "slither", "foundry", "brownie"],
    "forensic": ["autopsy", "binwalk", "volatility", "foremost", "tsk", "guymager"],
    "web": ["nikto", "wpscan", "gobuster", "ffuf", "dirb", "whatweb"],
    "mobile": ["apktool", "jadx", "frida", "objection", "mobsf"],
    "network": ["ettercap", "tcpdump", "tshark", "bettercap", "responder"],
    "cloud": ["pacui", "cloudsploit", "scoutsuite", "cloudmapper"]
}

EXPERTISE_LEVELS = {
    1: "Beginner",
    2: "Intermediate", 
    3: "Advanced",
    4: "Expert",
    5: "Master"
}

# ==================== ASCII ART ====================
CYBERSHELLX_ASCII = f"""
{Fore.CYAN}
   ____      _                ____  _          _ _ __  __
  / ___|   _| |__   ___ _ __ / ___|| |__   ___| | |  \/  |
 | |  | | | | '_ \ / _ \ '__\___ \| '_ \ / _ \ | | |\/| |
 | |__| |_| | |_) |  __/ |   ___) | | | |  __/ | | |  | |
  \____\__, |_.__/ \___|_|  |____/|_| |_|\___|_|_|_|  |_|
       |___/                                              
{Fore.RED}    ____      _                 ____  _          _ _ __  __
   / ___|   _| |__   ___ _ __  / ___|| |__   ___| | |  \/  |
  | |  | | | | '_ \ / _ \ '__| \___ \| '_ \ / _ \ | | |\/| |
  | |__| |_| | |_) |  __/ |    ___) | | | |  __/ | | |  | |
   \____\__, |_.__/ \___|_|   |____/|_| |_|\___|_|_|_|  |_|
        |___/                                              
{Fore.GREEN}
╔══════════════════════════════════════════════════════════════════╗
║                  CyberShellX - v2.1.0                           ║
║           Autonomous Command Line AI Assistant                   ║
║                                                                  ║
║  🧠 Multi-Model AI Router | 🚀 Self-Learning | ⚡ Auto-Execute   ║
║  🔒 Security First | 🌐 Universal Platform | 🎯 Precision       ║
║                                                                  ║
║             Created by Mulky Maliku Dhaher                       ║
╚══════════════════════════════════════════════════════════════════╝
{Style.RESET_ALL}
"""

# ==================== AI PROVIDER ====================
class MultiAIProvider:
    def __init__(self):
        self.openai_key = OPENAI_API_KEY
        self.openrouter_key = OPENROUTER_API_KEY
        self.services = [
            self.query_openai,
            self.query_openrouter,
            self.query_puter,
            self.query_deepinfra,
            self.query_llama
        ]
        self.current_service = 0
        self.fallback_count = 0
    
    def query_openai(self, prompt: str) -> Optional[str]:
        """Query OpenAI GPT with your API key"""
        if not self.openai_key:
            return None
            
        try:
            response = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.openai_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-4",
                    "messages": [
                        {"role": "system", "content": "You are CyberShellX, an advanced cybersecurity AI assistant. Be precise, technical, and helpful."},
                        {"role": "user", "content": prompt}
                    ],
                    "max_tokens": 2000,
                    "temperature": 0.7
                },
                timeout=60
            )
            
            if response.status_code == 200:
                return response.json()["choices"][0]["message"]["content"]
            else:
                print(f"{Fore.YELLOW}OpenAI API Error: {response.status_code}{Style.RESET_ALL}")
                return None
                
        except Exception as e:
            print(f"{Fore.YELLOW}OpenAI connection failed: {str(e)}{Style.RESET_ALL}")
            return None
    
    def query_openrouter(self, prompt: str) -> Optional[str]:
        """Query OpenRouter with your API key"""
        if not self.openrouter_key:
            return None
            
        try:
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.openrouter_key}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://cybershellx.ai",
                    "X-Title": "CyberShellX"
                },
                json={
                    "model": "anthropic/claude-3-haiku",
                    "messages": [
                        {"role": "system", "content": "You are CyberShellX, an advanced cybersecurity AI assistant. Be precise, technical, and helpful."},
                        {"role": "user", "content": prompt}
                    ],
                    "max_tokens": 2000,
                    "temperature": 0.7
                },
                timeout=60
            )
            
            if response.status_code == 200:
                return response.json()["choices"][0]["message"]["content"]
            else:
                print(f"{Fore.YELLOW}OpenRouter API Error: {response.status_code}{Style.RESET_ALL}")
                return None
                
        except Exception as e:
            print(f"{Fore.YELLOW}OpenRouter connection failed: {str(e)}{Style.RESET_ALL}")
            return None
    
    def query_puter(self, prompt: str) -> Optional[str]:
        """Query Puter Cloud AI (free alternative)"""
        try:
            response = requests.post(
                "https://api.puter.com/v1/ai/chat",
                headers={
                    "Content-Type": "application/json",
                    "User-Agent": "CyberShellX/2.1.0"
                },
                json={
                    "messages": [
                        {"role": "system", "content": "You are CyberShellX, an advanced cybersecurity AI assistant."},
                        {"role": "user", "content": prompt}
                    ],
                    "model": "gpt-3.5-turbo",
                    "max_tokens": 2000,
                    "temperature": 0.7
                },
                timeout=60
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'choices' in data and len(data['choices']) > 0:
                    return data['choices'][0]['message']['content']
            return None
                
        except Exception as e:
            print(f"{Fore.YELLOW}Puter connection failed: {str(e)}{Style.RESET_ALL}")
            return None
    
    def query_deepinfra(self, prompt: str) -> Optional[str]:
        """Query DeepInfra free tier"""
        try:
            response = requests.post(
                "https://api.deepinfra.com/v1/openai/chat/completions",
                headers={"Content-Type": "application/json"},
                json={
                    "model": "meta-llama/Meta-Llama-3-70B-Instruct",
                    "messages": [
                        {"role": "system", "content": "You are CyberShellX, an advanced cybersecurity AI assistant."},
                        {"role": "user", "content": prompt}
                    ],
                    "max_tokens": 2000,
                    "temperature": 0.7
                },
                timeout=60
            )
            
            if response.status_code == 200:
                return response.json()["choices"][0]["message"]["content"]
            return None
                
        except Exception as e:
            print(f"{Fore.YELLOW}DeepInfra connection failed: {str(e)}{Style.RESET_ALL}")
            return None
    
    def query_llama(self, prompt: str) -> Optional[str]:
        """Query LLaMA through HuggingFace"""
        try:
            response = requests.post(
                "https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf",
                headers={"Content-Type": "application/json"},
                json={
                    "inputs": f"System: You are CyberShellX, an advanced cybersecurity AI assistant.\n\nUser: {prompt}\n\nAssistant:",
                    "parameters": {
                        "max_new_tokens": 2000,
                        "temperature": 0.7,
                        "return_full_text": False
                    }
                },
                timeout=60
            )
            
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list) and len(result) > 0:
                    return result[0].get("generated_text", "").strip()
            return None
                
        except Exception as e:
            print(f"{Fore.YELLOW}LLaMA connection failed: {str(e)}{Style.RESET_ALL}")
            return None
    
    def query(self, prompt: str) -> Optional[str]:
        """Query AI with intelligent fallback system"""
        print(f"{Fore.CYAN}🤖 Querying AI providers...{Style.RESET_ALL}")
        
        # Try each service
        for attempt in range(len(self.services)):
            service_name = self.services[self.current_service].__name__.replace('query_', '').upper()
            print(f"{Fore.YELLOW}Trying {service_name}...{Style.RESET_ALL}")
            
            response = self.services[self.current_service](prompt)
            
            if response and len(response.strip()) > 10:  # Valid response check
                print(f"{Fore.GREEN}✅ Response received from {service_name}{Style.RESET_ALL}")
                self.fallback_count = 0
                return response.strip()
            
            # Move to next service
            self.current_service = (self.current_service + 1) % len(self.services)
            self.fallback_count += 1
            
            if attempt < len(self.services) - 1:
                print(f"{Fore.YELLOW}Falling back to next provider...{Style.RESET_ALL}")
                time.sleep(1)
        
        print(f"{Fore.RED}❌ All AI providers failed{Style.RESET_ALL}")
        return None

# ==================== MAIN CLASS ====================
class CyberShellX:
    def __init__(self):
        self.session_id = str(uuid.uuid4())[:8]
        self.base_dir = os.path.join(os.path.expanduser("~"), ".cybershellx")
        self.tools_dir = os.path.join(self.base_dir, "tools")
        self.data_dir = os.path.join(self.base_dir, "data")
        self.logs_dir = os.path.join(self.base_dir, "logs")
        self.memory_dir = os.path.join(self.base_dir, "memory")
        self.config_file = os.path.join(self.base_dir, "config.json")
        self.log_file = os.path.join(self.logs_dir, f"session_{self.session_id}.log")
        self.os_type = platform.system().lower()
        self.arch = platform.machine().lower()
        self.installed_tools = []
        self.expertise = {}
        self.conversation_history = []
        self.ai_provider = MultiAIProvider()
        self.commands_executed = 0
        self.start_time = datetime.now()
        
        # Setup and initialize
        self.setup_environment()
        self.load_config()
        self.scan_installed_tools()
        
        # Display banner
        print(CYBERSHELLX_ASCII)
        print(f"{Fore.CYAN}Session ID: {self.session_id} | Platform: {self.os_type.title()} {self.arch}{Style.RESET_ALL}")
        print(f"{Fore.GREEN}🚀 CyberShellX initialized successfully{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}💡 Type 'help' for commands or just chat with me!{Style.RESET_ALL}")
        print("="*80)
        
        self.log("CyberShellX v2.1.0 initialized", "SUCCESS")

    def setup_environment(self):
        """Initialize all required directories"""
        dirs = [self.base_dir, self.tools_dir, self.data_dir, self.logs_dir, self.memory_dir]
        for directory in dirs:
            os.makedirs(directory, exist_ok=True)

    def load_config(self):
        """Load or create configuration"""
        default_config = {
            "version": "2.1.0",
            "auto_install": True,
            "safety_mode": True,
            "expertise": {
                "pentesting": 1,
                "osint": 1,
                "blockchain": 1,
                "forensic": 1,
                "web": 1,
                "mobile": 1,
                "network": 1,
                "cloud": 1,
                "overall": 1
            },
            "preferences": {
                "verbosity": "normal",
                "auto_update": True,
                "learning_mode": True
            }
        }
        
        if os.path.exists(self.config_file):
            try:
                with open(self.config_file, 'r') as f:
                    self.config = json.load(f)
                    self.expertise = self.config.get("expertise", default_config["expertise"])
            except:
                self.config = default_config
        else:
            self.config = default_config
            
        # Save updated config
        with open(self.config_file, 'w') as f:
            json.dump(self.config, f, indent=4)

    def log(self, message: str, level: str = "INFO"):
        """Enhanced logging with color coding"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"[{timestamp}] [{level}] {message}"
        
        # Color coding
        colors = {
            "ERROR": Fore.RED,
            "WARNING": Fore.YELLOW, 
            "SUCCESS": Fore.GREEN,
            "INFO": Fore.CYAN,
            "EXECUTE": Fore.MAGENTA,
            "AI": Fore.BLUE
        }
        
        color = colors.get(level, Fore.WHITE)
        print(f"{color}[{level}] {message}{Style.RESET_ALL}")
        
        # Write to log file
        try:
            with open(self.log_file, 'a', encoding='utf-8') as f:
                f.write(log_entry + "\n")
        except:
            pass

    def scan_installed_tools(self):
        """Comprehensive tool scanning"""
        self.log("🔍 Scanning installed tools...", "INFO")
        tools = set()
        
        # Common tools via which/where
        common_tools = [
            "python", "python3", "pip", "git", "docker", "node", "npm", "go", "ruby", "java",
            "nmap", "wget", "curl", "netcat", "nc", "ssh", "scp", "rsync", "vim", "nano",
            "grep", "awk", "sed", "find", "locate", "ps", "top", "htop", "lsof", "ss", "netstat"
        ]
        
        for tool in common_tools:
            if shutil.which(tool):
                tools.add(tool)
        
        # Platform-specific scanning
        if self.os_type == "linux":
            try:
                # Debian/Ubuntu packages
                result = subprocess.run(["dpkg", "-l"], capture_output=True, text=True, timeout=10)
                if result.returncode == 0:
                    for line in result.stdout.split('\n'):
                        if line.startswith('ii '):
                            parts = line.split()
                            if len(parts) >= 2:
                                tools.add(parts[1])
            except:
                pass
                
            try:
                # RPM packages (RHEL/CentOS/Fedora)
                result = subprocess.run(["rpm", "-qa"], capture_output=True, text=True, timeout=10)
                if result.returncode == 0:
                    for line in result.stdout.split('\n'):
                        if line.strip():
                            # Extract package name before version
                            pkg_name = re.split(r'-\d', line)[0]
                            tools.add(pkg_name)
            except:
                pass
        
        # Python packages
        try:
            result = subprocess.run([sys.executable, "-m", "pip", "list", "--format=freeze"], 
                                  capture_output=True, text=True, timeout=15)
            if result.returncode == 0:
                for line in result.stdout.split('\n'):
                    if '==' in line:
                        tools.add(line.split('==')[0])
        except:
            pass
        
        self.installed_tools = sorted(list(tools))
        self.log(f"✅ Found {len(self.installed_tools)} installed tools", "SUCCESS")

    def query_ai(self, prompt: str, context: str = "") -> Optional[str]:
        """Enhanced AI querying with context"""
        # Build conversation context
        if self.conversation_history:
            recent_context = "\n".join([
                f"Human: {entry['human']}\nAI: {entry['ai']}" 
                for entry in self.conversation_history[-3:]  # Last 3 exchanges
            ])
            full_prompt = f"Previous conversation:\n{recent_context}\n\nCurrent request: {prompt}"
        else:
            full_prompt = prompt
            
        if context:
            full_prompt = f"Context: {context}\n\n{full_prompt}"
        
        response = self.ai_provider.query(full_prompt)
        
        if response:
            # Clean and process response
            response = re.sub(r'<\|.*?\|>', '', response)  # Remove special tags
            response = response.strip()
            
            # Save to conversation history
            self.conversation_history.append({
                "human": prompt,
                "ai": response,
                "timestamp": datetime.now().isoformat()
            })
            
            # Limit history size
            if len(self.conversation_history) > 50:
                self.conversation_history = self.conversation_history[-25:]
                
            self.log("AI response received", "AI")
        
        return response

    def execute_command(self, command: str, safe_mode: bool = None) -> Optional[str]:
        """Enhanced command execution with safety checks"""
        if safe_mode is None:
            safe_mode = self.config.get("safety_mode", True)
            
        # Dangerous command patterns
        dangerous_patterns = [
            r'rm\s+-rf\s+/',
            r'dd\s+if=.*of=/dev/',
            r'mkfs\.',
            r'fdisk',
            r'parted',
            r'shutdown',
            r'reboot',
            r'halt'
        ]
        
        # Check for dangerous commands
        if safe_mode:
            for pattern in dangerous_patterns:
                if re.search(pattern, command, re.IGNORECASE):
                    self.log(f"⚠️ Potentially dangerous command detected: {command}", "WARNING")
                    confirm = input(f"{Fore.YELLOW}Execute anyway? [y/N]: {Style.RESET_ALL}")
                    if confirm.lower() != 'y':
                        self.log("Command execution cancelled by user", "INFO")
                        return None
        
        try:
            self.log(f"Executing: {command}", "EXECUTE")
            self.commands_executed += 1
            
            # Execute command
            start_time = time.time()
            result = subprocess.run(
                command,
                shell=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                timeout=300  # 5 minute timeout
            )
            execution_time = time.time() - start_time
            
            if result.returncode == 0:
                output = result.stdout.strip()
                self.log(f"✅ Command completed in {execution_time:.2f}s", "SUCCESS")
                if output:
                    print(f"{Fore.WHITE}{output}{Style.RESET_ALL}")
                return output
            else:
                error = result.stderr.strip()
                self.log(f"❌ Command failed (exit code {result.returncode}): {error}", "ERROR")
                return None
                
        except subprocess.TimeoutExpired:
            self.log("⏰ Command timed out after 5 minutes", "ERROR")
            return None
        except Exception as e:
            self.log(f"❌ Execution error: {str(e)}", "ERROR")
            return None

    def install_tool(self, tool_name: str) -> bool:
        """AI-powered tool installation"""
        if tool_name.lower() in [t.lower() for t in self.installed_tools]:
            self.log(f"✅ {tool_name} is already installed", "INFO")
            return True
            
        self.log(f"🔧 Installing {tool_name}...", "INFO")
        
        # Query AI for installation strategy
        prompt = f"""
        I need to install '{tool_name}' on {self.os_type} {self.arch}.
        
        Provide the installation command(s) as a JSON response:
        {{
            "commands": ["command1", "command2"],
            "verify": "verification_command",
            "notes": "important_notes"
        }}
        
        Consider package managers: apt, yum, dnf, pacman, brew, pip, npm, gem, cargo
        """
        
        response = self.query_ai(prompt)
        if not response:
            self.log("❌ Failed to get installation instructions", "ERROR")
            return False
            
        try:
            # Extract JSON from response
            json_match = re.search(r'\{[\s\S]*\}', response)
            if json_match:
                instructions = json.loads(json_match.group())
            else:
                self.log("❌ Could not parse AI response", "ERROR")
                return False
            
            # Execute installation commands
            for cmd in instructions.get("commands", []):
                result = self.execute_command(cmd)
                if result is None:
                    self.log(f"❌ Installation command failed: {cmd}", "ERROR")
                    return False
            
            # Verify installation
            if "verify" in instructions:
                verify_result = self.execute_command(instructions["verify"])
                if verify_result is not None:
                    self.log(f"✅ {tool_name} installed and verified successfully", "SUCCESS")
                    self.installed_tools.append(tool_name.lower())
                    return True
                else:
                    self.log(f"⚠️ {tool_name} installed but verification failed", "WARNING")
                    return False
            
            self.log(f"✅ {tool_name} installation completed", "SUCCESS")
            self.installed_tools.append(tool_name.lower())
            return True
            
        except Exception as e:
            self.log(f"❌ Installation error: {str(e)}", "ERROR")
            return False

    def chat_mode(self, message: str):
        """Enhanced chat with AI"""
        if not message.strip():
            return
            
        print(f"\n{Fore.BLUE}🤖 CyberShellX AI:{Style.RESET_ALL}")
        
        # Add system context
        context = f"System: {self.os_type} {self.arch}, Tools: {len(self.installed_tools)} installed, Session: {self.session_id}"
        
        response = self.query_ai(message, context)
        
        if response:
            # Check if response contains commands to execute
            command_pattern = r'```(?:bash|sh|shell)?\n(.*?)\n```'
            commands = re.findall(command_pattern, response, re.DOTALL)
            
            # Display response
            print(f"{Fore.WHITE}{response}{Style.RESET_ALL}")
            
            # Offer to execute commands found in response
            if commands:
                print(f"\n{Fore.YELLOW}🔧 Found commands in response. Execute them?{Style.RESET_ALL}")
                for i, cmd in enumerate(commands, 1):
                    cmd = cmd.strip()
                    print(f"{Fore.CYAN}{i}. {cmd}{Style.RESET_ALL}")
                
                choice = input(f"\n{Fore.YELLOW}Execute which command? (1-{len(commands)}, 'all', or 'none'): {Style.RESET_ALL}")
                
                if choice.lower() == 'all':
                    for cmd in commands:
                        self.execute_command(cmd.strip())
                elif choice.isdigit() and 1 <= int(choice) <= len(commands):
                    self.execute_command(commands[int(choice)-1].strip())
                elif choice.lower() != 'none':
                    print(f"{Fore.YELLOW}Invalid choice. Skipping command execution.{Style.RESET_ALL}")
        else:
            print(f"{Fore.RED}❌ Sorry, I couldn't process your request right now.{Style.RESET_ALL}")

    def show_stats(self):
        """Display session statistics"""
        uptime = datetime.now() - self.start_time
        print(f"\n{Fore.CYAN}📊 CyberShellX Statistics{Style.RESET_ALL}")
        print(f"Session ID: {self.session_id}")
        print(f"Uptime: {str(uptime).split('.')[0]}")
        print(f"Commands executed: {self.commands_executed}")
        print(f"AI conversations: {len(self.conversation_history)}")
        print(f"Tools available: {len(self.installed_tools)}")
        print(f"Platform: {self.os_type.title()} {self.arch}")

    def interactive_mode(self):
        """Enhanced interactive command interface"""
        self.log("🚀 Entering interactive mode", "INFO")
        
        while True:
            try:
                # Enhanced prompt
                prompt_color = Fore.GREEN if self.os_type == "linux" else Fore.BLUE
                user_input = input(f"\n{prompt_color}cybershellx{Fore.YELLOW}@{self.session_id}{Fore.WHITE}> {Style.RESET_ALL}").strip()
                
                if not user_input:
                    continue
                    
                # Handle special commands
                if user_input.lower() in ['exit', 'quit', 'bye']:
                    self.log("👋 Goodbye!", "INFO")
                    break
                    
                elif user_input.lower() == 'help':
                    print(f"\n{Fore.CYAN}🔧 CyberShellX Commands:{Style.RESET_ALL}")
                    print(f"{Fore.GREEN}System Commands:{Style.RESET_ALL}")
                    print(f"  install <tool>     - Install cybersecurity tool")
                    print(f"  scan tools         - Rescan installed tools")
                    print(f"  stats             - Show session statistics")
                    print(f"  clear             - Clear screen")
                    print(f"\n{Fore.GREEN}AI Commands:{Style.RESET_ALL}")
                    print(f"  chat <message>    - Chat with AI")
                    print(f"  analyze <file>    - Analyze file with AI")
                    print(f"  explain <command> - Explain command")
                    print(f"\n{Fore.GREEN}Security Commands:{Style.RESET_ALL}")
                    print(f"  pentest <target>  - Start penetration test")
                    print(f"  audit <contract>  - Audit smart contract")
                    print(f"  osint <target>    - OSINT investigation")
                    print(f"\n{Fore.GREEN}Other:{Style.RESET_ALL}")
                    print(f"  exec <command>    - Execute system command")
                    print(f"  exit/quit         - Exit CyberShellX")
                    print(f"\n{Fore.YELLOW}💡 Tip: You can also chat naturally - just type your question!{Style.RESET_ALL}")
                    
                elif user_input.lower().startswith('install '):
                    tool = user_input[8:].strip()
                    self.install_tool(tool)
                    
                elif user_input.lower() == 'scan tools':
                    self.scan_installed_tools()
                    
                elif user_input.lower() == 'stats':
                    self.show_stats()
                    
                elif user_input.lower() == 'clear':
                    os.system('clear' if self.os_type != 'windows' else 'cls')
                    print(CYBERSHELLX_ASCII)
                    
                elif user_input.lower().startswith('exec '):
                    command = user_input[5:].strip()
                    self.execute_command(command)
                    
                elif user_input.lower().startswith('chat '):
                    message = user_input[5:].strip()
                    self.chat_mode(message)
                    
                elif user_input.lower().startswith('pentest '):
                    target = user_input[8:].strip()
                    self.chat_mode(f"Create a comprehensive penetration testing plan for {target}")
                    
                elif user_input.lower().startswith('audit '):
                    contract = user_input[6:].strip()
                    self.chat_mode(f"Perform a smart contract security audit for {contract}")
                    
                elif user_input.lower().startswith('osint '):
                    target = user_input[6:].strip()
                    self.chat_mode(f"Create an OSINT investigation plan for {target}")
                    
                elif user_input.lower().startswith('analyze '):
                    filename = user_input[8:].strip()
                    if os.path.exists(filename):
                        try:
                            with open(filename, 'r', encoding='utf-8') as f:
                                content = f.read()[:5000]  # Limit content size
                            self.chat_mode(f"Analyze this file ({filename}):\n\n{content}")
                        except:
                            self.log(f"❌ Could not read file: {filename}", "ERROR")
                    else:
                        self.log(f"❌ File not found: {filename}", "ERROR")
                        
                elif user_input.lower().startswith('explain '):
                    command = user_input[8:].strip()
                    self.chat_mode(f"Explain this command and its usage: {command}")
                    
                else:
                    # Treat as natural language chat
                    self.chat_mode(user_input)
                    
            except KeyboardInterrupt:
                print(f"\n{Fore.YELLOW}Use 'exit' to quit properly{Style.RESET_ALL}")
                continue
            except Exception as e:
                self.log(f"❌ Error: {str(e)}", "ERROR")

if __name__ == "__main__":
    try:
        print(f"{Fore.CYAN}🚀 Starting CyberShellX...{Style.RESET_ALL}")
        cybershellx = CyberShellX()
        cybershellx.interactive_mode()
    except KeyboardInterrupt:
        print(f"\n{Fore.RED}🛑 CyberShellX terminated by user{Style.RESET_ALL}")
        sys.exit(0)
    except Exception as e:
        print(f"\n{Fore.RED}💥 Critical error: {str(e)}{Style.RESET_ALL}")
        sys.exit(1)
