'use client';

import { useMemo, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import {
  type AdminNavigationTreeNode,
  type NavigationNodeOutput,
  type NavigationScope,
  useReorderNavigationNodes,
} from '@/entities/navigation';
import { useAuthPermissions } from '@/features/auth';
import { PERMISSION_CODES } from '@/shared/config/permissions';
import { getErrorMessage } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { NavigationTreeItem } from './navigation-tree-item';

interface NavigationTreeEditorProps {
  scope: NavigationScope;
  tree: AdminNavigationTreeNode[];
  flatNodes: NavigationNodeOutput[];
  isLoading: boolean;
  onCreate: (parentId: number | null) => void;
  onEdit: (node: NavigationNodeOutput) => void;
  onRefresh: () => void;
}

export function NavigationTreeEditor({
  scope,
  tree,
  flatNodes,
  isLoading,
  onCreate,
  onEdit,
  onRefresh,
}: NavigationTreeEditorProps) {
  const t = useTranslations('entities.navigation');
  const { can } = useAuthPermissions();
  const reorder = useReorderNavigationNodes();
  const [expanded, setExpanded] = useState<Set<number>>(() => new Set(tree.map((n) => n.id)));

  const canCreate = can(PERMISSION_CODES.NAV_CREATE);
  const canUpdate = can(PERMISSION_CODES.NAV_UPDATE);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const rootIds = useMemo(() => tree.map((node) => node.id), [tree]);

  const toggleExpanded = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    if (!canUpdate) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = Number(active.id);
    const overId = Number(over.id);
    const activeNode = flatNodes.find((node) => node.id === activeId);
    const overNode = flatNodes.find((node) => node.id === overId);
    if (!activeNode || !overNode || activeNode.parentId !== overNode.parentId) {
      return;
    }

    const siblings = flatNodes
      .filter((node) => node.parentId === activeNode.parentId)
      .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);

    const oldIndex = siblings.findIndex((node) => node.id === activeId);
    const newIndex = siblings.findIndex((node) => node.id === overId);
    if (oldIndex < 0 || newIndex < 0) return;

    const reordered = [...siblings];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    const items = reordered.map((node, index) => ({
      id: node.id,
      parentId: node.parentId,
      sortOrder: index,
    }));

    try {
      await reorder.mutateAsync({ scope, items });
      onRefresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  return (
    <div className="space-y-4">
      {canCreate ? (
        <Button type="button" size="sm" onClick={() => onCreate(null)}>
          <Plus className="mr-1 size-4" />
          {t('addRootNode')}
        </Button>
      ) : null}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={rootIds} strategy={verticalListSortingStrategy}>
          <ul className="space-y-1">
            {tree.map((node) => (
              <NavigationTreeItem
                key={node.id}
                node={node}
                depth={0}
                scope={scope}
                expanded={expanded}
                onToggleExpanded={toggleExpanded}
                onCreate={onCreate}
                onEdit={onEdit}
                onRefresh={onRefresh}
                flatNodes={flatNodes}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      {tree.length === 0 ? (
        <p className="text-muted-foreground text-sm">{t('emptyTree')}</p>
      ) : null}

      {canUpdate ? (
        <p className="text-muted-foreground text-xs">{t('reorderHint')}</p>
      ) : null}
    </div>
  );
}
