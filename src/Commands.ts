/**
 * Enum representing all available Restic commands
 */
export enum Commands {
  // Main commands
  BACKUP = "backup",
  SNAPSHOTS = "snapshots",
  RESTORE = "restore",
  FORGET = "forget",
  PRUNE = "prune",
  CHECK = "check",
  
  // Repository management
  INIT = "init",
  UNLOCK = "unlock",
  REBUILD_INDEX = "rebuild-index",
  
  // Data inspection
  DIFF = "diff",
  FIND = "find",
  LS = "ls",
  MOUNT = "mount",
  CAT = "cat",
  
  // Maintenance
  CACHE = "cache",
  COPY = "copy",
  MIGRATE = "migrate",
  REPAIR = "repair",
  REWRITE = "rewrite",
  
  // Information
  STATS = "stats",
  TAG = "tag",
  VERSION = "version",
  KEY = "key",
  
  // Miscellaneous
  SELF_UPDATE = "self-update",
  GENERATE = "generate",
}