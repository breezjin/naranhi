import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { logError } from '@/utils/logger'

// Enhanced plain text extraction with Korean text optimization
function extractPlainTextFromDelta(delta: any): string {
  if (!delta || !delta.ops) return ''
  
  let text = ''
  
  for (const op of delta.ops) {
    if (typeof op.insert === 'string') {
      text += op.insert
    } else if (op.insert?.image) {
      text += '[이미지] '
    } else if (op.insert?.video) {
      text += '[동영상] '
    } else if (op.insert?.table) {
      text += '[표] '
    } else if (op.insert?.formula) {
      text += '[수식] '
    }
  }
  
  // Enhanced Korean text processing
  return text
    .replace(/\n+/g, ' ')  // Multiple newlines to single space
    .replace(/\s+/g, ' ')  // Multiple spaces to single space
    // Korean punctuation normalization
    .replace(/[，]/g, ',')  // Full-width comma to regular comma
    .replace(/[。]/g, '.')  // Full-width period to regular period
    .replace(/[（]/g, '(')  // Full-width parentheses
    .replace(/[）]/g, ')')
    .replace(/[「]/g, '"')  // Korean quotation marks
    .replace(/[」]/g, '"')
    // Remove excessive spacing around Korean text
    .replace(/\s+([가-힣])/g, ' $1')  // Single space before Korean
    .replace(/([가-힣])\s+/g, '$1 ')  // Single space after Korean
    .trim()
    .substring(0, 500)  // Limit to 500 characters for search/preview
}

// Enhanced Delta to HTML converter with full formatting support
function convertDeltaToHTML(delta: any): string {
  if (!delta || !delta.ops) return ''
  
  let html = ''
  let currentElements: string[] = []
  const listStack: Array<{type: string, level: number}> = []
  
  for (let i = 0; i < delta.ops.length; i++) {
    const op = delta.ops[i]
    
    if (typeof op.insert === 'string') {
      let text = op.insert
      
      // Apply inline formatting
      if (op.attributes) {
        if (op.attributes.bold) text = `<strong>${text}</strong>`
        if (op.attributes.italic) text = `<em>${text}</em>`
        if (op.attributes.underline) text = `<u>${text}</u>`
        if (op.attributes.strike) text = `<s>${text}</s>`
        if (op.attributes.code) text = `<code>${text}</code>`
        if (op.attributes.link) text = `<a href="${op.attributes.link}" target="_blank" rel="noopener noreferrer">${text}</a>`
        if (op.attributes.color) text = `<span style="color: ${op.attributes.color}">${text}</span>`
        if (op.attributes.background) text = `<span style="background-color: ${op.attributes.background}">${text}</span>`
      }
      
      // Handle line breaks and block formatting
      if (text.includes('\n')) {
        const lines = text.split('\n')
        
        // Add current text before newline
        if (lines[0]) {
          currentElements.push(lines[0])
        }
        
        // Process each newline as a potential block element
        for (let j = 1; j < lines.length; j++) {
          const nextOp = i < delta.ops.length - 1 ? delta.ops[i + 1] : null
          const blockAttrs = nextOp?.attributes || {}
          
          // Close any open lists if needed
          if (!blockAttrs.list && listStack.length > 0) {
            while (listStack.length > 0) {
              const listType = listStack.pop()
              html += listType?.type === 'ordered' ? '</ol>' : '</ul>'
            }
          }
          
          const currentContent = currentElements.join('')
          
          if (blockAttrs.header) {
            html += `<h${blockAttrs.header}>${currentContent}</h${blockAttrs.header}>`
          } else if (blockAttrs.blockquote) {
            html += `<blockquote><p>${currentContent}</p></blockquote>`
          } else if (blockAttrs['code-block']) {
            html += `<pre><code>${currentContent}</code></pre>`
          } else if (blockAttrs.list) {
            const listType = blockAttrs.list
            const listLevel = blockAttrs.indent || 0
            
            // Handle nested lists
            while (listStack.length > listLevel + 1) {
              const closingList = listStack.pop()
              html += closingList?.type === 'ordered' ? '</ol>' : '</ul>'
            }
            
            if (listStack.length === 0 || listStack[listStack.length - 1].type !== listType) {
              if (listStack.length > 0) {
                const closingList = listStack.pop()
                html += closingList?.type === 'ordered' ? '</ol>' : '</ul>'
              }
              html += listType === 'ordered' ? '<ol>' : '<ul>'
              listStack.push({type: listType, level: listLevel})
            }
            
            html += `<li>${currentContent}</li>`
          } else {
            // Regular paragraph
            if (currentContent.trim()) {
              const alignStyle = blockAttrs.align ? ` style="text-align: ${blockAttrs.align}"` : ''
              html += `<p${alignStyle}>${currentContent}</p>`
            }
          }
          
          currentElements = []
          
          // Add remaining text after newline
          if (j < lines.length - 1 || lines[j]) {
            currentElements = [lines[j]]
          }
        }
      } else {
        currentElements.push(text)
      }
    } else if (op.insert.image) {
      const imageHtml = `<img src="${op.insert.image}" alt="" style="max-width: 100%; height: auto;" />`
      currentElements.push(imageHtml)
    } else if (op.insert.video) {
      const videoHtml = `<iframe src="${op.insert.video}" frameborder="0" allowfullscreen style="max-width: 100%; height: 315px;"></iframe>`
      currentElements.push(videoHtml)
    }
  }
  
  // Close any remaining lists
  while (listStack.length > 0) {
    const listType = listStack.pop()
    html += listType?.type === 'ordered' ? '</ol>' : '</ul>'
  }
  
  // Add final content
  const finalContent = currentElements.join('')
  if (finalContent.trim()) {
    html += `<p>${finalContent}</p>`
  }
  
  return html
}

// Helper function to validate date format (YYYY-MM-DD)
function isValidDate(dateString: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(dateString)) return false
  
  const date = new Date(dateString + 'T00:00:00.000Z')
  const [year, month, day] = dateString.split('-').map(Number)
  
  return date.getUTCFullYear() === year &&
         date.getUTCMonth() === month - 1 &&
         date.getUTCDate() === day
}

// GET /api/admin/notices/[id] - Get single notice
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminClient()
    const { id } = await params

    const { data, error } = await supabase
      .from('notices')
      .select(`
        *,
        category:notice_categories(name, display_name, color)
      `)
      .eq('id', id)
      .single()

    if (error) {
      logError('Error fetching notice', error, { component: 'NoticesDetailAPI', action: 'GET', noticeId: id })
      return NextResponse.json(
        { error: 'Notice not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    logError('API Error in notices detail route', error, { component: 'NoticesDetailAPI' })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/notices/[id] - Update notice
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminClient()
    const { id } = await params
    const body = await request.json()

    // Enhanced validation with detailed error messages
    const validationErrors: string[] = []
    
    if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
      validationErrors.push('제목이 필요합니다.')
    } else if (body.title.trim().length > 200) {
      validationErrors.push('제목은 200자를 초과할 수 없습니다.')
    }
    
    if (!body.content || (body.content.ops && body.content.ops.length === 0)) {
      validationErrors.push('내용이 필요합니다.')
    }
    
    if (body.meta_title && body.meta_title.length > 60) {
      validationErrors.push('SEO 제목은 60자를 초과할 수 없습니다.')
    }
    
    if (body.meta_description && body.meta_description.length > 160) {
      validationErrors.push('SEO 설명은 160자를 초과할 수 없습니다.')
    }
    
    // TODO: Re-enable after database migration
    // if (body.notice_date && !isValidDate(body.notice_date)) {
    //   validationErrors.push('올바른 공지일을 입력해주세요. (YYYY-MM-DD 형식)')
    // }
    
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: '입력 오류', details: validationErrors },
        { status: 400 }
      )
    }

    // Check if notice exists
    const { data: existing } = await supabase
      .from('notices')
      .select('id, status, published_at')
      .eq('id', id)
      .single()

    if (!existing) {
      return NextResponse.json(
        { error: 'Notice not found' },
        { status: 404 }
      )
    }

    // Generate slug from title if title changed
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 200)

    // Extract plain text and convert to HTML
    const plainText = extractPlainTextFromDelta(body.content)
    const htmlContent = convertDeltaToHTML(body.content)

    // Handle publishing status changes
    let publishedAt = existing.published_at
    if (body.status === 'published' && existing.status !== 'published') {
      publishedAt = new Date().toISOString()
    } else if (body.status !== 'published') {
      publishedAt = null
    }

    const updateData: any = {
      title: body.title,
      slug,
      content: body.content,
      html_content: htmlContent,
      plain_text: plainText,
      status: body.status || existing.status,
      published_at: publishedAt,
      scheduled_publish_at: body.scheduled_publish_at || null,
      category_id: body.category_id,
      notice_date: body.notice_date || null,
      priority: body.priority || 0,
      meta_title: body.meta_title || null,
      meta_description: body.meta_description || null,
      featured_image_url: body.featured_image_url || null,
      tags: body.tags || [],
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('notices')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        category:notice_categories(name, display_name, color)
      `)
      .single()

    if (error) {
      logError('Error updating notice', error, { component: 'NoticesDetailAPI', action: 'PUT', noticeId: id })
      return NextResponse.json(
        { error: 'Failed to update notice' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    logError('API Error in notices detail route', error, { component: 'NoticesDetailAPI' })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/notices/[id] - Delete notice
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminClient()
    const { id } = await params

    // Check if notice exists
    const { data: existing } = await supabase
      .from('notices')
      .select('id, title')
      .eq('id', id)
      .single()

    if (!existing) {
      return NextResponse.json(
        { error: 'Notice not found' },
        { status: 404 }
      )
    }

    const { error } = await supabase
      .from('notices')
      .delete()
      .eq('id', id)

    if (error) {
      logError('Error deleting notice', error, { component: 'NoticesDetailAPI', action: 'DELETE', noticeId: id })
      return NextResponse.json(
        { error: 'Failed to delete notice' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      message: 'Notice deleted successfully',
      deleted: { id, title: existing.title }
    })
  } catch (error) {
    logError('API Error in notices detail route', error, { component: 'NoticesDetailAPI' })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/notices/[id] - Increment view count
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminClient()
    const { id } = await params
    const body = await request.json()

    if (body.action === 'increment_views') {
      const { data, error } = await supabase
        .from('notices')
        .update({
          view_count: supabase.rpc('increment', { x: 1 }),
          last_viewed_at: new Date().toISOString()
        })
        .eq('id', id)
        .select('view_count')
        .single()

      if (error) {
        logError('Error incrementing view count', error, { component: 'NoticesDetailAPI', action: 'incrementViewCount', noticeId: id })
        return NextResponse.json(
          { error: 'Failed to update view count' },
          { status: 500 }
        )
      }

      return NextResponse.json({ data })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    logError('API Error in notices detail route', error, { component: 'NoticesDetailAPI' })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}