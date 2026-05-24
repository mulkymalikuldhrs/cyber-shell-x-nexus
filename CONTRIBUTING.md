# Contributing to CyberShellX Nexus

Thank you for your interest in contributing to CyberShellX Nexus! We value contributions from the cybersecurity and developer communities. This guide provides detailed instructions on how to participate effectively in the development of this platform.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Environment Setup](#development-environment-setup)
- [How to Contribute](#how-to-contribute)
- [Code Style and Conventions](#code-style-and-conventions)
- [Commit Message Format](#commit-message-format)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)
- [Adding Command Categories](#adding-command-categories)
- [AI Response Improvement](#ai-response-improvement)
- [Translation Contributions](#translation-contributions)
- [Security Vulnerability Reporting](#security-vulnerability-reporting)

---

## Code of Conduct

This project is committed to providing a welcoming and inclusive experience for everyone. We expect all contributors to:

- Be respectful and constructive in all interactions
- Focus on what is best for the community and the project
- Show empathy toward other community members
- Refrain from discriminatory, harassing, or offensive behavior
- Report unacceptable behavior to the project owner

---

## Getting Started

1. **Fork the repository** on GitHub: https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/cyber-shell-x-nexus.git
   cd cyber-shell-x-nexus
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Set up the database**:
   ```bash
   npm run db:push
   ```
6. **Start the development server**:
   ```bash
   npm run dev
   ```

---

## Development Environment Setup

### Prerequisites

- **Node.js** 18 or later (LTS recommended)
- **npm** 9 or later
- **PostgreSQL** 14 or later
- **Git** 2.30 or later
- A code editor with TypeScript support (VS Code recommended)

### Environment Configuration

Create a `.env` file in the project root with the following variables:

```env
GOOGLE_API_KEY=your_gemini_api_key
DATABASE_URL=postgresql://user:password@localhost:5432/cybershellx_dev
PORT=5000
NODE_ENV=development
```

### Recommended VS Code Extensions

- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- GitLens

---

## How to Contribute

### Types of Contributions We Welcome

- **Bug fixes**: Resolve existing issues and improve stability
- **New command categories**: Add cybersecurity tool categories to the knowledge base
- **AI response improvements**: Enhance the quality and depth of AI-generated explanations
- **UI/UX enhancements**: Improve the web dashboard interface and user experience
- **Documentation**: Improve existing docs or add new guides and tutorials
- **Translations**: Add or improve translations in README_id.md, README_zh.md, or new languages
- **Android features**: Extend the native voice assistant capabilities
- **Test coverage**: Add unit tests, integration tests, or end-to-end tests
- **Performance optimizations**: Improve response times, memory usage, or bundle size

### Contribution Workflow

1. **Check existing issues** or create a new one to discuss your proposed change
2. **Create a feature branch** from the latest `main`:
   ```bash
   git checkout main
   git pull upstream main
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** following our code style conventions
4. **Test your changes** thoroughly across all affected interfaces
5. **Commit your changes** using our commit message format
6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request** against the `main` branch

---

## Code Style and Conventions

### TypeScript

- Use TypeScript strict mode for all new files
- Prefer `interface` over `type` for object shapes
- Use explicit return types for exported functions
- Avoid `any` types; use `unknown` when type is truly unknown
- Use ESLint and Prettier configurations provided in the repository

### React Components

- Use functional components with hooks (no class components)
- Follow the shadcn/ui patterns for UI components
- Use Radix UI primitives for accessible component foundations
- Keep component files focused on a single responsibility
- Extract reusable logic into custom hooks

### Backend

- Use Express.js patterns consistent with the existing codebase
- Validate all input with Zod schemas
- Handle errors with appropriate HTTP status codes
- Log API operations using the built-in `log` utility
- Follow RESTful conventions for new endpoints

### General

- Maximum line length: 100 characters
- Use 2-space indentation (no tabs)
- Use single quotes for strings
- Add JSDoc comments for public APIs and complex functions
- Keep functions focused and under 50 lines when possible

---

## Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature (e.g., `feat(ai): add wireless security command category`)
- `fix`: Bug fix (e.g., `fix(websocket): resolve connection timeout issue`)
- `docs`: Documentation changes (e.g., `docs(api): update command endpoint examples`)
- `style`: Code style changes (formatting, no functional change)
- `refactor`: Code refactoring without feature changes
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, or tooling changes

### Examples

```
feat(commands): add bluetooth security assessment commands
fix(cli): resolve nmap simulation output formatting
docs(readme): add installation guide for macOS
refactor(ai): extract response formatting into utility functions
```

---

## Pull Request Process

1. **Ensure your branch is up to date** with `main`:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Verify all tests pass** and the application runs correctly:
   ```bash
   npm run dev
   ./launcher.sh status
   ```

3. **Write a clear PR description** that includes:
   - Summary of changes
   - Related issue number (if applicable)
   - Testing instructions
   - Screenshots for UI changes

4. **Keep PRs focused** -- one feature or fix per PR is preferred

5. **Respond to review feedback** promptly and constructively

6. **Squash commits** if requested during the review process

A maintainer will review your PR and provide feedback. Once approved, it will be merged into the `main` branch.

---

## Reporting Bugs

If you encounter a bug, please create a GitHub Issue with the following information:

- **Title**: Clear, concise description of the problem
- **Environment**: OS, Node.js version, browser (if applicable)
- **Steps to reproduce**: Detailed sequence of actions
- **Expected behavior**: What should have happened
- **Actual behavior**: What actually happened
- **Logs**: Relevant console output or error messages
- **Screenshots**: If the issue is visual

---

## Requesting Features

Feature requests are welcome. Please create a GitHub Issue with:

- **Title**: Clear description of the proposed feature
- **Problem statement**: What problem does this feature solve?
- **Proposed solution**: How would you like it to work?
- **Alternatives considered**: Other approaches you have thought about
- **Additional context**: Any relevant examples, references, or mockups

---

## Adding Command Categories

To add a new cybersecurity command category to the knowledge base:

1. Edit `cybershell-commands/commands.json` to add your category under the `categories` key
2. Follow the existing schema: name, icon, and commands array with command, description, syntax, examples, output_format, and difficulty
3. Add a corresponding handler method in `server/cybershell-ai.ts`
4. Register the pattern detection in the `processCommand` method
5. Test the new category across CLI and web interfaces
6. Update documentation to reference the new category

---

## AI Response Improvement

To improve existing AI responses:

1. Locate the relevant handler method in `server/cybershell-ai.ts`
2. Enhance the explanation content with more accurate technical details
3. Add practical examples that follow current industry best practices
4. Ensure legal notices are appropriate for the category
5. Test the enhanced response through both the REST API and WebSocket interface
6. Verify that the AI enhancement layer (Gemini API) does not override critical safety notices

---

## Translation Contributions

To add or improve translations:

1. Create a new `README_xx.md` file following the structure of the existing translations
2. Translate all content sections while maintaining technical accuracy
3. Keep code examples, URLs, and badge links untranslated
4. Add the new language to the language switcher in all README files
5. Ensure the translation reads naturally to native speakers

---

## Security Vulnerability Reporting

If you discover a security vulnerability in CyberShellX Nexus, please report it responsibly:

- **Do not** create a public GitHub Issue for security vulnerabilities
- Send a detailed report to: mulkymalikuldhaher@email.com
- Include steps to reproduce, affected versions, and potential impact
- Allow reasonable time for a response before any public disclosure

---

## Contact

**Project Owner**: Mulky Malikul Dhaher  
**Email**: mulkymalikuldhaher@email.com  
**GitHub**: [@mulkymalikuldhrs](https://github.com/mulkymalikuldhrs)  
**Repository**: https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus

Thank you for contributing to CyberShellX Nexus. Your efforts help make cybersecurity education and tools more accessible to everyone.
