# CardioSim game asset manifest

## สถานะของภาพปัจจุบัน

**ภาพทุกชิ้นในเกมปัจจุบันเป็น prototype สำหรับทดลอง flow และตำแหน่ง ยังไม่ใช่ final art** ทีมเวชนิทัศน์จะวาดชุดภาพเกมใหม่ทั้งหมดตาม [บรีฟส่งมอบภาพ CardioSim](cardiosim-asset-handoff-เวชนิทัศน์.md) โดยใช้ไฟล์ด้านล่างเป็น reference เท่านั้น

| Asset ตัวอย่าง | Path | ขนาดปัจจุบัน | ใช้อ้างอิง | สถานะ |
|---|---|---:|---|---|
| ห้องผู้ป่วย | `public/game/room.webp` | 1000 × 800 | มุมห้อง/ตำแหน่งเตียง | Prototype — วาดใหม่แบบแยกชั้น |
| ผู้ป่วย Case 1 | `public/game/patient.webp` | 1024 × 1536 | สเกลและตำแหน่งบนเตียง | Prototype — วาดใหม่ |
| ผู้ป่วย Case 1 ช่วงวิกฤต | `public/game/patient-critical.webp` | 1024 × 1536 | state ที่เกมต้องสื่อ | Prototype — วาดใหม่/ทำเป็นชั้น animation |
| ผู้ป่วย Case 2 | `public/game/patient-case-02.png` | 1024 × 1536 | สเกลและตำแหน่งบนเตียง | Prototype — วาดใหม่ |
| Stethoscope | `public/game/stethoscope.webp` | 427 × 512 | รูปทรงและการวางบนทรวงอก | Prototype — วาดใหม่ |
| BP cuff | `public/game/bp-cuff.webp` | 511 × 422 | รูปทรงและการวางบนต้นแขน | Prototype — วาดใหม่ |
| SpO₂ sensor | `public/game/spo2.webp` | 508 × 512 | รูปทรงและการวางที่ปลายนิ้ว | Prototype — วาดใหม่ |
| ผัง ECG | `public/game/ecg-chest.png` | 1247 × 1261 | ขอบเขตผังฝึก | Prototype — วาดใหม่และให้ผู้เชี่ยวชาญตรวจตำแหน่ง |
| ECG Leads | `public/game/ecg-leads.webp` | 512 × 467 | การแสดงถาดและ lead | Prototype — วาดใหม่เป็น V1–V6 แยกชิ้น |
| ไอคอนและกรอบ UI | `src/game/components/gameIcons.ts`, components และ `src/game/styles.css` | สร้างจากโค้ด | ใช้ดูหน้าที่และขนาดการใช้งาน | Prototype — ทีมพัฒนาจะออกแบบและทำใหม่ในโค้ด ไม่ต้องวาดส่ง |

ภาพ Case 2 ที่มีอยู่เคยสร้างสำหรับทดลองและต้องวาดแทนเช่นเดียวกับภาพอื่น ส่วนข้อมูลที่ยังไม่มีใน Case configuration ห้ามเติมลงในภาพหรือฉลาก

## รายการ source asset ที่ขอจากทีมเวชนิทัศน์

ไฟล์ส่งมอบเป็น **PSD หรือ KRA แบบแยก layer** ตามที่ทีมถนัด ไม่ต้อง export PNG/WebP; ทีมเกมรับผิดชอบ export และปรับขนาดหลังล็อก layout รายละเอียด artboard, layer, pivot และข้อห้ามรายชิ้นอยู่ใน [บรีฟภาพฉบับละเอียด](cardiosim-asset-handoff-เวชนิทัศน์.md)

| กลุ่ม | source asset ที่ขอ | ใช้ในเกม |
|---|---|---|
| ฉาก | `room_background`, `bed_layers`, พร็อพในฉากที่ยืนยันแล้ว | ฉาก Patient Room เดียวตลอด Normal/Emergency |
| ผู้ป่วย | `patient_case01` และ state ที่ใช้จริง; `patient_case02` และ state ที่มีข้อมูลรองรับ | sprite ผู้ป่วยพื้นหลังโปร่งใส ตำแหน่งซ้อนกันทุก state |
| เครื่องมือประเมิน | Stethoscope, BP cuff, SpO₂ sensor, ABC assessment hand | หยิบ/ลาก/วางบน hotspot; มี anchor สำหรับจุดจับและจุดสัมผัส |
| Medication | Syringe body, plunger, ภาชนะยาฉลากว่าง และ accessory ที่ยืนยันว่าจะมี interaction | ดึง plunger ใน minigame โดยตัวเลข/ปริมาตรแสดงจากเกม |
| I/O | token intake/output เฉพาะชนิดที่ Case config ใช้ | ชิ้นลากบนบอร์ด I/O ที่ dev วาด |
| ECG | torso training map เปล่า และ lead V1–V6 แยกชิ้น | ผังฝึกและ mini-game; landmark ต้องได้ clinical sign-off ก่อน |

ไม่ได้ขอให้วาด Monitor screen, HUD, toolbar, tray, clipboard, worksheet, board, card, icon ทั่วไป, marker, text, vital, คำตอบ หรือกรอบ UI; ทั้งหมดทำในโค้ดโดยทีมพัฒนา

## ข้อกำหนดทางเทคนิคที่ระบบเกมใช้ในปัจจุบัน

- ฉาก Phaser ใช้พิกัด world ประมาณ 1000 × 720; ตัวละครและพร็อพต้องแยกชั้นเพื่อวาง/animate บนฉากได้
- จุดตรวจปัจจุบันอยู่บริเวณศีรษะ, ทรวงอก, ต้นแขน, ข้อมือ และปลายนิ้ว; พิกัดจริงแก้ผ่าน Case configuration
- เครื่องมือ Stethoscope, BP cuff และ SpO₂ มีภาพตอนถือและตอนสัมผัสผู้ป่วย; ต้องมี anchor/pivot สำหรับสองสถานะ
- ECG รองรับชิ้นลากแยก V1–V6 และ snap target ที่กำหนดจาก configuration; ภาพผังต้องไม่ฝังตำแหน่งเฉลยที่ไม่ได้รับการตรวจ
- ข้อความ ค่า vital คำตอบ ชื่อยา และผลคลื่นที่เปลี่ยนตามเคสให้เกมวาดจากข้อมูล ห้ามฝังในภาพ raster

ทีมพัฒนารับผิดชอบ UI เช่น ปุ่ม แผงภารกิจ กรอบการ์ด Chart และ feedback; ทีมเวชนิทัศน์วาดตัวละคร ฉาก และอุปกรณ์ที่เป็นภาพวัตถุในเกม ดูขอบเขตเต็ม รูปแบบไฟล์ และจุดตรวจรับงานได้ที่ [บรีฟส่งมอบภาพ CardioSim](cardiosim-asset-handoff-เวชนิทัศน์.md)
