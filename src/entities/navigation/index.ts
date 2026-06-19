export type {
  NavigationScope,
  NavigationNodeType,
  LocalizedText,
  NavigationNodeMetadata,
  NavigationNodeTree,
  NavigationNodeOutput,
  PublicNavigationOutput,
  CreateNavigationNodeInput,
  UpdateNavigationNodeInput,
  ReorderNavigationNodeItem,
  ReorderNavigationNodesInput,
} from './types/navigation';

export {
  resolveNavigationLabel,
  resolveNavigationDescription,
  withHeaderNavFallback,
  buildFlatTree,
  FALLBACK_HEADER_NAV,
  HEADER_MAX_DEPTH,
  FOOTER_MAX_DEPTH,
} from './lib/navigation-utils';

export {
  buildAdminNavigationTree,
  flattenAdminTree,
  getNodeDepth,
} from './lib/admin-tree';
export type { AdminNavigationTreeNode } from './lib/admin-tree';

export {
  navigationKeys,
  useNavigationNodes,
  useCreateNavigationNode,
  useUpdateNavigationNode,
  useDeleteNavigationNode,
  useReorderNavigationNodes,
} from './api/queries';
