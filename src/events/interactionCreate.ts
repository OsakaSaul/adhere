import { Interaction } from "discord.js";
import log from "../lib/logger";
import { activeCommands } from "../commands/activeCommands";

const commands = activeCommands

export async function interactionCreateEvent(interaction: Interaction) {
    log(`Interaction: ${interaction}`)
    if (!interaction.isChatInputCommand()) return
    if (!Object.keys(commands).includes(interaction.commandName)) {
        return
    }
    const command =
        commands[interaction.commandName as unknown as keyof typeof commands]
    try {
        await command.execute(interaction)
    } catch {
        log(`Error executing command: ${interaction.commandName}`)
    }
}