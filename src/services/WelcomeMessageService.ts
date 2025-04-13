import { GuildConfig } from "../models/GuildConfig";
import { TextChannel } from "discord.js";
import {NewMemberDocument} from "../models/NewMember";

export class WelcomeMessageService {

    public async send(
        guildConfig: GuildConfig,
        generalChannel: TextChannel,
        newMembers: NewMemberDocument[]
    ): Promise<void> {
        const newMemberIds = this.getMemberIds(newMembers);
        await generalChannel.send(
`Welcome to The Tavern, ${newMemberIds}!

# The Tavern is the social club where 
We are all face-on-cam.
Turn on your  camera every time you join a VC channel you join and you will get auto-unmuted.

_Face on cam_: No filters/masks/"watch-my-work," show us the ceiling or back-of-head cam nonsense.  Also, shirt required, no streaming.

No webcam?  Hit ⁠help-complaints channel for cam work-arounds.

# No calls going?
Start a call, others will join you in minutes!
For all of The Tavern get Silver for access to bigger calls, chess, poker, party games and events:
Up-vote the last 7 (SEVEN) posts from ${guildConfig.redditLink}

Post **in this channel** "votes done." We'll check and Silver you ASAP!

Hope to meet you in our calls soon!
`);
    }

    private getMemberIds(newMembers: NewMemberDocument[]): string {
        return newMembers.map(newMember => `<@${newMember.userId}>`).join(' ');
    }

}