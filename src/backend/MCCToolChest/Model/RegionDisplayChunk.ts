export class RegionDisplayChunk {
	constructor(dimension?: string, region?: string, chunkIndex?: number, isPresent?: boolean, rx?: number, rz?: number) {
		this.dimension = dimension ?? this.dimension;
		this.region = region ?? this.region;
		this.chunkIndex = chunkIndex ?? this.chunkIndex;
		this.isPresent = isPresent ?? this.isPresent;
		this.rx = rx ?? this.rx;
		this.rz = rz ?? this.rz;
	}

	dimension: string;
	region: string;
	chunkIndex: number;
	isPresent: boolean;
	rx: number;
	rz: number;
}