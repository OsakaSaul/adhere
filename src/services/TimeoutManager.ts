import { Guild, GuildMember } from "discord.js";
import log, { lerror } from "../utils/logger";

/**
 * Manages timeouts for kicking members who don't turn on their camera
 */
export class TimeoutManager {
    private timeouts: Map<string, NodeJS.Timeout>;
    private kickHistory: Map<string, { lastKicked: Date, kickCount: number }>;
    private readonly initialKickDelayMs: number;
    private readonly reducedKickDelayMs: number;
    private readonly historyExpirationMs: number;

    constructor(
        initialKickDelayMs: number = 3 * 60 * 1000, // Default to 3 minutes for first offense
        reducedKickDelayMs: number = 60 * 1000,     // Default to 1 minute for repeat offenders
        historyExpirationMs: number = 24 * 60 * 60 * 1000 // History expires after 24 hours
    ) {
        this.timeouts = new Map();
        this.kickHistory = new Map();
        this.initialKickDelayMs = initialKickDelayMs;
        this.reducedKickDelayMs = reducedKickDelayMs;
        this.historyExpirationMs = historyExpirationMs;
    }

    /**
     * Creates a unique key for a guild member
     */
    private getTimeoutKey(member: GuildMember): string {
        return `${member.guild.id}-${member.id}`;
    }

    /**
     * Determines the appropriate kick delay based on the member's history
     */
    private getKickDelayForMember(member: GuildMember): number {
        const key = this.getTimeoutKey(member);
        const history = this.kickHistory.get(key);

        // If no history or history is too old, use initial delay
        if (!history || this.isHistoryExpired(history.lastKicked)) {
            return this.initialKickDelayMs;
        }

        // Use reduced delay for repeat offenders
        return this.reducedKickDelayMs;
    }

    /**
     * Checks if the history has expired
     */
    private isHistoryExpired(lastKickedDate: Date): boolean {
        const now = new Date();
        return (now.getTime() - lastKickedDate.getTime()) > this.historyExpirationMs;
    }

    /**
     * Records a kick in the member's history
     */
    private recordKick(member: GuildMember): void {
        const key = this.getTimeoutKey(member);
        const existingHistory = this.kickHistory.get(key);

        if (existingHistory && !this.isHistoryExpired(existingHistory.lastKicked)) {
            // Update existing history
            this.kickHistory.set(key, {
                lastKicked: new Date(),
                kickCount: existingHistory.kickCount + 1
            });
        } else {
            // Create new history
            this.kickHistory.set(key, {
                lastKicked: new Date(),
                kickCount: 1
            });
        }
    }

    /**
     * Schedules a member to be kicked after the configured delay
     */
    public scheduleKick(guild: Guild, member: GuildMember): void {
        const key = this.getTimeoutKey(member);

        // Determine appropriate kick delay for this member
        const kickDelay = this.getKickDelayForMember(member);

        // Clear any existing timeout for this member
        this.clearKickTimeout(member);

        // Schedule new timeout
        const timeout = setTimeout(async () => {
            try {
                if (member.voice?.channel) {
                    // Record this kick in history
                    this.recordKick(member);

                    const history = this.kickHistory.get(key);
                    const kickCount = history ? history.kickCount : 1;

                    log(`${guild.name}: Kicking ${member.user.username} after timeout (no camera) - Offense #${kickCount}`);
                    await member.voice.disconnect();
                }
            } catch (error) {
                lerror(`Failed to kick ${member.user.username}: ${error}`);
            } finally {
                // Remove the timeout from the map
                this.timeouts.delete(key);
            }
        }, kickDelay);

        // Store the timeout reference
        this.timeouts.set(key, timeout);

        // Get kick count for logging
        const history = this.kickHistory.get(key);
        const offenseNumber = history && !this.isHistoryExpired(history.lastKicked) ?
            history.kickCount + 1 : 1;

        log(`${guild.name}: Scheduled kick for ${member.user.username} in ${kickDelay/1000} seconds (Potential offense #${offenseNumber})`);
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

    /**
     * For testing/admin purposes: Get a member's kick history
     */
    public getMemberKickHistory(member: GuildMember): { lastKicked: Date, kickCount: number } | null {
        const key = this.getTimeoutKey(member);
        const history = this.kickHistory.get(key);

        if (!history || this.isHistoryExpired(history.lastKicked)) {
            return null;
        }

        return history;
    }

    /**
     * For testing/admin purposes: Reset a member's kick history
     */
    public resetMemberKickHistory(member: GuildMember): void {
        const key = this.getTimeoutKey(member);
        this.kickHistory.delete(key);
        log(`${member.guild.name}: Reset kick history for ${member.user.username}`);
    }
}

// Export a singleton instance
export const timeoutManager = new TimeoutManager();