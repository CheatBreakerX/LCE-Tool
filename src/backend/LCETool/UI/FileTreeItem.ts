import type { FileTreeItemType } from "./FileTreeItemType";

export interface FileTreeItem {
	type: FileTreeItemType;
	label: string;
	content: string | FileTreeItem[];
	selected?: boolean;
}