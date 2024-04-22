import { getClient, login } from './helpers/discord';
import Commands from './modules/commands';

await login();

const client = getClient();

client.on('ready', async () => {
	console.log('Hello, I am', client.user?.displayName);
	await Commands.getInstance().load();
});
