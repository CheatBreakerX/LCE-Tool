export class Base64Image {
	constructor(raw: Uint8Array) {
		this.data = btoa(String.fromCharCode(...new Uint8Array(raw)));
	}

	getData(): string {
		return this.data;
	}

	private data: string;
}