import { assert } from '~/assert.js';
import { BuildExp, getExpression, getExpressionList } from './expression.js';
import { Builder } from './types.js';
import { DeleteStatement, Node, TableReference } from '../node.js';

export class DeleteBuilder implements Builder {
	private table?: TableReference;
	private condition?: BuildExp;
	private returnList?: BuildExp[];

	getNode(): Node {
		assert(!!this.table, 'table is required for DeleteStatement');

		const returnList = this.returnList ?
			getExpressionList(this.returnList)
			: null;

		const condition = this.condition ?
			getExpression(this.condition)
			: null;

		return new DeleteStatement(
			this.table,
			condition,
			returnList,
		);
	}

	from(table: TableReference): DeleteBuilder {
		this.table = table;
		return this;
	}

	where(condition: BuildExp): DeleteBuilder {
		this.condition = condition;
		return this;
	}

	returning(...exps: BuildExp[]): DeleteBuilder {
		this.returnList = exps;
		return this;
	}
}
