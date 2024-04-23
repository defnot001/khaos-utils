import { Client } from 'discord.js';
import interactionCreate from '../events/interactionCreate';
import ready from '../events/ready';

const EVENTS = [interactionCreate, ready] as const;

export class ExtendedClient extends Client {
	public async setEvents() {
		for (const event of EVENTS) {
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			this.on(event.name, event.execute as any);
		}
	}
}
