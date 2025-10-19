import { assert, test } from 'vitest';
import {
	ColumnReference,
	ComparisonExpression,
	ComparisonOperator,
	DeleteStatement,
	LiteralExpression,
	TableReference,
} from '~/ast/node.js';
import { SqlGenerator } from '~/ast/sql-generator.js';

test('generate delete statement', () => {
	const table = new TableReference('users', null, null);
	const generator = new SqlGenerator();
	const statement = new DeleteStatement(table, null, null);
	const sql = generator.generate(statement);

	assert.equal(sql, 'DELETE FROM "users"');
});

test('generate delete statement with condition', () => {
	const table = new TableReference('users', null, null);
	const col = new ColumnReference('active', null);
	const lit = new LiteralExpression(true);
	const condition = new ComparisonExpression(
		ComparisonOperator.Equal,
		col,
		lit,
	);
	const generator = new SqlGenerator();
	const statement = new DeleteStatement(table, condition, null);
	const sql = generator.generate(statement);

	assert.equal(sql, 'DELETE FROM "users" WHERE "active" = TRUE');
});

test('generate delete statement with returning', () => {
	const table = new TableReference('users', null, null);
	const colId = new ColumnReference('id', null);
	const colName = new ColumnReference('name', null);
	const generator = new SqlGenerator();
	const statement = new DeleteStatement(
		table,
		null,
		[colId, colName],
	);
	const sql = generator.generate(statement);

	assert.equal(sql, 'DELETE FROM "users" RETURNING "id", "name"');
});

test('generate delete statement with condition and returning', () => {
	const table = new TableReference('users', null, null);
	const colActive = new ColumnReference('active', null);
	const litFalse = new LiteralExpression(false);
	const condition = new ComparisonExpression(
		ComparisonOperator.Equal,
		colActive,
		litFalse,
	);
	const colId = new ColumnReference('id', null);
	const colName = new ColumnReference('name', null);
	const generator = new SqlGenerator();
	const statement = new DeleteStatement(
		table,
		condition,
		[colId, colName],
	);
	const sql = generator.generate(statement);

	assert.equal(
		sql,
		'DELETE FROM "users" WHERE "active" = FALSE RETURNING "id", "name"',
	);
});
