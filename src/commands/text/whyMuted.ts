import log from "../../utils/logger"
import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
    User,
} from "discord.js"
import {validateCommand} from "../../utils/permissionsCheck";

export const whyMuted = {
    command: new SlashCommandBuilder()
        .setName("why_muted")
        .setDescription("Lets the user know why they're muted while cam is off.")
        .addUserOption((option) =>
            option.setName("user").setDescription("The user to inform").setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages) as SlashCommandBuilder,
    async execute(interaction: ChatInputCommandInteraction) {
        if (!await validateCommand(interaction)) {
            return;
        }
        const targetUser = interaction.options.getUser("user") as User;
        await targetUser.send(`We have a bot (that's me) which mutes you in voice chat while your camera is turned off in certain voice channels. Turn on your camera to be automatically unmuted. :)`);
        await interaction.reply(`I've sent a message to ${targetUser.tag} to let them know why they're muted.`);
        log(`why_muted command executed by ${interaction.user.tag} in ${interaction.guild?.name} to inform ${targetUser.tag}.`);
    },
}
