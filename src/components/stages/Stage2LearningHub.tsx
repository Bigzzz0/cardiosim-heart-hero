import React, { useState } from 'react';
import { LEARNING_VIDEOS } from '../../data/learningVideosData';
import { ArrowLeft, BookOpen, Check, CheckCircle2, ChevronRight } from 'lucide-react';
import { DocumentArt } from '../ui/DocumentArt';
import { clinicalAudio } from '../../services/clinicalAudioEngine';
import './learning-hub.css';

interface Stage2LearningHubProps {
  onComplete: () => void;
}

/** Readable topic sheets using existing lesson summaries; no simulated video. */
export const Stage2LearningHub: React.FC<Stage2LearningHubProps> = ({ onComplete }) => {
  const [selectedId, setSelectedId] = useState(LEARNING_VIDEOS[0].id);
  const [reviewedIds, setReviewedIds] = useState<number[]>([]);
  const selectedIndex = LEARNING_VIDEOS.findIndex(topic => topic.id === selectedId);
  const activeTopic = LEARNING_VIDEOS[selectedIndex];
  const reviewed = reviewedIds.includes(selectedId);
  const progress = Math.round(reviewedIds.length / LEARNING_VIDEOS.length * 100);
  const selectTopic = (id: number) => {
    setSelectedId(id);
    clinicalAudio.playHeartBeep(800, 0.05);
    if (window.innerWidth <= 760) window.requestAnimationFrame(() => {
      const heading = document.getElementById('knowledge-sheet-title');
      heading?.scrollIntoView({ block: 'start' });
      heading?.focus({ preventScroll: true });
    });
  };
  const toggleReviewed = () => {
    setReviewedIds(ids => ids.includes(selectedId) ? ids.filter(id => id !== selectedId) : [...ids, selectedId]);
  };

  return <div className="learning-hub">
    <header className="knowledge-intro">
      <DocumentArt/>
      <div><span className="knowledge-eyebrow">ขั้นตอนที่ 2 · คลังความรู้</span>
        <h2>ใบความรู้ก่อนเริ่มสถานการณ์</h2>
        <p>เลือกอ่านสรุปทั้ง 6 หัวข้อ แล้วบันทึกหัวข้อที่ทบทวนแล้ว</p>
      </div>
    </header>
    <div className="knowledge-progress">
      <label htmlFor="knowledge-review-progress">ทบทวนแล้ว <strong>{reviewedIds.length} / {LEARNING_VIDEOS.length} หัวข้อ</strong></label>
      <progress id="knowledge-review-progress" max={LEARNING_VIDEOS.length} value={reviewedIds.length}/>
      <span>{progress}%</span>
    </div>
    <div className="knowledge-layout">
      <nav className="knowledge-topics" aria-label="หัวข้อใบความรู้">
        {LEARNING_VIDEOS.map((topic, index) => <button key={topic.id} type="button"
          data-knowledge-topic={topic.id} aria-pressed={selectedId === topic.id}
          aria-controls="knowledge-sheet" onClick={() => selectTopic(topic.id)}>
          <span className="knowledge-topic-number">{reviewedIds.includes(topic.id) ? <Check size={18}/> : String(index + 1).padStart(2, '0')}</span>
          <span>{topic.title.replace(/^\d+\.\s*/, '')}<small>{reviewedIds.includes(topic.id) ? 'ทบทวนแล้ว' : 'ยังไม่ได้บันทึกการทบทวน'}</small></span>
        </button>)}
      </nav>
      <article id="knowledge-sheet" className="knowledge-sheet" aria-labelledby="knowledge-sheet-title">
        <div className="knowledge-sheet-heading"><DocumentArt/><span className="knowledge-eyebrow">ใบความรู้ · {selectedIndex + 1} / {LEARNING_VIDEOS.length}</span></div>
        <h3 id="knowledge-sheet-title" tabIndex={-1}>{activeTopic.title.replace(/^\d+\.\s*/, '')}</h3>
        <section aria-label="สรุปหัวข้อ"><h4><BookOpen size={19}/> สรุปหัวข้อ</h4><p>{activeTopic.description}</p></section>
        <section aria-label="ประเด็นทบทวน"><h4>ประเด็นที่ควรทบทวน</h4><ul>{activeTopic.topics.map(topic => <li key={topic}>{topic}</li>)}</ul></section>
        <p className="knowledge-source-note">สรุปจากบทเรียนเดิม · วิดีโอประกอบยังไม่พร้อมให้รับชม</p>
        <button className="knowledge-review-button" type="button" aria-pressed={reviewed} onClick={toggleReviewed}>
          <CheckCircle2 size={20}/>{reviewed ? 'ทบทวนหัวข้อนี้แล้ว · กดเพื่อยกเลิก' : 'บันทึกว่าอ่านหัวข้อนี้แล้ว'}
        </button>
        <div className="knowledge-pagination">
          <button type="button" disabled={selectedIndex === 0} onClick={() => selectTopic(LEARNING_VIDEOS[selectedIndex - 1].id)}><ArrowLeft size={17}/> หัวข้อก่อนหน้า</button>
          <button type="button" disabled={selectedIndex === LEARNING_VIDEOS.length - 1} onClick={() => selectTopic(LEARNING_VIDEOS[selectedIndex + 1].id)}>หัวข้อถัดไป <ChevronRight size={17}/></button>
        </div>
      </article>
    </div>
    <div className="knowledge-next">
      <p>{reviewedIds.length === LEARNING_VIDEOS.length ? 'ทบทวนครบทุกหัวข้อแล้ว พร้อมเข้าสู่สถานการณ์' : 'เลือกเข้าสู่สถานการณ์ได้แม้ยังทบทวนไม่ครบทุกหัวข้อ'}</p>
      <button type="button" onClick={onComplete}>เข้าสู่การเลือกสถานการณ์ (เลือกเคส)<ChevronRight size={19}/></button>
    </div>
  </div>;
};
