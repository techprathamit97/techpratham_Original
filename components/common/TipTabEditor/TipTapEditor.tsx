// components/TipTapEditor.tsx
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { ListItem } from '@tiptap/extension-list-item';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { CodeBlock } from '@tiptap/extension-code-block';

// Custom Image extension with resize functionality
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: element => element.getAttribute('width'),
        renderHTML: attributes => {
          if (!attributes.width) {
            return {};
          }
          return { width: attributes.width };
        },
      },
      height: {
        default: null,
        parseHTML: element => element.getAttribute('height'),
        renderHTML: attributes => {
          if (!attributes.height) {
            return {};
          }
          return { height: attributes.height };
        },
      },
    };
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const container = document.createElement('div');
      container.className = 'image-resizer';
      container.style.cssText = `
        position: relative;
        display: inline-block;
        max-width: 100%;
        margin: 10px 0;
      `;

      const img = document.createElement('img');
      img.src = node.attrs.src;
      img.alt = node.attrs.alt || '';
      img.style.cssText = `
        max-width: 100%;
        height: auto;
        display: block;
        border-radius: 8px;
        cursor: pointer;
      `;

      if (node.attrs.width) {
        img.style.width = node.attrs.width + 'px';
      }

      // Resize handles
      const resizeHandle = document.createElement('div');
      resizeHandle.className = 'resize-handle';
      resizeHandle.style.cssText = `
        position: absolute;
        bottom: 5px;
        right: 5px;
        width: 15px;
        height: 15px;
        background: #3b82f6;
        border: 2px solid white;
        border-radius: 50%;
        cursor: nw-resize;
        display: none;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      `;

      // Show/hide resize handle on hover
      container.addEventListener('mouseenter', () => {
        if (editor.isEditable) {
          resizeHandle.style.display = 'block';
        }
      });

      container.addEventListener('mouseleave', () => {
        resizeHandle.style.display = 'none';
      });

      // Resize functionality
      let isResizing = false;
      let startX: number, startY, startWidth: number, startHeight: number;

      resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = img.offsetWidth;
        startHeight = img.offsetHeight;

        document.addEventListener('mousemove', handleResize);
        document.addEventListener('mouseup', stopResize);
        e.preventDefault();
      });

      const handleResize = (e: any) => {
        if (!isResizing) return;

        const deltaX = e.clientX - startX;
        const newWidth = Math.max(50, Math.min(800, startWidth + deltaX));
        const aspectRatio = startHeight / startWidth;
        const newHeight = newWidth * aspectRatio;

        img.style.width = newWidth + 'px';
        img.style.height = newHeight + 'px';
      };

      const stopResize = () => {
        if (!isResizing) return;
        isResizing = false;

        const newWidth = img.offsetWidth;
        const newHeight = img.offsetHeight;

        // Update the node attributes
        if (typeof getPos === 'function') {
          const pos = getPos();
          if (pos !== undefined) {
            editor.view.dispatch(
              editor.view.state.tr.setNodeMarkup(pos, null, {
                ...node.attrs,
                width: newWidth,
                height: newHeight,
              })
            );
          }
        }

        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', stopResize);
      };

      container.appendChild(img);
      container.appendChild(resizeHandle);

      return {
        dom: container,
        update: (updatedNode) => {
          if (updatedNode.type !== node.type) return false;

          img.src = updatedNode.attrs.src;
          img.alt = updatedNode.attrs.alt || '';

          if (updatedNode.attrs.width) {
            img.style.width = updatedNode.attrs.width + 'px';
          }
          if (updatedNode.attrs.height) {
            img.style.height = updatedNode.attrs.height + 'px';
          }

          node = updatedNode;
          return true;
        },
      };
    };
  },
});

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({ content, onChange }) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We'll use CodeBlock instead
      }),
      TextStyle,
      Color,
      ListItem,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      CustomImage.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'bg-gray-100 rounded-lg p-4 font-mono text-sm',
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4 border border-gray-300 rounded-md',
      },
      // Handle pasted images
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || []);

        for (const item of items) {
          if (item.type.indexOf('image') === 0) {
            event.preventDefault();

            const file = item.getAsFile();
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const src = e.target?.result as string;
                editor?.chain().focus().setImage({
                  src,
                  width: 400, // Default width for pasted images
                }).run();
              };
              reader.readAsDataURL(file);
            }
            return true;
          }
        }
        return false;
      },
    },
  });

  if (!editor) {
    return <div className="border rounded-md p-4 bg-gray-50">Loading editor...</div>;
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({
        src: url,
        width: 400, // Default width for inserted images
      }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  // Image size presets
  const setImageSize = (size: 'small' | 'medium' | 'large' | 'full') => {
    const selection = editor.state.selection;
    const node = editor.state.doc.nodeAt(selection.from);

    if (node && node.type.name === 'image') {
      let width;
      switch (size) {
        case 'small':
          width = 200;
          break;
        case 'medium':
          width = 400;
          break;
        case 'large':
          width = 600;
          break;
        case 'full':
          width = null;
          break;
        default:
          width = 400;
      }

      editor.chain().focus().updateAttributes('image', {
        width: width,
        height: null // Let height auto-adjust
      }).run();
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
        {/* Text Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded text-sm font-medium ${editor.isActive('bold')
            ? 'bg-purple-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
        >
          Bold
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded text-sm font-medium ${editor.isActive('italic')
            ? 'bg-purple-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
        >
          Italic
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-3 py-1 rounded text-sm font-medium ${editor.isActive('underline')
            ? 'bg-purple-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
        >
          Underline
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-3 py-1 rounded text-sm font-medium ${editor.isActive('strike')
            ? 'bg-purple-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
        >
          Strike
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-3 py-1 rounded text-sm font-medium ${editor.isActive('heading', { level: 1 })
            ? 'bg-purple-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
        >
          H1
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 rounded text-sm font-medium ${editor.isActive('heading', { level: 2 })
            ? 'bg-purple-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
        >
          H2
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded text-sm font-medium ${editor.isActive('bulletList')
            ? 'bg-purple-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
        >
          • List
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded text-sm font-medium ${editor.isActive('orderedList')
            ? 'bg-purple-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
        >
          1. List
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Block Elements */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1 rounded text-sm font-medium ${editor.isActive('blockquote')
            ? 'bg-purple-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
        >
          Quote
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`px-3 py-1 rounded text-sm font-medium ${editor.isActive('codeBlock')
            ? 'bg-purple-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
        >
          Code
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Media & Links */}
        <button
          type="button"
          onClick={setLink}
          className={`px-3 py-1 rounded text-sm font-medium ${editor.isActive('link')
            ? 'bg-purple-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
        >
          Link
        </button>

        <button
          type="button"
          onClick={addImage}
          className="px-3 py-1 rounded text-sm font-medium bg-white text-gray-700 hover:bg-gray-100"
        >
          Image
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Image Size Controls */}
        <button
          type="button"
          onClick={() => setImageSize('small')}
          className="px-2 py-1 rounded text-xs font-medium bg-white text-gray-600 hover:bg-gray-100"
          title="Small Image (200px)"
        >
          S
        </button>

        <button
          type="button"
          onClick={() => setImageSize('medium')}
          className="px-2 py-1 rounded text-xs font-medium bg-white text-gray-600 hover:bg-gray-100"
          title="Medium Image (400px)"
        >
          M
        </button>

        <button
          type="button"
          onClick={() => setImageSize('large')}
          className="px-2 py-1 rounded text-xs font-medium bg-white text-gray-600 hover:bg-gray-100"
          title="Large Image (600px)"
        >
          L
        </button>

        <button
          type="button"
          onClick={() => setImageSize('full')}
          className="px-2 py-1 rounded text-xs font-medium bg-white text-gray-600 hover:bg-gray-100"
          title="Full Width"
        >
          XL
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Text Color */}
        <input
          type="color"
          onInput={(e) => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
          value={editor.getAttributes('textStyle').color || '#000000'}
          className="w-8 h-6 rounded border border-gray-300 cursor-pointer"
          title="Text Color"
        />

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Clear Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          className="px-3 py-1 rounded text-sm font-medium bg-white text-gray-700 hover:bg-gray-100"
        >
          Clear
        </button>

        <button
          type="button"
          onClick={() => {
            const { from, to } = editor.state.selection;
            editor.view.dispatch(
              editor.view.state.tr.insertText('\u00A0', from, to)
            );
          }}
          className="px-3 py-1 rounded text-sm font-medium bg-white text-gray-700 hover:bg-gray-100"
          title="Non-breaking Space"
        >
          line break
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Instructions */}
      <div className="p-2 text-xs text-gray-500 bg-gray-50 border-t border-gray-200">
        <p><strong>Image controls:</strong> Paste images directly, use toolbar buttons (S/M/L/XL) to resize selected images, or hover over images and drag the blue resize handle.</p>
      </div>
    </div>
  );
};

export default TipTapEditor;