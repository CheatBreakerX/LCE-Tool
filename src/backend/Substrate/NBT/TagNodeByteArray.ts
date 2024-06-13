import { TagNode } from "./TagNode";
import { TagType } from "./TagType";

export class TagNodeByteArray extends TagNode {
	constructor(data: Uint8Array) {
		super();
		this.data = data;
	}

	toTagByteArray(): TagNodeByteArray {
		return this;
	}

	getTagType(): TagType {
		return TagType.TAG_BYTE_ARRAY;
	}

	copy(): TagNode {
		return new TagNodeByteArray(new Uint8Array(this.data.buffer));
	}

	toString(): string {
		return `${this.data}`;
	}

	data: Uint8Array;
}