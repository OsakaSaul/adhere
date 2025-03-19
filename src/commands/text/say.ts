import log from "../../utils/logger"
import {
  PermissionFlagsBits,
  SlashCommandBuilder,
  ChannelType, ChatInputCommandInteraction,
} from "discord.js"
import {validateCommand} from "../../utils/permissionsCheck";

export const say = {
  command: new SlashCommandBuilder()
      .setName("say")
      .setDescription("Send a message as the bot.")
      .addStringOption((option) =>
          option
              .setName("message")
              .setDescription("The message to send.")
              .setRequired(true)
      )
      .addChannelOption((option) =>
          option
              .setName("channel")
              .setDescription("The channel to send the message in.")
      )
      .addUserOption((option) =>
          option.setName("user").setDescription("The user to send the message as.")
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) as SlashCommandBuilder,
  async execute(interaction: ChatInputCommandInteraction) {
    if (!await validateCommand(interaction)) {
      return;
    }

    const channel = interaction.options.get("channel")?.channel;
    const message = interaction.options.get("message");
    const user = interaction.options.get("user")?.user;

    if (channel?.type !== ChannelType.GuildText) {
      await interaction.reply({
        content: "This command can only be used in text channels.",
        ephemeral: true,
      });
      return;
    }

    const messageChannel = interaction.guild?.channels.cache.get(channel.id);
    if (messageChannel && messageChannel.type == ChannelType.GuildText) {
      await messageChannel.send(
          user ? `${user}: ${message?.value}` : `${message?.value}`
      );
    }

    await interaction.reply({
      content: user
          ? `Sent message in ${channel} to ${user}`
          : `Sent message in ${channel}`,
      ephemeral: true,
    });

    log(
        user
            ? `send_message command executed by ${interaction.user.tag} in ${interaction.guild?.name}. Sent message "${message?.value}" in ${channel.name} to ${user.tag}`
            : `send_message command executed by ${interaction.user.tag} in ${interaction.guild?.name}. Sent message "${message?.value}" in ${channel.name}`
    );
  },
}