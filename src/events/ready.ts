import { ActivityType, TextChannel } from 'discord.js';
import { getConfig } from '../helpers/config';
import { display } from '../helpers/format';
import { LOGGER } from '../helpers/logger';
import DiscordEvent from '../modules/events';

export default new DiscordEvent('ready', async (client) => {
	client.user.setActivity('Commands', { type: ActivityType.Listening });
	LOGGER.info(`Bot is ready! Logged in as ${display(client.user)}.`);

	const errorLogChannel = await client.channels.fetch(getConfig().discordBotErrorLogChannel);

	if (
		!errorLogChannel ||
		!errorLogChannel.isTextBased() ||
		!(errorLogChannel instanceof TextChannel)
	) {
		throw new Error('Error log channel not found.');
	}

	LOGGER.setLogChannel(errorLogChannel);
	LOGGER.info(
		`Set error log channel to ${display(errorLogChannel)} in ${display(errorLogChannel.guild)}.`,
	);
});
