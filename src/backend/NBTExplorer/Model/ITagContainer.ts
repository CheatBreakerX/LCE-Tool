import { TagNode } from "../../Substrate/NBT/TagNode";

export interface ITagContainer {
	tagCount: number;
	deleteTag(tag: TagNode): boolean;
}