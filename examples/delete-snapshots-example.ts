import { Repository } from '../src';

async function main() {
  try {
    // Original repository path from the previous index.ts
    const repo = "C:\\Users\\Francois\\Desktop\\restic_test";
    
    // Create repository instance
    // Pass null as password to use --insecure-no-password flag
    const repository = new Repository({
      path: repo,
      noCache: true,
      options: {
        'insecure-no-password': ''
      }
    });
    
    // Unlock the repository
    await repository.unlock();
    
    // Get current snapshots
    const snapshots = await repository.getSnapshots();
    console.log(`Found ${snapshots.length} snapshots in the repository`);
    
    if (snapshots.length > 0) {
      // Display snapshot information
      snapshots.forEach((snapshot, index) => {
        console.log(`Snapshot ${index + 1}:`);
        console.log(`  ID: ${snapshot.id}`);
        console.log(`  Short ID: ${snapshot.shortId}`);
        console.log(`  Time: ${snapshot.time}`);
        console.log(`  Paths: ${snapshot.paths.join(', ')}`);
        console.log(`  Tags: ${snapshot.tags.join(', ') || 'none'}`);
        console.log('');
      });
      
      // Delete all snapshots (this was in the original code)
      console.log('Deleting all snapshots...');
      await repository.deleteAllSnapshots(true); // true to prune after deletion
      console.log('All snapshots deleted and repository pruned');
      
      // Verify snapshots are gone
      const remainingSnapshots = await repository.getSnapshots(true);
      console.log(`Repository now has ${remainingSnapshots.length} snapshots`);
    } else {
      console.log('No snapshots to delete');
    }
    
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

// Run the example
main().catch(console.error);
