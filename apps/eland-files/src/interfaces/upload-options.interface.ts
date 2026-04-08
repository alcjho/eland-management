export interface UploadOptions {
    entityId: string; // e.g.  ID, lodge ID, etc.
    albumId?: string; // Optional album ID for categorization
    asset: string; // e.g. 'property', 'lodge', etc. to determine storage path
    assetId: string; // e.g. 'property', 'lodge', etc. to determine storage path
    doctype: string; // e.g. 'media', 'document', etc. for further categorization
    name?: string; // Original filename or user-provided name for the file
}