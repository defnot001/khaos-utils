import Bun from 'bun';
import { z } from 'zod';
import { generateErrorMessage } from 'zod-error';

const dbSchema = z.string().min(1).max(64);

let dbConfig: z.infer<typeof dbSchema> | null = null;
export function getDbConfig() {
	if (dbConfig) {
		return dbConfig;
	}

	const conf = process.env.DATABASE_URL;
	const parsed = dbSchema.safeParse(conf);
	if (!parsed.success) {
		const message = generateErrorMessage(parsed.error.issues);
		throw new Error(message);
	}

	dbConfig = parsed.data;
	return dbConfig;
}

const snowflakeSchema = z.string().min(16).max(24);

const configSchema = z.object({
	discordToken: z.string().min(32),
	discordAppId: snowflakeSchema,
	discordServer: snowflakeSchema,
	discordChannel: snowflakeSchema,
});

let config: z.infer<typeof configSchema> | null = null;
export function getConfig() {
	if (config) {
		return config;
	}

	const conf = {
		discordToken: Bun.env.DISCORD_TOKEN,
		discordAppId: Bun.env.DISCORD_APP_ID,
		discordServer: Bun.env.DISCORD_SERVER,
		discordChannel: Bun.env.DISCORD_CHANNEL,
	};

	const parsed = configSchema.safeParse(conf);
	if (!parsed.success) {
		const message = generateErrorMessage(parsed.error.issues);
		throw new Error(message);
	}
	config = parsed.data;
	return config;
}

const appConfigSchema = z.object({
	applicationUrl: z.string().url().optional(),
	applicationPollChannel: snowflakeSchema.optional(),
});

let appConfig: z.infer<typeof appConfigSchema> | null = null;
export function getApplicationConfig() {
	if (appConfig) {
		return appConfig;
	}

	const conf = {
		applicationUrl: Bun.env.APPLICATION_REGISTRATION_URL,
		applicationPollChannel: Bun.env.APPLICATION_POLL_CHANNEL,
	};

	const parsed = appConfigSchema.safeParse(conf);
	if (!parsed.success) {
		const message = generateErrorMessage(parsed.error.issues);
		throw new Error(message);
	}
	appConfig = parsed.data;
	return appConfig;
}
