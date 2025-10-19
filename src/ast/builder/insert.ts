import { assert } from '~/assert.js';
import { BuildExp, getExpressionList } from './expression.js';
import {
	ColumnReference,
	InsertStatement,
	TableReference,
	ValueList,
} from '../node.js';

export class InsertBuilder {
	private columnList?: ColumnReference[];
	private table?: TableReference;
	private returnList?: BuildExp[];
	private valuesList?: ValueList[];
	private useDefaultValues?: boolean;

	columns(...columnList: ColumnReference[]): InsertBuilder {
		this.columnList = columnList;
		return this;
	}

	getNode(): InsertStatement {
		assert(!!this.table, 'table is required for InsertStatement');

		const returnList = this.returnList ?
			getExpressionList(this.returnList)
			: null;

		return new InsertStatement(
			this.table,
			this.columnList ?? null,
			this.valuesList ?? null,
			returnList,
			this.useDefaultValues ?? false,
		);
	}

	into(table: TableReference): InsertBuilder {
		this.table = table;
		return this;
	}

	returning(...exps: BuildExp[]): InsertBuilder {
		this.returnList = exps;
		return this;
	}

	values(...values: ValueList[]): InsertBuilder {
		this.valuesList ??= [];
		this.valuesList.push(new ValueList(values));
		return this;
	}

	defaultValues(): InsertBuilder {
		this.useDefaultValues = true;
		return this;
	}
}
