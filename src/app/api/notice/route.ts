import { NextRequest, NextResponse } from 'next/server';
import { getNotionNotice } from '@/app/api/getNotionNotice';

export async function GET(_request: NextRequest) {
  try {
    // 환경 변수가 없으면 빈 배열 반환
    if (!process.env.NEXT_PUBLIC_NOTION_SECRET_KEY || !process.env.NEXT_PUBLIC_NOTION_NOTICE_DB_ID) {
      return NextResponse.json([]);
    }

    const noticeList = await getNotionNotice();
    return NextResponse.json(noticeList);
  } catch (error) {
    console.error('Failed to fetch notices:', error);
    return NextResponse.json([]);
  }
}