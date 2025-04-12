import log from "../../utils/logger"
import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js"
import {validateCommand} from "../../utils/permissionsCheck";
import {GuildConfigService} from "../../services/GuildConfigService";


const guildConfigService = new GuildConfigService()


export const requireCamera = {
    command: new SlashCommandBuilder()
        .setName("require_camera")
        .setDescription('Toggle camera requirement in voice channels')
        .addSubcommand(subcommand =>
            subcommand
                .setName('on')
                .setDescription('Enable camera enforcement in voice channels')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('off')
                .setDescription('Disable camera enforcement in voice channels')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('status')
                .setDescription('Check the current status of camera enforcement')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers) as SlashCommandBuilder,

    async execute(interaction: ChatInputCommandInteraction) {
        if (!await validateCommand(interaction)) {
            return;
        }

        if (!interaction.guild) {
            await interaction.reply({
                content: 'This command can only be used in a server.',
                ephemeral: true
            });
            return;
        }

        try {
            const subcommand = interaction.options.getSubcommand();
            const guildConfig = await guildConfigService.getGuildConfig(interaction.guild);
            log(`[${interaction.guild.name}] Current camera requirement setting: ${guildConfig.requireCamera}`);

            if (subcommand === 'on') {
                await guildConfigService.updateGuildConfig(interaction.guild, { requireCamera: true });
                log(`[${interaction.guild.name}] Camera requirement in voice channels has been enabled`);
                await interaction.reply({
                    content: 'Camera requirement in voice channels has been **enabled** in this server.',
                    ephemeral: true
                });
            } else if (subcommand === 'off') {
                await guildConfigService.updateGuildConfig(interaction.guild, { requireCamera: false });
                log(`[${interaction.guild.name}] Camera requirement in voice channels has been disabled`);
                await interaction.reply({
                    content: 'Camera requirement in voice channels has been **disabled** in this server.',
                    ephemeral: true
                });
            } else {
                const status = guildConfig.requireCamera ? 'enabled' : 'disabled';
                await interaction.reply({
                    content: `Camera requirement in voice channels is currently **${status}** in this server.`,
                    ephemeral: true
                });
            }
        } catch (error) {
            log(`[${interaction.guild.name}] Error updating camera enforcement setting: ${error}`);
            await interaction.reply({
                content: 'An error occurred while updating the camera enforcement setting.',
                ephemeral: true
            });
        }
    },
}