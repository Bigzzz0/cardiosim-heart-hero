import React, { useState } from 'react';
import { Award, Printer, X, Edit3, Check, RotateCcw } from 'lucide-react';
import { StudentProfile } from '../../types/game';
import { ShinyButton } from '../ui/ShinyButton';
import { ASSETS } from '../../constants/assets';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  student?: StudentProfile;
  preScore?: number;
  postScore?: number;
  gain?: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  student = { studentId: '66010204', name: 'พว. ณัฐชา พงษ์ไพศาล', institution: 'คณะพยาบาลศาสตร์' },
  preScore = 4,
  postScore = 10,
  gain = 0.86,
}) => {
  const [editableStudent, setEditableStudent] = useState<StudentProfile>(student);
  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      {/* Print-specific style injected into head */}
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Hide non-certificate elements */
          body * {
            visibility: hidden !important;
          }
          /* Show certificate printable canvas */
          .certificate-print-root, .certificate-print-root * {
            visibility: visible !important;
          }
          .certificate-print-root {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 297mm !important;
            height: 210mm !important;
            max-width: 297mm !important;
            max-height: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            background: #ffffff !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 999999 !important;
          }
          .certificate-no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl relative my-auto certificate-no-print">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold">พิมพ์ใบประกาศนียบัตร (Certificate of Achievement)</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 text-slate-300 text-xs font-medium hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
              {isEditing ? 'เสร็จสิ้นการแก้ไข' : 'แก้ไขชื่อผู้เรียน'}
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
              title="ปิดหน้าต่าง"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Edit Fields (if editing) */}
        {isEditing && (
          <div className="bg-slate-800/90 border border-amber-500/30 rounded-2xl p-4 my-4 animate-in fade-in duration-150">
            <p className="text-xs text-amber-300 font-semibold mb-3 flex items-center gap-1.5">
              <Edit3 className="w-4 h-4" /> ปรับแต่งข้อมูลสำหรับแสดงบนใบประกาศ (พิมพ์ได้ทันที):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">ชื่อ–นามสกุล</label>
                <input
                  type="text"
                  value={editableStudent.name}
                  onChange={(e) => setEditableStudent({ ...editableStudent, name: e.target.value })}
                  placeholder="เช่น พว. ณัฐชา พงษ์ไพศาล"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">รหัสนักศึกษา</label>
                <input
                  type="text"
                  value={editableStudent.studentId}
                  onChange={(e) => setEditableStudent({ ...editableStudent, studentId: e.target.value })}
                  placeholder="เช่น 66010204"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">สถาบัน / คณะ</label>
                <input
                  type="text"
                  value={editableStudent.institution}
                  onChange={(e) => setEditableStudent({ ...editableStudent, institution: e.target.value })}
                  placeholder="เช่น คณะพยาบาลศาสตร์"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* Certificate Printable Canvas Preview */}
        <div className="overflow-x-auto my-4 py-2 flex justify-center">
          <div
            id="certificate-canvas"
            className="certificate-print-root relative bg-white shadow-2xl rounded-2xl overflow-hidden text-center text-slate-800"
            style={{
              width: '842px',
              height: '595px',
              minWidth: '842px',
              minHeight: '595px',
              aspectRatio: '842 / 595',
            }}
          >
            {/* Background Graphic Frame */}
            <img
              src={ASSETS.ui.certificateFrame}
              alt="CardioSim Certificate Frame"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
            />

            {/* Content Container (Layered exactly per PDF specification) */}
            <div className="relative z-10 w-full h-full flex flex-col justify-between p-10 sm:p-14 select-none">
              
              {/* Header Titles */}
              <div className="pt-2">
                <h1
                  className="font-serif text-4xl sm:text-5xl font-extrabold tracking-widest text-slate-900 drop-shadow-sm uppercase"
                  style={{ letterSpacing: '0.15em' }}
                >
                  CERTIFICATE
                </h1>
                <p
                  className="font-serif italic text-base sm:text-lg text-slate-600 tracking-wider mt-1"
                  style={{ letterSpacing: '0.12em' }}
                >
                  Of Achievement
                </p>
                <div className="w-16 h-0.5 bg-amber-400 mx-auto mt-2"></div>
              </div>

              {/* Presentation Line & Student Name */}
              <div className="my-auto py-2">
                <p className="text-xs sm:text-sm text-slate-600 font-medium tracking-wide mb-3">
                  ขอมอบเกียรติบัตรฉบับนี้ให้ไว้เพื่อแสดงว่า
                </p>
                <div className="border-b-2 border-slate-800/80 max-w-md mx-auto pb-1.5 mb-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-900 tracking-wide">
                    {editableStudent.name || 'พว. ณัฐชา พงษ์ไพศาล'}
                  </h2>
                </div>
                {(editableStudent.studentId || editableStudent.institution) && (
                  <p className="text-[11px] font-medium text-slate-500 font-mono tracking-wider">
                    {editableStudent.studentId && `รหัสนักศึกษา: ${editableStudent.studentId}`}
                    {editableStudent.studentId && editableStudent.institution && ' • '}
                    {editableStudent.institution}
                  </p>
                )}
              </div>

              {/* Achievement Body */}
              <div className="mb-4">
                <p className="text-xs sm:text-sm text-slate-700 font-medium">
                  ผ่านเกณฑ์การประเมินการเรียนรู้จากเกมดิจิทัล
                </p>
                <p className="text-sm sm:text-base font-extrabold text-blue-950 tracking-wider mt-0.5">
                  CardioSim: Heart Hero Simulation
                </p>
                <p className="text-[11px] text-slate-500 mt-2">
                  ให้ ณ วันที่ {currentDate}
                </p>
              </div>

              {/* Signatures (Professors) */}
              <div className="grid grid-cols-2 gap-8 pt-4 max-w-xl mx-auto w-full text-center">
                <div>
                  <div className="w-44 border-b border-slate-700 mx-auto mb-1.5"></div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">
                    รองศาสตราจารย์ ดร.วาสนา รวยสูงเนิน
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                    อาจารย์ที่ปรึกษาโครงการ
                  </p>
                </div>
                <div>
                  <div className="w-44 border-b border-slate-700 mx-auto mb-1.5"></div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">
                    ผู้ช่วยศาสตราจารย์ ดร.มะลิวรรณ ศิลารัตน์
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                    อาจารย์ที่ปรึกษาโครงการ
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            💡 กดปุ่มเพื่อสั่งพิมพ์ลงกระดาษจริง หรือเลือก <span className="text-amber-300 font-semibold">"Save as PDF"</span> ในเบราว์เซอร์
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              ปิด
            </button>
            <ShinyButton
              onClick={handlePrint}
              variant="primary"
              size="sm"
              icon={<Printer className="w-4 h-4" />}
            >
              พิมพ์ใบประกาศนียบัตร (Print / PDF)
            </ShinyButton>
          </div>
        </div>
      </div>
    </div>
  );
};
