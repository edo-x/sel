import {
	AliasExpression,
	ArithmeticExpression,
	AssigmentExpression,
	BetweenExpression,
	CaseExpression,
	ColumnReference,
	ComparisonExpression,
	DeleteStatement,
	Expression,
	FunctionExpression,
	InExpression,
	InsertStatement,
	IsExpression,
	JoinExpression,
	LikeExpression,
	LiteralExpression,
	LogicalExpression,
	Node,
	NodeKind,
	OrderExpression,
	ParameterBinding,
	ParenExpression,
	SelectStatement,
	TableExpression,
	TableReference,
	UnaryExpression,
	UpdateStatement,
	ValueList,
	WhenExpression,
} from './node.js';

export abstract class NodeVisitor {
	visit(node: Node): void {
		switch (node.kind) {
			case NodeKind.TableReference:
				this.visitTableReference(node as TableReference);
				break;

			case NodeKind.ColumnReference:
				this.visitColumnReference(node as ColumnReference);
				break;

			case NodeKind.SelectStatement:
				this.visitSelectStatement(node as SelectStatement);
				break;

			case NodeKind.InsertStatement:
				this.visitInsertStatement(node as InsertStatement);
				break;

			case NodeKind.UpdateStatement:
				this.visitUpdateStatement(node as UpdateStatement);
				break;

			case NodeKind.DeleteStatement:
				this.visitDeleteStatement(node as DeleteStatement);
				break;

			case NodeKind.LiteralExpression:
				this.visitLiteralExpression(node as LiteralExpression);
				break;

			case NodeKind.ParameterBinding:
				this.visitParameterBinding(node as ParameterBinding);
				break;

			case NodeKind.ValueList:
				this.visitValueList(node as ValueList);
				break;

			case NodeKind.AssignmentExpression:
				this.visitAssignmentExpression(node as AssigmentExpression);
				break;

			case NodeKind.ParenExpression:
				this.visitParenExpression(node as ParenExpression);
				break;

			case NodeKind.UnaryExpression:
				this.visitUnaryExpression(node as UnaryExpression);
				break;

			case NodeKind.ComparisonExpression:
				this.visitComparisonExpression(node as ComparisonExpression);
				break;

			case NodeKind.ArithmeticExpression:
				this.visitArithmeticExpression(node as ArithmeticExpression);
				break;

			case NodeKind.LogicalExpression:
				this.visitLogicalExpression(node as LogicalExpression);
				break;

			case NodeKind.BetweenExpression:
				this.visitBetweenExpression(node as BetweenExpression);
				break;

			case NodeKind.InExpression:
				this.visitInExpression(node as InExpression);
				break;

			case NodeKind.IsExpression:
				this.visitIsExpression(node as IsExpression);
				break;

			case NodeKind.LikeExpression:
				this.visitLikeExpression(node as LikeExpression);
				break;

			case NodeKind.FunctionExpression:
				this.visitFunctionExpression(node as FunctionExpression);
				break;

			case NodeKind.CaseExpression:
				this.visitCaseExpression(node as CaseExpression);
				break;

			case NodeKind.WhenExpression:
				this.visitWhenExpression(node as WhenExpression);
				break;

			case NodeKind.OrderExpression:
				this.visitOrderExpression(node as OrderExpression);
				break;

			case NodeKind.AliasExpression:
				this.visitAliasExpression(node as AliasExpression);
				break;

			case NodeKind.JoinExpression:
				this.visitJoinExpression(node as JoinExpression);
				break;

			default:
				throw new Error(`invalid node kind=${node.kind}`);
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	visitTableReference(node: TableReference): void {

	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	visitColumnReference(node: ColumnReference): void {

	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	visitInsertStatement(node: InsertStatement): void {
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	visitUpdateStatement(node: UpdateStatement): void {
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	visitDeleteStatement(node: DeleteStatement): void {
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	visitSelectStatement(node: SelectStatement): void {
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	visitLiteralExpression(node: LiteralExpression): void {
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	visitParameterBinding(node: ParameterBinding): void {

	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	visitValueList(node: ValueList): void {

	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	visitAssignmentExpression(node: AssigmentExpression): void {

	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	visitReturnList(node: Expression[]): void {

	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	visitParenExpression(node: ParenExpression): void {

	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	visitUnaryExpression(node: UnaryExpression): void {

	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	visitComparisonExpression(node: ComparisonExpression): void {

	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	visitArithmeticExpression(node: ArithmeticExpression): void {

	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	visitLogicalExpression(node: LogicalExpression): void {

	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	visitBetweenExpression(node: BetweenExpression): void {

	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	visitInExpression(node: InExpression): void {

	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	visitIsExpression(node: IsExpression): void {

	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	visitLikeExpression(node: LikeExpression): void {

	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	visitFunctionExpression(node: FunctionExpression): void {

	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	visitCaseExpression(node: CaseExpression): void {

	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	visitWhenExpression(node: WhenExpression): void {

	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	visitOrderExpression(node: OrderExpression): void {
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	visitAliasExpression(node: AliasExpression): void {
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	visitJoinExpression(node: JoinExpression): void {
	}

	visitTableExpression(node: TableExpression): void {
		switch (node.kind) {
			case NodeKind.TableReference:
				this.visitTableReference(node as TableReference);
				break;

			case NodeKind.JoinExpression:
				this.visitJoinExpression(node as JoinExpression);
				break;

			default:
				throw new Error(`invalid table expression kind=${node.kind}`);
		}
	}
}
