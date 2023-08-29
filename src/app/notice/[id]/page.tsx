/* eslint-disable @typescript-eslint/no-explicit-any */
import ButtonLink from '@/components/links/ButtonLink';

import { getNotionNoticePage, getNotionNoticePageBlocks } from '@/app/api/getNotionNotice';
import { cn } from '@/lib/utils';

export default async function Page({ params }: { params: { id: string } }) {
  const notionPage: any = await getNotionNoticePage(params.id);
  const notionBlockChildren: any[] = (await getNotionNoticePageBlocks(params.id)).results;
  const pageParagraphs = notionBlockChildren.map((children) => {
    if (children.type === 'paragraph') return children.paragraph.rich_text[0]?.plain_text;
  });

  return (
    <main
      className='flex min-h-[calc(100vh-65px)] w-full flex-col items-center gap-8 p-8 pt-16 max-xl:pt-8'
      data-aos='fade-zoon-in'
    >
      <section
        className={cn(
          'flex min-w-[500px] max-w-[40%] flex-col gap-0',
          'max-xl:min-w-full max-xl:max-w-full'
        )}
      >
        <div>{notionPage.properties['공지일']?.date.start}</div>
        <div className='text-2xl text-naranhiYellow dark:text-naranhiGreen'>
          {notionPage.properties['공지사항']?.title[0].plain_text}
        </div>
      </section>
      <section
        className={cn(
          'flex min-w-[500px] max-w-[40%] flex-col gap-4',
          'max-xl:min-w-full max-xl:max-w-full'
        )}
      >
        {pageParagraphs.map((content: string, idx) => (
          <p key={idx}>{content}</p>
        ))}
      </section>
      <section
        className={cn(
          'flex min-w-[500px] max-w-[40%] flex-col gap-4',
          'max-xl:min-w-full max-xl:max-w-full'
        )}
      >
        <div className='flex items-center justify-center text-sm text-gray-500'>
          <ButtonLink href='/notice' variant='outline'>
            공지사항 목록으로 &gt;
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
