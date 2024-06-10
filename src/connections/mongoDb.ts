import { MongoClient, ServerApiVersion } from "mongodb"
import NumberSetting, { NumberSettingType } from "../models/numberSetting"
import VoiceChannelEvent, {
  VoiceChannelAction,
} from "../models/voiceChannelEvent"
import { GuildMember, VoiceBasedChannel } from "discord.js"
import MemberMutedByBot from "../models/memberMutedByBot"
import { InviteData } from "../models/inviteData"
const mongoUser = process.env.MONGO_USER
const mongoPass = process.env.MONGO_PASS
const mongoDb = process.env.MONGO_DB
const mongoUrl = process.env.MONGO_URL
const uri = `mongodb+srv://${mongoUser}:${mongoPass}@${mongoUrl}/${mongoDb}?retryWrites=false&w=majority`

const mongoClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

export const getEnabledStatus = async (guildId: string) => {
  const database = mongoClient.db(mongoDb)
  const result = await database
    .collection<NumberSetting>("numberSettings")
    .findOne({ name: "enabledOnServer", guildId: guildId })
  return result ? result.value : 0
}

export const setEnabledStatus = async (guildId: string, status: boolean) => {
  const statusNumber = status ? 1 : 0
  const database = mongoClient.db(mongoDb)
  const result = await database
    .collection<NumberSetting>("numberSettings")
    .updateOne(
      { name: "enabledOnServer", guildId: guildId },
      { $set: { value: statusNumber } },
      { upsert: true }
    )
  return result
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

  const result = await voiceChannelEvent.insertOne({
    guildId: guildId,
    memberId: member.id,
    memberName: member.user.username,
    channelId: channel.id,
    channelName: channel.name,
    action: action,
    timestamp: new Date(),
  })

  return result
}

export const setInvitesData = async (guildId: string, inviteData: object) => {
  const database = mongoClient.db(mongoDb)
  const invitesData = database.collection<InviteData>("invitesData")
  const result = await invitesData.updateOne(
    { guildId: guildId },
    { $set: { invites: inviteData } },
    { upsert: true }
  )
  return result
}

export const getInvitesData = async (guildId: string) => {
  const database = mongoClient.db(mongoDb)
  const invitesData = database.collection<InviteData>("invitesData")
  const result = await invitesData.findOne({ guildId: guildId })

  return result
}

export const incrementInvite = async (guildId: string, inviteId: string) => {
  const database = mongoClient.db(mongoDb)
  const invitesData = await database.collection<InviteData>("invitesData")
  const inviteCount = await invitesData.findOne({ guildId: guildId })

  if (inviteCount) {
    const newInviteCount = inviteCount.invites[inviteId] + 1
    const result = await invitesData.updateOne(
      { guildId: guildId },
      {
        $set: {
          invites: {
            [inviteId]: newInviteCount,
          },
        },
      },
      { upsert: true }
    )
    return result
  } else {
    return null
  }
}

export const setMemberMutedByBot = async (
  guildId: string,
  memberId: string,
  serverMuted: boolean
) => {
  const database = mongoClient.db(mongoDb)
  const memberMuted = database.collection<MemberMutedByBot>("memberMutedByBot")
  const result = await memberMuted.updateOne(
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
  const result = await numberSetting.updateOne(
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
