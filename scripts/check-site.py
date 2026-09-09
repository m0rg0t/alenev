#!/usr/bin/env python3
"""Validate the built site with Python standard library: python3 scripts/check-site.py."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse,unquote
import json,collections,xml.etree.ElementTree as ET
root=Path(__file__).resolve().parents[1]/'dist'
class Page(HTMLParser):
 def __init__(self):
  super().__init__();self.tags=[];self.title='';self.h1=0;self.intitle=False;self.injson=False;self.buf='';self.schemas=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs);self.tags.append((tag,a));self.h1+=tag=='h1'
  if tag=='title':self.intitle=True
  if tag=='script' and a.get('type')=='application/ld+json':self.injson=True;self.buf=''
 def handle_data(self,data):
  if self.intitle:self.title+=data
  if self.injson:self.buf+=data
 def handle_endtag(self,tag):
  if tag=='title':self.intitle=False
  if tag=='script' and self.injson:
   try:self.schemas.append(json.loads(self.buf))
   except:self.schemas.append({'error':True})
   self.injson=False

def exists(url):
 u=urlparse(url)
 if u.netloc and u.netloc!='alenev.ru':return True
 if u.scheme and u.scheme not in ['http','https']:return True
 p=root/unquote(u.path).lstrip('/')
 return any(x.is_file() for x in [p,Path(str(p)+'.html'),p/'index.html'])
rows=[]
for f in root.rglob('*.html'):
 p=Page();p.feed(f.read_text());url='/'+str(f.relative_to(root)).replace('index.html','');meta={a.get('name') or a.get('property'):a.get('content') for t,a in p.tags if t=='meta'};links=[a for t,a in p.tags if t=='link'];schemas=[x for s in p.schemas for x in s.get('@graph',[s])]
 row=dict(url=url,title=p.title,description=meta.get('description'),h1=p.h1,canonical=next((a.get('href') for a in links if a.get('rel')=='canonical'),None),brokenLinks=sorted(set(a['href'] for t,a in p.tags if t=='a' and a.get('href') and not exists(a['href']))),brokenAssets=sorted(set(a.get('src') or a.get('href') for t,a in p.tags if ((t=='img' and a.get('src')) or (t=='link' and a.get('rel')=='preload' and a.get('href'))) and not exists(a.get('src') or a.get('href')))),badAlternates=[a.get('href') for a in links if a.get('hreflang') and not exists(a['href'])],types=[s.get('@type') for s in schemas],videos=[{k:s.get(k) for k in ['name','uploadDate','contentUrl']} for s in schemas if s.get('@type')=='VideoObject'])
 rows.append(row)
errors=[]
for r in rows:
 if r['url'].startswith('/yandex_'): continue
 for key in ['brokenLinks','brokenAssets','badAlternates']:
  if r[key]: errors.append(f"{r['url']}: {key}: {r[key]}")
 if not r['title'] or not r['description']: errors.append(f"{r['url']}: missing metadata")
 if (r['description'] or '').startswith(('Programmer, developer,', 'Программист, разработчик,')):
  errors.append(f"{r['url']}: generic biography description")
 for v in r['videos']:
  if not v['uploadDate'] or len(v['uploadDate']) < 10: errors.append(f"{r['url']}: missing video publication date")
  if v['contentUrl'] and ('youtube.com/watch' in v['contentUrl'] or 'youtu.be/' in v['contentUrl']):
   errors.append(f"{r['url']}: video contentUrl points to a web page")
for title,count in collections.Counter(r['title'] for r in rows if r['title']).items():
 if count>1: errors.append(f"Duplicate title: {title}")
urls=[x.text for x in ET.parse(root/'sitemap-0.xml').iter() if x.tag.endswith('}loc')]
for u in urls:
 if not exists(u): errors.append(f"Missing sitemap target: {u}")
for r in rows:
 if r['canonical'] and r['canonical'] not in urls: errors.append(f"Canonical outside sitemap: {r['url']}")
if errors:
 print('\n'.join(errors)); raise SystemExit(1)
print(f"PASS: {len(rows)} HTML files, {len(urls)} sitemap URLs; links, assets, alternates and metadata checked.")
