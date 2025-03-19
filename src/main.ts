import { Client, Events, GatewayIntentBits } from "discord.js"
import { guildMemberAddEvent } from "./events/guildJoin"
import { readyEvent } from "./events/ready"
import { voiceStateEvent } from "./events/voiceState"
import {interactionCreateEvent} from "./events/interactionCreate";


const botToken = process.env.DISCORD_BOT_TOKEN
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ],
})


const startBot = async () => {
  client.on(Events.ClientReady, readyEvent)
  client.on(Events.VoiceStateUpdate, voiceStateEvent)
  client.on(Events.GuildMemberAdd, guildMemberAddEvent)
  client.on(Events.InteractionCreate, interactionCreateEvent)

  client.login(botToken)
}


startBot();