# จุดที่ต้องให้ผู้เชี่ยวชาญตัดสิน

การตรวจเบื้องต้นนี้ยังไม่อนุมัติคำสั่งยา เฉลย หรือ protocol ใด ๆ

## CLIN-01 · ยืนยันความเข้มข้นก่อนใช้เฉลย 4 mL

Doctor Order ระบุ 40 mg และขั้นเตรียมเดิมเขียน 4 mL แต่ไม่มีฉลากผลิตภัณฑ์ของเคสแนบให้ตรวจ โปรดให้เภสัชกรยืนยันชื่อผลิตภัณฑ์ ความเข้มข้น ปริมาณ และวิธีให้ รวมทั้งตัดสินว่าจะอนุญาตให้ให้คะแนนการคำนวณ mL หรือคงเป็นแบบฝึกเชิงกลก่อน สูตร 40 ÷ 10 = 4 ใช้ได้เฉพาะเมื่อยืนยันว่าเป็น 10 mg/mL; ฉลากอ้างอิงของต่างประเทศไม่ใช่หลักฐานว่าของเคสเป็นผลิตภัณฑ์เดียวกัน

**ผู้ตรวจ:** เภสัชกรและผู้รับผิดชอบเคส · **สถานะ:** pending

- [src/game/cases/medicationWorkbench.ts:20](../../src/game/cases/medicationWorkbench.ts#L20)
- [src/data/medicationStepsData.ts:54](../../src/data/medicationStepsData.ts#L54)

**อ้างอิง:** REF-DRUG — ดู references.md

## CLIN-02 · ช่องผลข้างเคียงรับเพียง Hypotension

ข้อมูลยาเดิมและตัวเลือกมี Hypotension, Hypokalemia และ Hypomagnesemia แต่ expectedResponses รับเพียง Hypotension ผู้ตรวจต้องกำหนดว่าจะรับหลายคำตอบ เปลี่ยนเป็นเลือกหลายข้อ หรือทำโจทย์ให้เจาะจง พร้อมแยกผลรักษา Increased urine output ออกจากผลไม่พึงประสงค์ ไม่ควรรับรองการให้คะแนนช่องนี้ก่อนตัดสิน

**ผู้ตรวจ:** เภสัชกรและอาจารย์พยาบาล · **สถานะ:** pending

- [src/game/cases/verticalSlice.ts:115](../../src/game/cases/verticalSlice.ts#L115)
- [src/data/medicationStepsData.ts:9](../../src/data/medicationStepsData.ts#L9)

**อ้างอิง:** REF-DRUG — ดู references.md

## CLIN-03 · ประวัติทางเดินหายใจยังระบุสถานะไม่ชัด

Present illness เขียนว่าใส่ท่อช่วยหายใจ/ให้ออกซิเจน แต่ข้อมูลรับไว้ระบุ nasal cannula และพูดคุยได้ ต้องกำหนดว่าเคยใส่ท่อและถอดแล้ว หรือไม่เคยใส่ พร้อมเวลาและสภาพผู้ป่วยในแต่ละช่วง เพื่อไม่ให้ผู้เล่นเข้าใจเป็นสถานะเดียวกัน

**ผู้ตรวจ:** แพทย์หรืออาจารย์พยาบาลเจ้าของเคส · **สถานะ:** pending

- [src/data/case1Data.ts:13](../../src/data/case1Data.ts#L13)
- [src/data/case1Data.ts:14](../../src/data/case1Data.ts#L14)

**อ้างอิง:** ข้อมูลภายในโครงการ/รอเอกสารของทีม

## CLIN-04 · เกณฑ์ออกซิเจนและอุปกรณ์ต้องสัมพันธ์กับช่วงของเคส

โปรดยืนยันคำสั่ง O2 เดิม เป้าหมาย SpO2 และแผนเมื่ออาการแย่ลง แยกค่าขณะได้รับ O2 ออกจากค่าหายใจอากาศปกติ และระบุเงื่อนไขเรียกทีม/การช่วยหายใจเพิ่มเติม ห้ามอนุมานว่าค่า 95% ขณะได้รับ O2 บอกค่าก่อนรักษาหรือความจำเป็นของ O2 ได้

**ผู้ตรวจ:** แพทย์และอาจารย์พยาบาล · **สถานะ:** pending

- [src/data/case1Data.ts:24](../../src/data/case1Data.ts#L24)
- [src/components/stages/Stage12CrisisEvent.tsx:35](../../src/components/stages/Stage12CrisisEvent.tsx#L35)

**อ้างอิง:** REF-HF, REF-HF-UPDATE — ดู references.md

## CLIN-05 · SVT/VT และข้อสอบจังหวะหัวใจต้องมีหลักฐานที่เพียงพอ

Case 1 ใช้ป้าย SVT และคลื่นสร้างจากโค้ด ส่วนข้อสอบบางข้อสรุป VT จากคำบรรยาย QRS/อัตรา/จังหวะ ผู้เชี่ยวชาญต้องยืนยัน tracing ที่อนุญาตใช้ ลักษณะจำแนกจังหวะและ differential รวมถึงความกำกวมของโจทย์ ไม่วินิจฉัยจาก HR 148 เพียงค่าเดียวหรือถือว่าคลื่นสังเคราะห์เป็น ECG จริง

**ผู้ตรวจ:** ผู้เชี่ยวชาญ ECG/แพทย์และอาจารย์ผู้สร้างข้อสอบ · **สถานะ:** pending

- [src/data/case1Data.ts:50](../../src/data/case1Data.ts#L50)
- [src/data/preTestData.ts:114](../../src/data/preTestData.ts#L114)
- [src/data/postTestData.ts:103](../../src/data/postTestData.ts#L103)

**อ้างอิง:** REF-ACLS — ดู references.md

## CLIN-06 · แยกการตอบสนองเริ่มต้นของพยาบาลจากแผนฉุกเฉินครบวงจร

เกมให้คำตอบ High Fowler’s/Non-rebreather/เรียกทีม แล้วเปลี่ยนผู้ป่วยเป็น stable ขณะที่หน้าเว็บเดิมเรียกคำตอบนี้ว่าตาม ACLS โปรดกำหนดขอบเขตว่าทดสอบเพียง initial nursing response หรือการดูแลทั้งเหตุการณ์ และให้ผู้เชี่ยวชาญระบุการประเมิน/การรักษาโดยทีมที่ยังขาด แนวทาง AHA พิจารณาความสัมพันธ์ระหว่าง arrhythmia กับภาวะไม่คงที่ ไม่ใช่เหมารวม HF ทุกกรณี

**ผู้ตรวจ:** แพทย์/ผู้สอนกู้ชีพและอาจารย์พยาบาล · **สถานะ:** pending

- [src/components/stages/Stage12CrisisEvent.tsx:37](../../src/components/stages/Stage12CrisisEvent.tsx#L37)
- [src/game/cases/verticalSlice.ts:155](../../src/game/cases/verticalSlice.ts#L155)
- [src/game/cases/verticalSlice.ts:164](../../src/game/cases/verticalSlice.ts#L164)

**อ้างอิง:** REF-ACLS, REF-HF — ดู references.md

## CLIN-07 · ค่าและเวลาฟื้นตัวเป็น simulation

เกมกำหนด vital signs หลังดูแลและเปลี่ยนภายในเวลาสั้นสำหรับ animation โปรดรับรองตัวเลข/ลำดับเวลาในสถานการณ์และข้อความที่บอกว่าเป็น simulation ไม่ใช้เป็นการทำนายผลการรักษา หรือให้คะแนนว่ารักษาสำเร็จจากตัวเลขที่เกมเปลี่ยนให้เอง

**ผู้ตรวจ:** เจ้าของเคสและผู้เชี่ยวชาญการจำลองสถานการณ์ · **สถานะ:** pending

- [src/game/cases/verticalSlice.ts:164](../../src/game/cases/verticalSlice.ts#L164)
- [src/game/cases/verticalSlice.ts:164](../../src/game/cases/verticalSlice.ts#L164)

**อ้างอิง:** ข้อมูลภายในโครงการ/รอเอกสารของทีม

## CLIN-08 · I/O คำนวณตรงกัน แต่การตีความต้องแยกออกมา

เลขในเกมและหน้าเดิมตรงกัน: (100+50)-350 = -200 mL ตรวจคณิตศาสตร์ได้ แต่การสรุปว่าตอบสนองต่อยาได้ดีจาก balance ติดลบเพียงอย่างเดียวต้องให้ผู้ตรวจพิจารณาเวลา น้ำหนัก สัญญาณชีพ และข้อมูลร่วมอื่น ไม่ถือว่าการคำนวณถูกเป็นการรับรองการตีความทางคลินิก

**ผู้ตรวจ:** อาจารย์พยาบาลเจ้าของเคส · **สถานะ:** pending

- [src/game/cases/verticalSlice.ts:130](../../src/game/cases/verticalSlice.ts#L130)
- [src/components/stages/Stage11IORecord.tsx:22](../../src/components/stages/Stage11IORecord.tsx#L22)
- [src/data/postTestData.ts:55](../../src/data/postTestData.ts#L55)

**อ้างอิง:** ข้อมูลภายในโครงการ/รอเอกสารของทีม

## CLIN-09 · คำวินิจฉัย/แผนการพยาบาลยังเป็น demo keys

การ์ด diagnosis และ intervention เป็นข้อความกว้างและ key สำหรับทดสอบ interaction ยังไม่มี rubric ที่ผู้เชี่ยวชาญลงนาม โปรดให้ข้อความจริง หลักฐานสนับสนุน คำตอบที่ยอมรับได้/เทียบเท่า และน้ำหนักคะแนน ก่อนใช้คะแนนเป็นผลการเรียนรู้ทางคลินิก

**ผู้ตรวจ:** อาจารย์พยาบาลและผู้เชี่ยวชาญการวัดผล · **สถานะ:** pending

- [src/game/cases/verticalSlice.ts:86](../../src/game/cases/verticalSlice.ts#L86)
- [src/game/cases/verticalSlice.ts:101](../../src/game/cases/verticalSlice.ts#L101)

**อ้างอิง:** ข้อมูลภายในโครงการ/รอเอกสารของทีม

## CLIN-10 · Case 2 ยังขาดข้อมูลสำหรับเฉลยและการให้คะแนน

Case 2 มีเพียงเรื่องย่อ ค่าสัญญาณชีพ Order, ECG strip และ answer key ยังไม่มี ยังคงเล่นฝึกและไม่ให้คะแนนทางคลินิก ผู้รับผิดชอบต้องส่งเคสที่รับรองแล้ว ห้ามนำค่าจาก Case 1 ไปเติมเพื่อทำให้ดูสมบูรณ์

**ผู้ตรวจ:** เจ้าของเคส Case 2 · **สถานะ:** pending

- [src/game/cases/case02.ts:19](../../src/game/cases/case02.ts#L19)
- [src/game/cases/case02.ts:11](../../src/game/cases/case02.ts#L11)

**อ้างอิง:** ข้อมูลภายในโครงการ/รอเอกสารของทีม

## CLIN-11 · ตำแหน่ง ECG ต้องรับรองภาพและ landmark ทั้งชุด

เกมอิงจุดจากภาพเวชนิทัศน์และข้อสอบมีคำบรรยายตำแหน่ง lead โปรดตรวจจุด V1–V6 รวมทั้งระดับแนวนอน V4–V6 และถ้อยคำโจทย์ให้ตรงกับภาพอ้างอิงที่ผู้สอนรับรอง การ export ตรงไฟล์ภาพไม่ได้ยืนยันความถูกต้องทางกายวิภาคโดยอัตโนมัติ

**ผู้ตรวจ:** ผู้เชี่ยวชาญ ECG และทีมเวชนิทัศน์ · **สถานะ:** pending

- [src/game/suppliedECGArt.json:24](../../src/game/suppliedECGArt.json#L24)
- [src/data/preTestData.ts:110](../../src/data/preTestData.ts#L110)
- [src/data/postTestData.ts:91](../../src/data/postTestData.ts#L91)

**อ้างอิง:** ข้อมูลภายในโครงการ/รอเอกสารของทีม

## CLIN-12 · รับรองข้อสอบก่อน/หลังเรียนครบ 20 ข้อ

ตรวจทุกโจทย์ ตัวเลือก key และคำอธิบายเป็นรายข้อ รวมความกำกวม การใช้คำว่าอันดับแรก/สำคัญที่สุด เกณฑ์อ้างอิง และความสมดุลของตำแหน่งคำตอบ ก่อนใช้ pre/post scores หรือ learning gain เป็นผลวิจัย Snapshot เก็บ key เดิมเพื่อให้ตรวจย้อนกลับ ไม่ใช่การรับรองเฉลย

**ผู้ตรวจ:** ผู้เชี่ยวชาญเนื้อหาและผู้เชี่ยวชาญการวัดผล · **สถานะ:** pending

- [src/data/preTestData.ts:3](../../src/data/preTestData.ts#L3)
- [src/data/postTestData.ts:4](../../src/data/postTestData.ts#L4)

**อ้างอิง:** ข้อมูลภายในโครงการ/รอเอกสารของทีม
