import fs from 'node:fs';
import type { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { z } from 'zod';

interface Command {
	data: SlashCommandBuilder;
	execute: (arg0: CommandInteraction) => undefined;
}

export default class Commands {
	private static _instance: Commands | null = null;
	private _commands: Command[] = [];

	// TODO: unfuck this command schema
	private commandSchema = z.object({
		data: z.custom<SlashCommandBuilder>(),
		execute: z.function().args(z.custom<CommandInteraction>()),
	});

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
		const parsed = this.commandSchema.safeParse(command);
		return parsed.success;
	}

	async load() {
		if (this._commands.length > 0) {
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
			return module.default as Command;
		});

		const res = await Promise.all(commands);
		this._commands = res.filter((cmd) => cmd !== null);

		console.log('Found', this._commands.length, 'commands');
	}
}
