import { TagNode } from "./TagNode";
import { TagType } from "./TagType";

export class TagNodeShortArray extends TagNode {
	constructor(data: Int16Array) {
		super();
		this.data = data;
	}

	toTagShortArray(): TagNodeShortArray {
		return this;
	}

	getTagType(): TagType {
		return TagType.TAG_SHORT_ARRAY;
	}

	copy(): TagNode {
		return new TagNodeShortArray(new Int16Array(this.data.buffer));
	}

	toString(): string {
		return `${this.data}`;
	}

	data: Int16Array;
}