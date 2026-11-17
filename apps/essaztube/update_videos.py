#!/usr/bin/env python3
"""Refresh approved YouTube RSS feeds and best-effort duration metadata, no API key."""
import json, re, time, html as htmlmod, urllib.request, urllib.parse, xml.etree.ElementTree as ET
from pathlib import Path
from datetime import datetime, timezone
ROOT=Path(__file__).resolve().parent
OUT=ROOT/'videos.json'
HANDLES=['raisingfloofz','Vicky_and_her_Essas','Wobbles_Essa','OliPaws_ESSA','CuddlyHowlers']
HEADERS={'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/131.0 Safari/537.36','Accept-Language':'en-US,en;q=0.9'}
def fetch(url):
    with urllib.request.urlopen(urllib.request.Request(url,headers=HEADERS),timeout=22) as r:return r.read().decode('utf-8','replace')
def existing():
    try:return json.loads(OUT.read_text())
    except Exception:return {'channels':[],'videos':[]}
def duration_for(vid):
    """YouTube watch-page metadata is best-effort and may be blocked/changed."""
    try:
        page=fetch('https://www.youtube.com/watch?v='+vid)
        for pattern in [r'"lengthSeconds"\s*:\s*"(\d+)"',r'"lengthSeconds"\s*:\s*(\d+)',r'"approxDurationMs"\s*:\s*"(\d+)"']:
            m=re.search(pattern,page)
            if m:
                value=int(m.group(1))
                return round(value/1000) if 'Ms' in pattern else value
        m=re.search(r'<meta[^>]+itemprop="duration"[^>]+content="PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?"',page)
        if m:return int(m.group(1) or 0)*3600+int(m.group(2) or 0)*60+int(m.group(3) or 0)
    except Exception as e:print('Duration unavailable',vid,str(e))
    return None
def main():
    old=existing(); oldch={str(c.get('handle','')).lower():c for c in old.get('channels',[])}
    valid={h.lower() for h in HANDLES}
    allvideos={v['id']:v for v in old.get('videos',[]) if v.get('id') and str(v.get('handle','')).lower() in valid}
    channels=[]
    for handle in HANDLES:
        prior=oldch.get(handle.lower(),{})
        channel={'handle':handle,'id':prior.get('id',''),'name':prior.get('name',handle),'avatar':prior.get('avatar',''),'featured':True}
        try:
            page=fetch('https://www.youtube.com/@'+urllib.parse.quote(handle,safe='_-'))
            m=re.search(r'"(?:channelId|externalId)":"(UC[a-zA-Z0-9_-]{22})"',page) or re.search(r'https://www.youtube.com/channel/(UC[a-zA-Z0-9_-]{22})',page)
            if m:channel['id']=m.group(1)
            m=re.search(r'<meta\s+property="og:title"\s+content="([^"]+)',page)
            if m:channel['name']=htmlmod.unescape(m.group(1))
            m=re.search(r'<meta\s+property="og:image"\s+content="([^"]+)',page)
            if m:channel['avatar']=htmlmod.unescape(m.group(1))
        except Exception as e:print('Channel lookup issue',handle,str(e))
        channels.append(channel)
        if not channel['id']:
            print('UNRESOLVED',handle);continue
        try:
            root=ET.fromstring(fetch('https://www.youtube.com/feeds/videos.xml?channel_id='+channel['id']))
            ns={'a':'http://www.w3.org/2005/Atom','yt':'http://www.youtube.com/xml/schemas/2015','media':'http://search.yahoo.com/mrss/'}
            for entry in root.findall('a:entry',ns):
                vid=entry.findtext('yt:videoId',default='',namespaces=ns)
                if not re.fullmatch(r'[\w-]{11}',vid):continue
                oldvideo=allvideos.get(vid,{})
                allvideos[vid]={**oldvideo,'id':vid,'channelId':channel['id'],'handle':handle,'title':entry.findtext('a:title',default='Video',namespaces=ns),'published':entry.findtext('a:published',default='',namespaces=ns),'description':entry.findtext('media:group/media:description',default='',namespaces=ns)[:500],'thumbnail':'https://i.ytimg.com/vi/'+vid+'/hqdefault.jpg'}
            print('Updated',handle)
        except Exception as e:print('Feed issue',handle,str(e))
        time.sleep(.35)
    videos=sorted(allvideos.values(),key=lambda v:v.get('published',''),reverse=True)[:500]
    # Bound metadata requests per run to avoid long scheduled jobs. Unknowns remain visible.
    missing=[v for v in videos if not isinstance(v.get('durationSeconds'),int)]
    for v in missing[:35]:
        duration=duration_for(v['id'])
        if duration is not None:v['durationSeconds']=duration
        time.sleep(.15)
    for v in videos:
        seconds=v.get('durationSeconds')
        v['videoType']='full' if isinstance(seconds,int) and seconds>60 else 'short' if isinstance(seconds,int) else 'unknown'
    payload={'updatedAt':datetime.now(timezone.utc).isoformat(),'channels':channels,'videos':videos}
    OUT.write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n')
    print('Saved',len(videos),'videos;',sum(bool(c['id']) for c in channels),'resolved channels;',sum(v['videoType']=='unknown' for v in videos),'unclassified')
if __name__=='__main__':main()
