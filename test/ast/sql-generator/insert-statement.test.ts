import { assert, test } from 'vitest';
import {
	ColumnReference,
	InsertStatement,
	LiteralExpression,
	TableReference,
	ValueList,
} from '~/ast/node.js';
import { SqlGenerator } from '~/ast/sql-generator.js';

test('generate insert statement with values', () => {
	const table = new TableReference('users', null, null);
	const columnId = new ColumnReference('id', null);
	const columnName = new ColumnReference('name', null);
	const values1 = new ValueList([
		new LiteralExpression(1),
		new LiteralExpression('Alice'),
	]);
	const values2 = new ValueList([
		new LiteralExpression(2),
		new LiteralExpression('Bob'),
	]);
	const generator = new SqlGenerator();
	const insert = new InsertStatement(
		table,
		[columnId, columnName],
		[values1, values2],
		null,
		false,
	);
	const sql = generator.generate(insert);

	assert.equal(
		sql,
		'INSERT INTO "users" ("id", "name") VALUES (1, \'Alice\'), (2, \'Bob\')',
	);
});

test('generate insert statement with default values', () => {
	const table = new TableReference('users', null, null);
	const generator = new SqlGenerator();
	const insert = new InsertStatement(
		table,
		null,
		null,
		null,
		true,
	);
	const sql = generator.generate(insert);

	assert.equal(sql, 'INSERT INTO "users"  DEFAULT VALUES');
});

test('generate insert statement with returning', () => {
	const table = new TableReference('users', null, null);
	const columnId = new ColumnReference('id', null);
	const columnName = new ColumnReference('name', null);
	const values1 = new ValueList([
		new LiteralExpression(1),
		new LiteralExpression('Alice'),
	]);
	const return1 = new ColumnReference('id', null);
	const return2 = new ColumnReference('name', null);
	const generator = new SqlGenerator();
	const insert = new InsertStatement(
		table,
		[columnId, columnName],
		[values1],
		[return1, return2],
		false,
	);
	const sql = generator.generate(insert);

	assert.equal(
		sql,
		'INSERT INTO "users" ("id", "name") VALUES (1, \'Alice\') RETURNING "id", "name"',
	);
});
