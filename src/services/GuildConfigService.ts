import mongoClient from "../connections/mongoDb";
import {DEFAULT_GUILD_CONFIG, GuildConfig, GuildConfigDocument} from "../models/GuildConfig";
import {Config} from "../config/Config";
import log from "../utils/logger";
import {Guild} from "discord.js";

export class GuildConfigService {
    private database = mongoClient.db(Config.MONGO_DATABASE);
    private guildConfigs = this.database.collection<GuildConfigDocument>("GuildConfigs");


    public async getGuildConfig(guild: Guild): Promise<GuildConfig> {
        const guildId = guild.id;
        const config = await this.guildConfigs.findOne({ guildId });

        if (config) {
            log(`[${guild.name}] Retrieved existing GuildConfig: ${JSON.stringify(config, null, 2)}`);
            return config;
        }

        return await this.createDefaultConfig(guild);
    }


    private async createDefaultConfig(guild: Guild): Promise<GuildConfig> {
        const newConfig: GuildConfig = {
            guildId: guild.id,
            ...DEFAULT_GUILD_CONFIG
        };

        await this.guildConfigs.insertOne(newConfig as GuildConfigDocument);
        log(`[${guild.name}] Created new GuildConfig: ${JSON.stringify(newConfig, null, 2)}`);

        return newConfig;
    }


    public async updateGuildConfig(
        guild: Guild,
        updates: Partial<Omit<GuildConfig, "guildId">>
    ): Promise<void> {
        const guildId = guild.id;

        // Ensure configuration exists by calling getGuildConfig
        await this.getGuildConfig(guild);

        // Update only the fields specified in updates
        await this.guildConfigs.updateOne(
            { guildId },
            { $set: updates },
            { upsert: true }
        );

        log(`[${guild.name}] Updated configuration: ${JSON.stringify(updates)}`);
    }


}