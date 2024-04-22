import { login, getClient } from './helpers/discord';

await login();

const client = getClient();

client.on('ready', () => {
    console.log('Hello, I am', client.user?.displayName);
})