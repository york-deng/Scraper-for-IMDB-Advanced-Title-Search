var _ping_='ping';var _pong_='pong';var _entry_='entry';var _ready_='ready';var _start_='start';var _progress_='progress';var _continue_='continue';var _detail_='detail';var _finish_='finish';var _next_result_='nextResult';var _next_detail_='nextDetail';var _retrieve_='retrieve';var _download_='download';var defaults=50;var perPage=50;var template1='http://119.29.199.236/dl/template1.xlsx';window.onload=function(){document.getElementById('entry').onclick=onEntry;document.getElementById('start').onclick=onStart;document.getElementById('download').onclick=onDownload;var b=_ping_;chrome.extension.sendMessage({action:b},function(a){})};function isWithoutImage(){var a=document.getElementById("withoutImage");if(a){return a.checked};return(false)};function isLatestOnly(){var a=document.getElementById("latestOnly");if(a){return a.checked};return(false)};function getLimit(){var a=document.getElementById("limit");if(a){return a.value};return(defaults)};function onEntry(){var b=_entry_;chrome.extension.sendMessage({action:b},function(a){})};function onStart(){var b=_start_;var c=isWithoutImage();var d=getLimit();var e=Math.ceil((d<1?0:d)/perPage);chrome.extension.sendMessage({action:b,withoutImage:c,totalResult:d,totalPage:e},function(a){})};function onDownload(){var b=_retrieve_;var c=isLatestOnly();chrome.extension.sendMessage({action:b,latest:c},function(a){})};chrome.runtime.onMessage.addListener(function(k,l,m){if(k.action==_pong_){var n=k.startable;var o=k.downloadable;var p=k.startTime;var q=k.totalResult;var r=k.currentStep;var s=k.totalStep;var t=document.getElementById("start");if(t){t.disabled=n?false:true}var u=document.getElementById("download");if(u){u.disabled=o?false:true}var v=document.getElementById("limit");if(v){v.value=(q==0)?50:q};var w=document.getElementById("progress");if(w){var x=(s<=1)?0.0:(r*100/s).toFixed(1);var y=(p==0)?0.0:(((new Date()).getTime()-p)/1000/60).toFixed(1);var z='('+x+'%, used '+y+' minutes)';w.innerHTML=z}}else if(k.action==_ready_){var t=document.getElementById("start");if(t){t.disabled=false};var w=document.getElementById("progress");if(w){var x=0.0;var y=0.0;var z='('+x+'%, used '+y+' minutes)';w.innerHTML=z}}else if(k.action==_start_||k.action==_continue_||k.action==_detail_){var p=k.startTime;var q=k.totalResult;var r=k.currentStep;var s=k.totalStep;var v=document.getElementById("limit");if(v){v.value=(q==0)?50:q};var w=document.getElementById("progress");if(w){var x=(s<=1)?0.0:(r*100/s).toFixed(1);var y=(p==0)?0.0:(((new Date()).getTime()-p)/1000/60).toFixed(1);var z='('+x+'%, used '+y+' minutes)';w.innerHTML=z}}else if(k.action==_finish_){var p=k.startTime;var q=k.totalResult;var r=k.currentStep;var s=k.totalStep;var u=document.getElementById("download");if(u){u.disabled=false};var w=document.getElementById("progress");if(w){var x=100.0;var y=(p==0)?0.0:(((new Date()).getTime()-p)/1000/60).toFixed(1);var z='('+x+'%, used '+y+' minutes)';w.innerHTML=z}}else if(k.action==_download_){var A=k.list;var B=template1;var C=new XMLHttpRequest();C.open("GET",B,true);C.responseType="arraybuffer";C.onload=function(a){var b=C.response;var c=new Uint8Array(b);var d=new Array();for(var i=0;i!=c.length;++i){d[i]=String.fromCharCode(c[i])}var e=d.join("");var f=XLSX.read(e,{type:"binary",cellStyles:true});var g=f.SheetNames[0];var h=f.Sheets[g];var j=[];try{j=JSON.parse(A)}catch(error){alert(error)};XLSX.utils.sheet_add_json(h,j,{skipHeader:true,origin:"C5"});XLSX.writeFile(f,"IMDB-Works.xlsx")};C.send()}});