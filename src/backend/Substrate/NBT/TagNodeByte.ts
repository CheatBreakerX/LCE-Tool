import { TagNode } from "./TagNode";
import { TagNodeInt } from "./TagNodeInt";
import { TagNodeLong } from "./TagNodeLong";
import { TagNodeShort } from "./TagNodeShort";
import { TagType } from "./TagType";

export class TagNodeByte extends TagNode {
	constructor(data: number) {
		super();
		this.data = data;
	}

	toTagByte(): TagNodeByte {
		return this;
	}

	toTagShort(): TagNodeShort {
		return new TagNodeShort(this.data);
	}

	toTagInt(): TagNodeInt {
		return new TagNodeInt(this.data);
	}

	toTagLong(): TagNodeLong {
		return new TagNodeLong(this.data);
	}

	getTagType(): TagType {
		return TagType.TAG_BYTE;
	}

	isCastableTo(type: TagType): boolean {
		return type == TagType.TAG_BYTE || type == TagType.TAG_SHORT || type == TagType.TAG_INT || type == TagType.TAG_LONG;
	}

	copy(): TagNode {
		return new TagNodeByte(this.data);
	}

	toString(): string {
		return `${this.data}`;
	}

	data: number;
}