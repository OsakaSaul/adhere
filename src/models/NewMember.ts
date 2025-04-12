import { Document } from 'mongodb';

export interface NewMember {
    guildId: string;
    userId: string;
    username: string;
    joinedAt: Date;
}

export type NewMemberDocument = NewMember & Document;