import { TagNode } from "./TagNode";
import { TagNodeDouble } from "./TagNodeDouble";
import { TagType } from "./TagType";

export class TagNodeFloat extends TagNode {
	constructor(data: number) {
		super();
		this.data = data;
	}
	
	toTagFloat(): TagNodeFloat {
		return this;
	}

	toTagDouble(): TagNodeDouble {
		return new TagNodeDouble(this.data);
	}

	getTagType(): TagType {
		return TagType.TAG_FLOAT;
	}

	isCastableTo(type: TagType): boolean {
		return type == TagType.TAG_FLOAT || type == TagType.TAG_DOUBLE;
	}

	copy(): TagNode {
		return new TagNodeFloat(this.data);
	}

	toString(): string {
		return `${this.data}`;
	}

	data: number;
}