import { LiteralExpression, Node } from '../node.js';

export interface Builder {
	getNode(): Node;
}

export const nullValue = new LiteralExpression(null);
export const trueValue = new LiteralExpression(true);
export const falseValue = new LiteralExpression(false);
