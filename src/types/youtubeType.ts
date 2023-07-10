export interface YoutubeItem {
  etag: string;
  id: string;
  kind: string;
  snippet: {
    channelId: string;
    channelTitle: string;
    description: string;
    playlistId: string;
    position: number;
    publishedAt: string;
    resourceId: {
      kind: string;
      videoId: string;
    };
    thumbnails: {
      default: {
        url: string;
        width: number;
        height: number;
      };
      high: {
        url: string;
        width: number;
        height: number;
      };
      maxres: {
        url: string;
        width: number;
        height: number;
      };
      medium: {
        url: string;
        width: number;
        height: number;
      };
      standard: {
        url: string;
        width: number;
        height: number;
      };
    };
    title: string;
    videoOwnerChannelId: string;
    videoOwnerChannelTitle: string;
  };
}

export interface YoutubeSearchItem {
  kind: string;
  etag: string;
  id: {
    kind: string;
    videoId: string;
  };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: {
        url: string;
        width: number;
        height: number;
      };
      medium: {
        url: string;
        width: number;
        height: number;
      };
      high: {
        url: string;
        width: number;
        height: number;
      };
      title: string;
    };
    channelTitle: string;
    liveBroadcastContent: string;
    publishTime: string;
  };
}

export interface Youtubes {
  kind: string;
  etag: string;
  nextPageToken?: string;
  items: YoutubeItem[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}
export interface YoutubeSearches {
  etag: string;
  nextPageToken?: string;
  items: YoutubeSearchItem[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  regionCode: string;
}

export interface YoutubeError {
  error: {
    code: number;
    message: string;
    errors: [
      {
        message: string;
        domain: string;
        reason: string;
      },
    ];
    status: string;
    details: [
      {
        '@type': string;
        reason: string;
        domain: string;
        metadata: {
          service: string;
        };
      },
    ];
  };
}

/*
 아래는 실제 데이터 예시임
 https://web.postman.co/workspace/BREEZ~9fc48333-ef7e-4168-a824-076c3a395756/request/18935797-6451e498-5237-408d-8b7e-c77d480da6af
*/

// export type Youtube = {
//   kind: 'youtube#searchListResponse';
//   etag: 'JZ48kT6W7KGwbqbvy9q7ACl3T5U';
//   nextPageToken: 'CAUQAA';
//   regionCode: 'KR';
//   pageInfo: {
//     totalResults: 1000000;
//     resultsPerPage: 5;
//   };
//   items: [
//     {
//       kind: 'youtube#searchResult';
//       etag: 'F2RyiIAzuIfOsNSk4zlOaEVN3-U';
//       id: {
//         kind: 'youtube#video';
//         videoId: 'uHvk5d1i6UY';
//       };
//       snippet: {
//         publishedAt: '2022-06-01T10:45:01Z';
//         channelId: 'UCweFCeE7R38-pvPl6RifWpw';
//         title: '[playlist] 초여름의 피크닉';
//         description: '피크닉 갈래? 사진 출처 : 신현빈 작가님 chalkakfilm.myportfolio.com 인스타 @chalkak.film #노래추천 #팝송추천 #플레이리스트 ...';
//         thumbnails: {
//           default: {
//             url: 'https://i.ytimg.com/vi/uHvk5d1i6UY/default.jpg';
//             width: 120;
//             height: 90;
//           };
//           medium: {
//             url: 'https://i.ytimg.com/vi/uHvk5d1i6UY/mqdefault.jpg';
//             width: 320;
//             height: 180;
//           };
//           high: {
//             url: 'https://i.ytimg.com/vi/uHvk5d1i6UY/hqdefault.jpg';
//             width: 480;
//             height: 360;
//           };
//         };
//         channelTitle: '네고막을책임져도될까';
//         liveBroadcastContent: 'none';
//         publishTime: '2022-06-01T10:45:01Z';
//       };
//     },
//     {
//       kind: 'youtube#searchResult';
//       etag: 'SXR-S6o2AAWU7ZTIz3SjDOW4lns';
//       id: {
//         kind: 'youtube#video';
//         videoId: 'Jr28YgaCXD0';
//       };
//       snippet: {
//         publishedAt: '2021-08-27T01:22:32Z';
//         channelId: 'UCJ1czRR4Gstf94VvRvOff3Q';
//         title: '[𝐏𝐋𝐀𝐘𝐋𝐈𝐒𝐓] 여름 밤공기와 함께 차분해지는 POP 플레이리스트🌙 ㅣ A calm playlist on Summer night';
//         description: '[PLAYLIST] 여름 밤공기와 함께 차분해지는 POP 플레이리스트 ㅣ A calm playlist on Summer night 비가 자주 내리고 선선한 ...';
//         thumbnails: {
//           default: {
//             url: 'https://i.ytimg.com/vi/Jr28YgaCXD0/default.jpg';
//             width: 120;
//             height: 90;
//           };
//           medium: {
//             url: 'https://i.ytimg.com/vi/Jr28YgaCXD0/mqdefault.jpg';
//             width: 320;
//             height: 180;
//           };
//           high: {
//             url: 'https://i.ytimg.com/vi/Jr28YgaCXD0/hqdefault.jpg';
//             width: 480;
//             height: 360;
//           };
//         };
//         channelTitle: '뮤직아일랜드 Music Island Korea';
//         liveBroadcastContent: 'none';
//         publishTime: '2021-08-27T01:22:32Z';
//       };
//     },
//     {
//       kind: 'youtube#searchResult';
//       etag: 'moT5Lw15lwj_hyK4T6n1wphWNfs';
//       id: {
//         kind: 'youtube#video';
//         videoId: 'xdHP9nmJB_0';
//       };
//       snippet: {
//         publishedAt: '2022-07-12T08:30:41Z';
//         channelId: 'UCSGC87iX0QhnIfUOI_B_Rdg';
//         title: '[Playlist] 습한 공기에 가라앉는 마음 | 센치한 여름밤에 듣기 좋은 감성팝 | summer night with sentimental pop';
//         description: 'Playlist by DisOys (벅스 뮤직PD) * 저작권 이슈로 차단된 2022.06.17 영상 재업 버전입니다 :) *벅스에서 플레이리스트를 확인해 ...';
//         thumbnails: {
//           default: {
//             url: 'https://i.ytimg.com/vi/xdHP9nmJB_0/default.jpg';
//             width: 120;
//             height: 90;
//           };
//           medium: {
//             url: 'https://i.ytimg.com/vi/xdHP9nmJB_0/mqdefault.jpg';
//             width: 320;
//             height: 180;
//           };
//           high: {
//             url: 'https://i.ytimg.com/vi/xdHP9nmJB_0/hqdefault.jpg';
//             width: 480;
//             height: 360;
//           };
//         };
//         channelTitle: 'essential;';
//         liveBroadcastContent: 'none';
//         publishTime: '2022-07-12T08:30:41Z';
//       };
//     },
//     {
//       kind: 'youtube#searchResult';
//       etag: 'uLwjaNfc8bewt5tJ1z82Ttq9KvE';
//       id: {
//         kind: 'youtube#video';
//         videoId: '81--kVsveqQ';
//       };
//       snippet: {
//         publishedAt: '2020-07-13T12:15:23Z';
//         channelId: 'UCWIjaWowE7eDncdBJCdIclQ';
//         title: 'songs that bring you back to that summer night ~ extended';
//         description: 'songs that bring you back to that summer night... ~ tracklist: 0:00 ocean drive ✨ 2:31 unforgettable 4:21 chantaje ✨ 6:37 my ...';
//         thumbnails: {
//           default: {
//             url: 'https://i.ytimg.com/vi/81--kVsveqQ/default.jpg';
//             width: 120;
//             height: 90;
//           };
//           medium: {
//             url: 'https://i.ytimg.com/vi/81--kVsveqQ/mqdefault.jpg';
//             width: 320;
//             height: 180;
//           };
//           high: {
//             url: 'https://i.ytimg.com/vi/81--kVsveqQ/hqdefault.jpg';
//             width: 480;
//             height: 360;
//           };
//         };
//         channelTitle: '𝑡ℎ𝑒 𝑛𝑖𝑔ℎ𝑡 𝑠𝑜𝑐𝑖𝑒𝑡𝑦';
//         liveBroadcastContent: 'none';
//         publishTime: '2020-07-13T12:15:23Z';
//       };
//     },
//     {
//       kind: 'youtube#searchResult';
//       etag: 'uNutlAtxfYfJQYNyqkrU3yNJY-8';
//       id: {
//         kind: 'youtube#video';
//         videoId: 'FKn7Zv6rtlg';
//       };
//       snippet: {
//         publishedAt: '2021-03-14T18:14:03Z';
//         channelId: 'UC9j8EtEcx-ah8bkxd2OqbgQ';
//         title: 'Songs to play on a late night summer road trip!';
//         description: "it's summer... you're driving with you hand out the window, and blasting these tunes with friends! Life is good. THE SPOTIFY ...";
//         thumbnails: {
//           default: {
//             url: 'https://i.ytimg.com/vi/FKn7Zv6rtlg/default.jpg';
//             width: 120;
//             height: 90;
//           };
//           medium: {
//             url: 'https://i.ytimg.com/vi/FKn7Zv6rtlg/mqdefault.jpg';
//             width: 320;
//             height: 180;
//           };
//           high: {
//             url: 'https://i.ytimg.com/vi/FKn7Zv6rtlg/hqdefault.jpg';
//             width: 480;
//             height: 360;
//           };
//         };
//         channelTitle: 'UselessClout';
//         liveBroadcastContent: 'none';
//         publishTime: '2021-03-14T18:14:03Z';
//       };
//     }
//   ];
// };

// export type YoutubeError = {
//   error: {
//     code: 400;
//     message: 'API key not valid. Please pass a valid API key.';
//     errors: [
//       {
//         message: 'API key not valid. Please pass a valid API key.';
//         domain: 'global';
//         reason: 'badRequest';
//       }
//     ];
//     status: 'INVALID_ARGUMENT';
//     details: [
//       {
//         '@type': 'type.googleapis.com/google.rpc.ErrorInfo';
//         reason: 'API_KEY_INVALID';
//         domain: 'googleapis.com';
//         metadata: {
//           service: 'youtube.googleapis.com';
//         };
//       }
//     ];
//   };
// };
