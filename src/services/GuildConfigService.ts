import mongoClient from "../connections/mongoDb";
import { GuildConfig, GuildConfigDocument } from "../models/GuildConfig";
import { Config } from "../config/Config";

export class GuildConfigService {
    private database = mongoClient.db(Config.MONGO_DATABASE);
    private guildConfigs = this.database.collection<GuildConfigDocument>("GuildConfigDocument");

    public async getGuildConfig(guildId: string): Promise<GuildConfig> {
        const config = await this.guildConfigs.findOne({ guildId });
        if (config) {
            return config;
        }
        // Return default configuration if none exists
        return { guildId };
    }

    public async updateGuildConfig(
        guildId: string,
        updates: Partial<Omit<GuildConfig, "guildId">>
    ): Promise<void> {
        await this.guildConfigs.updateOne(
            { guildId },
            { $set: updates },
            { upsert: true }
        );
    }
}
