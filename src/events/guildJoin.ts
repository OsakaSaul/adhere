import {
  GuildMember, TextChannel,
} from "discord.js"
import {GuildConfigService} from "../services/GuildConfigService";
import {WelcomeMessageService} from "../services/WelcomeMessageService";
import log from "../utils/logger";
import ChannelService from "../services/ChannelService";
import { NewMemberService } from "../services/NewMemberService";


const guildConfigService = new GuildConfigService()
const welcomeMessageService = new WelcomeMessageService()
const memberService = new NewMemberService()

let newMembers: GuildMember[] = []


export async function guildMemberAddEvent(member: GuildMember) {
  try {
    const guildId = member.guild.id
    await guildConfigService.incrementJoinCount(guildId)
    const guildConfig = await guildConfigService.getGuildConfig(guildId)

    log(`[${member.guild.name}] ${member.user.id} joined guild.`)

    if (member.user) {
      await memberService.addNewMember(member);
    }

    const pendingMembersCount = await memberService.getNewMembersCount(member.guild);

    log(`[${member.guild.name}] checking ${pendingMembersCount} >= ${guildConfig.welcomeThreshold}.`);
    if (newMembers.length >= guildConfig.welcomeThreshold) {
      log(`[${member.guild.name}] looking for channels to send welcome message`)
      const channelService = new ChannelService(member.guild.channels)
      const welcomeChannel = channelService.findWelcomeChannel() as TextChannel
      if (welcomeChannel) {
        log(`[${member.guild.name}] found channel ${welcomeChannel.name} to send welcome message`)
        await welcomeMessageService.send(guildConfig, welcomeChannel, newMembers)
        await memberService.clearNewMembers(member.guild);
        log(`[${member.guild.name}] Welcome message sent and new members cleared`)
      } else {
        log(`[${member.guild.name}] ERROR: No channels found for welcome message`)
      }
    }

  } catch (error) {
    log(`[${member.guild.name}] ERROR: in guildMemberAddEvent: ${error}`)
  }
}
