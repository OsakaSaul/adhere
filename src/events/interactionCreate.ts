import { Interaction } from "discord.js";
import log from "../utils/logger";
import commands from "../commands/commands";
// import ChannelService from "../services/ChannelService";
// import {WelcomeMessageService} from "../services/WelcomeMessageService";
// import {GuildConfigService} from "../services/GuildConfigService";

export async function interactionCreateEvent(interaction: Interaction) {
    log(`Interaction: ${interaction}`)
    if (!interaction.isChatInputCommand()) return
    log(`Command: ${interaction.commandName}`)
    try {
        const command = commands.get(interaction.commandName)
        if (command) {
            await command.execute(interaction)
        } else {
            //await testWelcomeMessage(interaction)
            log(`Command not found: ${interaction.commandName}`)
        }
    } catch {
        log(`Error executing command: ${interaction.commandName}`)
    }
}



// async function testWelcomeMessage(interaction: Interaction) {
//     if (interaction.guild) {
//         log(`Testing welcome message in ${interaction.guild.name}.`);
//         const guildConfigService = new GuildConfigService();
//         const guildConfig = await guildConfigService.getGuildConfig(interaction.guildId as string);
//         const channelManager = interaction.guild.channels;
//         const channelService = new ChannelService(channelManager);
//         const generalChannel = channelService.findGeneralChannel();
//         const welcomeMessageService = new WelcomeMessageService();
//         if (generalChannel) {
//             await welcomeMessageService.send(guildConfig, generalChannel);
//         } else {
//             log(`Error finding general channel in ${interaction.guild.name}.`);
//         }
//     } else {
//         log(`Error finding guild in ${interaction}`);
//     }
// }