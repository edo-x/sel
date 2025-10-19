import { assert, test } from 'vitest';
import {
	AssigmentExpression,
	ColumnReference,
	ComparisonExpression,
	ComparisonOperator,
	LiteralExpression,
	TableReference,
	UpdateStatement,
} from '~/ast/node.js';
import { SqlGenerator } from '~/ast/sql-generator.js';

test('generate update statement', () => {
	const table = new TableReference('users', null, null);
	const colName = new ColumnReference('name', null);
	const assigments = [
		new AssigmentExpression(colName, new LiteralExpression('foobar')),
	];

	const generator = new SqlGenerator();
	const statement = new UpdateStatement(
		table,
		assigments,
		null,
		null,
	);

	const sql = generator.generate(statement);
	assert.equal(sql, 'UPDATE "users" SET "name" = \'foobar\'');
});

test('generate update statement with multiple assigments', () => {
	const table = new TableReference('users', null, null);
	const colName = new ColumnReference('name', null);
	const colActive = new ColumnReference('active', null);
	const assigments = [
		new AssigmentExpression(colName, new LiteralExpression('foobar')),
		new AssigmentExpression(colActive, new LiteralExpression(true)),
	];
	const generator = new SqlGenerator();
	const statement = new UpdateStatement(
		table,
		assigments,
		null,
		null,
	);

	const sql = generator.generate(statement);
	assert.equal(
		sql,
		'UPDATE "users" SET "name" = \'foobar\', "active" = TRUE',
	);
});

test('generate update statemetn with condition', () => {
	const table = new TableReference('users', null, null);
	const colName = new ColumnReference('name', null);
	const colId = new ColumnReference('id', null);
	const assigments = [
		new AssigmentExpression(colName, new LiteralExpression('foobar')),
	];
	const condition = new ComparisonExpression(
		ComparisonOperator.Equal,
		colId,
		new LiteralExpression(1),
	);
	const generator = new SqlGenerator();
	const statement = new UpdateStatement(
		table,
		assigments,
		condition,
		null,
	);

	const sql = generator.generate(statement);
	assert.equal(sql, 'UPDATE "users" SET "name" = \'foobar\' WHERE "id" = 1');
});

test('generate update statement with returning', () => {
	const table = new TableReference('users', null, null);
	const colName = new ColumnReference('name', null);
	const assigments = [
		new AssigmentExpression(colName, new LiteralExpression('foobar')),
	];
	const returnList = [colName];
	const generator = new SqlGenerator();
	const statement = new UpdateStatement(
		table,
		assigments,
		null,
		returnList,
	);

	const sql = generator.generate(statement);
	assert.equal(sql, 'UPDATE "users" SET "name" = \'foobar\' RETURNING "name"');
});

test('generate update statement with condition and returning', () => {
	const table = new TableReference('users', null, null);
	const colName = new ColumnReference('name', null);
	const colId = new ColumnReference('id', null);
	const assigments = [
		new AssigmentExpression(colName, new LiteralExpression('foobar')),
	];
	const condition = new ComparisonExpression(
		ComparisonOperator.Equal,
		colId,
		new LiteralExpression(1),
	);
	const returnList = [colName];
	const generator = new SqlGenerator();
	const statement = new UpdateStatement(
		table,
		assigments,
		condition,
		returnList,
	);

	const sql = generator.generate(statement);
	assert.equal(
		sql,
		'UPDATE "users" SET "name" = \'foobar\' WHERE "id" = 1 RETURNING "name"',
	);
});
