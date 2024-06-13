import { TagNode } from "./TagNode";
import { TagType } from "./TagType";

// TODO: implement fully
export class TagNodeCompound extends TagNode {
	constructor(data: string) {
		super();
		this.data = data ?? "";
	}

	toTagCompound(): TagNodeCompound {
		return this;
	}

	getTagType(): TagType {
		return TagType.TAG_COMPOUND;
	}

	copy(): TagNode {
		return new TagNodeCompound(this.data);
	}

	toString(): string {
		return this.data;
	}

	data: string;
}