import { say } from "./text/say"
import { whyMuted } from "./text/whyMuted"
import { disable } from "./utility/disable"
import { enable } from "./utility/enable"
import { setlogchannel } from "./utility/setLogChannel"
import { ping } from "./utility/ping"

export const activeCommands = {
  enable,
  disable,
  whyMuted,
  say,
  setlogchannel,
  ping,
}

export const activeCommandsList = Object.values(activeCommands)
