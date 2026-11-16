export type SurveyDomainId = 'domain1' | 'domain2' | 'domain3';

export interface SurveyScaleOption {
  score: 5 | 4 | 3 | 2 | 1;
  label: string;
  shortLabel: string;
}

export interface SurveyItem {
  id: string;
  number: number;
  domainId: SurveyDomainId;
  text: string;
}

export interface SurveyDomain {
  id: SurveyDomainId;
  title: string;
  items: SurveyItem[];
}

export const SURVEY_TITLE =
  'แบบประเมินความพึงพอใจต่อการใช้นวัตกรรม Cardiosim: Heart Hero Simulation';
export const SURVEY_SUBTITLE =
  'สำหรับนักศึกษาพยาบาล จำนวน 10 ข้อ มาตราส่วน 5 ระดับ (Likert Scale)';
export const SURVEY_INSTRUCTION =
  'โปรดอ่านแต่ละข้อความและเลือกระดับความพึงพอใจของท่านตามความรู้สึกที่มีต่อ “โปรแกรมการให้ข้อมูล” ใช้ระดับคะแนนดังนี้';

export const SURVEY_SCALE_OPTIONS: SurveyScaleOption[] = [
  { score: 5, label: 'มีความพึงพอใจมากที่สุด', shortLabel: 'มากที่สุด' },
  { score: 4, label: 'มีความพึงพอใจมาก', shortLabel: 'มาก' },
  { score: 3, label: 'มีความพึงพอใจปานกลาง', shortLabel: 'ปานกลาง' },
  { score: 2, label: 'มีความพึงพอใจน้อย', shortLabel: 'น้อย' },
  { score: 1, label: 'มีความไม่พึงพอใจเลย', shortLabel: 'ไม่พึงพอใจเลย' },
];

export const SURVEY_DOMAINS: SurveyDomain[] = [
  {
    id: 'domain1',
    title: 'ด้านที่ 1 ความชัดเจนของเนื้อหาและความเข้าใจ',
    items: [
      { id: 'q1', number: 1, domainId: 'domain1', text: '1. วิดีทัศน์ให้ข้อมูลเข้าใจง่ายและไม่ซับซ้อน' },
      { id: 'q2', number: 2, domainId: 'domain1', text: '2. ข้อมูลในวิดีทัศน์ตรงกับความเป็นจริงที่ได้พบ' },
      { id: 'q3', number: 3, domainId: 'domain1', text: '3. ภาพและข้อความในเกม อ่านเข้าใจง่ายและใช้ภาษาชัดเจน' },
      { id: 'q4', number: 4, domainId: 'domain1', text: '4. ภาพและข้อความในเกมช่วยให้เห็นภาพขั้นตอนการพยาบาล' },
      { id: 'q5', number: 5, domainId: 'domain1', text: '5. เนื้อหาในเกมช่วยให้ฉันเข้าใจการพยาบาลผู้ป่วย' },
    ],
  },
  {
    id: 'domain2',
    title: 'ด้านที่ 2 การลดความวิตกกังวลก่อนขึ้นฝึกปฏิบัติ',
    items: [
      {
        id: 'q6',
        number: 6,
        domainId: 'domain2',
        text: '6. ฉันรู้สึกมีความมั่นใจในการพยาบาลผู้ป่วยมากขึ้นหลังได้ชมวิดีทัศน์และเล่นเกม',
      },
      { id: 'q7', number: 7, domainId: 'domain2', text: '7. ฉันรู้สึกกังวลน้อยลงหลังเล่นเกม Cardio-sim' },
      {
        id: 'q8',
        number: 8,
        domainId: 'domain2',
        text: '8. การฝึกสถานการณ์การพยาบาลผู้ป่วยช่วยให้รู้สึกมั่นใจในการนำไปปฏิบัติมากขึ้น',
      },
    ],
  },
  {
    id: 'domain3',
    title: 'ด้านที่ 3 ความพึงพอใจโดยรวมและความตั้งใจใช้ต่อ',
    items: [
      { id: 'q9', number: 9, domainId: 'domain3', text: '9. โดยรวมฉันพึงพอใจกับเกม Cardio-sim' },
      {
        id: 'q10',
        number: 10,
        domainId: 'domain3',
        text: '10. ฉันรู้สึกว่าได้รับคำแนะนำ และสนับสนุนให้เล่นเกม Cardio-sim จากผู้พัฒนา',
      },
    ],
  },
];

export const ALL_SURVEY_ITEMS: SurveyItem[] = SURVEY_DOMAINS.flatMap((d) => d.items);

export interface SurveySummary {
  answeredCount: number;
  totalItems: number;
  domainMeans: Record<SurveyDomainId, number | null>;
  overallMean: number | null;
}

function meanOf(values: number[]): number | null {
  if (values.length === 0) return null;
  const sum = values.reduce((acc, v) => acc + v, 0);
  return Number((sum / values.length).toFixed(2));
}

/**
 * Computes answered count, per-domain means, and overall mean from raw survey scores.
 */
export function computeSurveySummary(surveyScores: Record<string, number>): SurveySummary {
  const domainMeans = {} as Record<SurveyDomainId, number | null>;
  const allValues: number[] = [];

  for (const domain of SURVEY_DOMAINS) {
    const scores = domain.items
      .map((item) => surveyScores[item.id])
      .filter((v): v is number => typeof v === 'number' && v >= 1 && v <= 5);
    domainMeans[domain.id] = meanOf(scores);
    allValues.push(...scores);
  }

  return {
    answeredCount: allValues.length,
    totalItems: ALL_SURVEY_ITEMS.length,
    domainMeans,
    overallMean: meanOf(allValues),
  };
}
