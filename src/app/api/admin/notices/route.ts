import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { logError } from '@/utils/logger'

// GET /api/admin/notices - Fetch all notices
export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    // First check if tables exist
    const { data: testData, error: testError } = await supabase
      .from('notices')
      .select('id')
      .limit(1)

    if (testError) {
      logError('Database connection or schema error', testError, { 
        component: 'NoticesAPI', 
        action: 'GET',
        errorCode: testError.code 
      })
      
      if (testError.code === '42P01') {
        return NextResponse.json(
          { 
            error: 'Database tables not initialized. Please run setup scripts.',
            details: 'Tables missing: notices, notice_categories',
            data: [],
            setupRequired: true
          },
          { status: 503 }
        )
      }
      
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          details: testError.message,
          data: []
        },
        { status: 500 }
      )
    }

    let query = supabase
      .from('notices')
      .select(`
        *,
        category:notice_categories(name, display_name, color)
      `)
      .order('created_at', { ascending: false })

    // Filter by category if specified
    if (category && category !== 'all') {
      query = query.eq('category.name', category)
    }

    // Filter by status if specified
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    // Enhanced search functionality with Korean text optimization
    if (search) {
      const searchTerm = search.trim()
      if (searchTerm.length > 0) {
        // Use simple text search since korean configuration may not be available
        query = query.or(`title.ilike.%${searchTerm}%,plain_text.ilike.%${searchTerm}%,tags.cs.{"${searchTerm}"}`)
      }
    }

    const { data, error } = await query

    if (error) {
      logError('Error fetching notices', error, { component: 'NoticesAPI', action: 'GET' })
      
      // Handle specific database errors
      if (error.code === '42P01') {
        return NextResponse.json(
          { error: 'Notices table not found. Please contact administrator.', data: [] },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch notices', details: error.message, data: [] },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    logError('API Error in notices route', error, { component: 'NoticesAPI' })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/notices - Create new notice
export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()
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
    
    if (!body.category_id || typeof body.category_id !== 'string') {
      validationErrors.push('카테고리를 선택해주세요.')
    }
    
    if (body.meta_title && body.meta_title.length > 60) {
      validationErrors.push('SEO 제목은 60자를 초과할 수 없습니다.')
    }
    
    if (body.meta_description && body.meta_description.length > 160) {
      validationErrors.push('SEO 설명은 160자를 초과할 수 없습니다.')
    }
    
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: '입력 오류', details: validationErrors },
        { status: 400 }
      )
    }

    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 200)

    // Extract plain text from Quill Delta content
    const plainText = extractPlainTextFromDelta(body.content)

    // Convert Delta to HTML (simplified - in production you'd use a proper converter)
    const htmlContent = convertDeltaToHTML(body.content)

    // Get the highest priority + 1 for this category
    const { data: maxPriorityData } = await supabase
      .from('notices')
      .select('priority')
      .eq('category_id', body.category_id)
      .order('priority', { ascending: false })
      .limit(1)

    const nextPriority = (maxPriorityData?.[0]?.priority || 0) + 1

    const noticeData = {
      ...body,
      slug,
      plain_text: plainText,
      html_content: htmlContent,
      priority: nextPriority,
      status: body.status || 'draft',
      published_at: body.status === 'published' ? new Date().toISOString() : null,
      tags: body.tags || [],
      view_count: 0,
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('notices')
      .insert(noticeData)
      .select(`
        *,
        category:notice_categories(name, display_name, color)
      `)
      .single()

    if (error) {
      logError('Error creating notice', error, { component: 'NoticesAPI', action: 'POST' })
      return NextResponse.json(
        { error: 'Failed to create notice' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    logError('API Error in notices route', error, { component: 'NoticesAPI' })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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
      
      // Korean text normalization and optimization
      text = text
        // Full-width punctuation normalization
        .replace(/[，]/g, ',')  // Full-width comma to regular comma
        .replace(/[。]/g, '.')  // Full-width period to regular period
        .replace(/[（]/g, '(')  // Full-width parentheses
        .replace(/[）]/g, ')')
        .replace(/[「]/g, '"')  // Korean quotation marks
        .replace(/[」]/g, '"')
        // Optimize spacing around Korean text
        .replace(/\s+([가-힣])/g, ' $1')  // Single space before Korean
        .replace(/([가-힣])\s+/g, '$1 ')  // Single space after Korean
      
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
  
  // Final Korean text optimization for the complete HTML
  html = html
    // Normalize spacing in HTML content
    .replace(/>\s+([가-힣])/g, '>$1')  // Remove extra space after tags before Korean
    .replace(/([가-힣])\s+</g, '$1<')  // Remove extra space after Korean before tags
    // Ensure proper line breaks for Korean content
    .replace(/([가-힣])([.!?])\s*</g, '$1$2<')  // Clean punctuation spacing
    // Clean up multiple spaces
    .replace(/\s{2,}/g, ' ')
  
  return html
}