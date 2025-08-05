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
        <div className="text-lg font-medium text-red-500">{message}</div>
        <div className="flex gap-2">
          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className="rounded-md bg-naranhiGreen px-4 py-2 text-white transition-colors hover:bg-naranhiGreen/90"
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