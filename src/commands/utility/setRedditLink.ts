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
        const guildId = interaction.guildId as string;
        const link = interaction.options.get("link")
        if (link && typeof link.value === 'string' && isValidUrl(link.value)) {
            await guildConfigService.updateGuildConfig(guildId, { redditLink: link.value })
            await interaction.reply(`Reddit link set to ${link.value}.`)
            log(`Reddit link set to ${link.value} in ${interaction.guild?.name}.`)
        } else {
            await interaction.reply(`Error setting reddit link. Please provide a valid URL.`)
            log(`Error setting reddit link in ${interaction.guild?.name}.`)
        }
    },
}
