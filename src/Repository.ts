import { spawnSync } from "child_process";
import { Snapshot } from "./Snapshot";
import { Commands } from "./Commands";
import { request } from "./CLIRequester";


export class Repository {
    private readonly path: string;
    private readonly password?: string;
    private readonly passwordFile?: string;
    private readonly insecureNoPassword: boolean;

    private readonly snapshots: Snapshot[] = [];

    constructor(path: string, password?: string) {
        this.path = path;
        this.password = password;
        this.insecureNoPassword = password === undefined;




        const result = request({
            command: Commands.SNAPSHOTS,
            repository: this.path,
            insecureNoPassword: this.insecureNoPassword,
        })

        for (const snapshot of result) {
            const newSnapshot = new Snapshot()
                .setId(snapshot.id)
                .setShortId(snapshot.short_id)
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
                .setTotalBytesProcessed(snapshot.summary.total_bytes_processed)

            this.snapshots.push(newSnapshot);
        }
    }
}

