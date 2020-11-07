var _ping_='ping';var _pong_='pong';var _entry_='entry';var _ready_='ready';var _start_='start';var _progress_='progress';var _continue_='continue';var _detail_='detail';var _finish_='finish';var _next_result_='nextResult';var _next_detail_='nextDetail';var _retrieve_='retrieve';var _download_='download';var urlBase='https://www.imdb.com';var urlEntry='https://www.imdb.com/search/title/';var urlResult='https://www.imdb.com/search/title/?';var keySearch='/search';var perPage=(50);var urlDetail='https://www.imdb.com/title/';var urlImages=['*://*/images*','*://*.media-amazon.com/images*','*://*.zergnet.com/*'];var url=null;function getUrl(a,b){chrome.tabs.get(a,(tab)=>{url=tab.url;console.assert(typeof url=='string','tab.url should be a string');b(url)})};function getCurrentTabUrl(a){var b={active:true,currentWindow:true};chrome.tabs.query(b,(tabs)=>{var c=tabs[0];url=c.url;console.assert(typeof url=='string','tab.url should be a string');a(url)})};chrome.runtime.onInstalled.addListener(function(){chrome.declarativeContent.onPageChanged.removeRules(undefined,function(){chrome.declarativeContent.onPageChanged.addRules([{conditions:[new chrome.declarativeContent.PageStateMatcher({})],actions:[new chrome.declarativeContent.ShowPageAction()]}])})});chrome.tabs.executeScript(null,{file:"content_script.js"});var tabID=0;var startable=false,downloadable=false;var startTime=0,totalResult=0,currentPage=0,totalPage=1,currentStep=0,totalStep=1,index=0;chrome.tabs.onUpdated.addListener(function(a,b,c){if(b.status=='complete'){getUrl(tabID,(url)=>{if(typeof(url)==='undefined'||url==null){alert('Error: typeof(url) === \'undefined\' || url == null')}else{var d=null;if(url.startsWith(urlResult)&&url.includes(keySearch)&&url.includes('?')&&url.includes('=')){var n=url.includes('start=');if(!n){startable=true;downloadable=false;startTime=0;totalResult=0;currentPage=0;totalPage=1;currentStep=0;totalStep=1;index=0};if(currentPage>=0&&currentPage<=totalPage){currentPage++;d=_next_result_;chrome.tabs.sendMessage((tabID==0?a:tabID),{action:d,startTime:startTime,totalResult:totalResult,currentPage:currentPage,totalPage:totalPage,currentStep:currentStep,totalStep:totalStep})}}else if(url.startsWith(urlDetail)){if(index>=0){index++;d=_next_detail_;chrome.tabs.sendMessage((tabID==0?a:tabID),{action:d,startTime:startTime,totalResult:totalResult,currentStep:currentStep,totalStep:totalStep,index:index,url:null})}}else{}}})}});var withoutImage=false;var blocking=function(a){return{cancel:false}};chrome.extension.onMessage.addListener(function(b,c,d){var e=null;if(b.action==_ping_){if(typeof(url)==='undefined'||url==null){}else{var f=_pong_;chrome.extension.sendMessage({action:f,startable:startable,downloadable:downloadable,startTime:startTime,totalResult:totalResult,currentStep:currentStep,totalStep:totalStep})}}else if(b.action==_entry_){var g=chrome.webRequest.onBeforeRequest.hasListener(blocking);if(g){chrome.webRequest.onBeforeRequest.removeListener(blocking)};startable=false;downloadable=false;chrome.tabs.create({url:urlEntry,active:true},function(a){tabID=a.id})}else if(b.action==_ready_){if(typeof(url)==='undefined'||url==null){alert('Error: Invalid URL.\nYou MUST begin by clicking the "Go" button in the popup window.\n')}else if(url.startsWith(urlResult)&&url.includes(keySearch)){startable=true}}else if(b.action==_start_||b.action==_continue_){if(typeof(url)==='undefined'||url==null){alert('Error: Invalid URL.\nYou MUST begin by clicking the "Go" button in the popup window.\n')}else if(url.startsWith(urlResult)&&url.includes(keySearch)&&url.includes('?')&&url.includes('=')){if(b.action==_start_){withoutImage=b.withoutImage;totalResult=b.totalResult;totalPage=b.totalPage;startable=false;downloadable=false;startTime=(new Date()).getTime();currentStep=0;totalStep=totalPage+totalPage*perPage;if(chrome.webRequest.onBeforeRequest.hasListener(blocking)){chrome.webRequest.onBeforeRequest.removeListener(blocking)};if(withoutImage){blocking=function(a){return{cancel:true}}}else{blocking=function(a){return{cancel:false}}};chrome.webRequest.onBeforeRequest.addListener(blocking,{urls:['*://*.media-amazon.com/images*'],types:['image']},['blocking'])}else if(b.action==_continue_){totalStep=b.totalStep};if(currentStep<totalStep){currentStep++};var n=url.includes('start=');var m=url.search('start=')+6;var x=url.substring(m,m+3);var y=parseInt(x);if(!n){e=url.concat('&start=51')}else if(y<=0){e=url.replace('start='+y,'start='+51)}else if(y<=totalPage*50){var h=url.search('start=')+6;var i=url.substring(h,h+3);var j=parseInt(i);var k=j+50;e=url.replace('start='+j,'start='+k)};if(typeof(e)==='undefined'||e==null){alert('Error: Invalid URL (typeof(to) === \'undefined\' || to == null)')}else{chrome.tabs.update(tabID,{url:e})}}}else if(b.action==_detail_){if(typeof(url)==='undefined'||url==null){alert('Error: Invalid URL (typeof(url) === \'undefined\' || url == null)')}else{totalStep=b.totalStep;index=b.index;if(currentStep<totalStep){currentStep++};e=b.url;if(typeof(e)==='undefined'||e==null){alert('Error: Invalid URL (typeof(to) === \'undefined\' || to == null)')}else if(e.startsWith(urlDetail)){chrome.tabs.update(tabID,{url:e})}}}else if(b.action==_finish_){if(typeof(url)==='undefined'||url==null){alert('Error: Invalid URL (typeof(url) === \'undefined\' || url == null)')}else{downloadable=true;currentStep=totalStep}}else if(b.action==_retrieve_){if(typeof(url)==='undefined'||url==null){alert('Error: Invalid URL (typeof(url) === \'undefined\' || url == null)')}else{var f=b.action;var l=b.latest;chrome.tabs.sendMessage(tabID,{action:f,latest:l})}}else if(b.action==_download_){}else{alert('Error: Invalid action ('+b.action+')')}});chrome.webRequest.onBeforeRequest.addListener(blocking,{urls:urlImages,types:['*']},['blocking']);chrome.commands.onCommand.addListener(function(a){});