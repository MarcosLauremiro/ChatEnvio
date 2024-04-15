import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id: string;

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
