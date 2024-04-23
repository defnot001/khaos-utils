import { type CommandInteraction, REST, Routes, type SlashCommandBuilder } from 'discord.js';
import { getConfig } from '../helpers/config';

export interface Command {
	data: SlashCommandBuilder;
	execute: (arg0: CommandInteraction) => Promise<undefined>;
}
import apply from '../commands/apply';
import ping from '../commands/ping';
import { LOGGER } from '../helpers/logger';

export default class Commands {
	private static _instance: Commands | null = null;
	private commands: Map<string, Command> = new Map();

	private constructor() {
		Commands._instance = this;
	}

	static getInstance(): Commands {
		if (Commands._instance) {
			return Commands._instance;
		}

		return new Commands();
	}

	private async registerCommands() {
		const cmds = [];
		for (const cmd of this.commands.values()) {
			cmds.push(cmd.data.toJSON());
		}

		const config = getConfig();
		const rest = new REST().setToken(config.discordToken);
		try {
			const data = await rest.put(
				Routes.applicationGuildCommands(config.discordAppId, config.discordServer),
				{ body: cmds },
			);

			if (!Array.isArray(data)) {
				return;
			}
			LOGGER.info(`Successfully loaded ${data.length} (/) commands`);
		} catch (error) {
			await LOGGER.error(error, 'Error registering commands');
		}
	}

	async load() {
		if (this.commands.size > 0) {
			return;
		}
		// Insert command registrations here
		this.commands.set(ping.data.name, ping);
		this.commands.set(apply.data.name, apply);

		this.registerCommands();
	}

	async execute(interaction: CommandInteraction) {
		const cmd = this.commands.get(interaction.commandName);
		try {
			await cmd?.execute(interaction);
		} catch (error) {
			console.error('Error while running command:', cmd?.data.name, error, new Date());
			interaction.reply('Failed to run command! Please try again later.');
		}
	}
}
