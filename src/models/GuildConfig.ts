import { Document } from 'mongodb';

export interface GuildConfig {
    guildId: string;
    redditLink?: string;
}

export type GuildConfigDocument = GuildConfig & Document;