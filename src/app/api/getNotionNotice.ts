import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NEXT_PUBLIC_NOTION_SECRET_KEY });
const dbId = process.env.NEXT_PUBLIC_NOTION_NOTICE_DB_ID ?? '';

export async function getNotionNotice() {
  const dbQuery = await notion.databases.query({
    database_id: dbId,
  });
  console.log('🚀 ~ file: getNotionNotice.ts:10 ~ getNotionNotice ~ dbQuery:', dbQuery);

  return dbQuery.results;
}

export async function getNotionNoticePage(id: string) {
  const pageQuery = await notion.pages.retrieve({
    page_id: id,
  });
  console.log('🚀 ~ file: getNotionNotice.ts:19 ~ getNotionNoticePage ~ pageQuery:', pageQuery);

  return pageQuery;
}

export async function getNotionNoticePageBlocks(pageId: string) {
  const pageItem = await notion.blocks.children.list({
    block_id: pageId,
  });
  console.log('🚀 ~ file: getNotionNotice.ts:28 ~ getNotionNoticePageBlocks ~ pageItem:', pageItem);

  return pageItem;
}
