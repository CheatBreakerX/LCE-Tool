import { TagNode } from "./TagNode";
import { TagType } from "./TagType";

export class TagNodeIntArray extends TagNode {
	constructor(data: Int32Array) {
		super();
		this.data = data;
	}

	toTagIntArray(): TagNodeIntArray {
		return this;
	}

	getTagType(): TagType {
		return TagType.TAG_INT_ARRAY;
	}

	copy(): TagNode {
		return new TagNodeIntArray(new Int32Array(this.data.buffer));
	}

	toString(): string {
		return `${this.data}`;
	}

	data: Int32Array;
}