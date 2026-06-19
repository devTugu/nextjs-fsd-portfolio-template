'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  buildAdminNavigationTree,
  type NavigationNodeOutput,
  type NavigationScope,
  useNavigationNodes,
} from '@/entities/navigation';
import { NavigationTreeEditor } from './navigation-tree-editor';
import { NavigationNodeSheet } from './navigation-node-sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { getErrorMessage } from '@/shared/api';

export function NavigationAdminPanel() {
  const t = useTranslations('entities.navigation');
  const [scope, setScope] = useState<NavigationScope>('HEADER');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<NavigationNodeOutput | null>(null);
  const [parentId, setParentId] = useState<number | null>(null);

  const { data: nodes = [], isLoading, isError, error, refetch } = useNavigationNodes(scope);
  const tree = useMemo(() => buildAdminNavigationTree(nodes), [nodes]);

  const openCreate = (nextParentId: number | null = null) => {
    setEditingNode(null);
    setParentId(nextParentId);
    setSheetOpen(true);
  };

  const openEdit = (node: NavigationNodeOutput) => {
    setEditingNode(node);
    setParentId(node.parentId);
    setSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      <Tabs
        value={scope}
        onValueChange={(value) => setScope(value as NavigationScope)}
      >
        <TabsList>
          <TabsTrigger value="HEADER">{t('headerTab')}</TabsTrigger>
          <TabsTrigger value="FOOTER">{t('footerTab')}</TabsTrigger>
        </TabsList>

        <TabsContent value={scope} className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>{scope === 'HEADER' ? t('headerTab') : t('footerTab')}</CardTitle>
              <CardDescription>{t('treeHint')}</CardDescription>
            </CardHeader>
            <CardContent>
              {isError ? (
                <p className="text-destructive mb-4 text-sm">
                  {t('loadErrorTitle')}: {getErrorMessage(error)}
                </p>
              ) : null}
              <NavigationTreeEditor
                scope={scope}
                tree={tree}
                flatNodes={nodes}
                isLoading={isLoading}
                onCreate={openCreate}
                onEdit={openEdit}
                onRefresh={() => void refetch()}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <NavigationNodeSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        scope={scope}
        node={editingNode}
        parentId={parentId}
        flatNodes={nodes}
      />
    </div>
  );
}
