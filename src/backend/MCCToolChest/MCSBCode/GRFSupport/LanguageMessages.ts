import { MessageItem } from "./MessageItem";

export class LanguageMessages {
	constructor(language: string, messages: MessageItem[]) {
		this.language = language;
		this.messages = messages;
	}

	language: string;
	messages: MessageItem[];
}