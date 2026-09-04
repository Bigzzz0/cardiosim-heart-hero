import React, { useState, useEffect } from 'react';
import { LEARNING_VIDEOS } from '../../data/learningVideosData';
import { Play, Pause, CheckCircle2, ChevronRight, Video, Sparkles, Clock, BookOpen, Heart, Stethoscope, Activity, Bed, Pill, ClipboardList } from 'lucide-react';
import { clinicalAudio } from '../../services/clinicalAudioEngine';
import { SpotlightCard } from '../ui/SpotlightCard';
import { ShinyButton } from '../ui/ShinyButton';
import { AnimatedCounter } from '../ui/AnimatedCounter';

interface Stage2LearningHubProps {
  onComplete: () => void;
}

export const Stage2LearningHub: React.FC<Stage2LearningHubProps> = ({ onComplete }) => {
  const [videos, setVideos] = useState(LEARNING_VIDEOS);
  const [selectedVideoId, setSelectedVideoId] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [simulatedProgress, setSimulatedProgress] = useState(0);

  const activeVideo = videos.find(v => v.id === selectedVideoId) || videos[0];
  const watchedCount = videos.filter(v => v.watched).length;
  const progressPercent = Math.round((watchedCount / videos.length) * 100);

  useEffect(() => {
    let timer: number;
    if (isPlaying) {
      timer = window.setInterval(() => {
        setSimulatedProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            setVideos(curr => curr.map(v => v.id === selectedVideoId ? { ...v, watched: true } : v));
            clinicalAudio.playSuccessChime();
            return 100;
          }
          return prev + 5;
        });
      }, 300);
    }
    return () => clearInterval(timer);
  }, [isPlaying, selectedVideoId]);

  const handleSelectVideo = (id: number) => {
    clinicalAudio.playHeartBeep(800, 0.05);
    setSelectedVideoId(id);
    setIsPlaying(false);
    setSimulatedProgress(0);
  };

  const handleTogglePlay = () => {
    if (!isPlaying) {
      clinicalAudio.playHeartBeep(920, 0.08);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const handleMarkAllWatched = () => {
    setVideos(curr => curr.map(v => ({ ...v, watched: true })));
    clinicalAudio.playSuccessChime();
  };

  const renderIcon = (key: string, className = "w-6 h-6") => {
    switch (key) {
      case 'heart': return <Heart className={className} />;
      case 'stethoscope': return <Stethoscope className={className} />;
      case 'activity': return <Activity className={className} />;
      case 'bed': return <Bed className={className} />;
      case 'pill': return <Pill className={className} />;
      case 'clipboard': return <ClipboardList className={className} />;
      default: return <Video className={className} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 py-8">
      {/* Top Title Banner */}
      <SpotlightCard
        className="p-6 mb-6 shadow-md border-pink-100/80"
        spotlightColor="rgba(244, 63, 94, 0.08)"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-0.5 rounded-full uppercase tracking-wider">
                ขั้นตอนที่ 2 / คลังความรู้
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-1">
              คลังความรู้ก่อนเริ่มสถานการณ์ (Knowledge Bank)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              คลิปวิดีโอในการให้ความรู้ได้รับชมก่อนเริ่มเกมส์ (ความยาว 1–3 นาที ทั้งหมด 6 หัวข้อ)
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right bg-rose-50/80 border border-rose-100 px-4 py-2 rounded-2xl">
              <div className="text-xs text-slate-500 font-medium">ความก้าวหน้า</div>
              <div className="text-xl font-bold font-mono text-rose-600">
                <AnimatedCounter value={progressPercent} suffix="%" />
              </div>
            </div>
            <button
              onClick={handleMarkAllWatched}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-3.5 py-2.5 rounded-xl transition-all font-medium active:scale-95"
            >
              (ลัด) ดูครบทุกหัวข้อ
            </button>
          </div>
        </div>
      </SpotlightCard>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Video Player Screen (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-white border border-pink-100 rounded-3xl overflow-hidden shadow-xl flex flex-col">
            {/* Simulated Video Canvas with 21st.dev modern dark theater gradient */}
            <div className="relative aspect-video bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 border-b border-slate-200 overflow-hidden">
              {/* Subtle Scanline / Ambient Glow */}
              <div className="absolute inset-0 bg-radial-gradient from-rose-500/10 via-transparent to-transparent pointer-events-none" />

              <div className="w-16 h-16 rounded-2xl bg-white/10 text-rose-400 flex items-center justify-center mb-3 shadow-lg backdrop-blur-md border border-white/20">
                {renderIcon(activeVideo.iconKey, "w-8 h-8")}
              </div>
              <h4 className="text-base sm:text-lg font-bold text-center text-white max-w-md line-clamp-2">
                {activeVideo.title}
              </h4>
              <p className="text-xs text-rose-200 mt-1 flex items-center gap-1.5 font-mono">
                <Clock className="w-3.5 h-3.5" />
                ความยาว: {activeVideo.duration}
              </p>

              {/* Play/Pause Button */}
              <button
                onClick={handleTogglePlay}
                className="mt-4 w-14 h-14 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/40 transition-transform active:scale-95 hover:scale-105"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
              </button>

              {/* Progress Scrubber */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-rose-400 to-pink-500 transition-all duration-300"
                  style={{ width: `${simulatedProgress}%` }}
                />
              </div>
            </div>

            {/* Video Meta & Summary */}
            <div className="p-6">
              <h3 className="font-bold text-slate-800 text-base mb-1.5">{activeVideo.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                {activeVideo.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {activeVideo.topics.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1 rounded-full flex items-center gap-1.5 font-medium"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-rose-500" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Video Playlist Cards (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <h3 className="text-sm font-bold text-slate-700 flex items-center justify-between">
            <span>รายการคลิปวิดีโอ (6 หัวข้อ)</span>
            <span className="text-xs text-rose-600 font-mono font-bold">{watchedCount} / {videos.length} สำเร็จ</span>
          </h3>

          <div className="space-y-2.5 overflow-y-auto max-h-[480px] pr-1">
            {videos.map(v => {
              const isCurrent = v.id === selectedVideoId;
              return (
                <SpotlightCard
                  key={v.id}
                  onClick={() => handleSelectVideo(v.id)}
                  spotlightColor={isCurrent ? "rgba(244, 63, 94, 0.15)" : "rgba(20, 184, 166, 0.08)"}
                  className={`w-full text-left p-3.5 transition-all flex items-start gap-3.5 cursor-pointer ${
                    isCurrent
                      ? 'bg-rose-50/80 border-rose-300 ring-1 ring-rose-300 shadow-md'
                      : 'hover:border-pink-200 hover:bg-slate-50/80'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    isCurrent ? 'bg-rose-500 text-white border-rose-400' : 'bg-slate-50 text-rose-500 border-slate-200'
                  }`}>
                    {renderIcon(v.iconKey, "w-5 h-5")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-xs font-bold text-slate-800 line-clamp-1">
                        {v.title}
                      </span>
                      {v.watched && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{v.description}</p>
                    <span className="text-[10px] text-rose-600 font-mono font-semibold mt-1 block">
                      เวลา {v.duration}
                    </span>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>

          <ShinyButton
            onClick={() => {
              clinicalAudio.playHeartBeep(880, 0.1);
              onComplete();
            }}
            variant="primary"
            size="lg"
            icon={<ChevronRight className="w-4 h-4" />}
            className="w-full mt-2"
          >
            เข้าสู่การเลือกสถานการณ์ (เลือกเคส)
          </ShinyButton>
        </div>
      </div>
    </div>
  );
};
