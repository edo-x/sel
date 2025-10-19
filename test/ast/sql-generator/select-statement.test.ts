import { assert, test } from 'vitest';
import {
	AliasExpression,
	ColumnReference,
	ComparisonExpression,
	ComparisonOperator,
	JoinExpression,
	JoinType,
	LiteralExpression,
	OrderDirection,
	OrderExpression,
	SelectStatement,
	TableReference,
} from '~/ast/node.js';
import { SqlGenerator } from '~/ast/sql-generator.js';

test('generate select statement', () => {
	const generator = new SqlGenerator();
	const table = new TableReference('users', null, null);
	const selectList = [
		new ColumnReference('id', null),
		new ColumnReference('name', null),
	];

	const statement = new SelectStatement(
		false,
		selectList,
		table,
		null,
		null,
		null,
		null,
		null,
		null,
	);
	const sql = generator.generate(statement);

	assert.equal(sql, 'SELECT "id", "name" FROM "users"');
});

test('generate select statement with distinct', () => {
	const generator = new SqlGenerator();
	const table = new TableReference('users', null, null);
	const selectList = [
		new ColumnReference('id', null),
		new ColumnReference('name', null),
	];

	const statement = new SelectStatement(
		true,
		selectList,
		table,
		null,
		null,
		null,
		null,
		null,
		null,
	);
	const sql = generator.generate(statement);

	assert.equal(sql, 'SELECT DISTINCT "id", "name" FROM "users"');
});

test('generate select statement with column alias', () => {
	const generator = new SqlGenerator();
	const table = new TableReference('users', null, null);
	const colId = new ColumnReference('id', null);
	const colName = new ColumnReference('name', null);
	const selectList = [
		new AliasExpression(colId, 'userid'),
		new AliasExpression(colName, 'username'),
	];

	const statement = new SelectStatement(
		false,
		selectList,
		table,
		null,
		null,
		null,
		null,
		null,
		null,
	);
	const sql = generator.generate(statement);

	assert.equal(
		sql,
		'SELECT "id" AS "userid", "name" AS "username" FROM "users"',
	);
});

test('generate select statement with table alias', () => {
	const generator = new SqlGenerator();
	const table = new TableReference('users', null, 'u');
	const selectList = [
		new ColumnReference('id', table),
		new ColumnReference('name', table),
	];

	const statement = new SelectStatement(
		false,
		selectList,
		table,
		null,
		null,
		null,
		null,
		null,
		null,
	);
	const sql = generator.generate(statement);

	assert.equal(sql, 'SELECT "u"."id", "u"."name" FROM "users" AS "u"');
});

test('generate select statement with where condition', () => {
	const generator = new SqlGenerator();
	const table = new TableReference('users', null, null);
	const selectList = [
		new ColumnReference('id', null),
		new ColumnReference('name', null),
	];

	const condition = new ComparisonExpression(
		ComparisonOperator.Equal,
		new ColumnReference('active', null),
		new LiteralExpression(1),
	);

	const statement = new SelectStatement(
		false,
		selectList,
		table,
		condition,
		null,
		null,
		null,
		null,
		null,
	);
	const sql = generator.generate(statement);

	assert.equal(sql, 'SELECT "id", "name" FROM "users" WHERE "active" = 1');
});

test('generate select statement with inner join', () => {
	const generator = new SqlGenerator();
	const users = new TableReference('users', null, null);
	const orders = new TableReference('orders', null, null);
	const selectList = [
		new ColumnReference('id', users),
		new ColumnReference('name', users),
		new ColumnReference('order_date', orders),
	];
	const joinCondition = new ComparisonExpression(
		ComparisonOperator.Equal,
		new ColumnReference('id', users),
		new ColumnReference('user_id', orders),
	);
	const join = new JoinExpression(
		JoinType.Inner,
		users,
		orders,
		joinCondition,
	);
	const statement = new SelectStatement(
		false,
		selectList,
		join,
		null,
		null,
		null,
		null,
		null,
		null,
	);
	const sql = generator.generate(statement);

	assert.equal(
		sql,
		[
			'SELECT "users"."id", "users"."name", "orders"."order_date" ',
			'FROM "users" INNER JOIN "orders" ON "users"."id" = "orders"."user_id"',
		].join(''),
	);
});

test('generate select statement with left join', () => {
	const generator = new SqlGenerator();
	const users = new TableReference('users', null, null);
	const orders = new TableReference('orders', null, null);
	const selectList = [
		new ColumnReference('id', users),
		new ColumnReference('name', users),
		new ColumnReference('order_date', orders),
	];
	const joinCondition = new ComparisonExpression(
		ComparisonOperator.Equal,
		new ColumnReference('id', users),
		new ColumnReference('user_id', orders),
	);
	const join = new JoinExpression(
		JoinType.Left,
		users,
		orders,
		joinCondition,
	);
	const statement = new SelectStatement(
		false,
		selectList,
		join,
		null,
		null,
		null,
		null,
		null,
		null,
	);
	const sql = generator.generate(statement);

	assert.equal(
		sql,
		[
			'SELECT "users"."id", "users"."name", "orders"."order_date" ',
			'FROM "users" LEFT JOIN "orders" ON "users"."id" = "orders"."user_id"',
		].join(''),
	);
});

test('generate select statement with right join', () => {
	const generator = new SqlGenerator();
	const users = new TableReference('users', null, null);
	const orders = new TableReference('orders', null, null);
	const selectList = [
		new ColumnReference('id', users),
		new ColumnReference('name', users),
		new ColumnReference('order_date', orders),
	];
	const joinCondition = new ComparisonExpression(
		ComparisonOperator.Equal,
		new ColumnReference('id', users),
		new ColumnReference('user_id', orders),
	);
	const join = new JoinExpression(
		JoinType.Right,
		users,
		orders,
		joinCondition,
	);
	const statement = new SelectStatement(
		false,
		selectList,
		join,
		null,
		null,
		null,
		null,
		null,
		null,
	);
	const sql = generator.generate(statement);

	assert.equal(
		sql,
		[
			'SELECT "users"."id", "users"."name", "orders"."order_date" ',
			'FROM "users" RIGHT JOIN "orders" ON "users"."id" = "orders"."user_id"',
		].join(''),
	);
});

test('generate select statement with full join', () => {
	const generator = new SqlGenerator();
	const users = new TableReference('users', null, null);
	const orders = new TableReference('orders', null, null);
	const selectList = [
		new ColumnReference('id', users),
		new ColumnReference('name', users),
		new ColumnReference('order_date', orders),
	];
	const joinCondition = new ComparisonExpression(
		ComparisonOperator.Equal,
		new ColumnReference('id', users),
		new ColumnReference('user_id', orders),
	);
	const join = new JoinExpression(
		JoinType.Full,
		users,
		orders,
		joinCondition,
	);
	const statement = new SelectStatement(
		false,
		selectList,
		join,
		null,
		null,
		null,
		null,
		null,
		null,
	);
	const sql = generator.generate(statement);

	assert.equal(
		sql,
		[
			'SELECT "users"."id", "users"."name", "orders"."order_date" ',
			'FROM "users" FULL JOIN "orders" ON "users"."id" = "orders"."user_id"',
		].join(''),
	);
});

test('generate select statement with cross join', () => {
	const generator = new SqlGenerator();
	const users = new TableReference('users', null, null);
	const orders = new TableReference('orders', null, null);
	const selectList = [
		new ColumnReference('id', users),
		new ColumnReference('name', users),
		new ColumnReference('order_date', orders),
	];
	const join = new JoinExpression(
		JoinType.Cross,
		users,
		orders,
		null,
	);
	const statement = new SelectStatement(
		false,
		selectList,
		join,
		null,
		null,
		null,
		null,
		null,
		null,
	);
	const sql = generator.generate(statement);

	assert.equal(
		sql,
		[
			'SELECT "users"."id", "users"."name", "orders"."order_date" ',
			'FROM "users" CROSS JOIN "orders"',
		].join(''),
	);
});

test('generate select statement with multiple joins', () => {
	const generator = new SqlGenerator();
	const users = new TableReference('users', null, null);
	const orders = new TableReference('orders', null, null);
	const products = new TableReference('products', null, null);
	const selectList = [
		new ColumnReference('id', users),
		new ColumnReference('name', users),
		new ColumnReference('order_date', orders),
		new ColumnReference('product_name', products),
	];
	const userIdCondition = new ComparisonExpression(
		ComparisonOperator.Equal,
		new ColumnReference('id', users),
		new ColumnReference('user_id', orders),
	);
	const usersJoin = new JoinExpression(
		JoinType.Inner,
		users,
		orders,
		userIdCondition,
	);
	const productIdCondition = new ComparisonExpression(
		ComparisonOperator.Equal,
		new ColumnReference('product_id', orders),
		new ColumnReference('id', products),
	);
	const productJoin = new JoinExpression(
		JoinType.Inner,
		usersJoin,
		products,
		productIdCondition,
	);

	const statement = new SelectStatement(
		false,
		selectList,
		productJoin,
		null,
		null,
		null,
		null,
		null,
		null,
	);
	const sql = generator.generate(statement);

	assert.equal(
		sql,
		[
			'SELECT "users"."id", "users"."name", "orders"."order_date", "products"."product_name" ',
			'FROM "users" ',
			'INNER JOIN "orders" ON "users"."id" = "orders"."user_id" ',
			'INNER JOIN "products" ON "orders"."product_id" = "products"."id"',
		].join(''),
	);
});

test('generate select statement with group by', () => {
	const generator = new SqlGenerator();
	const table = new TableReference('orders', null, null);
	const selectList = [
		new ColumnReference('country', null),
		new ColumnReference('COUNT(*)', null),
		new ColumnReference('month', null),
	];
	const groupByList = [
		new ColumnReference('country', null),
		new ColumnReference('month', null),
	];

	const statement = new SelectStatement(
		false,
		selectList,
		table,
		null,
		groupByList,
		null,
		null,
		null,
		null,
	);
	const sql = generator.generate(statement);

	assert.equal(
		sql,
		[
			'SELECT "country", "COUNT(*)", "month" FROM "orders" ',
			'GROUP BY "country", "month"',
		].join(''),
	);
});

test('generate select statement with having condition', () => {
	const generator = new SqlGenerator();
	const table = new TableReference('orders', null, null);
	const selectList = [
		new ColumnReference('country', null),
		new ColumnReference('COUNT(*)', null),
		new ColumnReference('month', null),
	];
	const groupByList = [
		new ColumnReference('country', null),
		new ColumnReference('month', null),
	];
	const havingCondition = new ComparisonExpression(
		ComparisonOperator.GreaterThan,
		new ColumnReference('COUNT(*)', null),
		new LiteralExpression(100),
	);

	const statement = new SelectStatement(
		false,
		selectList,
		table,
		null,
		groupByList,
		havingCondition,
		null,
		null,
		null,
	);
	const sql = generator.generate(statement);

	assert.equal(
		sql,
		[
			'SELECT "country", "COUNT(*)", "month" FROM "orders" ',
			'GROUP BY "country", "month" ',
			'HAVING "COUNT(*)" > 100',
		].join(''),
	);
});

test('generate select statement with order by', () => {
	const generator = new SqlGenerator();
	const colId = new ColumnReference('id', null);
	const colName = new ColumnReference('name', null);
	const table = new TableReference('users', null, null);
	const selectList = [colId, colName];
	const orderByList = [
		new OrderExpression(colId, OrderDirection.Asc),
		new OrderExpression(colName, OrderDirection.Desc),
	];
	const statement = new SelectStatement(
		false,
		selectList,
		table,
		null,
		null,
		null,
		orderByList,
		null,
		null,
	);
	const sql = generator.generate(statement);

	assert.equal(
		sql,
		'SELECT "id", "name" FROM "users" ORDER BY "id" ASC, "name" DESC',
	);
});

test('generate select statement with limit', () => {
	const generator = new SqlGenerator();
	const table = new TableReference('users', null, null);
	const selectList = [new ColumnReference('id', null)];
	const limit = new LiteralExpression(10);
	const statement = new SelectStatement(
		false,
		selectList,
		table,
		null,
		null,
		null,
		null,
		limit,
		null,
	);
	const sql = generator.generate(statement);

	assert.equal(sql, 'SELECT "id" FROM "users" LIMIT 10');
});

test('generate select statement with offset', () => {
	const generator = new SqlGenerator();
	const table = new TableReference('users', null, null);
	const selectList = [new ColumnReference('id', null)];
	const offset = new LiteralExpression(5);
	const statement = new SelectStatement(
		false,
		selectList,
		table,
		null,
		null,
		null,
		null,
		null,
		offset,
	);
	const sql = generator.generate(statement);

	assert.equal(sql, 'SELECT "id" FROM "users" OFFSET 5');
});

test('generate select statement with limit and offset', () => {
	const generator = new SqlGenerator();
	const table = new TableReference('users', null, null);
	const selectList = [new ColumnReference('id', null)];
	const limit = new LiteralExpression(10);
	const offset = new LiteralExpression(5);
	const statement = new SelectStatement(
		false,
		selectList,
		table,
		null,
		null,
		null,
		null,
		limit,
		offset,
	);
	const sql = generator.generate(statement);

	assert.equal(sql, 'SELECT "id" FROM "users" LIMIT 10 OFFSET 5');
});

test('generate select statement with all clauses', () => {
	const generator = new SqlGenerator();

	const users = new TableReference('users', null, null);
	const colId = new ColumnReference('id', users);
	const colName = new ColumnReference('name', users);

	const orders = new TableReference('orders', null, null);
	const colUserId = new ColumnReference('user_id', orders);
	const colCountry = new ColumnReference('country', orders);
	const colMonth = new ColumnReference('month', orders);

	const selectList = [
		colCountry,
		new ColumnReference('COUNT(*)', null),
		colMonth,
	];

	const joinCondition = new ComparisonExpression(
		ComparisonOperator.Equal,
		colId,
		colUserId,
	);
	const join = new JoinExpression(
		JoinType.Inner,
		orders,
		users,
		joinCondition,
	);

	const whereCondition = new ComparisonExpression(
		ComparisonOperator.Equal,
		colName,
		new LiteralExpression('foo'),
	);

	const groupByList = [
		colCountry,
		colMonth,
	];
	const havingCondition = new ComparisonExpression(
		ComparisonOperator.GreaterThan,
		new ColumnReference('COUNT(*)', null),
		new LiteralExpression(100),
	);
	const orderByList = [
		new OrderExpression(
			colCountry,
			OrderDirection.Asc,
		),
	];
	const limit = new LiteralExpression(50);
	const offset = new LiteralExpression(10);

	const statement = new SelectStatement(
		true,
		selectList,
		join,
		whereCondition,
		groupByList,
		havingCondition,
		orderByList,
		limit,
		offset,
	);
	const sql = generator.generate(statement);

	assert.equal(
		sql,
		[
			'SELECT DISTINCT "orders"."country", "COUNT(*)", "orders"."month" ',
			'FROM "orders" ',
			'INNER JOIN "users" ON "users"."id" = "orders"."user_id" ',
			'WHERE "users"."name" = \'foo\' ',
			'GROUP BY "orders"."country", "orders"."month" ',
			'HAVING "COUNT(*)" > 100 ',
			'ORDER BY "orders"."country" ASC ',
			'LIMIT 50 OFFSET 10',
		].join(''),
	);
});
