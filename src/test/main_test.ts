import {strict as assert} from 'node:assert';
import test from 'node:test';
import * as main from '../main.js';
import {
  defaultTreeAdapter,
  Document,
  CommentNode,
  Element,
  TextNode,
  NodeType,
  Template,
  DocumentType,
  DocumentFragment
} from 'parse5/dist/tree-adapters/default.js';
import {DOCUMENT_MODE, NS} from 'parse5/dist/common/html.js';

test('isElementNode', async (t) => {
  await t.test('delegates to default adapter', () => {
    assert.strictEqual(main.isElementNode, defaultTreeAdapter.isElementNode);
  });
});

test('isCommentNode', async (t) => {
  await t.test('delegates to default adapter', () => {
    assert.strictEqual(main.isCommentNode, defaultTreeAdapter.isCommentNode);
  });
});

test('isDocumentTypeNode', async (t) => {
  await t.test('delegates to default adapter', () => {
    assert.strictEqual(
      main.isDocumentTypeNode,
      defaultTreeAdapter.isDocumentTypeNode
    );
  });
});

test('isTextNode', async (t) => {
  await t.test('delegates to default adapter', () => {
    assert.strictEqual(main.isTextNode, defaultTreeAdapter.isTextNode);
  });
});

test('isDocument', async (t) => {
  await t.test('true for document nodes', () => {
    const result = main.isDocument({
      nodeName: NodeType.Document,
      mode: DOCUMENT_MODE.NO_QUIRKS,
      childNodes: []
    });

    assert.ok(result);
  });

  await t.test('false for non-document nodes', () => {
    const result = main.isDocument({
      nodeName: NodeType.Text,
      value: 'pewpew',
      parentNode: null
    });

    assert.strictEqual(result, false);
  });
});

test('isDocumentFragment', async (t) => {
  await t.test('true for document fragment nodes', () => {
    const result = main.isDocumentFragment({
      nodeName: NodeType.DocumentFragment,
      childNodes: []
    });

    assert.ok(result);
  });

  await t.test('false for non-document-fragment nodes', () => {
    const result = main.isDocument({
      nodeName: NodeType.Text,
      value: 'pewpew',
      parentNode: null
    });

    assert.strictEqual(result, false);
  });
});

test('isTemplateNode', async (t) => {
  await t.test('true for template nodes', () => {
    const result = main.isTemplateNode({
      nodeName: 'template',
      tagName: 'template',
      content: {
        nodeName: NodeType.DocumentFragment,
        childNodes: []
      },
      attrs: [],
      namespaceURI: NS.HTML,
      parentNode: null,
      childNodes: []
    });

    assert.ok(result);
  });

  await t.test('false for non-document-fragment nodes', () => {
    const result = main.isTemplateNode({
      nodeName: NodeType.Text,
      value: 'pewpew',
      parentNode: null
    });

    assert.strictEqual(result, false);
  });
});

test('appendChild', async (t) => {
  await t.test('delegates to default adapter', () => {
    assert.strictEqual(main.appendChild, defaultTreeAdapter.appendChild);
  });
});

test('isParentNode', async (t) => {
  await t.test('true for document nodes', () => {
    const node: Document = {
      nodeName: NodeType.Document,
      mode: DOCUMENT_MODE.NO_QUIRKS,
      childNodes: []
    };
    assert.strictEqual(main.isParentNode(node), true);
  });

  await t.test('true for document fragment nodes', () => {
    const node: DocumentFragment = {
      nodeName: NodeType.DocumentFragment,
      childNodes: []
    };
    assert.strictEqual(main.isParentNode(node), true);
  });

  await t.test('true for element nodes', () => {
    const node: Element = {
      nodeName: 'div',
      tagName: 'DIV',
      attrs: [],
      namespaceURI: NS.HTML,
      parentNode: null,
      childNodes: []
    };
    assert.strictEqual(main.isParentNode(node), true);
  });

  await t.test('true for template nodes', () => {
    const node: Template = {
      nodeName: 'template',
      tagName: 'template',
      content: {
        nodeName: NodeType.DocumentFragment,
        childNodes: []
      },
      attrs: [],
      namespaceURI: NS.HTML,
      parentNode: null,
      childNodes: []
    };
    assert.strictEqual(main.isParentNode(node), true);
  });

  await t.test('false for text nodes', () => {
    const node: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'well hello there'
    };
    assert.strictEqual(main.isParentNode(node), false);
  });
});

test('isChildNode', async (t) => {
  await t.test('true for element nodes', () => {
    const node: Element = {
      nodeName: 'div',
      parentNode: null,
      tagName: 'div',
      attrs: [],
      namespaceURI: NS.HTML,
      childNodes: []
    };
    assert.strictEqual(main.isChildNode(node), true);
  });

  await t.test('true for template nodes', () => {
    const node: Template = {
      nodeName: 'template',
      parentNode: null,
      tagName: 'template',
      attrs: [],
      namespaceURI: NS.HTML,
      childNodes: [],
      content: {
        nodeName: NodeType.DocumentFragment,
        childNodes: []
      }
    };
    assert.strictEqual(main.isChildNode(node), true);
  });

  await t.test('true for comment nodes', () => {
    const node: CommentNode = {
      nodeName: NodeType.Comment,
      parentNode: null,
      data: 'oogaboogah'
    };
    assert.strictEqual(main.isChildNode(node), true);
  });

  await t.test('true for text nodes', () => {
    const node: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'well hello there'
    };
    assert.strictEqual(main.isChildNode(node), true);
  });

  await t.test('true for document type nodes', () => {
    const node: DocumentType = {
      nodeName: NodeType.DocumentType,
      parentNode: null,
      name: 'cats',
      publicId: 'c-a-t-s',
      systemId: 'm-e-o-w'
    };
    assert.strictEqual(main.isChildNode(node), true);
  });

  await t.test('false for document nodes', () => {
    const node: Document = {
      nodeName: NodeType.Document,
      mode: DOCUMENT_MODE.NO_QUIRKS,
      childNodes: []
    };
    assert.strictEqual(main.isChildNode(node), false);
  });
});

test('spliceChildren', async (t) => {
  await t.test('deletes without new children', () => {
    const child1: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: '001'
    };
    const child2: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: '010'
    };
    const node: DocumentFragment = {
      nodeName: NodeType.DocumentFragment,
      childNodes: [child1, child2]
    };

    const result = main.spliceChildren(node, 0, 1);

    assert.strictEqual(node.childNodes.length, 1);
    assert.strictEqual(node.childNodes[0], child2);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0], child1);
  });

  await t.test('deletes from specified index', () => {
    const child1: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'one'
    };
    const child2: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'two'
    };
    const child3: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'three'
    };
    const node: DocumentFragment = {
      nodeName: NodeType.DocumentFragment,
      childNodes: [child1, child2, child3]
    };

    const result = main.spliceChildren(node, 1, 1);

    assert.strictEqual(node.childNodes.length, 2);
    assert.strictEqual(node.childNodes[0], child1);
    assert.strictEqual(node.childNodes[1], child3);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0], child2);
  });

  await t.test('appends without deleting if deleteCount is 0', () => {
    const child1: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'one'
    };
    const child2: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'two'
    };
    const node: DocumentFragment = {
      nodeName: NodeType.DocumentFragment,
      childNodes: [child1]
    };

    const result = main.spliceChildren(node, 0, 0, child2);

    assert.strictEqual(node.childNodes.length, 2);
    assert.strictEqual(node.childNodes[0], child2);
    assert.strictEqual(node.childNodes[1], child1);
    assert.strictEqual(result.length, 0);
  });

  await t.test('appends at specified index', () => {
    const child1: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'one'
    };
    const child2: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'two'
    };
    const node: DocumentFragment = {
      nodeName: NodeType.DocumentFragment,
      childNodes: [child1]
    };

    const result = main.spliceChildren(node, 1, 0, child2);

    assert.strictEqual(node.childNodes.length, 2);
    assert.strictEqual(node.childNodes[0], child1);
    assert.strictEqual(node.childNodes[1], child2);
    assert.strictEqual(result.length, 0);
  });

  await t.test('deletes then appends new children', () => {
    const child1: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'one'
    };
    const child2: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'two'
    };
    const child3: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'three'
    };
    const node: DocumentFragment = {
      nodeName: NodeType.DocumentFragment,
      childNodes: [child1, child2]
    };

    const result = main.spliceChildren(node, 1, 1, child3);

    assert.strictEqual(node.childNodes.length, 2);
    assert.strictEqual(node.childNodes[0], child1);
    assert.strictEqual(node.childNodes[1], child3);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0], child2);
  });

  await t.test('ignores nodes which are not parent nodes', () => {
    const node: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'some text'
    };
    const result = main.spliceChildren(node, 0, 1);

    assert.strictEqual(result.length, 0);
  });
});

test('replaceWith', async (t) => {
  await t.test('ignores nodes which have no parent', () => {
    const node: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'some text'
    };

    main.replaceWith(node, {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'some other text'
    });

    assert.strictEqual(node.parentNode, null);
  });

  await t.test('replaces node with specified nodes', () => {
    const child1: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'one'
    };
    const child2: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'two'
    };
    const child3: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'three'
    };
    const node: DocumentFragment = {
      nodeName: NodeType.DocumentFragment,
      childNodes: [child1, child2]
    };

    child1.parentNode = node;
    child2.parentNode = node;

    main.replaceWith(child2, child3);

    assert.strictEqual(node.childNodes.length, 2);
    assert.strictEqual(node.childNodes[0], child1);
    assert.strictEqual(node.childNodes[1], child3);
    assert.strictEqual(child3.parentNode, node);
    assert.strictEqual(child2.parentNode, null);
  });

  await t.test('leaves childNodes untouched if child missing', () => {
    const child1: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'one'
    };
    const child2: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'two'
    };
    const node: DocumentFragment = {
      nodeName: NodeType.DocumentFragment,
      childNodes: []
    };

    child1.parentNode = node;

    main.replaceWith(child1, child2);

    assert.strictEqual(node.childNodes.length, 0);
    assert.strictEqual(child1.parentNode, null);
  });
});

test('setAttribute', async (t) => {
  await t.test('adds attribute to elemet attrs', () => {
    const node: Element = {
      nodeName: 'div',
      parentNode: null,
      tagName: 'div',
      attrs: [],
      namespaceURI: NS.HTML,
      childNodes: []
    };

    main.setAttribute(node, 'ping-pong', 'boing');

    assert.deepStrictEqual(node.attrs, [{name: 'ping-pong', value: 'boing'}]);
  });
});

test('getAttribute', async (t) => {
  await t.test('retrieves specified attribute value', () => {
    const node: Element = {
      nodeName: 'div',
      parentNode: null,
      tagName: 'div',
      attrs: [{name: 'some-attr', value: 'some-value'}],
      namespaceURI: NS.HTML,
      childNodes: []
    };

    const result = main.getAttribute(node, 'some-attr');

    assert.strictEqual(result, 'some-value');
  });

  await t.test('null if attribute does not exist', () => {
    const node: Element = {
      nodeName: 'div',
      parentNode: null,
      tagName: 'div',
      attrs: [],
      namespaceURI: NS.HTML,
      childNodes: []
    };

    const result = main.getAttribute(node, 'non-existent');

    assert.strictEqual(result, null);
  });

  await t.test('retrieves empty string values', () => {
    const node: Element = {
      nodeName: 'div',
      parentNode: null,
      tagName: 'div',
      attrs: [{name: 'some-attr', value: ''}],
      namespaceURI: NS.HTML,
      childNodes: []
    };

    const result = main.getAttribute(node, 'some-attr');

    assert.strictEqual(result, '');
  });
});

test('hasAttribute', async (t) => {
  await t.test('true if specified attribute exists', () => {
    const node: Element = {
      nodeName: 'div',
      parentNode: null,
      tagName: 'div',
      attrs: [{name: 'some-attr', value: 'some-value'}],
      namespaceURI: NS.HTML,
      childNodes: []
    };

    const result = main.hasAttribute(node, 'some-attr');

    assert.strictEqual(result, true);
  });

  await t.test('false if specified attribute does not exist', () => {
    const node: Element = {
      nodeName: 'div',
      parentNode: null,
      tagName: 'div',
      attrs: [],
      namespaceURI: NS.HTML,
      childNodes: []
    };

    const result = main.hasAttribute(node, 'some-attr');

    assert.strictEqual(result, false);
  });
});

test('removeAttribute', async (t) => {
  await t.test('removes specified attribute', () => {
    const node: Element = {
      nodeName: 'div',
      parentNode: null,
      tagName: 'div',
      attrs: [{name: 'some-attr', value: 'some-value'}],
      namespaceURI: NS.HTML,
      childNodes: []
    };

    main.removeAttribute(node, 'some-attr');

    assert.strictEqual(node.attrs.length, 0);
  });

  await t.test('ignores already missing attributes', () => {
    const node: Element = {
      nodeName: 'div',
      parentNode: null,
      tagName: 'div',
      attrs: [],
      namespaceURI: NS.HTML,
      childNodes: []
    };

    main.removeAttribute(node, 'some-attr');

    assert.strictEqual(node.attrs.length, 0);
  });
});

test('getAttributeIndex', async (t) => {
  await t.test('retrieves index of specified attribute', () => {
    const node: Element = {
      nodeName: 'div',
      parentNode: null,
      tagName: 'div',
      attrs: [
        {name: 'attr-0', value: 'some-value'},
        {name: 'attr-1', value: 'some-value'}
      ],
      namespaceURI: NS.HTML,
      childNodes: []
    };

    const index0 = main.getAttributeIndex(node, 'attr-0');
    const index1 = main.getAttributeIndex(node, 'attr-1');

    assert.strictEqual(index0, 0);
    assert.strictEqual(index1, 1);
  });

  await t.test('-1 if attribute missing', () => {
    const node: Element = {
      nodeName: 'div',
      parentNode: null,
      tagName: 'div',
      attrs: [],
      namespaceURI: NS.HTML,
      childNodes: []
    };

    const result = main.getAttributeIndex(node, 'some-attr');

    assert.strictEqual(result, -1);
  });
});

test('createTextNode', async (t) => {
  await t.test('creates a text node with specified content', () => {
    const result = main.createTextNode('doop');

    assert.deepStrictEqual(result, {
      nodeName: '#text',
      value: 'doop',
      parentNode: null
    });
  });
});

test('getTextContent', async (t) => {
  await t.test('returns data of comment', () => {
    const node: CommentNode = {
      nodeName: NodeType.Comment,
      parentNode: null,
      data: 'some text'
    };

    const result = main.getTextContent(node);

    assert.strictEqual(result, 'some text');
  });

  await t.test('returns value of text node', () => {
    const node: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'some text'
    };

    const result = main.getTextContent(node);

    assert.strictEqual(result, 'some text');
  });

  await t.test('concats all text-like children', () => {
    const child1: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'text node'
    };
    const child2: CommentNode = {
      nodeName: NodeType.Comment,
      parentNode: null,
      data: 'comment node'
    };
    const node: DocumentFragment = {
      nodeName: NodeType.DocumentFragment,
      childNodes: [child1, child2]
    };

    const result = main.getTextContent(node);

    assert.strictEqual(result, 'text nodecomment node');
  });

  await t.test('ignores non-text children', () => {
    const child1: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'text node'
    };
    const child2: Element = {
      nodeName: 'div',
      parentNode: null,
      tagName: 'div',
      attrs: [],
      namespaceURI: NS.HTML,
      childNodes: []
    };
    const node: DocumentFragment = {
      nodeName: NodeType.DocumentFragment,
      childNodes: [child1, child2]
    };

    const result = main.getTextContent(node);

    assert.strictEqual(result, 'text node');
  });

  await t.test('concats deep text-like children', () => {
    const level0Child0: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'level 0'
    };
    const level1Child0: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'level 1'
    };
    const level2Child0: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'level 2'
    };
    const level1Child1: Element = {
      nodeName: 'div',
      parentNode: null,
      tagName: 'div',
      attrs: [],
      namespaceURI: NS.HTML,
      childNodes: [level2Child0]
    };
    const level0Child1: Element = {
      nodeName: 'div',
      parentNode: null,
      tagName: 'div',
      attrs: [],
      namespaceURI: NS.HTML,
      childNodes: [level1Child0, level1Child1]
    };
    const node: DocumentFragment = {
      nodeName: NodeType.DocumentFragment,
      childNodes: [level0Child0, level0Child1]
    };

    const result = main.getTextContent(node);

    assert.strictEqual(result, 'level 0level 1level 2');
  });
});

test('setTextContent', async (t) => {
  await t.test('sets data of comment nodes', () => {
    const node: CommentNode = {
      nodeName: NodeType.Comment,
      parentNode: null,
      data: 'some text'
    };

    main.setTextContent(node, 'some other text');

    assert.strictEqual(node.data, 'some other text');
  });

  await t.test('sets value of text nodes', () => {
    const node: TextNode = {
      nodeName: NodeType.Text,
      parentNode: null,
      value: 'some text'
    };

    main.setTextContent(node, 'some other text');

    assert.strictEqual(node.value, 'some other text');
  });

  await t.test('appends text node for parent nodes', () => {
    const node: DocumentFragment = {
      nodeName: NodeType.DocumentFragment,
      childNodes: []
    };

    main.setTextContent(node, 'some text');

    assert.strictEqual(node.childNodes.length, 1);
    assert.deepStrictEqual(node.childNodes[0], {
      nodeName: '#text',
      value: 'some text',
      parentNode: node
    });
  });

  await t.test('ignores document type nodes', () => {
    const node: DocumentType = {
      nodeName: NodeType.DocumentType,
      parentNode: null,
      name: 'some-name',
      publicId: 'some-name',
      systemId: 'some-name'
    };
    const expected = {...node};

    main.setTextContent(node, 'bleep');

    assert.deepStrictEqual(node, expected);
  });
});
