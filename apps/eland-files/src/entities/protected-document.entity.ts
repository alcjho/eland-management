import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Album } from './album.entity';

@Entity('protected_documents')
export class ProtectedDocument {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    ownerId: string;

    @Column({ type: 'varchar', nullable: false })
    path: string;

    @Column({ type: 'varchar', nullable: false })
    filename: string;

    @Column({ type: 'varchar', nullable: false })
    originalName: string;

    @Column({ type: 'varchar', nullable: true })
    mimeType: string;

    @Column({ type: 'text', nullable: true }) // Changed from base64 string to text for large data
    base64: string;

    // The relationship back to the album
    @ManyToOne(() => Album, (album) => album.documents, { onDelete: 'CASCADE' })
    album: Album;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}