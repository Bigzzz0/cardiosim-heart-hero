import type { ECGTarget, Point } from '../types';
export class ECGSystem {
  placed = new Set<string>();
  placements: Record<string,string> = {};
  validated = new Set<string>();
  confirmed = false;
  selected: string | null = null;
  constructor(readonly targets: ECGTarget[]) {}
  place(id: string, point: Point) {
    if (!this.targets.some(item=>item.id===id) || this.confirmed || this.validated.has(id)) return null;
    const target = this.targets.find(item=>Math.hypot(point.x-item.x,point.y-item.y)<=item.snapRadius);
    if (!target || this.validated.has(target.id)) return false;
    const displaced = Object.keys(this.placements).find(lead=>this.placements[lead]===target.id && lead!==id);
    if (displaced) {delete this.placements[displaced];this.placed.delete(displaced);}
    this.placements[id]=target.id;this.placed.add(id);this.selected=null;
    return true;
  }
  remove(id:string) {if(this.confirmed||this.validated.has(id))return false;delete this.placements[id];this.placed.delete(id);return true;}
  confirm(gradable=true) {
    if(this.placed.size!==this.targets.length || this.confirmed)return null;
    const wrong:string[]=[];
    for(const lead of this.placed) {if(!gradable || this.placements[lead]===lead)this.validated.add(lead);else wrong.push(lead);}
    for(const id of wrong){delete this.placements[id];this.placed.delete(id);}
    this.confirmed=wrong.length===0;this.selected=null;
    return {valid:this.confirmed,wrong};
  }
  get complete() { return this.confirmed; }
}
