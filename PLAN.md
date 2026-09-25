# แผนผังและสถาปัตยกรรมระบบ CardioSim: Heart Hero Simulation
## เอกสารวิเคราะห์เปรียบเทียบ Storyboard กับโค้ดปัจจุบัน และแผนการพัฒนาระบบฉบับสมบูรณ์ (System Architecture & Roadmap Plan)

> **สถานะโครงการ:** อยู่ในขั้นตอนการวางแผนสถาปัตยกรรม (Architecture & Planning Phase) — *ยังไม่มีการแตะต้องหรือแก้ไขซอร์สโค้ดเดิม*  
> **อ้างอิงเอกสาร:** `6 Panel Storyboard.pdf` (จัดทำโดย Chonthida Okaphanome / Canva 9 หน้า) และ โค้ดฐานปัจจุบันของ CardioSim: Heart Hero (React 18 + TypeScript + Vite)  
> **วันที่จัดทำ:** 25 กันยายน 2026

---

## 1. บทสรุปการวิเคราะห์ภาพรวม (Executive Summary)

จากการวิเคราะห์เปรียบเทียบระหว่าง **Storyboard ทางการพยาบาล (`6 Panel Storyboard.pdf`)** และ **โค้ดฐานปัจจุบัน (Current Codebase ใน `src/`)** พบว่า:

1. **โครงสร้างหลักสอดคล้องกันสูงมาก (~75% Alignment):**
   - โค้ดปัจจุบันวางลำดับขั้นตอน 17 สเตจไว้ครอบคลุมกระบวนการตั้งแต่ Pre-test, Learning Hub, Scenario, Handover, Assessment, Prioritization, Medication, I/O, Crisis, Debrief, Post-test ไปจนถึง Results & Survey ไว้อย่างยอดเยี่ยม
   - ระบบเสียงการแพทย์ (Web Audio API), กราฟคลื่นไฟฟ้าหัวใจ (Canvas EKG), และอุปกรณ์จำลองเสมือนจริง (Interactive Bed, Syringe, Fluid Balance) ทำงานได้ดีมากและมีระดับความพรีเมียมสูงกว่าโครงร่างในสตอรี่บอร์ด
2. **จุดที่ Storyboard มี แต่ในโค้ดปัจจุบันยังขาด (Key Gaps):**
   - **ระบบสมาชิกและการยืนยันตัวตน (Sign Up / Auth):** สตอรี่บอร์ดกำหนดให้มีหน้าสมัครสมาชิก (Username, Student ID, Gmail, Password) เพื่อระบุตัวตนนักศึกษา
   - **แบบประเมินความมั่นใจ (Pre/Post Confidence Rating 0–10):** การวัดระดับความมั่นใจของนักศึกษาก่อนและหลังเรียน เพื่อประเมินผลสัมฤทธิ์
   - **คลังวิดีโอความรู้ (Learning Hub Video Player):** ในสตอรี่บอร์ดระบุว่า 6 หัวข้อมีวิดีโอ ("VIDO") พร้อมแถบความคืบหน้า 1/6 ถึง 6/6
   - **แถบเครื่องมือตรวจร่างกาย (Assessment Tool Bar):** มีเครื่องวัดความดัน, SpO2, EKG, หูฟัง, ปรับเตียง, ซักประวัติ
   - **มินิเกมแปะแผ่น EKG 12-Lead ในภาวะวิกฤต:** ลากสาย Chest Lead (V1–V6) แปะลงบนตำแหน่งกระดูกซี่โครงที่ถูกต้อง
   - **ฐานข้อมูลกลาง (Central Database):** ปัจจุบันเก็บใน Memory / LocalStorage เครื่องใครเครื่องมัน ยังไม่มีระบบรวบรวมข้อมูลนักศึกษาทั้งรุ่นส่งให้อาจารย์วิจัย
   - **ตารางจัดอันดับ (Leaderboard / Rank Score):** หน้าสรุปอันดับคะแนนของผู้เรียน

---

## 2. การวิเคราะห์เปรียบเทียบแบบรายหน้า (Detailed Storyboard vs. Code Gap Analysis)

| หน้าใน Storyboard | องค์ประกอบใน Storyboard | สถานะในโค้ดปัจจุบัน | สิ่งที่ต้องปรับปรุง / เพิ่มเติม |
| :--- | :--- | :--- | :--- |
| **หน้า 1: เริ่มต้น & ลงทะเบียน** | 1. Start Screen<br>2. Sign Up (User, Student ID, Gmail, Pass)<br>3. Pre-Confidence Rating (0–10 Slider) | `Stage0Landing.tsx` มีกรอกชื่อ, รหัส นศ., มหาวิทยาลัย | • เพิ่มฟิลด์ Gmail / รหัสผ่าน หรือระบบ Auth เข้าสู่ระบบ<br>• **เพิ่มหน้าย่อยแบบประเมินความมั่นใจก่อนเรียน (Confidence 0–10)** |
| **หน้า 1: Pre-test & Score** | 1. Pre-Test 10 ข้อ (4 ตัวเลือก)<br>2. หน้าสรุปคะแนน Pre-test Score ("Are you ready...?") | `Stage1PreTest.tsx` มีข้อสอบ 10 ข้อครบแล้ว | • ปัจจุบันทำเสร็จแล้วกระโดดไป Learning Hub ทันที → ควรเพิ่มหน้าแสดงผลคะแนน Pre-test ขั้นกลางตาม Storyboard |
| **หน้า 1-3: Learning Hub** | คลังความรู้ 6 หัวข้อ เรียงลำดับ 1–6<br>มีแถบความคืบหน้า `__/6`<br>มีหน้าดูวิดีโอ 6 หน้า (VIDO) | `Stage2LearningHub.tsx` มีเนื้อหา 6 หมวดเป็นข้อความ/การ์ด | • เพิ่มตัวเล่นวิดีโอ (Embedded Video / HTML5 Video Player)<br>• บันทึก Progress `__/6` เพื่อปลดล็อกปุ่มเข้าสู่สถานการณ์ |
| **หน้า 3: เลือกสถานการณ์ & Brief** | 1. เลือกเคส 1 หรือเคส 2 ได้อิสระ<br>2. หน้า Confirm Case<br>3. หน้า Mission Overview (Normal + Emergency) | `Stage3ScenarioSelect.tsx`<br>`Stage4MissionBrief.tsx`<br>`Stage5Handover.tsx` | • ปัจจุบันทำเคสที่ 1 (Hypertensive Heart Failure) เสร็จสมบูรณ์แล้ว<br>• เตรียมโครงสร้างข้อมูลสำหรับเคสที่ 2 (ADHF with Fluid Overload) |
| **หน้า 3-4: ตรวจร่างกาย (Assessment)** | 1. คนไข้นอนบนเตียง + จอมอนิเตอร์ Vitals ซ้ายมือ<br>2. **Tool Bar ล่าง:** วัดความดัน, SpO2, EKG, หูฟัง, ปรับเตียง, ซักประวัติ<br>3. แตะตรวจร่างกายแล้วแสดงผลตามเครื่องมือ | `Stage6Assessment.tsx`<br>`InteractivePatientBedSVG.tsx`<br>`FloatingClinicalDock.tsx` | • ในโค้ดปัจจุบันมี `InteractivePatientBedSVG` ฟังเสียงปอด/หัวใจ/บวมแล้ว<br>• **ควรเพิ่มลูกเล่นแถบ Tool Bar ด้านล่าง** ให้กดเลือกเครื่องมือก่อนแล้วนำไปจิ้มตรวจร่างกายตาม Storyboard |
| **หน้า 4: Nursing Diagnosis** | 2 คอลัมน์: ปัญหาพยาบาล vs ข้อมูลสนับสนุน (Cues)<br>ลากวางจับคู่ (Drag & Drop) ตรวจถูก/ผิด (เขียว/แดง) | `Stage7Prioritization.tsx`<br>`Stage8Rationale.tsx` | • โค้ดปัจจุบันมีการจัดลำดับและจับคู่เหตุผลแล้ว ตรงกับคอนเซ็ปต์มาก |
| **หน้า 5: วางแผนการพยาบาล** | ดึงข้อวินิจฉัยที่เลือกมาวางแผนการพยาบาล<br>ลากคำตอบจากขวามาใส่ช่อง ยืนยัน เขียว/แดง | `Stage9ActionABC.tsx` | • ปรับ UI ให้เป็นการลากการพยาบาลมาจับคู่กับข้อวินิจฉัยให้ชัดเจนยิ่งขึ้น |
| **หน้า 5: บริหารยา (Medication)** | 1. กดดู Doctor Order<br>2. คำนวณปริมาณยาเป็นตัวเลข "... mL"<br>3. เลือก Side Effect & ข้อเฝ้าระวัง (Dropdown A,B,C,D) | `Stage10Medication.tsx`<br>`FurosemideSyringeVisualizer.tsx` | • โค้ดปัจจุบันมีไซริงค์ดูดยา Furosemide ยอดเยี่ยมมาก<br>• **ควรเพิ่มตัวเลือก Side Effect (ผลข้างเคียง) และ การเฝ้าระวัง** ตามแบบใน Storyboard หน้า 5 |
| **หน้า 6: สารน้ำ Intake/Output** | 1. แสดงรายการ I/O<br>2. ให้ผู้เรียนเลือกว่าเป็น **Positive หรือ Negative**<br>3. ลากเลือกการพยาบาลตามผล I/O | `Stage11IORecord.tsx`<br>`FluidBalanceVisualizer.tsx` | • ปัจจุบันคำนวณตัวเลขสุทธิแล้ว<br>• **เพิ่มปุ่มกดตัดสินใจ Positive / Negative** ก่อนเฉลยตาม Storyboard |
| **หน้า 6-7: ภาวะวิกฤต (Emergency)** | 1. สัญญาณเตือนผู้ป่วยทรุดลง<br>2. ประเมิน ABC Checklist บนตัวคนไข้<br>3. **มินิเกมติด EKG Chest Lead (V1–V6) บนทรวงอก**<br>4. อ่านคลื่น EKG และพิมพ์ชื่อจังหวะหัวใจ (SVT)<br>5. ลากไอคอนการพยาบาลฉุกเฉิน | `Stage12CrisisEvent.tsx` | • โค้ดปัจจุบันมี Red Vignette, Alarm, SVT Canvas, และช้อยส์ ACLS<br>• **สิ่งที่ควรเพิ่ม:** มินิเกมลากแผ่น Electrode V1-V6 ไปติดบนตัวคนไข้ และช่องพิมพ์ตอบจังหวะหัวใจ |
| **หน้า 7: Post-Test** | ข้อสอบ 10 ข้อ + หน้าคะแนน Post-Test Score | `Stage14PostTest.tsx` | • มีข้อสอบ 10 ข้อและคำนวณคะแนนแล้ว |
| **หน้า 8: ประเมิน & สรุปผล** | 1. Post-Confidence Rating (0–10)<br>2. แบบประเมินความพึงพอใจ 5 ข้อ (Likert)<br>3. สรุปผลรวม & คะแนน Pre/Post<br>4. Rank Score (ตารางอันดับ)<br>5. หน้า Thank You & ดาวน์โหลด Certificate | `Stage15Results.tsx`<br>`Stage16Survey.tsx` | • โค้ดปัจจุบันมี Hake Gain, Radar Chart 6 มิติ, Survey, และ Certificate PDF แล้ว<br>• **สิ่งที่ควรเพิ่ม:** การวัด Confidence ซ้ำหลังเรียน, แสดงตารางจัดอันดับ (Rank) |

---

## 3. การออกแบบสถาปัตยกรรมระบบฐานข้อมูลและการยืนยันตัวตน (Database & Auth Architecture)

### 3.1 ข้อเสนอแนะ: ระบบ Database "จำเป็นต้องทำหรือไม่?"
👉 **คำตอบ:** **"จำเป็นอย่างยิ่ง (Essential)"** สำหรับงานวิจัยของคณะพยาบาลศาสตร์

#### ปัญหาของระบบปัจจุบัน (หากไม่มี Database):
* ปัจจุบันข้อมูลทั้งหมด (คะแนน Pre/Post, เวลา, ข้อผิดพลาด, ผลประเมิน) อยู่ในตัวแปร State บนเบราว์เซอร์ของผู้เล่นคนนั้นเท่านั้น
* เมื่อปิดเว็บ ข้อมูลจะหายไป หรือแม้จะมีปุ่ม "Export CSV" แต่นักศึกษา 100 คนจะต้องกดดาวน์โหลดไฟล์ 100 ไฟล์ แล้วส่งอีเมลมาให้อาจารย์นำมารวมเอง ซึ่งในทางปฏิบัติจะเกิดปัญหาไฟล์หาย ส่งไม่ครบ หรือข้อมูลไม่สมบูรณ์

#### สถาปัตยกรรมฐานข้อมูลที่แนะนำ (Recommended Stack):
ใช้ **Firebase Firestore** หรือ **Supabase (PostgreSQL)** เนื่องจาก:
1. **Serverless & Zero-Maintenance:** ไม่ต้องเช่าเครื่อง Server แยก คณะไม่ต้องจ่ายค่าดูแลรักษารายเดือน โควตาฟรี (Free Tier) รองรับนักศึกษาได้หลายพันคนต่อเดือน
2. **Real-time Sync:** บันทึกความคืบหน้านักศึกษาระหว่างเล่นทันที (หากเน็ตหลุดกลับมาเล่นต่อได้)
3. **Teacher / Researcher Admin Dashboard:** อาจารย์ผู้ทำวิจัยสามารถล็อกอินเข้าสู่ระบบหลังบ้าน แล้วกดปุ่มเดียว **"Export All Students to SPSS (.csv)"** รวมข้อมูลนักศึกษาทุกคนในรุ่นเป็นไฟล์ตาราง 22 ตัวแปรสำหรับโปรแกรม SPSS ได้ทันที

---

### 3.2 ข้อเสนอแนะ: ระบบ Authen "ควรทำอย่างไร?"
👉 **คำตอบ:** **"ควรทำ แต่ต้องออกแบบให้เข้าใช้งานง่ายและไม่สร้างภาระให้นักศึกษา (Low-friction Auth)"**

#### ปัญหาที่มักเกิดกับนักศึกษาพยาบาล:
* หากบังคับให้ตั้งรหัสผ่านซับซ้อน นักศึกษามักจะลืมรหัสผ่าน ทำให้ในชั่วโมงเรียนหรือช่วงทำวิจัย อาจารย์ต้องคอยรีเซ็ตรหัสผ่านจนการเรียนสะดุด

#### รูปแบบการ Authen ที่เหมาะสมที่สุด:
1. **Student ID + Email Verification (แนะนำตาม Storyboard หน้า 1):**
   - ให้นักศึกษากรอก: `รหัสนักศึกษา` + `ชื่อ-นามสกุล` + `Gmail` + `รหัสผ่านง่ายๆ (6 ตัวอักษร)`
   - ระบบใช้ Firebase Authentication ตรวจสอบ และใช้ **รหัสนักศึกษา (Student ID)** เป็น Primary Key ในฐานข้อมูล เพื่อป้องกันการทำข้อสอบซ้ำ
2. **การแบ่งสิทธิ์ผู้ใช้งาน (Role-Based Access Control - RBAC):**
   - **Role: `Student` (นักศึกษา):** เข้าเล่นเกม, ทำแบบทดสอบ, ดูคะแนนของตนเอง, ดาวน์โหลดเกียรติบัตร
   - **Role: `Instructor / Researcher` (อาจารย์/ผู้วิจัย):** มีรหัสผ่านพิเศษสำหรับเข้าดู **แดชบอร์ดสรุปผลภาพรวมของทั้งรุ่น**, ดูการกระจายตัวของคะแนน, ค่าเฉลี่ย Normalized Gain, กราฟใยแมงมุมสมรรถนะเฉลี่ย, และดาวน์โหลดไฟล์สถิติวิจัย

---

### 3.3 การออกแบบโครงสร้างข้อมูล (Data Modeling & Schema Specification)

#### คอลเลกชันหลักในฐานข้อมูล (Firestore Collections):

```text
databases/
├── users/ (ข้อมูลผู้ใช้งาน)
│   └── {studentId}/
│       ├── studentId: string (e.g. "66010204")
│       ├── name: string (e.g. "นางสาวชนทิดา ใจดี")
│       ├── email: string
│       ├── role: "student" | "instructor"
│       ├── institution: string
│       └── createdAt: timestamp
│
├── game_sessions/ (บันทึกการเล่นแต่ละครั้ง - ข้อมูลวิจัยหลัก)
│   └── {sessionId}/
│       ├── sessionId: string (UUID)
│       ├── studentId: string (FK -> users)
│       ├── scenarioId: 1 | 2
│       ├── startedAt: timestamp
│       ├── completedAt: timestamp
│       ├── totalDurationSeconds: number
│       │
│       ├── confidenceEvaluation:
│       │   ├── preConfidence: number (0-10)
│       │   ├── postConfidence: number (0-10)
│       │   └── confidenceGain: number (post - pre)
│       │
│       ├── preTest:
│       │   ├── score: number (0-10)
│       │   ├── answers: map<questionId, selectedChoice>
│       │   └── submittedAt: timestamp
│       │
│       ├── learningHubProgress:
│       │   ├── completedTopics: number[] (e.g. [1, 2, 3, 4, 5, 6])
│       │   └── isAllCompleted: boolean
│       │
│       ├── clinicalStagesTelemetry:
│       │   ├── assessment:
│       │   │   ├── discoveredHotspots: string[]
│       │   │   └── toolsUsed: string[]
│       │   ├── prioritization:
│       │   │   ├── userRanking: string[]
│       │   │   └── errorAttempts: number
│       │   ├── medication:
│       │   │   ├── calculatedDose: number (4.0)
│       │   │   ├── sideEffectSelected: string
│       │   │   ├── precautionsSelected: string
│       │   │   └── isCorrect: boolean
│       │   ├── ioSheet:
│       │   │   ├── netBalanceSelected: "positive" | "negative"
│       │   │   └── ioNursingActionSelected: string
│       │   └── crisisEmergency:
│       │       ├── abcChecklistCompleted: boolean
│       │       ├── ecgElectrodeErrors: number
│       │       ├── ecgRhythmInterpretation: string
│       │       ├── emergencyInterventionId: string
│       │       └── responseTimeSeconds: number
│       │
│       ├── postTest:
│       │   ├── score: number (0-10)
│       │   ├── answers: map<questionId, selectedChoice>
│       │   └── submittedAt: timestamp
│       │
│       ├── researchMetrics:
│       │   ├── normalizedGainHake: number (0.0 - 1.0)
│       │   └── ncjmmScores:
│       │       ├── recognizeCues: number (0-100)
│       │       ├── analyzeCues: number (0-100)
│       │       ├── prioritizeHypotheses: number (0-100)
│       │       ├── generateSolutions: number (0-100)
│       │       ├── takeAction: number (0-100)
│       │       └── evaluateOutcomes: number (0-100)
│       │
│       └── satisfactionSurvey:
│           ├── item1Score: number (1-5)
│           ├── item2Score: number (1-5)
│           ├── item3Score: number (1-5)
│           ├── item4Score: number (1-5)
│           ├── item5Score: number (1-5)
│           └── qualitativeFeedback: string
│
└── leaderboards/ (สรุปคะแนนสำหรับจัดอันดับ)
    └── {studentId}/
        ├── studentId: string
        ├── studentName: string
        ├── highestScore: number
        ├── bestNormalizedGain: number
        ├── completionRank: string ("Nurse Hero Gold")
        └── lastUpdated: timestamp
```

---

## 4. แผนงานการพัฒนายกระดับระบบ (Phase-by-Phase Implementation Roadmap)

เพื่อไม่ให้กระทบกับความเสถียรของระบบปัจจุบัน เราแบ่งแผนงานออกเป็น 4 ระยะที่ชัดเจน:

### 🟢 ระยะที่ 1: การปรับโครงสร้างกระบวนการเรียนรู้ให้ตรงกับ Storyboard (Flow & UX Alignment)
* **เพิ่มหน้าแบบประเมินความมั่นใจ (Confidence Slider 0–10):**
  - ใส่ในจุดก่อนทำ Pre-test (Storyboard หน้า 1) และหลังทำ Post-test (Storyboard หน้า 8)
* **ปรับปรุงหน้า Pre-Test & Learning Hub:**
  - เพิ่มหน้าขั้นแสดงผลคะแนน Pre-Test ก่อนเข้าคลังความรู้
  - รองรับวิดีโอคลิป (Video Player Modal หรือ Embed) ใน Learning Hub ทั้ง 6 หัวข้อ พร้อมระบบเช็กความคืบหน้า `6/6 Completed`
* **ปรับปรุงคำถามการตัดสินใจในสเตจทางคลินิก:**
  - เพิ่มการเลือก Side Effect และข้อเฝ้าระวังใน `Stage10Medication`
  - เพิ่มการเลือก Positive / Negative สารน้ำใน `Stage11IORecord`

### 🟡 ระยะที่ 2: การพัฒนาฟีเจอร์ Interactive ขั้นสูง (High-Engagement Mini-games)
* **Assessment Toolbar:**
  - พัฒนา Dock แถบเครื่องมือตรวจร่างกาย (เครื่องวัดความดัน, SpO2, EKG, หูฟัง, ปรับเตียง, ซักประวัติ) ให้คลิกเลือกเครื่องมือเพื่อนำไปตรวจตามจุดบนตัวคนไข้
* **ECG Lead Placement Minigame (Stage 12 Crisis):**
  - จำลองแผ่นอิเล็กโทรด Chest Lead V1–V6 และ Limb Leads ให้ผู้เรียนลากไปแปะบนตำแหน่งช่องซี่โครงที่ถูกต้อง หากผิดตำแหน่งจะมีคำอธิบายทางการพยาบาลเตือนทันที

### 🟠 ระยะที่ 3: ระบบจัดการข้อมูลและฐานข้อมูลคลาวด์ (Cloud Database & Authentication)
* ติดตั้ง **Firebase SDK / Supabase**
* พัฒนาระบบสมัครสมาชิกและเข้าสู่ระบบด้วยรหัสนักศึกษา (Student ID Sign-up & Login)
* เชื่อมโยงระบบบันทึก Telemetry เข้าฐานข้อมูล Firestore แบบอัตโนมัติทุกสเตจ
* พัฒนาระบบ Leaderboard & Rank Score ประมวลผลคะแนนนักศึกษาในรุ่น

### 🟣 ระยะที่ 4: ระบบแดชบอร์ดอาจารย์และรายงานวิจัย (Instructor Analytics & SPSS Export)
* พัฒนาหน้าจอพิเศษ `/instructor` หรือ `/admin` สำหรับอาจารย์ผู้สอน
* แสดงกราฟสถิติภาพรวม:
  - ค่าเฉลี่ยคะแนนก่อนเรียน vs หลังเรียน (Pre vs Post t-test preparation)
  - ค่าเฉลี่ยความมั่นใจ (Confidence Gain)
  - แผนภูมิใยแมงมุมสมรรถนะเฉลี่ยของทั้งห้อง
* ปุ่ม **"Export SPSS Dataset (.CSV)"** คลิกเดียวได้ไฟล์พร้อมนำไปคำนวณ Paired t-test ในโปรแกรม SPSS ทันที

---

## 5. ตารางสรุปจุดเด่นของโค้ดปัจจุบัน และจุดที่พร้อมต่อยอด

| ด้าน | จุดเด่นของโค้ดปัจจุบันที่ทำได้ดีมากแล้ว | จุดที่ต่อยอดเพิ่มตาม Storyboard |
| :--- | :--- | :--- |
| **เทคโนโลยี & สถาปัตยกรรม** | React 18 + Vite + TypeScript แข็งแรงมาก โค้ดแบ่งแยก Component และ Stage เป็นระเบียบ | ติดตั้ง Cloud Backend (Firebase / Supabase) เพื่อความสมบูรณ์แบบของงานวิจัย |
| **งานภาพและการนำเสนอ** | ธีมสีคลินิกพาสเทลสะอาดตา สอดคล้องกับมาตรฐาน ไม่ใช้อีโมจิ มีระบบ Responsive | นำสเปกจาก `IMAGE_ASSETS_SPECIFICATION.md` มาแทนที่ภาพจำลองเมื่อทีมพยาบาลส่งมอบภาพ |
| **ระบบเสียง & กราฟิกการแพทย์** | Web Audio API สังเคราะห์เสียงจริง (Crepitation, S3, Code Blue) มี EKG Canvas เรียลไทม์ | เพิ่มคลิปวิดีโอใน Learning Hub 6 หัวข้อตาม Storyboard |
| **การวัดผลทางการศึกษา** | มีสูตรคำนวณ Hake Normalized Gain และ Radar Chart 6 มิติ NCJMM ครบถ้วน | เพิ่มตัวแปร Pre/Post Confidence Rating 0–10 และตาราง Rank Score |

---
*เอกสารนี้จัดทำขึ้นเพื่อใช้เป็นแม่แบบและแผนการทำงานร่วมกันระหว่างคณะพยาบาลศาสตร์และทีมวิศวกรรมคอมพิวเตอร์*
