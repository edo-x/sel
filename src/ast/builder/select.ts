import { assert } from '~/assert.js';
import { BuildExp, getExpression, getExpressionList } from './expression.js';
import { Builder } from './types.js';
import {
	JoinExpression,
	JoinType,
	Node,
	OrderExpression,
	SelectStatement,
	TableExpression,
} from '../node.js';

export class SelectBuilder implements Builder {
	private _distinct?: boolean;
	private table?: TableExpression;
	private whereExpression?: BuildExp;
	private groupByList?: BuildExp[];
	private havingExpression?: BuildExp;
	private orderByList?: OrderExpression[];
	private liimitExpression?: BuildExp;
	private offsetExpression?: BuildExp;
	private selectList?: BuildExp[];

	get distinct(): SelectBuilder {
		this._distinct = true;
		return this;
	}

	from(table: TableExpression): SelectBuilder {
		this.table = table;
		return this;
	}

	innerJoin(table: TableExpression, condition: BuildExp): SelectBuilder {
		assert(!!this.table, 'Cannot apply join without calling from() first');

		const left = this.table;
		const right = table;
		const conditionExp = getExpression(condition);

		this.table = new JoinExpression(JoinType.Inner, left, right, conditionExp);
		return this;
	}

	join(table: TableExpression, condition: BuildExp): SelectBuilder {
		return this.innerJoin(table, condition);
	}

	leftJoin(table: TableExpression, condition: BuildExp): SelectBuilder {
		assert(!!this.table, 'Cannot apply join without calling from() first');

		const left = this.table;
		const right = table;
		const conditionExp = getExpression(condition);

		this.table = new JoinExpression(JoinType.Left, left, right, conditionExp);
		return this;
	}

	rightJoin(table: TableExpression, condition: BuildExp): SelectBuilder {
		assert(!!this.table, 'Cannot apply join without calling from() first');

		const left = this.table;
		const right = table;
		const conditionExp = getExpression(condition);

		this.table = new JoinExpression(JoinType.Right, left, right, conditionExp);
		return this;
	}

	crossJoin(table: TableExpression): SelectBuilder {
		assert(!!this.table, 'Cannot apply join without calling from() first');

		const left = this.table;
		const right = table;

		this.table = new JoinExpression(JoinType.Cross, left, right, null);
		return this;
	}

	where(condition: BuildExp): SelectBuilder {
		this.whereExpression = condition;
		return this;
	}

	groupBy(...exps: BuildExp[]): SelectBuilder {
		this.groupByList = exps;
		return this;
	}

	having(condition: BuildExp): SelectBuilder {
		this.havingExpression = condition;
		return this;
	}

	orderBy(...orderList: OrderExpression[]): SelectBuilder {
		this.orderByList = orderList;
		return this;
	}

	limit(limit: BuildExp): SelectBuilder {
		this.liimitExpression = limit;
		return this;
	}

	offset(offset: BuildExp): SelectBuilder {
		this.offsetExpression = offset;
		return this;
	}

	select(...exps: BuildExp[]): SelectBuilder {
		this.selectList = exps;
		return this;
	}

	getNode(): Node {
		assert(this.selectList && this.selectList.length > 0, 'select is required for SelectStatement');
		assert(!!this.table, 'table is required for SelectStatement');

		const distinct = this._distinct ?? false;
		const selectList = getExpressionList(this.selectList);
		const whereExp = this.whereExpression ?
			getExpression(this.whereExpression)
			: null;

		const groupByList = this.groupByList ?
			getExpressionList(this.groupByList)
			: null;

		const havingExp = this.havingExpression ?
			getExpression(this.havingExpression)
			: null;

		const orderByList = this.orderByList ?? null;
		const limitExp = this.liimitExpression ?
			getExpression(this.liimitExpression)
			: null;

		const offsetExp = this.offsetExpression ?
			getExpression(this.offsetExpression)
			: null;

		return new SelectStatement(
			distinct,
			selectList,
			this.table,
			whereExp,
			groupByList,
			havingExp,
			orderByList,
			limitExp,
			offsetExp,
		);
	}
}
