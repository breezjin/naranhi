/* eslint-disable @typescript-eslint/no-explicit-any */
import UnderlineLink from '@/components/links/UnderlineLink';

import { getNotionNotice } from '@/app/api/getNotionNotice';
import { cn } from '@/lib/utils';

export default async function Notice() {
  const noticeList = (await getNotionNotice()).sort((a: any, b: any) => {
    const aa = parseInt(a.properties['공지일'].date.start.replaceAll('-', ''));
    const bb = parseInt(b.properties['공지일'].date.start.replaceAll('-', ''));

    return bb - aa;
  });

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
        {noticeList.map((notice: any) => {
          if (notice.archived) return;

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
        })}
      </div>
    </main>
  );
}
