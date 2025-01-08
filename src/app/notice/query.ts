interface NotionPage {
  object: string;
  id: string;
  created_time: string;
  last_edited_time: string;
  created_by: {
    object: string;
    id: string;
  };
  last_edited_by: {
    object: string;
    id: string;
  };
  cover: null;
  icon: null;
  parent: {
    type: string;
    database_id: string;
  };
  archived: boolean;
  properties: {
    태그: object;
    공지일: object;
    공지사항: object;
  };
  url: string;
  public_url: null;
}

export const notionPages: NotionPage[] = [
  {
    object: 'page',
    id: 'bd465f3b-9274-43ee-948f-9128e825a2a4',
    created_time: '2023-08-28T14:22:00.000Z',
    last_edited_time: '2023-08-28T14:24:00.000Z',
    created_by: { object: 'user', id: '82f0816e-0585-42c1-a4c9-5ff74387a93d' },
    last_edited_by: {
      object: 'user',
      id: '82f0816e-0585-42c1-a4c9-5ff74387a93d',
    },
    cover: null,
    icon: null,
    parent: {
      type: 'database_id',
      database_id: '60aea9d1-a98f-4d06-b595-bd9c566efcfb',
    },
    archived: false,
    properties: { 태그: {}, 공지일: {}, 공지사항: {} },
    url: 'https://www.notion.so/bd465f3b927443ee948f9128e825a2a4',
    public_url: null,
  },
  {
    object: 'page',
    id: 'e6a459cb-b666-46e7-ac1d-8cdf237e0142',
    created_time: '2023-08-28T14:22:00.000Z',
    last_edited_time: '2023-08-28T14:24:00.000Z',
    created_by: { object: 'user', id: '82f0816e-0585-42c1-a4c9-5ff74387a93d' },
    last_edited_by: {
      object: 'user',
      id: '82f0816e-0585-42c1-a4c9-5ff74387a93d',
    },
    cover: null,
    icon: null,
    parent: {
      type: 'database_id',
      database_id: '60aea9d1-a98f-4d06-b595-bd9c566efcfb',
    },
    archived: false,
    properties: { 태그: {}, 공지일: {}, 공지사항: {} },
    url: 'https://www.notion.so/e6a459cbb66646e7ac1d8cdf237e0142',
    public_url: null,
  },
];
