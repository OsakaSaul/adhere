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

        // Ensure the interaction has a guild
        if (!interaction.guild) {
            await interaction.reply({
                content: 'This command can only be used in a server.',
                ephemeral: true
            });
            return;
        }

        try {
            const guildConfig = await guildConfigService.getGuildConfig(interaction.guild);
            log(`[${interaction.guild.name}] Current welcomeThreshold: ${guildConfig.welcomeThreshold}`);
            const threshold = interaction.options.getInteger("threshold");

            if (threshold !== null) {
                // Additional validation in case Discord.js validation is bypassed
                if (threshold <= 0) {
                    await interaction.reply({
                        content: `Error: Threshold must be a positive integer.`,
                        ephemeral: true
                    });
                    log(`[${interaction.guild.name}] Invalid threshold value ${threshold} attempted`);
                    return;
                }

                await guildConfigService.updateGuildConfig(interaction.guild, {welcomeThreshold: threshold});
                await interaction.reply({
                    content: `Welcome threshold set to ${threshold}.`,
                    ephemeral: true
                });
                log(`[${interaction.guild.name}] Welcome threshold set to ${threshold}`);
            } else {
                await interaction.reply({
                    content: `Error setting threshold. Please provide a valid number.`,
                    ephemeral: true
                });
                log(`[${interaction.guild.name}] Error setting threshold - null value provided`);
            }
        } catch (error) {
            log(`[${interaction.guild.name}] Error in setWelcomeThreshold: ${error}`);
            await interaction.reply({
                content: `An error occurred while updating the welcome threshold.`,
                ephemeral: true
            });
        }
    }
}