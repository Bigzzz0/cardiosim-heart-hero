import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Award, Printer, X, Edit3, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
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

const CERT_BASE_WIDTH = 842;
const CERT_BASE_HEIGHT = 595;

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

    {/* Content Container (Percentage padding keeps identical safe margins on both preview and A4 297x210mm print) */}
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
  const [zoomMultiplier, setZoomMultiplier] = useState(1);
  const previewHostRef = useRef<HTMLDivElement>(null);
  const [hostWidth, setHostWidth] = useState(() =>
    typeof window !== 'undefined' ? Math.min(CERT_BASE_WIDTH, window.innerWidth - 48) : CERT_BASE_WIDTH
  );

  useEffect(() => {
    if (isOpen) {
      setEditableStudent({
        studentId: student.studentId || DEFAULT_STUDENT.studentId,
        name: student.name || DEFAULT_STUDENT.name,
        institution: student.institution || DEFAULT_STUDENT.institution,
      });
      setZoomMultiplier(1);
    }
  }, [isOpen, student]);

  useEffect(() => {
    if (!isOpen) return;
    const host = previewHostRef.current;
    if (!host) return;

    const measure = () => {
      const style = getComputedStyle(host);
      const padX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      const available = Math.max(240, host.clientWidth - padX);
      setHostWidth(available);
    };

    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    return () => observer.disconnect();
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const fitScale = hostWidth > 0 ? Math.min(1, hostWidth / CERT_BASE_WIDTH) : 1;
  const effectiveScale = Math.min(2.5, fitScale * zoomMultiplier);
  const scaledWidth = Math.round(CERT_BASE_WIDTH * effectiveScale);
  const scaledHeight = Math.round(CERT_BASE_HEIGHT * effectiveScale);

  const zoomIn = () => setZoomMultiplier((z) => Math.min(2.5, Number((z + 0.5).toFixed(2))));
  const zoomOut = () => setZoomMultiplier((z) => Math.max(1, Number((z - 0.5).toFixed(2))));
  const toggleFitOrRead = () => setZoomMultiplier((z) => (z === 1 ? 2 : 1));

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
        <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-4xl w-full p-3.5 sm:p-6 shadow-2xl relative my-auto">
          {/* Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-white">
              <Award className="w-5 h-5 text-amber-400 shrink-0" />
              <h2 className="text-sm sm:text-lg font-bold leading-snug">
                พิมพ์ใบประกาศนียบัตร (Certificate)
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
                aria-label="ปิดหน้าต่าง"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Edit Fields (if editing) */}
          {isEditing && (
            <div className="bg-slate-800/90 border border-amber-500/30 rounded-2xl p-3.5 my-3 animate-in fade-in duration-150">
              <p className="text-xs text-amber-300 font-semibold mb-2.5 flex items-center gap-1.5">
                <Edit3 className="w-4 h-4" /> ปรับแต่งข้อมูลสำหรับแสดงบนใบประกาศ (พิมพ์ได้ทันที):
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
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

          {/* PDF-Style Viewer Toolbar (Fit-to-Screen + Zoom Controls) */}
          <div className="flex flex-wrap items-center justify-between gap-2 my-2.5 px-2.5 py-1.5 rounded-xl bg-slate-800/70 border border-slate-700/70">
            <span className="text-[11px] text-slate-300">
              แตะใบประกาศเพื่อซูมดูชื่อ · เลื่อนนิ้วดูรายละเอียดเมื่อขยาย
            </span>
            <div className="flex items-center gap-1.5 ml-auto">
              <button
                type="button"
                onClick={zoomOut}
                disabled={zoomMultiplier <= 1}
                aria-label="ซูมออก"
                className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-200 hover:bg-slate-700 disabled:opacity-40 transition-colors"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono font-semibold text-slate-200 min-w-[46px] text-center">
                {zoomMultiplier === 1 ? 'พอดีจอ' : `${Math.round(zoomMultiplier * 100)}%`}
              </span>
              <button
                type="button"
                onClick={zoomIn}
                disabled={zoomMultiplier >= 2.5}
                aria-label="ซูมเข้า"
                className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-200 hover:bg-slate-700 disabled:opacity-40 transition-colors"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={toggleFitOrRead}
                className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-400/40 text-amber-200 hover:bg-amber-500/25 text-[11px] font-semibold flex items-center gap-1 transition-colors"
              >
                <Maximize2 className="w-3 h-3" />
                <span>{zoomMultiplier === 1 ? 'ขยายดูชื่อ' : 'พอดีจอ'}</span>
              </button>
            </div>
          </div>

          {/* Certificate Fit-to-Screen & Zoomable PDF-Style Preview */}
          <div
            ref={previewHostRef}
            className="w-full overflow-auto rounded-2xl bg-slate-950/60 border border-slate-800/80 p-1.5 sm:p-2 max-h-[62vh] mb-3"
            style={{ touchAction: 'pan-x pan-y pinch-zoom' }}
          >
            <div
              onClick={toggleFitOrRead}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleFitOrRead();
                }
              }}
              aria-label={zoomMultiplier === 1 ? 'แตะเพื่อขยายดูรายละเอียดใบประกาศ' : 'แตะเพื่อย่อพอดีจอ'}
              className={`relative mx-auto overflow-hidden rounded-xl shadow-2xl ${
                zoomMultiplier === 1 ? 'cursor-zoom-in' : 'cursor-zoom-out'
              }`}
              style={{
                width: `${scaledWidth}px`,
                height: `${scaledHeight}px`,
              }}
            >
              <CertificateSheet
                id="certificate-canvas"
                student={editableStudent}
                currentDate={currentDate}
                style={{
                  width: `${CERT_BASE_WIDTH}px`,
                  height: `${CERT_BASE_HEIGHT}px`,
                  transform: `scale(${effectiveScale})`,
                  transformOrigin: 'top left',
                }}
              />
            </div>
          </div>

          {/* Bottom Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-800">
            <div className="text-[11px] sm:text-xs text-slate-400">
              💡 กดปุ่มเพื่อพิมพ์ หรือเลือก{' '}
              <span className="text-amber-300 font-semibold">&quot;Save as PDF&quot;</span> เพื่อเก็บไฟล์เต็มหน้า
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-colors"
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
