import {
	type CommandInteraction,
	SlashCommandBuilder,
	type InteractionReplyOptions,
} from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('apply')
		.setDescription('Start your application process!'),
	async execute(interaction: CommandInteraction) {
		const response: InteractionReplyOptions = {
			content: 'Hi there! This command has yet to been implemented',
			ephemeral: true,
		};
		interaction.reply(response);
	},
};
