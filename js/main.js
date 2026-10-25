var bar=document.getElementById('topbar');
addEventListener('scroll',function(){bar.classList.toggle('scrolled',scrollY>8)},{passive:true});

// Logo strip: scrolls on its own, and can be held and dragged left or right (touch or mouse).
// Without JS, or with reduced motion, the CSS version in styles.css is used instead.
(function(){
  var mq=document.querySelector('.marquee'), track=mq&&mq.querySelector('.track');
  if(!track||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  mq.classList.add('draggable');
  var x=0, vel=0, half=0, speed=0, last=0, hover=false;
  var drag=null; // {id, startX, startOff, lastX, lastT, moved}
  function measure(){half=track.scrollWidth/2; speed=half/38000} // same pace as the CSS version: half the track per 38s
  measure(); addEventListener('resize',measure);
  function frame(t){
    var dt=last?Math.min(t-last,50):16; last=t;
    if(!drag){
      x+=vel*dt; vel*=Math.pow(.94,dt/16); // momentum after a swipe, easing out
      if(Math.abs(vel)<.01){vel=0; if(!hover)x-=speed*dt}
    }
    if(half){x%=half; if(x>0)x-=half}
    track.style.transform='translate3d('+x+'px,0,0)';
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  mq.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse')hover=true});
  mq.addEventListener('pointerleave',function(e){if(e.pointerType==='mouse')hover=false});
  mq.addEventListener('pointerdown',function(e){
    if(e.button>0)return;
    drag={id:e.pointerId,startX:e.clientX,startOff:x,lastX:e.clientX,lastT:e.timeStamp,moved:false}; vel=0;
  });
  mq.addEventListener('pointermove',function(e){
    if(!drag||e.pointerId!==drag.id)return;
    var dx=e.clientX-drag.startX;
    if(!drag.moved&&Math.abs(dx)>6){drag.moved=true; mq.classList.add('dragging'); try{mq.setPointerCapture(e.pointerId)}catch(_){}}
    if(drag.moved){
      x=drag.startOff+dx;
      var dt=e.timeStamp-drag.lastT; if(dt>0)vel=(e.clientX-drag.lastX)/dt;
      drag.lastX=e.clientX; drag.lastT=e.timeStamp;
    }
  });
  function end(e){
    if(!drag||e.pointerId!==drag.id)return;
    if(drag.moved){
      if(e.timeStamp-drag.lastT>80)vel=0; // held still before letting go: no fling
      vel=Math.max(-3,Math.min(3,vel));
      mq.dataset.justDragged='1'; setTimeout(function(){delete mq.dataset.justDragged},0);
    }else vel=0;
    mq.classList.remove('dragging'); drag=null;
  }
  mq.addEventListener('pointerup',end);
  mq.addEventListener('pointercancel',function(e){if(drag&&e.pointerId===drag.id){mq.classList.remove('dragging');drag=null}});
  // a drag shouldn't count as a tap on the logo underneath
  mq.addEventListener('click',function(e){if(mq.dataset.justDragged)e.preventDefault()},true);
})();

// Lead form, sent through Web3Forms. Paste the access key from web3forms.com here;
// until then it falls back to opening an email with the details filled in.
var WEB3FORMS_KEY='802ba8cb-c5ca-4d30-92df-c977ed3617e7';
var form=document.getElementById('lead'), status=form.querySelector('.status');
form.addEventListener('submit',function(e){
  e.preventDefault();
  var d=new FormData(form);
  if(d.get('botcheck'))return;
  if(!d.get('name').trim()||!d.get('contact').trim()){status.textContent='Please add your name and an email or phone.';return}
  if(!WEB3FORMS_KEY){
    var body='Name: '+d.get('name')+'\nContact: '+d.get('contact')+'\n\n'+d.get('message');
    location.href='mailto:vitman.amir@gmail.com?subject='+encodeURIComponent('New lead from superdataman')+'&body='+encodeURIComponent(body);
    return;
  }
  var btn=form.querySelector('button');btn.disabled=true;status.textContent='Sending…';
  d.append('access_key',WEB3FORMS_KEY);
  d.append('subject','New lead from superdataman: '+d.get('name'));
  d.append('from_name','SuperDataman site');
  if(d.get('contact').indexOf('@')>0)d.append('email',d.get('contact')); // lets you hit Reply
  fetch('https://api.web3forms.com/submit',{method:'POST',headers:{Accept:'application/json'},body:d})
    .then(function(r){return r.json()})
    .then(function(j){if(!j.success)throw 0;form.reset();status.textContent='Thanks! I’ll get back to you within one business day.'})
    .catch(function(){status.textContent='Something went wrong. Please email vitman.amir@gmail.com instead.'})
    .finally(function(){btn.disabled=false});
});
