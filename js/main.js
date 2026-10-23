var bar=document.getElementById('topbar');
addEventListener('scroll',function(){bar.classList.toggle('scrolled',scrollY>8)},{passive:true});

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
