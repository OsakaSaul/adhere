import log from "../utils/logger"
import { VoiceState, GuildMember } from "discord.js"
import { handleEvent } from "../services/bot-dispatcher"


const memberMoved = (
  member: GuildMember,
  oldState: VoiceState,
  newState: VoiceState
) => {
  const oldChannel = oldState.channel
  const newChannel = newState.channel
  if (oldState.channel !== newState.channel) {
    if (member) {
      if (oldChannel && newChannel) {
        return true
      }
    }
  }
  return false
}

const memberJoined = (
  member: GuildMember,
  oldState: VoiceState,
  newState: VoiceState
) => {
  const oldChannel = oldState.channel
  const newChannel = newState.channel
  if (oldState.channel !== newState.channel) {
    if (member) {
      if (!oldChannel && newChannel) {
        return true
      }
    }
  }
  return false
}

const memberLeft = (
  member: GuildMember,
  oldState: VoiceState,
  newState: VoiceState
) => {
  const oldChannel = oldState.channel
  const newChannel = newState.channel
  if (oldState.channel !== newState.channel) {
    if (member) {
      if (oldChannel && !newChannel) {
        return true
      }
    }
  }
  return false
}

const cameraDisabled = (
  member: GuildMember,
  oldState: VoiceState,
  newState: VoiceState
) => {
  const newChannel = newState.channel
  const oldCamState = oldState.selfVideo ? "on" : "off"
  const newCamState = newState.selfVideo ? "on" : "off"
  if (oldState.channel == newState.channel) {
    if (newChannel && member && oldCamState !== newCamState) {
      if (!newState.selfVideo) {
        return true
      }
    }
  }
  return false
}

const cameraEnabled = (
  member: GuildMember,
  oldState: VoiceState,
  newState: VoiceState
) => {
  const newChannel = newState.channel
  const oldCamState = oldState.selfVideo ? "on" : "off"
  const newCamState = newState.selfVideo ? "on" : "off"
  if (oldState.channel == newState.channel) {
    if (newChannel && member && oldCamState !== newCamState) {
      if (newState.selfVideo) {
        return true
      }
    }
  }
  return false
}
const screenShared = (
  member: GuildMember,
  oldState: VoiceState,
  newState: VoiceState
) => {
  const newChannel = newState.channel
  const oldShareState = oldState.streaming ? "on" : "off"
  const newShareState = newState.streaming ? "on" : "off"
  if (oldState.channel == newState.channel) {
    if (newChannel && member && oldShareState !== newShareState) {
      if (newState.streaming) {
        return true
      }
    }
  }
  return false
}

const screenUnshared = (
  member: GuildMember,
  oldState: VoiceState,
  newState: VoiceState
) => {
  const newChannel = newState.channel
  const oldShareState = oldState.streaming ? "on" : "off"
  const newShareState = newState.streaming ? "on" : "off"
  if (oldState.channel == newState.channel) {
    if (newChannel && member && oldShareState !== newShareState) {
      if (!newState.streaming) {
        return true
      }
    }
  }
  return false
}

export function voiceStateEvent(oldState: VoiceState, newState: VoiceState) {
  const member = newState.member
  const userName = member?.user.tag
  //const guildId = newState.guild.id
  const guild = newState.guild

  if (!member) {
    return
  }

  if (userName === newState.client.user.tag || member?.user.bot) {
    // ignore myself and other bots
    return
  }

  // Instead of inserting into MongoDB, call handleEvent directly
  if (memberJoined(member, oldState, newState) && newState.channel) {
    log(`[${newState.guild.name}] ${userName} joined ${newState.channel?.name}.`)
    handleEvent(guild, member, "joinVoiceChannel")
  }

  if (memberLeft(member, oldState, newState) && oldState.channel) {
    log(`[${newState.guild.name}] ${userName} left ${oldState.channel?.name}.`)
    handleEvent(guild, member, "leaveVoiceChannel")
  }

  if (
      memberMoved(member, oldState, newState) &&
      newState.channel &&
      oldState.channel
  ) {
    log(
        `[${newState.guild.name}] ${userName} moved from ${oldState.channel?.name} to ${newState.channel?.name}.`
    )
    handleEvent(guild, member, "leaveVoiceChannel")
    handleEvent(guild, member, "joinVoiceChannel")
  }

  if (cameraDisabled(member, oldState, newState) && newState.channel) {
    log(`[${newState.guild.name}] ${userName} camera disabled.`)
    handleEvent(guild, member, "cameraOff")
  }

  if (cameraEnabled(member, oldState, newState) && newState.channel) {
    log(`[${newState.guild.name}] ${userName} camera enabled.`)
    handleEvent(guild, member, "cameraOn")
  }

  if (screenShared(member, oldState, newState) && newState.channel) {
    log(`[${newState.guild.name}] ${userName} screen shared.`)
    handleEvent(guild, member, "screenShared")
  }

  if (screenUnshared(member, oldState, newState) && newState.channel) {
    log(`[${newState.guild.name}] ${userName} screen unshared.`)
    handleEvent(guild, member, "screenUnshared")
  }
}
