import { TagNode } from "../../Substrate/NBT/TagNode";
import { ITagContainer } from "./ITagContainer";

export interface INamedTagContainer extends ITagContainer {
	tagNamesInUse: string[];

	getTagName(tag: TagNode): string;
	getTagNode(name: string): TagNode;
	addTag(tag: TagNode, name: string): boolean;
	renameTag(tag: TagNode, name: string): boolean;
	containsTag(name: string): boolean;
	deleteTagByString(name: string): boolean;
}