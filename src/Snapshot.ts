import { Repository } from './Repository';

/**
 * Class representing a Restic snapshot
 */
export class Snapshot {
  public id!: string;
  public shortId!: string;
  public time!: Date;
  public hostname!: string;
  public username!: string;
  public paths!: string[];
  public tags: string[] = [];
  public parent?: string;
  
  // Summary data
  public startedAt?: Date;
  public finishedAt?: Date;
  public duration?: number;
  public newFilesCount?: number;
  public changedFilesCount?: number;
  public unmodifiedFilesCount?: number;
  public newDirectoriesCount?: number;
  public changedDirectoriesCount?: number;
  public unmodifiedDirectoriesCount?: number;
  public dataBlobsCount?: number;
  public treeBlobsCount?: number;
  public dataAdded?: number;
  public dataAddedPacked?: number;
  public totalFilesProcessed?: number;
  public totalBytesProcessed?: number;
  
  // Reference to the repository
  public repository!: Repository;
  
  /**
   * Creates a new Snapshot instance
   */
  constructor() {}
  
  /**
   * Sets the snapshot ID
   * @param id Snapshot ID
   * @returns This instance for chaining
   */
  public setId(id: string): this {
    this.id = id;
    return this;
  }
  
  /**
   * Sets the short snapshot ID
   * @param shortId Short snapshot ID
   * @returns This instance for chaining
   */
  public setShortId(shortId: string): this {
    this.shortId = shortId;
    return this;
  }
  
  /**
   * Sets the snapshot time
   * @param time Snapshot time
   * @returns This instance for chaining
   */
  public setTime(time: Date): this {
    this.time = time;
    return this;
  }
  
  /**
   * Sets the hostname
   * @param hostname Hostname
   * @returns This instance for chaining
   */
  public setHostname(hostname: string): this {
    this.hostname = hostname;
    return this;
  }
  
  /**
   * Sets the username
   * @param username Username
   * @returns This instance for chaining
   */
  public setUsername(username: string): this {
    this.username = username;
    return this;
  }
  
  /**
   * Sets the parent snapshot ID
   * @param parent Parent snapshot ID
   * @returns This instance for chaining
   */
  public setParent(parent?: string): this {
    this.parent = parent;
    return this;
  }
  
  /**
   * Sets the backup start time
   * @param startedAt Backup start time
   * @returns This instance for chaining
   */
  public setStartedAt(startedAt: Date): this {
    this.startedAt = startedAt;
    return this;
  }
  
  /**
   * Sets the backup finish time
   * @param finishedAt Backup finish time
   * @returns This instance for chaining
   */
  public setFinishedAt(finishedAt: Date): this {
    this.finishedAt = finishedAt;
    return this;
  }
  
  /**
   * Sets the backup duration in seconds
   * @param duration Backup duration in seconds
   * @returns This instance for chaining
   */
  public setDuration(duration: number): this {
    this.duration = duration;
    return this;
  }
  
  /**
   * Sets the count of new files
   * @param newFilesCount Count of new files
   * @returns This instance for chaining
   */
  public setNewFilesCount(newFilesCount: number): this {
    this.newFilesCount = newFilesCount;
    return this;
  }
  
  /**
   * Sets the count of changed files
   * @param changedFilesCount Count of changed files
   * @returns This instance for chaining
   */
  public setChangedFilesCount(changedFilesCount: number): this {
    this.changedFilesCount = changedFilesCount;
    return this;
  }
  
  /**
   * Sets the count of unmodified files
   * @param unmodifiedFilesCount Count of unmodified files
   * @returns This instance for chaining
   */
  public setUnmodifiedFilesCount(unmodifiedFilesCount: number): this {
    this.unmodifiedFilesCount = unmodifiedFilesCount;
    return this;
  }
  
  /**
   * Sets the count of new directories
   * @param newDirectoriesCount Count of new directories
   * @returns This instance for chaining
   */
  public setNewDirectoriesCount(newDirectoriesCount: number): this {
    this.newDirectoriesCount = newDirectoriesCount;
    return this;
  }
  
  /**
   * Sets the count of changed directories
   * @param changedDirectoriesCount Count of changed directories
   * @returns This instance for chaining
   */
  public setChangedDirectoriesCount(changedDirectoriesCount: number): this {
    this.changedDirectoriesCount = changedDirectoriesCount;
    return this;
  }
  
  /**
   * Sets the count of unmodified directories
   * @param unmodifiedDirectoriesCount Count of unmodified directories
   * @returns This instance for chaining
   */
  public setUnmodifiedDirectoriesCount(unmodifiedDirectoriesCount: number): this {
    this.unmodifiedDirectoriesCount = unmodifiedDirectoriesCount;
    return this;
  }
  
  /**
   * Sets the count of data blobs
   * @param dataBlobsCount Count of data blobs
   * @returns This instance for chaining
   */
  public setDataBlobsCount(dataBlobsCount: number): this {
    this.dataBlobsCount = dataBlobsCount;
    return this;
  }
  
  /**
   * Sets the count of tree blobs
   * @param treeBlobsCount Count of tree blobs
   * @returns This instance for chaining
   */
  public setTreeBlobsCount(treeBlobsCount: number): this {
    this.treeBlobsCount = treeBlobsCount;
    return this;
  }
  
  /**
   * Sets the amount of data added
   * @param dataAdded Amount of data added in bytes
   * @returns This instance for chaining
   */
  public setDataAdded(dataAdded: number): this {
    this.dataAdded = dataAdded;
    return this;
  }
  
  /**
   * Sets the amount of packed data added
   * @param dataAddedPacked Amount of packed data added in bytes
   * @returns This instance for chaining
   */
  public setDataAddedPacked(dataAddedPacked: number): this {
    this.dataAddedPacked = dataAddedPacked;
    return this;
  }
  
  /**
   * Sets the total count of processed files
   * @param totalFilesProcessed Total count of processed files
   * @returns This instance for chaining
   */
  public setTotalFilesProcessed(totalFilesProcessed: number): this {
    this.totalFilesProcessed = totalFilesProcessed;
    return this;
  }
  
  /**
   * Sets the total amount of processed bytes
   * @param totalBytesProcessed Total amount of processed bytes
   * @returns This instance for chaining
   */
  public setTotalBytesProcessed(totalBytesProcessed: number): this {
    this.totalBytesProcessed = totalBytesProcessed;
    return this;
  }
  
  /**
   * Sets the backed up paths
   * @param paths Backed up paths
   * @returns This instance for chaining
   */
  public setPaths(paths: string[]): this {
    this.paths = paths;
    return this;
  }
  
  /**
   * Sets the snapshot tags
   * @param tags Snapshot tags
   * @returns This instance for chaining
   */
  public setTags(tags: string[]): this {
    this.tags = tags;
    return this;
  }
  
  /**
   * Sets the repository reference
   * @param repository Repository reference
   * @returns This instance for chaining
   */
  public setRepository(repository: Repository): this {
    this.repository = repository;
    return this;
  }
  
  /**
   * Deletes this snapshot
   * @param prune Whether to prune the repository after deletion
   * @returns Result of the delete operation
   */
  public delete(prune: boolean = false): any {
    return this.repository.deleteSnapshot(this.id, prune);
  }
  
  /**
   * Restores this snapshot to the specified target directory
   * @param target Target directory
   * @param options Restore options
   * @returns Result of the restore operation
   */
  public restore(target: string, options: any = {}): any {
    return this.repository.restore({
      snapshotId: this.id,
      target,
      ...options
    });
  }
  
  /**
   * Lists files in this snapshot
   * @param path Path within the snapshot to list
   * @param options List options
   * @returns List of files
   */
  public listFiles(path?: string, options: any = {}): any {
    return this.repository.listFiles({
      snapshotId: this.id,
      path,
      ...options
    });
  }
  
  /**
   * Finds files in this snapshot
   * @param patterns Search patterns
   * @param options Find options
   * @returns Search results
   */
  public findFiles(patterns: string[], options: any = {}): any {
    return this.repository.findFiles({
      patterns,
      snapshotId: this.id,
      ...options
    });
  }
  
  /**
   * Updates tags for this snapshot
   * @param tags Tags to set
   * @param operation Tag operation: 'add', 'remove', or 'set'
   * @returns Result of the tag operation
   */
  public updateTags(tags: string[], operation: 'add' | 'remove' | 'set' = 'add'): any {
    return this.repository.updateTags({
      snapshotIds: [this.id],
      tags,
      [operation]: true
    });
  }
  
  /**
   * Gets statistics for this snapshot
   * @param options Stats options
   * @returns Snapshot statistics
   */
  public getStats(options: any = {}): any {
    return this.repository.getStats({
      ...options,
      paths: this.paths
    });
  }
  
  /**
   * Creates a string representation of the snapshot
   * @returns String representation
   */
  public toString(): string {
    return `Snapshot ${this.shortId} (${this.time.toISOString()})`;
  }
  
  /**
   * Creates a JSON representation of the snapshot
   * @returns JSON representation
   */
  public toJSON(): any {
    return {
      id: this.id,
      shortId: this.shortId,
      time: this.time,
      hostname: this.hostname,
      username: this.username,
      paths: this.paths,
      tags: this.tags,
      parent: this.parent,
      summary: {
        startedAt: this.startedAt,
        finishedAt: this.finishedAt,
        duration: this.duration,
        newFilesCount: this.newFilesCount,
        changedFilesCount: this.changedFilesCount,
        unmodifiedFilesCount: this.unmodifiedFilesCount,
        newDirectoriesCount: this.newDirectoriesCount,
        changedDirectoriesCount: this.changedDirectoriesCount,
        unmodifiedDirectoriesCount: this.unmodifiedDirectoriesCount,
        dataBlobsCount: this.dataBlobsCount,
        treeBlobsCount: this.treeBlobsCount,
        dataAdded: this.dataAdded,
        dataAddedPacked: this.dataAddedPacked,
        totalFilesProcessed: this.totalFilesProcessed,
        totalBytesProcessed: this.totalBytesProcessed
      }
    };
  }
}