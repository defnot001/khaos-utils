import { type ClientOptions, GatewayIntentBits } from 'discord.js';
import { ExtendedClient } from '../modules/extendedClient';
import { getConfig } from './config';

let client: ExtendedClient | null = null;
export function getClient(): ExtendedClient {
	if (client) {
		return client;
	}

	const options: ClientOptions = {
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.GuildModeration,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.DirectMessages,
			GatewayIntentBits.MessageContent,
		],
	};

	client = new ExtendedClient(options);

	return client;
}

export async function login() {
	if (!client) {
		getClient();
	}

	client?.setEvents();

	const res = await client?.login(getConfig().discordToken);
	if (!res) {
		throw new Error('Failed to login to discord!');
	}
	return res;
}
