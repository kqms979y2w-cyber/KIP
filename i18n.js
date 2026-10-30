(function(){
var COMMON_DE={
langLabel:"Sprache",
mainNav:"Hauptnavigation",
navHow:"So funktioniert's",
navPricing:"Preise",
navAbout:"Über Kip",
navJoin:"Zur Warteliste",
footNav:"Fussnavigation",
footer:"© Kip · Der Freund, der nichts durchgehen lässt."
};
var DE=Object.assign({},COMMON_DE,window.KIP_DE||{});
var ATTRS=[["data-i18n","textContent"],["data-i18n-html","innerHTML"],["data-i18n-ph","placeholder"],["data-i18n-alt","alt"],["data-i18n-aria","aria-label"]];
var meta=document.querySelector('meta[name="description"]');
var EN={title:document.title,description:meta.content};
ATTRS.forEach(function(a){document.querySelectorAll("["+a[0]+"]").forEach(function(el){
var k=el.getAttribute(a[0]);if(k in EN)return;
EN[k]=a[1]==="textContent"||a[1]==="innerHTML"?el[a[1]]:el.getAttribute(a[1]);});});

var api=window.kipI18n={lang:"en",dict:{en:EN,de:DE},listeners:[],
t:function(k){return api.dict[api.lang][k]},
onChange:function(fn){api.listeners.push(fn)},
setLang:setLang};

function setLang(l){
api.lang=api.dict[l]?l:"en";var d=api.dict[api.lang];
document.documentElement.lang=api.lang;document.title=d.title;meta.content=d.description;
ATTRS.forEach(function(a){document.querySelectorAll("["+a[0]+"]").forEach(function(el){
var v=d[el.getAttribute(a[0])];if(v==null)return;
if(a[1]==="textContent"||a[1]==="innerHTML")el[a[1]]=v;else el.setAttribute(a[1],v);});});
document.querySelectorAll("[data-lang]").forEach(function(b){b.setAttribute("aria-pressed",String(b.dataset.lang===api.lang))});
try{localStorage.setItem("kip-lang",api.lang)}catch(e){}
api.listeners.forEach(function(fn){fn(api.lang)});
}

document.querySelectorAll("[data-lang]").forEach(function(b){b.addEventListener("click",function(){setLang(b.dataset.lang)})});
var saved=null;try{saved=localStorage.getItem("kip-lang")}catch(e){}
setLang(saved||((navigator.language||"").toLowerCase().indexOf("de")===0?"de":"en"));
})();
