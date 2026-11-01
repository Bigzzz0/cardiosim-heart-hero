/**
 * Centralized Asset Registry for CardioSim
 * 
 * Provides type-safe path references for all runtime images and media.
 * Keep paths aligned with public/assets/ directory structure.
 */

export const ASSETS = {
  /**
   * Bedside clinical instruments and interactive objects
   */
  bedside: {
    ampoule: '/assets/bedside/ampoule.webp',
    assessmentHand: '/assets/bedside/assessment-hand.webp',
    clipboard: '/assets/bedside/bedside-clipboard.webp',
    cuff: '/assets/bedside/cuff.webp',
    ecgBody: '/assets/bedside/ecg-body.webp',
    electrode: '/assets/bedside/electrode.webp',
    sensor: '/assets/bedside/sensor.webp',
    stethoscope: '/assets/bedside/stethoscope.webp',
    syringeBody: '/assets/bedside/syringe-body.webp',
    syringePlunger: '/assets/bedside/syringe-plunger.webp',
  },

  /**
   * Room and environment backgrounds
   */
  environments: {
    bedsideRoom: '/assets/environments/bedside-room.webp',
    patientRoom: '/assets/environments/patient-room.webp',
  },

  /**
   * Patient sprites and bed layers across cases
   */
  patients: {
    patient01: '/assets/patients/patient-01.webp',
    patient02: '/assets/patients/patient-02.webp',
    patientCase02: '/assets/patients/patient-case-02.webp',
    patientCase02Bed: '/assets/patients/patient-case-02-bed.webp',
    patientCase02Pillow: '/assets/patients/patient-case-02-pillow.webp',
  },

  /**
   * Clinical Handover & Bedside Information (from 03_รับข้อมูลผู้ป่วย)
   */
  handover: {
    sceneOverview: '/assets/clinical-handover/handover-scene-full.webp',
    clipboardWithPen: '/assets/clinical-handover/patient-clipboard-pen.webp',
    monitorWithArm: '/assets/clinical-handover/patient-monitor-arm.webp',
    ehrRecordFolder: '/assets/clinical-handover/ehr-record-folder.webp',
    examMagnifier: '/assets/clinical-handover/hotspot-exam-magnifier.webp',
    crisisAlertScene: '/assets/clinical-handover/crisis-alert-scene.webp',
    bannerGold: '/assets/clinical-handover/ui-pill-banner-gold.webp',
    progressBarGold: '/assets/clinical-handover/ui-progressbar-gold.webp',
  },

  /**
   * ECG / EKG Minigame assets (from 04_EKG)
   */
  ecg: {
    minigameBoard: '/assets/ecg/ecg-minigame-board.webp',
    leadCables6: '/assets/ecg/ecg-leads-6cables.webp',
  },

  /**
   * UI illustrations, branding, and interactive button states
   */
  ui: {
    cover: '/assets/ui/cover.webp',
    login: '/assets/ui/login.webp',
    logo: '/assets/ui/logo.webp',
    startIdle: '/assets/ui/start-idle.webp',
    startHover: '/assets/ui/start-hover.webp',
    startPressed: '/assets/ui/start-pressed.webp',
    caseBoard: '/assets/ui/case-board.webp',
    caseButtonIdle: '/assets/ui/case-button-idle.webp',
    caseButtonHover: '/assets/ui/case-button-hover.webp',
    caseButtonPressed: '/assets/ui/case-button-pressed.webp',
    caseNextArrowIdle: '/assets/ui/case-next-arrow-idle.webp',
    caseNextArrowHover: '/assets/ui/case-next-arrow-hover.webp',
    caseNextArrowPressed: '/assets/ui/case-next-arrow-pressed.webp',
  },

  /**
   * Hospital equipment and stage props
   */
  props: {
    equipmentCart: '/assets/props/equipment-cart.webp',
    hospitalMonitor: '/assets/props/hospital-monitor.webp',
  },

  /**
   * Legacy prototype assets (reference only)
   */
  legacy: {
    room: '/assets/legacy/room.webp',
    patient: '/assets/legacy/patient.webp',
    patientCritical: '/assets/legacy/patient-critical.webp',
    patientCase02: '/assets/legacy/patient-case-02.png',
    stethoscope: '/assets/legacy/stethoscope.webp',
    bpCuff: '/assets/legacy/bp-cuff.webp',
    spo2: '/assets/legacy/spo2.webp',
    ecgChest: '/assets/legacy/ecg-chest.png',
    ecgLeads: '/assets/legacy/ecg-leads.webp',
  },
} as const;

export type AssetRegistry = typeof ASSETS;
