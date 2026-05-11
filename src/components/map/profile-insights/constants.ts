/** צבעי פסים ולגנדה — מיושרים לכחולי המותג (#0070C0 וכהה/בינוני/בהיר) */
export const PROFILE_PALETTE = {
  profileA: '#0A4A7C',
  profileB: '#1579C8',
  profileC: '#9EC9EB',
} as const

export type ProfileKey = 'a' | 'b' | 'c'

export type ProfileSlice = {
  key: ProfileKey
  label: string
  color: string
  count: number
}

/** נתוני הדגמה — תואמים סדר ערכים כמו במסכים */
export const CITY_PROFILE_SLICES: ProfileSlice[] = [
  { key: 'a', label: "פרופיל א'", color: PROFILE_PALETTE.profileA, count: 4051 },
  { key: 'b', label: "פרופיל ב'", color: PROFILE_PALETTE.profileB, count: 2569 },
  { key: 'c', label: "פרופיל ג'", color: PROFILE_PALETTE.profileC, count: 980 },
]

export const CITY_PROFILE_TOTAL = CITY_PROFILE_SLICES.reduce((s, x) => s + x.count, 0)

export type NeighborhoodRow = {
  id: string
  name: string
  total: number
  /** חלקים יחסיים לפרופילים א׳–ג׳ (סכום ~1) */
  parts: [number, number, number]
}

export const MOCK_NEIGHBORHOODS: NeighborhoodRow[] = [
  { id: '1', name: 'קריית מנחם', total: 1249, parts: [0.52, 0.33, 0.15] },
  { id: '2', name: 'רמות אלון', total: 1221, parts: [0.5, 0.35, 0.15] },
  { id: '3', name: 'בית הכרם', total: 986, parts: [0.48, 0.34, 0.18] },
  { id: '4', name: 'קטמון', total: 902, parts: [0.55, 0.3, 0.15] },
  { id: '5', name: 'גילה', total: 756, parts: [0.45, 0.38, 0.17] },
]

export type TraitRow = { label: string; present: boolean }

export type ProfileTraitsBlock = {
  title: string
  cityCount: number
  traits: TraitRow[]
}

export const MOCK_PROFILE_TRAITS: ProfileTraitsBlock[] = [
  {
    title: "פרופיל א'",
    cityCount: 4051,
    traits: [
      { label: 'נשואים', present: false },
      { label: 'בעלי מוגבלויות', present: true },
    ],
  },
  {
    title: "פרופיל ב'",
    cityCount: 2569,
    traits: [
      { label: 'נשואים', present: false },
      { label: 'בעלי מוגבלויות', present: false },
      { label: 'אקדמאים', present: false },
      { label: 'בני 71 ומעלה', present: true },
      { label: 'הכנסה מעל 2,375 ₪', present: true },
    ],
  },
  {
    title: "פרופיל ג'",
    cityCount: 980,
    traits: [
      { label: 'נשואים', present: false },
      { label: 'בעלי מוגבלויות', present: false },
      { label: 'בני 71 ומעלה', present: true },
      { label: 'הכנסה מעל 2,375 ₪', present: false },
    ],
  },
]

