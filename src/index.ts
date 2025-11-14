/**
 * ResticJS - A TypeScript library for interacting with the Restic backup tool
 * 
 * This library provides a convenient interface to the Restic command-line backup tool,
 * allowing you to perform backups, manage snapshots, and more from your Node.js applications.
 */

// Core classes
export { Repository } from './Repository';
export { Snapshot } from './Snapshot';
export { Commands } from './Commands';
export { request, requestSync, ResticError } from './CLIRequester';

// Utility functions
export { 
  isJsonString,
  normalizePath,
  escapePath,
  parseResticOutput,
  getHomeDir,
  commandExists
} from './Utils';

// Type definitions
export {
  ResticMessage,
  SnapshotSummary,
  BackupOptions,
  RestoreOptions,
  ForgetOptions,
  PruneOptions,
  CheckOptions,
  FindOptions,
  ListOptions,
  StatsOptions,
  TagOptions,
  MountOptions,
  DiffOptions,
  InitOptions,
  RepositoryOptions,
  CLIRequestOptions
} from './Types';

/**
 * Check if Restic is installed and available
 * @returns Promise that resolves to true if Restic is available, false otherwise
 */
export async function isResticAvailable(): Promise<boolean> {
  const { commandExists } = await import('./Utils');
  return commandExists('restic');
}

/**
 * Get the version of Restic
 * @returns Promise that resolves to the Restic version string
 */
export async function getResticVersion(): Promise<string> {
  const { request } = await import('./CLIRequester');
  const { Commands } = await import('./Commands');
  
  try {
    const result = await request({
      command: Commands.VERSION
    }) as any[];
    
    if (result && result.length > 0 && result[0].version) {
      return result[0].version;
    }
    
    return 'unknown';
  } catch (error) {
    return 'unavailable';
  }
}

/**
 * Create a new repository
 * @param path Repository path
 * @param password Repository password
 * @param passwordFile Repository password file
 * @param options Additional options
 * @returns Promise that resolves to the initialized repository
 */
export async function createRepository(
  path: string,
  password?: string,
  passwordFile?: string,
  options?: Partial<import('./Types').InitOptions>
): Promise<import('./Repository').Repository> {
  const { Repository } = await import('./Repository');
  const repository = new Repository(path, password, passwordFile);
  await repository.init(options);
  return repository;
}

/**
 * Open an existing repository
 * @param path Repository path
 * @param password Repository password
 * @param passwordFile Repository password file
 * @returns Promise that resolves to the opened repository
 */
export async function openRepository(
  path: string,
  password?: string,
  passwordFile?: string
): Promise<import('./Repository').Repository> {
  const { Repository } = await import('./Repository');
  const repository = new Repository(path, password, passwordFile);
  await repository.loadSnapshots();
  return repository;
}

// Example usage:
/*
async function example() {
  // Check if restic is available
  const available = await isResticAvailable();
  if (!available) {
    console.error('Restic is not installed or not in PATH');
    return;
  }
  
  // Get restic version
  const version = await getResticVersion();
  console.log(`Restic version: ${version}`);
  
  // Create or open a repository
  const repo = await openRepository('/path/to/repo', 'password');
  
  // Perform a backup
  await repo.backup({
    paths: ['/path/to/backup'],
    tags: ['daily', 'important'],
    callbacks: {
      onProgress: (progress) => console.log('Progress:', progress),
      onSummary: (summary) => console.log('Summary:', summary),
      onError: (error) => console.error('Error:', error)
    }
  });
  
  // List snapshots
  const snapshots = await repo.getSnapshots();
  console.log(`Found ${snapshots.length} snapshots`);
  
  // Restore a snapshot
  if (snapshots.length > 0) {
    await snapshots[0].restore('/path/to/restore');
  }
}
*/