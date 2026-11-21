import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Award, Printer, X, Edit3 } from 'lucide-react';
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

const DEFAULT_STUDENT: StudentProfile = {
  studentId: '66010204',
  name: 'พว. ณัฐชา พงษ์ไพศาล',
  institution: 'คณะพยาบาลศาสตร์ มหาวิทยาลัยขอนแก่น',
};

interface CertificateSheetProps {
  id?: string;
  student: StudentProfile;
  currentDate: string;
  className?: string;
  style?: React.CSSProperties;
}

const CertificateSheet: React.FC<CertificateSheetProps> = ({
  id,
  student,
  currentDate,
  className = '',
  style,
}) => (
  <div
    id={id}
    className={`relative bg-white overflow-hidden text-center text-slate-800 ${className}`}
    style={style}
  >
    {/* Background Graphic Frame */}
    <img
      src={ASSETS.ui.certificateFrame}
      alt="CardioSim Certificate Frame"
      className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
    />

    {/* Content Container (Percentage padding keeps identical safe margins on both 842x595 preview and A4 297x210mm print) */}
    <div
      className="relative z-10 w-full h-full flex flex-col justify-between select-none"
      style={{ padding: '7.5% 9% 13.5% 9%' }}
    >
      {/* Header Titles */}
      <div className="pt-2">
        <h1
          className="text-4xl sm:text-5xl font-black text-slate-900 uppercase"
          style={{ letterSpacing: '0.14em' }}
        >
          CERTIFICATE
        </h1>
        <p
          className="text-base sm:text-lg font-bold text-slate-800 mt-1"
          style={{ letterSpacing: '0.18em' }}
        >
          Of Achievement
        </p>
        {/* Gold divider with 4-point star matching official PDF */}
        <div className="flex items-center justify-center gap-2 max-w-xs mx-auto mt-2.5">
          <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-amber-500 to-amber-600" />
          <span className="text-amber-600 text-xs leading-none" aria-hidden="true">
            ✦
          </span>
          <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-amber-500 to-amber-600" />
        </div>
      </div>

      {/* Presentation Line & Student Name */}
      <div className="my-auto py-1">
        <p className="text-sm text-slate-700 font-medium tracking-wide mb-2.5">
          ขอมอบเกียรติบัตรฉบับนี้ให้ไว้เพื่อแสดงว่า
        </p>
        <div className="border-b-2 border-slate-800/80 max-w-md mx-auto pb-1.5 mb-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-900 tracking-wide">
            {student.name || DEFAULT_STUDENT.name}
          </h2>
        </div>
        {(student.studentId || student.institution) && (
          <p className="text-[11px] font-medium text-slate-600 tracking-wide">
            {student.studentId && `รหัสนักศึกษา: ${student.studentId}`}
            {student.studentId && student.institution && ' • '}
            {student.institution}
          </p>
        )}
      </div>

      {/* Achievement Body */}
      <div className="mb-2">
        <p className="text-sm text-slate-800 font-medium">
          ผ่านเกณฑ์การประเมินการเรียนรู้จากเกมดิจิทัล
        </p>
        <p className="text-base sm:text-lg font-extrabold text-slate-900 tracking-wide mt-0.5">
          CardioSim: Heart Hero Simulation
        </p>
        <p className="text-xs text-slate-600 mt-1.5">ให้ ณ วันที่ {currentDate}</p>
      </div>

      {/* Signatures (Project Advisors matching official PDF, safely above bottom wave) */}
      <div className="pt-1 max-w-xl mx-auto w-full text-center">
        <div className="grid grid-cols-2 gap-8">
          <p className="text-xs font-bold text-slate-900 leading-tight">
            รองศาสตราจารย์ ดร.วาสนา รวยสูงเนิน
          </p>
          <p className="text-xs font-bold text-slate-900 leading-tight">
            ผู้ช่วยศาสตราจารย์ ดร.มะลิวรรณ ศิลารัตน์
          </p>
        </div>
        <p className="text-[11px] text-slate-800 font-semibold mt-1.5">
          อาจารย์ที่ปรึกษาโครงการ
        </p>
      </div>
    </div>
  </div>
);

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  student = DEFAULT_STUDENT,
}) => {
  const [editableStudent, setEditableStudent] = useState<StudentProfile>(student);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEditableStudent({
        studentId: student.studentId || DEFAULT_STUDENT.studentId,
        name: student.name || DEFAULT_STUDENT.name,
        institution: student.institution || DEFAULT_STUDENT.institution,
      });
    }
  }, [isOpen, student]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      {/* Print-specific rules: hide #root and show only the dedicated 1-page A4 landscape portal */}
      <style>{`
        .certificate-print-portal {
          display: none;
        }
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          html, body {
            width: 297mm !important;
            height: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #root {
            display: none !important;
          }
          .certificate-print-portal {
            display: block !important;
            width: 297mm !important;
            height: 210mm !important;
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          .certificate-print-portal .certificate-print-sheet {
            width: 297mm !important;
            height: 210mm !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      {/* Dedicated Print Portal mounted directly on document.body for guaranteed 1-page A4 output */}
      {typeof document !== 'undefined' &&
        createPortal(
          <div className="certificate-print-portal" aria-hidden="true">
            <CertificateSheet
              id="certificate-print-canvas"
              student={editableStudent}
              currentDate={currentDate}
              className="certificate-print-sheet"
            />
          </div>,
          document.body
        )}

      <div className="certificate-no-print fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
        <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl relative my-auto">
          {/* Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 text-white">
              <Award className="w-5 h-5 text-amber-400" />
              <h2 className="text-base sm:text-lg font-bold">
                พิมพ์ใบประกาศนียบัตร (Certificate of Achievement)
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 text-slate-300 text-xs font-medium hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                {isEditing ? 'เสร็จสิ้นการแก้ไข' : 'แก้ไขชื่อผู้เรียน'}
              </button>
              <button
                type="button"
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
                    onChange={(e) =>
                      setEditableStudent({ ...editableStudent, name: e.target.value })
                    }
                    placeholder="เช่น พว. ณัฐชา พงษ์ไพศาล"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">รหัสนักศึกษา</label>
                  <input
                    type="text"
                    value={editableStudent.studentId}
                    onChange={(e) =>
                      setEditableStudent({ ...editableStudent, studentId: e.target.value })
                    }
                    placeholder="เช่น 66010204"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">สถาบัน / คณะ</label>
                  <input
                    type="text"
                    value={editableStudent.institution}
                    onChange={(e) =>
                      setEditableStudent({ ...editableStudent, institution: e.target.value })
                    }
                    placeholder="เช่น คณะพยาบาลศาสตร์ มหาวิทยาลัยขอนแก่น"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Certificate Interactive Canvas Preview */}
          <div className="overflow-x-auto my-4 py-2 flex justify-start lg:justify-center">
            <CertificateSheet
              id="certificate-canvas"
              student={editableStudent}
              currentDate={currentDate}
              className="shadow-2xl rounded-2xl"
              style={{
                width: '842px',
                height: '595px',
                minWidth: '842px',
                minHeight: '595px',
                aspectRatio: '842 / 595',
              }}
            />
          </div>

          {/* Bottom Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <div className="text-xs text-slate-400">
              💡 กดปุ่มเพื่อสั่งพิมพ์ลงกระดาษจริง หรือเลือก{' '}
              <span className="text-amber-300 font-semibold">&quot;Save as PDF&quot;</span> ในเบราว์เซอร์
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
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
    </>
  );
};
