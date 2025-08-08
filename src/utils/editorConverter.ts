/**
 * Quill Delta to Tiptap JSON converter
 * Handles migration from existing Quill content to Tiptap format
 */

interface QuillDelta {
  ops: Array<{
    insert?: string | object
    attributes?: Record<string, any>
    retain?: number
    delete?: number
  }>
}

interface TiptapNode {
  type: string
  content?: TiptapNode[]
  text?: string
  marks?: Array<{
    type: string
    attrs?: Record<string, any>
  }>
  attrs?: Record<string, any>
}

interface TiptapDocument {
  type: 'doc'
  content: TiptapNode[]
}

/**
 * Convert Quill Delta format to Tiptap JSON format
 */
export function convertQuillDeltaToTiptap(delta: QuillDelta | string): TiptapDocument {
  // Handle string input (JSON stringified delta)
  let parsedDelta: QuillDelta
  
  if (typeof delta === 'string') {
    try {
      parsedDelta = JSON.parse(delta)
    } catch (error) {
      console.warn('Failed to parse delta string, creating empty document:', error)
      return createEmptyTiptapDocument()
    }
  } else {
    parsedDelta = delta
  }

  if (!parsedDelta || !parsedDelta.ops || !Array.isArray(parsedDelta.ops)) {
    return createEmptyTiptapDocument()
  }

  const tiptapContent: TiptapNode[] = []
  let currentParagraph: TiptapNode = createEmptyParagraph()

  for (const op of parsedDelta.ops) {
    if (typeof op.insert === 'string') {
      // Handle text content
      const text = op.insert
      const lines = text.split('\n')
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        
        if (line) {
          // Create text node with marks
          const textNode: TiptapNode = {
            type: 'text',
            text: line
          }

          // Apply formatting marks
          if (op.attributes) {
            textNode.marks = convertQuillAttributesToTiptapMarks(op.attributes)
          }

          currentParagraph.content!.push(textNode)
        }

        // Handle line breaks (except for the last line)
        if (i < lines.length - 1) {
          // Finish current paragraph and start a new one
          if (currentParagraph.content!.length > 0 || tiptapContent.length === 0) {
            tiptapContent.push(currentParagraph)
          }
          
          // Check for block-level attributes
          if (op.attributes) {
            currentParagraph = convertQuillBlockAttributes(op.attributes)
          } else {
            currentParagraph = createEmptyParagraph()
          }
        }
      }
    } else if (typeof op.insert === 'object') {
      // Handle embeds (images, videos, etc.)
      // For now, skip embeds as they need special handling
      console.warn('Embed content detected but not yet supported:', op.insert)
    }
  }

  // Add the last paragraph if it has content
  if (currentParagraph.content!.length > 0) {
    tiptapContent.push(currentParagraph)
  }

  // Ensure we have at least one paragraph
  if (tiptapContent.length === 0) {
    tiptapContent.push(createEmptyParagraph())
  }

  return {
    type: 'doc',
    content: tiptapContent
  }
}

/**
 * Convert Quill text attributes to Tiptap marks
 */
function convertQuillAttributesToTiptapMarks(attributes: Record<string, any>): Array<{
  type: string
  attrs?: Record<string, any>
}> {
  const marks: Array<{ type: string; attrs?: Record<string, any> }> = []

  // Bold
  if (attributes.bold) {
    marks.push({ type: 'bold' })
  }

  // Italic
  if (attributes.italic) {
    marks.push({ type: 'italic' })
  }

  // Underline
  if (attributes.underline) {
    marks.push({ type: 'underline' })
  }

  // Strike
  if (attributes.strike) {
    marks.push({ type: 'strike' })
  }

  // Code
  if (attributes.code) {
    marks.push({ type: 'code' })
  }

  // Color
  if (attributes.color) {
    marks.push({
      type: 'textStyle',
      attrs: { color: attributes.color }
    })
  }

  // Background color (not directly supported in Tiptap, convert to color)
  if (attributes.background && !attributes.color) {
    marks.push({
      type: 'textStyle',
      attrs: { color: attributes.background }
    })
  }

  // Link
  if (attributes.link) {
    marks.push({
      type: 'link',
      attrs: { 
        href: attributes.link,
        target: '_blank',
        rel: 'noopener noreferrer nofollow'
      }
    })
  }

  return marks
}

/**
 * Convert Quill block-level attributes to Tiptap nodes
 */
function convertQuillBlockAttributes(attributes: Record<string, any>): TiptapNode {
  // Header levels
  if (attributes.header) {
    const level = Math.min(Math.max(parseInt(attributes.header), 1), 6)
    return {
      type: 'heading',
      attrs: { level },
      content: []
    }
  }

  // Blockquote
  if (attributes.blockquote) {
    return {
      type: 'blockquote',
      content: [{
        type: 'paragraph',
        content: []
      }]
    }
  }

  // Code block
  if (attributes['code-block']) {
    return {
      type: 'codeBlock',
      content: []
    }
  }

  // Lists
  if (attributes.list === 'ordered') {
    return {
      type: 'orderedList',
      content: [{
        type: 'listItem',
        content: [{
          type: 'paragraph',
          content: []
        }]
      }]
    }
  }

  if (attributes.list === 'bullet') {
    return {
      type: 'bulletList',
      content: [{
        type: 'listItem',
        content: [{
          type: 'paragraph',
          content: []
        }]
      }]
    }
  }

  // Text alignment
  const paragraph = createEmptyParagraph()
  if (attributes.align) {
    paragraph.attrs = { textAlign: attributes.align }
  }

  return paragraph
}

/**
 * Create an empty paragraph node
 */
function createEmptyParagraph(): TiptapNode {
  return {
    type: 'paragraph',
    content: []
  }
}

/**
 * Create an empty Tiptap document
 */
function createEmptyTiptapDocument(): TiptapDocument {
  return {
    type: 'doc',
    content: [createEmptyParagraph()]
  }
}

/**
 * Convert Tiptap JSON to HTML for storage/display
 */
export function convertTiptapToHTML(tiptapContent: TiptapDocument): string {
  // This is a simplified converter - in practice, you'd use Tiptap's generateHTML
  // For now, return a basic HTML representation
  
  function nodeToHTML(node: TiptapNode): string {
    switch (node.type) {
      case 'doc':
        return node.content?.map(nodeToHTML).join('') || ''
      
      case 'paragraph':
        const pContent = node.content?.map(nodeToHTML).join('') || ''
        const align = node.attrs?.textAlign ? ` style="text-align: ${node.attrs.textAlign}"` : ''
        return `<p${align}>${pContent}</p>`
      
      case 'heading':
        const level = node.attrs?.level || 1
        const hContent = node.content?.map(nodeToHTML).join('') || ''
        return `<h${level}>${hContent}</h${level}>`
      
      case 'text':
        let text = node.text || ''
        if (node.marks) {
          for (const mark of node.marks) {
            switch (mark.type) {
              case 'bold':
                text = `<strong>${text}</strong>`
                break
              case 'italic':
                text = `<em>${text}</em>`
                break
              case 'underline':
                text = `<u>${text}</u>`
                break
              case 'strike':
                text = `<s>${text}</s>`
                break
              case 'code':
                text = `<code>${text}</code>`
                break
              case 'link':
                const href = mark.attrs?.href || '#'
                text = `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`
                break
            }
          }
        }
        return text
      
      case 'bulletList':
        const ulContent = node.content?.map(nodeToHTML).join('') || ''
        return `<ul>${ulContent}</ul>`
      
      case 'orderedList':
        const olContent = node.content?.map(nodeToHTML).join('') || ''
        return `<ol>${olContent}</ol>`
      
      case 'listItem':
        const liContent = node.content?.map(nodeToHTML).join('') || ''
        return `<li>${liContent}</li>`
      
      case 'blockquote':
        const blockContent = node.content?.map(nodeToHTML).join('') || ''
        return `<blockquote>${blockContent}</blockquote>`
      
      case 'codeBlock':
        const codeContent = node.content?.map(n => n.text || '').join('') || ''
        return `<pre><code>${codeContent}</code></pre>`
      
      default:
        return node.content?.map(nodeToHTML).join('') || ''
    }
  }

  return nodeToHTML(tiptapContent)
}

/**
 * Extract plain text from Tiptap JSON for search/preview
 */
export function extractPlainTextFromTiptap(tiptapContent: TiptapDocument): string {
  function nodeToText(node: TiptapNode): string {
    switch (node.type) {
      case 'text':
        return node.text || ''
      case 'doc':
      case 'paragraph':
      case 'heading':
      case 'bulletList':
      case 'orderedList':
      case 'listItem':
      case 'blockquote':
      case 'codeBlock':
        return node.content?.map(nodeToText).join('') || ''
      default:
        return ''
    }
  }

  return nodeToText(tiptapContent)
    .replace(/\s+/g, ' ')
    .trim()
}