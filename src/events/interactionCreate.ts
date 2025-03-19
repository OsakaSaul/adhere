import { Interaction } from "discord.js";
import log from "../utils/logger";
import commands from "../commands/commands";

export async function interactionCreateEvent(interaction: Interaction) {
    log(`Interaction: ${interaction}`)
    if (!interaction.isChatInputCommand()) return
    log(`Command: ${interaction.commandName}`)
    try {
        const command = commands.get(interaction.commandName)
        if (command) {
            await command.execute(interaction)
        } else {
            log(`Command not found: ${interaction.commandName}`)
        }
    } catch {
        log(`Error executing command: ${interaction.commandName}`)
    }
}