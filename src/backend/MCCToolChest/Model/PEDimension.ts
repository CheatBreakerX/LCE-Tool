export class PEDimension {
	constructor(dimension?: number) {
		this.dimension = dimension ?? 0;
	}

	dimension: number;
	region: object = {};
}