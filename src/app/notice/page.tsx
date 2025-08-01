'use client';

import { useCallback, useEffect, useState } from 'react';

import NoticeError from '@/components/notice/NoticeError';
import NoticeLoading from '@/components/notice/NoticeLoading';
import UnderlineLink from '@/components/links/UnderlineLink';
import { NoticeListItem } from '@/types/notionTypes';
import { NOTICE_CONSTANTS, sortNoticesByDate, formatNoticeDate, fetchWithRetry } from '@/lib/noticeUtils';

import { cn } from '@/lib/utils';

export default function Notice() {
  const [noticeList, setNoticeList] = useState<NoticeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotices = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await fetchWithRetry('/api/notice');
      const notices = await response.json();
      
      if (Array.isArray(notices) && notices.length > 0) {
        const sortedNotices = sortNoticesByDate(notices);
        setNoticeList(sortedNotices);
      } else {
        setNoticeList([]);
      }
    } catch (error) {
      console.error('Failed to fetch notices:', error);
      setError(NOTICE_CONSTANTS.MESSAGES.ERROR_FETCH);
      setNoticeList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRetry = useCallback(() => {
    fetchNotices();
  }, [fetchNotices]);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  if (loading) {
    return <NoticeLoading />;
  }

  if (error) {
    return (
      <NoticeError 
        message={error}
        showRetry={true}
        onRetry={handleRetry}
        showBackButton={false}
      />
    );
  }

  return (
    <main
      className={NOTICE_CONSTANTS.STYLES.MAIN_CONTAINER}
      data-aos="fade-zoon-in"
    >
      <h1 className={NOTICE_CONSTANTS.STYLES.TITLE_COLOR}>
        공지사항
      </h1>
      <section
        className={NOTICE_CONSTANTS.STYLES.CONTENT_CONTAINER}
        role="main"
        aria-label="공지사항 목록"
      >
        {noticeList.length > 0 ? (
          <ul className="flex flex-col gap-4">
            {noticeList.map((notice) => {
              if (notice.archived) return null;

              const formattedDate = formatNoticeDate(notice.properties['공지일'].date.start);
              const title = notice.properties['공지사항'].title[0]?.plain_text || '제목 없음';

              return (
                <li
                  key={notice.id}
                  className={cn(
                    'flex h-fit gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
                    'max-xl:w-full max-xl:flex-col'
                  )}
                >
                  <time 
                    className={cn('w-32 text-sm text-gray-600 dark:text-gray-400 flex-shrink-0', 'max-xl:w-24')}
                    dateTime={notice.properties['공지일'].date.start}
                  >
                    {formattedDate}
                  </time>
                  <div className="w-full text-base">
                    <UnderlineLink 
                      href={`/notice/${notice.id}`}
                      className="line-clamp-2"
                      aria-label={`공지사항: ${title}`}
                    >
                      {title}
                    </UnderlineLink>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div 
            className="flex h-32 w-full items-center justify-center text-gray-500"
            role="status"
            aria-live="polite"
          >
            {NOTICE_CONSTANTS.MESSAGES.EMPTY_LIST}
          </div>
        )}
      </section>
    </main>
  );
}
