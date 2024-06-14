import { INamedTagContainer } from "./INamedTagContainer";
import { IOrderedTagContainer } from "./IOrderedTagContainer";
import { ITagContainer } from "./ITagContainer";

export interface IMetaTagContainer extends ITagContainer {
	isNamedContainer: boolean;
	isOrderedContainer: boolean;
	namedTagContainer: INamedTagContainer;
	orderedTagContainer: IOrderedTagContainer;
}