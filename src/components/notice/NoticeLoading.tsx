import { NOTICE_CONSTANTS } from '@/lib/noticeUtils';

interface NoticeLoadingProps {
  message?: string;
}

export default function NoticeLoading({ message = NOTICE_CONSTANTS.MESSAGES.LOADING }: NoticeLoadingProps) {
  return (
    <main className={NOTICE_CONSTANTS.STYLES.CENTER_LAYOUT}>
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-naranhiGreen" />
        <div className="text-gray-600 dark:text-gray-400">{message}</div>
      </div>
    </main>
  );
}