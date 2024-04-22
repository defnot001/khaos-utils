import { type CommandInteraction, SlashCommandBuilder } from 'discord.js';

export default {
	data: new SlashCommandBuilder().setName('ping').setDescription('I reply with pong!'),
	async execute(interaction: CommandInteraction) {
		interaction.reply('Pong!');
	},
};
