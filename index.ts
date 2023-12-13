// Import stylesheets
import './style.css';
import { expect, test } from 'vitest';

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = `<h1>TypeScript Starter</h1>`;

const items = [
  { id: 1, parent: 'root' },
  { id: 2, parent: 1, type: 'test' },
  { id: 3, parent: 1, type: 'test' },

  { id: 4, parent: 2, type: 'test' },
  { id: 5, parent: 2, type: 'test' },
  { id: 6, parent: 2, type: 'test' },

  { id: 7, parent: 4, type: null },
  { id: 8, parent: 4, type: null },
] as Item[];

interface Item {
  id: number;
  parent: number | 'root';
  type: string;
  children: Item[];
}

class TreeStore {
  private items: Item[];
  public treeItems: Record<string, Item>;
  constructor(items: Item[]) {
    this.items = items;
    this.setTree();
  }

  private setTree() {
    this.treeItems = this.items.reduce((acc, curr, i, array) => {
      const children = array.reduce((children, child) => {
        if (child.parent === curr.id) {
          children.push(child);
        }
        return children;
      }, []);
      curr.children = children;
      acc[curr.id] = curr;
      return acc;
    }, {});
  }

  public getAll() {
    return this.items;
  }

  public getItem(id: number) {
    return this.treeItems[id];
  }

  public getChildren(id: number) {
    return this.treeItems[id].children;
  }

  private flattenChildren(children: Item[]) {
    return children.reduce((acc, child) => {
      const childItems = child.children;
      return acc.concat(
        childItems.length ? [...this.flattenChildren(childItems), child] : child
      );
    }, []);
  }

  public getAllChildren(id: number) {
    const children = this.getChildren(id);
    return [...this.flattenChildren(children)];
  }

  public getParent(id: number | 'root'): Item {
    if (id === 'root') return null;
    const parentId = this.treeItems[id].parent;
    return this.treeItems[parentId];
  }

  public getAllParents(id: number) {
    let parentItem = this.getParent(id);
    const parents = [];
    while (parentItem) {
      parents.push(parentItem);
      parentItem = this.getParent(parentItem.id);
    }

    return parents;
  }
}

const ts = new TreeStore(items);

test('getAll', () => {
  expect(ts.getAll()).toBe([
    { id: 1, parent: 'root' },
    { id: 2, parent: 1, type: 'test' },
    { id: 3, parent: 1, type: 'test' },

    { id: 4, parent: 2, type: 'test' },
    { id: 5, parent: 2, type: 'test' },
    { id: 6, parent: 2, type: 'test' },

    { id: 7, parent: 4, type: null },
    { id: 8, parent: 4, type: null },
  ]);
});

test('get');

console.log('getAll', ts.getAll());
console.log('treeItems', ts.treeItems);
console.log('getItem', ts.getItem(7));
console.log('getChildren 4', ts.getChildren(4)); // [{"id":7,"parent":4,"type":null},{"id":8,"parent":4,"type":null}]
console.log('getChildren 5', ts.getChildren(5)); // []
console.log('getChildren 2', ts.getChildren(2)); // [{"id":4,"parent":2,"type":"test"},{"id":5,"parent":2,"type":"test"},{"id":6,"parent":2,"type":"test"}]
console.log('getAllChildren', ts.getAllChildren(2));
console.log('getAllParents', ts.getAllParents(7));
