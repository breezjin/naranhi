import { NoticeListItem } from '@/types/notionTypes';

// 공지사항 관련 상수
export const NOTICE_CONSTANTS = {
  MESSAGES: {
    LOADING: '공지사항을 불러오고 있습니다...',
    ERROR_FETCH: '공지사항을 불러오는데 실패했습니다.',
    ERROR_NOT_FOUND: '공지사항을 찾을 수 없습니다.',
    EMPTY_LIST: '현재 등록된 공지사항이 없습니다.',
    RETRY: '다시 시도',
    BACK_TO_LIST: '공지사항 목록으로 돌아가기',
    BACK_TO_LIST_SHORT: '공지사항 목록으로 >'
  },
  STYLES: {
    MAIN_CONTAINER: 'flex min-h-[calc(100vh-65px)] w-full flex-col items-center gap-8 p-8 pt-16 max-xl:pt-8',
    CONTENT_CONTAINER: 'flex min-w-[500px] max-w-[40%] flex-col gap-4 max-xl:min-w-full max-xl:max-w-full',
    TITLE_HEADER: 'flex min-w-[500px] max-w-[40%] flex-col gap-0 max-xl:min-w-full max-xl:max-w-full',
    CENTER_LAYOUT: 'flex min-h-[calc(100vh-65px)] w-full flex-col items-center justify-center',
    TITLE_COLOR: 'text-2xl text-naranhiYellow dark:text-naranhiGreen'
  }
} as const;

// 날짜 정렬 유틸리티 (성능 최적화)
export function sortNoticesByDate(notices: NoticeListItem[]): NoticeListItem[] {
  return notices.sort((a, b) => {
    const dateA = new Date(a.properties['공지일'].date.start);
    const dateB = new Date(b.properties['공지일'].date.start);
    return dateB.getTime() - dateA.getTime();
  });
}

// 날짜 포맷 유틸리티
export function formatNoticeDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\. /g, '.').replace('.', '');
  } catch {
    return dateString; // 파싱 실패시 원본 반환
  }
}

// API 호출 유틸리티 (에러 처리 개선)
export async function fetchWithRetry(
  url: string, 
  options: RequestInit = {}, 
  maxRetries: number = 2
): Promise<Response> {
  let lastError: Error;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries) {
        // 지수 백오프: 1초, 2초, 4초...
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }
  
  throw lastError!;
}