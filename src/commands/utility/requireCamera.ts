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

        try {
            const guildId = interaction.guildId as string;
            const subcommand = interaction.options.getSubcommand();
            const guildConfig = await guildConfigService.getGuildConfig(guildId);
            log (`guildConfig: ${guildConfig.requireCamera}`);

            if (subcommand === 'on') {
                guildConfig.requireCamera = true;
                await guildConfigService.updateGuildConfig(guildId, guildConfig);
                log(`Camera requirement in voice channels has been enabled in guildId: ${guildId}`);
                await interaction.reply({
                    content: 'Camera requirement in voice channels has been **enabled** in this server.',
                    ephemeral: true
                });
            } else if (subcommand === 'off') {
                guildConfig.requireCamera = false;
                await guildConfigService.updateGuildConfig(guildId, guildConfig);
                log(`Camera requirement in voice channels has been disabled in guildId: ${guildId}`);
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
            log(`Error updating camera enforcement setting in guildId: ${error}`);
            await interaction.reply({
                content: 'An error occurred while updating the camera enforcement setting.',
                ephemeral: true
            });
        }
    },
}
