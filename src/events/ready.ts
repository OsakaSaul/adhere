import {Client, Guild} from "discord.js"
import log from "../lib/logger"
import { registerCommands } from "../commands/registerCommands"

export async function readyEvent(client: Client) {
  log(`Ready! Logged in as ${client.user?.tag}`)
  log(`Connected to ${client.guilds.cache.size} guilds.`)

  client.guilds.cache.forEach(async (guild: Guild) => {
    log(`[${guild.name}] (${guild.id})`)
    registerCommands(guild.id);
  })

}
