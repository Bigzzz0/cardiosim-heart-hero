# CardioSim: Heart Hero Simulation
> นวัตกรรมเกมจำลองสถานการณ์เสมือนจริงในการพยาบาลผู้ป่วยโรคหัวใจและภาวะวิกฤต (Clinical Nursing Simulation Serious Game)

---

## ภาพรวมโปรเจกต์ (Project Overview)

**CardioSim: Heart Hero** เป็นเว็บแอปพลิเคชันจำลองสถานการณ์ทางคลินิกเสมือนจริง พัฒนาขึ้นเพื่อส่งเสริมทักษะการตัดสินใจทางคลินิก (Clinical Judgment) สำหรับนักศึกษาพยาบาลศาสตร์และบุคลากรทางการแพทย์ โดยอ้างอิงกรอบสมรรถนะมาตรฐานสากล **NCSBN Clinical Judgment Measurement Model (NCJMM Layer 3)**

ตัวเกมถูกออกแบบในธีมคลินิกสว่าง (Light Clinical Theme: ขาว-ชมพูพาสเทล) ปลอดการใช้อีโมจิ 100% โดยใช้ไอคอนทางการแพทย์ระดับพรีเมียม พร้อมทั้งรองรับการใช้งานบนเว็บบนมือถือ (Mobile Web / PWA) อย่างเต็มรูปแบบ

---

## จุดเด่นและฟังก์ชันสำคัญ (Key Features)

1. **ลำดับการเรียนรู้ทางการพยาบาล 8 ภารกิจ (Complete Nursing Workflow)**:
   - **Pre-test & Post-test**: แบบทดสอบก่อน-หลังเรียน 10 ข้อตรงตามหลักสูตร
   - **Learning Hub**: คลังความรู้ก่อนเริ่มสถานการณ์ 6 หัวข้อสำคัญ
   - **Handover (ISBAR)**: รับเวรผู้ป่วยตามมาตรฐานการสื่อสาร ISBAR
   - **Physical Assessment & Stethoscope Auscultation**: ตรวจร่างกายบนเตียง High Fowler's พร้อมฟังเสียงปอด Fine Crepitation (Crackles) และเสียงหัวใจ S3 Gallop
   - **Prioritize Nursing Diagnoses**: จัดลำดับข้อวินิจฉัยพยาบาล 4 ลำดับด้วยระบบลากวาง (Drag & Drop) และระบบแตะเลือก (Tap-to-Assign)
   - **Medication Safety & 6 Rights**: เลือกยา Furosemide พร้อมเรียง 7 ขั้นตอนการเตรียมยา
   - **Intake & Output (I/O Sheet)**: บันทึกและคำนวณสมดุลสารน้ำสุทธิ พร้อมแถบเปรียบเทียบ Visual Balance Gauge
   - **Acute Deterioration & SVT Crisis Event**: รับมือภาวะวิกฤตฉุกเฉิน กู้ชีพตามมาตรฐาน ACLS
   - **Debriefing**: สรุปผลการให้การพยาบาล

2. **ระบบเสียงคลินิกและภาพคลื่นเสมือนจริง (Medical Audio & Waveform Engine)**:
   - สังเคราะห์เสียงผ่าน Web Audio API แท้ (เสียง EKG Beep, Crepitation, S3 Gallop, Code Blue Alarm)
   - จอแสดงคลื่นเสียงการฟังตรวจเสมือนจริง (Audio Waveform Oscilloscope) บน HTML5 Canvas
   - จอมอนิเตอร์คลื่นไฟฟ้าหัวใจ (Canvas EKG: Normal Sinus, Sinus Tachycardia, SVT)

3. **เวชระเบียนเสมือนจริง (Slide-over Floating EHR Drawer)**:
   - ลิ้นชักเวชระเบียนอิเล็กทรอนิกส์ 4 แท็บ (คำสั่งแพทย์, ผลตรวจแล็บ & รังสีทรวงอก CXR, บันทึก ISBAR, ชาร์ตยา MAR)

4. **ระบบประเมินสมรรถนะสากลและงานวิจัย (NCJMM Radar & Research Export)**:
   - แผนภูมิใยแมงมุม (6-Dimensional Competency Radar Chart) ประเมิน 6 มิติ NCJMM
   - คำนวณค่าดัชนีประสิทธิผลการเรียนรู้ Normalized Gain (<g>) ตามวิธีของ Hake (1998)
   - ใบประกาศนียบัตร **Nurse Hero Certificate** สั่งพิมพ์หรือบันทึกเป็น PDF ได้ทันที
   - ส่งออกข้อมูลวิจัยเป็นไฟล์ **.CSV (SPSS-ready 22 ตัวแปร)** และ **.JSON**

5. **ออกแบบเฉพาะสำหรับ Mobile Web & PWA**:
   - รองรับ Safe Area Insets (Notch / Dynamic Island) และป้องกันการซูมหลุดจอ
   - ระบบสั่นตามจังหวะคลินิก (**Web Vibration API**)
   - แป้นพิมพ์ตัวเลขอัตโนมัติ (`inputMode="numeric"`)
   - รองรับการกด **Add to Home Screen (PWA)** เล่นเต็มจอเสมือน Native App

---

## เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Vanilla CSS Design Tokens
- **Interactions**: `@dnd-kit/core` (Drag and Drop พร้อม TouchSensor ปรับแต่ง)
- **Audio & Haptics**: Web Audio API, Web Vibration API
- **Graphics & Visuals**: HTML5 Canvas (High-DPI Retina Ready), Lucide Icons
- **Animation & Effects**: Canvas Confetti, CSS Micro-animations

---

## การติดตั้งและเริ่มใช้งาน (Getting Started)

### ความต้องการของระบบ (Prerequisites)
- Node.js (เวอร์ชัน 18.0 ขึ้นไป)
- npm หรือ yarn

### ขั้นตอนการรันโปรเจกต์
```bash
# 1. ติดตั้ง Dependencies
npm install

# 2. เริ่มรัน Development Server
npm run dev

# 3. เปิดเว็บเบราว์เซอร์ไปที่:
http://localhost:3000
```

### การ Build สำหรับขึ้น Production
```bash
npm run build
npm run preview
```

---

## สิทธิ์การใช้งาน (License)
โครงการเพื่อการศึกษาวิจัยและพัฒนานวัตกรรมการเรียนรู้ทางการพยาบาล
