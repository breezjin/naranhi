'use client'

import { cn } from '@/lib/utils'
import SafeImage from './SafeImage'

// TipTap JSON content types
interface TipTapNode {
  type: string
  attrs?: Record<string, any>
  content?: TipTapNode[]
  text?: string
  marks?: Array<{ type: string; attrs?: Record<string, any> }>
}

interface TipTapDocument {
  type: 'doc'
  content: TipTapNode[]
}

interface NoticeContentRendererProps {
  content: string | TipTapDocument | null
  className?: string
}

export default function NoticeContentRenderer({ 
  content, 
  className = '' 
}: NoticeContentRendererProps) {
  if (!content) {
    return <div className={className}></div>
  }

  // Parse content if it's a string
  let parsedContent: TipTapDocument | null = null
  
  if (typeof content === 'string') {
    try {
      parsedContent = JSON.parse(content) as TipTapDocument
    } catch (error) {
      // If parsing fails, treat as plain HTML
      return (
        <div 
          className={cn(
            'prose prose-gray dark:prose-invert max-w-none',
            'prose-headings:text-naranhiYellow dark:prose-headings:text-naranhiGreen',
            'prose-a:text-primary hover:prose-a:text-primary/80',
            'prose-img:rounded-lg prose-img:shadow-md',
            className
          )}
          dangerouslySetInnerHTML={{ __html: content }}
          suppressHydrationWarning
        />
      )
    }
  } else {
    parsedContent = content
  }

  if (!parsedContent || parsedContent.type !== 'doc' || !parsedContent.content) {
    return <div className={className}></div>
  }

  // Remove unwanted and duplicate images 
  const filterUnwantedImages = (nodes: TipTapNode[]): TipTapNode[] => {
    const seenImageSrcs = new Set<string>()
    
    const processNodes = (nodeArray: TipTapNode[]): TipTapNode[] => {
      return nodeArray.filter((node) => {
        if (node.type === 'image') {
          const src = node.attrs?.src
          const alt = node.attrs?.alt
          const title = node.attrs?.title
          
          if (!src || typeof src !== 'string') {
            return false // Remove invalid images
          }
          
          // Remove images with unwanted alt text (auto-generated placeholders)
          if (alt && typeof alt === 'string') {
            const altLower = alt.toLowerCase()
            if (altLower.includes('공지사항 이미지') && /\d/.test(altLower)) {
              return false // Remove auto-generated "공지사항 이미지 2" etc.
            }
          }
          
          // Remove duplicate images based on src URL
          if (seenImageSrcs.has(src)) {
            return false // Remove duplicate image
          }
          
          seenImageSrcs.add(src)
          return true // Keep first occurrence of valid images
        }
        
        // Recursively process child nodes
        if (node.content && node.content.length > 0) {
          node.content = processNodes(node.content)
        }
        
        return true // Keep non-image nodes
      })
    }
    
    return processNodes(nodes)
  }

  // Apply unwanted image filtering
  parsedContent.content = filterUnwantedImages(parsedContent.content)

  const renderNode = (node: TipTapNode, index: number): React.ReactNode => {
    switch (node.type) {
      case 'paragraph':
        if (!node.content || node.content.length === 0) {
          return <div key={index} className="h-4" suppressHydrationWarning />
        }
        
        // 모든 paragraph를 div로 렌더링하여 DOM nesting 문제 예방
        return (
          <div key={index} className="mb-4 leading-relaxed" suppressHydrationWarning>
            {node.content.map((child, childIndex) => renderNode(child, childIndex))}
          </div>
        )

      case 'text':
        let textElement: React.ReactNode = node.text || ''
        
        // Apply marks (formatting)
        if (node.marks) {
          node.marks.forEach((mark) => {
            switch (mark.type) {
              case 'bold':
                textElement = <strong key={`bold-${index}`} suppressHydrationWarning>{textElement}</strong>
                break
              case 'italic':
                textElement = <em key={`italic-${index}`} suppressHydrationWarning>{textElement}</em>
                break
              case 'link':
                textElement = (
                  <a 
                    key={`link-${index}`}
                    href={mark.attrs?.href} 
                    target={mark.attrs?.target}
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-primary/80"
                    suppressHydrationWarning
                  >
                    {textElement}
                  </a>
                )
                break
              case 'code':
                textElement = (
                  <code key={`code-${index}`} className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm" suppressHydrationWarning>
                    {textElement}
                  </code>
                )
                break
            }
          })
        }
        
        return textElement

      case 'heading':
        const level = node.attrs?.level || 1
        const HeadingTag = `h${Math.min(level + 1, 6)}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
        
        return (
          <HeadingTag 
            key={index}
            className={cn(
              'font-bold leading-tight mb-4 mt-6',
              'text-naranhiYellow dark:text-naranhiGreen',
              {
                'text-2xl': level === 1,
                'text-xl': level === 2,
                'text-lg': level === 3,
                'text-base': level >= 4,
              }
            )}
            suppressHydrationWarning
          >
            {node.content?.map((child, childIndex) => renderNode(child, childIndex))}
          </HeadingTag>
        )

      case 'bulletList':
        return (
          <ul key={index} className="mb-4 ml-4 list-inside list-disc space-y-2" suppressHydrationWarning>
            {node.content?.map((child, childIndex) => renderNode(child, childIndex))}
          </ul>
        )

      case 'orderedList':
        return (
          <ol key={index} className="mb-4 ml-4 list-inside list-decimal space-y-2" suppressHydrationWarning>
            {node.content?.map((child, childIndex) => renderNode(child, childIndex))}
          </ol>
        )

      case 'listItem':
        return (
          <li key={index} className="leading-relaxed" suppressHydrationWarning>
            <div suppressHydrationWarning>
              {node.content?.map((child, childIndex) => {
                // 모든 listItem 콘텐츠를 div로 래핑
                if (child.type === 'paragraph') {
                  return (
                    <span key={childIndex} suppressHydrationWarning>
                      {child.content?.map((grandChild, grandChildIndex) => 
                        renderNode(grandChild, grandChildIndex)
                      )}
                    </span>
                  )
                }
                return renderNode(child, childIndex)
              })}
            </div>
          </li>
        )

      case 'blockquote':
        return (
          <div key={index} className="my-4 rounded-r-lg border-l-4 border-primary bg-muted/30 py-2 pl-4" suppressHydrationWarning>
            {node.content?.map((child, childIndex) => {
              // blockquote를 div로 대체하여 안전한 렌더링
              return (
                <div key={childIndex} className="mb-2" suppressHydrationWarning>
                  {child.type === 'paragraph' ? (
                    child.content?.map((grandChild, grandChildIndex) => 
                      renderNode(grandChild, grandChildIndex)
                    )
                  ) : (
                    renderNode(child, childIndex)
                  )}
                </div>
              )
            })}
          </div>
        )

      case 'codeBlock':
        return (
          <pre key={index} className="my-4 overflow-x-auto rounded-lg bg-muted p-4" suppressHydrationWarning>
            <code className="font-mono text-sm" suppressHydrationWarning>
              {node.content?.map((child, childIndex) => renderNode(child, childIndex))}
            </code>
          </pre>
        )

      case 'image':
        const { src, alt, title, width, height } = node.attrs || {}
        
        if (!src || typeof src !== 'string' || src.trim().length === 0) {
          return null
        }

        return (
          <div key={`img-${index}`} className="my-8" suppressHydrationWarning>
            <div className="relative overflow-hidden rounded-lg bg-muted shadow-md">
              <SafeImage
                src={src}
                alt={alt || title || '공지사항 이미지'}
                title={title}
                loading="lazy"
              />
            </div>
          </div>
        )

      case 'hardBreak':
        return <br key={index} suppressHydrationWarning />

      case 'horizontalRule':
        return <hr key={index} className="my-6 border-muted" suppressHydrationWarning />

      case 'table':
        return (
          <div key={index} className="my-6 overflow-x-auto" suppressHydrationWarning>
            <table className="min-w-full border-collapse rounded-lg border border-muted">
              <tbody suppressHydrationWarning>
                {node.content?.map((child, childIndex) => renderNode(child, childIndex))}
              </tbody>
            </table>
          </div>
        )

      case 'tableRow':
        return (
          <tr key={index} className="border-b border-muted" suppressHydrationWarning>
            {node.content?.map((child, childIndex) => renderNode(child, childIndex))}
          </tr>
        )

      case 'tableCell':
        return (
          <td 
            key={index} 
            className="border border-muted px-4 py-2 text-sm" 
            suppressHydrationWarning
          >
            {node.content?.map((child, childIndex) => 
              child.type === 'paragraph' ? (
                <div key={childIndex} suppressHydrationWarning>
                  {child.content?.map((grandChild, grandChildIndex) => 
                    renderNode(grandChild, grandChildIndex)
                  )}
                </div>
              ) : renderNode(child, childIndex)
            )}
          </td>
        )

      case 'tableHeader':
        return (
          <th 
            key={index} 
            className={cn(
              'border border-muted px-4 py-3 text-sm font-semibold',
              'bg-muted/50 text-foreground'
            )}
            suppressHydrationWarning
          >
            {node.content?.map((child, childIndex) => 
              child.type === 'paragraph' ? (
                <div key={childIndex} suppressHydrationWarning>
                  {child.content?.map((grandChild, grandChildIndex) => 
                    renderNode(grandChild, grandChildIndex)
                  )}
                </div>
              ) : renderNode(child, childIndex)
            )}
          </th>
        )

      default:
        // For unknown nodes, try to render their content if they have any
        if (node.content) {
          return (
            <div key={index} className="my-2" suppressHydrationWarning>
              {node.content.map((child, childIndex) => 
                child.type === 'paragraph' ? (
                  <div key={childIndex} className="mb-2" suppressHydrationWarning>
                    {child.content?.map((grandChild, grandChildIndex) => 
                      renderNode(grandChild, grandChildIndex)
                    )}
                  </div>
                ) : renderNode(child, childIndex)
              )}
            </div>
          )
        }
        return null
    }
  }

  return (
    <div 
      className={cn(
        // 기본 prose 스타일링에서 여백 최소화
        'prose prose-gray dark:prose-invert max-w-none',
        'prose-headings:text-naranhiYellow dark:prose-headings:text-naranhiGreen',
        'prose-a:text-primary hover:prose-a:text-primary/80',
        // 컨텐츠 간격 최적화
        'prose-p:my-3 prose-headings:my-4',
        'prose-ul:my-3 prose-ol:my-3',
        'prose-li:my-1',
        // 이미지 여백 최소화
        'prose-img:my-4',
        // 전체 너비 활용
        'w-full',
        className
      )}
      suppressHydrationWarning
    >
      {parsedContent.content.map((node, index) => renderNode(node, index))}
    </div>
  )
}