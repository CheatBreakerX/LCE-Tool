export enum NodeCapabilities {
	None = 0,
	Cut = 1,
	Copy = 2,
	PasteInto = 4,
	Rename = 8,
	Edit = 16,
	Delete = 32,
	CreateTag = 64,
	Search = 128,
	Reorder = 256,
	Refresh = 512
}