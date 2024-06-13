export class Orientation {
	constructor() {
		this.pitch = 0.0;
		this.yaw = 0.0;
	}

	static create(pitch: number, yaw: number) {
		const instance: Orientation = new Orientation();
		instance.pitch = pitch;
		instance.yaw = yaw;
		return instance;
	}

	pitch: number;
	yaw: number;
}