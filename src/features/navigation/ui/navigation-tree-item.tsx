'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  type AdminNavigationTreeNode,
  type NavigationNodeOutput,
  type NavigationScope,
  useDeleteNavigationNode,
} from '@/entities/navigation';
import { useAuthPermissions } from '@/features/auth';
import { PERMISSION_CODES } from '@/shared/config/permissions';
import { getErrorMessage } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/alert-dialog';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/lib/utils';

interface NavigationTreeItemProps {
  node: AdminNavigationTreeNode;
  depth: number;
  scope: NavigationScope;
  expanded: Set<number>;
  onToggleExpanded: (id: number) => void;
  onCreate: (parentId: number | null) => void;
  onEdit: (node: NavigationNodeOutput) => void;
  onRefresh: () => void;
  flatNodes: NavigationNodeOutput[];
}

export function NavigationTreeItem({
  node,
  depth,
  scope,
  expanded,
  onToggleExpanded,
  onCreate,
  onEdit,
  onRefresh,
  flatNodes,
}: NavigationTreeItemProps) {
  const t = useTranslations('entities.navigation');
  const tStatus = useTranslations('status');
  const { can } = useAuthPermissions();
  const deleteNode = useDeleteNavigationNode();
  const canUpdate = can(PERMISSION_CODES.NAV_UPDATE);
  const canCreate = can(PERMISSION_CODES.NAV_CREATE);
  const canDelete = can(PERMISSION_CODES.NAV_DELETE);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: node.id, disabled: !canUpdate });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const hasChildren = node.children.length > 0;
  const isExpanded = expanded.has(node.id);

  const handleDelete = async () => {
    try {
      await deleteNode.mutateAsync(node.id);
      toast.success(t('deleted'));
      onRefresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <li ref={setNodeRef} style={style} className={cn(isDragging && 'opacity-60')}>
      <div
        className="border-border/60 flex items-center gap-2 rounded-md border px-2 py-2"
        style={{ marginLeft: depth * 16 }}
      >
        {canUpdate ? (
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground cursor-grab"
            aria-label={t('dragHandle')}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-4" />
          </button>
        ) : null}

        {hasChildren ? (
          <button
            type="button"
            onClick={() => onToggleExpanded(node.id)}
            className="text-muted-foreground"
            aria-label={isExpanded ? t('collapse') : t('expand')}
          >
            {isExpanded ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
          </button>
        ) : (
          <span className="size-4" />
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate text-sm font-medium">{node.labels.en}</span>
            <Badge variant="outline" className="text-xs">
              {node.type}
            </Badge>
            {!node.isPublished ? (
              <Badge variant="secondary" className="text-xs">
                {tStatus('draft')}
              </Badge>
            ) : null}
          </div>
          {node.href ? (
            <p className="text-muted-foreground truncate text-xs">{node.href}</p>
          ) : null}
        </div>

        <div className="flex items-center gap-1">
          {canCreate ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onCreate(node.id)}
              aria-label={t('addChild')}
            >
              <Plus className="size-4" />
            </Button>
          ) : null}
          {canUpdate ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onEdit(node)}
              aria-label={t('editNode')}
            >
              <Pencil className="size-4" />
            </Button>
          ) : null}
          {canDelete ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="ghost" size="icon" aria-label={t('deleteNode')}>
                  <Trash2 className="size-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('deleteConfirmTitle')}</AlertDialogTitle>
                  <AlertDialogDescription>{t('deleteConfirmDescription')}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={() => void handleDelete()}>
                    {t('deleteNode')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : null}
        </div>
      </div>

      {hasChildren && isExpanded ? (
        <ul className="mt-1 space-y-1">
          {node.children.map((child) => (
            <NavigationTreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              scope={scope}
              expanded={expanded}
              onToggleExpanded={onToggleExpanded}
              onCreate={onCreate}
              onEdit={onEdit}
              onRefresh={onRefresh}
              flatNodes={flatNodes}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}
