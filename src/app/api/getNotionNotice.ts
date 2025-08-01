import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_SECRET_KEY });
const dbId = process.env.NOTION_NOTICE_DB_ID ?? '';

export async function getNotionNotice() {
  const dbQuery = await notion.databases.query({
    database_id: dbId,
  });

  return dbQuery.results;
}

export async function getNotionNoticePage(id: string) {
  const pageQuery = await notion.pages.retrieve({
    page_id: id,
  });

  return pageQuery;
}

export async function getNotionNoticePageBlocks(pageId: string) {
  const pageItem = await notion.blocks.children.list({
    block_id: pageId,
  });

  return pageItem;
}
