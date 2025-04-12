import { Guild, REST, Routes } from "discord.js"
import { Config } from "../config/Config"
import commands from "./commands";
import log from "../utils/logger"


const rest = new REST({ version: '10' }).setToken(Config.DISCORD_BOT_TOKEN);
const commandsData = Array.from(commands.values()).map(cmd => cmd.command.toJSON());


export async function registerCommands(guild: Guild): Promise<void> {

    try {
        log(`[${guild.name}] Registering ${commandsData.length} commands`);
        await rest.put(
            Routes.applicationGuildCommands(Config.DISCORD_APP_ID, guild.id),
            { body: commandsData },
        );
        log(`[${guild.name}] Successfully registered commands`);
    }
    catch (error) {
        log(`[${guild.name}] ERROR: failed registering commands: ${error}`);
    }
}
