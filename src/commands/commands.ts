import {Collection, SlashCommandBuilder} from 'discord.js';
import { say } from "./text/say"
import { whyMuted } from "./text/whyMuted"
import { requireCamera } from "./utility/requireCamera"
import { setRedditLink } from "./utility/setRedditLink"
import { setWelcomeThreshold } from "./utility/setWelcomeThreshold"


export interface Command {
    command: SlashCommandBuilder;
    execute: (interaction: any) => Promise<void>;
}

// Create and export the commands collection
const commands = new Collection<string, Command>();

// Register all commands in the collection
commands.set(say.command.name, say);
commands.set(whyMuted.command.name, whyMuted);
commands.set(requireCamera.command.name, requireCamera);
commands.set(setRedditLink.command.name, setRedditLink);
commands.set(setWelcomeThreshold.command.name, setWelcomeThreshold);

export default commands;