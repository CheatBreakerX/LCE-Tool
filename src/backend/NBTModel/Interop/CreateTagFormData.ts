import { TagNode } from "../../Substrate/NBT/TagNode";
import { TagType } from "../../Substrate/NBT/TagType";

export class CreateTagFormData {
	tagType: TagType;
	hasName: boolean;
	restrictedNames: string[] = [];
	tagNode: TagNode;
	tagName: string;
}