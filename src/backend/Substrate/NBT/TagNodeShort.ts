import { TagNode } from "./TagNode";
import { TagNodeDouble } from "./TagNodeDouble";
import { TagNodeFloat } from "./TagNodeFloat";
import { TagNodeInt } from "./TagNodeInt";
import { TagNodeLong } from "./TagNodeLong";
import { TagType } from "./TagType";

export class TagNodeShort extends TagNode {
	constructor(data: number) {
		super();
		this.data = data;
	}

	toTagShort(): TagNodeShort {
		return this;
	}

	toTagInt(): TagNodeInt {
		return new TagNodeInt(this.data);
	}

	toTagLong(): TagNodeLong {
		return new TagNodeLong(this.data);
	}

	toTagFloat(): TagNodeFloat {
		return new TagNodeFloat(this.data);
	}

	toTagDouble(): TagNodeDouble {
		return new TagNodeDouble(this.data);
	}

	getTagType(): TagType {
		return TagType.TAG_SHORT;
	}

	isCastableTo(type: TagType): boolean {
		return type == TagType.TAG_SHORT || type == TagType.TAG_INT || type == TagType.TAG_LONG || type == TagType.TAG_FLOAT || type == TagType.TAG_DOUBLE;
	}

	copy(): TagNode {
		return new TagNodeShort(this.data);
	}

	toString(): string {
		return `${this.data}`;
	}

	data: number;
}