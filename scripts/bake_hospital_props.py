"""Offline GLB -> RGBA sprite bake for the supplied Atomic Realm pack.
No 3D runtime is shipped. Original model/texture stays outside the repository.
Usage: python scripts/bake_hospital_props.py <pack.zip>
"""
from pathlib import Path
from zipfile import ZipFile
from io import BytesIO
import json,struct,sys
import numpy as np
from PIL import Image

def glb(raw):
    length,_=struct.unpack_from('<II',raw,12); data=json.loads(raw[20:20+length]); at=20+length
    size,_=struct.unpack_from('<II',raw,at); binary=raw[at+8:at+8+size]
    def accessor(index):
        a=data['accessors'][index];v=data['bufferViews'][a['bufferView']]
        dtype={5126:'<f4',5123:'<u2',5125:'<u4',5121:'u1'}[a['componentType']]
        width={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4}[a['type']]
        offset=v.get('byteOffset',0)+a.get('byteOffset',0);item=np.dtype(dtype).itemsize
        return np.ndarray((a['count'],width),dtype=dtype,buffer=binary,offset=offset,strides=(v.get('byteStride',item*width),item)).copy()
    image=data['images'][0];view=data['bufferViews'][image['bufferView']];offset=view.get('byteOffset',0)
    texture=np.array(Image.open(BytesIO(binary[offset:offset+view['byteLength']])).convert('RGB'))
    return data,accessor,texture

def bake(raw,path,eye):
    data,get,tex=glb(raw);primitives=data['meshes'][0]['primitives']
    vertices=np.concatenate([get(p['attributes']['POSITION']) for p in primitives])
    forward=np.array(eye,dtype=float);forward/=np.linalg.norm(forward)
    right=np.cross([0,1,0],forward);right/=np.linalg.norm(right);up=np.cross(forward,right)
    basis=np.array([right,up,forward]).T
    points=vertices@basis;low=points[:,:2].min(axis=0);high=points[:,:2].max(axis=0)
    scale=462/max(high-low);center=(high+low)/2
    rgba=np.zeros((512,512,4),dtype=np.uint8);depth=np.full((512,512),-np.inf)
    light=np.array([-.35,.8,.6]);light/=np.linalg.norm(light)
    for p in primitives:
        v=get(p['attributes']['POSITION']);n=get(p['attributes']['NORMAL']);uv=get(p['attributes']['TEXCOORD_0']);idx=get(p['indices']).reshape(-1,3)
        pts=v@basis;pts[:,:2]=(pts[:,:2]-center)*scale+256;pts[:,1]=512-pts[:,1]
        for ids in idx:
            tri=pts[ids];x0,y0=np.floor(tri[:,:2].min(axis=0)).astype(int);x1,y1=np.ceil(tri[:,:2].max(axis=0)).astype(int)
            x0=max(0,x0);y0=max(0,y0);x1=min(511,x1);y1=min(511,y1)
            if x1<x0 or y1<y0:continue
            x,y=np.meshgrid(np.arange(x0,x1+1)+.5,np.arange(y0,y1+1)+.5)
            a,b,c=tri;den=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1])
            if abs(den)<1e-8:continue
            w0=((b[1]-c[1])*(x-c[0])+(c[0]-b[0])*(y-c[1]))/den
            w1=((c[1]-a[1])*(x-c[0])+(a[0]-c[0])*(y-c[1]))/den;w2=1-w0-w1
            z=w0*a[2]+w1*b[2]+w2*c[2];sub=depth[y0:y1+1,x0:x1+1]
            keep=(w0>=-1e-5)&(w1>=-1e-5)&(w2>=-1e-5)&(z>sub)
            if not keep.any():continue
            t=w0[...,None]*uv[ids[0]]+w1[...,None]*uv[ids[1]]+w2[...,None]*uv[ids[2]]
            tx=np.clip((t[...,0]*(tex.shape[1]-1)).astype(int),0,tex.shape[1]-1);ty=np.clip((t[...,1]*(tex.shape[0]-1)).astype(int),0,tex.shape[0]-1)
            normal=n[ids].mean(axis=0);normal/=max(np.linalg.norm(normal),1e-6)
            brightness=.67+.36*max(0,float(normal@light));rgb=np.clip(tex[ty,tx]*brightness,0,255).astype(np.uint8)
            sub[keep]=z[keep];tile=rgba[y0:y1+1,x0:x1+1];tile[keep,:3]=rgb[keep];tile[keep,3]=255
    image=Image.fromarray(rgba);path.parent.mkdir(parents=True,exist_ok=True);image.save(path,quality=93,method=6)

if __name__=='__main__':
    archive=Path(sys.argv[1]);out=Path('public/game/supplied')
    with ZipFile(archive) as z:
        for source,target in [('machine_2','hospital-monitor'),('tray_1','equipment-cart')]:
            bake(z.read('3. Models/gltf/'+source+'.glb'),out/(target+'.webp'),(3,2,5))
    print(out.resolve())
