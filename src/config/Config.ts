import dotenv from 'dotenv';

dotenv.config();


export class Config {
    static readonly DISCORD_BOT_TOKEN: string = this.getEnv('DISCORD_BOT_TOKEN');
    static readonly DISCORD_APP_ID: string = this.getEnv('DISCORD_APP_ID');

    // MongoDB Configuration
    static readonly MONGO_URI: string = this.getEnv('MONGO_URI');
    static readonly MONGO_USERNAME: string = this.getEnv('MONGO_USERNAME');
    static readonly MONGO_PASSWORD: string = this.getEnv('MONGO_PASSWORD');
    static readonly MONGO_DATABASE: string = this.getEnv('MONGO_DATABASE');

    /**
     * Get environment variable or throw an error if it's not defined
     * @param key Environment variable key
     * @returns Environment variable value
     */
    private static getEnv(key: string): string {
        const value = process.env[key];
        if (!value) {
            throw new Error(`Environment variable ${key} is not defined`);
        }
        return value;
    }
}