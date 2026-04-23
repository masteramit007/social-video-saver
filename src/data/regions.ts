export interface RegionMeta {
  id: string;
  name: string;
  flag: string;
  title: string;
  description: string;
}

export const REGIONS: RegionMeta[] = [
  { id: 'china', name: 'China', flag: '🇨🇳', title: 'Chinese Video Downloaders — Bilibili, Douyin, Weibo & More', description: 'Download videos from Chinese platforms including Bilibili, Weibo, Kuaishou, and XiaoHongShu (Little Red Book).' },
  { id: 'india', name: 'India', flag: '🇮🇳', title: 'Indian Video Downloaders — ShareChat & Moj', description: 'Download videos from Indian platforms including ShareChat and Moj with content in 15+ Indian languages.' },
  { id: 'russia', name: 'Russia', flag: '🇷🇺', title: 'Russian Video Downloaders — VK, OK.ru, RuTube', description: 'Download videos from Russian platforms including VK (VKontakte), OK.ru (Odnoklassniki), and RuTube.' },
  { id: 'korea', name: 'Korea', flag: '🇰🇷', title: 'Korean Video Downloaders — Naver TV, AfreecaTV & CHZZK', description: 'Download videos from Korean platforms including Naver TV, AfreecaTV, and CHZZK (Naver streaming).' },
  { id: 'japan', name: 'Japan', flag: '🇯🇵', title: 'Japanese Video Downloaders — NicoNico Douga & Lemon8', description: 'Download videos from Japanese platforms including NicoNico Douga and Lemon8 lifestyle content.' },
  { id: 'brazil', name: 'Brazil & LATAM', flag: '🇧🇷', title: 'Brazilian & LATAM Video Downloaders — Kwai', description: 'Download videos from Brazilian and Latin American platforms, including Kwai which dominates short video in the region.' },
  { id: 'sea', name: 'Southeast Asia', flag: '🌏', title: 'Southeast Asia Video Downloaders — Likee & Bigo Live', description: 'Download videos from Southeast Asian platforms including Likee and Bigo Live.' },
  { id: 'turkey', name: 'Turkey', flag: '🇹🇷', title: 'Turkish Video Downloaders — Izlesene', description: 'Download videos from Turkey including Izlesene, one of the country\'s most popular video sharing platforms.' },
  { id: 'usa', name: 'USA', flag: '🇺🇸', title: 'USA-Origin Video Downloaders — Clapper & More', description: 'Download videos from US-origin alternative platforms like Clapper.' },
];

export const REGION_BY_ID: Record<string, RegionMeta> = REGIONS.reduce(
  (acc, r) => ({ ...acc, [r.id]: r }),
  {} as Record<string, RegionMeta>,
);
