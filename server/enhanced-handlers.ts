import fs from 'fs';
import path from 'path';
import { aiProviderManager } from './ai-provider-manager';
import { commandExecutor, CommandResult } from './command-executor';

export class EnhancedHandlers {
  
  async handleEnhancedProgramming(originalRequest: string, analysis: any, mode: string): Promise<any> {
    const results: any = {
      message: 'Enhanced programming task completed',
      data: '',
      files_created: [],
      files_modified: [],
      commands_executed: [],
      command_outputs: [],
      tools_used: [],
      project_structure: [],
      execution_plan: analysis.execution_plan || []
    };

    try {
      // Generate enhanced code with full context
      const enhancedPrompt = `
You are an expert ${analysis.language || 'programming'} developer. 

User Request: "${originalRequest}"
Project Type: ${analysis.project_type}
Framework: ${analysis.framework}
Complexity: ${analysis.complexity}

Create a complete, production-ready solution including:
1. Main application code
2. Configuration files
3. Dependencies/requirements
4. Documentation
5. Tests (if applicable)
6. Deployment instructions

Make it fully functional and ready to run. Include proper error handling, logging, and best practices.
`;

      const aiResponse = await aiProviderManager.generateContent(enhancedPrompt, 'programming');
      results.data = aiResponse;

      // Create files from analysis
      if (analysis.files_to_create && analysis.files_to_create.length > 0) {
        for (const fileSpec of analysis.files_to_create) {
          const filePath = path.join(commandExecutor.getWorkingDirectory(), fileSpec.path);
          
          // Create directory if needed
          const dir = path.dirname(filePath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          
          // Write file content
          fs.writeFileSync(filePath, fileSpec.content, 'utf8');
          results.files_created.push(fileSpec.path);
          results.project_structure.push(fileSpec.path);
        }
      }

      // Execute setup commands
      if (analysis.commands && analysis.commands.length > 0) {
        for (const cmdSpec of analysis.commands.sort((a, b) => a.order - b.order)) {
          if (cmdSpec.safe !== false) {
            const result = await commandExecutor.executeCommand(cmdSpec.command);
            results.commands_executed.push(cmdSpec.command);
            results.command_outputs.push(result);
            
            if (!result.success) {
              results.message += `\n⚠️ Command failed: ${cmdSpec.command} - ${result.error}`;
            }
          }
        }
      }

      // Install dependencies
      if (analysis.dependencies && analysis.dependencies.length > 0) {
        for (const dep of analysis.dependencies) {
          const result = await commandExecutor.installDependency(dep.manager, dep.package);
          results.commands_executed.push(`${dep.manager} install ${dep.package}`);
          results.command_outputs.push(result);
        }
      }

      return results;
    } catch (error) {
      results.message = `Programming task failed: ${error.message}`;
      return results;
    }
  }

  async handleProjectSetup(analysis: any, mode: string): Promise<any> {
    const results: any = {
      message: 'Project setup completed',
      data: '',
      files_created: [],
      files_modified: [],
      commands_executed: [],
      command_outputs: [],
      tools_used: analysis.tools_needed || [],
      project_structure: [],
      execution_plan: analysis.execution_plan || []
    };

    try {
      const projectName = this.extractProjectName(analysis.intent) || 'new-project';
      const projectType = analysis.project_type || 'general';
      
      // Setup project using command executor
      const setupResults = await commandExecutor.setupProject(
        projectType as any, 
        projectName
      );
      
      setupResults.forEach(result => {
        results.commands_executed.push(result.command);
        results.command_outputs.push(result);
        
        if (result.success) {
          results.message += `\n✅ ${result.command}`;
        } else {
          results.message += `\n❌ ${result.command} - ${result.error}`;
        }
      });

      // Generate project structure
      results.project_structure = this.generateProjectStructure(projectType, analysis.framework);
      
      // Create additional files based on analysis
      if (analysis.files_to_create) {
        for (const fileSpec of analysis.files_to_create) {
          const filePath = path.join(commandExecutor.getWorkingDirectory(), projectName, fileSpec.path);
          const dir = path.dirname(filePath);
          
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          
          fs.writeFileSync(filePath, fileSpec.content, 'utf8');
          results.files_created.push(fileSpec.path);
        }
      }

      results.data = `Project "${projectName}" created successfully with ${projectType} structure.`;
      return results;
    } catch (error) {
      results.message = `Project setup failed: ${error.message}`;
      return results;
    }
  }

  async handleToolExecution(analysis: any, mode: string): Promise<any> {
    const results: any = {
      message: 'Tool execution completed',
      data: '',
      files_created: [],
      files_modified: [],
      commands_executed: [],
      command_outputs: [],
      tools_used: [],
      project_structure: [],
      execution_plan: analysis.execution_plan || []
    };

    try {
      if (analysis.commands && analysis.commands.length > 0) {
        for (const cmdSpec of analysis.commands.sort((a, b) => a.order - b.order)) {
          const result = await commandExecutor.executeCommand(cmdSpec.command, {
            timeout: 60000,
            requireConfirmation: !cmdSpec.safe
          });
          
          results.commands_executed.push(cmdSpec.command);
          results.command_outputs.push(result);
          results.tools_used.push(cmdSpec.type);
          
          if (result.success) {
            results.message += `\n✅ ${cmdSpec.description}: ${cmdSpec.command}`;
            results.data += `\n${result.output}`;
          } else {
            results.message += `\n❌ ${cmdSpec.description} failed: ${result.error}`;
          }
        }
      }

      return results;
    } catch (error) {
      results.message = `Tool execution failed: ${error.message}`;
      return results;
    }
  }

  async handleMultiStepAutomation(analysis: any, mode: string): Promise<any> {
    const results: any = {
      message: 'Multi-step automation completed',
      data: '',
      files_created: [],
      files_modified: [],
      commands_executed: [],
      command_outputs: [],
      tools_used: [],
      project_structure: [],
      execution_plan: analysis.execution_plan || []
    };

    try {
      // Execute each step in the execution plan
      for (let i = 0; i < results.execution_plan.length; i++) {
        const step = results.execution_plan[i];
        results.message += `\n🔄 Step ${i + 1}: ${step}`;
        
        // Find corresponding commands for this step
        const stepCommands = analysis.commands?.filter(cmd => cmd.order === i + 1) || [];
        
        for (const cmdSpec of stepCommands) {
          const result = await commandExecutor.executeCommand(cmdSpec.command);
          results.commands_executed.push(cmdSpec.command);
          results.command_outputs.push(result);
          results.tools_used.push(cmdSpec.type);
          
          if (!result.success && cmdSpec.type !== 'optional') {
            throw new Error(`Critical step failed: ${cmdSpec.command} - ${result.error}`);
          }
        }
        
        results.message += ` ✅`;
      }

      results.data = 'All automation steps completed successfully.';
      return results;
    } catch (error) {
      results.message += `\n❌ Automation failed: ${error.message}`;
      return results;
    }
  }

  async handleGitOperation(analysis: any, mode: string): Promise<any> {
    const results: any = {
      message: 'Git operation completed',
      data: '',
      files_created: [],
      files_modified: [],
      commands_executed: [],
      command_outputs: [],
      tools_used: ['git'],
      project_structure: [],
      execution_plan: analysis.execution_plan || []
    };

    try {
      // Determine git operation from commands
      for (const cmdSpec of analysis.commands || []) {
        if (cmdSpec.type === 'git') {
          const result = await commandExecutor.executeCommand(cmdSpec.command);
          results.commands_executed.push(cmdSpec.command);
          results.command_outputs.push(result);
          
          if (result.success) {
            results.message += `\n✅ ${cmdSpec.description}`;
            results.data += `\n${result.output}`;
          } else {
            results.message += `\n❌ ${cmdSpec.description} failed: ${result.error}`;
          }
        }
      }

      return results;
    } catch (error) {
      results.message = `Git operation failed: ${error.message}`;
      return results;
    }
  }

  async handleDependencyManagement(analysis: any, mode: string): Promise<any> {
    const results: any = {
      message: 'Dependency management completed',
      data: '',
      files_created: [],
      files_modified: [],
      commands_executed: [],
      command_outputs: [],
      tools_used: [],
      project_structure: [],
      execution_plan: analysis.execution_plan || []
    };

    try {
      if (analysis.dependencies && analysis.dependencies.length > 0) {
        for (const dep of analysis.dependencies) {
          const result = await commandExecutor.installDependency(
            dep.manager, 
            dep.version ? `${dep.package}@${dep.version}` : dep.package
          );
          
          results.commands_executed.push(`${dep.manager} install ${dep.package}`);
          results.command_outputs.push(result);
          results.tools_used.push(dep.manager);
          
          if (result.success) {
            results.message += `\n✅ Installed ${dep.package}`;
          } else {
            results.message += `\n❌ Failed to install ${dep.package}: ${result.error}`;
          }
        }
      }

      // Create/update dependency files
      if (analysis.files_to_create) {
        for (const fileSpec of analysis.files_to_create) {
          if (fileSpec.path.includes('package.json') || fileSpec.path.includes('requirements.txt') || 
              fileSpec.path.includes('composer.json') || fileSpec.path.includes('Gemfile')) {
            const filePath = path.join(commandExecutor.getWorkingDirectory(), fileSpec.path);
            fs.writeFileSync(filePath, fileSpec.content, 'utf8');
            results.files_created.push(fileSpec.path);
          }
        }
      }

      results.data = 'Dependencies installed and configured successfully.';
      return results;
    } catch (error) {
      results.message = `Dependency management failed: ${error.message}`;
      return results;
    }
  }

  private extractProjectName(intent: string): string {
    const words = intent.toLowerCase().split(' ');
    const createIndex = words.findIndex(word => word.includes('create'));
    
    if (createIndex !== -1 && createIndex < words.length - 1) {
      return words[createIndex + 1].replace(/[^a-zA-Z0-9-_]/g, '');
    }
    
    return 'new-project';
  }

  private generateProjectStructure(projectType: string, framework: string): string[] {
    const structures: Record<string, string[]> = {
      web: [
        'src/',
        'src/components/',
        'src/pages/',
        'src/utils/',
        'public/',
        'package.json',
        'README.md',
        '.gitignore'
      ],
      api: [
        'src/',
        'src/routes/',
        'src/controllers/',
        'src/models/',
        'src/middleware/',
        'tests/',
        'package.json',
        'README.md',
        '.env.example',
        '.gitignore'
      ],
      cli: [
        'src/',
        'bin/',
        'lib/',
        'tests/',
        'package.json',
        'README.md',
        '.gitignore'
      ],
      mobile: [
        'src/',
        'src/screens/',
        'src/components/',
        'src/navigation/',
        'src/services/',
        'assets/',
        'package.json',
        'README.md'
      ]
    };

    return structures[projectType] || structures.web;
  }
}

export const enhancedHandlers = new EnhancedHandlers();
