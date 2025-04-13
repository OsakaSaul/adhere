import { GuildMember, Guild } from "discord.js";
import { NewMember, NewMemberDocument } from "../models/NewMember";
import log from "../utils/logger";
import mongoClient from "../connections/mongoDb";
import { Config } from "../config/Config";


export class NewMemberService {
    private database = mongoClient.db(Config.MONGO_DATABASE);
    private newMembers = this.database.collection<NewMemberDocument>("NewMemberDocument");

    async addNewMember(member: GuildMember): Promise<void> {
        try {
            log(`[${member.guild.name}] Adding new member ${member.user.username} (${member.user.id}) to MongoDB`);
            const newMember: NewMember = {
                guildId: member.guild.id,
                userId: member.user.id,
                username: member.user.username,
                joinedAt: new Date()
            };

            await this.newMembers.insertOne(newMember as NewMemberDocument);
            log(`[${member.guild.name}] Added new member ${member.user.username} (${member.user.id}) to MongoDB`);
        } catch (error) {
            log(`[${member.guild.name}] ERROR adding new member to MongoDB: ${error}`);
            throw error;
        }
    }


    async getNewMembersCount(guild: Guild): Promise<number> {
        try {
            const count = await this.newMembers.countDocuments({ guildId: guild.id });
            log(`[${guild.name}] Retrieved pending members count: ${count} from MongoDB`);
            return count;
        } catch (error) {
            log(`Error getting pending members count for guild ${guild.name}: ${error}`);
            throw error;
        }
    }


    async getNewMembers(guild: Guild): Promise<NewMemberDocument[]> {
        try {
            const members = await this.newMembers.find({ guildId: guild.id }).toArray();
            log(`[${guild.name}] Retrieved ${members.length} pending members for guild from MongoDB`);
            return members;
        } catch (error) {
            log(`Error getting pending members for guild ${guild.name}: ${error}`);
            throw error;
        }
    }


    async clearNewMembers(guild: Guild): Promise<void> {
        try {
            const result = await this.newMembers.deleteMany({ guildId: guild.id });
            log(`[${guild.name}] Cleared ${result.deletedCount} pending members from MongoDB`);
        } catch (error) {
            log(`[${guild.name}] Error clearing pending members: ${error}`);
            throw error;
        }
    }
}