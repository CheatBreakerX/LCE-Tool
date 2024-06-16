export class Item {
	constructor(id?: number, mcName?: string, name?: string, onConsole?: boolean, replaceId?: number) {
		this.id = id ?? this.id;
		this.mcName = mcName ?? this.mcName;
		this.name = name ?? this.name;
		this.onConsole = onConsole ?? this.onConsole;
		this.replaceId = replaceId ?? this.replaceId;
	}

	getIdName(): string {
		return `(${this.id}) ${this.name}`;
	}

	id: number;
	mcName: string = "";
	name: string = "";
	image: string = "";
	onConsole: boolean = true;
	replaceId: number;
}