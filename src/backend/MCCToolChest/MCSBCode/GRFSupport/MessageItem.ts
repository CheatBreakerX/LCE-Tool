export class MessageItem {
	constructor(messageId: string, message: string) {
		this.messageId = messageId;
		this.message = message;
	}

	copy(): MessageItem {
		return new MessageItem(this.messageId, this.message);
	}

	messageId: string;
	message: string;
}