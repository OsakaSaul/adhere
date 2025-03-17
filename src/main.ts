import { Client, Events, GatewayIntentBits } from "discord.js"
// import { guildMemberAddEvent, updateInvitesData } from "./events/guildJoin"
import { guildMemberAddEvent } from "./events/guildJoin"
import { readyEvent } from "./events/ready"
import { voiceStateEvent } from "./events/voiceState"
//import { botScheduler } from "./bot-dispatcher"
import {interactionCreateEvent} from "./events/interactionCreate";


//botScheduler.run()


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
  //client.on("ready", updateInvitesData)
  client.on(Events.VoiceStateUpdate, voiceStateEvent)
  client.on(Events.GuildMemberAdd, guildMemberAddEvent)
  client.on(Events.InteractionCreate, interactionCreateEvent)

  client.login(botToken)
}


startBot();