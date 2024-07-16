// Compiled by ClojureScript 1.11.54 {:optimizations :none}
goog.provide('robiota.main');
goog.require('cljs.core');
goog.require('robiota.sketch');
goog.require('goog.object');
goog.scope(function(){
robiota.main.goog$module$goog$object = goog.module.get('goog.object');
});
robiota.main.goog$module$goog$object.set.call(null,window,"setup",(function (){
return robiota.sketch.setup.call(null);
}));
robiota.main.goog$module$goog$object.set.call(null,window,"step",(function (){
return robiota.sketch.step.call(null);
}));
robiota.main.goog$module$goog$object.set.call(null,window,"beginContact",(function (p1__551_SHARP_){
return robiota.sketch.beginContact.call(null,p1__551_SHARP_);
}));
robiota.main.goog$module$goog$object.set.call(null,window,"endContact",(function (p1__552_SHARP_){
return robiota.sketch.endContact.call(null,p1__552_SHARP_);
}));

//# sourceMappingURL=main.js.map
