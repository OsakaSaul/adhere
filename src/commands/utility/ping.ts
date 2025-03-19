import {CommandInteraction, SlashCommandBuilder} from "discord.js"
import log from "../../utils/logger";

export const ping = {
    command: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),
    async execute(interaction: CommandInteraction) {
        const user = interaction.user
        await interaction.reply("Pong!")
        log(`Ping command executed by ${user.tag}`)
    },
}