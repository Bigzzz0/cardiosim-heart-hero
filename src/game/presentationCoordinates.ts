import type {Point} from './types';
export interface Rect {x:number;y:number;width:number;height:number}
/** The sole affine mapping for both Phaser input and DOM patient overlays. */
export function worldToClient(point:Point,view:Rect,canvas:Rect):Point {
 return {x:canvas.x+(point.x-view.x)/view.width*canvas.width,y:canvas.y+(point.y-view.y)/view.height*canvas.height};
}
export function clientToWorld(point:Point,view:Rect,canvas:Rect):Point {
 return {x:view.x+(point.x-canvas.x)/canvas.width*view.width,y:view.y+(point.y-canvas.y)/canvas.height*view.height};
}
export const ROOM_UI_OCCLUDERS='.game-hud,.toolbar,.mission-panel,.monitor,.modal-backdrop,.pause-overlay';
