import { request, requestSync, ResticError } from './CLIRequester';
import { Snapshot } from './Snapshot';
import { Commands } from './Commands';
import { normalizePath, escapePath } from './Utils';
import {
  RepositoryOptions,
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
  InitOptions
} from './Types';

/**
 * Class representing a Restic repository
 */
export class Repository {
  private readonly path: string;
  private readonly password?: string;
  private readonly passwordFile?: string;
  private readonly keyHint?: string;
  private readonly noCache?: boolean;
  private readonly cacheDir?: string;
  private readonly noLock?: boolean;
  private readonly verbosity?: 0 | 1 | 2 | 3;
  private readonly options?: Record<string, string>;
  
  private snapshots: Snapshot[] = [];
  
  /**
   * Creates a new Repository instance
   * @param options Repository options or path
   * @param password Optional password
   * @param passwordFile Optional password file path
   */
  constructor(options: RepositoryOptions | string, password?: string, passwordFile?: string) {
    if (typeof options === 'string') {
      this.path = normalizePath(options);
      this.password = password;
      this.passwordFile = passwordFile ? normalizePath(passwordFile) : undefined;
    } else {
      this.path = normalizePath(options.path);
      this.password = options.password;
      this.passwordFile = options.passwordFile ? normalizePath(options.passwordFile) : undefined;
      this.keyHint = options.keyHint;
      this.noCache = options.noCache;
      this.cacheDir = options.cacheDir ? normalizePath(options.cacheDir) : undefined;
      this.noLock = options.noLock;
      this.verbosity = options.verbosity;
      this.options = options.options;
    }
  }
  
  /**
   * Initializes the repository
   * @param options Init options
   * @returns Result of the init operation
   */
  public async init(options: InitOptions = {}): Promise<any> {
    const additionalParameters: string[] = [];
    
    if (options.copy) {
      additionalParameters.push('--copy-from', escapePath(options.copy));
    }
    
    return request({
      command: Commands.INIT,
      repository: this.path,
      password: this.password,
      passwordFile: this.passwordFile,
      keyHint: this.keyHint,
      noCache: this.noCache,
      cacheDir: this.cacheDir,
      noLock: this.noLock,
      verbosity: this.verbosity,
      additionalParameters,
      callbacks: options.callbacks,
      options: this.options
    });
  }
  
  /**
   * Loads snapshots from the repository
   * @returns Array of snapshots
   */
  public async loadSnapshots(): Promise<Snapshot[]> {
    try {
      const result = await request({
        command: Commands.SNAPSHOTS,
        repository: this.path,
        password: this.password,
        passwordFile: this.passwordFile,
        keyHint: this.keyHint,
        noCache: this.noCache,
        cacheDir: this.cacheDir,
        noLock: this.noLock,
        verbosity: this.verbosity,
        options: this.options
      }) as any[];
      
      this.snapshots = [];
      
      if (result && result.length > 0) {
        for (const snapshot of result) {
          const newSnapshot = new Snapshot()
            .setId(snapshot.id)
            .setShortId(snapshot.short_id)
            .setTime(new Date(snapshot.time))
            .setHostname(snapshot.hostname)
            .setUsername(snapshot.username)
            .setPaths(snapshot.paths)
            .setTags(snapshot.tags || [])
            .setParent(snapshot.parent)
            .setRepository(this);
          
          if (snapshot.summary) {
            newSnapshot
              .setStartedAt(new Date(snapshot.summary.backup_start))
              .setFinishedAt(new Date(snapshot.summary.backup_end))
              .setDuration((new Date(snapshot.summary.backup_end).getTime() - new Date(snapshot.summary.backup_start).getTime()) / 1000)
              .setNewFilesCount(snapshot.summary.files_new)
              .setChangedFilesCount(snapshot.summary.files_changed)
              .setUnmodifiedFilesCount(snapshot.summary.files_unmodified)
              .setNewDirectoriesCount(snapshot.summary.dirs_new)
              .setChangedDirectoriesCount(snapshot.summary.dirs_changed)
              .setUnmodifiedDirectoriesCount(snapshot.summary.dirs_unmodified)
              .setDataBlobsCount(snapshot.summary.data_blobs)
              .setTreeBlobsCount(snapshot.summary.tree_blobs)
              .setDataAdded(snapshot.summary.data_added)
              .setDataAddedPacked(snapshot.summary.data_added_packed)
              .setTotalFilesProcessed(snapshot.summary.total_files_processed)
              .setTotalBytesProcessed(snapshot.summary.total_bytes_processed);
          }
          
          this.snapshots.push(newSnapshot);
        }
      }
      
      return this.snapshots;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Gets all snapshots in the repository
   * @param reload Whether to reload snapshots from the repository
   * @returns Array of snapshots
   */
  public async getSnapshots(reload: boolean = false): Promise<Snapshot[]> {
    if (reload || this.snapshots.length === 0) {
      await this.loadSnapshots();
    }
    return this.snapshots;
  }
  
  /**
   * Gets a snapshot by ID
   * @param id Snapshot ID
   * @param reload Whether to reload snapshots from the repository
   * @returns Snapshot or undefined if not found
   */
  public async getSnapshot(id: string, reload: boolean = false): Promise<Snapshot | undefined> {
    if (reload || this.snapshots.length === 0) {
      await this.loadSnapshots();
    }
    return this.snapshots.find(snapshot => snapshot.id === id || snapshot.shortId === id);
  }
  
  /**
   * Creates a backup
   * @param options Backup options
   * @returns Result of the backup operation
   */
  public async backup(options: BackupOptions): Promise<any> {
    const additionalParameters: string[] = [...options.paths.map(p => escapePath(p))];
    
    if (options.excludes) {
      for (const exclude of options.excludes) {
        additionalParameters.push('--exclude', exclude);
      }
    }
    
    if (options.excludeFiles) {
      for (const excludeFile of options.excludeFiles) {
        additionalParameters.push('--exclude-file', escapePath(excludeFile));
      }
    }
    
    if (options.excludeCaches) {
      additionalParameters.push('--exclude-caches');
    }
    
    if (options.excludeIfPresent) {
      for (const excludeIfPresent of options.excludeIfPresent) {
        additionalParameters.push('--exclude-if-present', excludeIfPresent);
      }
    }
    
    if (options.excludeOtherFS) {
      additionalParameters.push('--one-file-system');
    }
    
    if (options.oneFileSystem) {
      additionalParameters.push('--one-file-system');
    }
    
    if (options.tags) {
      for (const tag of options.tags) {
        additionalParameters.push('--tag', tag);
      }
    }
    
    if (options.host) {
      additionalParameters.push('--host', options.host);
    }
    
    if (options.iexclude) {
      for (const iexclude of options.iexclude) {
        additionalParameters.push('--iexclude', iexclude);
      }
    }
    
    if (options.ignoreInode) {
      additionalParameters.push('--ignore-inode');
    }
    
    if (options.ignoreCase) {
      additionalParameters.push('--ignore-case');
    }
    
    if (options.withAtime) {
      additionalParameters.push('--with-atime');
    }
    
    if (options.dryRun) {
      additionalParameters.push('--dry-run');
    }
    
    const result = await request({
      command: Commands.BACKUP,
      repository: this.path,
      password: this.password,
      passwordFile: this.passwordFile,
      keyHint: this.keyHint,
      noCache: this.noCache,
      cacheDir: this.cacheDir,
      noLock: this.noLock,
      verbosity: this.verbosity,
      additionalParameters,
      callbacks: options.callbacks,
      options: this.options
    });
    
    // Reload snapshots to include the new one
    await this.loadSnapshots();
    
    return result;
  }
  
  /**
   * Restores a snapshot
   * @param options Restore options
   * @returns Result of the restore operation
   */
  public async restore(options: RestoreOptions): Promise<any> {
    const additionalParameters: string[] = [options.snapshotId, '--target', escapePath(options.target)];
    
    if (options.includeFiles) {
      for (const includeFile of options.includeFiles) {
        additionalParameters.push('--include', includeFile);
      }
    }
    
    if (options.excludeFiles) {
      for (const excludeFile of options.excludeFiles) {
        additionalParameters.push('--exclude', excludeFile);
      }
    }
    
    if (options.host) {
      additionalParameters.push('--host', options.host);
    }
    
    if (options.tags) {
      for (const tag of options.tags) {
        additionalParameters.push('--tag', tag);
      }
    }
    
    if (options.verify) {
      additionalParameters.push('--verify');
    }
    
    if (options.dryRun) {
      additionalParameters.push('--dry-run');
    }
    
    return request({
      command: Commands.RESTORE,
      repository: this.path,
      password: this.password,
      passwordFile: this.passwordFile,
      keyHint: this.keyHint,
      noCache: this.noCache,
      cacheDir: this.cacheDir,
      noLock: this.noLock,
      verbosity: this.verbosity,
      additionalParameters,
      callbacks: options.callbacks,
      options: this.options
    });
  }
  
  /**
   * Deletes a snapshot
   * @param id Snapshot ID
   * @param prune Whether to prune the repository after deletion
   * @returns Result of the delete operation
   */
  public async deleteSnapshot(id: string, prune: boolean = false): Promise<any> {
    const additionalParameters: string[] = [id];
    
    const result = await request({
      command: Commands.FORGET,
      repository: this.path,
      password: this.password,
      passwordFile: this.passwordFile,
      keyHint: this.keyHint,
      noCache: this.noCache,
      cacheDir: this.cacheDir,
      noLock: this.noLock,
      verbosity: this.verbosity,
      additionalParameters,
      options: this.options
    });
    
    if (prune) {
      await this.prune();
    }
    
    // Reload snapshots to reflect the deletion
    await this.loadSnapshots();
    
    return result;
  }
  
  /**
   * Deletes all snapshots
   * @param prune Whether to prune the repository after deletion
   * @returns Result of the delete operation
   */
  public async deleteAllSnapshots(prune: boolean = false): Promise<any[]> {
    await this.loadSnapshots();
    
    const results: any[] = [];
    for (const snapshot of this.snapshots) {
      const result = await this.deleteSnapshot(snapshot.id, false);
      results.push(result);
    }
    
    if (prune) {
      await this.prune();
    }
    
    return results;
  }
  
  /**
   * Forgets snapshots based on policy
   * @param options Forget options
   * @returns Result of the forget operation
   */
  public async forget(options: ForgetOptions): Promise<any> {
    const additionalParameters: string[] = [];
    
    if (options.snapshotIds && options.snapshotIds.length > 0) {
      additionalParameters.push(...options.snapshotIds);
    }
    
    if (options.keepLast !== undefined) {
      additionalParameters.push('--keep-last', options.keepLast.toString());
    }
    
    if (options.keepHourly !== undefined) {
      additionalParameters.push('--keep-hourly', options.keepHourly.toString());
    }
    
    if (options.keepDaily !== undefined) {
      additionalParameters.push('--keep-daily', options.keepDaily.toString());
    }
    
    if (options.keepWeekly !== undefined) {
      additionalParameters.push('--keep-weekly', options.keepWeekly.toString());
    }
    
    if (options.keepMonthly !== undefined) {
      additionalParameters.push('--keep-monthly', options.keepMonthly.toString());
    }
    
    if (options.keepYearly !== undefined) {
      additionalParameters.push('--keep-yearly', options.keepYearly.toString());
    }
    
    if (options.keepWithin) {
      additionalParameters.push('--keep-within', options.keepWithin);
    }
    
    if (options.keepTag && options.keepTag.length > 0) {
      for (const tag of options.keepTag) {
        additionalParameters.push('--keep-tag', tag);
      }
    }
    
    if (options.host) {
      additionalParameters.push('--host', options.host);
    }
    
    if (options.tags && options.tags.length > 0) {
      for (const tag of options.tags) {
        additionalParameters.push('--tag', tag);
      }
    }
    
    if (options.paths && options.paths.length > 0) {
      for (const path of options.paths) {
        additionalParameters.push('--path', escapePath(path));
      }
    }
    
    if (options.compact) {
      additionalParameters.push('--compact');
    }
    
    if (options.groupBy) {
      additionalParameters.push('--group-by', options.groupBy);
    }
    
    if (options.dryRun) {
      additionalParameters.push('--dry-run');
    }
    
    if (options.prune) {
      additionalParameters.push('--prune');
    }
    
    const result = await request({
      command: Commands.FORGET,
      repository: this.path,
      password: this.password,
      passwordFile: this.passwordFile,
      keyHint: this.keyHint,
      noCache: this.noCache,
      cacheDir: this.cacheDir,
      noLock: this.noLock,
      verbosity: this.verbosity,
      additionalParameters,
      options: this.options
    });
    
    // Reload snapshots to reflect changes
    await this.loadSnapshots();
    
    return result;
  }
  
  /**
   * Prunes the repository
   * @param options Prune options
   * @returns Result of the prune operation
   */
  public async prune(options: PruneOptions = {}): Promise<any> {
    const additionalParameters: string[] = [];
    
    if (options.maxUnused) {
      additionalParameters.push('--max-unused', options.maxUnused);
    }
    
    if (options.maxRepackSize) {
      additionalParameters.push('--max-repack-size', options.maxRepackSize);
    }
    
    if (options.repackCachable) {
      additionalParameters.push('--repack-cacheable-only');
    }
    
    if (options.repackSmall) {
      additionalParameters.push('--repack-small');
    }
    
    if (options.dryRun) {
      additionalParameters.push('--dry-run');
    }
    
    return request({
      command: Commands.PRUNE,
      repository: this.path,
      password: this.password,
      passwordFile: this.passwordFile,
      keyHint: this.keyHint,
      noCache: this.noCache,
      cacheDir: this.cacheDir,
      noLock: this.noLock,
      verbosity: this.verbosity,
      additionalParameters,
      callbacks: options.callbacks,
      options: this.options
    });
  }
  
  /**
   * Checks the repository for errors
   * @param options Check options
   * @returns Result of the check operation
   */
  public async check(options: CheckOptions = {}): Promise<any> {
    const additionalParameters: string[] = [];
    
    if (options.readData) {
      additionalParameters.push('--read-data');
    }
    
    if (options.readDataSubset) {
      additionalParameters.push('--read-data-subset', options.readDataSubset);
    }
    
    if (options.withCache) {
      additionalParameters.push('--with-cache');
    }
    
    return request({
      command: Commands.CHECK,
      repository: this.path,
      password: this.password,
      passwordFile: this.passwordFile,
      keyHint: this.keyHint,
      noCache: this.noCache,
      cacheDir: this.cacheDir,
      noLock: this.noLock,
      verbosity: this.verbosity,
      additionalParameters,
      callbacks: options.callbacks,
      options: this.options
    });
  }
  
  /**
   * Lists files in a snapshot
   * @param options List options
   * @returns List of files
   */
  public async listFiles(options: ListOptions): Promise<any> {
    const additionalParameters: string[] = [options.snapshotId];
    
    if (options.path) {
      additionalParameters.push(options.path);
    }
    
    if (options.host) {
      additionalParameters.push('--host', options.host);
    }
    
    if (options.tags && options.tags.length > 0) {
      for (const tag of options.tags) {
        additionalParameters.push('--tag', tag);
      }
    }
    
    if (options.long) {
      additionalParameters.push('--long');
    }
    
    if (options.recursive) {
      additionalParameters.push('--recursive');
    }
    
    return request({
      command: Commands.LS,
      repository: this.path,
      password: this.password,
      passwordFile: this.passwordFile,
      keyHint: this.keyHint,
      noCache: this.noCache,
      cacheDir: this.cacheDir,
      noLock: this.noLock,
      verbosity: this.verbosity,
      additionalParameters,
      options: this.options
    });
  }
  
  /**
   * Finds files in snapshots
   * @param options Find options
   * @returns Search results
   */
  public async findFiles(options: FindOptions): Promise<any> {
    const additionalParameters: string[] = [...options.patterns];
    
    if (options.ignoreCase) {
      additionalParameters.push('--ignore-case');
    }
    
    if (options.long) {
      additionalParameters.push('--long');
    }
    
    if (options.host) {
      additionalParameters.push('--host', options.host);
    }
    
    if (options.paths && options.paths.length > 0) {
      for (const path of options.paths) {
        additionalParameters.push('--path', escapePath(path));
      }
    }
    
    if (options.tags && options.tags.length > 0) {
      for (const tag of options.tags) {
        additionalParameters.push('--tag', tag);
      }
    }
    
    if (options.snapshotId) {
      additionalParameters.push('--snapshot', options.snapshotId);
    }
    
    return request({
      command: Commands.FIND,
      repository: this.path,
      password: this.password,
      passwordFile: this.passwordFile,
      keyHint: this.keyHint,
      noCache: this.noCache,
      cacheDir: this.cacheDir,
      noLock: this.noLock,
      verbosity: this.verbosity,
      additionalParameters,
      options: this.options
    });
  }
  
  /**
   * Gets statistics for the repository
   * @param options Stats options
   * @returns Repository statistics
   */
  public async getStats(options: StatsOptions = {}): Promise<any> {
    const additionalParameters: string[] = [];
    
    if (options.host) {
      additionalParameters.push('--host', options.host);
    }
    
    if (options.tags && options.tags.length > 0) {
      for (const tag of options.tags) {
        additionalParameters.push('--tag', tag);
      }
    }
    
    if (options.paths && options.paths.length > 0) {
      for (const path of options.paths) {
        additionalParameters.push('--path', escapePath(path));
      }
    }
    
    if (options.mode) {
      additionalParameters.push('--mode', options.mode);
    }
    
    return request({
      command: Commands.STATS,
      repository: this.path,
      password: this.password,
      passwordFile: this.passwordFile,
      keyHint: this.keyHint,
      noCache: this.noCache,
      cacheDir: this.cacheDir,
      noLock: this.noLock,
      verbosity: this.verbosity,
      additionalParameters,
      options: this.options
    });
  }
  
  /**
   * Updates tags for snapshots
   * @param options Tag options
   * @returns Result of the tag operation
   */
  public async updateTags(options: TagOptions): Promise<any> {
    const additionalParameters: string[] = [...options.snapshotIds];
    
    if (options.add) {
      additionalParameters.push('--add');
    } else if (options.remove) {
      additionalParameters.push('--remove');
    } else if (options.set) {
      additionalParameters.push('--set');
    } else {
      additionalParameters.push('--set');
    }
    
    for (const tag of options.tags) {
      additionalParameters.push(tag);
    }
    
    const result = await request({
      command: Commands.TAG,
      repository: this.path,
      password: this.password,
      passwordFile: this.passwordFile,
      keyHint: this.keyHint,
      noCache: this.noCache,
      cacheDir: this.cacheDir,
      noLock: this.noLock,
      verbosity: this.verbosity,
      additionalParameters,
      options: this.options
    });
    
    // Reload snapshots to reflect tag changes
    await this.loadSnapshots();
    
    return result;
  }
  
  /**
   * Mounts the repository
   * @param options Mount options
   * @returns Mount process
   */
  public async mount(options: MountOptions): Promise<any> {
    const additionalParameters: string[] = [escapePath(options.mountPoint)];
    
    if (options.snapshotId) {
      additionalParameters.push('--snapshot', options.snapshotId);
    }
    
    if (options.host) {
      additionalParameters.push('--host', options.host);
    }
    
    if (options.tags && options.tags.length > 0) {
      for (const tag of options.tags) {
        additionalParameters.push('--tag', tag);
      }
    }
    
    if (options.paths && options.paths.length > 0) {
      for (const path of options.paths) {
        additionalParameters.push('--path', escapePath(path));
      }
    }
    
    if (options.allowOther) {
      additionalParameters.push('--allow-other');
    }
    
    if (options.allowRoot) {
      additionalParameters.push('--allow-root');
    }
    
    return request({
      command: Commands.MOUNT,
      repository: this.path,
      password: this.password,
      passwordFile: this.passwordFile,
      keyHint: this.keyHint,
      noCache: this.noCache,
      cacheDir: this.cacheDir,
      noLock: this.noLock,
      verbosity: this.verbosity,
      additionalParameters,
      options: this.options
    });
  }
  
  /**
   * Shows the difference between two snapshots
   * @param options Diff options
   * @returns Difference between snapshots
   */
  public async diff(options: DiffOptions): Promise<any> {
    const additionalParameters: string[] = [options.snapshotId1, options.snapshotId2];
    
    if (options.metadata) {
      additionalParameters.push('--metadata');
    }
    
    return request({
      command: Commands.DIFF,
      repository: this.path,
      password: this.password,
      passwordFile: this.passwordFile,
      keyHint: this.keyHint,
      noCache: this.noCache,
      cacheDir: this.cacheDir,
      noLock: this.noLock,
      verbosity: this.verbosity,
      additionalParameters,
      options: this.options
    });
  }
  
  /**
   * Unlocks the repository
   * @returns Result of the unlock operation
   */
  public async unlock(): Promise<any> {
    return request({
      command: Commands.UNLOCK,
      repository: this.path,
      password: this.password,
      passwordFile: this.passwordFile,
      keyHint: this.keyHint,
      noCache: this.noCache,
      cacheDir: this.cacheDir,
      noLock: this.noLock,
      verbosity: this.verbosity,
      options: this.options
    });
  }
  
  /**
   * Rebuilds the repository index
   * @returns Result of the rebuild-index operation
   */
  public async rebuildIndex(): Promise<any> {
    return request({
      command: Commands.REBUILD_INDEX,
      repository: this.path,
      password: this.password,
      passwordFile: this.passwordFile,
      keyHint: this.keyHint,
      noCache: this.noCache,
      cacheDir: this.cacheDir,
      noLock: this.noLock,
      verbosity: this.verbosity,
      options: this.options
    });
  }
  
  /**
   * Gets the repository path
   * @returns Repository path
   */
  public getPath(): string {
    return this.path;
  }
}