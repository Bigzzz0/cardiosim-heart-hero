/**
 * Centralized Asset Registry for CardioSim
 * 
 * Provides type-safe path references for all runtime images and media.
 * Keep paths aligned with public/assets/ directory structure.
 */

import suppliedECGArt from '../game/suppliedECGArt.json';

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
    caseSelectionBg: '/assets/environments/case-selection-bg.webp',
  },

  /**
   * Patient sprites and bed layers across cases
   */
  patients: {
    patientCharacter: '/assets/patients/patient-character.webp',
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
    examMagnifier: '/assets/clinical-handover/exam-magnifier.webp',
    progressTrack: '/assets/clinical-handover/progress-track.webp',
    progressFill: '/assets/clinical-handover/progress-fill.webp',
    actionToolbar: '/assets/clinical-handover/action-toolbar.webp',
    patientDialog: '/assets/clinical-handover/patient-dialog.webp',
    bedsideMonitor: '/assets/clinical-handover/bedside-monitor.webp',
    orderSheet: '/assets/clinical-handover/order-sheet.webp',
    clipboardWithPen: '/assets/clinical-handover/patient-clipboard-pen.webp',
    monitorWithArm: '/assets/clinical-handover/patient-monitor-arm.webp',
    ehrRecordFolder: '/assets/clinical-handover/ehr-record-folder.webp',
    crisisAlertScene: '/assets/clinical-handover/crisis-alert-scene.webp',
    bannerGold: '/assets/clinical-handover/ui-pill-banner-gold.webp',
    progressBarGold: '/assets/clinical-handover/ui-progressbar-gold.webp',
  },

  /**
   * ECG / EKG Minigame assets (from 04_EKG)
   */
  ecg: {
    playTorso: '/assets/ecg/play/torso-with-ribs.webp',
    chestLeads: suppliedECGArt.leads,
    minigameBoard: '/assets/ecg/ecg-minigame-board.webp',
    leadCables6: '/assets/ecg/ecg-leads-6cables.webp',
    torsoRibcage: '/assets/ecg/torso-ribcage.webp',
    chestLeadsOverlay: '/assets/ecg/chest-leads-overlay.webp',
    equipmentTray: '/assets/ecg/equipment-tray.webp',
    /** Individual Limb Clamps (คีมหนีบขั้วแขนขาแยกแต่ละสีสำหรับลากวาง) */
    clamps: {
      purple: '/assets/ecg/items/clamp-purple.webp',
      orange: '/assets/ecg/items/clamp-orange.webp',
      blue: '/assets/ecg/items/clamp-blue.webp',
      green: '/assets/ecg/items/clamp-green.webp',
      yellow: '/assets/ecg/items/clamp-yellow.webp',
      red: '/assets/ecg/items/clamp-red.webp',
    },
    /** Individual equipment items on the prep tray */
    tray: {
      cottonJar: '/assets/ecg/items/cotton-jar.webp',
      alcoholCleanser: '/assets/ecg/items/alcohol-cleanser.webp',
      electrodeGel: '/assets/ecg/items/electrode-gel.webp',
      firstAidBox: '/assets/ecg/items/first-aid-box.webp',
    },
  },

  /**
   * UI illustrations, branding, and interactive button states
   */
  ui: {
    cover: '/assets/ui/cover.webp',
    login: '/assets/ui/login.webp',
    logo: '/assets/ui/logo.webp',
    btnStart: '/assets/ui/btn-start.webp',
    btnAction1: '/assets/ui/btn-action-1.webp',
    btnAction2: '/assets/ui/btn-action-2.webp',
    btnAction3: '/assets/ui/btn-action-3.webp',
    startIdle: '/assets/ui/start-idle.webp',
    startHover: '/assets/ui/start-hover.webp',
    startPressed: '/assets/ui/start-pressed.webp',
    caseBoard: '/assets/ui/case-board.webp',
    caseCards: {
      card1: '/assets/ui/case-cards/case-card-1.webp',
      card2: '/assets/ui/case-cards/case-card-2.webp',
      card3: '/assets/ui/case-cards/case-card-3.webp',
      card4: '/assets/ui/case-cards/case-card-4.webp',
      card5: '/assets/ui/case-cards/case-card-5.webp',
      card6: '/assets/ui/case-cards/case-card-6.webp',
      badge1: '/assets/ui/case-cards/case-badge-1.webp',
      badge2: '/assets/ui/case-cards/case-badge-2.webp',
      badge3: '/assets/ui/case-cards/case-badge-3.webp',
      badge4: '/assets/ui/case-cards/case-badge-4.webp',
      badge5: '/assets/ui/case-cards/case-badge-5.webp',
      badge6: '/assets/ui/case-cards/case-badge-6.webp',
    },
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
    nurseCharacter: '/assets/props/nurse-character.webp',
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
