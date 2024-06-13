import { TagNode } from "./TagNode";
import { TagType } from "./TagType";

export class TagNodeLong extends TagNode {
	constructor(data: number) {
		super();
		this.data = data;
	}

	toTagLong(): TagNodeLong {
		return this;
	}

	getTagType(): TagType {
		return TagType.TAG_LONG;
	}

	copy(): TagNode {
		return new TagNodeLong(this.data);
	}

	toString(): string {
		return `${this.data}`;
	}

	data: number;
}