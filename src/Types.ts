import { Commands } from './Commands';

/**
 * Restic message types
 */
export interface ResticMessage {
  message_type: string;
  percent_done?: number;
  [key: string]: any;
}

/**
 * Restic snapshot summary
 */
export interface SnapshotSummary {
  message_type: string;
  snapshot_id: string;
  id: string;
  short_id: string;
  parent?: string;
  time: string;
  hostname: string;
  username: string;
  paths: string[];
  tags?: string[];
  summary?: {
    files_new: number;
    files_changed: number;
    files_unmodified: number;
    dirs_new: number;
    dirs_changed: number;
    dirs_unmodified: number;
    data_blobs: number;
    tree_blobs: number;
    data_added: number;
    data_added_packed: number;
    total_files_processed: number;
    total_bytes_processed: number;
    backup_start: string;
    backup_end: string;
  };
}

/**
 * Restic backup options
 */
export interface BackupOptions {
  paths: string[];
  excludes?: string[];
  excludeFiles?: string[];
  excludeCaches?: boolean;
  excludeIfPresent?: string[];
  excludeOtherFS?: boolean;
  oneFileSystem?: boolean;
  tags?: string[];
  host?: string;
  iexclude?: string[];
  ignoreInode?: boolean;
  ignoreCase?: boolean;
  withAtime?: boolean;
  dryRun?: boolean;
  callbacks?: {
    onProgress?: (progress: any) => void;
    onSummary?: (summary: any) => void;
    onError?: (error: any) => void;
  };
}

/**
 * Restic restore options
 */
export interface RestoreOptions {
  snapshotId: string;
  target: string;
  includeFiles?: string[];
  excludeFiles?: string[];
  host?: string;
  tags?: string[];
  verify?: boolean;
  dryRun?: boolean;
  callbacks?: {
    onProgress?: (progress: any) => void;
    onSummary?: (summary: any) => void;
    onError?: (error: any) => void;
  };
}

/**
 * Restic forget options
 */
export interface ForgetOptions {
  snapshotIds?: string[];
  keepLast?: number;
  keepHourly?: number;
  keepDaily?: number;
  keepWeekly?: number;
  keepMonthly?: number;
  keepYearly?: number;
  keepWithin?: string;
  keepTag?: string[];
  host?: string;
  tags?: string[];
  paths?: string[];
  compact?: boolean;
  groupBy?: string;
  dryRun?: boolean;
  prune?: boolean;
}

/**
 * Restic prune options
 */
export interface PruneOptions {
  maxUnused?: string;
  maxRepackSize?: string;
  repackCachable?: boolean;
  repackSmall?: boolean;
  dryRun?: boolean;
  callbacks?: {
    onProgress?: (progress: any) => void;
    onSummary?: (summary: any) => void;
    onError?: (error: any) => void;
  };
}

/**
 * Restic check options
 */
export interface CheckOptions {
  readData?: boolean;
  readDataSubset?: string;
  withCache?: boolean;
  callbacks?: {
    onProgress?: (progress: any) => void;
    onSummary?: (summary: any) => void;
    onError?: (error: any) => void;
  };
}

/**
 * Restic find options
 */
export interface FindOptions {
  patterns: string[];
  ignoreCase?: boolean;
  long?: boolean;
  host?: string;
  paths?: string[];
  tags?: string[];
  snapshotId?: string;
}

/**
 * Restic list options
 */
export interface ListOptions {
  snapshotId: string;
  path?: string;
  host?: string;
  tags?: string[];
  long?: boolean;
  recursive?: boolean;
}

/**
 * Restic stats options
 */
export interface StatsOptions {
  host?: string;
  tags?: string[];
  paths?: string[];
  mode?: 'restore-size' | 'files-by-contents' | 'blobs-per-file';
}

/**
 * Restic tag options
 */
export interface TagOptions {
  snapshotIds: string[];
  tags: string[];
  add?: boolean;
  remove?: boolean;
  set?: boolean;
}

/**
 * Restic mount options
 */
export interface MountOptions {
  mountPoint: string;
  snapshotId?: string;
  host?: string;
  tags?: string[];
  paths?: string[];
  allowOther?: boolean;
  allowRoot?: boolean;
}

/**
 * Restic diff options
 */
export interface DiffOptions {
  snapshotId1: string;
  snapshotId2: string;
  metadata?: boolean;
}

/**
 * Restic init options
 */
export interface InitOptions {
  copy?: string;
  callbacks?: {
    onProgress?: (progress: any) => void;
    onSummary?: (summary: any) => void;
    onError?: (error: any) => void;
  };
}

/**
 * Restic repository options
 */
export interface RepositoryOptions {
  path: string;
  password?: string;
  passwordFile?: string;
  keyHint?: string;
  noCache?: boolean;
  cacheDir?: string;
  noLock?: boolean;
  jsonOutput?: boolean;
  verbosity?: 0 | 1 | 2 | 3;
  options?: Record<string, string>;
}

/**
 * Restic CLI request options
 */
export interface CLIRequestOptions {
  command: Commands;
  repository?: string;
  password?: string;
  passwordFile?: string;
  keyHint?: string;
  noCache?: boolean;
  cacheDir?: string;
  noLock?: boolean;
  callbacks?: {
    onProgress?: (progress: any) => void;
    onSummary?: (summary: any) => void;
    onError?: (error: any) => void;
  };
  verbosity?: 0 | 1 | 2 | 3;
  additionalParameters?: string[];
  options?: Record<string, string>;
}
