import { z } from 'zod';
import { generateErrorMessage } from 'zod-error';

const snowflakeSchema = z.string().min(16).max(24);

const configSchema = z.object({
        discordToken: z.string().min(32).base64(),
        discordServer: snowflakeSchema,
        discordChannel: snowflakeSchema
    })


let config: z.infer<typeof configSchema> | null = null;

export function getConfig() {
    if (config)  {
        return config;
    }

    const conf = {
        discordToken: Bun.env.DISCORD_TOKEN,
        discordServer: Bun.env.DISCORD_SERVER,
        discordChannel: Bun.env.DISCORD_CHANNEL,
    }

    const parsedConfig = configSchema.safeParse(conf);
    if (!parsedConfig.success) {
        const message = generateErrorMessage(parsedConfig.error.issues);
        throw new Error(message);
    }

    config = parsedConfig.data;
    return config;
}