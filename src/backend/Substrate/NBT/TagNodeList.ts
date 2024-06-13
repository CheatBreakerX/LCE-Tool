import { Util } from "../../LCETool/Util/Util";
import { TagNode } from "./TagNode";
import { TagType } from "./TagType";

export class TagNodeList extends TagNode implements Iterable<TagNode> {
	constructor(type: TagType, items: TagNode[]) {
		super();
		this.type = type;
		this.items = items;
	}

	[Symbol.iterator](): Iterator<TagNode> {
		return this.items[Symbol.iterator]();
	}

	static createEmpty(type: TagType) {
		return new TagNodeList(type, []);
	}

	toTagList(): TagNodeList {
		return this;
	}

	getTagType(): TagType {
		return TagType.TAG_LIST;
	}

	copy(): TagNode {
		return new TagNodeList(this.type, Util.cloneArray(this.items));
	}

	toString(): string {
		return this.items.toString();
	}

	type: TagType;
	items: TagNode[];
}