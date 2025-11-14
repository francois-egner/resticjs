import { Repository, isResticAvailable, getResticVersion } from '../src';

async function main() {
  try {
    // Check if restic is available
    const available = await isResticAvailable();
    if (!available) {
      console.error('Restic is not installed or not in PATH');
      process.exit(1);
    }
    
    // Get restic version
    const version = await getResticVersion();
    console.log(`Using Restic version: ${version}`);
    
    // Original paths from the previous index.ts
    const repo = "C:\\Users\\Francois\\Desktop\\restic_test";
    const src = "C:\\Users\\Francois\\Downloads";
    const src2 = "C:\\Users\\Francois\\Pictures\\Zwift";
    
    // Create repository instance
    console.log(`Opening repository at ${repo}...`);
    // Pass null as password to use --insecure-no-password flag
    const repository = new Repository({
      path: repo,
      noCache: true,
      options: {
        'insecure-no-password': ''
      }
    });
    
    // Unlock the repository (was in the original code)
    console.log('Unlocking repository...');
    await repository.unlock();
    
    // Get and display snapshots (was in the original code)
    console.log('Loading existing snapshots...');
    const snapshots = await repository.getSnapshots();
    console.log(`Found ${snapshots.length} snapshots in the repository`);
    
    // Display snapshot details if any exist
    if (snapshots.length > 0) {
      console.log('\nExisting snapshots:');
      snapshots.forEach((snapshot, index) => {
        console.log(`Snapshot ${index + 1}:`);
        console.log(`  ID: ${snapshot.shortId}`);
        console.log(`  Time: ${snapshot.time}`);
        console.log(`  Paths: ${snapshot.paths.join(', ')}`);
      });
      
      // Delete all snapshots (was in the original code)
      console.log('\nDeleting all snapshots...');
      await repository.deleteAllSnapshots();
      console.log('All snapshots deleted');
    }
    
    // Perform backup with progress tracking (was in the original code)
    console.log(`\nStarting backup of ${src} and ${src2}...`);
    
    await new Promise<void>((resolve, reject) => {
      repository.backup({
        paths: [src, src2],
        tags: ["test", "test2"],
        callbacks: {
          onProgress: (progress) => {
            // Only log JSON progress updates to avoid console spam
            if (typeof progress === 'object') {
              const percent = progress.percent_done !== undefined 
                ? `${(progress.percent_done * 100).toFixed(1)}%` 
                : 'unknown';
              console.log(`Progress: ${percent}`);
            }
          },
          onSummary: (summary) => {
            console.log('Backup completed with summary:', summary);
            resolve();
          },
          onError: (error) => {
            console.error('Error during backup:', error);
            reject(error);
          }
        }
      }).catch(reject);
    });
    
    // Get updated snapshots
    console.log('\nRetrieving updated snapshot list...');
    const updatedSnapshots = await repository.getSnapshots(true);
    console.log(`Repository now has ${updatedSnapshots.length} snapshots`);
    
    if (updatedSnapshots.length > 0) {
      console.log('\nNew snapshots:');
      updatedSnapshots.forEach((snapshot, index) => {
        console.log(`Snapshot ${index + 1}:`);
        console.log(`  ID: ${snapshot.shortId}`);
        console.log(`  Time: ${snapshot.time}`);
        console.log(`  Paths: ${snapshot.paths.join(', ')}`);
        console.log(`  Files: ${snapshot.newFilesCount} new, ${snapshot.changedFilesCount} changed, ${snapshot.unmodifiedFilesCount} unmodified`);
        console.log(`  Data added: ${formatBytes(snapshot.dataAdded || 0)}`);
      });
    }
    
    console.log('\nAll operations completed successfully');
    
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

// Helper function to format bytes
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Run the example
main().catch(console.error);
