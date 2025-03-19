import { say } from "./text/say"
import { whyMuted } from "./text/whyMuted"
import { requireCamera } from "./utility/requireCamera"
import { enable } from "./utility/enable"
import { setlogchannel } from "./utility/setLogChannel"

export const activeCommands = {
  enable,
  requireCam: requireCamera,
  whyMuted,
  say,
  setlogchannel,
}

export const activeCommandsList = Object.values(activeCommands)
