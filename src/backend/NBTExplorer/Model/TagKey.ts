import { TagType } from "../../Substrate/NBT/TagType";

export class TagKey {
	constructor(name: string, type: TagType) {
		this.name = name;
		this.tagType = type;
	}

	compare(x: TagKey, y: TagKey): number {
		const num: number = x.tagType.valueOf() - y.tagType.valueOf();
		if (num != 0) {
			return num;
		}

		return `${TagType[x.tagType]}`.localeCompare(`${TagType[y.tagType]}`);
	}

	compareTo(other: TagKey) {
		return this.compare(this, other);
	}

	name: string;
	tagType: TagType;
}