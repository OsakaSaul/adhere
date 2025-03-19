import log from "../../utils/logger"
import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js"
import {validateCommand} from "../../utils/permissionsCheck";
import {GuildConfigService} from "../../services/GuildConfigService";


const guildConfigService = new GuildConfigService()


export const setWelcomeThreshold = {
    command: new SlashCommandBuilder()
        .setName("set_welcome_threshold")
        .setDescription('Set the number of new members before the welcome message is sent')
        .addIntegerOption(option =>
            option
                .setName('threshold')
                .setDescription('The number of new members before the welcome message is sent')
                .setMinValue(1)
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers) as SlashCommandBuilder,

    async execute(interaction: ChatInputCommandInteraction) {
        if (!await validateCommand(interaction)) {
            return;
        }
        try {
            const guildId = interaction.guildId as string;
            const guildConfig = await guildConfigService.getGuildConfig(guildId);
            log(`Current welcomeThreshold: ${guildConfig.welcomeThreshold}`);
            const threshold = interaction.options.getInteger("threshold");

            if (threshold !== null) {
                // Additional validation in case Discord.js validation is bypassed
                if (threshold <= 0) {
                    await interaction.reply(`Error: Threshold must be a positive integer.`);
                    log(`Invalid threshold value ${threshold} attempted in ${interaction.guild?.name}.`);
                    return;
                }

                await guildConfigService.updateGuildConfig(guildId, {welcomeThreshold: threshold});
                await interaction.reply(`Welcome threshold set to ${threshold}.`);
                log(`Welcome threshold set to ${threshold} in ${interaction.guild?.name}.`);
            } else {
                await interaction.reply(`Error setting threshold. Please provide a valid number.`);
                log(`Error setting threshold in ${interaction.guild?.name}.`);
            }
        } catch (error) {
            log(`Error in setWelcomeThreshold: ${error}`);
            await interaction.reply(`An error occurred while updating the welcome threshold.`);
        }
    }
}