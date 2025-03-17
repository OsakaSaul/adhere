import { setEnabledStatus } from "../../connections/mongoDb"
import log from "../../lib/logger"
import {
  CommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js"

const botName = process.env.BOT_NAME

export const enable = {
  command: new SlashCommandBuilder()
    .setName("enable")
    .setDescription(
      `Enable ${botName} voice channel camera requirement globally.`
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction: CommandInteraction) {
    await interaction.deferReply()
    if (!interaction.guildId) {
      await interaction.editReply("This command can only be used in a server.")
      return
    }
    await setEnabledStatus(interaction.guildId, true)
      .then(async () => {
        await interaction.editReply(`${botName} enabled.`)
      })
      .catch(async (err) => {
        await interaction.editReply(`Error enabling ${botName}.`)
        log(err)
      })
  },
}
