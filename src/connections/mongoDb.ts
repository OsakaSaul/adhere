import { MongoClient, ServerApiVersion } from "mongodb"
import NumberSetting, { NumberSettingType } from "../models/numberSetting"
import LogChannelSetting, { LogType } from "../models/logChannelSetting"
import MemberMutedByBot from "../models/memberMutedByBot"
import GuildJoinEvent from "../models/guildJoinEvent"
import VoiceChannelEvent, {
  VoiceChannelAction,
} from "../models/voiceChannelEvent"
import { GuildMember, VoiceBasedChannel } from "discord.js"
import { GuildInviteData, InviteData } from "../models/inviteData"

// const mongoUser = process.env.MONGO_USER
// const mongoPass = process.env.MONGO_PASS
const mongoDb = process.env.MONGO_DB
// const mongoUrl = process.env.MONGO_URL
// const uri = `mongodb+srv://${mongoUser}:${mongoPass}@${mongoUrl}/${mongoDb}?retryWrites=false&w=majority`
const uri = `mongodb://mongodb/${mongoDb}?retryWrites=false&w=majority`

const mongoClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

export const getEnabledStatus = async (guildId: string): Promise<boolean> => {
  const database = mongoClient.db(mongoDb)
  const result = await database
    .collection<NumberSetting>("numberSettings")
    .findOne({ name: "enabledOnServer", guildId: guildId })
  return !!result
}

export const setEnabledStatus = async (guildId: string, status: boolean) => {
  const statusNumber = status ? 1 : 0
  const database = mongoClient.db(mongoDb)
  return await database
    .collection<NumberSetting>("numberSettings")
    .updateOne(
      { name: "enabledOnServer", guildId: guildId },
      { $set: { value: statusNumber } },
      { upsert: true }
    )
}

export const insertVoiceChannelEvent = async (
  guildId: string,
  member: GuildMember,
  channel: VoiceBasedChannel,
  action: VoiceChannelAction
) => {
  const database = mongoClient.db(mongoDb)
  const voiceChannelEvent =
    database.collection<VoiceChannelEvent>("voiceChannelEvent")

  return await voiceChannelEvent.insertOne({
    guildId: guildId,
    memberId: member.id,
    memberName: member.user.username,
    channelId: channel.id,
    channelName: channel.name,
    action: action,
    timestamp: new Date(),
  })
}

export const insertGuildJoinEvent = async (
  guildId: string,
  member: GuildMember,
  inviteCode?: string
) => {
  const database = mongoClient.db(mongoDb)
  const guildJoinEvent = database.collection<GuildJoinEvent>("guildJoinEvent")
  return await guildJoinEvent.insertOne({
    guildId: guildId,
    memberId: member.id,
    inviteCode: inviteCode ? inviteCode : "none",
    timestamp: new Date(),
  })
}

export const setInvitesData = async (guildId: string, discordInvitesData) => {
  const database = mongoClient.db(mongoDb)
  const invitesData = database.collection<InviteData>("invitesData")
  return await invitesData.updateOne(
    { guildId: guildId },
    { $set: { invites: discordInvitesData } },
    { upsert: true }
  )
}

export const getInvitesData = async (guildId: string) => {
  const database = mongoClient.db(mongoDb)
  const invitesData = database.collection<GuildInviteData>("invitesData")
  const result = await invitesData.findOne({ guildId: guildId })
  return result?.invites || []
}

export const incrementInvite = async (guildId: string, code: string) => {
  const database = mongoClient.db(mongoDb)
  const invitesData = database.collection<InviteData>("invitesData")
  const inviteCount = await invitesData.findOne({
    guildId: guildId,
    "invites.code": code,
  })

  if (inviteCount) {
    const newInviteCount = inviteCount[code] + 1
    return await invitesData.updateOne(
      { guildId: guildId, "invites.code": code },
      {
        $set: {
          "invites.uses": newInviteCount,
        },
      },
      { upsert: true }
    )
  } else {
    return undefined
  }
}

export const setMemberMutedByBot = async (
  guildId: string,
  memberId: string,
  serverMuted: boolean
) => {
  const database = mongoClient.db(mongoDb)
  const memberMuted = database.collection<MemberMutedByBot>("memberMutedByBot")
  await memberMuted.updateOne(
    { guildId: guildId, memberId: memberId },
    { $set: { serverMuted: serverMuted } },
    { upsert: true }
  )
}

export const setNumberSetting = async (
  settingName: NumberSettingType,
  value: number,
  guildId: string
) => {
  const database = mongoClient.db(mongoDb)
  const numberSetting = database.collection<NumberSetting>("numberSettings")
  return await numberSetting.updateOne(
    { $inc: { guildId: guildId } },
    { name: settingName, value: value },
    { upsert: true }
  )
}

export const getNumberSetting = async (
  settingName: NumberSettingType,
  guildId: string
) => {
  const database = mongoClient.db(mongoDb)
  const result = await database
    .collection<NumberSetting>("numberSettings")
    .findOne({ name: settingName, guildId: guildId })
  return result ? result.value : 0
}

export const setLogChannelSetting = async (
  guildId: string,
  channelId: string,
  logType: LogType
) => {
  const database = mongoClient.db(mongoDb)
  const logChannelSetting =
    database.collection<LogChannelSetting>("logChannelSettings")
  return await logChannelSetting.updateOne(
    { guildId: guildId },
    { $set: { channelId: channelId, logType: logType } },
    { upsert: true }
  )
}

export const getLogChannelSetting = async (
  guildId: string,
  logType: LogType
) => {
  const database = mongoClient.db(mongoDb)
  return await database
    .collection<LogChannelSetting>("logChannelSetting")
    .findOne({ guildId: guildId, logType: logType })
}

process.on("SIGINT", () => {
  mongoClient.close().then(() => {
    process.exit(0)
  })
})
process.on("SIGTERM", () => {
  mongoClient.close().then(() => {
    process.exit(0)
  })
})
export default mongoClient
