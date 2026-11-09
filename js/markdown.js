import {escapeHtml} from './common.js';

function safeUri(raw){
  const url=raw.trim();
  if(/^(https?:\/\/|\.\.?\/|[a-zA-Z0-9_-]+(?:\/|\.|\?|#)|#)/.test(url) && !/[\u0000-\u001f]/.test(url))return url;
  return '#';
}
function slug(s){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-');}
function inline(source,lang){
  const tokens=[];
  let s=source.replace(/\\\([\s\S]*?\\\)/g,m=>{const n=tokens.push({value:escapeHtml(m)})-1;return `%%TOKEN${n}%%`;});
  s=s.replace(/`([^`]+)`/g,(_,code)=>{const n=tokens.push({value:`<code>${escapeHtml(code)}</code>`})-1;return `%%TOKEN${n}%%`;});
  s=escapeHtml(s);
  s=s.replace(/\[([^\]]+)\]\(([^)]+)\)/g,(_,label,href)=>{
    let url=safeUri(href);
    const isDemo=url.startsWith('demo.html');
    if(isDemo){const [path,query='']=url.split('?');const p=new URLSearchParams(query);p.set('lang',lang);url=`${path}?${p.toString()}`;}
    const cls=isDemo?' class="demo-call-to-action"':'';
    const target=isDemo?' target="_blank" rel="noopener noreferrer"':'';
    return `<a href="${escapeHtml(url)}"${cls}${target}>${label}</a>`;
  });
  s=s.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
  s=s.replace(/\*([^*]+)\*/g,'<em>$1</em>');
  s=s.replace(/%%TOKEN(\d+)%%/g,(_,i)=>tokens[Number(i)]?.value ?? '');
  return s;
}
function isSpecial(line){return /^\s*$/.test(line)||/^(#{1,4})\s+/.test(line)||/^```/.test(line)||/^>\s?/.test(line)||/^[-*]\s+/.test(line)||/^---+$/.test(line)||/^!\[[^\]]*\]\([^)]+\)$/.test(line);}
export function parseMarkdown(markdown,{sourcePath='',lang='hu'}={}){
  const lines=markdown.replace(/\r/g,'').split('\n');const result=[];const headings=[];
  const base=sourcePath.includes('/')?sourcePath.slice(0,sourcePath.lastIndexOf('/')+1):'';
  let firstParagraph=true;
  let idx=0;
  while(idx<lines.length){
    const raw=lines[idx];
    if(!raw.trim()){idx++;continue;}
    if(raw.startsWith('```')){
      const kind=raw.slice(3).trim()||'text';const code=[];idx++;
      while(idx<lines.length&&!lines[idx].startsWith('```')){code.push(lines[idx]);idx++;}
      if(idx<lines.length)idx++;
      result.push(`<pre class="code-block"><div class="code-label">${escapeHtml(kind.toUpperCase())}</div><code>${escapeHtml(code.join('\n'))}</code></pre>`);continue;
    }
    const heading=raw.match(/^(#{1,4})\s+(.+)$/);
    if(heading){const level=heading[1].length;const text=heading[2].trim();const id=slug(text);headings.push({id,title:text,level});result.push(`<h${level} id="${id}">${inline(text,lang)}</h${level}>`);idx++;continue;}
    const image=raw.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if(image){
      const rawUrl=safeUri(image[2]);const src=/^https?:/.test(rawUrl)?rawUrl:base+rawUrl;
      result.push(`<figure><img src="${escapeHtml(src)}" alt="${escapeHtml(image[1])}" loading="lazy"><figcaption>${escapeHtml(image[1])}</figcaption></figure>`);idx++;continue;
    }
    if(/^---+$/.test(raw.trim())){result.push('<hr class="section-rule">');idx++;continue;}
    if(raw.startsWith('>')){const block=[];while(idx<lines.length&&lines[idx].startsWith('>')){block.push(lines[idx].replace(/^>\s?/,''));idx++;}result.push(`<blockquote><p>${inline(block.join(' '),lang)}</p></blockquote>`);continue;}
    if(/^[-*]\s+/.test(raw)){
      const items=[];while(idx<lines.length&&/^[-*]\s+/.test(lines[idx])){items.push(`<li>${inline(lines[idx].replace(/^[-*]\s+/,''),lang)}</li>`);idx++;}
      result.push(`<ul>${items.join('')}</ul>`);continue;
    }
    const paragraph=[];while(idx<lines.length&&!isSpecial(lines[idx])){paragraph.push(lines[idx].trim());idx++;}
    if(!paragraph.length){idx++;continue;}
    result.push(`<p${firstParagraph?' class="lead"':''}>${inline(paragraph.join(' '),lang)}</p>`);firstParagraph=false;
  }
  return {html:result.join('\n'),headings};
}
