import type { NavigationNodeOutput } from '../types/navigation';

export interface AdminNavigationTreeNode extends NavigationNodeOutput {
  children: AdminNavigationTreeNode[];
}

export function buildAdminNavigationTree(
  nodes: NavigationNodeOutput[],
): AdminNavigationTreeNode[] {
  const map = new Map<number, AdminNavigationTreeNode>();
  for (const node of nodes) {
    map.set(node.id, { ...node, children: [] });
  }

  const roots: AdminNavigationTreeNode[] = [];
  for (const node of map.values()) {
    if (node.parentId === null) {
      roots.push(node);
      continue;
    }
    const parent = map.get(node.parentId);
    if (parent) {
      parent.children.push(node);
    }
  }

  const sortNodes = (items: AdminNavigationTreeNode[]): AdminNavigationTreeNode[] =>
    [...items]
      .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
      .map((item) => ({
        ...item,
        children: sortNodes(item.children),
      }));

  return sortNodes(roots);
}

export function flattenAdminTree(
  nodes: AdminNavigationTreeNode[],
  parentId: number | null = null,
): Array<{ id: number; parentId: number | null; sortOrder: number }> {
  const items: Array<{ id: number; parentId: number | null; sortOrder: number }> = [];

  nodes.forEach((node, index) => {
    items.push({ id: node.id, parentId, sortOrder: index });
    items.push(...flattenAdminTree(node.children, node.id));
  });

  return items;
}

export function getNodeDepth(
  nodeId: number,
  nodes: NavigationNodeOutput[],
): number {
  let depth = 0;
  let current = nodes.find((node) => node.id === nodeId);
  while (current?.parentId != null && depth < 10) {
    depth += 1;
    current = nodes.find((node) => node.id === current?.parentId);
  }
  return depth + 1;
}
