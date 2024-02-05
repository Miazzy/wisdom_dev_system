<script lang="tsx">
  import {
    CSSProperties,
    nextTick,
    defineComponent,
    reactive,
    computed,
    unref,
    ref,
    watchEffect,
    toRaw,
    watch,
    onMounted,
  } from 'vue';
  import type {
    FieldNames,
    TreeState,
    TreeItem,
    KeyType,
    CheckKeys,
    TreeActionType,
  } from './types/tree';

  import TreeHeader from './components/TreeHeader.vue';
  import { Tree, Spin, Empty } from 'ant-design-vue';
  import { TreeIcon } from './TreeIcon';
  import { ScrollContainer } from '/@/components/Container';
  import { omit, get, difference, cloneDeep } from 'lodash-es';
  import { isArray, isBoolean, isEmpty, isFunction } from '/@/utils/is';
  import { extendSlots, getSlot } from '/@/utils/helper/tsxHelper';
  import { filter, treeToList, eachTree } from '/@/utils/helper/treeHelper';
  import { useTree } from './hooks/useTree';
  import { useContextMenu } from '/@/hooks/web/useContextMenu';
  import { CreateContextOptions } from '/@/components/ContextMenu';
  import { treeEmits, treeProps } from './types/tree';
  import { createBEM } from '/@/utils/bem';

  export default defineComponent({
    name: 'BasicTree',
    inheritAttrs: false,
    props: treeProps,
    emits: treeEmits,
    setup(props, { attrs, slots, emit, expose }) {
      const [bem] = createBEM('tree');
      const treeBadgeMap = new Map<string, any>();

      const state = reactive<TreeState>({
        checkStrictly: props.checkStrictly,
        expandedKeys: props.expandedKeys || [],
        selectedKeys: props.selectedKeys || [],
        checkedKeys: props.checkedKeys || [],
      });

      const searchState = reactive({
        startSearch: false,
        searchText: '',
        searchData: [] as TreeItem[],
      });

      const treeDataRef = ref<TreeItem[]>([]);

      const [createContextMenu] = useContextMenu();

      const getFieldNames = computed((): Required<FieldNames> => {
        const { fieldNames } = props;
        return {
          children: 'children',
          title: 'title',
          key: 'key',
          ...fieldNames,
        };
      });

      const getBindValues = computed(() => {
        let propsData = {
          blockNode: true,
          ...attrs,
          ...props,
          expandedKeys: state.expandedKeys,
          selectedKeys: state.selectedKeys,
          checkedKeys: state.checkedKeys,
          checkStrictly: state.checkStrictly,
          fieldNames: unref(getFieldNames),
          'onUpdate:expandedKeys': (v: KeyType[]) => {
            state.expandedKeys = v;
            emit('update:expandedKeys', v);
          },
          'onUpdate:selectedKeys': (v: KeyType[]) => {
            state.selectedKeys = v;
            emit('update:selectedKeys', v);
          },
          onExpand: (keys, event) => {
            setTimeout(() => {
              handleBadge();
            }, 300);
          },
          onload: (keys, event) => {
            debugger;
            setTimeout(() => {
              handleBadge();
            }, 300);
          },
          onCheck: (v: CheckKeys, e) => {
            let currentValue = toRaw(state.checkedKeys) as KeyType[];
            if (isArray(currentValue) && searchState.startSearch) {
              const value = e.node.eventKey;
              currentValue = difference(currentValue, getChildrenKeys(value));
              if (e.checked) {
                currentValue.push(value);
              }
              state.checkedKeys = currentValue;
            } else {
              state.checkedKeys = v;
            }

            const rawVal = toRaw(state.checkedKeys);
            emit('update:value', rawVal);
            emit('check', rawVal, e);
          },
          onRightClick: handleRightClick,
        };
        return omit(propsData, 'treeData', 'class');
      });

      const getTreeData = computed((): TreeItem[] =>
        searchState.startSearch ? searchState.searchData : unref(treeDataRef),
      );

      const getNotFound = computed((): boolean => {
        return !getTreeData.value || getTreeData.value.length === 0;
      });

      const {
        deleteNodeByKey,
        insertNodeByKey,
        insertNodesByKey,
        filterByLevel,
        updateNodeByKey,
        getAllKeys,
        getChildrenKeys,
        getEnabledKeys,
        getSelectedNode,
      } = useTree(treeDataRef, getFieldNames);

      function getIcon(params: TreeItem, icon?: string) {
        if (!icon) {
          if (props.renderIcon && isFunction(props.renderIcon)) {
            return props.renderIcon(params);
          }
        }
        return icon;
      }

      async function handleRightClick({ event, node }: Recordable) {
        const { rightMenuList: menuList = [], beforeRightClick } = props;
        let contextMenuOptions: CreateContextOptions = { event, items: [] };

        if (beforeRightClick && isFunction(beforeRightClick)) {
          let result = await beforeRightClick(node, event);
          if (Array.isArray(result)) {
            contextMenuOptions.items = result;
          } else {
            Object.assign(contextMenuOptions, result);
          }
        } else {
          contextMenuOptions.items = menuList;
        }
        if (!contextMenuOptions.items?.length) return;
        contextMenuOptions.items = contextMenuOptions.items.filter((item) => !item.hidden);
        createContextMenu(contextMenuOptions);
      }

      function setExpandedKeys(keys: KeyType[]) {
        state.expandedKeys = keys;
      }

      function getExpandedKeys() {
        return state.expandedKeys;
      }
      function setSelectedKeys(keys: KeyType[]) {
        state.selectedKeys = keys;
      }

      function getSelectedKeys() {
        return state.selectedKeys;
      }

      function setCheckedKeys(keys: CheckKeys) {
        state.checkedKeys = keys;
      }

      function getCheckedKeys() {
        return state.checkedKeys;
      }

      function checkAll(checkAll: boolean) {
        state.checkedKeys = checkAll ? getEnabledKeys() : ([] as KeyType[]);
      }

      function expandAll(expandAll: boolean) {
        state.expandedKeys = expandAll ? getAllKeys() : ([] as KeyType[]);
      }

      function onStrictlyChange(strictly: boolean) {
        state.checkStrictly = strictly;
      }

      watch(
        () => props.searchValue,
        (val) => {
          if (val !== searchState.searchText) {
            searchState.searchText = val;
          }
        },
        {
          immediate: true,
        },
      );

      watch(
        () => props.treeData,
        (val) => {
          if (val) {
            const data = props.treeData as TreeItem[];
            handleTreeData(data);
            treeDataRef.value = data as TreeItem[];
            handleSearch(searchState.searchText);
          }
        },
        {
          deep: true,
        },
      );

      const handleBadge = () => {
        const entries = treeBadgeMap.entries();
        nextTick(() => {
          for (const [key, value] of entries) {
            addSpanToNodeByClass(key, value);
          }
        });
      };

      const addSpanToNodeByClass = (containerClass, content) => {
        if (content === '0' || content === 0) {
          return;
        }
        const targetClass = 'vben-tree__title';
        const container = document.querySelector(`.${containerClass}`);
        if (container) {
          const targetNode = container.querySelector(`.${targetClass}`);
          if (targetNode && !targetNode.hasAttribute('data-span-added')) {
            const spanElement = document.createElement('span');
            spanElement.className = 'notReadNumCls';
            spanElement.textContent = content;
            targetNode.appendChild(spanElement);
            targetNode.setAttribute('data-span-added', 'true');
          }
        }
      };

      const getTreeNodeKey = (element) => {
        return element[props?.fieldNames?.key || 'key'] || element?.id || element?.key;
      };

      const handleTreeData = (data) => {
        if (data == null) {
          return;
        }
        try {
          for (let element of data) {
            const key = 'val_' + getTreeNodeKey(element);
            const badge = Reflect.get(element, 'badge') || 0;
            if (Reflect.has(element, 'class')) {
              element.class = element.class + ' ' + key + ' ';
            } else {
              element.class = key;
            }
            treeBadgeMap.set(key, badge);
            if (Reflect.has(element, 'children')) {
              handleTreeData(Reflect.get(element, 'children'));
            }
          }
        } catch (error) {
          //
        }
      };

      function handleSearch(searchValue: string) {
        if (searchValue !== searchState.searchText) searchState.searchText = searchValue;
        emit('update:searchValue', searchValue);
        if (!searchValue) {
          searchState.startSearch = false;
          return;
        }
        const { filterFn, checkable, expandOnSearch, checkOnSearch, selectedOnSearch } =
          unref(props);
        searchState.startSearch = true;
        const { title: titleField, key: keyField } = unref(getFieldNames);

        const matchedKeys: string[] = [];
        searchState.searchData = filter(
          unref(treeDataRef),
          (node) => {
            const result = filterFn
              ? filterFn(searchValue, node, unref(getFieldNames))
              : node[titleField]?.includes(searchValue) ?? false;
            if (result) {
              matchedKeys.push(node[keyField]);
            }
            return result;
          },
          unref(getFieldNames),
        );

        if (expandOnSearch) {
          const expandKeys = treeToList(searchState.searchData).map((val) => {
            return val[keyField];
          });
          if (expandKeys && expandKeys.length) {
            setExpandedKeys(expandKeys);
          }
        }

        if (checkOnSearch && checkable && matchedKeys.length) {
          setCheckedKeys(matchedKeys);
        }

        if (selectedOnSearch && matchedKeys.length) {
          setSelectedKeys(matchedKeys);
        }
      }

      function handleClickNode(key: string, children: TreeItem[]) {
        if (!props.clickRowToExpand || !children || children.length === 0) return;
        if (!state.expandedKeys.includes(key)) {
          setExpandedKeys([...state.expandedKeys, key]);
        } else {
          const keys = [...state.expandedKeys];
          const index = keys.findIndex((item) => item === key);
          if (index !== -1) {
            keys.splice(index, 1);
          }
          setExpandedKeys(keys);
        }
      }

      watchEffect(() => {
        treeDataRef.value = props.treeData as TreeItem[];
      });

      onMounted(() => {
        const level = parseInt(props.defaultExpandLevel);
        if (level > 0) {
          state.expandedKeys = filterByLevel(level);
        } else if (props.defaultExpandAll) {
          expandAll(true);
        }
        setTimeout(() => {
          handleBadge();
        }, 100);
      });

      watchEffect(() => {
        state.expandedKeys = props.expandedKeys;
      });

      watchEffect(() => {
        state.selectedKeys = props.selectedKeys;
      });

      watchEffect(() => {
        state.checkedKeys = props.checkedKeys;
      });

      watch(
        () => props.value,
        () => {
          state.checkedKeys = toRaw(props.value || []);
        },
        { immediate: true },
      );

      watch(
        () => state.checkedKeys,
        () => {
          const v = toRaw(state.checkedKeys);
          emit('update:value', v);
          emit('change', v);
        },
      );

      watchEffect(() => {
        state.checkStrictly = props.checkStrictly;
      });

      const instance: TreeActionType = {
        setExpandedKeys,
        getExpandedKeys,
        setSelectedKeys,
        getSelectedKeys,
        setCheckedKeys,
        getCheckedKeys,
        insertNodeByKey,
        insertNodesByKey,
        deleteNodeByKey,
        updateNodeByKey,
        getSelectedNode,
        checkAll,
        expandAll,
        filterByLevel: (level: number) => {
          state.expandedKeys = filterByLevel(level);
        },
        setSearchValue: (value: string) => {
          handleSearch(value);
        },
        getSearchValue: () => {
          return searchState.searchText;
        },
      };

      function renderAction(node: TreeItem) {
        const { actionList } = props;
        if (!actionList || actionList.length === 0) return;
        return actionList.map((item, index) => {
          let nodeShow = true;
          if (isFunction(item.show)) {
            nodeShow = item.show?.(node);
          } else if (isBoolean(item.show)) {
            nodeShow = item.show;
          }

          if (!nodeShow) return null;

          return (
            <span key={index} class={bem('action')}>
              {item.render(node)}
            </span>
          );
        });
      }

      const treeData = computed(() => {
        const data = cloneDeep(getTreeData.value);
        eachTree(data, (item, _parent) => {
          const searchText = searchState.searchText;
          const { highlight } = unref(props);
          const {
            title: titleField,
            key: keyField,
            children: childrenField,
          } = unref(getFieldNames);

          const icon = getIcon(item, item.icon);
          const title = get(item, titleField);

          const searchIdx = searchText ? title.indexOf(searchText) : -1;
          const isHighlight =
            searchState.startSearch && !isEmpty(searchText) && highlight && searchIdx !== -1;
          const highlightStyle = `color: ${isBoolean(highlight) ? '#f50' : highlight}`;

          const titleDom = isHighlight ? (
            <span class={unref(getBindValues)?.blockNode ? `${bem('content')}` : ''}>
              <span>{title.substr(0, searchIdx)}</span>
              <span style={highlightStyle}>{searchText}</span>
              <span>{title.substr(searchIdx + (searchText as string).length)}</span>
            </span>
          ) : (
            title
          );
          item[titleField] = (
            <span
              class={`${bem('title')} pl-2`}
              onClick={handleClickNode.bind(null, item[keyField], item[childrenField])}
            >
              {slots?.title ? (
                getSlot(slots, 'title', item)
              ) : (
                <>
                  {icon && <TreeIcon icon={icon} />}
                  {titleDom}
                  <span class={bem('actions')}>{renderAction(item)}</span>
                </>
              )}
            </span>
          );
          return item;
        });
        return data;
      });

      expose(instance);

      return () => {
        const {
          title,
          helpMessage,
          toolbar,
          search,
          checkable,
          isShowOperationBtns,
          canEdit,
          canAdd,
          canDelete,
        } = props;
        const showTitle = title || toolbar || search || slots.headerTitle || isShowOperationBtns;
        const scrollStyle: CSSProperties = { height: 'calc(100% - 38px)' };
        return (
          <div class={[bem(), 'h-full', attrs.class]}>
            {showTitle && (
              <TreeHeader
                checkable={checkable}
                checkAll={checkAll}
                expandAll={expandAll}
                title={title}
                search={search}
                toolbar={toolbar}
                canAdd={canAdd}
                canEdit={canEdit}
                canDelete={canDelete}
                helpMessage={helpMessage}
                onStrictlyChange={onStrictlyChange}
                onSearch={handleSearch}
                searchText={searchState.searchText}
                isShowOperationBtns={isShowOperationBtns}
              >
                {extendSlots(slots)}
              </TreeHeader>
            )}
            <Spin
              wrapperClassName={unref(props.treeWrapperClassName)}
              spinning={unref(props.loading)}
              tip="加载中..."
            >
              <ScrollContainer style={scrollStyle} v-show={!unref(getNotFound)}>
                <Tree {...unref(getBindValues)} showIcon={false} treeData={treeData.value} />
              </ScrollContainer>
              <Empty
                v-show={unref(getNotFound)}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                class="!mt-4"
              />
            </Spin>
          </div>
        );
      };
    },
  });
</script>
<style lang="less" scoped>
  :deep(.ant-tree-title) {
    .notReadNumCls {
      width: 0.85rem;
      height: 0.85rem;
      border: 1px solid red;
      border-radius: 0.85rem;
      color: red;
      line-height: 0.775rem;
      text-align: center;
      font-size: 0.55rem;
      margin-left: 0.2rem;
      padding: 0 0 0 -0.05rem;
    }
  }
</style>
