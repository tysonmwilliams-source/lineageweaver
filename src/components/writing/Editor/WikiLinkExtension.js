/**
 * WikiLinkExtension.js - Custom TipTap Extension for Wiki Links
 *
 * Provides [[wiki-link]] functionality with autocomplete for entity mentions.
 * Based on TipTap's Mention extension but customized for double-bracket syntax.
 */

import { Node, mergeAttributes } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import Suggestion from '@tiptap/suggestion';

/**
 * Plugin key for the wiki-link suggestion
 */
export const WikiLinkPluginKey = new PluginKey('wiki-link');

/**
 * WikiLink Extension
 *
 * Creates inline wiki-links that can be clicked to navigate to entities.
 * Triggered by typing `[[` and closed with `]]`.
 */
export const WikiLink = Node.create({
  name: 'wikiLink',

  group: 'inline',

  inline: true,

  selectable: false,

  atom: true,

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute('data-id'),
        renderHTML: attributes => {
          if (!attributes.id) return {};
          return { 'data-id': attributes.id };
        }
      },
      type: {
        default: null,
        parseHTML: element => element.getAttribute('data-type'),
        renderHTML: attributes => {
          if (!attributes.type) return {};
          return { 'data-type': attributes.type };
        }
      },
      label: {
        default: null,
        parseHTML: element => element.getAttribute('data-label'),
        renderHTML: attributes => {
          if (!attributes.label) return {};
          return { 'data-label': attributes.label };
        }
      }
    };
  },

  parseHTML() {
    return [
      {
        tag: `span[data-wiki-link]`
      }
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(
        { 'data-wiki-link': '', class: 'wiki-link' },
        HTMLAttributes
      ),
      node.attrs.label || ''
    ];
  },

  renderText({ node }) {
    return node.attrs.label || '';
  },

  addKeyboardShortcuts() {
    return {
      Backspace: () =>
        this.editor.commands.command(({ tr, state }) => {
          let isWikiLink = false;
          const { selection } = state;
          const { empty, anchor } = selection;

          if (!empty) {
            return false;
          }

          state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
            if (node.type.name === this.name) {
              isWikiLink = true;
              tr.insertText('', pos, pos + node.nodeSize);
              return false;
            }
          });

          return isWikiLink;
        })
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        pluginKey: WikiLinkPluginKey,
        char: '[[',
        allowSpaces: true,
        allowedPrefixes: null,
        startOfLine: false,

        command: ({ editor, range, props }) => {
          // Replace the trigger + query with the wiki-link node
          editor
            .chain()
            .focus()
            .insertContentAt(range, [
              {
                type: this.name,
                attrs: {
                  id: props.id,
                  type: props.type,
                  label: props.label
                }
              },
              {
                type: 'text',
                text: ' '
              }
            ])
            .run();
        },

        allow: ({ state, range }) => {
          const $from = state.doc.resolve(range.from);
          const type = state.schema.nodes[this.name];
          const allow = !!$from.parent.type.contentMatch.matchType(type);
          return allow;
        },

        ...this.options.suggestion
      })
    ];
  }
});

export default WikiLink;
