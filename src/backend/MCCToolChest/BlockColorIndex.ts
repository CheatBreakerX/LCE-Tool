import { ColorGroup } from "../Substrate/Data/ColorGroup";

export class BlockColorIndex {
	constructor() {
		this.indexes = {};
		this.setColorIndex(0, ColorGroup.Other);
	}

	getColorIndex(index: number): ColorGroup {
		if (this.indexes.hasOwnProperty(`${index}`)) {
			return this.indexes[`${index}`];
		} else {
			return this.indexes["0"];
		}
	}

	setColorIndex(index: number, group: ColorGroup): void {
		this.indexes[`${index}`] = group;
	}

	private indexes: object;
}