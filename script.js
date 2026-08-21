/* ============ UNDANGAN KHITAN REYNAND — TEMA MAROON SUNDA ============ */
(function(){
"use strict";
var $=function(id){return document.getElementById(id)};
var esc=function(t){return String(t==null?'':t).replace(/[&<>"']/g,function(m){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]})};
var store={get:function(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},set:function(k,v){localStorage.setItem(k,JSON.stringify(v))}};
var ADMIN_PIN="1234";
var EVENT_DATE='2026-08-30T07:30:00+07:00';
var fmtT=function(iso){return new Date(iso).toLocaleString('id-ID',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})};

function toast(msg){
    var t=document.createElement('div');t.textContent=msg;
    t.style.cssText='position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:99999;background:#4a0808;color:#fdf6ec;border:1px solid #d4af37;padding:10px 22px;border-radius:50px;font-size:.8rem;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,.4)';
    document.body.appendChild(t);setTimeout(function(){t.remove()},2400);
}
function copyText(txt,msg){
    var done=function(){toast(msg||'Berhasil disalin ✓')};
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(done).catch(fb)}else fb();
    function fb(){var ta=document.createElement('textarea');ta.value=txt;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');done()}catch(e){}ta.remove()}
}

/* ================= INDEX ================= */
function initInvite(){
    var g=new URLSearchParams(location.search).get('to');
    if(g)$('guestName').textContent=g;

    var playing=false;
    $('btnEnter').addEventListener('click',function(){
        $('opening').classList.add('hide');
        $('fab').classList.add('show');
        $('particles').classList.add('on');
        $('music').play().then(function(){$('fabMusic').classList.add('playing');playing=true}).catch(function(){});
        setTimeout(function(){$('opening').style.display='none'},900);
    });
    $('fabMusic').addEventListener('click',function(){
        if(playing){$('music').pause();this.classList.remove('playing')}else{$('music').play().catch(function(){});this.classList.add('playing')}
        playing=!playing;
    });
    $('fabTop').addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});

    var obs=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('visible');obs.unobserve(x.target)}})},{threshold:.12});
    document.querySelectorAll('.reveal').forEach(function(el){obs.observe(el)});

    var target=new Date(EVENT_DATE).getTime();
    function p2(n){return String(n).padStart(2,'0')}
    function tick(){var d=Math.max(0,target-Date.now());
        $('cD').textContent=p2(Math.floor(d/864e5));
        $('cH').textContent=p2(Math.floor(d%864e5/36e5));
        $('cM').textContent=p2(Math.floor(d%36e5/6e4));
        $('cS').textContent=p2(Math.floor(d%6e4/1e3));}
    tick();setInterval(tick,1000);

    document.querySelectorAll('.g-item').forEach(function(it){it.addEventListener('click',function(){$('lbImg').src=this.dataset.src;$('lightbox').classList.add('open')})});
    $('lbClose').addEventListener('click',function(e){e.stopPropagation();$('lightbox').classList.remove('open')});
    $('lightbox').addEventListener('click',function(){$('lightbox').classList.remove('open')});
    $('btnMap').addEventListener('click',function(){window.open('https://www.google.com/maps/search/Tanjung+Waras,+Sinar+Banten,+Bukit+Kemuning','_blank')});

    document.querySelectorAll('.btn-copy').forEach(function(btn){btn.addEventListener('click',function(){
        var self=this;copyText(this.dataset.num,'Nomor rekening disalin ✓');
        this.classList.add('copied');var old=this.innerHTML;this.innerHTML='<i class="fas fa-check"></i> Tersalin';
        setTimeout(function(){self.classList.remove('copied');self.innerHTML=old},2000);
    })});

    function renderWishes(){
        var w=store.get('khitan_wishes',[]);
        var emptyEl=$('wishEmpty');
        if(emptyEl)emptyEl.style.display=w.length?'none':'block';
        var listEl=$('wishList');
        if(listEl)listEl.innerHTML=w.slice(0,50).map(function(x){
            return '<div class="wish-card"><div class="wish-name">'+esc(x.nama)+' <span class="badge '+(x.status==='Hadir'?'badge-hadir':x.status==='Berhalangan'?'badge-tidak':'badge-ragu')+'">'+esc(x.status||'')+'</span></div><div class="wish-msg">'+esc(x.pesan)+'</div><div class="wish-time">'+fmtT(x.waktu)+'</div></div>';
        }).join('');
    }
    renderWishes();

    $('kform').addEventListener('submit',function(e){
        e.preventDefault();
        var nama=$('kName').value.trim(),jumlah=$('kJumlah').value,status=$('kKonfirmasi').value,pesan=$('kPesan').value.trim();
        if(!nama||!status){toast('Nama & konfirmasi wajib diisi 🙏');return}
        var now=new Date().toISOString();
        var r=store.get('khitan_rsvps',[]);
        r.push({id:Date.now().toString(36),nama:nama,status:status,jumlah:jumlah+' orang',pesan:pesan,waktu:now});
        store.set('khitan_rsvps',r);
        var w=store.get('khitan_wishes',[]);
        w.unshift({id:Date.now().toString(36)+'w',nama:nama,status:status,pesan:pesan||'(hadir)',waktu:now});
        store.set('khitan_wishes',w);
        renderWishes();this.reset();if(g)$('kName').value=g;
        $('kformOk').classList.add('show');
        setTimeout(function(){$('kformOk').classList.remove('show')},4000);
    });

    /* partikel emas */
    var cvs=$('particles'),ctx=cvs.getContext('2d'),dots=[];
    var cols=['rgba(212,175,55,','rgba(232,201,106,','rgba(168,132,42,','rgba(163,22,33,'];
    function rs(){cvs.width=innerWidth;cvs.height=innerHeight}rs();addEventListener('resize',rs);
    function Dot(){this.x=Math.random()*cvs.width;this.y=Math.random()*cvs.height;this.r=Math.random()*2+.5;this.dx=(Math.random()-.5)*.3;this.dy=(Math.random()-.5)*.25;this.a=Math.random()*.16+.04;this.c=cols[Math.floor(Math.random()*cols.length)]}
    Dot.prototype.step=function(){this.x+=this.dx;this.y+=this.dy;if(this.x<-10)this.x=cvs.width+10;if(this.x>cvs.width+10)this.x=-10;if(this.y<-10)this.y=cvs.height+10;if(this.y>cvs.height+10)this.y=-10};
    Dot.prototype.draw=function(){ctx.beginPath();ctx.arc(this.x,this.y,Math.max(.3,this.r),0,Math.PI*2);ctx.fillStyle=this.c+this.a+')';ctx.fill()};
    for(var i=0;i<40;i++)dots.push(new Dot());
    (function loop(){ctx.clearRect(0,0,cvs.width,cvs.height);dots.forEach(function(d){d.step();d.draw()});requestAnimationFrame(loop)})();
}

/* ================= ADMIN ================= */
function initAdmin(){
    if(sessionStorage.getItem('khitan_admin')==='1')unlock();
    $('formPIN').addEventListener('submit',function(e){
        e.preventDefault();
        if($('pinInput').value===ADMIN_PIN){sessionStorage.setItem('khitan_admin','1');unlock()}
        else{toast('PIN salah ❌');$('pinInput').value=''}
    });
    $('btnLogout').addEventListener('click',function(){sessionStorage.removeItem('khitan_admin');location.reload()});
    function unlock(){$('pinGate').classList.add('hidden');$('adminMain').classList.remove('hidden');renderAll()}

    var getR=function(){return store.get('khitan_rsvps',[])},getW=function(){return store.get('khitan_wishes',[])};

    function renderAll(){
        var r=getR(),w=getW();
        var hadir=r.filter(function(x){return x.status==='Hadir'});
        $('stTotal').textContent=r.length;
        $('stHadir').textContent=hadir.length;
        $('stTidak').textContent=r.filter(function(x){return x.status==='Berhalangan'}).length;
        $('stTamu').textContent=hadir.reduce(function(a,x){return a+(parseInt(x.jumlah)||1)},0);
        $('stWish').textContent=w.length;
        $('rsvpEmpty').classList.toggle('hidden',r.length>0);
        $('wishEmpty').classList.toggle('hidden',w.length>0);
        var badge=function(s){return s==='Hadir'?'badge-hadir':s==='Berhalangan'?'badge-tidak':'badge-ragu'};
        $('rsvpBody').innerHTML=r.slice().reverse().map(function(x){
            return '<tr><td><b>'+esc(x.nama)+'</b></td><td><span class="badge '+badge(x.status)+'">'+esc(x.status)+'</span></td><td>'+esc(x.jumlah||'-')+'</td><td><small>'+fmtT(x.waktu)+'</small></td><td><button class="del-btn" data-del-rsvp="'+x.id+'"><i class="fas fa-trash"></i></button></td></tr>';
        }).join('');
        $('wishBody').innerHTML=w.map(function(x){
            return '<div class="wish-card"><div class="wish-name">'+esc(x.nama)+' <span class="badge '+badge(x.status||'')+'">'+esc(x.status||'')+'</span> &nbsp;<button class="del-btn" data-del-wish="'+x.id+'"><i class="fas fa-times"></i></button></div><div class="wish-msg">'+esc(x.pesan)+'</div><div class="wish-time">'+fmtT(x.waktu)+'</div></div>';
        }).join('');
    }

    document.addEventListener('click',function(e){
        var dr=e.target.closest('[data-del-rsvp]'),dw=e.target.closest('[data-del-wish]');
        if(dr){store.set('khitan_rsvps',getR().filter(function(x){return x.id!==dr.dataset.delRsvp}));renderAll();toast('RSVP dihapus')}
        if(dw){store.set('khitan_wishes',getW().filter(function(x){return x.id!==dw.dataset.delWish}));renderAll();toast('Ucapan dihapus')}
    });

    $('btnClearAll').addEventListener('click',function(){
        if(confirm('Hapus SEMUA data RSVP & ucapan?')){store.set('khitan_rsvps',[]);store.set('khitan_wishes',[]);renderAll();toast('Semua data dihapus')}
    });

    $('btnExport').addEventListener('click',function(){
        var rows=[['Nama','Status','Jumlah','Pesan','Waktu']].concat(getR().map(function(x){return[x.nama,x.status,x.jumlah,x.pesan||'',x.waktu]}));
        var csv=rows.map(function(r){return r.map(function(c){return '"'+String(c==null?'':c).replace(/"/g,'""')+'"'}).join(',')}).join('\n');
        var a=document.createElement('a');
        a.href=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'}));
        a.download='rsvp-khitanan-reynand.csv';a.click();URL.revokeObjectURL(a.href);
        toast('CSV diunduh ⬇');
    });

    $('btnGen').addEventListener('click',function(){
        var nama=$('guestInput').value.trim();
        var base=(location.origin&&location.origin!=='null')?location.origin:'';
        var path=location.pathname.replace(/admin\.html.*$/,'index.html')||'/index.html';
        var link=base+path+(nama?'?to='+encodeURIComponent(nama):'');
        $('linkOut').textContent=link;
        $('linkResult').classList.remove('hidden');
        $('btnCopyLink').onclick=function(){copyText(link,'Link disalin ✓')};
        $('btnWA').onclick=function(){
            var teks='Assalamualaikum'+(nama?' '+nama:'')+' 🙏\n\nTanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara(i) untuk hadir di acara Walimatul Khitan putra kami *Reynand Abrisam* pada Minggu, 30 Agustus 2026 — Tanjung Waras, Dusun 3 Sinar Banten, Kec. Bukit Kemuning.\n\nDetail undangan: '+link+'\n\nWassalamu\'alaikum wr. wb. — Keluarga Besar Bapak. Rahmat & Ibu. Susi Marlena';
            window.open('https://wa.me/?text='+encodeURIComponent(teks),'_blank');
        };
    });
}

if($('adminMain'))initAdmin();else if($('opening'))initInvite();
})();