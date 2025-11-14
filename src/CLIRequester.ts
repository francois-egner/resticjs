import { spawn, spawnSync, SpawnSyncOptions, SpawnOptions } from 'child_process';
import { Commands } from './Commands';
import { isJsonString, parseResticOutput, escapePath } from './Utils';
import { CLIRequestOptions } from './Types';

/**
 * Error class for Restic CLI errors
 */
export class ResticError extends Error {
  public readonly exitCode: number;
  public readonly stderr: string;
  public readonly command: string;

  constructor(message: string, exitCode: number, stderr: string, command: string) {
    super(message);
    this.name = 'ResticError';
    this.exitCode = exitCode;
    this.stderr = stderr;
    this.command = command;
  }
}

/**
 * Executes a Restic command synchronously
 * @param params Command parameters
 * @returns Parsed JSON response
 * @throws ResticError if the command fails
 */
export function requestSync(params: CLIRequestOptions): any[] {
  const cliParameters = buildParameters(params);
  const command = cliParameters.join(' ');

  const options: SpawnSyncOptions = {
    encoding: 'utf-8',
    env: { ...process.env },
    shell: true
  };

    const result = spawnSync('restic', cliParameters, options);

  if (result.status !== 0) {
    throw new ResticError(
      `Failed to execute command: ${result.stderr}`,
      result.status || 1,
      result.stderr?.toString() || '',
      `restic ${command}`
    );
  }

  return parseResticOutput(result.stdout.toString());
}

/**
 * Executes a Restic command asynchronously
 * @param params Command parameters
 * @returns Promise that resolves to parsed JSON response or void if callbacks are provided
 * @throws ResticError if the command fails
 */
export async function request(params: CLIRequestOptions): Promise<any[] | void> {
  const cliParameters = buildParameters(params);
  const command = cliParameters.join(' ');

  // If no callbacks are provided, use the synchronous version
  if (!params.callbacks) {
    return requestSync(params);
  }

  const options: SpawnOptions = {
    env: { ...process.env },
    shell: true
  };

  return new Promise((resolve, reject) => {
    const restic = spawn('restic', cliParameters, options);
    let stdoutData = '';
    let stderrData = '';
    let summaryData = null;

    restic.stdout.on('data', (data: Buffer) => {
      const output = data.toString();
      stdoutData += output;

      // Process each line
      const lines = output.trim().split('\n');
      for (const line of lines) {
        if (!line.trim()) continue;

        try {
          if (isJsonString(line)) {
            const json = JSON.parse(line);
            
            // Handle progress updates
            if (json.message_type === 'status' && params.callbacks?.onProgress) {
              params.callbacks.onProgress(json);
            }
            
            // Handle summary
            if (json.message_type === 'summary') {
              summaryData = json;
              if (params.callbacks?.onSummary) {
                params.callbacks.onSummary(json);
              }
            }
          }
        } catch (e) {
          // Non-JSON output, pass to progress callback
          if (params.callbacks?.onProgress) {
            params.callbacks.onProgress(line);
          }
        }
      }
    });

    restic.stderr.on('data', (data: Buffer) => {
      const error = data.toString();
      stderrData += error;
      
      if (params.callbacks?.onError) {
        params.callbacks.onError(error);
      }
    });

    restic.on('close', (code: number) => {
      if (code !== 0) {
        const error = new ResticError(
          `Command failed with exit code ${code}`,
          code,
          stderrData,
          `restic ${command}`
        );
        
        if (params.callbacks?.onError) {
          params.callbacks.onError(error);
        }
        
        reject(error);
        return;
      }
      
      const results = parseResticOutput(stdoutData);
      resolve(results);
    });

    restic.on('error', (err: Error) => {
      const error = new ResticError(
        `Failed to spawn restic process: ${err.message}`,
        -1,
        err.message,
        `restic ${command}`
      );
      
      if (params.callbacks?.onError) {
        params.callbacks.onError(error);
      }
      
      reject(error);
    });
  });
}

/**
 * Builds command line parameters for Restic
 * @param params Command parameters
 * @returns Array of command line arguments
 */
function buildParameters(params: CLIRequestOptions): string[] {
  const cliParameters: string[] = ['--json', params.command];

  // Add repository
  if (params.repository) {
    cliParameters.push('-r', escapePath(params.repository));
  }

  // Handle password options
  if (!params.password && !params.passwordFile) {
    cliParameters.push('--no-cache');
  }

  if (params.password) {
    // Using environment variable is safer than command line
    process.env.RESTIC_PASSWORD = params.password;
  }

  if (params.passwordFile) {
    cliParameters.push(`--password-file=${escapePath(params.passwordFile)}`);
  }

  // Add key hint if provided
  if (params.keyHint) {
    cliParameters.push(`--key-hint=${params.keyHint}`);
  }

  // Cache options
  if (params.noCache) {
    cliParameters.push('--no-cache');
  }

  if (params.cacheDir) {
    cliParameters.push(`--cache-dir=${escapePath(params.cacheDir)}`);
  }

  // Lock options
  if (params.noLock) {
    cliParameters.push('--no-lock');
  }

  // Set verbosity
  if (params.verbosity !== undefined) {
    cliParameters.push(`--verbose=${params.verbosity}`);
  } else {
    cliParameters.push('--verbose=1');
  }

  // Add any additional options
  if (params.options) {
    for (const [key, value] of Object.entries(params.options)) {
      cliParameters.push(`--${key}=${value}`);
    }
  }

  // Add additional parameters
  if (params.additionalParameters) {
    cliParameters.push(...params.additionalParameters);
  }

  return cliParameters;
}