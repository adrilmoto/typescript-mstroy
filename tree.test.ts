import { expect, test } from 'vitest'

import TreeStore, { Item } from './TreeStore'
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

const ts = new TreeStore(items)
test('getAll', () => {
  expect(ts.getAll()).toEqual([
    { id: 1, parent: 'root' },
    { id: 2, parent: 1, type: 'test' },
    { id: 3, parent: 1, type: 'test' },

    { id: 4, parent: 2, type: 'test' },
    { id: 5, parent: 2, type: 'test' },
    { id: 6, parent: 2, type: 'test' },

    { id: 7, parent: 4, type: null },
    { id: 8, parent: 4, type: null },
  ])
})
test('getItem', () => {
  expect(ts.getItem(7)).toEqual({ id: 7, parent: 4, type: null })
})
test('getChildren', () => {
  expect(ts.getChildren(4)).toEqual([{ id: 7, parent: 4, type: null }, { id: 8, parent: 4, type: null }])
  expect(ts.getChildren(5)).toEqual([])
  expect(ts.getChildren(2)).toEqual([{ id: 4, parent: 2, type: 'test' }, { id: 5, parent: 2, type: 'test' }, { id: 6, parent: 2, type: 'test' }])
})
test('getAllChildren', () => {
  expect(ts.getAllChildren(2)).toEqual([{ id: 4, parent: 2, type: 'test' }, { id: 5, parent: 2, type: 'test' }, { id: 6, parent: 2, type: 'test' }, { id: 7, parent: 4, type: null }, { id: 8, parent: 4, type: null }])
})
test('getAllParents', () => {
  expect(ts.getAllParents(7)).toEqual([{ id: 4, parent: 2, type: 'test' }, { id: 2, parent: 1, type: 'test' }, { id: 1, parent: 'root' }])
})