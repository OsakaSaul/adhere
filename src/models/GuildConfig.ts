import { Document } from 'mongodb';

export interface GuildConfig {
    guildId: string;
    requireCamera: boolean;
    welcomeThreshold: number;
    joinCount: number;
    redditLink?: string;
}

export type GuildConfigDocument = GuildConfig & Document;