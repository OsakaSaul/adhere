import {REST, Routes} from "discord.js"
import { Config } from "../config/Config"
import commands from "./commands";
import log from "../utils/logger"

const rest = new REST({ version: '10' }).setToken(Config.DISCORD_BOT_TOKEN);

const commandsData = Array.from(commands.values()).map(cmd => cmd.command.toJSON());


export async function registerCommands(guildId: string): Promise<void> {

    try {
        log('Started refreshing application (/) commands for guild: ' + guildId);
        log(`Registering ${commandsData.length} commands...`);

        // For testing in a specific guild (faster updates during development)
        await rest.put(
            Routes.applicationGuildCommands(Config.DISCORD_APP_ID, guildId),
            { body: commandsData },
        );
        log(`Successfully registered application commands for guild ${guildId}`);

    } catch (error) {
        console.error(error);
    }
}