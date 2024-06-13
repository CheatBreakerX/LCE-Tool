import { TagNode } from "./TagNode";

export interface INbtObject<T> {
	loadTree(tree: TagNode): T;
	loadTreeSafe(tree: TagNode): T;
	buildTree(): TagNode;
	validateTree(tree: TagNode): boolean;
}