import {
  GuildMember,
} from "discord.js"
import {GuildConfigService} from "../services/GuildConfigService";
import {WelcomeMessageService} from "../services/WelcomeMessageService";
import log from "../utils/logger";
import ChannelService from "../services/ChannelService";


const guildConfigService = new GuildConfigService()
const welcomeMessageService = new WelcomeMessageService()


export async function guildMemberAddEvent(member: GuildMember) {
  try {
    const guildId = member.guild.id
    await guildConfigService.incrementJoinCount(guildId)
    const guildConfig = await guildConfigService.getGuildConfig(guildId)

    if (guildConfig.joinCount % guildConfig.welcomeThreshold === 0) {
      const channelService = new ChannelService(member.guild.channels)
      const generalChannel = channelService.findGeneralChannel()
      if (generalChannel) {
          await welcomeMessageService.send(guildConfig, generalChannel)
      } else {
          log(`Error finding general channel in ${member.guild.name}.`)
      }
    }

  } catch (error) {
    log(`Error in guildMemberAddEvent: ${error}`)
  }
}
