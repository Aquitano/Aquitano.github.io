import { defineRule } from "@oxlint/plugins";

import { resolveVariable } from "../shared/scope.ts";

import type { ESTree, SourceCode } from "@oxlint/plugins";

const moduleMockMethods: ReadonlySet<string> = new Set(["doMock", "mock", "unstable_mockModule"]);
const bunModuleMockMethods: ReadonlySet<string> = new Set(["module"]);

const importedMockers = [
  { source: "vitest", name: "vi", methods: moduleMockMethods },
  { source: "vite-plus/test", name: "vi", methods: moduleMockMethods },
  { source: "@jest/globals", name: "jest", methods: moduleMockMethods },
  { source: "bun:test", name: "mock", methods: bunModuleMockMethods },
];

function importedName(node: ESTree.Node): string | null {
  if (node.type !== "ImportSpecifier") return null;
  return node.imported.type === "Identifier" ? node.imported.name : node.imported.value;
}

function mockMethodsOf(
  sourceCode: SourceCode,
  expression: ESTree.Expression,
): ReadonlySet<string> | null {
  if (expression.type !== "Identifier") return null;
  const globalMocker = expression.name === "vi" || expression.name === "jest";
  if (globalMocker && sourceCode.isGlobalReference(expression)) return moduleMockMethods;

  const variable = resolveVariable(sourceCode, expression);
  if (variable === null || variable.defs.length === 0) {
    return globalMocker ? moduleMockMethods : null;
  }
  for (const definition of variable.defs) {
    if (definition.type !== "ImportBinding" || definition.parent?.type !== "ImportDeclaration") {
      continue;
    }
    const source = definition.parent.source.value;
    const name = importedName(definition.node);
    const mocker = importedMockers.find(
      (candidate) => candidate.source === source && candidate.name === name,
    );
    if (mocker !== undefined) return mocker.methods;
  }
  return null;
}

function moduleMockCall(sourceCode: SourceCode, callee: ESTree.Expression): boolean {
  if (!("property" in callee) || !("object" in callee) || !("computed" in callee)) return false;
  const methods = mockMethodsOf(sourceCode, callee.object);
  if (methods === null) return false;
  const property = callee.property;
  const method = callee.computed
    ? property.type === "Literal" && typeof property.value === "string"
      ? property.value
      : null
    : property.type === "Identifier"
      ? property.name
      : null;
  return method !== null && methods.has(method);
}

/** Ban test framework module mocking in favor of real dependency seams. */
export const noModuleMockingRule = defineRule({
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow Vitest, Jest and Bun module mocking; tests must replace dependencies through real interfaces.",
    },
    messages: {
      moduleMock:
        "Replace module mocking with dependency injection through a real interface, service layer, or faithful test implementation.",
    },
  },
  createOnce(context) {
    return {
      CallExpression(node) {
        if (node.callee.type === "Super" || node.callee.type === "V8IntrinsicExpression") return;
        if (moduleMockCall(context.sourceCode, node.callee)) {
          context.report({ node, messageId: "moduleMock" });
        }
      },
    };
  },
});
