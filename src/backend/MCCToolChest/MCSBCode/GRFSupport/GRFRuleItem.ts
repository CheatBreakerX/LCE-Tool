export class GRFRuleItem {
	constructor(id: number, value: string) {
		this.id = id;
		this.value = value;
	}

	copy(): GRFRuleItem {
		var copied: GRFRuleItem = new GRFRuleItem(this.id, this.value);
		if (this.rules != null && this.rules.length > 0) {
			for (var x = 0; x < this.rules.length; x++) {
				copied.rules.push(this.rules[x].copy());
			}
		}
		return copied;
	}

	id: number;
	value: string;
	rules: GRFRuleItem[] = [];
}