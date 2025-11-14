import * as path from 'path';
import * as os from 'os';

/**
 * Checks if a string is valid JSON
 * @param str String to check
 * @returns True if the string is valid JSON, false otherwise
 */
export function isJsonString(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Normalizes a path for the current platform
 * @param filePath Path to normalize
 * @returns Normalized path
 */
export function normalizePath(filePath: string): string {
  return path.normalize(filePath);
}

/**
 * Escapes a path for use in command line arguments
 * @param filePath Path to escape
 * @returns Escaped path
 */
export function escapePath(filePath: string): string {
  // Different escaping based on platform
  if (os.platform() === 'win32') {
    // On Windows, wrap in double quotes
    return `"${filePath}"`;
  } else {
    // On Unix-like systems, escape spaces and special characters
    return filePath.replace(/(["\s'$`\\])/g, '\\$1');
  }
}

/**
 * Parses JSON output from Restic, handling potential errors
 * @param output Output string from Restic
 * @returns Array of parsed JSON objects
 */
export function parseResticOutput(output: string): any[] {
  const results: any[] = [];
  const lines = output.trim().split('\n');
  
  for (const line of lines) {
    if (isJsonString(line)) {
      results.push(JSON.parse(line));
    }
  }
  
  return results;
}

/**
 * Gets the home directory path in a platform-independent way
 * @returns Home directory path
 */
export function getHomeDir(): string {
  return os.homedir();
}

/**
 * Checks if a command exists in the system PATH
 * @param command Command to check
 * @returns Promise that resolves to true if the command exists, false otherwise
 */
export async function commandExists(command: string): Promise<boolean> {
  const { exec } = require('child_process');
  const cmd = os.platform() === 'win32' 
    ? `where ${command}`
    : `which ${command}`;
  
  return new Promise((resolve) => {
    exec(cmd, (error: Error) => {
      resolve(!error);
    });
  });
}