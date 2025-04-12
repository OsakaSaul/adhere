import log, { lerror } from "../utils/logger"
import {GuildConfigService} from "./GuildConfigService";
import { Client, GatewayIntentBits, Guild, GuildMember } from "discord.js"
import {Config} from "../config/Config";



const botToken = Config.DISCORD_BOT_TOKEN
const guildConfigService = new GuildConfigService()
const discordClient = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
})

discordClient.login(botToken)


export const handleEvent = async (
    guild: Guild,
    member: GuildMember,
    action: string
) => {
  const guildConfig = await guildConfigService.getGuildConfig(guild.id)
  if (!guildConfig.requireCamera) {
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
    case "screenUnshared":
      await serverUnmuteMember(guild, member)
      break
    case "screenShared":
      await checkScreenShareAllowed(guild, member)
      break
  }
}


export const serverMuteMember = async (guild: Guild, member: GuildMember) => {
  const guildConfig = await guildConfigService.getGuildConfig(guild.id)
  const enabledStatus = guildConfig.requireCamera
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

  const noCameraRequireChannelIds = [
      // oldrubberboot guild
      '1360502181404344352', // No Camera Required
      // Tavern guild
      '779331254705061908',
      '1360463558487314552',
  ]
  if (noCameraRequireChannelIds.includes(member.voice.channel.id)) {
    log(`${guild.name}: No camera required channel:${member.voice.channel?.name}`)
  } else {
    await member.edit({ mute: true }).catch((e) => {
      lerror(e)
    })
    log(`${guild.name}: Muted ${member.user.username}`)
  }
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


export const checkScreenShareAllowed = async (
    guild: Guild,
    member: GuildMember
) => {
  //check if a bronze channel
  // if bronze channel start 1 min timer that kicks the user
  // mute the user
  // message user

  // if stop screen share unmute the user
  // if stop screen share and not in a bronze channel unmute the user
}