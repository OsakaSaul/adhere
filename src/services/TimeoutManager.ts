import { Guild, GuildMember } from "discord.js";
import log, { lerror } from "../utils/logger";

/**
 * Manages timeouts for kicking members who don't turn on their camera
 */
export class TimeoutManager {
    private timeouts: Map<string, NodeJS.Timeout>;
    private readonly kickDelayMs: number;

    constructor(kickDelayMs: number = 3 * 60 * 1000) { // Default to 3 minutes
        this.timeouts = new Map();
        this.kickDelayMs = kickDelayMs;
    }

    /**
     * Creates a unique key for a guild member
     */
    private getTimeoutKey(member: GuildMember): string {
        return `${member.guild.id}-${member.id}`;
    }

    /**
     * Schedules a member to be kicked after the configured delay
     */
    public scheduleKick(guild: Guild, member: GuildMember): void {
        log(`${guild.name}: Scheduling kick for ${member.user.username} in ${this.kickDelayMs / 1000} seconds`);
        const key = this.getTimeoutKey(member);

        // Clear any existing timeout for this member
        this.clearKickTimeout(member);

        // Schedule new timeout
        const timeout = setTimeout(async () => {
            try {
                if (member.voice?.channel) {
                    log(`${guild.name}: Kicking ${member.user.username} after timeout (no camera)`);
                    await member.voice.disconnect();
                }
            } catch (error) {
                lerror(`Failed to kick ${member.user.username}: ${error}`);
            } finally {
                // Remove the timeout from the map
                this.timeouts.delete(key);
            }
        }, this.kickDelayMs);

        // Store the timeout reference
        this.timeouts.set(key, timeout);

        log(`${guild.name}: Scheduled kick for ${member.user.username} in ${this.kickDelayMs/1000} seconds`);
    }

    /**
     * Clears a scheduled kick timeout for a member
     */
    public clearKickTimeout(member: GuildMember): void {
        const key = this.getTimeoutKey(member);
        const timeout = this.timeouts.get(key);

        if (timeout) {
            clearTimeout(timeout);
            this.timeouts.delete(key);
            log(`${member.guild.name}: Cleared kick timeout for ${member.user.username}`);
        }
    }
}

// Export a singleton instance
export const timeoutManager = new TimeoutManager();