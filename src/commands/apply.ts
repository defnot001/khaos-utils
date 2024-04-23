import {
	type CommandInteraction,
	type InteractionReplyOptions,
	SlashCommandBuilder,
} from 'discord.js';
// import { userHasApplication } from '../models/applications';
import type { Command } from '../modules/commands';

const command: Command = {
	data: new SlashCommandBuilder()
		.setName('apply')
		.setDescription('Start your application process!'),
	async execute(interaction: CommandInteraction) {
		// const hasApp = userHasApplication(interaction.user.id);
		// console.log('hasApp', hasApp);
		const response: InteractionReplyOptions = {
			content: 'Hi there! This command has yet to been implemented',
			ephemeral: true,
		};
		interaction.reply(response);
		// interaction.guild?.channels.cache.get();
	},
};

export default command;
