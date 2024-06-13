import { TagNode } from "./TagNode";
import { TagNodeLong } from "./TagNodeLong";
import { TagType } from "./TagType";

export class TagNodeInt extends TagNode {
	constructor(data: number) {
		super();
		this.data = data;
	}

	toTagInt(): TagNodeInt {
		return this;
	}

	toTagLong(): TagNodeLong {
		return new TagNodeLong(this.data);
	}

	getTagType(): TagType {
		return TagType.TAG_INT;
	}

	isCastableTo(type: TagType): boolean {
		return type == TagType.TAG_INT || type == TagType.TAG_LONG;
	}

	copy(): TagNode {
		return new TagNodeInt(this.data);
	}

	toString(): string {
		return `${this.data}`;
	}

	data: number;
}