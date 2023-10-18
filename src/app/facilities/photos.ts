/* eslint-disable @typescript-eslint/no-explicit-any */
const facilities: any[] = [
  // {
  //   index: 1,
  //   src: '/facilities/facilities01.jpg',
  //   width: 1,
  //   height: 1,
  //   alt: '방석',
  //   original: '/facilities/facilities01.jpg',
  //   caption: '초기 방문자 선물, 나란히 젓가락',
  // },
];

const hospitals: any[] = [
  {
    index: 7,
    src: '/facilities/front.png',
    width: 3,
    height: 2,
    alt: '입구',
    original: '/facilities/front.png',
    caption: '입구',
  },
  {
    index: 2,
    src: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230922_273%2F16953503465036UBVm_JPEG%2F_DSC0568.jpg',
    width: 3,
    height: 2,
    alt: '병원전경',
    original:
      'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230922_273%2F16953503465036UBVm_JPEG%2F_DSC0568.jpg',
    caption: '병원전경',
  },
  {
    index: 3,
    src: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230922_225%2F1695350347092GK9Ql_JPEG%2F_DSC0617.jpg',
    width: 2,
    height: 3,
    alt: '검사실',
    original:
      'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230922_225%2F1695350347092GK9Ql_JPEG%2F_DSC0617.jpg',
    caption: '검사실',
  },
  {
    index: 1,
    src: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230922_156%2F1695350528819zH1sw_JPEG%2F%25C0%25C7%25BF%25F8%25BB%25E7%25C1%25F8_%25287%2529.jpg',
    width: 3,
    height: 2,
    alt: '복도',
    original:
      'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230922_156%2F1695350528819zH1sw_JPEG%2F%25C0%25C7%25BF%25F8%25BB%25E7%25C1%25F8_%25287%2529.jpg',
    caption: '복도',
  },
  // {
  //   index: 5,
  //   src: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230922_71%2F1695350535500jmksz_JPEG%2F%25C0%25C7%25BF%25F8%25BB%25E7%25C1%25F8_%25288%2529.jpg',
  //   width: 2,
  //   height: 3,
  //   alt: '복도',
  //   original:
  //     'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230922_71%2F1695350535500jmksz_JPEG%2F%25C0%25C7%25BF%25F8%25BB%25E7%25C1%25F8_%25288%2529.jpg',
  //   caption: '복도',
  // },
  // {
  //   index: 8,
  //   src: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230922_98%2F169535035021755yhD_JPEG%2FKakaoTalk_20230922_112907718_05.jpg',
  //   width: 3,
  //   height: 2,
  //   alt: '대기실',
  //   original:
  //     'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230922_98%2F169535035021755yhD_JPEG%2FKakaoTalk_20230922_112907718_05.jpg',
  //   caption: '대기실',
  // },
  {
    index: 7,
    src: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230922_151%2F16953503464227Au6p_JPEG%2FKakaoTalk_20230922_112907718_02.jpg',
    width: 3,
    height: 2,
    alt: '대기실',
    original:
      'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230922_151%2F16953503464227Au6p_JPEG%2FKakaoTalk_20230922_112907718_02.jpg',
    caption: '대기실',
  },
  {
    index: 4,
    src: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230922_82%2F1695350346463S3HzV_JPEG%2FKakaoTalk_20230922_112907718.jpg',
    width: 2,
    height: 3,
    alt: '상담검사실',
    original:
      'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230922_82%2F1695350346463S3HzV_JPEG%2FKakaoTalk_20230922_112907718.jpg',
    caption: '상담, 검사실',
  },
  {
    index: 6,
    src: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230922_252%2F1695350346525GXw2c_JPEG%2FKakaoTalk_20230922_112907718_01.jpg',
    width: 2,
    height: 3,
    alt: '상담실',
    original:
      'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230922_252%2F1695350346525GXw2c_JPEG%2FKakaoTalk_20230922_112907718_01.jpg',
    caption: '상담실',
  },
  {
    index: 9,
    src: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230922_278%2F1695350350276Rkui7_JPEG%2FKakaoTalk_20230922_112907718_06.jpg',
    width: 3,
    height: 2,
    alt: '복도',
    original:
      'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230922_278%2F1695350350276Rkui7_JPEG%2FKakaoTalk_20230922_112907718_06.jpg',
    caption: '복도',
  },
];

const centers: any[] = [
  // {
  //   index: 1,
  //   src: '/center/center01.jpg',
  //   width: 2,
  //   height: 3,
  //   alt: '상담실',
  //   original: '/center/center01.jpg',
  //   caption: '상담실',
  // },
  // {
  //   index: 2,
  //   src: '/center/center02.jpg',
  //   width: 3,
  //   height: 2,
  //   alt: '놀이치료실',
  //   original: '/center/center02.jpg',
  //   caption: '놀이치료실',
  // },
  // {
  //   index: 3,
  //   src: '/center/center03.jpg',
  //   width: 3,
  //   height: 2,
  //   alt: '놀이치료실 놀이기구',
  //   original: '/center/center03.jpg',
  //   caption: '놀이치료실 놀이기구',
  // },
  // {
  //   index: 4,
  //   src: '/center/center04.jpg',
  //   width: 2,
  //   height: 3,
  //   alt: '놀이치료실 놀이기구',
  //   original: '/center/center04.jpg',
  //   caption: '놀이치료실 놀이기구',
  // },
  // {
  //   index: 5,
  //   src: '/center/center05.jpg',
  //   width: 3,
  //   height: 2,
  //   alt: '놀이치료실 관찰',
  //   original: '/center/center05.jpg',
  //   caption: '놀이치료실 관찰',
  // },
];

export const photos = [...hospitals, ...centers, ...facilities];
