// Notion API 응답 타입 정의
export interface NotionPageProperty {
  id: string;
  type: string;
}

export interface NotionDateProperty extends NotionPageProperty {
  date: {
    start: string;
    end?: string;
  };
}

export interface NotionTitleProperty extends NotionPageProperty {
  title: Array<{
    plain_text: string;
    href?: string;
  }>;
}

export interface NotionPage {
  id: string;
  archived: boolean;
  properties: {
    '공지일': NotionDateProperty;
    '공지사항': NotionTitleProperty;
    [key: string]: NotionPageProperty;
  };
}

export interface NotionRichText {
  plain_text: string;
  href?: string;
}

export interface NotionParagraphBlock {
  type: 'paragraph';
  paragraph: {
    rich_text: NotionRichText[];
  };
}

export interface NotionImageBlock {
  type: 'image';
  image: {
    file?: {
      url: string;
    };
    external?: {
      url: string;
    };
  };
}

export type NotionBlock = NotionParagraphBlock | NotionImageBlock;

export interface NotionBlocksResponse {
  results: NotionBlock[];
}

// 클라이언트 사이드에서 사용할 변환된 타입
export interface NoticeContent {
  type: 'paragraph' | 'image';
  data: string;
}

export interface NoticeDetailResponse {
  page: NotionPage;
  content: NoticeContent[];
}

export interface NoticeListItem {
  id: string;
  archived: boolean;
  properties: NotionPage['properties'];
}