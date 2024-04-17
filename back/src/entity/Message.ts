import { Entity, ObjectIdColumn, ObjectId, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Message {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  text: string;

  @Column()
  senderName: string;

  @Column()
  fromMe: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  groupId: string;
}