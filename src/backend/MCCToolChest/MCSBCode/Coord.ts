export class Coord {
	constructor(x: number, y: number, z: number, val: number) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.val = val;
	}

	equals(x: number, y: number, z: number): boolean {
		return this.x == x && this.y == y && this.z == z;
	}

	x: number;
	y: number;
	z: number;
	val: number;
}