export class PERegion {
	constructor(dimension: number, x: number, z: number) {
		this.chunks = new Uint8Array(4096);
		this.dimension = dimension;
		this.rx = x;
		this.rz = z;
	}

	toString(): string {
		return `r.${this.rx}.${this.rz}`;
	}

	dimension: number;
	rx: number;
	rz: number;
	chunks: Uint8Array;
}