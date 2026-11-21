# CardioSim: Heart Hero Simulation — Project Checklist

> **อัปเดตล่าสุด:** 21 พฤศจิกายน 2026 (อัปเดตบน branch `tankun/cardiosim-dev`)  
> **Branch:** `tankun/cardiosim-dev` (แตกจาก `codex/cardiosim-game-module` commit `6c982e0`)  
> **Public Trial URL:** https://cardiosim-heart-hero-trial-0032640.navyball41.chatgpt.site *(เผยแพร่ถึงรุ่นที่ 5 จาก commit `6e9ae03`)*

---

## สรุปภาพรวมความคืบหน้า (Progress Summary)

| หมวดงาน | สถานะโดยรวม | ทำแล้ว (`[x]`) | ยังไม่ได้ทำ / รอดำเนินการ (`[ ]`) |
| :--- | :---: | :---: | :---: |
| 1. เส้นทางเว็บหลัก (Entry, Pre-test, ใบความรู้, เลือกเคส) | 🟡 ใช้งานได้ / รอสื่อ & รับรอง | 6 | 5 |
| 2. ตัวเกม Case 1 (`verticalSlice.ts`) | 🟡 เล่นจบได้ + มีเอกสารเทียบฉบับแก้ไขแล้ว | 10 | 8 |
| 3. ตัวเกม Case 2 (`case02.ts`) | 🟡 นำเข้าแล้วส่วนใหญ่ (โหมดรอบฝึก) | 9 | 6 |
| 4. Post-test, สรุปผล, ใบประกาศ, แบบประเมิน & Export วิจัย | 🟢 ระบบโค้ดครบ (เหลือเฉพาะเกณฑ์/เฉลยจากอาจารย์) | 16 | 3 |
| 5. สื่อ ภาพเวชนิทัศน์ เสียง และ Asset Provenance | 🟡 ภาพหลักครบ / ขาด ECG Strip & วิดีโอ | 7 | 7 |
| 6. การตรวจรับรองทางคลินิก (`docs/clinical-review/`) | 🔴 รอผู้เชี่ยวชาญลงมติ (0/40 รายการ) | 5 | 14 |
| 7. การทดสอบ (QA) และการเผยแพร่ (Release & Hosting) | 🟢 ผ่าน 25 Unit + ครบทุก E2E (`test:entry` / `test:postgame` / `test:game:browser`) | 10 | 5 |

---

## หมวด 1: เส้นทางเว็บหลัก (Entry → Pre-test → ใบความรู้ → เลือกเคส)

### ✅ ทำแล้ว
- [x] **หน้าปกและหน้า Login (`src/components/stages/Stage0Landing.tsx`)** — รองรับกรอกรหัสนักศึกษา, ชื่อ–นามสกุล, สถาบัน พร้อมภาพประกอบจากเวชนิทัศน์และปุ่มทดสอบพิมพ์ใบประกาศ (`/?test=certificate`)
- [x] **ตั้งค่าสถาบันเริ่มต้นเป็น `คณะพยาบาลศาสตร์ มหาวิทยาลัยขอนแก่น`** ใน `src/App.tsx`, `src/components/stages/Stage0Landing.tsx`, `src/components/common/CertificateModal.tsx` (`f928495`)
- [x] **ระบบทำแบบทดสอบก่อนเรียน Pre-test 10 ข้อ (`src/components/stages/Stage1PreTest.tsx`, `src/data/preTestData.ts`)** — เลือกคำตอบ ย้อนกลับ/ถัดไป และคำนวณคะแนนได้ครบ
- [x] **คลังใบความรู้ 6 หัวข้อแบบอ่านได้ (`src/components/stages/Stage2LearningHub.tsx`, `src/data/learningVideosData.ts`)** — แสดงสรุป + ประเด็นทบทวน + ติ๊กบันทึกว่าอ่านแล้ว/ยกเลิกได้ + รองรับมือถือและคีย์บอร์ด (`d5b9359`)
- [x] **หน้าเลือกสถานการณ์ 2 เคส (`src/components/stages/Stage3ScenarioSelect.tsx`)** — เชื่อมเข้า `game.html?case=case-01&from=web` และ `game.html?case=case-02&from=web` พร้อมส่งข้อมูลผู้เรียนผ่าน bridge (`src/types/cardioGameBridge.ts`)
- [x] **อัปเดตการ์ดเรื่องย่อ Case 2 บนหน้าเลือกเคส** ให้ตรงกับเอกสารใหม่ (ชาย 68 ปี AF with RVR ร่วมกับภาวะหัวใจล้มเหลวกำเริบ) (`84ee2b6`)

### ⬜ ยังไม่ได้ทำ / รอดำเนินการ
- [ ] **อัปเดตการ์ดเรื่องย่อ Case 1 ใน `Stage3ScenarioSelect.tsx`** — ปัจจุบันยังแสดงเรื่องย่อเก่า (`หญิงไทย 39 ปี · HT, DM, Dyslipidemia`) ยังไม่ตรงกับเอกสารแก้ไขแล้ว (`เนื้อหาเกมส์สถานการณ์ ที่ 1 แก้ไขแล้ว.pdf`: หญิง 65 ปี Chronic HF + HT)
- [ ] **นำเข้า Template ใบความรู้ `05_Templateใบความรู้`** ลง `Stage2LearningHub.tsx` (ปัจจุบันใช้กรอบกระดาษกับภาพ clipboard แทนชั่วคราว)
- [ ] **ใส่วิดีทัศน์การเรียนรู้จริง 6 หัวข้อ** ลง `Stage2LearningHub.tsx` (ปัจจุบันขึ้นหมายเหตุ *"วิดีโอประกอบยังไม่พร้อมให้รับชม"*)
- [ ] **ส่งตรวจและรับรองโจทย์-เฉลย Pre-test 10 ข้อ** โดยผู้เชี่ยวชาญ (`CLIN-12`, `PRE-01`–`PRE-10`)
- [ ] **ส่งตรวจและรับรองเนื้อหาใบความรู้ 6 หัวข้อ** โดยอาจารย์ผู้รับผิดชอบ (`KNOW-01`–`KNOW-06`)

---

## หมวด 2: ตัวเกมจำลองห้องผู้ป่วย — Case 1 (`src/game/cases/verticalSlice.ts`)

### ✅ ทำแล้ว
- [x] **สถาปัตยกรรมห้องผู้ป่วยเดียว (`PatientRoomScene` + `CaseEngine`)** — เล่นต่อเนื่องตั้งแต่ Normal Stage → Emergency Stage → Stabilized → Mission Result โดยไม่ต้องสลับหน้า
- [x] **ระบบซักประวัติและตรวจร่างกายข้างเตียง** (`CASE_INTRO`, `PATIENT_INFORMATION`, `ASSESSMENT`) — ลาก/แตะ Stethoscope, BP cuff, SpO₂ ลงจุดผู้ป่วย และบันทึกผลลง Patient Chart แบบซ่อนจนกว่าจะตรวจพบ
- [x] **ระบบจัดวางการ์ดวินิจฉัยและการพยาบาล** (`DIAGNOSIS`, `NURSING_INTERVENTION`) — รองรับลากวาง/แตะ ย้ายช่อง กด Confirm และลองใหม่ (`DecisionBoard.tsx`)
- [x] **สถานีเตรียมยาแบบโต้ตอบได้** (`MEDICATION` · `MedicationStation.tsx`, `ObjectWorkbench.tsx`, `SyringeWithdrawalMinigame.tsx`) — มีขั้นตอนเตรียมยา 7 ขั้น, สเกลดูดยา Syringe ที่รองรับมือถือ/เมาส์/คีย์บอร์ด (`43dcf1a`)
- [x] **ปรับช่องผลข้างเคียงยา Case 1 เป็นโหมด `record-only`** (`0032640`) เพื่อไม่บังคับเฉลยเพียง `Hypotension` ระหว่างรอผู้เชี่ยวชาญตัดสิน (`CLIN-02`)
- [x] **บอร์ดคำนวณสารน้ำเข้า-ออก** (`IO_BALANCE` · `IOBalanceBoard.tsx`) — ลากรายการลงโซน Intake/Output + คำนวณตัวเลขและเลือก Positive/Negative
- [x] **ช่วงฉุกเฉินและการประเมิน ABC ตามลำดับ** (`EMERGENCY_TRANSITION`, `ABC_ASSESSMENT`) — เปลี่ยนสีหน้า/อาการผู้ป่วย, จอมอนิเตอร์แจ้งเตือน และบังคับตรวจ A → B → C
- [x] **มินิเกมติด 12-Lead ECG (V1–V6) บนผังทรวงอกจากเวชนิทัศน์** (`ECG_PLACEMENT` · `ECGMobileProcedure.tsx`) — รองรับลากวาง, แตะเลือก-วาง, ย้ายตำแหน่ง และ Confirm (`401c0f8`)
- [x] **สร้างเอกสารเทียบเนื้อหา Case 1 โค้ดเดิม vs ฉบับแก้ไขแล้ว และสรุปจุดขัดแย้ง 3 จุดในเอกสารผู้ทรงคุณวุฒิ** (`docs/case1-revision-and-expert-gap.md`)
- [x] **ระบบเซฟอัตโนมัติ Checkpoint & Resume** (`src/game/core/checkpoint.ts`) และส่ง `GameResult` กลับหน้า Post-test

### ⬜ ยังไม่ได้ทำ / รอดำเนินการ
- [ ] **ย้ายเนื้อหา Case 1 จากร่างเดโมเดิม → ฉบับแก้ไขแล้ว** (`เนื้อหาsimulation/สถานการณ์ที่1/ไฟล์ pdf/เนื้อหาเกมส์สถานการณ์ ที่ 1 แก้ไขแล้ว.pdf` 14 หน้า):
  - [ ] อัปเดตข้อมูลผู้ป่วยจากหญิง 39 ปี → **หญิง 65 ปี** ประวัติ Chronic HF + HT, น้ำหนักเพิ่ม 3 กก. ใน 1 สัปดาห์, ขาบวม Pitting edema 2+, JVP โป่ง, Bibasal fine crackles
  - [ ] แทนที่การ์ด Diagnosis/Care เดโม (`ประเด็นด้านการหายใจ · ตัวอย่าง`, `จัดท่าผู้ป่วยตามแผน`) ด้วย **ข้อวินิจฉัยจริง 4 ข้อ + ข้อมูลสนับสนุน + แผนการพยาบาลจริง 4 ข้อ** ตามเอกสารหน้า 4–7
  - [ ] อัปเดตข้อมูล I/O 24 ชม. จากเดโม `-200 mL` → ค่าตามเอกสารฉบับแก้ไข (`Negative fluid balance -1,500 mL`)
  - [ ] อัปเดตขั้นประเมินช่วงฉุกเฉินให้ครอบคลุม **A–B–C–D–E** (เพิ่ม D-Disability และ E-Exposure ตามเอกสารหน้า 11)
- [ ] **ยืนยันความเข้มข้นและเฉลยปริมาณยา Furosemide 4 mL** (`CLIN-01`)
- [ ] **กำหนดเฉลย/เกณฑ์ให้คะแนนช่องผลข้างเคียงยา Case 1** แล้วเปลี่ยนจาก `record-only` เป็นตรวจคะแนนจริง (`CLIN-02`)
- [ ] **ยืนยันภาพคลื่น ECG / การตีความ SVT และขอบเขตแผนฉุกเฉิน + ค่าฟื้นตัว** (`CLIN-03`–`CLIN-08`)
- [ ] **เปลี่ยนสถานะ Case 1 จาก `DEMO DATA` เป็นผ่านการรับรองทางคลินิก** หลังผู้เชี่ยวชาญอนุมัติครบ (`CLIN-01`–`CLIN-09`, `CASE-1`)

---

## หมวด 3: ตัวเกมจำลองห้องผู้ป่วย — Case 2 (`src/game/cases/case02.ts`)

### ✅ ทำแล้ว
- [x] **โครงสร้างเคส 2 ใน Registry** (`case-02-acute-decompensated-heart-failure`) พร้อมเล่นจบครบเส้นทางในโหมดรอบฝึกไม่คิดคะแนน (`gradable: false`)
- [x] **นำเข้าข้อมูลแรกรับและผลตรวจร่างกาย หน้า 2–4** (`84ee2b6`) — ชาย 68 ปี AF with RVR, แรกรับ PR 148, BP 156/92, RR 28, SpO₂ 90% RA และช่วงประเมิน HR 144, BP 148/88, RR 26, SpO₂ 90% RA, fine crackles, pitting edema 2+
- [x] **นำเข้ากิจกรรมข้อวินิจฉัย 4 ข้อ + ข้อมูลสนับสนุน 4 ช่อง + ตัวลวง (หน้า 7–10)** (`6e9ae03`)
- [x] **นำเข้ากิจกรรมจับคู่การพยาบาล 4 ข้อกับตัวเลือก 6 ข้อ (หน้า 11–13)** (`6e9ae03`)
- [x] **นำเข้า Doctor Order ยา Amiodarone + คำถามผลข้างเคียงและการเฝ้าระวัง (หน้า 14–16)** (`b380c3e`)
- [x] **นำเข้ากิจกรรม I/O 24 ชม. หน้า 17** (`b380c3e`) — น้ำดื่ม 1,000 mL + IV 300 mL − ปัสสาวะ 600 mL = `+700 mL` (Positive fluid balance)
- [x] **ปรับช่วงฉุกเฉินเมื่อคลำชีพจรไม่พบให้ค่า Vital Signs เป็นค่าว่าง** (`null`) เพื่อไม่คงค่าเดิมจากช่วงประเมิน (`84ee2b6`)
- [x] **เพิ่มขั้นบันทึกเริ่ม CPR ทันทีก่อนเข้ากิจกรรมฝึก EKG** พร้อมการ์ดข้อความช่วยชีวิต 4 ใบ (`เริ่ม CPR ทันที`, `เตรียม Defibrillator และ Emergency Trolley`, `เรียกทีมฉุกเฉิน`, `ติดตาม EKG และสัญญาณชีพ`) ตามคำยืนยันทีม 18 พ.ย. (`3696904`)
- [x] **รองรับการ migrate เซฟเก่า (legacy checkpoints)** ของ Case 2 ไม่ให้ผู้เล่นที่เซฟค้างไว้เสียความคืบหน้า (`b380c3e`, `84ee2b6`, `6e9ae03`)

### ⬜ ยังไม่ได้ทำ / รอดำเนินการ
- [ ] **อัปเดตข้อความผลประเมิน A (Airway) และ B (Breathing) ใน `case02.ts`** — ปัจจุบันยังเป็นข้อความเก่าจากเรื่องย่อ (*"เรื่องย่อไม่มีผลตรวจทางเดินหายใจ"*)
- [ ] **เพิ่ม/ตรวจสอบขั้นประเมิน D – Disability และ E – Exposure** ช่วงฉุกเฉินตามเอกสารสถานการณ์ที่ 2 หน้า 10
- [ ] **เพิ่มภาพคลื่น ECG ของ Case 2 (`AF with RVR` และ `Ventricular Tachycardia` ช่วงฉุกเฉิน)** — ปัจจุบัน `monitorTraces = undefined` และบันทึกใน `CLIN-10` ว่า *"ภาพคลื่น ECG ยังรอจากทีม"*
- [ ] **อัปเดตด่านอ่านผล ECG (`ECG_INTERPRETATION`)** ของ Case 2 จากช่องพิมพ์ข้อความว่างเป็นตัวเลือก/เฉลยจริงเมื่อได้ภาพคลื่นที่รับรอง
- [ ] **เคลียร์เงื่อนไขกิจกรรมเลือกยา 20 คะแนนและลำดับคะแนนการ์ด** กับเจ้าของเคสตาม `CLIN-10`
- [ ] **เปิดระบบตรวจถูกผิดและให้คะแนนจริง (`gradable: true` + `expected`)** เมื่อผู้เชี่ยวชาญอนุมัติ `CLIN-10` และ `CASE-2`

---

## หมวด 4: Post-test, สรุปผล, ใบประกาศ, แบบประเมิน และส่งออกข้อมูลวิจัย

### ✅ ทำแล้ว
- [x] **แบบทดสอบหลังเรียน Post-test 10 ข้อ (`src/components/stages/Stage14PostTest.tsx`, `src/data/postTestData.ts`)** — คำนวณคะแนน Post-test และ Hake's Normalized Learning Gain (`calculateHakeGain`)
- [x] **สร้างใบประกาศนียบัตรแบบพิมพ์ได้ตรงต้นฉบับ PDF (`src/components/common/CertificateModal.tsx`)** (`1c7eadc`, `f928495`):
  - [x] ใช้กรอบจริงพร้อมตรา **คณะพยาบาลศาสตร์ มหาวิทยาลัยขอนแก่น** (`public/assets/ui/certificate-frame.webp`)
  - [x] ระบุชื่ออาจารย์ที่ปรึกษาโครงการทั้ง 2 ท่านตรงตาม PDF (`รศ.ดร.วาสนา รวยสูงเนิน` และ `ผศ.ดร.มะลิวรรณ ศิลารัตน์`)
  - [x] แก้บั๊ก Print CSS ที่เคยทำให้สั่งพิมพ์เป็นหน้าขาว (ย้าย `.certificate-no-print` ออกจากกล่องแม่) (`f928495`)
  - [x] Sync ข้อมูลชื่อ/รหัส/สถาบันผู้เรียนอัตโนมัติเมื่อเปิด Modal และให้แก้ไขชื่อก่อนพิมพ์ได้ (`f928495`)
- [x] **อัปเกรดแบบประเมินความพึงพอใจ 10 ข้อ 3 ด้านตรงตาม PDF ของคณะ (`src/data/surveyData.ts`, `src/components/stages/Stage16Survey.tsx`)** (`6f94f4f`):
  - [x] ครบทั้ง 3 ด้าน (ด้าน 1 ข้อ 1–5, ด้าน 2 ข้อ 6–8, ด้าน 3 ข้อ 9–10) มาตราส่วน Likert 5 ระดับ
  - [x] ยกเลิกการ pre-fill คำตอบตั้งต้น + บังคับตอบครบ 10 ข้อก่อนส่ง + แสดงค่าเฉลี่ยรายด้านและภาพรวม
- [x] **อัปเดตตัวส่งออกข้อมูลวิจัย CSV/JSON (`src/services/researchExporter.ts`)** ให้มีคอลัมน์ `survey_q1`–`survey_q10`, ค่าเฉลี่ยรายด้าน/รวม, `feedback_text` (พร้อม CSV quote escaping และ UTF-8 BOM สำหรับ Excel/SPSS) (`6f94f4f`)
- [x] **เพิ่ม Unit Test ของแบบประเมิน, หน้าสรุปผล และตัวส่งออก CSV** (`src/game/tests/survey.test.ts`, `resultsSummary.test.ts`, `researchExporter.test.ts`)
- [x] **ปรับ Print Engine ใบประกาศเป็น React Portal (`document.body`) + สัดส่วน margin แบบเปอร์เซ็นต์ และตรวจ Print PDF จริงด้วย Playwright** — ออกเป็น A4 แนวนอน **1 หน้าเป๊ะ** ไม่ทับคลื่นล่าง ไม่เป็นหน้าขาว (`src/components/common/CertificateModal.tsx`, `scripts/test-postgame-certificate-survey.mjs`)
- [x] **เพิ่มมุมมองใบประกาศแบบ PDF-viewer บนมือถือ (`พอดีจอ` เต็มหน้า + แตะใบประกาศหรือกดปุ่ม `ขยายดูชื่อ` / `+` / `-` เพื่อซูม)** (`src/components/common/CertificateModal.tsx`)
- [x] **ส่ง `telemetry` (พร้อม `gameResult` จริง) จาก `src/App.tsx` เข้า `Stage15Results.tsx`** และยกเลิกค่า default ปลอม (`preTestScore: 4`, `totalTimeSeconds: 1240`, `ncjmmScores: 95/90`) ในโหมดเล่นจริง
- [x] **อัปเกรด `Stage15Results.tsx` + `src/data/resultsSummary.ts` ให้รองรับทั้ง Case 1 และ Case 2** — แสดงชื่อเคส สถานะเดโม/รอบฝึก สถิติจริงจากห้องผู้ป่วย และ Milestones แยกตามเคส (เลิก hardcode NCJMM 90.8% และ `-200 mL` / `SVT`)
- [x] **เพิ่มคอลัมน์ผลเล่นเกมจริงจาก `telemetry.gameResult` ลง CSV/JSON Export (`src/services/researchExporter.ts`)** (`case_id`, `game_score_status`, `game_demo_score`, `game_duration_minutes`, `game_attempts`, `game_mistakes`, `game_hints`, `game_findings_count`, `student_institution`) พร้อมเอา fallback NCJMM ปลอมออก

### ⬜ ยังไม่ได้ทำ / รอดำเนินการ
- [ ] **ผูกเกณฑ์การผ่านเพื่อปลดล็อกใบประกาศนียบัตร** ใน `Stage15Results.tsx` / `CertificateModal.tsx` *(รอข้อสรุปเกณฑ์จากอาจารย์ใน `CLIN-10`)*
- [ ] **ส่งตรวจและรับรองโจทย์-เฉลย Post-test 10 ข้อ** โดยผู้เชี่ยวชาญ (`CLIN-12`, `POST-01`–`POST-10`)
- [ ] **สรุปช่องทางรวบรวมข้อมูลวิจัยส่วนกลาง** (นักศึกษาดาวน์โหลด CSV ส่งเอง vs ส่งอัตโนมัติเข้า Google Sheets/Form/Backend)

---

## หมวด 5: สื่อ ภาพเวชนิทัศน์ เสียง และ Asset Provenance

### ✅ ทำแล้ว
- [x] **จัดระบบคลังภาพกลางแบบ Type-safe** (`public/assets/`, `src/constants/assets.ts`) (`1034579`, `9355603`)
- [x] **สกัดภาพเวชนิทัศน์จากชุด 01–04** — หน้าปก, หน้า Login, การ์ดเคส/ปุ่ม, ห้องผู้ป่วย, จอมอนิเตอร์, ถาดอุปกรณ์, Stethoscope, Syringe, แว่นขยาย, เอกสาร และไอคอนฉุกเฉิน (`5cba51d`, `58364b1`, `89b5800`)
- [x] **นำเข้าภาพผู้ป่วยแยกเลเยอร์ + เตียง + หมอน** จาก PSD ต้นฉบับ (`fe6c2c7`)
- [x] **สกัดผังทรวงอก ECG, ลีด V1–V6, แคลมป์หนีบแขนขา และอุปกรณ์เตรียมติด ECG** สำหรับลากวาง (`f68c790`, `5aa7a98`, `401c0f8`)
- [x] **นำเข้ากรอบเกียรติบัตรทางการ** (`public/assets/ui/certificate-frame.webp`) และ **ไอคอนหัวใจของแอป/เบราว์เซอร์** (`57f291f`, `1c7eadc`)
- [x] **ล้างภาพ AI/ภาพบุคคลที่สามออกจาก `public/`** เหลือเฉพาะภาพที่มีแหล่งที่มารับรองตามนโยบาย `docs/supplied-only-art.md` (`b7aafab`)
- [x] **ระบบตรวจสอบแหล่งที่มาและ SHA-256 ของทุกภาพ** (`docs/supplied-runtime-assets.json`, `scripts/export-supplied-runtime-manifest.py`, `src/game/tests/suppliedAssets.test.ts`)

### ⬜ ยังไม่ได้ทำ / รอดำเนินการ
- [ ] **ภาพคลื่น ECG Strip ที่ผู้เชี่ยวชาญรับรอง** สำหรับ Case 1 (SVT) และ Case 2 (AF with RVR / VT)
- [ ] **ภาพคนไข้แยกเฉพาะ Case 1 (หญิง)** — ปัจจุบันทั้ง 2 เคสใช้ภาพผู้ป่วยชุดเดียวกัน
- [ ] **ไฟล์ `05_Templateใบความรู้`** จากทีมเวชนิทัศน์
- [ ] **วิดีทัศน์ประกอบการเรียนรู้จริง 6 เรื่อง**
- [ ] **ภาพอุปกรณ์เสริมที่ยังขาดในชุดเวชนิทัศน์** — BP cuff, SpO₂ sensor, แอมพูลยา, เข็ม/สายรัดข้อมือแยกชิ้น (ปัจจุบันใช้ป้ายควบคุม HTML)
- [ ] **เสียงบรรยาย (Voiceover) และเสียงฟังปอด/หัวใจจริง** (ปัจจุบันใช้เสียงสังเคราะห์ใน `src/services/clinicalAudioEngine.ts`)
- [ ] **รัน `scripts/export-supplied-runtime-manifest.py` อัปเดต Manifest** ทุกครั้งที่มีการเพิ่มภาพใหม่เข้า `public/assets/`

---

## หมวด 6: การตรวจรับรองทางคลินิก (`docs/clinical-review/` — รวม 40 รายการ)

### ✅ ทำแล้ว
- [x] **นำเข้าเอกสารเนื้อหาต้นฉบับและไฟล์สำหรับผู้ทรงคุณวุฒิ** เข้าโฟลเดอร์ `เนื้อหาsimulation/` (`40030ae`)
- [x] **จัดทำชุดตรวจรับรองทางคลินิกที่ตรวจสอบย้อนกลับได้** (`docs/clinical-review/findings.md`, `questions.md`, `knowledge-topics.md`, `references.md`, `review-checklist.csv`, `content-snapshot.json`) (`b97a0a6`)
- [x] **สร้างสคริปต์ตรวจความตรงกันของ Snapshot & Source Hashes** (`npm run clinical:review:check` / `export`) (`b97a0a6`)
- [x] **บันทึกมติทีมผ่านแชตวันที่ 18 พ.ย. เรื่องลำดับประเมิน & เริ่ม CPR ทันทีใน Case 2** ลง `CLIN-10` (`3696904`)
- [x] **เทียบไฟล์เอกสารผู้ทรงคุณวุฒิที่มีแล้ว** (`สถานการ์ที่1.pdf` 6 หน้า และ `สถานการณ์ที่ 2.pdf` 5 หน้า) กับ `findings.md` และบันทึกจุดขัดแย้ง 3 จุดลง `docs/case1-revision-and-expert-gap.md`

### ⬜ ยังไม่ได้ทำ / รอดำเนินการ (ปัจจุบันอนุมัติ `0 / 40` รายการใน `review-checklist.csv`)
- [ ] **`CLIN-01`** — เภสัชกรยืนยันชื่อผลิตภัณฑ์ ความเข้มข้น และเฉลยปริมาณยา 4 mL (Case 1)
- [ ] **`CLIN-02`** — เภสัชกร/อาจารย์พยาบาลกำหนดคำตอบที่ยอมรับได้ในช่องผลข้างเคียงยา (Case 1)
- [ ] **`CLIN-03`** — แพทย์/เจ้าของเคสระบุสถานะทางเดินหายใจให้ชัดเจน (เคยใส่ท่อแล้วถอด หรือไม่เคยใส่)
- [ ] **`CLIN-04`** — แพทย์/อาจารย์พยาบาลยืนยันคำสั่ง O₂ เป้าหมาย SpO₂ และเกณฑ์เรียกทีม
- [ ] **`CLIN-05`** — ผู้เชี่ยวชาญ ECG ยืนยันคลื่น SVT/VT และโจทย์จังหวะหัวใจ
- [ ] **`CLIN-06`** — แพทย์/ผู้สอนกู้ชีพกำหนดขอบเขต initial nursing response vs แผน ACLS
- [ ] **`CLIN-07`** — เจ้าของเคสรับรองตัวเลขและลำดับเวลาการฟื้นตัวใน simulation
- [ ] **`CLIN-08`** — อาจารย์พยาบาลรับรองเกณฑ์การตีความสมดุลสารน้ำ I/O (แยกจากการคำนวณเลข)
- [ ] **`CLIN-09`** — อาจารย์พยาบาลและผู้วัดผลลงนาม Rubric ข้อวินิจฉัย/แผนการพยาบาล Case 1
- [ ] **`CLIN-10`** — เจ้าของเคส Case 2 ยืนยันเรื่องกิจกรรมเลือกยา 20 คะแนน, คะแนนการ์ด, ภาพคลื่น ECG และเกณฑ์ใบประกาศ
- [ ] **`CLIN-11`** — ผู้เชี่ยวชาญ ECG และทีมเวชนิทัศน์รับรองภาพและตำแหน่ง landmark V1–V6 ทั้งชุด
- [ ] **`CLIN-12` + `PRE-01`–`10` + `POST-01`–`10`** — ผู้เชี่ยวชาญเนื้อหาและการวัดผลรับรองข้อสอบครบ 20 ข้อ
- [ ] **`CASE-1` และ `CASE-2`** — อาจารย์พยาบาล/แพทย์ลงนามรับรองภาพรวมทั้ง 2 สถานการณ์
- [ ] **`KNOW-01`–`06`** — อาจารย์ผู้รับผิดชอบรับรองใบความรู้ทั้ง 6 หัวข้อ

---

## หมวด 7: การทดสอบ (QA) และการเผยแพร่ (Release & Hosting)

### ✅ ทำแล้ว
- [x] **Unit & Provenance Tests ผ่านครบ 25/25 ข้อ** (`npm run test:game`) รวมถึง `survey.test.ts`, `resultsSummary.test.ts`, `researchExporter.test.ts`, `suppliedAssets.test.ts`, `suppliedECG.test.ts`, `suppliedPatient.test.ts`, `pendingReview.test.ts`, `workbench.test.ts`, `verticalSlice.test.ts`
- [x] **TypeScript Check & Production Build ผ่าน** (`npm run typecheck`, `npm run build`)
- [x] **Clinical Snapshot Integrity Check ผ่าน** (`npm run clinical:review:check` → `PASS: 20 source hashes, 2 cases, 20 questions, 6 topics and 40 checklist rows`)
- [x] **ชุดทดสอบ E2E Entry ครบ 4 ขนาดจอ (1440 / 1024 / 768 / 390px)** (`npm run test:entry`) ผ่านทั้งหมด
- [x] **ชุดทดสอบ E2E Post-game (Case 1 + Case 2), Certificate Print PDF (1 หน้า A4) และ Survey CSV Download** (`npm run test:postgame`) ผ่านทั้งหมด
- [x] **ชุดทดสอบ Responsive & Touch บนมือถือ 390×844px** สำหรับ `Stage15Results`, `CertificateModal` และปุ่ม Likert 5 ระดับใน `Stage16Survey` (ไร้ horizontal overflow, touch target ≥ 44px) ผ่านใน `npm run test:postgame`
- [x] **ตรวจ parse ไฟล์ `.CSV` ที่ดาวน์โหลดจริงด้วย Python (`utf-8-sig`)** — ยืนยัน 2 แถว × 42 คอลัมน์ ภาษาไทยสมบูรณ์พร้อมใช้ใน Excel/SPSS
- [x] **ชุดทดสอบ E2E เส้นทาง Case 2 เต็มรูปแบบ (`npm run test:game:case2`)** ผ่านทั้งหมด
- [x] **ชุดทดสอบ E2E ตัวเกมเต็มเส้นทาง Case 1 + Case 2 + มือถือ (`npm run test:game:browser`)** ผ่านทั้งหมด (แก้ race condition ของ `skipStationClick` ใน `src/game/main.tsx` ที่เคยกลืนคลิก `.syringe-confirm` หลังลาก Syringe เรียบร้อยแล้ว)
- [x] **เผยแพร่เว็บทดลองสาธารณะถึงรุ่นที่ 5** (`docs/trial-hosting.md`, `docs/trial-hosting.json` — รวม Case 1, Case 2 หน้า 2–17 + CPR, ใบประกาศ และแบบประเมิน 10 ข้อ)

### ⬜ ยังไม่ได้ทำ / รอดำเนินการ
- [ ] **ทดสอบเปิดใช้งานจริงบนมือถือ iOS/Android** และเปิดไฟล์ `.CSV` ที่ดาวน์โหลดในโปรแกรม Excel/SPSS จริง
- [ ] **Merge งานจาก branch `tankun/cardiosim-dev` เข้า `codex/cardiosim-game-module`** เมื่อตรวจทานพร้อมกันแล้ว
- [ ] **เผยแพร่เว็บสาธารณะรุ่นที่ 6+ (`npm run trial:package` + Sites deploy)** โดยประสานกับ `sarunph-ctrl` เพื่อให้งานใบประกาศ มข. + หน้าสรุปผล + CSV Export ขึ้นเว็บจริง
- [ ] **Pilot Playtest กับนักศึกษาพยาบาลจริง** เพื่อเก็บข้อสังเกตด้านการใช้งาน (Usability) ก่อนเก็บข้อมูลวิจัยจริง
- [ ] **Merge งานที่ผ่านการรับรองแล้วเข้าสู่ branch `main`** (ปัจจุบัน `origin/main` ยังอยู่ที่ commit เก่า `48a46a9` ตั้งแต่วันที่ 25 ก.ย. 2026)
