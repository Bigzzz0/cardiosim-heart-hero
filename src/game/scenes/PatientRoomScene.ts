import Phaser from 'phaser';
import type { AudioSystem } from '../systems/AudioSystem';
import type { CaseEngine } from '../core/CaseEngine';
import type { InteractionEventData, PatientState, Point } from '../types';

export class PatientRoomScene extends Phaser.Scene {
  private patient?: Phaser.GameObjects.Image;
  private criticalPatient?: Phaser.GameObjects.Image;
  private toolGhost?: Phaser.GameObjects.Image;
  private toolShadow?: Phaser.GameObjects.Ellipse;
  private toolGhostLabel?: Phaser.GameObjects.Text;
  private toolDragPoint: Point | null | undefined;
  private patientBaseScale = { x: 1, y: 1 };
  private patientAnimation: PatientState['animation'] = 'dyspnea';
  private patientResponseAt = Number.NEGATIVE_INFINITY;
  private graphics?: Phaser.GameObjects.Graphics;
  private label?: Phaser.GameObjects.Text;
  private hotspotLabels = new Map<string, Phaser.GameObjects.Text>();
  private lastKind = '';
  private lastMissionId = '';
  private cameraFrameSize = '';
  private cameraWorldView = { x: 0, y: 0, width: 1000, height: 720 };
  private cameraViewport = { width: 1000, height: 720 };
  private resizeObserver?: ResizeObserver;
  private resizeFrame = 0;
  private ecgBoard?: Phaser.GameObjects.Container;
  private leadLayer?: Phaser.GameObjects.Container;
  private leads = new Map<string, Phaser.GameObjects.Container>();
  private activeInteraction: InteractionEventData | null = null;
  private unsubscribeBus?: () => void;
  private reduceMotion = false;

  constructor(readonly engine: CaseEngine, readonly gameAudio: AudioSystem, readonly debug: boolean) { super('PatientRoomScene'); }

  preload() {
    const assets = this.engine.config.assets;
    this.load.image('room', assets.room);
    this.load.image('patient', assets.patient);
    this.load.image('patient-critical', assets.patientCritical);
    this.load.image('ecg-leads', assets.ecgLeads);
    this.load.image('ecg-chest', assets.ecgChest);
    for (const tool of this.engine.config.tools) if (tool.sprite) this.load.image(`tool-${tool.id}`, tool.sprite);
  }

  create() {
    const assets = this.engine.config.assets;
    // Extend the room beyond the logical play area so camera framing never
    // exposes empty canvas edges on wide or portrait displays.
    this.add.image(500, 360, 'room').setDisplaySize(1500, 1100);
    this.patient = this.add.image(550, 407, 'patient').setDisplaySize(292, 438);
    this.patientBaseScale = { x: this.patient.scaleX, y: this.patient.scaleY };
    this.criticalPatient = this.add.image(550, 407, 'patient-critical').setDisplaySize(292, 438).setAlpha(0);
    if (assets.patient === assets.patientCritical) this.criticalPatient.setTint(0xe4b5a8);
    this.graphics = this.add.graphics().setDepth(10);
    this.toolGhost = this.add.image(0, 0, 'ecg-leads').setDisplaySize(54, 54).setAlpha(.85).setDepth(30).setVisible(false);
    this.toolShadow = this.add.ellipse(0, 0, 38, 13, 0x0b2925, .24).setDepth(29).setVisible(false);
    this.toolGhostLabel = this.add.text(0, 0, '', { fontFamily: 'sans-serif', fontSize: '14px', fontStyle: 'bold', color: '#edfff2', backgroundColor: '#244b42', padding: { x: 10, y: 7 } }).setOrigin(.5).setDepth(30).setVisible(false);
    this.label = this.add.text(0, 0, '', { fontFamily: 'sans-serif', fontSize: '13px', color: '#254c42', backgroundColor: '#f1f8ec', padding: { x: 10, y: 6 } }).setDepth(20);
    for (const hotspot of this.engine.hotspots.definitions) {
      const name = this.add.text(hotspot.x + hotspot.radius + 10, hotspot.y, hotspot.label, {
        fontFamily: 'sans-serif', fontSize: '12px', fontStyle: 'bold', color: '#effaf2',
        backgroundColor: '#14352ff0', padding: { x: 9, y: 7 }, stroke: '#8fd9b766', strokeThickness: 1,
      }).setOrigin(0, .5).setDepth(14).setVisible(false);
      this.hotspotLabels.set(hotspot.id, name);
    }
    this.unsubscribeBus = this.engine.bus.subscribe(event => {
      this.showInteractionFeedback(event.interaction);
      if (event.type === 'MISSION_CHANGED') this.syncMissionView();
    });
    const motionPreference = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    this.reduceMotion = motionPreference?.matches ?? false;
    const onMotionPreferenceChange = () => { this.reduceMotion = motionPreference?.matches ?? false; };
    motionPreference?.addEventListener?.('change', onMotionPreferenceChange);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.unsubscribeBus?.(); this.unsubscribeBus = undefined;
      motionPreference?.removeEventListener?.('change', onMotionPreferenceChange);
    });
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.engine.mission.current.kind === 'interaction') this.engine.useAt(this.gamePointToWorld(pointer.x, pointer.y));
    });
    this.input.on('pointerup', (pointer: Phaser.Input.Pointer, over: Phaser.GameObjects.GameObject[]) => {
      if (this.engine.mission.current.kind === 'placement' && pointer.getDistance() < 12 && over.length === 0 && this.engine.ecg.selected) this.place(this.engine.ecg.selected, this.gamePointToWorld(pointer.x, pointer.y));
    });
    this.input.on('drag', (_pointer: Phaser.Input.Pointer, object: Phaser.GameObjects.Container, x: number, y: number) => {
      if (!this.engine.paused) object.setPosition(x, y).setDepth(15);
    });
    this.input.on('dragend', (pointer: Phaser.Input.Pointer, object: Phaser.GameObjects.Container) => {
      this.place(object.name, this.gamePointToWorld(pointer.x, pointer.y));
    });
    this.scale.on(Phaser.Scale.Events.RESIZE, (gameSize: Phaser.Structs.Size) => this.applyCameraFrame(gameSize.width, gameSize.height));
    const host = this.game.canvas.parentElement;
    if (host && typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.queueResize());
      this.resizeObserver.observe(host);
    }
    window.addEventListener('resize', this.queueResize);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.resizeObserver?.disconnect();
      this.resizeObserver = undefined;
      window.removeEventListener('resize', this.queueResize);
      if (this.resizeFrame) cancelAnimationFrame(this.resizeFrame);
    });
    this.queueResize();
    this.applyCameraFrame();
  }

  /** Convert browser client coordinates into the active Phaser camera's world. */
  clientToWorld(clientX: number, clientY: number): Point | null {
    const bounds = this.game.canvas.getBoundingClientRect();
    if (clientX < bounds.left || clientY < bounds.top || clientX > bounds.right || clientY > bounds.bottom) return null;
    const screenX = (clientX - bounds.left) * this.cameraViewport.width / bounds.width;
    const screenY = (clientY - bounds.top) * this.cameraViewport.height / bounds.height;
    return this.gamePointToWorld(screenX, screenY);
  }

  /** Kept as a call-site alias while React's drag handlers use the shared mapping. */
  screenPoint(clientX: number, clientY: number): Point | null { return this.clientToWorld(clientX, clientY); }

  /** Convert world points through the same camera view used by pointer input. */
  worldToClient(point: Point): Point {
    const bounds = this.game.canvas.getBoundingClientRect();
    const view = this.cameraWorldView;
    return {
      x: bounds.left + ((point.x - view.x) / view.width) * bounds.width,
      y: bounds.top + ((point.y - view.y) / view.height) * bounds.height,
    };
  }

  private readonly queueResize = () => {
    if (this.resizeFrame) cancelAnimationFrame(this.resizeFrame);
    this.resizeFrame = requestAnimationFrame(() => {
      this.resizeFrame = requestAnimationFrame(() => {
        this.resizeFrame = 0;
        const canvas = this.game.canvas;
        const host = canvas.parentElement;
        const bounds = host?.getBoundingClientRect();
        if (!bounds || bounds.width < 1 || bounds.height < 1) return;
        // RESIZE mode owns the canvas backing store. Wait for Phaser's scale
        // manager to update it, then frame the camera from those exact pixels.
        const width = Math.max(1, canvas.width);
        const height = Math.max(1, canvas.height);
        this.applyCameraFrame(width, height);
      });
    });
  };

  private gamePointToWorld(x: number, y: number): Point {
    const view = this.cameraWorldView;
    return { x: view.x + x / Math.max(1, this.cameraViewport.width) * view.width, y: view.y + y / Math.max(1, this.cameraViewport.height) * view.height };
  }

  private applyCameraFrame(width = this.scale.width, height = this.scale.height) {
    if (!this.sys.isActive()) return;
    width = Math.max(1, width);
    height = Math.max(1, height);
    const kind = this.engine.mission.current.kind;
    const portrait = width <= 760;
    // Portrait uses a vertical bedside close-up; desktop keeps the patient,
    // monitor and procedure board inside one camera frame.
    const zoom = portrait
      ? height / 720
      : Math.min(width / 1000, height / 720);
    const centerX = kind === 'placement' ? 575 : 550;
    const centerY = kind === 'transition' ? 380 : 360;
    const appliedZoom = Phaser.Math.Clamp(zoom, .55, 1.35);
    this.cameras.main.setViewport(0, 0, width, height).setZoom(appliedZoom).centerOn(centerX, centerY);
    this.cameraFrameSize = `${width}x${height}`;
    this.cameraViewport = { width, height };
    this.cameraWorldView = { x: centerX - width / appliedZoom / 2, y: centerY - height / appliedZoom / 2, width: width / appliedZoom, height: height / appliedZoom };
    const stage = this.game.canvas.parentElement?.parentElement;
    stage?.setAttribute('data-world-view', JSON.stringify(this.cameraWorldView));
  }

  private positionCanvasLabel(x: number, y: number) {
    const label = this.label;
    if (!label) return;
    const view = this.cameraWorldView;
    const padding = 10;
    const maxX = Math.max(view.x + padding, view.x + view.width - label.width - padding);
    const maxY = Math.max(view.y + padding, view.y + view.height - label.height - padding);
    label.setPosition(Phaser.Math.Clamp(x, view.x + padding, maxX), Phaser.Math.Clamp(y, view.y + padding, maxY));
  }

  setToolDragPoint(point: Point | null | undefined) { this.toolDragPoint = point; }

  private showInteractionFeedback(interaction?: InteractionEventData) {
    if (!interaction) return;
    if (interaction.phase === 'started') {
      this.activeInteraction = interaction;
      return;
    }
    this.activeInteraction = null;
    if (!interaction.point) return;
    const success = interaction.phase === 'completed';
    if (success) this.patientResponseAt = this.time.now;
    const point = interaction.point;
    const color = success ? 0x65dfaa : 0xf17d70;
    const ring = this.add.circle(point.x, point.y, 18, color, .18).setStrokeStyle(4, color, .95).setDepth(28);
    if (this.reduceMotion) ring.destroy();
    else this.tweens.add({ targets: ring, scale: success ? 2.8 : 2.2, alpha: 0, duration: success ? 620 : 430, ease: 'Sine.Out', onComplete: () => ring.destroy() });
    const marker = this.add.circle(point.x, point.y - 37, 15, success ? 0x1b674b : 0x8b4038, .98)
      .setStrokeStyle(2, success ? 0xb8f1cc : 0xffc1ae, .95).setDepth(31);
    const feedback = this.add.text(point.x, point.y - 37, success ? '✓' : '↺', {
      fontFamily: 'sans-serif', fontSize: '18px', fontStyle: 'bold',
      color: success ? '#effff3' : '#fff3ed',
    }).setOrigin(.5).setDepth(32);
    if (this.reduceMotion) this.time.delayedCall(900, () => { marker.destroy(); feedback.destroy(); });
    else this.tweens.add({ targets: [marker, feedback], y: point.y - 65, alpha: 0, duration: 1050, delay: 90, ease: 'Cubic.Out', onComplete: () => { marker.destroy(); feedback.destroy(); } });
    if (success && !this.reduceMotion) {
      for (let index = 0; index < 5; index++) {
        const angle = (Math.PI * 2 * index) / 5;
        const spark = this.add.circle(point.x, point.y, 3 + (index % 2), 0xc3f2bd, .95).setDepth(29);
        this.tweens.add({
          targets: spark,
          x: point.x + Math.cos(angle) * 27,
          y: point.y + Math.sin(angle) * 24,
          alpha: 0,
          scale: .25,
          duration: 440,
          ease: 'Cubic.Out',
          onComplete: () => spark.destroy(),
        });
      }
    }
  }

  playEmergencyImpact() {
    if (this.reduceMotion) return;
    this.cameras.main.shake(420, 0.0025);
  }

  private place(id: string, point: Point) {
    const target = this.engine.ecg.targets.find(item => item.id === id);
    const object = this.leads.get(id);
    if (!target || !object) return;
    const valid = this.engine.placeLead(id, point);
    const index = this.engine.ecg.targets.indexOf(target);
    const tray = this.engine.config.ecg.layout.tray;
    this.tweens.add({ targets: object, x: valid ? target.x : tray.x + index * tray.spacing, y: valid ? target.y : tray.y, duration: valid ? 150 : 300, ease: 'Back.Out' });
    if (valid) { object.disableInteractive(); object.setAlpha(.85); }
  }

  private makeECGBoard() {
    const objects: Phaser.GameObjects.GameObject[] = [];
    const { board: boardLayout, image: imageLayout } = this.engine.config.ecg.layout;
    const casing = this.add.graphics();
    casing.fillStyle(0x0c1b20, .5).fillRoundedRect(boardLayout.x + 7, boardLayout.y + 11, boardLayout.width, boardLayout.height, 19);
    casing.fillStyle(0x1b3038, .99).fillRoundedRect(boardLayout.x, boardLayout.y, boardLayout.width, boardLayout.height, 18);
    casing.lineStyle(3, 0x66877a, .98).strokeRoundedRect(boardLayout.x, boardLayout.y, boardLayout.width, boardLayout.height, 18);
    casing.fillStyle(0x29464a, .99).fillRoundedRect(boardLayout.x + 7, boardLayout.y + 7, boardLayout.width - 14, 37, 11);
    casing.fillStyle(0xe8f0e6, .99).fillRoundedRect(boardLayout.x + 10, boardLayout.y + 47, boardLayout.width - 20, boardLayout.height - 58, 12);
    casing.lineStyle(1, 0xa2bcae, .95).strokeRoundedRect(boardLayout.x + 10, boardLayout.y + 47, boardLayout.width - 20, boardLayout.height - 58, 12);
    objects.push(casing);
    for (const [x, y] of [[boardLayout.x + 19, boardLayout.y + 18], [boardLayout.x + boardLayout.width - 19, boardLayout.y + 18], [boardLayout.x + 19, boardLayout.y + boardLayout.height - 18], [boardLayout.x + boardLayout.width - 19, boardLayout.y + boardLayout.height - 18]]) {
      objects.push(this.add.circle(x, y, 3, 0x9bb8a7, .9).setStrokeStyle(1, 0xd8ebdc, .55));
    }
    objects.push(this.add.image(imageLayout.x + imageLayout.width / 2, imageLayout.y + imageLayout.height / 2, 'ecg-chest').setDisplaySize(imageLayout.width, imageLayout.height));
    const leadRail = this.add.graphics();
    leadRail.fillStyle(0xd4e0d7, .96).fillRoundedRect(boardLayout.x + 100, boardLayout.y + boardLayout.height - 55, boardLayout.width - 120, 40, 10);
    leadRail.lineStyle(1, 0x9bb4a4, .95).strokeRoundedRect(boardLayout.x + 100, boardLayout.y + boardLayout.height - 55, boardLayout.width - 120, 40, 10);
    objects.push(leadRail);
    objects.push(this.add.text(boardLayout.x + 29, boardLayout.y + 12, 'ECG LEAD STATION', {fontFamily:'sans-serif',fontSize:'14px',fontStyle:'bold',color:'#ecf8ee'}));
    objects.push(this.add.text(boardLayout.x + 280, boardLayout.y + 15, 'PRACTICE MAP · NOT CLINICAL', {fontFamily:'sans-serif',fontSize:'10px',fontStyle:'bold',color:'#b7d7c3'}));
    objects.push(this.add.circle(boardLayout.x + boardLayout.width - 20, boardLayout.y + 22, 4, 0x8be3ac).setStrokeStyle(1, 0xd6ffdf, .9));
    objects.push(this.add.text(imageLayout.x - 24, imageLayout.y + 46, 'R', {fontSize:'15px',color:'#7b8c75'}));
    objects.push(this.add.text(imageLayout.x + imageLayout.width + 8, imageLayout.y + 46, 'L', {fontSize:'15px',color:'#7b8c75'}));
    objects.push(this.add.text(boardLayout.x + 24, boardLayout.y + boardLayout.height - 68, 'LEAD TRAY', {fontFamily:'sans-serif',fontSize:'10px',fontStyle:'bold',color:'#60796c'}));
    objects.push(this.add.image(boardLayout.x + 66, boardLayout.y + boardLayout.height - 27, 'ecg-leads').setDisplaySize(50, 46));
    this.ecgBoard = this.add.container(0, 0, objects).setDepth(4);
    this.leadLayer = this.add.container(0, 0).setDepth(12);
    this.engine.ecg.targets.forEach((target, index) => {
      const placed = this.engine.ecg.placed.has(target.id);
      const tray = this.engine.config.ecg.layout.tray;
      const disc = this.add.circle(0, 0, 20, 0x244b42).setStrokeStyle(3, 0xa7ddc1);
      const label = this.add.text(0, 0, target.label, {fontFamily:'sans-serif',fontSize:'14px',fontStyle:'bold',color:'#edfff2'}).setOrigin(.5);
      const lead = this.add.container(placed ? target.x : tray.x + index * tray.spacing, placed ? target.y : tray.y, [disc, label]);
      lead.setName(target.id).setSize(44,44);
      if (!placed) {
        lead.setInteractive({ useHandCursor: true }); this.input.setDraggable(lead);
        lead.on('pointerdown', () => { if (!this.engine.paused) { this.engine.ecg.selected = target.id; this.engine.refresh(); } });
      }
      this.leads.set(target.id, lead); this.leadLayer?.add(lead);
    });
  }

  private clearECGBoard() {
    this.ecgBoard?.destroy(true);
    this.leadLayer?.destroy(true);
    this.ecgBoard = undefined;
    this.leadLayer = undefined;
    this.leads.clear();
  }

  /** Keep Phaser's camera and ECG hit targets in step with React mission UI. */
  private syncMissionView() {
    const kind = this.engine.mission.current.kind;
    const missionId = this.engine.mission.current.id;
    if (this.lastKind !== kind) {
      this.clearECGBoard();
      if (kind === 'placement' && window.innerWidth > 760) this.makeECGBoard();
      this.lastKind = kind;
    }
    if (this.lastMissionId !== missionId) {
      this.applyCameraFrame();
      this.lastMissionId = missionId;
    }
    if (kind === 'placement' && window.innerWidth > 760 && !this.ecgBoard) this.makeECGBoard();
    if (kind === 'placement' && window.innerWidth <= 760 && this.ecgBoard) this.clearECGBoard();
  }

  update(time: number, delta: number) {
    this.engine.update(delta);
    this.gameAudio.update(delta, this.engine.vitals.current.hr, this.engine.emergency.alarm);
    const kind = this.engine.mission.current.kind;
    const frameSize = `${this.game.canvas.width}x${this.game.canvas.height}`;
    if (this.cameraFrameSize !== frameSize) this.applyCameraFrame(this.game.canvas.width, this.game.canvas.height);
    this.syncMissionView();
    const patient = this.engine.patient.state;
    if (patient.animation !== this.patientAnimation) {
      this.patientAnimation = patient.animation;
      const inDistress = patient.animation === 'critical';
      const normalPatient = this.patient;
      const criticalPatient = this.criticalPatient;
      if (normalPatient && criticalPatient) {
        this.tweens.killTweensOf(normalPatient); this.tweens.killTweensOf(criticalPatient);
        if (this.reduceMotion) { normalPatient.setAlpha(inDistress ? 0 : 1); criticalPatient.setAlpha(inDistress ? 1 : 0); }
        else {
          this.tweens.add({ targets: normalPatient, alpha: inDistress ? 0 : 1, duration: 420, ease: 'Sine.InOut' });
          this.tweens.add({ targets: criticalPatient, alpha: inDistress ? 1 : 0, duration: 420, ease: 'Sine.InOut' });
        }
      }
    }
    const severity = patient.breathing === 'severe' ? 2.4 : patient.breathing === 'labored' ? 1.4 : .5;
    const rr = this.engine.vitals.current.rr;
    const breathPhase = rr === null ? time / 1250 : time * rr / 9550;
    const breathing = this.engine.paused || this.reduceMotion ? 0 : Math.sin(breathPhase);
    const responsePulse = this.engine.paused || this.reduceMotion ? 0 : Math.max(0, 1 - (time - this.patientResponseAt) / 360);
    this.patient?.setScale(this.patientBaseScale.x * (1 + breathing * .002 * severity), this.patientBaseScale.y * (1 + breathing * .006 * severity + responsePulse * .003));
    this.criticalPatient?.setScale(this.patientBaseScale.x * (1 + breathing * .002 * severity), this.patientBaseScale.y * (1 + breathing * .006 * severity + responsePulse * .003));
    this.patient?.setX(550 + (patient.animation === 'critical' && !this.engine.paused && !this.reduceMotion ? Math.sin(time / 110) * 1.2 : 0));
    this.criticalPatient?.setX(550 + (patient.animation === 'critical' && !this.engine.paused && !this.reduceMotion ? Math.sin(time / 110) * 1.2 : 0));
    const graphics = this.graphics; if (!graphics) return; graphics.clear();
    if (this.engine.emergency.alarm) graphics.lineStyle(7,0xca715f,.2 + (Math.sin(time / 650) + 1) * .08).strokeRect(3,3,994,714);
    this.label?.setVisible(false);
    const pointer = this.input.activePointer;
    const pending = this.engine.interaction.pending;
    const actionToolId = pending ? this.activeInteraction?.toolId : this.engine.tools.selected;
    const activeTool = actionToolId ? this.engine.tools.get(actionToolId) : undefined;
    const texture = activeTool?.sprite ? `tool-${activeTool.id}` : '';
    const dragPoint = this.toolDragPoint === undefined ? this.gamePointToWorld(pointer.x, pointer.y) : this.toolDragPoint;
    const pendingTarget = pending && this.activeInteraction?.targetId ? this.engine.hotspots.definitions.find(item => item.id === this.activeInteraction?.targetId) : undefined;
    const toolPoint = pendingTarget ? { x: pendingTarget.x, y: pendingTarget.y } : dragPoint;
    const showTool = kind === 'interaction' && Boolean(toolPoint) && (this.engine.tools.dragging || Boolean(pending));
    const canShowSprite = showTool && Boolean(texture) && this.textures.exists(texture);
    this.toolShadow?.setVisible(showTool).setPosition((toolPoint?.x ?? 0) + 8, (toolPoint?.y ?? 0) + 27);
    if (canShowSprite && toolPoint) {
      const visual = activeTool?.visual;
      const size = pending ? visual?.contactSize : visual?.heldSize;
      const offset = pending ? visual?.contactOffset : visual?.heldOffset;
      const lift = pending ? 0 : 5;
      this.toolGhost?.setTexture(texture)
        .setDisplaySize(size?.x ?? 72, size?.y ?? 72)
        .setAlpha(pending ? 1 : .94)
        .setPosition(toolPoint.x + (offset?.x ?? 11), toolPoint.y + (offset?.y ?? -17) - lift)
        .setAngle(pending ? visual?.contactAngle ?? 0 : this.engine.tools.dragging ? Phaser.Math.Clamp(pointer.velocity.x / 18, -9, 9) : 0)
        .setVisible(true);
      this.toolGhostLabel?.setVisible(false);
    } else {
      this.toolGhost?.setVisible(false);
      if (showTool && activeTool && toolPoint) this.toolGhostLabel?.setText(activeTool.name).setPosition(toolPoint.x + 25, toolPoint.y - 18).setVisible(true);
      else this.toolGhostLabel?.setVisible(false);
    }
    if (kind === 'interaction') {
      const pointerPreview = this.engine.tools.dragging && dragPoint ? this.engine.previewAt(dragPoint) : null;
      const nextObjective = this.engine.mission.current.objectives?.find(objective => !this.engine.mission.completed.has(objective.id));
      const firstInteraction = this.engine.config.missions.find(mission => mission.kind === 'interaction' && mission.objectives?.length);
      const onboardingObjective = firstInteraction?.objectives?.[0];
      const onboardingActive = firstInteraction?.id === this.engine.mission.current.id
        && Boolean(onboardingObjective && !this.engine.mission.completed.has(onboardingObjective.id));
      for (const hotspot of this.engine.hotspots.definitions) {
        const pending = this.engine.interaction.pending?.objective.target === hotspot.id;
        const isNextTarget = nextObjective?.target === hotspot.id;
        const candidate = this.engine.previewAt({ x: hotspot.x, y: hotspot.y });
        const validDrop = (this.engine.tools.dragging || Boolean(this.engine.tools.selected)) && candidate.outcome === 'valid';
        const hinted = this.engine.hints.visible && Boolean(this.engine.tools.selected) && candidate.outcome === 'valid';
        const hovered = Boolean(this.engine.tools.dragging && pointerPreview?.targetId === hotspot.id);
        const name = this.hotspotLabels.get(hotspot.id);
        const focused = this.engine.tools.dragging || Boolean(this.engine.tools.selected) || this.engine.hints.visible || (onboardingActive && onboardingObjective?.target === hotspot.id);
        const showFocus = this.debug || validDrop || pending || hinted || hovered || (isNextTarget && focused);
        const showName = this.debug || validDrop || pending || hinted || hovered || (isNextTarget && focused);
        if (name) {
          name.setText(isNextTarget && !pending && focused ? `NEXT · ${hotspot.label}` : hotspot.label);
          const view = this.cameraWorldView;
          const padding = 10;
          const preferredX = hotspot.x + hotspot.radius + 10 + name.width <= view.x + view.width - padding
            ? hotspot.x + hotspot.radius + 10
            : hotspot.x - hotspot.radius - 10 - name.width;
          const minX = view.x + padding;
          const maxX = Math.max(minX, view.x + view.width - name.width - padding);
          const minY = view.y + name.height / 2 + padding;
          const maxY = Math.max(minY, view.y + view.height - name.height / 2 - padding);
          name.setPosition(Phaser.Math.Clamp(preferredX, minX, maxX), Phaser.Math.Clamp(hotspot.y, minY, maxY));
          name.setVisible(showName).setAlpha(pending ? .55 : hovered ? 1 : .92);
        }
        if (showFocus || (isNextTarget && !focused)) {
          const passiveNext = isNextTarget && !focused && !pending;
          const color = pending || validDrop || (isNextTarget && !hovered) ? 0x78e6ac : hovered && pointerPreview?.outcome !== 'valid' ? 0xf07c70 : 0x9ad9ba;
          if (passiveNext) {
            const pulse = this.reduceMotion ? 0 : Math.sin(time / 420) * 1.5;
            graphics.fillStyle(color, .85).fillCircle(hotspot.x, hotspot.y, 5 + pulse);
            graphics.lineStyle(1, color, .45).strokeCircle(hotspot.x, hotspot.y, 11 + pulse);
          } else {
            const pulse = this.reduceMotion ? 0 : Math.sin(time / 125) * 4;
            const radius = hotspot.radius + pulse;
            graphics.lineStyle(pending || validDrop || hovered ? 3 : 2, color, .95).strokeCircle(hotspot.x,hotspot.y,radius);
            if (pending || validDrop || hovered || hinted) graphics.fillStyle(color, validDrop ? .12 : .18).fillCircle(hotspot.x,hotspot.y,radius);
          }
        }
      }
      if (this.engine.tools.dragging && dragPoint && dragPoint.x >= 0 && dragPoint.x < 1000 && dragPoint.y >= 0 && dragPoint.y < 720) {
        graphics.lineStyle(2,0x285e4a,.7).strokeCircle(dragPoint.x,dragPoint.y,12);
        const hovered = this.engine.hotspots.at(dragPoint);
        if (hovered) {
          const preview = this.engine.previewAt(dragPoint);
          const text = preview.outcome === 'valid' ? hovered.label : preview.reason ?? 'จุดนี้ใช้ไม่ได้';
          this.label?.setStyle({ backgroundColor: preview.outcome === 'valid' ? '#f1f8ec' : '#fff0eb', color: preview.outcome === 'valid' ? '#254c42' : '#8b3934' }).setText(text);
          this.positionCanvasLabel(dragPoint.x + 20, dragPoint.y - 34);
          this.label?.setVisible(true);
        }
      }
      const currentPending = this.engine.interaction.pending;
      if (currentPending) {
        const target = this.engine.hotspots.definitions.find(item => item.id === currentPending.objective.target);
        if (target) {
          const progress = currentPending.total > 0 ? Phaser.Math.Clamp(1 - currentPending.remaining / currentPending.total, 0, 1) : 1;
          graphics.lineStyle(5, 0x244b42, .22).strokeCircle(target.x, target.y, target.radius + 9);
          graphics.beginPath(); graphics.lineStyle(5, 0x42ad7e, .95).arc(target.x, target.y, target.radius + 9, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2).strokePath();
          this.label?.setStyle({ backgroundColor: '#e5f6e9', color: '#245c46' }).setText(`กำลังตรวจ ${Math.round(progress * 100)}%`);
          this.positionCanvasLabel(target.x + 27, target.y - target.radius - 34);
          this.label?.setVisible(true);
        }
      }
    }
    if (kind === 'placement' && window.innerWidth > 760) for (const target of this.engine.ecg.targets) {
      const emphasized = this.engine.hints.visible || this.debug || this.engine.ecg.placed.has(target.id);
      graphics.lineStyle(emphasized ? 2 : 1, emphasized ? 0x347b62 : 0x648a78, emphasized ? .9 : .55).strokeCircle(target.x,target.y,target.snapRadius);
      graphics.lineStyle(1,emphasized ? 0x347b62 : 0x648a78,emphasized ? .8 : .45).lineBetween(target.x-6,target.y,target.x+6,target.y).lineBetween(target.x,target.y-6,target.x,target.y+6);
      this.leads.get(target.id)?.setScale(this.engine.ecg.selected === target.id ? 1.15 : 1);
    }
    this.game.canvas.style.cursor = this.engine.tools.dragging ? 'grabbing' : 'default';
  }
}
