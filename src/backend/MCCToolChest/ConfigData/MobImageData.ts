import { Base64Image } from "../../LCETool/UI/Base64Image";

export class MobImageData {
	constructor(name: string, caption: string, imageId: number) {
		this.name = name;
		this.caption = caption;
		this.imageId = imageId;
	}

	name: string;
	caption: string;
	imageId: number;
	image: Base64Image;
}