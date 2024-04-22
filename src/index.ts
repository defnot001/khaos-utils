import { type BaseInteraction, Events } from 'discord.js';
import { getClient, login } from './helpers/discord';
import Commands from './modules/commands';

await login();

const client = getClient();

client.on(Events.ClientReady, async () => {
	console.log('Hello, I am', client.user?.displayName);
	await Commands.getInstance().load();
});

client.on(Events.InteractionCreate, async (interaction: BaseInteraction) => {
	if (!interaction.isChatInputCommand()) {
		return;
	}

	await Commands.getInstance().execute(interaction);
});
