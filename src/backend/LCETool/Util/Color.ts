export class Color {
	constructor(red: number, green: number, blue: number, alpha: number) {
		this.red = red;
		this.green = green;
		this.blue = blue;
		this.alpha = alpha;
	}

	getRed(): number {
		return this.red;
	}

	getGreen(): number {
		return this.green;
	}

	getBlue(): number {
		return this.blue;
	}

	getAlpha(): number {
		return this.alpha;
	}

	getRGB(): number {
		return (this.alpha << 24) + (this.red << 16) + (this.green << 8) + this.blue;
	}

	private red: number;
	private green: number;
	private blue: number;
	private alpha: number;
}