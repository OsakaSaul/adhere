import { say } from "./text/say"
import { whyMuted } from "./text/whyMuted"
import { requireCamera } from "./utility/requireCamera"
import { setRedditLink } from "./utility/setRedditLink"
import { setWelcomeThreshold } from "./utility/setWelcomeThreshold"

export const activeCommands = {
  requireCamera,
  whyMuted,
  say,
  setRedditLink,
  setWelcomeThreshold,
}

export const activeCommandsList = Object.values(activeCommands)
