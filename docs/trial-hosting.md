# เว็บทดลองสาธารณะ

[เปิด CardioSim Heart Hero](https://cardiosim-heart-hero-trial-0032640.navyball41.chatgpt.site)

- [Case 1](https://cardiosim-heart-hero-trial-0032640.navyball41.chatgpt.site/game.html?case=case-01)
- [Case 2](https://cardiosim-heart-hero-trial-0032640.navyball41.chatgpt.site/game.html?case=case-02)

เผยแพร่ด้วย Sites และเปิดให้คนที่มี URL เข้าได้ สถานะ deployment สำเร็จจาก native Sites API รุ่นเผยแพร่ 6 ใช้แอปจาก commit `981b214e6738e9c6e66cdab326fda8371c69d440` เผยแพร่วันที่ 22 พฤศจิกายน 2026 ตามเวลาไทย รายละเอียด project/version/deployment อยู่ใน [trial-hosting.json](trial-hosting.json) และเก็บ identity ใน `.openai/hosting.json`

รุ่นนี้ปรับห้องผู้ป่วยเคส 1 เป็นหญิงอายุ 65 ปี และนำประวัติ สัญญาณชีพแรกรับ ช่วงฉุกเฉิน และช่วงสรุปผลจากเอกสารทีมมาใช้ เปลี่ยนคำถาม EKG ฉุกเฉินเป็น Sinus tachycardia 125 ครั้ง/นาทีตามหน้า 26 และช่วงสรุปผลเป็น NSR 92 ครั้ง/นาที รองรับเซฟเคส 1 รุ่นข้อมูล 2 ไปเป็น 3 โดยเปิดคำถาม EKG เดิมใหม่ รวมงานแก้ชื่อสถาบันและรูปแบบพิมพ์ใบประกาศของทีม ผ่านเทสต์โค้ด 20 ข้อ clinical snapshot และ build ทดสอบเล่นทั้งสองเคสจบ และหน้าเข้าเกมที่ 1440/1024/768/390px ผ่าน Edge แล้ว I/O และแผนตอบสนองฉุกเฉินของเคส 1 บางส่วนยังใช้ข้อมูลเดโมเดิม รอปรับเนื้อหาและเกณฑ์คะแนนต่อ

## สถานะเนื้อหา

ยังเป็น demo/practice ที่รอผู้เชี่ยวชาญรับรอง Case 2 ไม่มีคะแนนทางคลินิก ส่วนช่องผลข้างเคียง Case 1 เก็บคำตอบโดยยังไม่ตัดสินถูกผิด ดูรายการรอตรวจใน [clinical-review](clinical-review/README.md)

## การอัปเดตครั้งต่อไป

GitHub branch นี้ยังเป็นต้นทางของโค้ดเกม การ push GitHub อย่างเดียวไม่ได้อัปเดตเว็บ Sites อัตโนมัติ ต้อง build และเผยแพร่ผ่าน Sites ให้ครบอีกครั้ง

การเผยแพร่ใช้ checkout แยก `../sites/cardiosim-trial-0032640` ซึ่งเก็บเฉพาะ build ที่ผ่านการตรวจและ `.openai/hosting.json` ไม่คัดลอก PSD/AI, archived prototype images, credentials หรือข้อมูลในเบราว์เซอร์ของผู้เล่นไปไว้บนเว็บ

ใช้ project ID เดิมเสมอ และเปิด/refresh credential ด้วย native Sites tools ก่อนใช้ source helper คัดลอก build ล่าสุดไป `dist` ของ publication checkout แล้วใช้ workflow helper ส่ง source/package จาก checkout นั้น อย่าเปลี่ยน remote ของ repository เกมหรือบังคับ merge ประวัติ GitHub กับประวัติ publication ซึ่งเป็นคนละชุด

ก่อนเผยแพร่ให้ตรวจ clinical-review hashes, tests, build และที่มาของภาพ คง audience เดิมไว้ เว้นแต่ผู้ใช้สั่งเปลี่ยน จากนั้นบันทึก source commit, saved version และ deployment ที่สำเร็จลง metadata นี้ โดยไม่เก็บ credential/token
