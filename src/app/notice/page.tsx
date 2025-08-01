/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import UnderlineLink from '@/components/links/UnderlineLink';

import { cn } from '@/lib/utils';

export default function Notice() {
  const [noticeList, setNoticeList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchNotices = async () => {
      console.log('Fetching notices...');
      
      try {
        setError(null);
        const response = await fetch('/api/notice');
        const notices = await response.json();
        
        console.log('Received notices:', notices);
        
        if (!isMounted) return; // 컴포넌트가 언마운트된 경우 상태 업데이트하지 않음
        
        if (notices.length > 0) {
          const sortedNotices = notices.sort((a: any, b: any) => {
            const aa = parseInt(a.properties['공지일'].date.start.replaceAll('-', ''));
            const bb = parseInt(b.properties['공지일'].date.start.replaceAll('-', ''));
            return bb - aa;
          });
          setNoticeList(sortedNotices);
          console.log('Set notice list:', sortedNotices);
        } else {
          setNoticeList([]);
          console.log('Set empty notice list');
        }
      } catch (error) {
        console.error('Failed to fetch notices:', error);
        if (isMounted) {
          setError('공지사항을 불러오는데 실패했습니다.');
          setNoticeList([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          console.log('Loading complete');
        }
      }
    };

    fetchNotices();
    
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-65px)] w-full flex-col items-center justify-center">
        <div>로딩 중...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-[calc(100vh-65px)] w-full flex-col items-center justify-center">
        <div className="text-red-500">{error}</div>
      </main>
    );
  }

  return (
    <main
      className="flex min-h-[calc(100vh-65px)] w-full flex-col items-center gap-8 p-8 pt-16 max-xl:pt-8"
      data-aos="fade-zoon-in"
    >
      <div className="text-2xl text-naranhiYellow dark:text-naranhiGreen">
        공지사항
      </div>
      <div
        className={cn(
          'flex min-w-[500px] max-w-[40%] flex-col gap-4',
          'max-xl:min-w-full max-xl:max-w-full'
        )}
      >
        {noticeList.length > 0 ? (
          noticeList.map((notice: any) => {
            if (notice.archived) return null;

            return (
              <div
                key={notice.id}
                className={cn('flex h-fit gap-2 max-xl:w-full max-xl:flex-col')}
              >
                <div className={cn('w-32 max-xl:w-24')}>
                  {notice.properties['공지일'].date.start}
                </div>
                <div className="w-full text-base">
                  <UnderlineLink href={`/notice/${notice.id}`}>
                    {notice.properties['공지사항'].title[0].plain_text}
                  </UnderlineLink>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex h-32 w-full items-center justify-center text-gray-500">
            현재 등록된 공지사항이 없습니다.
          </div>
        )}
      </div>
    </main>
  );
}
