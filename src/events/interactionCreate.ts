import {
	type ChatInputCommandInteraction,
	type Client,
	type Snowflake,
	TextChannel,
} from 'discord.js';
import { display } from '../helpers/format';
import Commands from '../modules/commands';
import DiscordEvent from '../modules/events';

export default new DiscordEvent('interactionCreate', async (interaction) => {
	if (!interaction.isChatInputCommand()) {
		return;
	}

	const { commandName, client } = interaction;

	const channelAddon = await getChannelNameAddon(interaction.channelId, client);
	const guildAddon = getGuildAddon(interaction);

	console.info(`${display(interaction.user)} used /${commandName}${channelAddon}${guildAddon}.`);

	await Commands.getInstance().execute(interaction);
});

async function getChannelNameAddon(channelId: Snowflake, client: Client) {
	const channel = await client.channels.fetch(channelId);
	return channel instanceof TextChannel ? ` in ${display(channel)}` : '';
}

function getGuildAddon(interaction: ChatInputCommandInteraction) {
	return interaction.guild ? ` in ${display(interaction.guild)}` : '';
}
