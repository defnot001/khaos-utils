import type { ClientEvents } from 'discord.js';

export default class DiscordEvent<K extends keyof ClientEvents> {
	public name: K;
	public execute: (...args: ClientEvents[K]) => Promise<void>;

	public constructor(name: K, execute: (...args: ClientEvents[K]) => Promise<void>) {
		this.name = name;
		this.execute = execute;
	}
}
