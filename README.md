# CyberShellX CLI 🛡️

CyberShellX CLI is an all-in-one, AI-powered pentesting platform. This tool is designed for security professionals, ethical hackers, and cybersecurity enthusiasts, providing a comprehensive toolset within a sleek, modern command-line interface.

## Key Features

- **Unified CLI Interface**: All tools and functionalities are accessible through a single, powerful CLI with progress indicators and colored output.
- **AI-Powered**: Leverage the power of large language models for command explanations, attack planning, and intelligent automation.
- **Feedback-Driven Automation**: The `automate` mode dynamically determines attack steps based on AI analysis of previous command outputs.
- **Session Management**: Automatically creates workspaces for each target, saving command history, outputs, and AI-extracted notes to resume sessions later.
- **Automated Tool Management**: Automatically checks for missing tools and offers to install them using your system's native package manager.

## Installation

1.  **Prerequisites**: Ensure you have Node.js (v18+) and a package manager (like `apt`, `yum`, `brew`) installed.

2.  **Clone the Repository:**
    ```bash
    git clone https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus.git
    cd cyber-shell-x-nexus
    ```

3.  **Install Node.js Dependencies:**
    ```bash
    npm install
    ```

4.  **Set Up Environment Variables:**
    Create a `.env` file in the root directory and add your Gemini API key. You can add multiple keys for fallback.
    ```
    GEMINI_API_KEY=AIz...
    GEMINI_API_KEY_2=AIz...
    ```

5.  **Install Pentesting Tools:**
    CyberShellX comes with a tool manager to help you install the necessary tools. Run the following command to check for missing tools and install them:
    ```bash
    ./launcher.sh tools
    ```

## Usage

### 1. Run the Backend Server

The backend server handles all AI processing. You should run it in a separate terminal.

```bash
npx tsx server/index.ts
```

### 2. Run the CyberShellX CLI

Once the server is running, open another terminal and start the CyberShellX CLI using the launcher:

```bash
./launcher.sh
```

### Available Commands

-   `help`: Displays the help menu with all available commands.
-   `status`: Shows the AI connection status and checked tool availability.
-   `automate`: Starts the feedback-driven automated pentesting mode. You will be prompted for a target and objectives.
-   `<command>`: Run any pentesting command (e.g., `nmap -sV target.com`). CyberShellX will provide an AI-enhanced explanation before executing.

## Architecture

-   **Backend**: An Express.js server that handles AI logic (using Google Gemini) and serves as the brain behind the CLI.
-   **Frontend (CLI)**: A modern Node.js command-line interface that interacts with the backend server, executes pentesting tools, and provides a rich UX with progress indicators.
-   **Session Management**: Creates and manages per-target workspaces under the `workspaces/` directory, storing history and AI-extracted notes.
-   **Tool Management**: A script that detects the OS and its package manager to automate tool installation.

## Contributing

Contributions are welcome! Please fork the repository, make your changes, and submit a pull request.

## Legal Disclaimer

This tool is intended for educational and authorized testing purposes only. Unauthorized use of this tool against systems for which you do not have explicit permission is illegal. The developers are not responsible for any misuse. Always obtain written permission before conducting a security assessment.