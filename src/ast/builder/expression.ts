import { assert } from '~/assert.js';
import {
	Builder,
	falseValue,
	nullValue,
	trueValue,
} from './types.js';
import {
	ArithmeticExpression,
	ArithmeticOperator,
	BetweenExpression,
	CaseExpression,
	ComparisonExpression,
	ComparisonOperator,
	Expression,
	InExpression,
	IsExpression,
	LikeExpression,
	LikeOperator,
	LiteralExpression,
	LiteralValue,
	LogicalExpression,
	LogicalOperator,
	Node,
	ParenExpression,
	UnaryExpression,
	UnaryOperator,
	ValueList,
	ValueOrExpression,
	WhenExpression,
} from '../node.js';

export type BuildExp =
	| LiteralValue
	| Expression
	| ExpressionBuilder
	| LogicalBuilder;

export class ExpressionBuilder implements Builder {
	private exp: BuildExp;
	private negate: boolean;

	constructor(exp: BuildExp, negate?: boolean) {
		this.exp = exp;
		this.negate = negate ?? false;
	}

	getNode(): Node {
		const node = getExpression(this.exp);
		return node;
	}

	get not(): ExpressionBuilder {
		const builder = new ExpressionBuilder(this.exp, true);
		return builder;
	}

	/*
		logical operations
	*/
	and(exp: BuildExp): LogicalBuilder {
		const left = getExpression(this.exp);
		const right = getExpression(exp);
		const node = new LogicalExpression(
			LogicalOperator.And,
			left,
			right,
		);
		const builder = new LogicalBuilder(node);
		return builder;
	}

	or(exp: BuildExp): LogicalBuilder {
		const left = getExpression(this.exp);
		const right = getExpression(exp);
		const node = new LogicalExpression(
			LogicalOperator.Or,
			left,
			right,
		);
		const builder = new LogicalBuilder(node);
		return builder;
	}

	/*
		comparison operations
	*/
	eq(exp: BuildExp): LogicalBuilder {
		const left = getExpression(this.exp);
		const right = getExpression(exp);
		const node = new ComparisonExpression(
			ComparisonOperator.Equal,
			left,
			right,
		);
		const builder = new LogicalBuilder(node);
		return builder;
	}

	ne(exp: BuildExp): LogicalBuilder {
		const left = getExpression(this.exp);
		const right = getExpression(exp);
		const node = new ComparisonExpression(
			ComparisonOperator.NotEqual,
			left,
			right,
		);
		const builder = new LogicalBuilder(node);
		return builder;
	}

	lt(exp: BuildExp): LogicalBuilder {
		const left = getExpression(this.exp);
		const right = getExpression(exp);
		const node = new ComparisonExpression(
			ComparisonOperator.LessThan,
			left,
			right,
		);
		const builder = new LogicalBuilder(node);
		return builder;
	}

	lte(exp: BuildExp): LogicalBuilder {
		const left = getExpression(this.exp);
		const right = getExpression(exp);
		const node = new ComparisonExpression(
			ComparisonOperator.LessThanOrEqual,
			left,
			right,
		);
		const builder = new LogicalBuilder(node);
		return builder;
	}

	gt(exp: BuildExp): LogicalBuilder {
		const left = getExpression(this.exp);
		const right = getExpression(exp);
		const node = new ComparisonExpression(
			ComparisonOperator.GreaterThan,
			left,
			right,
		);
		const builder = new LogicalBuilder(node);
		return builder;
	}

	gte(exp: BuildExp): LogicalBuilder {
		const left = getExpression(this.exp);
		const right = getExpression(exp);
		const node = new ComparisonExpression(
			ComparisonOperator.GreaterThanOrEqual,
			left,
			right,
		);
		const builder = new LogicalBuilder(node);
		return builder;
	}

	/*
		arithemtic operations
	*/
	add(exp: BuildExp): ExpressionBuilder {
		const left = getExpression(this.exp);
		const right = getExpression(exp);
		const node = new ArithmeticExpression(
			ArithmeticOperator.Add,
			left,
			right,
		);
		const builder = new ExpressionBuilder(node);
		return builder;
	}

	plus(value: BuildExp): ExpressionBuilder {
		return this.add(value);
	}

	subtract(exp: BuildExp): ExpressionBuilder {
		const left = getExpression(this.exp);
		const right = getExpression(exp);
		const node = new ArithmeticExpression(
			ArithmeticOperator.Subtract,
			left,
			right,
		);
		const builder = new ExpressionBuilder(node);
		return builder;
	}

	minus(value: BuildExp): ExpressionBuilder {
		return this.subtract(value);
	}

	multiply(exp: BuildExp): ExpressionBuilder {
		const left = getExpression(this.exp);
		const right = getExpression(exp);
		const node = new ArithmeticExpression(
			ArithmeticOperator.Multiply,
			left,
			right,
		);
		const builder = new ExpressionBuilder(node);
		return builder;
	}

	times(value: BuildExp): ExpressionBuilder {
		return this.multiply(value);
	}

	divide(exp: BuildExp): ExpressionBuilder {
		const left = getExpression(this.exp);
		const right = getExpression(exp);
		const node = new ArithmeticExpression(
			ArithmeticOperator.Divide,
			left,
			right,
		);
		const builder = new ExpressionBuilder(node);
		return builder;
	}

	modulo(exp: BuildExp): ExpressionBuilder {
		const left = getExpression(this.exp);
		const right = getExpression(exp);
		const node = new ArithmeticExpression(
			ArithmeticOperator.Modulo,
			left,
			right,
		);
		const builder = new ExpressionBuilder(node);
		return builder;
	}

	mod(val: BuildExp): ExpressionBuilder {
		return this.modulo(val);
	}

	/*
		like operations
	*/
	like(pattern: BuildExp, escape?: BuildExp): LogicalBuilder {
		const exp = getExpression(this.exp);
		const patternExp = getExpression(pattern);
		const escapeExp = escape ? getExpression(escape) : null;
		const node = new LikeExpression(
			LikeOperator.Like,
			exp,
			patternExp,
			escapeExp,
			this.negate,
		);
		const builder = new LogicalBuilder(node);
		return builder;
	}

	ilike(pattern: BuildExp, escape?: BuildExp): LogicalBuilder {
		const exp = getExpression(this.exp);
		const patternExp = getExpression(pattern);
		const escapeExp = escape ? getExpression(escape) : null;
		const node = new LikeExpression(
			LikeOperator.ILike,
			exp,
			patternExp,
			escapeExp,
			this.negate,
		);
		const builder = new LogicalBuilder(node);
		return builder;
	}

	glob(pattern: BuildExp): LogicalBuilder {
		const exp = getExpression(this.exp);
		const patternExp = getExpression(pattern);
		const node = new LikeExpression(
			LikeOperator.Glob,
			exp,
			patternExp,
			null,
			this.negate,
		);
		const builder = new LogicalBuilder(node);
		return builder;
	}

	match(pattern: BuildExp): LogicalBuilder {
		const exp = getExpression(this.exp);
		const patternExp = getExpression(pattern);
		const node = new LikeExpression(
			LikeOperator.Match,
			exp,
			patternExp,
			null,
			this.negate,
		);
		const builder = new LogicalBuilder(node);
		return builder;
	}

	regexp(pattern: BuildExp): LogicalBuilder {
		const exp = getExpression(this.exp);
		const patternExp = getExpression(pattern);
		const node = new LikeExpression(
			LikeOperator.Regexp,
			exp,
			patternExp,
			null,
			this.negate,
		);
		const builder = new LogicalBuilder(node);
		return builder;
	}

	/*
		between operations
	*/
	between(lower: BuildExp, upper: BuildExp): LogicalBuilder {
		const exp = getExpression(this.exp);
		const lowerExp = getExpression(lower);
		const upperExp = getExpression(upper);
		const node = new BetweenExpression(
			exp,
			lowerExp,
			upperExp,
			this.negate,
		);
		return new LogicalBuilder(node);
	}

	/*
		in operations
	*/
	in(...values: ValueOrExpression[]): LogicalBuilder {
		const exp = getExpression(this.exp);
		const valueList = new ValueList(values);
		const node = new InExpression(
			exp,
			valueList,
			this.negate,
		);
		return new LogicalBuilder(node);
	}

	/*
		is operations
	*/
	is(value: BuildExp): LogicalBuilder {
		const exp = getExpression(this.exp);
		const valueExp = getExpression(value);
		const node = new IsExpression(
			exp,
			valueExp,
			this.negate,
		);
		return new LogicalBuilder(node);
	}

	isNot(value: ValueOrExpression): LogicalBuilder {
		const exp = getExpression(this.exp);
		const valueExp = getExpression(value);
		const node = new IsExpression(
			exp,
			valueExp,
			true,
		);
		return new LogicalBuilder(node);
	}

	get isNull(): LogicalBuilder {
		const exp = getExpression(this.exp);
		const node = new IsExpression(
			exp,
			nullValue,
			false,
		);
		return new LogicalBuilder(node);
	}

	get isNotNull(): LogicalBuilder {
		const exp = getExpression(this.exp);
		const node = new IsExpression(
			exp,
			nullValue,
			true,
		);
		return new LogicalBuilder(node);
	}

	get isTrue(): LogicalBuilder {
		const exp = getExpression(this.exp);
		const node = new IsExpression(
			exp,
			trueValue,
			false,
		);
		return new LogicalBuilder(node);
	}

	get isNotTrue(): LogicalBuilder {
		const exp = getExpression(this.exp);
		const node = new IsExpression(
			exp,
			trueValue,
			true,
		);
		return new LogicalBuilder(node);
	}

	get isFalse(): LogicalBuilder {
		const exp = getExpression(this.exp);
		const node = new IsExpression(
			exp,
			falseValue,
			false,
		);
		return new LogicalBuilder(node);
	}

	get isNotFalse(): LogicalBuilder {
		const exp = getExpression(this.exp);
		const node = new IsExpression(
			exp,
			falseValue,
			true,
		);
		return new LogicalBuilder(node);
	}

	/*
		case operations
	*/
	case(): CaseBuilder {
		return new CaseBuilder(this);
	}
}

export class LogicalBuilder implements Builder {
	private exp: BuildExp;

	constructor(exp: BuildExp) {
		this.exp = exp;
	}

	getNode(): Node {
		const node = getExpression(this.exp);
		return node;
	}

	and(exp: BuildExp): LogicalBuilder {
		const left = getExpression(this.exp);
		const right = getExpression(exp);
		const node = new LogicalExpression(
			LogicalOperator.And,
			left,
			right,
		);
		const builder = new LogicalBuilder(node);
		return builder;
	}

	or(exp: BuildExp): LogicalBuilder {
		const left = getExpression(this.exp);
		const right = getExpression(exp);
		const node = new LogicalExpression(
			LogicalOperator.Or,
			left,
			right,
		);
		const builder = new LogicalBuilder(node);
		return builder;
	}
}

export class CaseBuilder implements Builder {
	private operand: BuildExp;
	private whenList?: [BuildExp, BuildExp][];
	private elseExp?: BuildExp;

	constructor(operand: BuildExp) {
		this.operand = operand;
	}

	getNode(): Expression {
		assert(
			this.whenList && this.whenList.length > 0,
			'At least one WHEN expression is required for CASE expression',
		);

		const whenList = new Array<WhenExpression>(this.whenList.length);

		for (let index = 0; index < this.whenList.length; index += 1) {
			const when = this.whenList[index];
			assert(
				when !== undefined,
				`Invalid when expression, when is undefined at index=${index}`,
			);

			const [condition, result] = when;
			whenList[index] = new WhenExpression(
				getExpression(condition),
				getExpression(result),
			);
		}

		const operandExp = getExpression(this.operand);
		const elseExp = this.elseExp ? getExpression(this.elseExp) : null;

		return new CaseExpression(
			operandExp,
			whenList,
			elseExp,
		);
	}

	when(condition: BuildExp, result: BuildExp): CaseBuilder {
		this.whenList ??= [];
		this.whenList.push([condition, result]);
		return this;
	}

	else(value: BuildExp): CaseBuilder {
		this.elseExp = value;
		return this;
	}

	end(): ExpressionBuilder {
		const node = this.getNode();
		return new ExpressionBuilder(node);
	}
}

export function isLiteralValue(value: unknown | null): value is LiteralValue {
	if (value === null) {
		return true;
	}

	if (value instanceof Date) {
		return true;
	}

	const type = typeof value;
	if (type === 'string' || type === 'number' || type === 'boolean') {
		return true;
	}

	return false;
}

export function getExpression(exp: BuildExp): Expression {
	if (exp instanceof Expression) {
		return exp;
	}

	if (exp instanceof ExpressionBuilder) {
		return exp.getNode();
	}

	if (exp instanceof LogicalBuilder) {
		return exp.getNode();
	}

	if (isLiteralValue(exp)) {
		return new LiteralExpression(exp);
	}

	throw new Error(`Invalid exp: ${exp}`);
}

export function getExpressionList(exps: BuildExp[]): Expression[] {
	const list = new Array<Expression>(exps.length);
	const len = exps.length;

	for (let index = 0; index < len; index += 1) {
		const exp = exps[index];
		assert(
			exp !== undefined,
			`Invalid exp, exp is undefined at index=${index}`,
		);

		list[index] = getExpression(exp);
	}

	return list;
}

export function val(value: LiteralValue): ExpressionBuilder {
	return new ExpressionBuilder(value);
}

export function paren(body: BuildExp): ExpressionBuilder {
	const bodyExp = getExpression(body);
	const node = new ParenExpression(bodyExp);
	return new ExpressionBuilder(node);
}

export function neg(exp: BuildExp): ExpressionBuilder {
	const operand = getExpression(exp);
	const node = new UnaryExpression(UnaryOperator.Negate, operand);
	return new ExpressionBuilder(node);
}

export function pos(exp: BuildExp): ExpressionBuilder {
	const operand = getExpression(exp);
	const node = new UnaryExpression(UnaryOperator.Positive, operand);
	return new ExpressionBuilder(node);
}

export function bitwiseNot(exp: BuildExp): ExpressionBuilder {
	const operand = getExpression(exp);
	const node = new UnaryExpression(UnaryOperator.BitwiseNot, operand);
	return new ExpressionBuilder(node);
}

export function not(exp: BuildExp): ExpressionBuilder {
	const operand = getExpression(exp);
	const node = new UnaryExpression(UnaryOperator.LogicalNot, operand);
	return new ExpressionBuilder(node);
}
