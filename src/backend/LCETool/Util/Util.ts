export class Util {
	static cloneArray<T>(source: T[]): T[] {
		const cloned: T[] = [];
		source.forEach(val => cloned.push(Object.assign({}, val)));
		return cloned;
	}
}