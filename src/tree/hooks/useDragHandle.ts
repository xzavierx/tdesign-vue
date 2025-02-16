import { SetupContext } from '@vue/composition-api';
import {
  TreeProps, TypDragEventState, TypeTreeState, TypeDragHandle,
} from '../interface';
import { emitEvent } from '../util';
import TreeNode from '../../_common/js/tree/tree-node';

export default function useDragHandle(props: TreeProps, context: SetupContext, state: TypeTreeState) {
  const treeState = state;
  const { store } = treeState;

  let dragNode: TreeNode = null;

  const handleDragStart = (state: TypDragEventState) => {
    const { dragEvent, node } = state;
    dragNode = node;

    const ctx = {
      node: node.getModel(),
      e: dragEvent,
    };
    emitEvent<Parameters<TreeProps['onDragStart']>>(props, context, 'drag-start', ctx);
  };

  const handleDragEnd = (state: TypDragEventState) => {
    const { dragEvent, node } = state;
    dragNode = node;

    const ctx = {
      node: node.getModel(),
      e: dragEvent,
    };
    emitEvent<Parameters<TreeProps['onDragEnd']>>(props, context, 'drag-end', ctx);
  };

  const handleDragOver = (state: TypDragEventState) => {
    const { dragEvent, node } = state;
    const ctx = {
      node: node.getModel(),
      e: dragEvent,
    };
    emitEvent<Parameters<TreeProps['onDragOver']>>(props, context, 'drag-over', ctx);
  };

  const handleDragLeave = (state: TypDragEventState) => {
    const { dragEvent, node } = state;
    const ctx = {
      node: node.getModel(),
      e: dragEvent,
    };
    emitEvent<Parameters<TreeProps['onDragLeave']>>(props, context, 'drag-leave', ctx);
  };

  const handleDrop = (state: TypDragEventState) => {
    const { dragEvent, node, dropPosition } = state;
    if (node.value === dragNode.value || node.getParents().some((_node) => _node.value === dragNode.value)) return;

    const nodes = store.getNodes() as TreeNode[];
    nodes.some((_node) => {
      if (_node.value === node.value) {
        if (dropPosition === 0) {
          dragNode.appendTo(store, _node);
        } else if (dropPosition < 0) {
          node.insertBefore(dragNode);
        } else {
          node.insertAfter(dragNode);
        }
        return true;
      }
      return false;
    });
    const ctx = {
      dropNode: node.getModel(),
      dragNode: dragNode.getModel(),
      dropPosition,
      e: dragEvent,
    };
    emitEvent<Parameters<TreeProps['onDrop']>>(props, context, 'drop', ctx);
  };

  const drag: TypeDragHandle = {
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };

  const { scope } = treeState;
  scope.drag = drag;

  return {
    drag,
  };
}
