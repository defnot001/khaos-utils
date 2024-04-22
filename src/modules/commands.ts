import fs from 'node:fs';
import { REST, Routes, type CommandInteraction, type SlashCommandBuilder } from 'discord.js';
import { z } from 'zod';
import { getConfig } from '../helpers/config';

interface Command {
	data: SlashCommandBuilder;
	execute: (arg0: CommandInteraction) => Promise<undefined>;
}

const commandSchema = z.object({
	data: z.custom<SlashCommandBuilder>(),
	execute: z.function().args(z.custom<CommandInteraction>()),
});

export default class Commands {
	private static _instance: Commands | null = null;
	private commands: Map<string, Command> = new Map();

	// TODO: unfuck this command schema

	private constructor() {
		Commands._instance = this;
	}

	static getInstance(): Commands {
		if (Commands._instance) {
			return Commands._instance;
		}

		return new Commands();
	}

	private isCommand(command: unknown) {
		const parsed = commandSchema.safeParse(command);
		return parsed.success;
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
			console.log('Successfully loaded', data.length, '(/) commands');
		} catch (error) {
			console.error('Error while registering commands:', error, new Date());
		}
	}

	async load() {
		if (this.commands.size > 0) {
			return;
		}

		const commandsDir = './src/commands/';
		const files = fs.readdirSync(commandsDir, { withFileTypes: false });
		const commands = files.map(async (f) => {
			const module = await import(`../commands/${f}`);
			// Ignore any non slash command builder commands
			if (!this.isCommand(module.default)) {
				return null;
			}
			// TODO: unfuck this cast
			this.commands.set(module.default.data.name, module.default);
			return module.default as Command;
		});

		await Promise.all(commands);
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
