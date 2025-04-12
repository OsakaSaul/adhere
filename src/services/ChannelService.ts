import {
    GuildChannelManager,
    TextChannel,
    ChannelType,
    GuildBasedChannel
} from 'discord.js';

export default class ChannelService {
    private channelManager: GuildChannelManager;

    public constructor(guildChannelManager: GuildChannelManager) {
        this.channelManager = guildChannelManager;
    }

    public findGeneralChannel(): TextChannel | null {
        return this.findChannelByName('general') as TextChannel || null;
    }

    public findChannelByName(name: string, type: ChannelType = ChannelType.GuildText): GuildBasedChannel | null {
        const channel = this.channelManager.cache.find(
            ch => ch.name === name && ch.type === type
        );

        return channel || null;
    }

    public findChannelById(id: string): GuildBasedChannel | null {
        const channel = this.channelManager.cache.get(id);
        return channel || null;
    }

    public findWelcomeChannel(): TextChannel | null {
        const targetChannelIds: string[] = [
            '900283123084951602',
            '1348878108358475829',
        ]
        for (const channelId of targetChannelIds) {
            const channel = this.findChannelById(channelId) as TextChannel;
            if (channel) {
                return channel;
            }
        }
        return null;
    }
}
