export enum GroupCapabilities {
	Single = 0,
	SiblingSameType = 1,
	SiblingMixedType = 3,
	MultiSameType = 5,
	MultiMixedType = 15,
	ElideChildren = 16,
	All = 31
}