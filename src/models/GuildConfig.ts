import { Document } from 'mongodb';

export interface GuildConfig {
    guildId: string;
    requireCamera: boolean;
    welcomeThreshold: number;
    redditLink?: string;
}

export type GuildConfigDocument = GuildConfig & Document;

export const DEFAULT_GUILD_CONFIG: Omit<GuildConfig, 'guildId'> = {
    requireCamera: true,
    welcomeThreshold: 3,
};