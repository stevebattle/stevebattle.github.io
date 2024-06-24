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

//# sourceMappingURL=main.js.map
