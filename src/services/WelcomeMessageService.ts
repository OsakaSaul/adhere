import { GuildConfig } from "../models/GuildConfig";
import { TextChannel } from "discord.js";

export class WelcomeMessageService {

    public async send(guildConfig: GuildConfig, generalChannel: TextChannel): Promise<void> {
        await generalChannel.send(
            `Want to get into Silver calls where all the fun and games are happening? ` +
            `simply up-vote the last 7 posts on my Reddit page, Say votes done and you will ` +
            `obtain silver rank. Plus it really helps the server out too!! ${guildConfig.redditLink}`
        );
    }

}