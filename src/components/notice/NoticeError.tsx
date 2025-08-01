import ButtonLink from '@/components/links/ButtonLink';
import { NOTICE_CONSTANTS } from '@/lib/noticeUtils';

interface NoticeErrorProps {
  message?: string;
  showRetry?: boolean;
  onRetry?: () => void;
  showBackButton?: boolean;
}

export default function NoticeError({ 
  message = NOTICE_CONSTANTS.MESSAGES.ERROR_FETCH,
  showRetry = false,
  onRetry,
  showBackButton = true
}: NoticeErrorProps) {
  return (
    <main className={NOTICE_CONSTANTS.STYLES.CENTER_LAYOUT}>
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="text-red-500 text-lg font-medium">{message}</div>
        <div className="flex gap-2">
          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-naranhiGreen text-white rounded-md hover:bg-naranhiGreen/90 transition-colors"
            >
              {NOTICE_CONSTANTS.MESSAGES.RETRY}
            </button>
          )}
          {showBackButton && (
            <ButtonLink href="/notice" variant="outline">
              {NOTICE_CONSTANTS.MESSAGES.BACK_TO_LIST}
            </ButtonLink>
          )}
        </div>
      </div>
    </main>
  );
}