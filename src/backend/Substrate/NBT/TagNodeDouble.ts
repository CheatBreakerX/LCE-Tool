import { TagNode } from "./TagNode";
import { TagType } from "./TagType";

export class TagNodeDouble extends TagNode {
	constructor(data: number) {
		super();
		this.data = data;
	}
	
	toTagDouble(): TagNodeDouble {
		return this;
	}

	getTagType(): TagType {
		return TagType.TAG_DOUBLE;
	}

	copy(): TagNode {
		return new TagNodeDouble(this.data);
	}

	toString(): string {
		return `${this.data}`;
	}

	data: number;
}