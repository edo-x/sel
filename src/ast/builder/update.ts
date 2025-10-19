import { assert } from '~/assert.js';
import { BuildExp, getExpression, getExpressionList } from './expression.js';
import { Builder } from './types.js';
import {
	AssigmentExpression,
	ColumnReference,
	Node,
	TableReference,
	UpdateStatement,
} from '../node.js';

export class UpdateBuilder implements Builder {
	private _table?: TableReference;
	private assigmentList?: [ColumnReference, BuildExp][];
	private condition?: BuildExp;
	private returnList?: BuildExp[];

	getNode(): Node {
		assert(!!this._table, 'table is required for UpdateStatement');
		assert(
			this.assigmentList && this.assigmentList.length > 0,
			'Invalid update, at least one assigment is required for UpdateStatement',
		);

		const assigments = new Array<AssigmentExpression>(this.assigmentList.length);

		for (let index = 0; index < this.assigmentList.length; index += 1) {
			const assigment = this.assigmentList[index];
			assert(!!assigment, `Invalid assigment, assigment is undefined at index=${index}`);

			const [column, value] = assigment;
			const valueExp = getExpression(value);
			assigments[index] = new AssigmentExpression(column, valueExp);
		}

		const returnList = this.returnList ?
			getExpressionList(this.returnList)
			: null;

		const condition = this.condition ?
			getExpression(this.condition)
			: null;

		return new UpdateStatement(
			this._table,
			assigments,
			condition,
			returnList,
		);
	}

	table(table: TableReference): UpdateBuilder {
		this._table = table;
		return this;
	}

	set(column: ColumnReference, value: BuildExp): UpdateBuilder {
		this.assigmentList ??= [];
		this.assigmentList.push([column, value]);
		return this;
	}

	where(condition: BuildExp): UpdateBuilder {
		this.condition = condition;
		return this;
	}

	returning(...exps: BuildExp[]): UpdateBuilder {
		this.returnList = exps;
		return this;
	}
}
