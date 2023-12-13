// Import stylesheets

export interface Item {
  id: number;
  parent: number | 'root';
  type: string;
  children: Item[];
}

export type TreeItems = Record<string, Item>

export default class TreeStore {
  private items: Item[];
  public cacheItems: Record<string, Item> = {};
  public children: Record<string, Item[]> = {};
  constructor(items: Item[]) {
    this.items = items;
    this.setTree()
  }

  // Создает два экземпляра объектов за один проход по массиву при инициализации класса
  // *chacheItem Record<string, Item>
  // *children Record<Item.id, Item.children>
  private setTree() {
    const rawitems = JSON.parse(JSON.stringify(this.items)) as Item[]
    while (rawitems.length) {
      const currentItem = rawitems.shift()
      if (!currentItem) continue

      // создание объекта перентов для которых есть дети
      if (this.children[currentItem.parent]) {
        this.children[currentItem.parent].push(currentItem)
      } else if (currentItem.parent) {
        this.children[currentItem.parent] = [currentItem]
      }

      // создание кеша объектов по ключам чтобы потом не искать их в массиве
      if (!this.cacheItems[currentItem.id]) {
        this.cacheItems[currentItem.id] = currentItem
      }
    }
  }

  public getAll() {
    return this.items;
  }

  public getItem(id: number) {
    return this.cacheItems[id];
  }

  public getChildren(id: number) {
    return this.children[id] ?? [];
  }

  public getAllChildren(id: number): Item[] {
    return this.getChildren(id).reduce((acc, curr) => {
      const children = this.getChildren(curr.id)
      return acc.concat(children.length ? [curr, ...this.getChildren(curr.id)] : curr)
    }, [] as Item[]).sort((a: Item, b: Item) => a.id - b.id)
  }

  public getParent(id: number | 'root'): Item {
    const parentId = this.cacheItems[id].parent;
    return this.cacheItems[parentId];
  }

  // можно подругому с поиском ключей в children т.к. там лежит информация Record<id children>
  // но это поиск, а тут идет пока не найдем root
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
