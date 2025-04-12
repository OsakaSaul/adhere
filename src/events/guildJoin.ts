import {
  GuildMember, TextChannel,
} from "discord.js"
import {GuildConfigService} from "../services/GuildConfigService";
import {WelcomeMessageService} from "../services/WelcomeMessageService";
import log from "../utils/logger";
import ChannelService from "../services/ChannelService";


const guildConfigService = new GuildConfigService()
const welcomeMessageService = new WelcomeMessageService()

let newMembers: GuildMember[] = []


export async function guildMemberAddEvent(member: GuildMember) {
  try {
    const guildId = member.guild.id
    await guildConfigService.incrementJoinCount(guildId)
    const guildConfig = await guildConfigService.getGuildConfig(guildId)

    log(`${member.guild.name}: ${member.user.id} joined guild.`)

    if (member.user) {
      newMembers.push(member)
    }

    log(`checking ${newMembers.length} >= ${guildConfig.welcomeThreshold}.`)

    if (newMembers.length >= guildConfig.welcomeThreshold) {
      log(`looking for channels to send welcome message`)
      const channelService = new ChannelService(member.guild.channels)
      const welcomeChannel = channelService.findWelcomeChannel() as TextChannel
      if (welcomeChannel) {
        log(`found channel ${welcomeChannel.name} to send welcome message`)
        await welcomeMessageService.send(guildConfig, welcomeChannel, newMembers)
        newMembers = []
        log(`Welcome message sent`)
      } else {
        log(`No channels found for welcome message`)
      }
    }

  } catch (error) {
    log(`Error in guildMemberAddEvent: ${error}`)
  }
}
