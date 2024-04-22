import {
	type CommandInteraction,
	SlashCommandBuilder,
	type InteractionReplyOptions,
} from 'discord.js';
import { userHasApplication } from '../models/applications';

export default {
	data: new SlashCommandBuilder()
		.setName('apply')
		.setDescription('Start your application process!'),
	async execute(interaction: CommandInteraction) {
		const hasApp = userHasApplication(interaction.user.id);
		console.log('hasApp', hasApp);
		const response: InteractionReplyOptions = {
			content: 'Hi there! This command has yet to been implemented',
			ephemeral: true,
		};
		interaction.reply(response);
		// interaction.guild?.channels.cache.get();
	},
};
