import { Client, GatewayIntentBits, type ClientOptions } from 'discord.js';
import { getConfig } from './config';


let client: Client | null = null;
export function getClient(): Client {
    if (client) {
        return client;
    }

    const options: ClientOptions = {
        intents: [
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.MessageContent,
        ],
    }
    
    client = new Client(options);
    
    return client;
}

export async function login() {
    if (!client) {
        getClient();
    }

    const res = await client?.login(getConfig().discordToken);
    console.log('Discord login res:', res);
    return res;
}