'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

import ButtonLink from '@/components/links/ButtonLink';
import NoticeError from '@/components/notice/NoticeError';
import NoticeLoading from '@/components/notice/NoticeLoading';
import { NoticeDetailResponse } from '@/types/notionTypes';
import { NOTICE_CONSTANTS, formatNoticeDate, fetchWithRetry } from '@/lib/noticeUtils';


interface NoticeDetailProps {
  params: Promise<{ id: string }>;
}

export default function NoticeDetailPage({ params }: NoticeDetailProps) {
  const [noticeData, setNoticeData] = useState<NoticeDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);

  // params를 해결하여 id 추출
  useEffect(() => {
    params.then(({ id: paramId }) => {
      setId(paramId);
    });
  }, [params]);

  const fetchNoticeDetail = useCallback(async (noticeId: string) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await fetchWithRetry(`/api/notice/${noticeId}`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setNoticeData(data);
    } catch (error) {
      console.error('Failed to fetch notice detail:', error);
      const errorMessage = error instanceof Error && error.message.includes('404') 
        ? NOTICE_CONSTANTS.MESSAGES.ERROR_NOT_FOUND
        : NOTICE_CONSTANTS.MESSAGES.ERROR_FETCH;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRetry = useCallback(() => {
    if (id) {
      fetchNoticeDetail(id);
    }
  }, [id, fetchNoticeDetail]);

  // id가 설정되면 데이터 페칭
  useEffect(() => {
    if (!id) return;
    fetchNoticeDetail(id);
  }, [id, fetchNoticeDetail]);

  if (loading) {
    return <NoticeLoading />;
  }

  if (error) {
    return (
      <NoticeError 
        message={error}
        showRetry={true}
        onRetry={handleRetry}
        showBackButton={true}
      />
    );
  }

  if (!noticeData) {
    return (
      <NoticeError 
        message={NOTICE_CONSTANTS.MESSAGES.ERROR_NOT_FOUND}
        showRetry={false}
        showBackButton={true}
      />
    );
  }

  const { page, content } = noticeData;
  const title = page.properties['공지사항']?.title[0]?.plain_text || '제목 없음';
  const dateString = page.properties['공지일']?.date.start;
  const formattedDate = dateString ? formatNoticeDate(dateString) : '';

  return (
    <main
      className={NOTICE_CONSTANTS.STYLES.MAIN_CONTAINER}
      data-aos="fade-zoon-in"
    >
      {/* 공지사항 헤더 */}
      <header className={NOTICE_CONSTANTS.STYLES.TITLE_HEADER}>
        {formattedDate && (
          <time 
            className="mb-2 text-sm text-gray-600 dark:text-gray-400"
            dateTime={dateString}
          >
            {formattedDate}
          </time>
        )}
        <h1 className={NOTICE_CONSTANTS.STYLES.TITLE_COLOR}>
          {title}
        </h1>
      </header>

      {/* 공지사항 내용 */}
      <article 
        className={NOTICE_CONSTANTS.STYLES.CONTENT_CONTAINER}
        role="article"
        aria-labelledby="notice-title"
      >
        {content && content.length > 0 ? (
          <div className="prose dark:prose-invert max-w-none">
            {content.map((item, idx) => {
              if (item.type === 'paragraph' && item.data.trim()) {
                return (
                  <p 
                    key={idx} 
                    className="mb-4 leading-relaxed text-gray-800 dark:text-gray-200"
                  >
                    {item.data}
                  </p>
                );
              }
              if (item.type === 'image' && item.data) {
                return (
                  <div key={idx} className="my-6">
                    <Image
                      src={item.data}
                      width="0"
                      height="0"
                      sizes="(max-width: 500px) 100vw, 500px"
                      className="h-auto w-full rounded-lg shadow-sm"
                      loading="lazy"
                      alt={`공지사항 이미지 ${idx + 1}`}
                    />
                  </div>
                );
              }
              return null;
            })}
          </div>
        ) : (
          <div 
            className="py-8 text-center text-gray-500"
            role="status"
          >
            내용이 없습니다.
          </div>
        )}
      </article>

      {/* 네비게이션 */}
      <nav className={NOTICE_CONSTANTS.STYLES.CONTENT_CONTAINER}>
        <div className="flex items-center justify-center border-t border-gray-200 pt-8 dark:border-gray-700">
          <ButtonLink 
            href="/notice" 
            variant="outline"
            aria-label="공지사항 목록으로 돌아가기"
          >
            {NOTICE_CONSTANTS.MESSAGES.BACK_TO_LIST_SHORT}
          </ButtonLink>
        </div>
      </nav>
    </main>
  );
}
