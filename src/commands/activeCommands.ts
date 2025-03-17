import { say } from "./text/say"
import { whymuted } from "./text/whymuted"
import { disable } from "./utility/disable"
import { enable } from "./utility/enable"
import { setlogchannel } from "./utility/setLogChannel"
import { ping } from "./utility/ping"

export const activeCommands = {
  enable,
  disable,
  whymuted,
  say,
  setlogchannel,
  ping,
}

export const activeCommandsList = Object.values(activeCommands)
