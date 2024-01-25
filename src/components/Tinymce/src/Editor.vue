<template>
  <div :class="prefixCls" :style="{ width: containerWidth }" :status-attr="`disabled:${disabled}`">
    <ImgUpload
      :fullscreen="fullscreen"
      @uploading="handleImageUploading"
      @done="handleDone"
      v-if="showImageUpload"
      v-show="editorRef"
      :disabled="disabled"
    />
    <textarea
      :id="tinymceId"
      ref="elRef"
      :style="{ visibility: 'hidden' }"
      v-if="!initOptions.inline"
    ></textarea>
    <slot v-else></slot>
  </div>
</template>

<script lang="ts">
  import type { Editor, RawEditorSettings } from 'tinymce';
  import tinymce from 'tinymce/tinymce';
  import 'tinymce/themes/silver';
  import 'tinymce/icons/default/icons';
  import 'tinymce/plugins/advlist';
  import 'tinymce/plugins/anchor';
  import 'tinymce/plugins/autolink';
  import 'tinymce/plugins/autosave';
  import 'tinymce/plugins/code';
  import 'tinymce/plugins/codesample';
  import 'tinymce/plugins/directionality';
  import 'tinymce/plugins/fullscreen';
  import 'tinymce/plugins/hr';
  import 'tinymce/plugins/insertdatetime';
  import 'tinymce/plugins/link';
  import 'tinymce/plugins/lists';
  import 'tinymce/plugins/media';
  import 'tinymce/plugins/nonbreaking';
  import 'tinymce/plugins/noneditable';
  import 'tinymce/plugins/pagebreak';
  import 'tinymce/plugins/paste';
  import 'tinymce/plugins/preview';
  import 'tinymce/plugins/print';
  import 'tinymce/plugins/save';
  import 'tinymce/plugins/searchreplace';
  import 'tinymce/plugins/spellchecker';
  import 'tinymce/plugins/tabfocus';
  // import 'tinymce/plugins/table';
  import 'tinymce/plugins/template';
  import 'tinymce/plugins/textpattern';
  import 'tinymce/plugins/visualblocks';
  import 'tinymce/plugins/visualchars';
  import 'tinymce/plugins/wordcount';

  import {
    defineComponent,
    computed,
    nextTick,
    ref,
    unref,
    watch,
    onDeactivated,
    onBeforeUnmount,
    PropType,
  } from 'vue';
  import ImgUpload from './ImgUpload.vue';
  import { toolbar, plugins } from './tinymce';
  import { buildShortUUID } from '/@/utils/uuid';
  import { bindHandlers } from './helper';
  import { onMountedOrActivated } from '@vben/hooks';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { isNumber } from '/@/utils/is';
  import { useLocale } from '/@/locales/useLocale';
  import { useAppStore } from '/@/store/modules/app';

  const tinymceProps = {
    options: {
      type: Object as PropType<Partial<RawEditorSettings>>,
      default: () => ({}),
    },
    value: {
      type: String,
    },
    maxChars: {
      type: Number,
      default: 20000,
    },
    toolbar: {
      type: Array as PropType<string[]>,
      default: toolbar,
    },
    plugins: {
      type: Array as PropType<string[]>,
      default: plugins,
    },
    modelValue: {
      type: String,
    },
    height: {
      type: [Number, String] as PropType<string | number>,
      required: false,
      default: 400,
    },
    width: {
      type: [Number, String] as PropType<string | number>,
      required: false,
      default: 'auto',
    },
    showImageUpload: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  };

  export default defineComponent({
    name: 'Tinymce',
    components: { ImgUpload },
    inheritAttrs: false,
    props: tinymceProps,
    emits: ['change', 'update:modelValue', 'inited', 'init-error'],
    setup(props, { emit, attrs }) {
      const editorRef = ref<Editor | null>(null);
      const fullscreen = ref(false);
      const tinymceId = ref<string>(buildShortUUID('tiny-vue'));
      const elRef = ref<HTMLElement | null>(null);

      const { prefixCls } = useDesign('tinymce-container');

      const appStore = useAppStore();

      const tinymceContent = computed(() => props.modelValue);

      const containerWidth = computed(() => {
        const width = props.width;
        if (isNumber(width)) {
          return `${width}px`;
        }
        return width;
      });

      const skinName = computed(() => {
        return appStore.getDarkMode === 'light' ? 'oxide' : 'oxide-dark';
      });

      const langName = computed(() => {
        const lang = useLocale().getLocale.value;
        return ['zh_CN', 'en'].includes(lang) ? lang : 'zh_CN';
      });

      const initOptions = computed((): RawEditorSettings => {
        const { height, options, toolbar, plugins, maxChars, disabled } = props;
        const publicPath = import.meta.env.VITE_PUBLIC_PATH || '/';
        const readOnlyConfig = disabled ? { disabled } : {}; // 原来的设置只读的逻辑
        if (disabled) {
          richTextEditStatus('#' + tinymceId.value + '_ifr', 'false');
        }
        const config = {
          selector: `#${unref(tinymceId)}`,
          height,
          toolbar,
          menubar: '',
          plugins,
          language_url: publicPath + 'resource/tinymce/langs/' + langName.value + '.js',
          language: langName.value,
          branding: false,
          default_link_target: '_blank',
          link_title: false,
          object_resizing: false,
          auto_focus: true,
          max_chars: maxChars || 20000, // 设置最大字符数
          font_formats:
            "微软雅黑='微软雅黑';宋体='宋体';黑体='黑体';仿宋='仿宋';楷体='楷体';隶书='隶书';幼圆='幼圆';Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings",
          skin: skinName.value,
          skin_url: publicPath + 'resource/tinymce/skins/ui/' + skinName.value,
          content_css:
            publicPath + 'resource/tinymce/skins/ui/' + skinName.value + '/content.min.css',
          ...options,
          ...readOnlyConfig,
          setup: (editor: Editor) => {
            editorRef.value = editor;
            editor.on('init', function (e) {
              initSetup(e);
              try {
                e.target.editorCommands.execCommand('fontName', false, '微软雅黑');
              } catch (error) {
                //
              }
            });
            editor.on('KeyDown', function (e) {
              if (e?.code == 'Backspace') {
                return true;
              }
              const initHtmlContent = editor.getContent();
              const tinylen = maxContentLength(initHtmlContent);
              if (tinylen >= maxChars) {
                e.preventDefault();
                e.stopPropagation();
                return false;
              } else {
                return true;
              }
            });
          },
          init_instance_callback: function (editor) {
            editor.settings.max_chars = maxChars; // 设置最大字符数
          },
        } as RawEditorSettings;
        return config;
      });

      const disabled = computed(() => {
        const { options, disabled } = props;
        const getdDisabled = (options && Reflect.get(options, 'readonly')) || disabled;
        const editor = unref(editorRef);
        if (editor) {
          editor.setMode(getdDisabled ? 'readonly' : 'design');
        }
        return getdDisabled ?? false;
      });

      watch(
        () => attrs.disabled,
        () => {
          const editor = unref(editorRef);
          if (!editor) {
            return;
          }
          editor.setMode(attrs.disabled ? 'readonly' : 'design');
          richTextEditStatus('#' + tinymceId.value + '_ifr', attrs.disabled ? 'false' : 'true');
        },
      );

      onMountedOrActivated(() => {
        if (!initOptions.value.inline) {
          tinymceId.value = buildShortUUID('tiny-vue');
        }
        nextTick(() => {
          setTimeout(() => {
            initEditor();
          }, 30);
        });
      });

      onBeforeUnmount(() => {
        destory();
      });

      onDeactivated(() => {
        destory();
      });

      function destory() {
        if (tinymce !== null) {
          tinymce?.remove?.(unref(initOptions).selector!);
        }
      }

      function initEditor() {
        const el = unref(elRef);
        if (el) {
          el.style.visibility = '';
        }
        tinymce
          .init(unref(initOptions))
          .then((editor) => {
            emit('inited', editor);
          })
          .catch((err) => {
            emit('init-error', err);
          });
      }

      function initSetup(e) {
        const editor = unref(editorRef);
        if (!editor) {
          return;
        }
        const value = props.modelValue || '';

        editor.setContent(value);
        bindModelHandlers(editor);
        bindHandlers(e, attrs, unref(editorRef));
      }

      function setValue(editor: Record<string, any>, val: string, prevVal?: string) {
        if (
          editor &&
          typeof val === 'string' &&
          val !== prevVal &&
          val !== editor.getContent({ format: attrs.outputFormat })
        ) {
          editor.setContent(val);
        }
      }

      // 获取纯文本内容
      function getPlainTextContent(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
      }

      function maxContentLength(html) {
        let totalLength = 0;
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        for (const child of doc.body.childNodes) {
          try {
            if (typeof child.outerHTML == 'undefined' || child.outerHTML == null) {
              continue;
            }
            const childHtml = getPlainTextContent(child.outerHTML);
            totalLength += childHtml.length;
          } catch (error) {
            //
          }
        }
        return totalLength;
      }

      // 截取 HTML 内容，保留标签结构
      function truncateHtml(html, maxLength) {
        let totalLength = 0;
        let truncatedContent = '';
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const childNodes = Array.from(doc.body.childNodes);

        for (let i = 0; i < childNodes.length; i++) {
          const child = childNodes[i];
          try {
            if (typeof child.outerHTML === 'undefined' || child.outerHTML === null) {
              continue;
            }

            const childHtml = getPlainTextContent(child.outerHTML);
            totalLength += childHtml.length;

            if (totalLength <= maxLength) {
              truncatedContent += child.outerHTML;
            } else {
              const remainingLength = maxLength - (totalLength - childHtml.length);

              // 截取开始标签和结束标签
              const startTag = child.outerHTML.match(/^<[^>]+>/)[0];
              const endTag = child.outerHTML.match(/<\/[^>]+>$/)[0];

              truncatedContent += `${startTag}${childHtml.slice(0, remainingLength)}${endTag}`;
              break;
            }
          } catch (error) {
            // 处理异常
          }
        }

        return truncatedContent;
      }

      function bindModelHandlers(editor: any) {
        const modelEvents = attrs.modelEvents ? attrs.modelEvents : null;
        const normalizedEvents = Array.isArray(modelEvents) ? modelEvents.join(' ') : modelEvents;

        watch(
          () => props.modelValue,
          (val: string, prevVal: string) => {
            if (val !== prevVal) {
              const initHtmlContent = editor.getContent();
              // 如果初始化时的字符数超过最大字符数，进行截取
              if (maxContentLength(initHtmlContent) > props.maxChars) {
                const truncatedHtmlContent = truncateHtml(initHtmlContent, props.maxChars);
                editor.setContent(truncatedHtmlContent);
              } else {
                setValue(editor, val, prevVal);
              }
            }
          },
        );

        watch(
          () => props.value,
          (val: string, prevVal: string) => {
            setValue(editor, val, prevVal);
          },
          {
            immediate: true,
          },
        );

        editor.on(normalizedEvents ? normalizedEvents : 'change keyup undo redo', () => {
          const content = editor.getContent({ format: attrs.outputFormat });
          emit('update:modelValue', content);
          emit('change', content);
        });

        editor.on('FullscreenStateChanged', (e) => {
          fullscreen.value = e.state;
        });
      }

      function handleImageUploading(name: string) {
        const editor = unref(editorRef);
        if (!editor) {
          return;
        }
        editor.execCommand('mceInsertContent', false, getUploadingImgName(name));
        const content = editor?.getContent() ?? '';
        setValue(editor, content);
      }

      function handleDone(name: string, url: string) {
        const editor = unref(editorRef);
        if (!editor) {
          return;
        }
        const content = editor?.getContent() ?? '';
        const val = content?.replace(getUploadingImgName(name), `<img src="${url}"/>`) ?? '';
        setValue(editor, val);
      }

      function getUploadingImgName(name: string) {
        return `[uploading:${name}]`;
      }

      const richTextEditStatus = (selector, status = 'true', count = 10) => {
        // 到达最大递归次数
        if (count <= 0) {
          return;
        }
        // 获取iframe元素
        const iframes = document.querySelectorAll(selector);
        // 如果iframes存在多个，则进行遍历
        if (iframes && iframes.length > 0) {
          // 设置所有的iframe框为不可编辑
          iframes.forEach((iframe) => {
            // 获取iframe内部的body元素
            const iframeBody = iframe.contentDocument.body;
            // 设置状态
            iframeBody.setAttribute('contenteditable', status);
          });
        } else {
          setTimeout(() => {
            richTextEditStatus(selector, status, --count);
          }, 500);
        }
      };

      return {
        prefixCls,
        containerWidth,
        initOptions,
        tinymceContent,
        elRef,
        tinymceId,
        handleImageUploading,
        handleDone,
        editorRef,
        fullscreen,
        disabled,
        richTextEditStatus,
      };
    },
  });
</script>

<style lang="less" scoped>
  .vben-tinymce-container {
    :deep(.tox .tox-statusbar) {
      display: flex;
      position: relative;
      flex: 0 0 auto;
      align-items: center;
      height: 0;
      overflow: hidden;
      border-top: 0 solid #ccc;
      color: #fff;
      text-transform: uppercase;
    }
  }
</style>
<style lang="less">
  @prefix-cls: ~'@{namespace}-tinymce-container';
  .@{prefix-cls} {
    position: relative;
    line-height: normal;

    textarea {
      visibility: hidden;
      z-index: -1;
    }

    &[status-attr='disabled:true'] {
      .tox-toolbar-overlord {
        display: none;
      }
    }
  }
</style>
