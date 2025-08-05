/**
 * Quill Editor 관련 타입 정의
 * Type definitions for Quill Editor integration
 */

export interface QuillDelta {
  ops: QuillOperation[]
}

export interface QuillOperation {
  insert?: string | Record<string, any>
  delete?: number
  retain?: number
  attributes?: QuillAttributes
}

export interface QuillAttributes {
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strike?: boolean
  code?: boolean
  link?: string
  color?: string
  background?: string
  header?: 1 | 2 | 3 | 4 | false
  blockquote?: boolean
  'code-block'?: boolean
  list?: 'ordered' | 'bullet'
  indent?: number
  align?: 'left' | 'center' | 'right' | 'justify'
  size?: string
  font?: string
  [key: string]: any // For additional attributes
}

export interface QuillEditor {
  getContents(): QuillDelta
  setContents(delta: QuillDelta): void
  getText(): string
  getLength(): number
  getSelection(): QuillRange | null
  setSelection(range: QuillRange): void
  focus(): void
  blur(): void
  insertEmbed(index: number, type: string, value: any): void
  updateContents(delta: QuillDelta): void
  formatText(index: number, length: number, attributes: QuillAttributes): void
  deleteText(index: number, length: number): void
  insertText(index: number, text: string, attributes?: QuillAttributes): void
}

export interface QuillRange {
  index: number
  length: number
}

export type QuillSource = 'api' | 'user' | 'silent'

export interface QuillChangeHandler {
  (content: QuillDelta, delta: QuillDelta, source: QuillSource, editor: QuillEditor): void
}

// For backwards compatibility with existing code
export type QuillContent = QuillDelta