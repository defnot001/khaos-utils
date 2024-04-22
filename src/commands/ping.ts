import { type CommandInteraction, SlashCommandBuilder } from 'discord.js';
import type { Command } from '../modules/commands';

const command: Command = {
	data: new SlashCommandBuilder().setName('ping').setDescription('I reply with pong!'),
	async execute(interaction: CommandInteraction) {
		interaction.reply('Pong!');
	},
};

export default command;
