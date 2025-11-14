import { Repository } from '../src';
import * as path from 'path';

async function main() {
  try {
    // Original paths from the previous index.ts
    const repo = "C:\\Users\\Francois\\Desktop\\restic_test";
    const src = "C:\\Users\\Francois\\Downloads";
    const src2 = "C:\\Users\\Francois\\Pictures\\Zwift";
    
    // Create repository instance
    // Pass null as password to use --insecure-no-password flag
    const repository = new Repository({
      path: repo,
      noCache: true,
      options: {
        'insecure-no-password': ''
      }
    });
    
    // Unlock the repository (was in the original code)
    await repository.unlock();
    
    // Get and display snapshots (was in the original code)
    const snapshots = await repository.getSnapshots();
    console.log('Current snapshots:', snapshots);
    
    // Perform backup with progress tracking
    console.log(`Starting backup of ${src} and ${src2}...`);
    
    await repository.backup({
      paths: [src, src2],
      tags: ["test", "test2"],
      callbacks: {
        onProgress: (progress) => {
          // Handle progress updates
          console.log(typeof progress === 'string' ? progress : JSON.stringify(progress));
        },
        onSummary: (summary) => {
          // Handle backup summary
          console.log('Backup completed with summary:', summary);
        },
        onError: (error) => {
          // Handle errors
          console.error('Error during backup:', error);
        }
      }
    });
    
    console.log('Backup finished successfully');
    
    // Get updated snapshots
    const updatedSnapshots = await repository.getSnapshots(true);
    console.log(`Repository now has ${updatedSnapshots.length} snapshots`);
    
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

// Run the example
main().catch(console.error);
