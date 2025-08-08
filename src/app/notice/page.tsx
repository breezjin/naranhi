'use client';

import { useCallback, useEffect, useState } from 'react';
import { Calendar, Tag } from 'lucide-react';

import NoticeError from '@/components/notice/NoticeError';
import NoticeLoading from '@/components/notice/NoticeLoading';
import UnderlineLink from '@/components/links/UnderlineLink';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Updated interface for database notice data
interface PublicNotice {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  notice_date: string | null;
  published_at: string;
  created_at: string;
  view_count: number;
  tags: string[];
  priority: number;
  category?: {
    name: string;
    display_name: string;
  };
}

export default function Notice() {
  const [noticeList, setNoticeList] = useState<PublicNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotices = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch('/api/notices');
      if (!response.ok) {
        throw new Error('Failed to fetch notices');
      }

      const result = await response.json();
      const notices = result.data || [];

      // Notices are already sorted by notice_date DESC in the API
      setNoticeList(notices);
    } catch (error) {
      console.error('Failed to fetch notices:', error);
      setError('공지사항을 불러오는데 실패했습니다.');
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '날짜 미정';
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <main
      className={cn(
        'mx-auto flex min-h-[calc(100vh-65px)] max-w-6xl flex-col gap-8',
        'p-4 sm:p-6 md:p-8'
      )}
      data-aos="fade-zoom-in"
    >
      {/* Enhanced Header Section */}
      <header className="space-y-4">
        <h1
          className={cn(
            'text-3xl font-bold tracking-tight',
            'text-naranhiYellow dark:text-naranhiGreen',
            'md:text-4xl'
          )}
        >
          공지사항
        </h1>
        <p className="text-base text-muted-foreground md:text-lg">
          나란히의 새로운 소식을 확인하세요.
        </p>
      </header>

      {/* Notice List Section */}
      <section
        className="flex-1 space-y-6"
        role="main"
        aria-label="공지사항 목록"
      >
        {noticeList.length > 0 ? (
          <div className="grid gap-4 md:gap-6">
            {noticeList.map((notice, index) => {
              const displayDate = notice.notice_date || notice.published_at;
              const formattedDate = formatDate(displayDate);

              return (
                <article
                  key={notice.id}
                  className={cn(
                    'group relative overflow-hidden rounded-xl border',
                    'bg-card p-6 shadow-sm transition-all duration-200',
                    'hover:border-primary/50 hover:shadow-md',
                    'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20'
                  )}
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                >
                  {/* Main Content */}
                  <div className="space-y-3">
                    {/* Title and Excerpt */}
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold leading-tight md:text-2xl">
                        <UnderlineLink
                          href={`/notice/${notice.id}`}
                          className={cn(
                            'block transition-colors',
                            'focus:text-primary group-hover:text-primary'
                          )}
                          aria-label={`공지사항: ${notice.title}`}
                        >
                          {notice.title}
                        </UnderlineLink>
                      </h2>
                      {notice.excerpt && (
                        <p
                          className={cn(
                            'line-clamp-2 leading-relaxed text-muted-foreground',
                            'text-sm md:text-base'
                          )}
                        >
                          {notice.excerpt}
                        </p>
                      )}
                    </div>

                    {/* Metadata */}
                    <div
                      className={cn(
                        'flex flex-wrap items-center gap-4 pt-3',
                        'border-t border-muted text-sm text-muted-foreground'
                      )}
                    >
                      {/* Date */}
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <time dateTime={displayDate}>{formattedDate}</time>
                      </div>

                      {/* Tags */}
                      {notice.tags.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Tag className="h-4 w-4" />
                          <div className="flex gap-1.5">
                            {notice.tags.slice(0, 2).map((tag, tagIndex) => (
                              <Badge
                                key={tagIndex}
                                variant="secondary"
                                className="px-2 py-0.5 text-xs"
                              >
                                #{tag}
                              </Badge>
                            ))}
                            {notice.tags.length > 2 && (
                              <Badge
                                variant="outline"
                                className="px-2 py-0.5 text-xs"
                              >
                                +{notice.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Category */}
                      {notice.category && (
                        <Badge
                          variant="outline"
                          className="px-2 py-0.5 text-xs"
                        >
                          {notice.category.display_name}
                        </Badge>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div
            className={cn(
              'flex min-h-[40vh] flex-col items-center justify-center',
              'rounded-xl border-2 border-dashed border-muted',
              'bg-muted/20 p-12 text-center'
            )}
            role="status"
            aria-live="polite"
          >
            <div className="space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">공지사항이 없습니다</h3>
              <p className="max-w-md text-sm text-muted-foreground">
                현재 등록된 공지사항이 없습니다. 새로운 소식이 있으면 곧
                업데이트될 예정입니다.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
