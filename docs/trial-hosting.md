# เว็บทดลองสาธารณะ

[เปิด CardioSim Heart Hero](https://cardiosim-heart-hero-trial-0032640.navyball41.chatgpt.site)

- [Case 1](https://cardiosim-heart-hero-trial-0032640.navyball41.chatgpt.site/game.html?case=case-01)
- [Case 2](https://cardiosim-heart-hero-trial-0032640.navyball41.chatgpt.site/game.html?case=case-02)

เผยแพร่ด้วย Sites และเปิดให้คนที่มี URL เข้าได้ สถานะ deployment สำเร็จจาก native Sites API รุ่นเผยแพร่ 5 ใช้แอปจาก commit `6e9ae035fad809fc7c45a1389e37052f30557cde` เผยแพร่วันที่ 20 พฤศจิกายน 2026 รายละเอียด project/version/deployment อยู่ใน [trial-hosting.json](trial-hosting.json) และเก็บ identity ใน `.openai/hosting.json`

รุ่นนี้เพิ่มกิจกรรมเคส 2 จากเอกสารหน้า 7–13 ให้จัดลำดับข้อวินิจฉัย 4 ข้อพร้อมข้อมูลสนับสนุน 4 ช่อง และจับคู่การพยาบาล 4 ข้อ รวมตัวเลือกหลอกจากเอกสาร รองรับเซฟกิจกรรมเดิมแบบสองช่อง แก้การกดยืนยันบนมือถือที่ถูกการ์ดซ่อนอยู่หลังปุ่มแย่งการแตะ โดยตรวจเป้าหมายที่มองเห็นจริง ผ่านเทสต์โค้ด 19 ข้อ ตรวจ clinical snapshot และ build สำเร็จ ทดสอบจับคู่ครบทุกช่องที่ 1440/390px และเล่นทั้งสองเคสจบผ่าน Edge รวมการลากวาง ECG และการสัมผัสบนมือถือ กิจกรรมเคส 2 ยังคงบันทึกคำตอบเป็นรอบฝึก

## สถานะเนื้อหา

ยังเป็น demo/practice ที่รอผู้เชี่ยวชาญรับรอง Case 2 ไม่มีคะแนนทางคลินิก ส่วนช่องผลข้างเคียง Case 1 เก็บคำตอบโดยยังไม่ตัดสินถูกผิด ดูรายการรอตรวจใน [clinical-review](clinical-review/README.md)

## การอัปเดตครั้งต่อไป

GitHub branch นี้ยังเป็นต้นทางของโค้ดเกม การ push GitHub อย่างเดียวไม่ได้อัปเดตเว็บ Sites อัตโนมัติ ต้อง build และเผยแพร่ผ่าน Sites ให้ครบอีกครั้ง

การเผยแพร่ใช้ checkout แยก `../sites/cardiosim-trial-0032640` ซึ่งเก็บเฉพาะ build ที่ผ่านการตรวจและ `.openai/hosting.json` ไม่คัดลอก PSD/AI, archived prototype images, credentials หรือข้อมูลในเบราว์เซอร์ของผู้เล่นไปไว้บนเว็บ

ใช้ project ID เดิมเสมอ และเปิด/refresh credential ด้วย native Sites tools ก่อนใช้ source helper คัดลอก build ล่าสุดไป `dist` ของ publication checkout แล้วใช้ workflow helper ส่ง source/package จาก checkout นั้น อย่าเปลี่ยน remote ของ repository เกมหรือบังคับ merge ประวัติ GitHub กับประวัติ publication ซึ่งเป็นคนละชุด

ก่อนเผยแพร่ให้ตรวจ clinical-review hashes, tests, build และที่มาของภาพ คง audience เดิมไว้ เว้นแต่ผู้ใช้สั่งเปลี่ยน จากนั้นบันทึก source commit, saved version และ deployment ที่สำเร็จลง metadata นี้ โดยไม่เก็บ credential/token
