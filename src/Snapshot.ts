export class Snapshot {
    public constructor() {}

    public id!: string;
    public shortId!: string;
    public startedAt!: Date;
    public finishedAt!: Date;
    public duration!: number;
    public newFilesCount!: number;
    public changedFilesCount!: number;
    public unmodifiedFilesCount!: number;
    public newDirectoriesCount!: number;
    public changedDirectoriesCount!: number;
    public unmodifiedDirectoriesCount!: number;
    public dataBlobsCount!: number;
    public treeBlobsCount!: number;
    public dataAdded!: number;
    public dataAddedPacked!: number;
    public totalFilesProcessed!: number;
    public totalBytesProcessed!: number;



    public setId(id: string): this{this.id = id; return this;}
    public setShortId(shortId: string): this{this.shortId = shortId; return this;}
    public setStartedAt(startedAt: Date): this{this.startedAt = startedAt; return this;}
    public setFinishedAt(finishedAt: Date): this{this.finishedAt = finishedAt; return this;}
    public setDuration(duration: number): this{this.duration = duration; return this;}
    public setNewFilesCount(newFilesCount: number): this{this.newFilesCount = newFilesCount; return this;}
    public setChangedFilesCount(changedFilesCount: number): this{this.changedFilesCount = changedFilesCount; return this;}
    public setUnmodifiedFilesCount(unmodifiedFilesCount: number): this{this.unmodifiedFilesCount = unmodifiedFilesCount; return this;}
    public setNewDirectoriesCount(newDirectoriesCount: number): this{this.newDirectoriesCount = newDirectoriesCount; return this;}
    public setChangedDirectoriesCount(changedDirectoriesCount: number): this{this.changedDirectoriesCount = changedDirectoriesCount; return this;}
    public setUnmodifiedDirectoriesCount(unmodifiedDirectoriesCount: number): this{this.unmodifiedDirectoriesCount = unmodifiedDirectoriesCount; return this;}
    public setDataBlobsCount(dataBlobsCount: number): this{this.dataBlobsCount = dataBlobsCount; return this;}
    public setTreeBlobsCount(treeBlobsCount: number): this{this.treeBlobsCount = treeBlobsCount; return this;}
    public setDataAdded(dataAdded: number): this{this.dataAdded = dataAdded; return this;}
    public setDataAddedPacked(dataAddedPacked: number): this{this.dataAddedPacked = dataAddedPacked; return this;}
    public setTotalFilesProcessed(totalFilesProcessed: number): this{this.totalFilesProcessed = totalFilesProcessed; return this;}
    public setTotalBytesProcessed(totalBytesProcessed: number): this{this.totalBytesProcessed = totalBytesProcessed; return this;}
   
}