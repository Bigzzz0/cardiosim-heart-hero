import React, { useState, useEffect } from 'react';
import { GameStage, StudentProfile, GameTelemetry } from './types/game';
import { Header } from './components/common/Header';
import { PatientVitalsRibbon } from './components/common/PatientVitalsRibbon';
import { FloatingEHRDrawer } from './components/common/FloatingEHRDrawer';
import { Stage0Landing } from './components/stages/Stage0Landing';
import { Stage1PreTest } from './components/stages/Stage1PreTest';
import { Stage2LearningHub } from './components/stages/Stage2LearningHub';
import { Stage3ScenarioSelect } from './components/stages/Stage3ScenarioSelect';
import { Stage4MissionBrief } from './components/stages/Stage4MissionBrief';
import { Stage5Handover } from './components/stages/Stage5Handover';
import { Stage6Assessment } from './components/stages/Stage6Assessment';
import { Stage7Prioritization } from './components/stages/Stage7Prioritization';
import { Stage8Rationale } from './components/stages/Stage8Rationale';
import { Stage9ActionABC } from './components/stages/Stage9ActionABC';
import { Stage10Medication } from './components/stages/Stage10Medication';
import { Stage11IORecord } from './components/stages/Stage11IORecord';
import { Stage12CrisisEvent } from './components/stages/Stage12CrisisEvent';
import { Stage13Debrief } from './components/stages/Stage13Debrief';
import { Stage14PostTest } from './components/stages/Stage14PostTest';
import { Stage15Results } from './components/stages/Stage15Results';
import { Stage16Survey } from './components/stages/Stage16Survey';
import { calculateHakeGain } from './services/researchExporter';

export const App: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<GameStage>('LANDING');

  // Student Profile
  const [student, setStudent] = useState<StudentProfile>({
    studentId: '',
    name: '',
    institution: ''
  });

  // User rankings & errors from stages
  const [prioritizationRanking, setPrioritizationRanking] = useState<string[]>([]);
  const [prioritizationErrors, setPrioritizationErrors] = useState(0);

  // Telemetry
  const [telemetry, setTelemetry] = useState<GameTelemetry>({
    student: { studentId: '', name: '', institution: '' },
    preTestScore: 0,
    preTestAnswers: {},
    postTestScore: 0,
    postTestAnswers: {},
    learningGain: 0,
    discoveredHotspots: [],
    prioritizationErrors: 0,
    medicationErrors: 0,
    ioErrors: 0,
    crisisResponseTimeSeconds: 0,
    totalTimeSeconds: 0,
    surveyScores: {},
    feedbackText: '',
    ncjmmScores: {
      recognizeCues: 95,
      analyzeCues: 90,
      prioritizeHypotheses: 85,
      generateSolutions: 90,
      takeAction: 95,
      evaluateOutcomes: 90
    }
  });

  // Timer tracking
  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetry(prev => ({
        ...prev,
        totalTimeSeconds: prev.totalTimeSeconds + 1
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getProgressPercentage = (stage: GameStage): number => {
    switch (stage) {
      case 'LANDING': return 0;
      case 'PRETEST': return 5;
      case 'LEARNING_HUB': return 10;
      case 'SCENARIO_SELECT': return 10;
      case 'MISSION_BRIEF': return 10;
      case 'STAGE1_HANDOVER': return 10;
      case 'STAGE2_ASSESSMENT': return 20;
      case 'STAGE3_PRIORITIZATION': return 25;
      case 'STAGE4_RATIONALE': return 25;
      case 'STAGE5_ABC_ACTION': return 30;
      case 'STAGE6_MEDICATION': return 40;
      case 'STAGE7_IO_RECORD': return 50;
      case 'STAGE8_CRISIS_EVENT': return 85;
      case 'STAGE9_DEBRIEF': return 90;
      case 'POSTTEST': return 95;
      case 'RESULTS_DASHBOARD': return 100;
      case 'SURVEY': return 100;
      default: return 0;
    }
  };

  // Stage Handlers
  const handleStartGame = (profile: StudentProfile) => {
    setStudent(profile);
    setTelemetry(prev => ({ ...prev, student: profile }));
    setCurrentStage('PRETEST');
  };

  const handleCompletePreTest = (score: number, answers: Record<number, string>) => {
    setTelemetry(prev => ({
      ...prev,
      preTestScore: score,
      preTestAnswers: answers
    }));
    setCurrentStage('LEARNING_HUB');
  };

  const handleCompleteLearningHub = () => {
    setCurrentStage('SCENARIO_SELECT');
  };

  const handleSelectScenario = (_scenarioId: number) => {
    setCurrentStage('MISSION_BRIEF');
  };

  const handleAcceptMission = () => {
    setCurrentStage('STAGE1_HANDOVER');
  };

  const handleCompleteHandover = () => {
    setCurrentStage('STAGE2_ASSESSMENT');
  };

  const handleCompleteAssessment = (discoveredHotspots: string[]) => {
    setTelemetry(prev => ({
      ...prev,
      discoveredHotspots
    }));
    setCurrentStage('STAGE3_PRIORITIZATION');
  };

  const handleCompletePrioritization = (userRanking: string[], errorCount: number) => {
    setPrioritizationRanking(userRanking);
    setPrioritizationErrors(errorCount);
    setTelemetry(prev => ({
      ...prev,
      prioritizationErrors: errorCount
    }));
    setCurrentStage('STAGE4_RATIONALE');
  };

  const handleCompleteRationale = () => {
    setCurrentStage('STAGE5_ABC_ACTION');
  };

  const handleCompleteActionABC = () => {
    setCurrentStage('STAGE6_MEDICATION');
  };

  const handleCompleteMedication = () => {
    setCurrentStage('STAGE7_IO_RECORD');
  };

  const handleCompleteIORecord = (ioErrors: number) => {
    setTelemetry(prev => ({
      ...prev,
      ioErrors
    }));
    setCurrentStage('STAGE8_CRISIS_EVENT');
  };

  const handleCompleteCrisisEvent = () => {
    setCurrentStage('STAGE9_DEBRIEF');
  };

  const handleCompleteDebrief = () => {
    setCurrentStage('POSTTEST');
  };

  const handleCompletePostTest = (score: number, answers: Record<number, string>) => {
    const gain = calculateHakeGain(telemetry.preTestScore, score);
    setTelemetry(prev => ({
      ...prev,
      postTestScore: score,
      postTestAnswers: answers,
      learningGain: gain,
      completedAt: new Date().toISOString()
    }));
    setCurrentStage('RESULTS_DASHBOARD');
  };

  const handleProceedToSurvey = () => {
    setCurrentStage('SURVEY');
  };

  const handleRestart = () => {
    setCurrentStage('LANDING');
  };

  const isClinicalStage = [
    'STAGE1_HANDOVER',
    'STAGE2_ASSESSMENT',
    'STAGE3_PRIORITIZATION',
    'STAGE4_RATIONALE',
    'STAGE5_ABC_ACTION',
    'STAGE6_MEDICATION',
    'STAGE7_IO_RECORD',
    'STAGE8_CRISIS_EVENT',
    'STAGE9_DEBRIEF'
  ].includes(currentStage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/60 via-white to-sky-50/40 text-slate-800 flex flex-col font-prompt selection:bg-rose-500 selection:text-white relative">
      <Header
        currentStage={currentStage}
        progressPercent={getProgressPercentage(currentStage)}
        student={student}
        onResetToLanding={handleRestart}
      />

      {/* Persistent Patient Vitals Ribbon across clinical simulation stages */}
      <PatientVitalsRibbon currentStage={currentStage} />

      {/* Slide-over EHR Drawer floating in clinical stages */}
      {isClinicalStage && <FloatingEHRDrawer />}

      <main className="flex-1">
        {currentStage === 'LANDING' && (
          <Stage0Landing onStartGame={handleStartGame} />
        )}
        {currentStage === 'PRETEST' && (
          <Stage1PreTest onComplete={handleCompletePreTest} />
        )}
        {currentStage === 'LEARNING_HUB' && (
          <Stage2LearningHub onComplete={handleCompleteLearningHub} />
        )}
        {currentStage === 'SCENARIO_SELECT' && (
          <Stage3ScenarioSelect onSelectScenario={handleSelectScenario} />
        )}
        {currentStage === 'MISSION_BRIEF' && (
          <Stage4MissionBrief onAcceptMission={handleAcceptMission} />
        )}
        {currentStage === 'STAGE1_HANDOVER' && (
          <Stage5Handover onComplete={handleCompleteHandover} />
        )}
        {currentStage === 'STAGE2_ASSESSMENT' && (
          <Stage6Assessment onComplete={handleCompleteAssessment} />
        )}
        {currentStage === 'STAGE3_PRIORITIZATION' && (
          <Stage7Prioritization onComplete={handleCompletePrioritization} />
        )}
        {currentStage === 'STAGE4_RATIONALE' && (
          <Stage8Rationale
            userRanking={prioritizationRanking}
            errorCount={prioritizationErrors}
            onNext={handleCompleteRationale}
          />
        )}
        {currentStage === 'STAGE5_ABC_ACTION' && (
          <Stage9ActionABC onComplete={handleCompleteActionABC} />
        )}
        {currentStage === 'STAGE6_MEDICATION' && (
          <Stage10Medication onComplete={handleCompleteMedication} />
        )}
        {currentStage === 'STAGE7_IO_RECORD' && (
          <Stage11IORecord onComplete={handleCompleteIORecord} />
        )}
        {currentStage === 'STAGE8_CRISIS_EVENT' && (
          <Stage12CrisisEvent onComplete={handleCompleteCrisisEvent} />
        )}
        {currentStage === 'STAGE9_DEBRIEF' && (
          <Stage13Debrief onComplete={handleCompleteDebrief} />
        )}
        {currentStage === 'POSTTEST' && (
          <Stage14PostTest onComplete={handleCompletePostTest} />
        )}
        {currentStage === 'RESULTS_DASHBOARD' && (
          <Stage15Results
            student={student}
            preScore={telemetry.preTestScore}
            postScore={telemetry.postTestScore}
            onProceedToSurvey={handleProceedToSurvey}
          />
        )}
        {currentStage === 'SURVEY' && (
          <Stage16Survey
            telemetry={telemetry}
            onRestart={handleRestart}
          />
        )}
      </main>

      {/* Footer Branding */}
      <footer className="py-4 border-t border-pink-100/80 bg-white/80 backdrop-blur-sm text-center text-xs text-slate-500">
        <p>CardioSim: Heart Hero Simulation • นวัตกรรมเกมจำลองสถานการณ์เสมือนจริงการตัดสินใจทางคลินิก (NCJMM)</p>
      </footer>
    </div>
  );
};
