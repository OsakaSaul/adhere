import log from "../utils/logger";
import { Guild } from "discord.js";
import { registerCommands } from "../commands/registerCommands";


export async function guildCreateEvent(guild: Guild) {
  try {
    log(`Joined new guild: ${guild.name} (${guild.id})`)
    log(`Total guilds: ${guild.client.guilds.cache.size}`)
    await registerCommands(guild);
  } catch (error) {
    log(`Error in guildCreateEvent: ${error}`)
  }
}
