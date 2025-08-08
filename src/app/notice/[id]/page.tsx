'use client';

import { useCallback, useEffect, useState } from 'react';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';

import ButtonLink from '@/components/links/ButtonLink';
import NoticeError from '@/components/notice/NoticeError';
import NoticeLoading from '@/components/notice/NoticeLoading';
import NoticeContentRenderer from '@/components/notice/NoticeContentRenderer';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Updated interface for database notice detail data
interface NoticeDetail {
  id: string
  title: string
  slug: string
  content: string
  plain_text?: string
  excerpt?: string
  notice_date: string | null
  published_at: string
  created_at: string
  updated_at: string
  view_count: number
  tags: string[]
  priority: number
  meta_title?: string
  meta_description?: string
  category?: {
    name: string
    display_name: string
  }
}

interface NoticeDetailProps {
  params: Promise<{ id: string }>;
}

export default function NoticeDetailPage({ params }: NoticeDetailProps) {
  const [noticeData, setNoticeData] = useState<NoticeDetail | null>(null);
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
      
      const response = await fetch(`/api/notices/${noticeId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('공지사항을 찾을 수 없습니다.');
        }
        throw new Error('공지사항을 불러오는데 실패했습니다.');
      }
      
      const result = await response.json();
      const data = result.data;
      
      if (!data) {
        throw new Error('공지사항 데이터가 없습니다.');
      }
      
      setNoticeData(data);
    } catch (error) {
      console.error('Failed to fetch notice detail:', error);
      setError(error instanceof Error ? error.message : '공지사항을 불러오는데 실패했습니다.');
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
        message="공지사항을 찾을 수 없습니다."
        showRetry={false}
        showBackButton={true}
      />
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '날짜 미정';
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const displayDate = noticeData.notice_date || noticeData.published_at;
  const formattedDate = formatDate(displayDate);

  return (
    <main
      className={cn(
        // 컨텐츠 영역 확장을 위해 max-width 증가
        'mx-auto max-w-5xl min-h-screen space-y-6',
        // 사이드 여백 최소화
        'px-2 py-4',
        'sm:px-4 sm:py-6',
        'md:px-6 md:py-8'
      )}
      data-aos="fade-zoom-in"
    >
      {/* Back Navigation */}
      <nav className="flex items-center" aria-label="페이지 내비게이션">
        <ButtonLink 
          href="/notice" 
          variant="ghost"
          className="-ml-3 flex items-center gap-2 text-muted-foreground hover:text-foreground"
          aria-label="공지사항 목록으로 돌아가기"
        >
          <ArrowLeft className="h-4 w-4" />
          목록으로 돌아가기
        </ButtonLink>
      </nav>

      {/* Notice Header */}
      <header className="space-y-6">
        {/* Title */}
        <h1 className={cn(
          'text-2xl font-bold leading-tight tracking-tight',
          'text-naranhiYellow dark:text-naranhiGreen',
          'md:text-3xl'
        )}>
          {noticeData.title}
        </h1>

        {/* Badges and Date in one line */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Priority Badge */}
          {noticeData.priority > 0 && (
            <Badge variant="destructive" className="px-3 py-1">
              중요 공지
            </Badge>
          )}
          
          {/* Category Badge */}
          {noticeData.category && (
            <Badge variant="outline" className="px-3 py-1">
              {noticeData.category.display_name}
            </Badge>
          )}
          
          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <time dateTime={displayDate}>
              {formattedDate}
            </time>
          </div>

          {/* Tags - Show only if exist */}
          {noticeData.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-2">
                {noticeData.tags.slice(0, 3).map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-xs px-2 py-0.5"
                  >
                    #{tag}
                  </Badge>
                ))}
                {noticeData.tags.length > 3 && (
                  <Badge 
                    variant="outline" 
                    className="text-xs px-2 py-0.5"
                  >
                    +{noticeData.tags.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Excerpt - Only show if it has meaningful text content */}
        {noticeData.excerpt && 
         noticeData.excerpt.length > 10 && 
         !noticeData.excerpt.includes('[이미지]') && 
         !noticeData.excerpt.includes('image') && (
          <div className={cn(
            'rounded-lg bg-muted/50 p-4',
            'border-l-4 border-primary'
          )}>
            <div className="text-base leading-relaxed text-muted-foreground">
              {noticeData.excerpt}
            </div>
          </div>
        )}
      </header>

      {/* Notice Content - Borderless and Minimal Padding */}
      <article 
        className={cn(
          'min-h-[50vh] w-full',
          // 외곽선 제거, 배경색 제거, 샤도우 제거
          // 'bg-card p-8 shadow-sm border' 제거
          'py-4 px-2', // 최소한의 패딩만 유지
          // 모바일에서는 패딩 제거
          'sm:py-6 sm:px-4',
          'md:py-8 md:px-6'
        )}
        role="article"
        aria-labelledby="notice-title"
      >
        <NoticeContentRenderer 
          content={noticeData.content}
          className="w-full max-w-none"
        />
      </article>

    </main>
  );
}
