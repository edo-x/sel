export enum NodeKind {
	TableReference,
	ColumnReference,
	SelectStatement,
	InsertStatement,
	UpdateStatement,
	DeleteStatement,
	LiteralExpression,
	ParameterBinding,
	ValueList,
	AssignmentExpression,
	ParenExpression,
	UnaryExpression,
	ComparisonExpression,
	ArithmeticExpression,
	LogicalExpression,
	BetweenExpression,
	InExpression,
	IsExpression,
	LikeExpression,
	FunctionExpression,
	CaseExpression,
	WhenExpression,
	OrderExpression,
	AliasExpression,
	JoinExpression,
}

export enum UnaryOperator {
	Negate = '-',
	Positive = '+',
	BitwiseNot = '~',
	LogicalNot = 'NOT',
}

export enum ComparisonOperator {
	Equal = '=',
	NotEqual = '<>',
	LessThan = '<',
	LessThanOrEqual = '<=',
	GreaterThan = '>',
	GreaterThanOrEqual = '>=',
}

export enum ArithmeticOperator {
	Add = '+',
	Subtract = '-',
	Multiply = '*',
	Divide = '/',
	Modulo = '%',
}

export enum LogicalOperator {
	And = 'AND',
	Or = 'OR',
}

export enum LikeOperator {
	Like = 'LIKE',
	ILike = 'ILIKE',
	Glob = 'GLOB',
	Match = 'MATCH',
	Regexp = 'REGEXP',
}

export enum OrderDirection {
	Asc = 'ASC',
	Desc = 'DESC',
}

export enum JoinType {
	Inner = 'INNER',
	Left = 'LEFT',
	Right = 'RIGHT',
	Full = 'FULL',
	Cross = 'CROSS',
}

export class Node {
	readonly kind: NodeKind;

	constructor(kind: NodeKind) {
		this.kind = kind;
	}
}

export type TableExpression = TableReference | JoinExpression;

export type LiteralValue = string | number | boolean | Date | null;

export class Expression extends Node {
	constructor(kind: NodeKind) {
		super(kind);
	}
}

export type ValueOrExpression = LiteralValue | Expression;

export class ParenExpression extends Expression {
	readonly body: Expression;

	constructor(body: Expression) {
		super(NodeKind.ParenExpression);
		this.body = body;
	}
}

export class ValueList extends Node {
	readonly values: ValueOrExpression[];

	constructor(values: ValueOrExpression[]) {
		super(NodeKind.ValueList);
		this.values = values;
	}
}

export class TableReference extends Node {
	readonly name: string;
	readonly schema: string | null;
	readonly alias: string | null;

	constructor(name: string, schema: string | null, alias: string | null) {
		super(NodeKind.TableReference);
		this.schema = schema;
		this.name = name;
		this.alias = alias;
	}
}

export class ColumnReference extends Expression {
	readonly name: string;
	readonly table: TableReference | null;

	constructor(name: string, table: TableReference | null) {
		super(NodeKind.ColumnReference);
		this.name = name;
		this.table = table;
	}
}

export class LiteralExpression extends Expression {
	readonly value: LiteralValue;

	constructor(value: LiteralValue) {
		super(NodeKind.LiteralExpression);
		this.value = value;
	}
}

export class ParameterBinding extends Expression {
	readonly name: string | null;

	constructor(name: string | null) {
		super(NodeKind.LiteralExpression);
		this.name = name;
	}
}

export class UnaryExpression extends Expression {
	readonly operator: UnaryOperator;
	readonly operand: Expression;

	constructor(operator: UnaryOperator, operand: Expression) {
		super(NodeKind.UnaryExpression);
		this.operator = operator;
		this.operand = operand;
	}
}

export class ComparisonExpression extends Expression {
	readonly operator: ComparisonOperator;
	readonly left: Expression;
	readonly right: Expression;

	constructor(operator: ComparisonOperator, left: Expression, right: Expression) {
		super(NodeKind.ComparisonExpression);
		this.operator = operator;
		this.left = left;
		this.right = right;
	}
}

export class ArithmeticExpression extends Expression {
	readonly operator: ArithmeticOperator;
	readonly left: Expression;
	readonly right: Expression;

	constructor(operator: ArithmeticOperator, left: Expression, right: Expression) {
		super(NodeKind.ArithmeticExpression);
		this.operator = operator;
		this.left = left;
		this.right = right;
	}
}

export class LogicalExpression extends Expression {
	readonly operator: LogicalOperator;
	readonly left: Expression;
	readonly right: Expression;

	constructor(operator: LogicalOperator, left: Expression, right: Expression) {
		super(NodeKind.LogicalExpression);
		this.operator = operator;
		this.left = left;
		this.right = right;
	}
}

export class BetweenExpression extends Expression {
	readonly expression: Expression;
	readonly lower: Expression;
	readonly upper: Expression;
	readonly negate: boolean;

	constructor(
		expression: Expression,
		lower: Expression,
		upper: Expression,
		negate: boolean,
	) {
		super(NodeKind.BetweenExpression);
		this.expression = expression;
		this.lower = lower;
		this.upper = upper;
		this.negate = negate;
	}
}

export class InExpression extends Expression {
	readonly expression: Expression;
	readonly valueList: ValueList;
	readonly negate: boolean;

	constructor(
		expression: Expression,
		valueList: ValueList,
		negate: boolean,
	) {
		super(NodeKind.InExpression);
		this.expression = expression;
		this.valueList = valueList;
		this.negate = negate;
	}
}

export class IsExpression extends Expression {
	readonly left: Expression;
	readonly right: Expression;
	readonly negate: boolean;

	constructor(
		left: Expression,
		right: Expression,
		negate: boolean,
	) {
		super(NodeKind.IsExpression);
		this.left = left;
		this.right = right;
		this.negate = negate;
	}
}

export class LikeExpression extends Expression {
	readonly operator: LikeOperator;
	readonly expression: Expression;
	readonly pattern: Expression;
	readonly escape: Expression | null;
	readonly negate: boolean;

	constructor(
		operator: LikeOperator,
		expression: Expression,
		pattern: Expression,
		escape: Expression | null,
		negate: boolean,
	) {
		super(NodeKind.LikeExpression);

		const invalid = (
			operator !== LikeOperator.Like &&
			operator !== LikeOperator.ILike
		) && escape !== null;

		if (invalid) {
			throw new Error('escape expression is only allowed with LIKE or ILIKE operators');
		}

		this.expression = expression;
		this.pattern = pattern;
		this.escape = escape;
		this.negate = negate;
		this.operator = operator;
	}
}

export class FunctionExpression extends Expression {
	readonly name: string;
	readonly arguments: Expression[];

	constructor(name: string, args: Expression[]) {
		super(NodeKind.FunctionExpression);
		this.name = name;
		this.arguments = args;
	}
}

export class WhenExpression extends Node {
	readonly condition: Expression;
	readonly result: Expression;

	constructor(condition: Expression, result: Expression) {
		super(NodeKind.WhenExpression);
		this.condition = condition;
		this.result = result;
	}
}

export class CaseExpression extends Expression {
	readonly operand: Expression;
	readonly whenList: WhenExpression[];
	readonly elseExpression: Expression | null;

	constructor(
		operand: Expression,
		whenList: WhenExpression[],
		elseExpression: Expression | null,
	) {
		super(NodeKind.CaseExpression);
		this.operand = operand;
		this.whenList = whenList;
		this.elseExpression = elseExpression;
	}
}

export class OrderExpression extends Node {
	readonly expression: Expression;
	readonly direction: OrderDirection;

	constructor(expression: Expression, direction: OrderDirection) {
		super(NodeKind.OrderExpression);
		this.expression = expression;
		this.direction = direction;
	}
}

export class AliasExpression extends Node {
	readonly expression: Expression;
	readonly alias: string;

	constructor(expression: Expression, alias: string) {
		super(NodeKind.AliasExpression);
		this.expression = expression;
		this.alias = alias;
	}
}

export type SelectExpression = Expression | AliasExpression;

export class JoinExpression extends Node {
	readonly type: JoinType;
	readonly left: TableExpression;
	readonly right: TableExpression;
	readonly condition: Expression | null;

	constructor(
		type: JoinType,
		left: TableExpression,
		right: TableExpression,
		condition: Expression | null,
	) {
		super(NodeKind.JoinExpression);

		if (type === JoinType.Cross && condition !== null) {
			throw new Error('Invalid join expression: CROSS JOIN cannot have an explicit condition');
		}

		this.left = left;
		this.right = right;
		this.type = type;
		this.condition = condition;
	}
}

export class SelectStatement extends Node {
	readonly distinct: boolean;
	readonly tableExpression: TableExpression | null;
	readonly whereExpression: Expression | null;
	readonly groupByList: Expression[] | null;
	readonly havingExpression: Expression | null;
	readonly orderByList: OrderExpression[] | null;
	readonly limitExpression: Expression | null;
	readonly offsetExpression: Expression | null;
	readonly selectList: SelectExpression[];

	constructor(
		distinct: boolean,
		selectList: SelectExpression[],
		tableExpression: TableExpression | null,
		whereExpression: Expression | null,
		groupByList: Expression[] | null,
		havingExpression: Expression | null,
		orderByList: OrderExpression[] | null,
		limitExpression: Expression | null,
		offsetExpression: Expression | null,
	) {
		super(NodeKind.SelectStatement);
		this.distinct = distinct;
		this.selectList = selectList;
		this.tableExpression = tableExpression;
		this.whereExpression = whereExpression;
		this.groupByList = groupByList;
		this.havingExpression = havingExpression;
		this.orderByList = orderByList;
		this.limitExpression = limitExpression;
		this.offsetExpression = offsetExpression;
	}
}

export class InsertStatement extends Node {
	table: TableReference;
	columnList: ColumnReference[] | null;
	valuesList: ValueList[] | null;
	returnList: Expression[] | null;
	defaultValues: boolean;

	constructor(
		table: TableReference,
		columnList: ColumnReference[] | null,
		valuesList: ValueList[] | null,
		returnList: Expression[] | null,
		defaultValues: boolean,
	) {
		super(NodeKind.InsertStatement);
		this.table = table;
		this.columnList = columnList;
		this.valuesList = valuesList;
		this.returnList = returnList;
		this.defaultValues = defaultValues;
	}
}

export class AssigmentExpression extends Node {
	readonly column: ColumnReference;
	readonly value: Expression;

	constructor(column: ColumnReference, value: Expression) {
		super(NodeKind.AssignmentExpression);
		this.column = column;
		this.value = value;
	}
}

export class UpdateStatement extends Node {
	readonly table: TableReference;
	readonly assigments: AssigmentExpression[];
	readonly condition: Expression | null;
	readonly returnList: Expression[] | null;

	constructor(
		table: TableReference,
		assigments: AssigmentExpression[],
		condition: Expression | null,
		returnList: Expression[] | null,
	) {
		super(NodeKind.UpdateStatement);
		this.table = table;
		this.assigments = assigments;
		this.condition = condition;
		this.returnList = returnList;
	}
}

export class DeleteStatement extends Node {
	readonly table: TableReference;
	readonly condition: Expression | null;
	readonly returnList: Expression[] | null;

	constructor(
		table: TableReference,
		condition: Expression | null,
		returnList: Expression[] | null,
	) {
		super(NodeKind.DeleteStatement);
		this.table = table;
		this.condition = condition;
		this.returnList = returnList;
	}
}
