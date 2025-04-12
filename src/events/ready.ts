import {Client, Guild} from "discord.js"
import log from "../utils/logger"
import { registerCommands } from "../commands/registerCommands"


export async function readyEvent(client: Client) {
  log(`Ready! Logged in as ${client.user?.tag}`)
  log(`Connected to ${client.guilds.cache.size} guilds.`)

  await Promise.all(
      client.guilds.cache.map(async (guild: Guild) => {
        log(`[${guild.name}] (${guild.id})`)
        await registerCommands(guild);
      })
  );
}
