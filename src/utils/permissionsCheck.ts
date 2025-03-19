import { CommandInteraction, PermissionFlagsBits } from "discord.js";


export async function validateGuildContext(interaction: CommandInteraction): Promise<boolean> {
    if (!interaction.guildId) {
        await interaction.reply("This command can only be used in a server.");
        return false;
    }
    return true;
}

export async function validatePermission(
    interaction: CommandInteraction,
    permission: bigint = PermissionFlagsBits.BanMembers
): Promise<boolean> {
    if (!interaction.memberPermissions?.has(permission)) {
        await interaction.reply("You do not have permission to use this command.");
        return false;
    }
    return true;
}

export async function validateCommand(
    interaction: CommandInteraction,
    permission: bigint = PermissionFlagsBits.BanMembers
): Promise<boolean> {
    return await validateGuildContext(interaction) && await validatePermission(interaction, permission);
}