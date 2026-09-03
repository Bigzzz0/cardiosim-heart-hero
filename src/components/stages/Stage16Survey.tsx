import React, { useState } from 'react';
import { GameTelemetry } from '../../types/game';
import { exportTelemetryToCSV, exportTelemetryToJSON } from '../../services/researchExporter';
import { Heart, Download, FileSpreadsheet, Send, CheckCircle2, RotateCcw, MessageSquare, Star } from 'lucide-react';
import { clinicalAudio } from '../../services/clinicalAudioEngine';

interface Stage16SurveyProps {
  telemetry: GameTelemetry;
  onRestart: () => void;
}

export const Stage16Survey: React.FC<Stage16SurveyProps> = ({ telemetry, onRestart }) => {
  const [ratings, setRatings] = useState<Record<string, number>>({
    sus_1: 5,
    sus_2: 1,
    sus_3: 5,
    sus_4: 1,
    sus_5: 5
  });
  const [feedback, setFeedback] = useState('เกมมีประโยชน์มาก ช่วยให้เข้าใจการดูแลผู้ป่วยน้ำท่วมปอดและจังหวะ EKG ได้สมจริง');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const surveyItems = [
    { id: 'sus_1', text: '1. เกมจำลองสถานการณ์นี้ช่วยเพิ่มความเข้าใจในการพยาบาลผู้ป่วยโรคหัวใจได้อย่างชัดเจน' },
    { id: 'sus_2', text: '2. ฉันรู้สึกว่าขั้นตอนการเล่นมีความซับซ้อนเกินไปและใช้งานยาก' },
    { id: 'sus_3', text: '3. ระบบลากวางการ์ดและการแตะตรวจร่างกายมีความสมจริงและน่าสนใจ' },
    { id: 'sus_4', text: '4. ฉันต้องการความช่วยเหลือจากผู้อื่นจึงจะสามารถเล่นเกมนี้ได้' },
    { id: 'sus_5', text: '5. ฉันมั่นใจว่าจะสามารถนำความรู้และทักษะจากเกมนี้ไปประยุกต์ใช้ในการขึ้นฝึกปฏิบัติงานจริงได้' }
  ];

  const handleSetRating = (id: string, score: number) => {
    clinicalAudio.playHeartBeep(880, 0.04);
    setRatings(prev => ({
      ...prev,
      [id]: score
    }));
  };

  const handleExportCSV = () => {
    const finalTelemetry: GameTelemetry = {
      ...telemetry,
      surveyScores: ratings,
      feedbackText: feedback,
      completedAt: new Date().toISOString()
    };
    exportTelemetryToCSV(finalTelemetry);
  };

  const handleExportJSON = () => {
    const finalTelemetry: GameTelemetry = {
      ...telemetry,
      surveyScores: ratings,
      feedbackText: feedback,
      completedAt: new Date().toISOString()
    };
    exportTelemetryToJSON(finalTelemetry);
  };

  const handleSubmitSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    clinicalAudio.playSuccessChime();
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      {/* Thank you card (Matching PDF Page 11 bottom) */}
      <div className="bg-white border-2 border-pink-100 rounded-3xl p-6 sm:p-9 mb-8 shadow-xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto mb-3.5 shadow-sm">
          <Heart className="w-8 h-8 fill-rose-500 text-rose-500" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
          ขอบคุณที่ให้ความร่วมมือ!
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
          หวังว่าผู้เรียนทุกคนจะได้รับความรู้จากการเรียนรู้ผ่าน Simulation นี้ และพร้อมก้าวสู่การเป็นส่วนหนึ่งในการดูแลผู้ป่วยโรคหัวใจ
        </p>

        {/* Action Export Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <button
            onClick={handleExportCSV}
            className="py-3 px-5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-teal-200 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>ดาวน์โหลดข้อมูลวิจัย (SPSS .CSV)</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold text-xs flex items-center gap-2 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>ดาวน์โหลด Raw Data (.JSON)</span>
          </button>
        </div>
      </div>

      {/* Satisfaction Survey Form */}
      <div className="bg-white border border-pink-100 rounded-3xl p-6 sm:p-8 shadow-xl mb-8">
        <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-100">
          <MessageSquare className="w-5 h-5 text-rose-500" />
          <div>
            <h3 className="text-base font-bold text-slate-800">
              แบบประเมินความพึงพอใจต่อนวัตกรรม (Satisfaction & Feedback Survey)
            </h3>
            <p className="text-xs text-slate-500">
              มาตราส่วนประมาณค่า 5 ระดับ (1 = น้อยที่สุด, 5 = มากที่สุด) เพื่อนำไปวิเคราะห์ในงานวิจัย
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmitSurvey} className="space-y-6">
          <div className="space-y-4">
            {surveyItems.map(item => {
              const currentScore = ratings[item.id] || 5;
              return (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <p className="text-xs sm:text-sm text-slate-700 mb-3 font-semibold">
                    {item.text}
                  </p>
                  <div className="flex items-center justify-between gap-2 max-w-sm">
                    {[1, 2, 3, 4, 5].map(score => {
                      const isSelected = currentScore === score;
                      return (
                        <button
                          key={score}
                          type="button"
                          onClick={() => handleSetRating(item.id, score)}
                          className={`w-10 h-10 rounded-xl font-bold font-mono text-xs transition-all border ${
                            isSelected
                              ? 'bg-rose-500 text-white border-rose-400 shadow-md ring-2 ring-rose-200'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {score}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              ข้อเสนอแนะเพิ่มเติมเพื่อการพัฒนานวัตกรรม CardioSim ในอนาคต
            </label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="แสดงความคิดเห็นหรือข้อเสนอแนะ..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-rose-400 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onRestart}
              className="py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-2 border border-slate-200 transition-all shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>เริ่มเล่นใหม่ตั้งแต่ต้น (Restart)</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitted}
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-rose-200 transition-all disabled:opacity-50"
            >
              {isSubmitted ? <CheckCircle2 className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              <span>{isSubmitted ? 'ส่งแบบประเมินเรียบร้อย' : 'ส่งแบบประเมิน'}</span>
            </button>
          </div>
        </form>

        {isSubmitted && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>บันทึกแบบประเมินเข้าสู่ฐานข้อมูลวิจัยเรียบร้อยแล้ว คุณสามารถกดปุ่ม "ดาวน์โหลดข้อมูลวิจัย (SPSS .CSV)" ด้านบนเพื่อนำผลไปวิเคราะห์สถิติได้ทันที</span>
          </div>
        )}
      </div>
    </div>
  );
};
