import log, { lerror } from "./utils/logger"
import * as dotenv from "dotenv"
dotenv.config()
const botToken = process.env.DISCORD_BOT_TOKEN
//const mongoDb = process.env.MONGO_DB

//import mongoClient, { getNumberSetting, getEnabledStatus,} from "./connections/mongoDb"
import { getEnabledStatus,} from "./connections/mongoDb"
import { Client, GatewayIntentBits, Guild, GuildMember } from "discord.js"

//const database = mongoClient.db(mongoDb)
const discordClient = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
})
discordClient.login(botToken)

// Export handleEvent so it can be called directly from voiceState.ts
export const handleEvent = async (
    guild: Guild,
    member: GuildMember,
    action: string
) => {
  //const enabledOnServer = await getNumberSetting("enabledOnServer", guild.id)
  const enabledOnServer = true
  if (!enabledOnServer) {
    log(`${guild.name}: Camera requirement not enabled on server.`)
    return
  }
  switch (action) {
    case "joinVoiceChannel":
    case "cameraOff":
      await serverMuteMember(guild, member)
      break
    case "leaveVoiceChannel":
      // await serverUnmuteMember(guild, member)
      break
    case "cameraOn":
      await serverUnmuteMember(guild, member)
      break
  }
}

// The botScheduler can be simplified or removed if no longer needed
export const botScheduler = {
  async run() {
    // This function can now be much simpler - just setup the client
    log("Bot scheduler started - direct event handling mode")
    // Any initialization can go here
  }
}

export const serverMuteMember = async (guild: Guild, member: GuildMember) => {
  // Existing code remains unchanged
  const enabledStatus = await getEnabledStatus(guild.id)
  const botUser = discordClient?.user?.id
  if (!member.voice) return
  if (!botUser) return
  const botGuildMember = await member.voice.channel?.guild.members.fetch(
      botUser
  )
  if (!botGuildMember) return

  // const myMember = await guild.members.fetch({
  //   user: member.user.id,
  //   force: true,
  // })

  if (
      !member.voice.channel?.permissionsFor(botGuildMember)?.has("SendMessages")
  ) {
    log(`${guild.name}: I don't have permissions in this VC.`)
    await member.edit({ mute: false }).catch((e) => {
      lerror(e)
    })
    log(
        `${guild.name}: Unmuted ${member.user.username} in ${member.voice.channel?.name}. JOINED A CHANNEL I DON'T HAVE PERMISSIONS IN.`
    )
    return
  }
  if (!enabledStatus) {
    await member.edit({ mute: false }).catch((e) => {
      lerror(e)
    })
    log(`${guild.name}: Unmuted ${member.user.username} since bot is disabled.`)
    return
  }

  await member.edit({ mute: true }).catch((e) => {
    lerror(e)
  })
  log(`${guild.name}: Muted ${member.user.username}`)
}

export const serverUnmuteMember = async (guild: Guild, member: GuildMember) => {
  // Existing code remains unchanged
  if (!member.voice) return
  await member.edit({ mute: false }).catch((e) => {
    lerror(e)
  })
  setTimeout(async () => {
    if (member.voice.selfVideo) {
      await member.edit({ mute: false }).catch((e) => {
        lerror(e)
      })
    }
    // log("Second try for good measure")
  }, 1500)
  log(`${guild.name}: Unmuted ${member.user.username}`)
}