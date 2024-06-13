import { TagNode } from "./TagNode";
import { TagType } from "./TagType";

export class TagNodeNull extends TagNode {
	toTagNull(): TagNodeNull {
		return this;
	}

	getTagType(): TagType {
		return TagType.TAG_END;
	}

	copy(): TagNode {
		return new TagNodeNull();
	}
}