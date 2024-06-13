import { ICopyable } from "../Core/ICopyable";
import { TagNodeByte } from "./TagNodeByte";
import { TagNodeByteArray } from "./TagNodeByteArray";
import { TagNodeCompound } from "./TagNodeCompound";
import { TagNodeDouble } from "./TagNodeDouble";
import { TagNodeFloat } from "./TagNodeFloat";
import { TagNodeInt } from "./TagNodeInt";
import { TagNodeIntArray } from "./TagNodeIntArray";
import { TagNodeList } from "./TagNodeList";
import { TagNodeLong } from "./TagNodeLong";
import { TagNodeLongArray } from "./TagNodeLongArray";
import { TagNodeNull } from "./TagNodeNull";
import { TagNodeShort } from "./TagNodeShort";
import { TagNodeShortArray } from "./TagNodeShortArray";
import { TagNodeString } from "./TagNodeString";
import { TagType } from "./TagType";

export class TagNode implements ICopyable<TagNode> {
	toTagNull(): TagNodeNull {
		throw new Error("Invalid cast.");
	}

	toTagByte(): TagNodeByte {
		throw new Error("Invalid cast.");
	}
	
	toTagShort(): TagNodeShort {
		throw new Error("Invalid cast.");
	}
	
	toTagInt(): TagNodeInt {
		throw new Error("Invalid cast.");
	}
	
	toTagLong(): TagNodeLong {
		throw new Error("Invalid cast.");
	}
	
	toTagFloat(): TagNodeFloat {
		throw new Error("Invalid cast.");
	}
	
	toTagDouble(): TagNodeDouble {
		throw new Error("Invalid cast.");
	}
	
	toTagByteArray(): TagNodeByteArray {
		throw new Error("Invalid cast.");
	}
	
	toTagString(): TagNodeString {
		throw new Error("Invalid cast.");
	}
	
	toTagList(): TagNodeList {
		throw new Error("Invalid cast.");
	}
	
	toTagCompound(): TagNodeCompound {
		throw new Error("Invalid cast.");
	}
	
	toTagIntArray(): TagNodeIntArray {
		throw new Error("Invalid cast.");
	}
	
	toTagLongArray(): TagNodeLongArray {
		throw new Error("Invalid cast.");
	}
	
	toTagShortArray(): TagNodeShortArray {
		throw new Error("Invalid cast.");
	}

	getTagType(): TagType {
		return TagType.TAG_END;
	}

	isCastableTo(type: TagType): boolean {
		return type == this.getTagType();
	}

	copy(): TagNode {
		return null;
	}
}