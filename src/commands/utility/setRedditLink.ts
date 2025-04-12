import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js"
import log from "../../utils/logger"
import {GuildConfigService} from "../../services/GuildConfigService";
import {Config} from "../../config/Config";
import {validateCommand} from "../../utils/permissionsCheck";
import {isValidUrl} from "../../utils/validation";
import {Command} from "../commands";


const botName = Config.BOT_NAME
const guildConfigService = new GuildConfigService()


export const setRedditLink: Command = {
    command: new SlashCommandBuilder()
        .setName("set_reddit_link")
        .setDescription(`Sets the Reddit link for ${botName} to include in the welcome message.`)
        .addStringOption((option) =>
            option
                .setName("link")
                .setDescription("The reddit link to set.")
                .setRequired(true)
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

        const link = interaction.options.get("link");
        if (link && typeof link.value === 'string' && isValidUrl(link.value)) {
            await guildConfigService.updateGuildConfig(interaction.guild, { redditLink: link.value });
            await interaction.reply({
                content: `Reddit link set to ${link.value}.`,
                ephemeral: true
            });
            log(`[${interaction.guild.name}] Reddit link set to ${link.value}`);
        } else {
            await interaction.reply({
                content: `Error setting Reddit link. Please provide a valid URL.`,
                ephemeral: true
            });
            log(`[${interaction.guild.name}] Error setting Reddit link - invalid URL provided`);
        }
    },
}