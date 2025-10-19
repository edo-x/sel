import { assert } from '~/assert.js';
import { StringBuilder } from '~/string-builder.js';
import {
	AliasExpression,
	ArithmeticExpression,
	BetweenExpression,
	CaseExpression,
	ColumnReference,
	ComparisonExpression,
	DeleteStatement,
	Expression,
	InExpression,
	InsertStatement,
	IsExpression,
	JoinExpression,
	LikeExpression,
	LiteralExpression,
	LiteralValue,
	LogicalExpression,
	Node,
	OrderExpression,
	ParenExpression,
	SelectStatement,
	TableReference,
	UnaryExpression,
	UnaryOperator,
	UpdateStatement,
	ValueList,
	WhenExpression,
} from './node.js';
import { NodeVisitor } from './visitor.js';

export class SqlGenerator extends NodeVisitor {
	private builder: StringBuilder;

	constructor() {
		super();
		this.builder = new StringBuilder();
	}

	generate(node: Node): string {
		this.builder.clear();
		this.visit(node);
		return this.builder.toString();
	}

	quoteIdentifier(identifier: string): string {
		return `"${identifier}"`;
	}

	escapeString(value: string): string {
		// eslint-disable-next-line @stylistic/quotes
		const escaped = value.replace(/'/g, "''");
		return `'${escaped}'`;
	}

	getLiteralValue(value: LiteralValue): string {
		if (value === null) {
			return 'NULL';
		}

		if (value instanceof Date) {
			return this.escapeString(value.toISOString());
		}

		switch (typeof value) {
			case 'string':
				return this.escapeString(value);

			case 'number':
				return value.toString();

			case 'boolean':
				return value ? 'TRUE' : 'FALSE';

			default:
				throw new Error(`Invalid literal value: ${typeof value}`);
		}
	}

	override visitTableReference(node: TableReference): void {
		if (node.schema) {
			this.builder.append(this.quoteIdentifier(node.schema));
			this.builder.append('.');
		}

		this.builder.append(this.quoteIdentifier(node.name));

		if (node.alias) {
			this.builder.append(' AS ');
			this.builder.append(this.quoteIdentifier(node.alias));
		}
	}

	override visitColumnReference(node: ColumnReference): void {
		if (node.table) {
			if (node.table.alias) {
				this.builder.append(this.quoteIdentifier(node.table.alias));
			}
			else {
				this.visitTableReference(node.table);
			}

			this.builder.append('.');
		}

		this.builder.append(this.quoteIdentifier(node.name));
	}

	override visitSelectStatement(node: SelectStatement): void {
		this.builder.append('SELECT ');

		if (node.distinct) {
			this.builder.append('DISTINCT ');
		}

		const len = node.selectList.length;
		const lastIndex = len - 1;

		for (let index = 0; index < len; index += 1) {
			const selectExp = node.selectList[index];
			const last = index === lastIndex;

			assert(
				!!selectExp,
				`Invalid select expression, expression is undefined at index=${index}`,
			);

			this.visit(selectExp);

			if (!last) {
				this.builder.append(', ');
			}
		}

		if (node.tableExpression) {
			this.builder.append(' FROM ');
			this.visitTableExpression(node.tableExpression);
		}

		if (node.whereExpression) {
			this.builder.append(' WHERE ');
			this.visit(node.whereExpression);
		}

		const hasGroupBy = node.groupByList && node.groupByList.length > 0;
		if (hasGroupBy) {
			const groupByList = node.groupByList!;
			const groupByLen = node.groupByList!.length;
			const groupByLastIndex = groupByLen - 1;

			this.builder.append(' GROUP BY ');

			for (let index = 0; index < groupByLen; index += 1) {
				const groupByExp = groupByList[index];
				const last = index === groupByLastIndex;

				assert(
					!!groupByExp,
					`Invalid group by expression, expression is undefined at index=${index}`,
				);

				this.visit(groupByExp);

				if (!last) {
					this.builder.append(', ');
				}
			}
		}

		if (node.havingExpression) {
			this.builder.append(' HAVING ');
			this.visit(node.havingExpression);
		}

		const hasOrderByList = node.orderByList && node.orderByList.length > 0;
		if (hasOrderByList) {
			const orderByList = node.orderByList!;
			const orderByLen = orderByList.length;
			const orderByLastIndex = orderByLen - 1;

			this.builder.append(' ORDER BY ');

			for (let index = 0; index < orderByLen; index += 1) {
				const orderByExp = orderByList[index];
				const last = index === orderByLastIndex;

				assert(
					!!orderByExp,
					`Invalid order by expression, expression is undefined at index=${index}`,
				);

				this.visit(orderByExp);

				if (!last) {
					this.builder.append(', ');
				}
			}
		}

		if (node.limitExpression) {
			this.builder.append(' LIMIT ');
			this.visit(node.limitExpression);
		}

		if (node.offsetExpression) {
			this.builder.append(' OFFSET ');
			this.visit(node.offsetExpression);
		}
	}

	override visitInsertStatement(node: InsertStatement): void {
		this.builder.append('INSERT INTO ');
		this.visitTableReference(node.table);
		this.builder.append(' ');

		if (node.defaultValues) {
			this.builder.append(' DEFAULT VALUES');
			return;
		}

		if (node.columnList) {
			const len = node.columnList.length;
			const lastIndex = len - 1;

			this.builder.append('(');

			for (let index = 0; index < len; index += 1) {
				const column = node.columnList[index];
				const last = index === lastIndex;

				assert(
					column !== undefined,
					`Invalid column, column is undefined at index=${index}`,
				);

				this.builder.append(this.quoteIdentifier(column.name));
				if (!last) {
					this.builder.append(', ');
				}
			}

			this.builder.append(') ');
		}

		if (node.valuesList) {
			this.builder.append('VALUES ');
			const len = node.valuesList.length;
			const lastIndex = len - 1;

			for (let index = 0; index < len; index += 1) {
				const values = node.valuesList[index];
				const last = index === lastIndex;

				assert(
					values !== undefined,
					`Invalid value, value is undefined at index=${index}`,
				);

				this.visitValueList(values);
				if (!last) {
					this.builder.append(', ');
				}
			}
		}

		if (node.returnList) {
			this.visitReturnList(node.returnList);
		}
	}

	override visitUpdateStatement(node: UpdateStatement): void {
		this.builder.append('UPDATE ');
		this.visitTableReference(node.table);
		this.builder.append(' SET ');

		const len = node.assigments.length;
		const lastIndex = len - 1;

		for (let index = 0; index < len; index += 1) {
			const assigment = node.assigments[index];
			const last = index === lastIndex;

			assert(
				assigment !== undefined,
				`Invalid assigment, assigment is undefined at index=${index}`,
			);

			this.visitColumnReference(assigment.column);
			this.builder.append(' = ');
			this.visit(assigment.value);

			if (!last) {
				this.builder.append(', ');
			}
		}

		if (node.condition) {
			this.builder.append(' WHERE ');
			this.visit(node.condition);
		}

		if (node.returnList) {
			this.visitReturnList(node.returnList);
		}
	}

	override visitDeleteStatement(node: DeleteStatement): void {
		this.builder.append('DELETE FROM ');
		this.visitTableReference(node.table);

		if (node.condition) {
			this.builder.append(' WHERE ');
			this.visit(node.condition);
		}

		if (node.returnList) {
			this.visitReturnList(node.returnList);
		}
	}

	override visitLiteralExpression(node: LiteralExpression): void {
		this.builder.append(this.getLiteralValue(node.value));
	}

	override visitValueList(node: ValueList): void {
		this.builder.append('(');
		const len = node.values.length;
		const lastIndex = len - 1;

		for (let index = 0; index < len; index += 1) {
			const value = node.values[index];
			const last = index === lastIndex;

			assert(value !== undefined, `Invalid value, value is undefined at index=${index}`);

			if (value instanceof Expression) {
				this.visit(value);
			}
			else {
				this.builder.append(this.getLiteralValue(value));
			}

			if (!last) {
				this.builder.append(', ');
			}
		}

		this.builder.append(')');
	}

	override visitReturnList(returnList: Expression[]): void {
		this.builder.append(' RETURNING ');
		const len = returnList.length;
		const lastIndex = len - 1;

		for (let index = 0; index < len; index += 1) {
			const exp = returnList[index];
			const last = index === lastIndex;

			assert(!!exp, `Invalid expression, expression is undefined at index=${index}`);

			this.visit(exp);
			if (!last) {
				this.builder.append(', ');
			}
		}
	}

	override visitParenExpression(node: ParenExpression): void {
		this.builder.append('(');
		this.visit(node.body);
		this.builder.append(')');
	}

	override visitUnaryExpression(node: UnaryExpression): void {
		const operator = node.operator.toUpperCase();

		this.builder.append(operator);
		if (node.operator === UnaryOperator.LogicalNot) {
			this.builder.append(' ');
		}

		this.visit(node.operand);
	}

	override visitComparisonExpression(node: ComparisonExpression): void {
		this.visit(node.left);
		this.builder.append(` ${node.operator} `);
		this.visit(node.right);
	}

	override visitArithmeticExpression(node: ArithmeticExpression): void {
		this.visit(node.left);
		this.builder.append(` ${node.operator} `);
		this.visit(node.right);
	}

	override visitLogicalExpression(node: LogicalExpression): void {
		const operator = node.operator.toUpperCase();

		this.visit(node.left);
		this.builder.append(` ${operator} `);
		this.visit(node.right);
	}

	override visitLikeExpression(node: LikeExpression): void {
		const operator = node.operator.toUpperCase();

		this.visit(node.expression);
		this.builder.append(node.negate ? ` NOT ${operator} ` : ` ${operator} `);
		this.visit(node.pattern);

		if (node.escape) {
			this.builder.append(' ESCAPE ');
			this.visit(node.escape);
		}
	}

	override visitBetweenExpression(node: BetweenExpression): void {
		this.visit(node.expression);
		this.builder.append(node.negate ? ' NOT BETWEEN ' : ' BETWEEN ');
		this.visit(node.lower);
		this.builder.append(' AND ');
		this.visit(node.upper);
	}

	override visitInExpression(node: InExpression): void {
		this.visit(node.expression);
		this.builder.append(node.negate ? ' NOT IN ' : ' IN ');

		// TODO implement subquery handling
		this.visit(node.valueList);
	}

	override visitIsExpression(node: IsExpression): void {
		this.visit(node.left);
		this.builder.append(node.negate ? ' IS NOT ' : ' IS ');
		this.visit(node.right);
	}

	override visitCaseExpression(node: CaseExpression): void {
		this.builder.append('CASE ');
		this.visit(node.operand);

		const len = node.whenList.length;

		for (let index = 0; index < len; index += 1) {
			const when = node.whenList[index];
			assert(!!when, `Invalid when expression, expression is undefined at index=${index}`);
			this.builder.append(' ');
			this.visit(when);
		}

		if (node.elseExpression) {
			this.builder.append(' ELSE ');
			this.visit(node.elseExpression);
		}

		this.builder.append(' END');
	}

	override visitWhenExpression(node: WhenExpression): void {
		this.builder.append('WHEN ');
		this.visit(node.condition);
		this.builder.append(' THEN ');
		this.visit(node.result);
	}

	override visitOrderExpression(node: OrderExpression): void {
		this.visit(node.expression);
		this.builder.append(node.direction === 'ASC' ? ' ASC' : ' DESC');
	}

	override visitAliasExpression(node: AliasExpression): void {
		this.visit(node.expression);
		this.builder.append(' AS ');
		this.builder.append(this.quoteIdentifier(node.alias));
	}

	override visitJoinExpression(node: JoinExpression): void {
		this.visit(node.left);
		this.builder.append(' ');
		this.builder.append(node.type.toUpperCase());
		this.builder.append(' JOIN ');
		this.visit(node.right);

		if (node.condition) {
			this.builder.append(' ON ');
			this.visit(node.condition);
		}
	}
}
