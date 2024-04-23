import { Guild, GuildMember, TextChannel, User, escapeMarkdown, inlineCode } from 'discord.js';

/**
 * Union type of all displayble objects to be used with {@link display}.
 */
type Displayable = Guild | User | GuildMember | TextChannel;

/**
 * Formats a {@link Displayable} into its name and id in parentheses.
 * This is meant to be used for outside of the Discord application.
 * For displaying messages to the users in the app use {@link fDisplay} instead since it escapes markdown and uses inline code.
 */
export function display(obj: Displayable): string {
	if (obj instanceof Guild) {
		return `${obj.name} (${obj.id})`;
	}

	if (obj instanceof User) {
		return `${obj.globalName ?? obj.username} (${obj.id})`;
	}

	if (obj instanceof GuildMember) {
		return `${obj.user.globalName ?? obj.user.username} (${obj.id})`;
	}

	if (obj instanceof TextChannel) {
		return `#${obj.name} (${obj.id})`;
	}

	return 'Unknown object type.';
}

/**
 * Formats a {@link Displayable} into its name and id in parentheses.
 * This is meant to be used for inside the Discord application to show to users of the app.
 * For formatting messages for loggers and anything else outside the app use {@link display} instead since markdown isn't supported there.
 */
export function fDisplay(obj: Displayable): string {
	if (obj instanceof Guild) {
		return `${escapeMarkdown(obj.name)} (${inlineCode(obj.id)})`;
	}

	if (obj instanceof User) {
		return `${escapeMarkdown(obj.globalName ?? obj.username)} (${inlineCode(obj.id)})`;
	}

	if (obj instanceof GuildMember) {
		return `${escapeMarkdown(obj.user.globalName ?? obj.user.username)} (${inlineCode(obj.id)})`;
	}

	if (obj instanceof TextChannel) {
		return `${escapeMarkdown(obj.name)} (${inlineCode(obj.id)})`;
	}

	return 'Unknown object type.';
}
