import { TagNode } from "../../Substrate/NBT/TagNode";
import { ITagContainer } from "./ITagContainer";

export interface IOrderedTagContainer extends ITagContainer {
	getTagIndex(tag: TagNode): number;
	insertTag(tag: TagNode, index: number): boolean;
	appendTag(tag: TagNode): boolean;
}