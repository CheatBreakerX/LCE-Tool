import { TagNode } from "./TagNode";
import { TagType } from "./TagType";

export class TagNodeString extends TagNode {
	constructor(data: string) {
		super();
		this.data = data ?? "";
	}

	toTagString(): TagNodeString {
		return this;
	}

	getTagType(): TagType {
		return TagType.TAG_STRING;
	}

	copy(): TagNode {
		return new TagNodeString(this.data);
	}

	toString(): string {
		return this.data;
	}

	data: string;
}