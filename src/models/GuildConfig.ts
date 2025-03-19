import { Document } from 'mongodb';

export interface GuildConfig {
    guildId: string;
    requireCamera: boolean;
    redditLink?: string;
}

export type GuildConfigDocument = GuildConfig & Document;