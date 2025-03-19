import { Collection } from 'discord.js';
import { say } from "./text/say"
import { whyMuted } from "./text/whyMuted"
import { disable } from "./utility/disable"
import { enable } from "./utility/enable"
import { setlogchannel } from "./utility/setLogChannel"
import { ping } from "./utility/ping"
import { setRedditLink } from "./text/setRedditLink";


// Define a type for our commands to ensure consistency
export interface Command {
    command: any; // SlashCommandBuilder or any other command builder
    execute: (interaction: any) => Promise<void>;
}

// Create and export the commands collection
const commands = new Collection<string, Command>();

// Register all commands in the collection
commands.set(ping.command.name, ping);
commands.set(say.command.name, say);
commands.set(whyMuted.command.name, whyMuted);
commands.set(disable.command.name, disable);
commands.set(enable.command.name, enable);
commands.set(setlogchannel.command.name, setlogchannel);
commands.set(setRedditLink.command.name, setRedditLink);

export default commands;