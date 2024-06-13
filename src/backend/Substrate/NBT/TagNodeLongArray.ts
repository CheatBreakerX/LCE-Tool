import { TagNode } from "./TagNode";
import { TagType } from "./TagType";

export class TagNodeLongArray extends TagNode {
	constructor(data: BigInt64Array) {
		super();
		this.data = data;
	}

	toTagLongArray(): TagNodeLongArray {
		return this;
	}

	getTagType(): TagType {
		return TagType.TAG_LONG_ARRAY;
	}

	copy(): TagNode {
		return new TagNodeLongArray(new BigInt64Array(this.data.buffer));
	}

	toString(): string {
		return `${this.data}`;
	}

	data: BigInt64Array;
}