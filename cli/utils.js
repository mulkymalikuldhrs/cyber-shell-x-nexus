import { exec, spawn } from 'child_process';

export const colors = {
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m'
};

export function commandExists(command) {
  return new Promise((resolve) => {
    exec(`command -v ${command}`, (error) => {
      resolve(!error);
    });
  });
}

export function getPackageManager() {
  return new Promise(resolve => {
    if (process.platform === 'darwin') {
      resolve('brew');
    } else if (process.platform === 'linux') {
      exec('command -v apt-get', (err) => {
        if (!err) {
          resolve('apt-get');
          return;
        }
        exec('command -v yum', (err) => {
          if (!err) {
            resolve('yum');
            return;
          }
          exec('command -v dnf', (err) => {
            if (!err) {
              resolve('dnf');
              return;
            }
            resolve(null);
          });
        });
      });
    } else {
      resolve(null);
    }
  });
}

export function log(level, message) {
  const prefix = {
    info: `${colors.cyan}[INFO]${colors.reset}`,
    warn: `${colors.yellow}[WARN]${colors.reset}`,
    error: `${colors.red}[ERROR]${colors.reset}`,
    debug: `${colors.dim}[DEBUG]${colors.reset}`,
  }[level];
  console.log(`${prefix} ${message}`);
}

export function executeCommand(command, options = { pipe: false }) {
  return new Promise((resolve, reject) => {
    const stdioOption = options.pipe ? 'pipe' : 'inherit';
    const child = spawn(command, {
      shell: true,
      stdio: stdioOption,
    });

    let stdout = '';
    let stderr = '';

    if (options.pipe) {
      child.stdout.on('data', (data) => {
        stdout += data.toString();
        process.stdout.write(data); // Tetap tampilkan output secara real-time
      });
      child.stderr.on('data', (data) => {
        stderr += data.toString();
        process.stderr.write(data); // Tetap tampilkan error secara real-time
      });
    }

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ code, stdout, stderr });
      } else {
        reject({ code, stdout, stderr, message: `Command failed with exit code ${code}` });
      }
    });

    child.on('error', (err) => {
      reject({ code: 1, message: err.message, stdout, stderr });
    });
  });
}
