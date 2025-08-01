import { NextRequest, NextResponse } from 'next/server';
import { getNotionNoticePage, getNotionNoticePageBlocks } from '@/app/api/getNotionNotice';
import { NotionBlock, NoticeContent } from '@/types/notionTypes';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // 입력 검증
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid notice ID' }, { status: 400 });
    }
    
    // 환경 변수 검증
    if (!process.env.NOTION_SECRET_KEY || !process.env.NOTION_NOTICE_DB_ID) {
      return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
    }

    // 병렬로 페이지 정보와 블록 정보를 가져옴
    const [notionPage, notionBlocks] = await Promise.all([
      getNotionNoticePage(id),
      getNotionNoticePageBlocks(id)
    ]);

    // 페이지가 존재하지 않거나 아카이브된 경우
    if (!notionPage || (notionPage as any).archived) {
      return NextResponse.json({ error: 'Notice not found' }, { status: 404 });
    }

    // 블록 데이터를 프론트엔드에서 사용하기 쉽게 변환
    const pageParagraphs: NoticeContent[] = notionBlocks.results
      .map((block: any) => {
        if (block.type === 'paragraph') {
          const text = block.paragraph.rich_text[0]?.plain_text || '';
          return text.trim() ? {
            type: 'paragraph' as const,
            data: text,
          } : null;
        }
        if (block.type === 'image') {
          const imageUrl = block.image.file?.url || block.image.external?.url || '';
          return imageUrl ? {
            type: 'image' as const,
            data: imageUrl,
          } : null;
        }
        return null;
      })
      .filter((item): item is NoticeContent => item !== null);

    return NextResponse.json({
      page: notionPage,
      content: pageParagraphs
    });
  } catch (error) {
    console.error('Failed to fetch notice detail:', error);
    
    // Notion API 에러인 경우 404로 처리
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: 'Notice not found' }, { status: 404 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}