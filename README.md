# ResticJS

A comprehensive TypeScript library for interacting with the [Restic](https://restic.net/) backup tool. This library provides a convenient interface to manage backups, snapshots, and repositories using the Restic CLI.

## Features

- **Complete API Coverage**: Supports all Restic commands and features
- **Platform Independent**: Works on Windows, macOS, and Linux
- **Async/Promise Support**: Modern async API with Promise support
- **Progress Tracking**: Real-time progress updates during operations
- **Type Safety**: Full TypeScript type definitions for all operations
- **Error Handling**: Robust error handling with detailed error information

## Installation

```bash
npm install resticjs
```

### Prerequisites

- [Restic](https://restic.net/) must be installed and available in your PATH
- Node.js 18 or higher

## Quick Start

```typescript
import { openRepository } from 'resticjs';

async function main() {
  // Open an existing repository
  const repo = await openRepository('/path/to/repo', 'your-password');
  
  // Perform a backup
  await repo.backup({
    paths: ['/path/to/backup'],
    tags: ['daily'],
    callbacks: {
      onProgress: (progress) => console.log('Progress:', progress),
      onSummary: (summary) => console.log('Summary:', summary)
    }
  });
  
  // List snapshots
  const snapshots = await repo.getSnapshots();
  console.log(`Found ${snapshots.length} snapshots`);
}

main().catch(console.error);
```

## API Reference

### Repository Operations

#### Creating a Repository

```typescript
import { createRepository } from 'resticjs';

// Create a new repository
const repo = await createRepository('/path/to/repo', 'password');
```

#### Opening a Repository

```typescript
import { openRepository } from 'resticjs';

// Open an existing repository
const repo = await openRepository('/path/to/repo', 'password');
```

#### Backup

```typescript
await repo.backup({
  paths: ['/path/to/backup1', '/path/to/backup2'],
  excludes: ['*.tmp', '*.cache'],
  tags: ['daily', 'important'],
  callbacks: {
    onProgress: (progress) => console.log('Progress:', progress),
    onSummary: (summary) => console.log('Summary:', summary),
    onError: (error) => console.error('Error:', error)
  }
});
```

#### Restore

```typescript
// Restore a specific snapshot
await repo.restore({
  snapshotId: 'snapshot-id',
  target: '/path/to/restore',
  verify: true
});

// Or restore from a snapshot object
const snapshots = await repo.getSnapshots();
if (snapshots.length > 0) {
  await snapshots[0].restore('/path/to/restore');
}
```

#### Managing Snapshots

```typescript
// Get all snapshots
const snapshots = await repo.getSnapshots();

// Find a specific snapshot
const snapshot = await repo.getSnapshot('snapshot-id');

// Delete a snapshot
await repo.deleteSnapshot('snapshot-id');

// Delete all snapshots
await repo.deleteAllSnapshots();

// Forget snapshots based on policy
await repo.forget({
  keepLast: 7,
  keepDaily: 7,
  keepWeekly: 4,
  keepMonthly: 6,
  prune: true
});
```

#### Repository Maintenance

```typescript
// Prune the repository
await repo.prune();

// Check repository integrity
await repo.check({ readData: true });

// Unlock the repository
await repo.unlock();

// Rebuild the index
await repo.rebuildIndex();
```

### Snapshot Operations

```typescript
// Get snapshot information
console.log(snapshot.id);
console.log(snapshot.time);
console.log(snapshot.tags);

// Delete a snapshot
await snapshot.delete();

// Restore a snapshot
await snapshot.restore('/path/to/restore');

// List files in a snapshot
const files = await snapshot.listFiles();

// Find files in a snapshot
const results = await snapshot.findFiles(['*.txt']);

// Update snapshot tags
await snapshot.updateTags(['important', 'archived'], 'add');
```

### Utility Functions

```typescript
import { isResticAvailable, getResticVersion } from 'resticjs';

// Check if Restic is installed
const available = await isResticAvailable();

// Get Restic version
const version = await getResticVersion();
```

## Advanced Usage

### Custom Repository Options

```typescript
import { Repository } from 'resticjs';

const repo = new Repository({
  path: '/path/to/repo',
  password: 'password',
  keyHint: 'key-id',
  noCache: false,
  cacheDir: '/path/to/cache',
  verbosity: 1
});

await repo.loadSnapshots();
```

### Low-level API

```typescript
import { request, Commands } from 'resticjs';

// Direct command execution
const result = await request({
  command: Commands.SNAPSHOTS,
  repository: '/path/to/repo',
  password: 'password',
  verbosity: 2
});
```

## Error Handling

```typescript
import { ResticError } from 'resticjs';

try {
  await repo.backup({
    paths: ['/path/to/backup']
  });
} catch (error) {
  if (error instanceof ResticError) {
    console.error(`Restic error (code ${error.exitCode}): ${error.message}`);
    console.error(`Command: ${error.command}`);
    console.error(`Output: ${error.stderr}`);
  } else {
    console.error('Unknown error:', error);
  }
}
```

## Platform-specific Notes

### Windows

On Windows, paths are automatically handled correctly. You can use either Windows-style paths (`C:\path\to\backup`) or Unix-style paths (`/path/to/backup`).

### Password Handling

For better security, consider using a password file instead of passing the password directly:

```typescript
const repo = await openRepository('/path/to/repo', undefined, '/path/to/password-file');
```

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgements

- [Restic](https://restic.net/) - The backup tool that this library wraps
- [Node.js](https://nodejs.org/) - The runtime environment
- [TypeScript](https://www.typescriptlang.org/) - The language used