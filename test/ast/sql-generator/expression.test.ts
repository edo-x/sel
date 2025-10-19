import { assert, test } from 'vitest';
import {
	ArithmeticExpression,
	ArithmeticOperator,
	BetweenExpression,
	CaseExpression,
	ColumnReference,
	ComparisonExpression,
	ComparisonOperator,
	InExpression,
	IsExpression,
	LikeExpression,
	LikeOperator,
	LiteralExpression,
	LogicalExpression,
	LogicalOperator,
	ParenExpression,
	TableReference,
	UnaryExpression,
	UnaryOperator,
	ValueList,
	WhenExpression,
} from '~/ast/node.js';
import { SqlGenerator } from '~/ast/sql-generator.js';

test('generate table reference', () => {
	const table = new TableReference('users', null, null);
	const gen = new SqlGenerator();
	const sql = gen.generate(table);

	assert.equal(sql, '"users"');
});

test('generate table reference with schema', () => {
	const table = new TableReference('users', 'public', null);
	const gen = new SqlGenerator();
	const sql = gen.generate(table);

	assert.equal(sql, '"public"."users"');
});

test('generate column reference', () => {
	const column = new ColumnReference('id', null);
	const gen = new SqlGenerator();
	const sql = gen.generate(column);

	assert.equal(sql, '"id"');
});

test('generate column reference with table', () => {
	const table = new TableReference('users', null, null);
	const column = new ColumnReference('id', table);
	const gen = new SqlGenerator();
	const sql = gen.generate(column);

	assert.equal(sql, '"users"."id"');
});

test('generate NULL literal', () => {
	const lit = new LiteralExpression(null);
	const gen = new SqlGenerator();
	const sql = gen.generate(lit);

	assert.equal(sql, 'NULL');
});

test('generate string literal', () => {
	const lit = new LiteralExpression('hello');
	const gen = new SqlGenerator();
	const sql = gen.generate(lit);

	assert.equal(sql, '\'hello\'');
});

test('generate number literal', () => {
	const lit = new LiteralExpression(42);
	const gen = new SqlGenerator();
	const sql = gen.generate(lit);

	assert.equal(sql, '42');
});

test('generate boolean literal', () => {
	const litTrue = new LiteralExpression(true);
	const litFalse = new LiteralExpression(false);
	const gen = new SqlGenerator();
	const sqlTrue = gen.generate(litTrue);
	const sqlFalse = gen.generate(litFalse);

	assert.equal(sqlTrue, 'TRUE');
	assert.equal(sqlFalse, 'FALSE');
});

test('generate date literal', () => {
	const date = new Date('2024-01-01T00:00:00Z');
	const lit = new LiteralExpression(date);
	const gen = new SqlGenerator();
	const sql = gen.generate(lit);

	assert.equal(sql, `'2024-01-01T00:00:00.000Z'`);
});

test('generate value list', () => {
	const date = new Date('2024-01-01T00:00:00Z');
	const column = new ColumnReference('name', null);
	const list = new ValueList([
		42,
		'hello',
		true,
		false,
		null,
		date,
		column,
	]);

	const gen = new SqlGenerator();
	const sql = gen.generate(list);

	assert.equal(
		sql,
		'(42, \'hello\', TRUE, FALSE, NULL, \'2024-01-01T00:00:00.000Z\', "name")',
	);
});

test('generate paren expression', () => {
	const column = new ColumnReference('name', null);
	const paren = new ParenExpression(column);
	const gen = new SqlGenerator();
	const sql = gen.generate(paren);

	assert.equal(sql, '("name")');
});

test('generate unary negate expression', () => {
	const column = new ColumnReference('name', null);
	const exp = new UnaryExpression(UnaryOperator.Negate, column);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, '-"name"');
});

test('generate unary plus expression', () => {
	const column = new ColumnReference('name', null);
	const exp = new UnaryExpression(UnaryOperator.Positive, column);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, '+"name"');
});

test('generate unary bitwise not expression', () => {
	const column = new ColumnReference('name', null);
	const exp = new UnaryExpression(UnaryOperator.BitwiseNot, column);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, '~"name"');
});

test('generate unary logical not expression', () => {
	const column = new ColumnReference('is_active', null);
	const exp = new UnaryExpression(UnaryOperator.LogicalNot, column);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, 'NOT "is_active"');
});

test('generate equal comparison expression', () => {
	const col1 = new ColumnReference('id', null);
	const col2 = new ColumnReference('user_id', null);
	const exp = new ComparisonExpression(ComparisonOperator.Equal, col1, col2);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, '"id" = "user_id"');
});

test('generate not equal comparison expression', () => {
	const col1 = new ColumnReference('id', null);
	const col2 = new ColumnReference('user_id', null);
	const exp = new ComparisonExpression(
		ComparisonOperator.NotEqual,
		col1,
		col2,
	);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, '"id" <> "user_id"');
});

test('generate less than comparison expression', () => {
	const col1 = new ColumnReference('price', null);
	const lit = new LiteralExpression(100);
	const exp = new ComparisonExpression(
		ComparisonOperator.LessThan,
		col1,
		lit,
	);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, '"price" < 100');
});

test('generate less than or equal comparison expression', () => {
	const col1 = new ColumnReference('price', null);
	const lit = new LiteralExpression(100);
	const exp = new ComparisonExpression(
		ComparisonOperator.LessThanOrEqual,
		col1,
		lit,
	);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, '"price" <= 100');
});

test('generate greater than comparison expression', () => {
	const col1 = new ColumnReference('price', null);
	const lit = new LiteralExpression(100);
	const exp = new ComparisonExpression(
		ComparisonOperator.GreaterThan,
		col1,
		lit,
	);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, '"price" > 100');
});

test('generate greater than or equal comparison expression', () => {
	const col1 = new ColumnReference('price', null);
	const lit = new LiteralExpression(100);
	const exp = new ComparisonExpression(
		ComparisonOperator.GreaterThanOrEqual,
		col1,
		lit,
	);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, '"price" >= 100');
});

test('generate add arithmetic expression', () => {
	const col1 = new ColumnReference('price', null);
	const col2 = new ColumnReference('tax', null);
	const exp = new ArithmeticExpression(
		ArithmeticOperator.Add,
		col1,
		col2,
	);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, '"price" + "tax"');
});

test('generate subtract arithmetic expression', () => {
	const col1 = new ColumnReference('price', null);
	const col2 = new ColumnReference('discount', null);
	const exp = new ArithmeticExpression(
		ArithmeticOperator.Subtract,
		col1,
		col2,
	);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, '"price" - "discount"');
});

test('generate multiply arithmetic expression', () => {
	const col1 = new ColumnReference('price', null);
	const col2 = new ColumnReference('quantity', null);
	const exp = new ArithmeticExpression(
		ArithmeticOperator.Multiply,
		col1,
		col2,
	);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, '"price" * "quantity"');
});

test('generate divide arithmetic expression', () => {
	const col1 = new ColumnReference('total', null);
	const col2 = new ColumnReference('quantity', null);
	const exp = new ArithmeticExpression(
		ArithmeticOperator.Divide,
		col1,
		col2,
	);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, '"total" / "quantity"');
});

test('generate modulo arithmetic expression', () => {
	const col1 = new ColumnReference('value', null);
	const lit = new LiteralExpression(10);
	const exp = new ArithmeticExpression(
		ArithmeticOperator.Modulo,
		col1,
		lit,
	);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, '"value" % 10');
});

test('generate and logical expression', () => {
	const col1 = new ColumnReference('is_active', null);
	const col2 = new ColumnReference('is_verified', null);
	const exp = new LogicalExpression(LogicalOperator.And, col1, col2);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, '"is_active" AND "is_verified"');
});

test('generate or logical expression', () => {
	const col1 = new ColumnReference('is_active', null);
	const col2 = new ColumnReference('is_verified', null);
	const exp = new LogicalExpression(LogicalOperator.Or, col1, col2);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, '"is_active" OR "is_verified"');
});

test('generate like expression', () => {
	const col = new ColumnReference('name', null);
	const pattern = new LiteralExpression('J%');
	const exp = new LikeExpression(
		LikeOperator.Like,
		col,
		pattern,
		null,
		false,
	);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, '"name" LIKE \'J%\'');
});

test('generate not like expression', () => {
	const col = new ColumnReference('name', null);
	const pattern = new LiteralExpression('J%');
	const exp = new LikeExpression(
		LikeOperator.Like,
		col,
		pattern,
		null,
		true,
	);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, '"name" NOT LIKE \'J%\'');
});

test('generate like expression with escape', () => {
	const col = new ColumnReference('name', null);
	const pattern = new LiteralExpression('J!%');
	const escape = new LiteralExpression('!');
	const exp = new LikeExpression(
		LikeOperator.Like,
		col,
		pattern,
		escape,
		false,
	);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, `"name" LIKE 'J!%' ESCAPE '!'`);
});

test('generate not like expression with escape', () => {
	const col = new ColumnReference('name', null);
	const pattern = new LiteralExpression('J!%');
	const escape = new LiteralExpression('!');
	const exp = new LikeExpression(
		LikeOperator.Like,
		col,
		pattern,
		escape,
		true,
	);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, `"name" NOT LIKE 'J!%' ESCAPE '!'`);
});

test('generate ilike expression', () => {
	const col = new ColumnReference('name', null);
	const pattern = new LiteralExpression('j%');
	const exp = new LikeExpression(
		LikeOperator.ILike,
		col,
		pattern,
		null,
		false,
	);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, `"name" ILIKE 'j%'`);
});

test('generate not ilike expression', () => {
	const col = new ColumnReference('name', null);
	const pattern = new LiteralExpression('j%');
	const exp = new LikeExpression(
		LikeOperator.ILike,
		col,
		pattern,
		null,
		true,
	);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, `"name" NOT ILIKE 'j%'`);
});

test('generate ilike expression with escape', () => {
	const col = new ColumnReference('name', null);
	const pattern = new LiteralExpression('j!%');
	const escape = new LiteralExpression('!');
	const exp = new LikeExpression(
		LikeOperator.ILike,
		col,
		pattern,
		escape,
		false,
	);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, `"name" ILIKE 'j!%' ESCAPE '!'`);
});

test('generate not ilike expression with escape', () => {
	const col = new ColumnReference('name', null);
	const pattern = new LiteralExpression('j!%');
	const escape = new LiteralExpression('!');
	const exp = new LikeExpression(
		LikeOperator.ILike,
		col,
		pattern,
		escape,
		true,
	);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, `"name" NOT ILIKE 'j!%' ESCAPE '!'`);
});

test('generate glob expression', () => {
	const col = new ColumnReference('name', null);
	const pattern = new LiteralExpression('J*');
	const exp = new LikeExpression(
		LikeOperator.Glob,
		col,
		pattern,
		null,
		false,
	);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, `"name" GLOB 'J*'`);
});

test('generate not glob expression', () => {
	const col = new ColumnReference('name', null);
	const pattern = new LiteralExpression('J*');
	const exp = new LikeExpression(
		LikeOperator.Glob,
		col,
		pattern,
		null,
		true,
	);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, `"name" NOT GLOB 'J*'`);
});

test('generate match expression', () => {
	const col = new ColumnReference('content', null);
	const pattern = new LiteralExpression('hello');
	const exp = new LikeExpression(
		LikeOperator.Match,
		col,
		pattern,
		null,
		false,
	);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, `"content" MATCH 'hello'`);
});

test('generate not match expression', () => {
	const col = new ColumnReference('content', null);
	const pattern = new LiteralExpression('hello');
	const exp = new LikeExpression(
		LikeOperator.Match,
		col,
		pattern,
		null,
		true,
	);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, `"content" NOT MATCH 'hello'`);
});

test('generate regexp expression', () => {
	const col = new ColumnReference('name', null);
	const pattern = new LiteralExpression('^J');
	const exp = new LikeExpression(
		LikeOperator.Regexp,
		col,
		pattern,
		null,
		false,
	);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, `"name" REGEXP '^J'`);
});

test('generate not regexp expression', () => {
	const col = new ColumnReference('name', null);
	const pattern = new LiteralExpression('^J');
	const exp = new LikeExpression(
		LikeOperator.Regexp,
		col,
		pattern,
		null,
		true,
	);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, `"name" NOT REGEXP '^J'`);
});

test('generate between expression', () => {
	const col = new ColumnReference('price', null);
	const lower = new LiteralExpression(100);
	const upper = new LiteralExpression(500);
	const exp = new BetweenExpression(col, lower, upper, false);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, '"price" BETWEEN 100 AND 500');
});

test('generate not between expression', () => {
	const col = new ColumnReference('price', null);
	const lower = new LiteralExpression(100);
	const upper = new LiteralExpression(500);
	const exp = new BetweenExpression(col, lower, upper, true);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, '"price" NOT BETWEEN 100 AND 500');
});

test('generate in expression', () => {
	const col = new ColumnReference('id', null);
	const list = new ValueList([
		new LiteralExpression(1),
		new LiteralExpression(2),
		new LiteralExpression(3),
	]);
	const exp = new InExpression(col, list, false);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, '"id" IN (1, 2, 3)');
});

test('generate not in expression', () => {
	const col = new ColumnReference('id', null);
	const list = new ValueList([
		new LiteralExpression(1),
		new LiteralExpression(2),
		new LiteralExpression(3),
	]);
	const exp = new InExpression(col, list, true);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, '"id" NOT IN (1, 2, 3)');
});

test('generate is expression', () => {
	const col = new ColumnReference('is_active', null);
	const lit = new LiteralExpression(1);
	const exp = new IsExpression(col, lit, false);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, '"is_active" IS 1');
});

test('generate is not expression', () => {
	const col = new ColumnReference('is_active', null);
	const lit = new LiteralExpression(1);
	const exp = new IsExpression(col, lit, true);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, '"is_active" IS NOT 1');
});

test('generate is null expression', () => {
	const col = new ColumnReference('deleted_at', null);
	const lit = new LiteralExpression(null);
	const exp = new IsExpression(col, lit, false);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, '"deleted_at" IS NULL');
});

test('generate is not null expression', () => {
	const col = new ColumnReference('deleted_at', null);
	const lit = new LiteralExpression(null);
	const exp = new IsExpression(col, lit, true);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, '"deleted_at" IS NOT NULL');
});

test('generate is true expression', () => {
	const col = new ColumnReference('is_active', null);
	const lit = new LiteralExpression(true);
	const exp = new IsExpression(col, lit, false);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, '"is_active" IS TRUE');
});

test('generate is not true expression', () => {
	const col = new ColumnReference('is_active', null);
	const lit = new LiteralExpression(true);
	const exp = new IsExpression(col, lit, true);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, '"is_active" IS NOT TRUE');
});

test('generate is false expression', () => {
	const col = new ColumnReference('is_active', null);
	const lit = new LiteralExpression(false);
	const exp = new IsExpression(col, lit, false);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, '"is_active" IS FALSE');
});

test('generate is not false expression', () => {
	const col = new ColumnReference('is_active', null);
	const lit = new LiteralExpression(false);
	const exp = new IsExpression(col, lit, true);
	const gen = new SqlGenerator();
	const sql = gen.generate(exp);

	assert.equal(sql, '"is_active" IS NOT FALSE');
});

test('generate case expression', () => {
	const col = new ColumnReference('status', null);
	const when1 = new WhenExpression(
		new ComparisonExpression(
			ComparisonOperator.Equal,
			col,
			new LiteralExpression('active'),
		),
		new LiteralExpression(1),
	);
	const when2 = new WhenExpression(
		new ComparisonExpression(
			ComparisonOperator.Equal,
			col,
			new LiteralExpression('inactive'),
		),
		new LiteralExpression(0),
	);
	const elseExp = new LiteralExpression(-1);
	const caseExp = new CaseExpression(
		col,
		[when1, when2],
		elseExp,
	);
	const gen = new SqlGenerator();
	const sql = gen.generate(caseExp);

	assert.equal(sql, `CASE "status" WHEN "status" = 'active' THEN 1 WHEN "status" = 'inactive' THEN 0 ELSE -1 END`);
});

test('generate complex expression', () => {
	const colPrice = new ColumnReference('price', null);
	const colStatus = new ColumnReference('status', null);
	const colExpire = new ColumnReference('is_expired', null);
	const priceExp = new ComparisonExpression(
		ComparisonOperator.GreaterThan,
		colPrice,
		new LiteralExpression(100),
	);
	const statusExp = new ComparisonExpression(
		ComparisonOperator.Equal,
		colStatus,
		new LiteralExpression('active'),
	);
	const andExp = new LogicalExpression(
		LogicalOperator.And,
		priceExp,
		statusExp,
	);
	const orExp = new LogicalExpression(
		LogicalOperator.Or,
		andExp,
		new IsExpression(colExpire, new LiteralExpression(true), false),
	);
	const gen = new SqlGenerator();
	const sql = gen.generate(orExp);

	assert.equal(sql, '"price" > 100 AND "status" = \'active\' OR "is_expired" IS TRUE');
});
