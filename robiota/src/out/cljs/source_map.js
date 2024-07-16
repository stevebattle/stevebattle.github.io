// Compiled by ClojureScript 1.11.54 {:optimizations :none}
goog.provide('cljs.source_map');
goog.require('cljs.core');
goog.require('clojure.string');
goog.require('clojure.set');
goog.require('cljs.source_map.base64_vlq');
goog.require('goog.object');
goog.scope(function(){
cljs.source_map.goog$module$goog$object = goog.module.get('goog.object');
});
/**
 * Take a seq of source file names and return a map from
 * file number to integer index. For reverse source maps.
 */
cljs.source_map.indexed_sources = (function cljs$source_map$indexed_sources(sources){
return cljs.core.reduce.call(null,(function (m,p__2197){
var vec__2198 = p__2197;
var i = cljs.core.nth.call(null,vec__2198,(0),null);
var v = cljs.core.nth.call(null,vec__2198,(1),null);
return cljs.core.assoc.call(null,m,v,i);
}),cljs.core.PersistentArrayMap.EMPTY,cljs.core.map_indexed.call(null,(function (a,b){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [a,b], null);
}),sources));
});
/**
 * Take a seq of source file names and return a comparator
 * that can be used to construct a sorted map. For reverse
 * source maps.
 */
cljs.source_map.source_compare = (function cljs$source_map$source_compare(sources){
var sources__$1 = cljs.source_map.indexed_sources.call(null,sources);
return (function (a,b){
return cljs.core.compare.call(null,sources__$1.call(null,a),sources__$1.call(null,b));
});
});
/**
 * Take a source map segment represented as a vector
 * and return a map.
 */
cljs.source_map.seg__GT_map = (function cljs$source_map$seg__GT_map(seg,source_map){
var vec__2201 = seg;
var gcol = cljs.core.nth.call(null,vec__2201,(0),null);
var source = cljs.core.nth.call(null,vec__2201,(1),null);
var line = cljs.core.nth.call(null,vec__2201,(2),null);
var col = cljs.core.nth.call(null,vec__2201,(3),null);
var name = cljs.core.nth.call(null,vec__2201,(4),null);
return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"gcol","gcol",309250807),gcol,new cljs.core.Keyword(null,"source","source",-433931539),(cljs.source_map.goog$module$goog$object.get.call(null,source_map,"sources")[source]),new cljs.core.Keyword(null,"line","line",212345235),line,new cljs.core.Keyword(null,"col","col",-1959363084),col,new cljs.core.Keyword(null,"name","name",1843675177),(function (){var temp__5804__auto__ = new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(cljs.core.meta.call(null,seg));
if(cljs.core.truth_(temp__5804__auto__)){
var name__$1 = temp__5804__auto__;
return (cljs.source_map.goog$module$goog$object.get.call(null,source_map,"names")[name__$1]);
} else {
return null;
}
})()], null);
});
/**
 * Combine a source map segment vector and a relative
 * source map segment vector and combine them to get
 * an absolute segment posititon information as a vector.
 */
cljs.source_map.seg_combine = (function cljs$source_map$seg_combine(seg,relseg){
var vec__2204 = seg;
var gcol = cljs.core.nth.call(null,vec__2204,(0),null);
var source = cljs.core.nth.call(null,vec__2204,(1),null);
var line = cljs.core.nth.call(null,vec__2204,(2),null);
var col = cljs.core.nth.call(null,vec__2204,(3),null);
var name = cljs.core.nth.call(null,vec__2204,(4),null);
var vec__2207 = relseg;
var rgcol = cljs.core.nth.call(null,vec__2207,(0),null);
var rsource = cljs.core.nth.call(null,vec__2207,(1),null);
var rline = cljs.core.nth.call(null,vec__2207,(2),null);
var rcol = cljs.core.nth.call(null,vec__2207,(3),null);
var rname = cljs.core.nth.call(null,vec__2207,(4),null);
var nseg = new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [(gcol + rgcol),((function (){var or__5043__auto__ = source;
if(cljs.core.truth_(or__5043__auto__)){
return or__5043__auto__;
} else {
return (0);
}
})() + rsource),((function (){var or__5043__auto__ = line;
if(cljs.core.truth_(or__5043__auto__)){
return or__5043__auto__;
} else {
return (0);
}
})() + rline),((function (){var or__5043__auto__ = col;
if(cljs.core.truth_(or__5043__auto__)){
return or__5043__auto__;
} else {
return (0);
}
})() + rcol),((function (){var or__5043__auto__ = name;
if(cljs.core.truth_(or__5043__auto__)){
return or__5043__auto__;
} else {
return (0);
}
})() + rname)], null);
if(cljs.core.truth_(name)){
return cljs.core.with_meta.call(null,nseg,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"name","name",1843675177),(name + rname)], null));
} else {
return nseg;
}
});
/**
 * Helper for decode-reverse. Take a reverse source map and
 *   update it with a segment map.
 */
cljs.source_map.update_reverse_result = (function cljs$source_map$update_reverse_result(result,segmap,gline){
var map__2210 = segmap;
var map__2210__$1 = cljs.core.__destructure_map.call(null,map__2210);
var gcol = cljs.core.get.call(null,map__2210__$1,new cljs.core.Keyword(null,"gcol","gcol",309250807));
var source = cljs.core.get.call(null,map__2210__$1,new cljs.core.Keyword(null,"source","source",-433931539));
var line = cljs.core.get.call(null,map__2210__$1,new cljs.core.Keyword(null,"line","line",212345235));
var col = cljs.core.get.call(null,map__2210__$1,new cljs.core.Keyword(null,"col","col",-1959363084));
var name = cljs.core.get.call(null,map__2210__$1,new cljs.core.Keyword(null,"name","name",1843675177));
var d = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"gline","gline",-1086242431),gline,new cljs.core.Keyword(null,"gcol","gcol",309250807),gcol], null);
var d__$1 = (cljs.core.truth_(name)?cljs.core.assoc.call(null,d,new cljs.core.Keyword(null,"name","name",1843675177),name):d);
return cljs.core.update_in.call(null,result,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [source], null),cljs.core.fnil.call(null,(function (m){
return cljs.core.update_in.call(null,m,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [line], null),cljs.core.fnil.call(null,(function (m__$1){
return cljs.core.update_in.call(null,m__$1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [col], null),cljs.core.fnil.call(null,(function (v){
return cljs.core.conj.call(null,v,d__$1);
}),cljs.core.PersistentVector.EMPTY));
}),cljs.core.sorted_map.call(null)));
}),cljs.core.sorted_map.call(null)));
});
/**
 * Convert a v3 source map JSON object into a reverse source map
 *   mapping original ClojureScript source locations to the generated
 *   JavaScript.
 */
cljs.source_map.decode_reverse = (function cljs$source_map$decode_reverse(var_args){
var G__2212 = arguments.length;
switch (G__2212) {
case 1:
return cljs.source_map.decode_reverse.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs.source_map.decode_reverse.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs.source_map.decode_reverse.cljs$core$IFn$_invoke$arity$1 = (function (source_map){
return cljs.source_map.decode_reverse.call(null,cljs.source_map.goog$module$goog$object.get.call(null,source_map,"mappings"),source_map);
}));

(cljs.source_map.decode_reverse.cljs$core$IFn$_invoke$arity$2 = (function (mappings,source_map){
var sources = cljs.source_map.goog$module$goog$object.get.call(null,source_map,"sources");
var relseg_init = new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [(0),(0),(0),(0),(0)], null);
var lines = cljs.core.seq.call(null,clojure.string.split.call(null,mappings,/;/));
var gline = (0);
var lines__$1 = lines;
var relseg = relseg_init;
var result = cljs.core.sorted_map_by.call(null,cljs.source_map.source_compare.call(null,sources));
while(true){
if(lines__$1){
var line = cljs.core.first.call(null,lines__$1);
var vec__2216 = ((clojure.string.blank_QMARK_.call(null,line))?new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [result,relseg], null):(function (){var segs = cljs.core.seq.call(null,clojure.string.split.call(null,line,/,/));
var segs__$1 = segs;
var relseg__$1 = relseg;
var result__$1 = result;
while(true){
if(segs__$1){
var seg = cljs.core.first.call(null,segs__$1);
var nrelseg = cljs.source_map.seg_combine.call(null,cljs.source_map.base64_vlq.decode.call(null,seg),relseg__$1);
var G__2220 = cljs.core.next.call(null,segs__$1);
var G__2221 = nrelseg;
var G__2222 = cljs.source_map.update_reverse_result.call(null,result__$1,cljs.source_map.seg__GT_map.call(null,nrelseg,source_map),gline);
segs__$1 = G__2220;
relseg__$1 = G__2221;
result__$1 = G__2222;
continue;
} else {
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [result__$1,relseg__$1], null);
}
break;
}
})());
var result__$1 = cljs.core.nth.call(null,vec__2216,(0),null);
var relseg__$1 = cljs.core.nth.call(null,vec__2216,(1),null);
var G__2223 = (gline + (1));
var G__2224 = cljs.core.next.call(null,lines__$1);
var G__2225 = cljs.core.assoc.call(null,relseg__$1,(0),(0));
var G__2226 = result__$1;
gline = G__2223;
lines__$1 = G__2224;
relseg = G__2225;
result = G__2226;
continue;
} else {
return result;
}
break;
}
}));

(cljs.source_map.decode_reverse.cljs$lang$maxFixedArity = 2);

/**
 * Helper for decode. Take a source map and update it based on a
 *   segment map.
 */
cljs.source_map.update_result = (function cljs$source_map$update_result(result,segmap,gline){
var map__2228 = segmap;
var map__2228__$1 = cljs.core.__destructure_map.call(null,map__2228);
var gcol = cljs.core.get.call(null,map__2228__$1,new cljs.core.Keyword(null,"gcol","gcol",309250807));
var source = cljs.core.get.call(null,map__2228__$1,new cljs.core.Keyword(null,"source","source",-433931539));
var line = cljs.core.get.call(null,map__2228__$1,new cljs.core.Keyword(null,"line","line",212345235));
var col = cljs.core.get.call(null,map__2228__$1,new cljs.core.Keyword(null,"col","col",-1959363084));
var name = cljs.core.get.call(null,map__2228__$1,new cljs.core.Keyword(null,"name","name",1843675177));
var d = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"line","line",212345235),line,new cljs.core.Keyword(null,"col","col",-1959363084),col,new cljs.core.Keyword(null,"source","source",-433931539),source], null);
var d__$1 = (cljs.core.truth_(name)?cljs.core.assoc.call(null,d,new cljs.core.Keyword(null,"name","name",1843675177),name):d);
return cljs.core.update_in.call(null,result,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [gline], null),cljs.core.fnil.call(null,(function (m){
return cljs.core.update_in.call(null,m,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [gcol], null),cljs.core.fnil.call(null,(function (p1__2227_SHARP_){
return cljs.core.conj.call(null,p1__2227_SHARP_,d__$1);
}),cljs.core.PersistentVector.EMPTY));
}),cljs.core.sorted_map.call(null)));
});
/**
 * Convert a v3 source map JSON object into a source map mapping
 *   generated JavaScript source locations to the original
 *   ClojureScript.
 */
cljs.source_map.decode = (function cljs$source_map$decode(var_args){
var G__2230 = arguments.length;
switch (G__2230) {
case 1:
return cljs.source_map.decode.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs.source_map.decode.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs.source_map.decode.cljs$core$IFn$_invoke$arity$1 = (function (source_map){
return cljs.source_map.decode.call(null,cljs.source_map.goog$module$goog$object.get.call(null,source_map,"mappings"),source_map);
}));

(cljs.source_map.decode.cljs$core$IFn$_invoke$arity$2 = (function (mappings,source_map){
var sources = cljs.source_map.goog$module$goog$object.get.call(null,source_map,"sources");
var relseg_init = new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [(0),(0),(0),(0),(0)], null);
var lines = cljs.core.seq.call(null,clojure.string.split.call(null,mappings,/;/));
var gline = (0);
var lines__$1 = lines;
var relseg = relseg_init;
var result = cljs.core.PersistentArrayMap.EMPTY;
while(true){
if(lines__$1){
var line = cljs.core.first.call(null,lines__$1);
var vec__2234 = ((clojure.string.blank_QMARK_.call(null,line))?new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [result,relseg], null):(function (){var segs = cljs.core.seq.call(null,clojure.string.split.call(null,line,/,/));
var segs__$1 = segs;
var relseg__$1 = relseg;
var result__$1 = result;
while(true){
if(segs__$1){
var seg = cljs.core.first.call(null,segs__$1);
var nrelseg = cljs.source_map.seg_combine.call(null,cljs.source_map.base64_vlq.decode.call(null,seg),relseg__$1);
var G__2238 = cljs.core.next.call(null,segs__$1);
var G__2239 = nrelseg;
var G__2240 = cljs.source_map.update_result.call(null,result__$1,cljs.source_map.seg__GT_map.call(null,nrelseg,source_map),gline);
segs__$1 = G__2238;
relseg__$1 = G__2239;
result__$1 = G__2240;
continue;
} else {
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [result__$1,relseg__$1], null);
}
break;
}
})());
var result__$1 = cljs.core.nth.call(null,vec__2234,(0),null);
var relseg__$1 = cljs.core.nth.call(null,vec__2234,(1),null);
var G__2241 = (gline + (1));
var G__2242 = cljs.core.next.call(null,lines__$1);
var G__2243 = cljs.core.assoc.call(null,relseg__$1,(0),(0));
var G__2244 = result__$1;
gline = G__2241;
lines__$1 = G__2242;
relseg = G__2243;
result = G__2244;
continue;
} else {
return result;
}
break;
}
}));

(cljs.source_map.decode.cljs$lang$maxFixedArity = 2);

/**
 * Take a nested sorted map encoding line and column information
 * for a file and return a vector of vectors of encoded segments.
 * Each vector represents a line, and the internal vectors are segments
 * representing the contents of the line.
 */
cljs.source_map.lines__GT_segs = (function cljs$source_map$lines__GT_segs(lines){
var relseg = cljs.core.atom.call(null,new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [(0),(0),(0),(0),(0)], null));
return cljs.core.reduce.call(null,(function (segs,cols){
cljs.core.swap_BANG_.call(null,relseg,(function (p__2245){
var vec__2246 = p__2245;
var _ = cljs.core.nth.call(null,vec__2246,(0),null);
var source = cljs.core.nth.call(null,vec__2246,(1),null);
var line = cljs.core.nth.call(null,vec__2246,(2),null);
var col = cljs.core.nth.call(null,vec__2246,(3),null);
var name = cljs.core.nth.call(null,vec__2246,(4),null);
return new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [(0),source,line,col,name], null);
}));

return cljs.core.conj.call(null,segs,cljs.core.reduce.call(null,(function (cols__$1,p__2249){
var vec__2250 = p__2249;
var gcol = cljs.core.nth.call(null,vec__2250,(0),null);
var sidx = cljs.core.nth.call(null,vec__2250,(1),null);
var line = cljs.core.nth.call(null,vec__2250,(2),null);
var col = cljs.core.nth.call(null,vec__2250,(3),null);
var name = cljs.core.nth.call(null,vec__2250,(4),null);
var seg = vec__2250;
var offset = cljs.core.map.call(null,cljs.core._,seg,cljs.core.deref.call(null,relseg));
cljs.core.swap_BANG_.call(null,relseg,(function (p__2253){
var vec__2254 = p__2253;
var _ = cljs.core.nth.call(null,vec__2254,(0),null);
var ___$1 = cljs.core.nth.call(null,vec__2254,(1),null);
var ___$2 = cljs.core.nth.call(null,vec__2254,(2),null);
var ___$3 = cljs.core.nth.call(null,vec__2254,(3),null);
var lname = cljs.core.nth.call(null,vec__2254,(4),null);
return new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [gcol,sidx,line,col,(function (){var or__5043__auto__ = name;
if(cljs.core.truth_(or__5043__auto__)){
return or__5043__auto__;
} else {
return lname;
}
})()], null);
}));

return cljs.core.conj.call(null,cols__$1,cljs.source_map.base64_vlq.encode.call(null,offset));
}),cljs.core.PersistentVector.EMPTY,cols));
}),cljs.core.PersistentVector.EMPTY,lines);
});
/**
 * Take an internal source map representation represented as nested
 * sorted maps of file, line, column and return a source map v3 JSON
 * string.
 */
cljs.source_map.encode = (function cljs$source_map$encode(m,opts){
var lines = cljs.core.atom.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.PersistentVector.EMPTY], null));
var names__GT_idx = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
var name_idx = cljs.core.atom.call(null,(0));
var preamble_lines = cljs.core.take.call(null,(function (){var or__5043__auto__ = new cljs.core.Keyword(null,"preamble-line-count","preamble-line-count",-659949744).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5043__auto__)){
return or__5043__auto__;
} else {
return (0);
}
})(),cljs.core.repeat.call(null,cljs.core.PersistentVector.EMPTY));
var info__GT_segv = (function (info,source_idx,line,col){
var segv = new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"gcol","gcol",309250807).cljs$core$IFn$_invoke$arity$1(info),source_idx,line,col], null);
var temp__5802__auto__ = new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(info);
if(cljs.core.truth_(temp__5802__auto__)){
var name = temp__5802__auto__;
var idx = (function (){var temp__5802__auto____$1 = cljs.core.get.call(null,cljs.core.deref.call(null,names__GT_idx),name);
if(cljs.core.truth_(temp__5802__auto____$1)){
var idx = temp__5802__auto____$1;
return idx;
} else {
var cidx = cljs.core.deref.call(null,name_idx);
cljs.core.swap_BANG_.call(null,names__GT_idx,cljs.core.assoc,name,cidx);

cljs.core.swap_BANG_.call(null,name_idx,cljs.core.inc);

return cidx;
}
})();
return cljs.core.conj.call(null,segv,idx);
} else {
return segv;
}
});
var encode_cols = (function (infos,source_idx,line,col){
var seq__2260 = cljs.core.seq.call(null,infos);
var chunk__2261 = null;
var count__2262 = (0);
var i__2263 = (0);
while(true){
if((i__2263 < count__2262)){
var info = cljs.core._nth.call(null,chunk__2261,i__2263);
var segv_2614 = info__GT_segv.call(null,info,source_idx,line,col);
var gline_2615 = new cljs.core.Keyword(null,"gline","gline",-1086242431).cljs$core$IFn$_invoke$arity$1(info);
var lc_2616 = cljs.core.count.call(null,cljs.core.deref.call(null,lines));
if((gline_2615 > (lc_2616 - (1)))){
cljs.core.swap_BANG_.call(null,lines,((function (seq__2260,chunk__2261,count__2262,i__2263,segv_2614,gline_2615,lc_2616,info,lines,names__GT_idx,name_idx,preamble_lines,info__GT_segv){
return (function (lines__$1){
return cljs.core.conj.call(null,cljs.core.into.call(null,lines__$1,cljs.core.repeat.call(null,((gline_2615 - (lc_2616 - (1))) - (1)),cljs.core.PersistentVector.EMPTY)),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [segv_2614], null));
});})(seq__2260,chunk__2261,count__2262,i__2263,segv_2614,gline_2615,lc_2616,info,lines,names__GT_idx,name_idx,preamble_lines,info__GT_segv))
);
} else {
cljs.core.swap_BANG_.call(null,lines,((function (seq__2260,chunk__2261,count__2262,i__2263,segv_2614,gline_2615,lc_2616,info,lines,names__GT_idx,name_idx,preamble_lines,info__GT_segv){
return (function (lines__$1){
return cljs.core.update_in.call(null,lines__$1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [gline_2615], null),cljs.core.conj,segv_2614);
});})(seq__2260,chunk__2261,count__2262,i__2263,segv_2614,gline_2615,lc_2616,info,lines,names__GT_idx,name_idx,preamble_lines,info__GT_segv))
);
}


var G__2617 = seq__2260;
var G__2618 = chunk__2261;
var G__2619 = count__2262;
var G__2620 = (i__2263 + (1));
seq__2260 = G__2617;
chunk__2261 = G__2618;
count__2262 = G__2619;
i__2263 = G__2620;
continue;
} else {
var temp__5804__auto__ = cljs.core.seq.call(null,seq__2260);
if(temp__5804__auto__){
var seq__2260__$1 = temp__5804__auto__;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__2260__$1)){
var c__5565__auto__ = cljs.core.chunk_first.call(null,seq__2260__$1);
var G__2621 = cljs.core.chunk_rest.call(null,seq__2260__$1);
var G__2622 = c__5565__auto__;
var G__2623 = cljs.core.count.call(null,c__5565__auto__);
var G__2624 = (0);
seq__2260 = G__2621;
chunk__2261 = G__2622;
count__2262 = G__2623;
i__2263 = G__2624;
continue;
} else {
var info = cljs.core.first.call(null,seq__2260__$1);
var segv_2625 = info__GT_segv.call(null,info,source_idx,line,col);
var gline_2626 = new cljs.core.Keyword(null,"gline","gline",-1086242431).cljs$core$IFn$_invoke$arity$1(info);
var lc_2627 = cljs.core.count.call(null,cljs.core.deref.call(null,lines));
if((gline_2626 > (lc_2627 - (1)))){
cljs.core.swap_BANG_.call(null,lines,((function (seq__2260,chunk__2261,count__2262,i__2263,segv_2625,gline_2626,lc_2627,info,seq__2260__$1,temp__5804__auto__,lines,names__GT_idx,name_idx,preamble_lines,info__GT_segv){
return (function (lines__$1){
return cljs.core.conj.call(null,cljs.core.into.call(null,lines__$1,cljs.core.repeat.call(null,((gline_2626 - (lc_2627 - (1))) - (1)),cljs.core.PersistentVector.EMPTY)),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [segv_2625], null));
});})(seq__2260,chunk__2261,count__2262,i__2263,segv_2625,gline_2626,lc_2627,info,seq__2260__$1,temp__5804__auto__,lines,names__GT_idx,name_idx,preamble_lines,info__GT_segv))
);
} else {
cljs.core.swap_BANG_.call(null,lines,((function (seq__2260,chunk__2261,count__2262,i__2263,segv_2625,gline_2626,lc_2627,info,seq__2260__$1,temp__5804__auto__,lines,names__GT_idx,name_idx,preamble_lines,info__GT_segv){
return (function (lines__$1){
return cljs.core.update_in.call(null,lines__$1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [gline_2626], null),cljs.core.conj,segv_2625);
});})(seq__2260,chunk__2261,count__2262,i__2263,segv_2625,gline_2626,lc_2627,info,seq__2260__$1,temp__5804__auto__,lines,names__GT_idx,name_idx,preamble_lines,info__GT_segv))
);
}


var G__2628 = cljs.core.next.call(null,seq__2260__$1);
var G__2629 = null;
var G__2630 = (0);
var G__2631 = (0);
seq__2260 = G__2628;
chunk__2261 = G__2629;
count__2262 = G__2630;
i__2263 = G__2631;
continue;
}
} else {
return null;
}
}
break;
}
});
var seq__2264_2632 = cljs.core.seq.call(null,cljs.core.map_indexed.call(null,((function (lines,names__GT_idx,name_idx,preamble_lines,info__GT_segv,encode_cols){
return (function (i,v){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [i,v], null);
});})(lines,names__GT_idx,name_idx,preamble_lines,info__GT_segv,encode_cols))
,m));
var chunk__2265_2633 = null;
var count__2266_2634 = (0);
var i__2267_2635 = (0);
while(true){
if((i__2267_2635 < count__2266_2634)){
var vec__2440_2636 = cljs.core._nth.call(null,chunk__2265_2633,i__2267_2635);
var source_idx_2637 = cljs.core.nth.call(null,vec__2440_2636,(0),null);
var vec__2443_2638 = cljs.core.nth.call(null,vec__2440_2636,(1),null);
var __2639 = cljs.core.nth.call(null,vec__2443_2638,(0),null);
var lines_2640__$1 = cljs.core.nth.call(null,vec__2443_2638,(1),null);
var seq__2446_2641 = cljs.core.seq.call(null,lines_2640__$1);
var chunk__2447_2642 = null;
var count__2448_2643 = (0);
var i__2449_2644 = (0);
while(true){
if((i__2449_2644 < count__2448_2643)){
var vec__2488_2645 = cljs.core._nth.call(null,chunk__2447_2642,i__2449_2644);
var line_2646 = cljs.core.nth.call(null,vec__2488_2645,(0),null);
var cols_2647 = cljs.core.nth.call(null,vec__2488_2645,(1),null);
var seq__2491_2648 = cljs.core.seq.call(null,cols_2647);
var chunk__2492_2649 = null;
var count__2493_2650 = (0);
var i__2494_2651 = (0);
while(true){
if((i__2494_2651 < count__2493_2650)){
var vec__2501_2652 = cljs.core._nth.call(null,chunk__2492_2649,i__2494_2651);
var col_2653 = cljs.core.nth.call(null,vec__2501_2652,(0),null);
var infos_2654 = cljs.core.nth.call(null,vec__2501_2652,(1),null);
encode_cols.call(null,infos_2654,source_idx_2637,line_2646,col_2653);


var G__2655 = seq__2491_2648;
var G__2656 = chunk__2492_2649;
var G__2657 = count__2493_2650;
var G__2658 = (i__2494_2651 + (1));
seq__2491_2648 = G__2655;
chunk__2492_2649 = G__2656;
count__2493_2650 = G__2657;
i__2494_2651 = G__2658;
continue;
} else {
var temp__5804__auto___2659 = cljs.core.seq.call(null,seq__2491_2648);
if(temp__5804__auto___2659){
var seq__2491_2660__$1 = temp__5804__auto___2659;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__2491_2660__$1)){
var c__5565__auto___2661 = cljs.core.chunk_first.call(null,seq__2491_2660__$1);
var G__2662 = cljs.core.chunk_rest.call(null,seq__2491_2660__$1);
var G__2663 = c__5565__auto___2661;
var G__2664 = cljs.core.count.call(null,c__5565__auto___2661);
var G__2665 = (0);
seq__2491_2648 = G__2662;
chunk__2492_2649 = G__2663;
count__2493_2650 = G__2664;
i__2494_2651 = G__2665;
continue;
} else {
var vec__2504_2666 = cljs.core.first.call(null,seq__2491_2660__$1);
var col_2667 = cljs.core.nth.call(null,vec__2504_2666,(0),null);
var infos_2668 = cljs.core.nth.call(null,vec__2504_2666,(1),null);
encode_cols.call(null,infos_2668,source_idx_2637,line_2646,col_2667);


var G__2669 = cljs.core.next.call(null,seq__2491_2660__$1);
var G__2670 = null;
var G__2671 = (0);
var G__2672 = (0);
seq__2491_2648 = G__2669;
chunk__2492_2649 = G__2670;
count__2493_2650 = G__2671;
i__2494_2651 = G__2672;
continue;
}
} else {
}
}
break;
}


var G__2673 = seq__2446_2641;
var G__2674 = chunk__2447_2642;
var G__2675 = count__2448_2643;
var G__2676 = (i__2449_2644 + (1));
seq__2446_2641 = G__2673;
chunk__2447_2642 = G__2674;
count__2448_2643 = G__2675;
i__2449_2644 = G__2676;
continue;
} else {
var temp__5804__auto___2677 = cljs.core.seq.call(null,seq__2446_2641);
if(temp__5804__auto___2677){
var seq__2446_2678__$1 = temp__5804__auto___2677;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__2446_2678__$1)){
var c__5565__auto___2679 = cljs.core.chunk_first.call(null,seq__2446_2678__$1);
var G__2680 = cljs.core.chunk_rest.call(null,seq__2446_2678__$1);
var G__2681 = c__5565__auto___2679;
var G__2682 = cljs.core.count.call(null,c__5565__auto___2679);
var G__2683 = (0);
seq__2446_2641 = G__2680;
chunk__2447_2642 = G__2681;
count__2448_2643 = G__2682;
i__2449_2644 = G__2683;
continue;
} else {
var vec__2507_2684 = cljs.core.first.call(null,seq__2446_2678__$1);
var line_2685 = cljs.core.nth.call(null,vec__2507_2684,(0),null);
var cols_2686 = cljs.core.nth.call(null,vec__2507_2684,(1),null);
var seq__2510_2687 = cljs.core.seq.call(null,cols_2686);
var chunk__2511_2688 = null;
var count__2512_2689 = (0);
var i__2513_2690 = (0);
while(true){
if((i__2513_2690 < count__2512_2689)){
var vec__2520_2691 = cljs.core._nth.call(null,chunk__2511_2688,i__2513_2690);
var col_2692 = cljs.core.nth.call(null,vec__2520_2691,(0),null);
var infos_2693 = cljs.core.nth.call(null,vec__2520_2691,(1),null);
encode_cols.call(null,infos_2693,source_idx_2637,line_2685,col_2692);


var G__2694 = seq__2510_2687;
var G__2695 = chunk__2511_2688;
var G__2696 = count__2512_2689;
var G__2697 = (i__2513_2690 + (1));
seq__2510_2687 = G__2694;
chunk__2511_2688 = G__2695;
count__2512_2689 = G__2696;
i__2513_2690 = G__2697;
continue;
} else {
var temp__5804__auto___2698__$1 = cljs.core.seq.call(null,seq__2510_2687);
if(temp__5804__auto___2698__$1){
var seq__2510_2699__$1 = temp__5804__auto___2698__$1;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__2510_2699__$1)){
var c__5565__auto___2700 = cljs.core.chunk_first.call(null,seq__2510_2699__$1);
var G__2701 = cljs.core.chunk_rest.call(null,seq__2510_2699__$1);
var G__2702 = c__5565__auto___2700;
var G__2703 = cljs.core.count.call(null,c__5565__auto___2700);
var G__2704 = (0);
seq__2510_2687 = G__2701;
chunk__2511_2688 = G__2702;
count__2512_2689 = G__2703;
i__2513_2690 = G__2704;
continue;
} else {
var vec__2523_2705 = cljs.core.first.call(null,seq__2510_2699__$1);
var col_2706 = cljs.core.nth.call(null,vec__2523_2705,(0),null);
var infos_2707 = cljs.core.nth.call(null,vec__2523_2705,(1),null);
encode_cols.call(null,infos_2707,source_idx_2637,line_2685,col_2706);


var G__2708 = cljs.core.next.call(null,seq__2510_2699__$1);
var G__2709 = null;
var G__2710 = (0);
var G__2711 = (0);
seq__2510_2687 = G__2708;
chunk__2511_2688 = G__2709;
count__2512_2689 = G__2710;
i__2513_2690 = G__2711;
continue;
}
} else {
}
}
break;
}


var G__2712 = cljs.core.next.call(null,seq__2446_2678__$1);
var G__2713 = null;
var G__2714 = (0);
var G__2715 = (0);
seq__2446_2641 = G__2712;
chunk__2447_2642 = G__2713;
count__2448_2643 = G__2714;
i__2449_2644 = G__2715;
continue;
}
} else {
}
}
break;
}


var G__2716 = seq__2264_2632;
var G__2717 = chunk__2265_2633;
var G__2718 = count__2266_2634;
var G__2719 = (i__2267_2635 + (1));
seq__2264_2632 = G__2716;
chunk__2265_2633 = G__2717;
count__2266_2634 = G__2718;
i__2267_2635 = G__2719;
continue;
} else {
var temp__5804__auto___2720 = cljs.core.seq.call(null,seq__2264_2632);
if(temp__5804__auto___2720){
var seq__2264_2721__$1 = temp__5804__auto___2720;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__2264_2721__$1)){
var c__5565__auto___2722 = cljs.core.chunk_first.call(null,seq__2264_2721__$1);
var G__2723 = cljs.core.chunk_rest.call(null,seq__2264_2721__$1);
var G__2724 = c__5565__auto___2722;
var G__2725 = cljs.core.count.call(null,c__5565__auto___2722);
var G__2726 = (0);
seq__2264_2632 = G__2723;
chunk__2265_2633 = G__2724;
count__2266_2634 = G__2725;
i__2267_2635 = G__2726;
continue;
} else {
var vec__2526_2727 = cljs.core.first.call(null,seq__2264_2721__$1);
var source_idx_2728 = cljs.core.nth.call(null,vec__2526_2727,(0),null);
var vec__2529_2729 = cljs.core.nth.call(null,vec__2526_2727,(1),null);
var __2730 = cljs.core.nth.call(null,vec__2529_2729,(0),null);
var lines_2731__$1 = cljs.core.nth.call(null,vec__2529_2729,(1),null);
var seq__2532_2732 = cljs.core.seq.call(null,lines_2731__$1);
var chunk__2533_2733 = null;
var count__2534_2734 = (0);
var i__2535_2735 = (0);
while(true){
if((i__2535_2735 < count__2534_2734)){
var vec__2574_2736 = cljs.core._nth.call(null,chunk__2533_2733,i__2535_2735);
var line_2737 = cljs.core.nth.call(null,vec__2574_2736,(0),null);
var cols_2738 = cljs.core.nth.call(null,vec__2574_2736,(1),null);
var seq__2577_2739 = cljs.core.seq.call(null,cols_2738);
var chunk__2578_2740 = null;
var count__2579_2741 = (0);
var i__2580_2742 = (0);
while(true){
if((i__2580_2742 < count__2579_2741)){
var vec__2587_2743 = cljs.core._nth.call(null,chunk__2578_2740,i__2580_2742);
var col_2744 = cljs.core.nth.call(null,vec__2587_2743,(0),null);
var infos_2745 = cljs.core.nth.call(null,vec__2587_2743,(1),null);
encode_cols.call(null,infos_2745,source_idx_2728,line_2737,col_2744);


var G__2746 = seq__2577_2739;
var G__2747 = chunk__2578_2740;
var G__2748 = count__2579_2741;
var G__2749 = (i__2580_2742 + (1));
seq__2577_2739 = G__2746;
chunk__2578_2740 = G__2747;
count__2579_2741 = G__2748;
i__2580_2742 = G__2749;
continue;
} else {
var temp__5804__auto___2750__$1 = cljs.core.seq.call(null,seq__2577_2739);
if(temp__5804__auto___2750__$1){
var seq__2577_2751__$1 = temp__5804__auto___2750__$1;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__2577_2751__$1)){
var c__5565__auto___2752 = cljs.core.chunk_first.call(null,seq__2577_2751__$1);
var G__2753 = cljs.core.chunk_rest.call(null,seq__2577_2751__$1);
var G__2754 = c__5565__auto___2752;
var G__2755 = cljs.core.count.call(null,c__5565__auto___2752);
var G__2756 = (0);
seq__2577_2739 = G__2753;
chunk__2578_2740 = G__2754;
count__2579_2741 = G__2755;
i__2580_2742 = G__2756;
continue;
} else {
var vec__2590_2757 = cljs.core.first.call(null,seq__2577_2751__$1);
var col_2758 = cljs.core.nth.call(null,vec__2590_2757,(0),null);
var infos_2759 = cljs.core.nth.call(null,vec__2590_2757,(1),null);
encode_cols.call(null,infos_2759,source_idx_2728,line_2737,col_2758);


var G__2760 = cljs.core.next.call(null,seq__2577_2751__$1);
var G__2761 = null;
var G__2762 = (0);
var G__2763 = (0);
seq__2577_2739 = G__2760;
chunk__2578_2740 = G__2761;
count__2579_2741 = G__2762;
i__2580_2742 = G__2763;
continue;
}
} else {
}
}
break;
}


var G__2764 = seq__2532_2732;
var G__2765 = chunk__2533_2733;
var G__2766 = count__2534_2734;
var G__2767 = (i__2535_2735 + (1));
seq__2532_2732 = G__2764;
chunk__2533_2733 = G__2765;
count__2534_2734 = G__2766;
i__2535_2735 = G__2767;
continue;
} else {
var temp__5804__auto___2768__$1 = cljs.core.seq.call(null,seq__2532_2732);
if(temp__5804__auto___2768__$1){
var seq__2532_2769__$1 = temp__5804__auto___2768__$1;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__2532_2769__$1)){
var c__5565__auto___2770 = cljs.core.chunk_first.call(null,seq__2532_2769__$1);
var G__2771 = cljs.core.chunk_rest.call(null,seq__2532_2769__$1);
var G__2772 = c__5565__auto___2770;
var G__2773 = cljs.core.count.call(null,c__5565__auto___2770);
var G__2774 = (0);
seq__2532_2732 = G__2771;
chunk__2533_2733 = G__2772;
count__2534_2734 = G__2773;
i__2535_2735 = G__2774;
continue;
} else {
var vec__2593_2775 = cljs.core.first.call(null,seq__2532_2769__$1);
var line_2776 = cljs.core.nth.call(null,vec__2593_2775,(0),null);
var cols_2777 = cljs.core.nth.call(null,vec__2593_2775,(1),null);
var seq__2596_2778 = cljs.core.seq.call(null,cols_2777);
var chunk__2597_2779 = null;
var count__2598_2780 = (0);
var i__2599_2781 = (0);
while(true){
if((i__2599_2781 < count__2598_2780)){
var vec__2606_2782 = cljs.core._nth.call(null,chunk__2597_2779,i__2599_2781);
var col_2783 = cljs.core.nth.call(null,vec__2606_2782,(0),null);
var infos_2784 = cljs.core.nth.call(null,vec__2606_2782,(1),null);
encode_cols.call(null,infos_2784,source_idx_2728,line_2776,col_2783);


var G__2785 = seq__2596_2778;
var G__2786 = chunk__2597_2779;
var G__2787 = count__2598_2780;
var G__2788 = (i__2599_2781 + (1));
seq__2596_2778 = G__2785;
chunk__2597_2779 = G__2786;
count__2598_2780 = G__2787;
i__2599_2781 = G__2788;
continue;
} else {
var temp__5804__auto___2789__$2 = cljs.core.seq.call(null,seq__2596_2778);
if(temp__5804__auto___2789__$2){
var seq__2596_2790__$1 = temp__5804__auto___2789__$2;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__2596_2790__$1)){
var c__5565__auto___2791 = cljs.core.chunk_first.call(null,seq__2596_2790__$1);
var G__2792 = cljs.core.chunk_rest.call(null,seq__2596_2790__$1);
var G__2793 = c__5565__auto___2791;
var G__2794 = cljs.core.count.call(null,c__5565__auto___2791);
var G__2795 = (0);
seq__2596_2778 = G__2792;
chunk__2597_2779 = G__2793;
count__2598_2780 = G__2794;
i__2599_2781 = G__2795;
continue;
} else {
var vec__2609_2796 = cljs.core.first.call(null,seq__2596_2790__$1);
var col_2797 = cljs.core.nth.call(null,vec__2609_2796,(0),null);
var infos_2798 = cljs.core.nth.call(null,vec__2609_2796,(1),null);
encode_cols.call(null,infos_2798,source_idx_2728,line_2776,col_2797);


var G__2799 = cljs.core.next.call(null,seq__2596_2790__$1);
var G__2800 = null;
var G__2801 = (0);
var G__2802 = (0);
seq__2596_2778 = G__2799;
chunk__2597_2779 = G__2800;
count__2598_2780 = G__2801;
i__2599_2781 = G__2802;
continue;
}
} else {
}
}
break;
}


var G__2803 = cljs.core.next.call(null,seq__2532_2769__$1);
var G__2804 = null;
var G__2805 = (0);
var G__2806 = (0);
seq__2532_2732 = G__2803;
chunk__2533_2733 = G__2804;
count__2534_2734 = G__2805;
i__2535_2735 = G__2806;
continue;
}
} else {
}
}
break;
}


var G__2807 = cljs.core.next.call(null,seq__2264_2721__$1);
var G__2808 = null;
var G__2809 = (0);
var G__2810 = (0);
seq__2264_2632 = G__2807;
chunk__2265_2633 = G__2808;
count__2266_2634 = G__2809;
i__2267_2635 = G__2810;
continue;
}
} else {
}
}
break;
}

var source_map_file_contents = (function (){var G__2612 = ({"version": (3), "file": new cljs.core.Keyword(null,"file","file",-1269645878).cljs$core$IFn$_invoke$arity$1(opts), "sources": (function (){var paths = cljs.core.keys.call(null,m);
var f = cljs.core.comp.call(null,((new cljs.core.Keyword(null,"source-map-timestamp","source-map-timestamp",1973015633).cljs$core$IFn$_invoke$arity$1(opts) === true)?(function (p1__2257_SHARP_){
return [cljs.core.str.cljs$core$IFn$_invoke$arity$1(p1__2257_SHARP_),"?rel=",cljs.core.str.cljs$core$IFn$_invoke$arity$1((new Date()).valueOf())].join('');
}):cljs.core.identity),(function (p1__2258_SHARP_){
return cljs.core.last.call(null,clojure.string.split.call(null,p1__2258_SHARP_,/\//));
}));
return cljs.core.into_array.call(null,cljs.core.map.call(null,f,paths));
})(), "lineCount": new cljs.core.Keyword(null,"lines","lines",-700165781).cljs$core$IFn$_invoke$arity$1(opts), "mappings": clojure.string.join.call(null,";",cljs.core.map.call(null,(function (p1__2259_SHARP_){
return clojure.string.join.call(null,",",p1__2259_SHARP_);
}),cljs.source_map.lines__GT_segs.call(null,cljs.core.concat.call(null,preamble_lines,cljs.core.deref.call(null,lines))))), "names": cljs.core.into_array.call(null,cljs.core.map.call(null,clojure.set.map_invert.call(null,cljs.core.deref.call(null,names__GT_idx)),cljs.core.range.call(null,cljs.core.count.call(null,cljs.core.deref.call(null,names__GT_idx)))))});
if(cljs.core.truth_(new cljs.core.Keyword(null,"sources-content","sources-content",1729970239).cljs$core$IFn$_invoke$arity$1(opts))){
var G__2613 = G__2612;
cljs.source_map.goog$module$goog$object.set.call(null,G__2613,"sourcesContent",cljs.core.into_array.call(null,new cljs.core.Keyword(null,"sources-content","sources-content",1729970239).cljs$core$IFn$_invoke$arity$1(opts)));

return G__2613;
} else {
return G__2612;
}
})();
return JSON.stringify(source_map_file_contents);
});
/**
 * Merge an internal source map representation of a single
 * ClojureScript file mapping original to generated with a
 * second source map mapping original JS to generated JS.
 * The is to support source maps that work through multiple
 * compilation steps like Google Closure optimization passes.
 */
cljs.source_map.merge_source_maps = (function cljs$source_map$merge_source_maps(cljs_map,js_map){
var line_map_seq = cljs.core.seq.call(null,cljs_map);
var new_lines = cljs.core.sorted_map.call(null);
while(true){
if(line_map_seq){
var vec__2811 = cljs.core.first.call(null,line_map_seq);
var line = cljs.core.nth.call(null,vec__2811,(0),null);
var col_map = cljs.core.nth.call(null,vec__2811,(1),null);
var new_cols = (function (){var col_map_seq = cljs.core.seq.call(null,col_map);
var new_cols = cljs.core.sorted_map.call(null);
while(true){
if(col_map_seq){
var vec__2814 = cljs.core.first.call(null,col_map_seq);
var col = cljs.core.nth.call(null,vec__2814,(0),null);
var infos = cljs.core.nth.call(null,vec__2814,(1),null);
var G__2819 = cljs.core.next.call(null,col_map_seq);
var G__2820 = cljs.core.assoc.call(null,new_cols,col,cljs.core.reduce.call(null,((function (col_map_seq,new_cols,line_map_seq,new_lines,vec__2814,col,infos,vec__2811,line,col_map){
return (function (v,p__2817){
var map__2818 = p__2817;
var map__2818__$1 = cljs.core.__destructure_map.call(null,map__2818);
var gline = cljs.core.get.call(null,map__2818__$1,new cljs.core.Keyword(null,"gline","gline",-1086242431));
var gcol = cljs.core.get.call(null,map__2818__$1,new cljs.core.Keyword(null,"gcol","gcol",309250807));
return cljs.core.into.call(null,v,cljs.core.get_in.call(null,js_map,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [gline,gcol], null)));
});})(col_map_seq,new_cols,line_map_seq,new_lines,vec__2814,col,infos,vec__2811,line,col_map))
,cljs.core.PersistentVector.EMPTY,infos));
col_map_seq = G__2819;
new_cols = G__2820;
continue;
} else {
return new_cols;
}
break;
}
})();
var G__2821 = cljs.core.next.call(null,line_map_seq);
var G__2822 = cljs.core.assoc.call(null,new_lines,line,new_cols);
line_map_seq = G__2821;
new_lines = G__2822;
continue;
} else {
return new_lines;
}
break;
}
});
/**
 * Given a ClojureScript to JavaScript source map, invert it. Useful when
 * mapping JavaScript stack traces when environment support is unavailable.
 */
cljs.source_map.invert_reverse_map = (function cljs$source_map$invert_reverse_map(reverse_map){
var inverted = cljs.core.atom.call(null,cljs.core.sorted_map.call(null));
var seq__2823_3031 = cljs.core.seq.call(null,reverse_map);
var chunk__2824_3032 = null;
var count__2825_3033 = (0);
var i__2826_3034 = (0);
while(true){
if((i__2826_3034 < count__2825_3033)){
var vec__2929_3035 = cljs.core._nth.call(null,chunk__2824_3032,i__2826_3034);
var line_3036 = cljs.core.nth.call(null,vec__2929_3035,(0),null);
var columns_3037 = cljs.core.nth.call(null,vec__2929_3035,(1),null);
var seq__2932_3038 = cljs.core.seq.call(null,columns_3037);
var chunk__2933_3039 = null;
var count__2934_3040 = (0);
var i__2935_3041 = (0);
while(true){
if((i__2935_3041 < count__2934_3040)){
var vec__2958_3042 = cljs.core._nth.call(null,chunk__2933_3039,i__2935_3041);
var column_3043 = cljs.core.nth.call(null,vec__2958_3042,(0),null);
var column_info_3044 = cljs.core.nth.call(null,vec__2958_3042,(1),null);
var seq__2961_3045 = cljs.core.seq.call(null,column_info_3044);
var chunk__2962_3046 = null;
var count__2963_3047 = (0);
var i__2964_3048 = (0);
while(true){
if((i__2964_3048 < count__2963_3047)){
var map__2967_3049 = cljs.core._nth.call(null,chunk__2962_3046,i__2964_3048);
var map__2967_3050__$1 = cljs.core.__destructure_map.call(null,map__2967_3049);
var gline_3051 = cljs.core.get.call(null,map__2967_3050__$1,new cljs.core.Keyword(null,"gline","gline",-1086242431));
var gcol_3052 = cljs.core.get.call(null,map__2967_3050__$1,new cljs.core.Keyword(null,"gcol","gcol",309250807));
var name_3053 = cljs.core.get.call(null,map__2967_3050__$1,new cljs.core.Keyword(null,"name","name",1843675177));
cljs.core.swap_BANG_.call(null,inverted,cljs.core.update_in,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [gline_3051], null),cljs.core.fnil.call(null,((function (seq__2961_3045,chunk__2962_3046,count__2963_3047,i__2964_3048,seq__2932_3038,chunk__2933_3039,count__2934_3040,i__2935_3041,seq__2823_3031,chunk__2824_3032,count__2825_3033,i__2826_3034,map__2967_3049,map__2967_3050__$1,gline_3051,gcol_3052,name_3053,vec__2958_3042,column_3043,column_info_3044,vec__2929_3035,line_3036,columns_3037,inverted){
return (function (columns__$1){
return cljs.core.update_in.call(null,columns__$1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [gcol_3052], null),cljs.core.fnil.call(null,cljs.core.conj,cljs.core.PersistentVector.EMPTY),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"line","line",212345235),line_3036,new cljs.core.Keyword(null,"col","col",-1959363084),column_3043,new cljs.core.Keyword(null,"name","name",1843675177),name_3053], null));
});})(seq__2961_3045,chunk__2962_3046,count__2963_3047,i__2964_3048,seq__2932_3038,chunk__2933_3039,count__2934_3040,i__2935_3041,seq__2823_3031,chunk__2824_3032,count__2825_3033,i__2826_3034,map__2967_3049,map__2967_3050__$1,gline_3051,gcol_3052,name_3053,vec__2958_3042,column_3043,column_info_3044,vec__2929_3035,line_3036,columns_3037,inverted))
,cljs.core.sorted_map.call(null)));


var G__3054 = seq__2961_3045;
var G__3055 = chunk__2962_3046;
var G__3056 = count__2963_3047;
var G__3057 = (i__2964_3048 + (1));
seq__2961_3045 = G__3054;
chunk__2962_3046 = G__3055;
count__2963_3047 = G__3056;
i__2964_3048 = G__3057;
continue;
} else {
var temp__5804__auto___3058 = cljs.core.seq.call(null,seq__2961_3045);
if(temp__5804__auto___3058){
var seq__2961_3059__$1 = temp__5804__auto___3058;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__2961_3059__$1)){
var c__5565__auto___3060 = cljs.core.chunk_first.call(null,seq__2961_3059__$1);
var G__3061 = cljs.core.chunk_rest.call(null,seq__2961_3059__$1);
var G__3062 = c__5565__auto___3060;
var G__3063 = cljs.core.count.call(null,c__5565__auto___3060);
var G__3064 = (0);
seq__2961_3045 = G__3061;
chunk__2962_3046 = G__3062;
count__2963_3047 = G__3063;
i__2964_3048 = G__3064;
continue;
} else {
var map__2968_3065 = cljs.core.first.call(null,seq__2961_3059__$1);
var map__2968_3066__$1 = cljs.core.__destructure_map.call(null,map__2968_3065);
var gline_3067 = cljs.core.get.call(null,map__2968_3066__$1,new cljs.core.Keyword(null,"gline","gline",-1086242431));
var gcol_3068 = cljs.core.get.call(null,map__2968_3066__$1,new cljs.core.Keyword(null,"gcol","gcol",309250807));
var name_3069 = cljs.core.get.call(null,map__2968_3066__$1,new cljs.core.Keyword(null,"name","name",1843675177));
cljs.core.swap_BANG_.call(null,inverted,cljs.core.update_in,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [gline_3067], null),cljs.core.fnil.call(null,((function (seq__2961_3045,chunk__2962_3046,count__2963_3047,i__2964_3048,seq__2932_3038,chunk__2933_3039,count__2934_3040,i__2935_3041,seq__2823_3031,chunk__2824_3032,count__2825_3033,i__2826_3034,map__2968_3065,map__2968_3066__$1,gline_3067,gcol_3068,name_3069,seq__2961_3059__$1,temp__5804__auto___3058,vec__2958_3042,column_3043,column_info_3044,vec__2929_3035,line_3036,columns_3037,inverted){
return (function (columns__$1){
return cljs.core.update_in.call(null,columns__$1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [gcol_3068], null),cljs.core.fnil.call(null,cljs.core.conj,cljs.core.PersistentVector.EMPTY),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"line","line",212345235),line_3036,new cljs.core.Keyword(null,"col","col",-1959363084),column_3043,new cljs.core.Keyword(null,"name","name",1843675177),name_3069], null));
});})(seq__2961_3045,chunk__2962_3046,count__2963_3047,i__2964_3048,seq__2932_3038,chunk__2933_3039,count__2934_3040,i__2935_3041,seq__2823_3031,chunk__2824_3032,count__2825_3033,i__2826_3034,map__2968_3065,map__2968_3066__$1,gline_3067,gcol_3068,name_3069,seq__2961_3059__$1,temp__5804__auto___3058,vec__2958_3042,column_3043,column_info_3044,vec__2929_3035,line_3036,columns_3037,inverted))
,cljs.core.sorted_map.call(null)));


var G__3070 = cljs.core.next.call(null,seq__2961_3059__$1);
var G__3071 = null;
var G__3072 = (0);
var G__3073 = (0);
seq__2961_3045 = G__3070;
chunk__2962_3046 = G__3071;
count__2963_3047 = G__3072;
i__2964_3048 = G__3073;
continue;
}
} else {
}
}
break;
}


var G__3074 = seq__2932_3038;
var G__3075 = chunk__2933_3039;
var G__3076 = count__2934_3040;
var G__3077 = (i__2935_3041 + (1));
seq__2932_3038 = G__3074;
chunk__2933_3039 = G__3075;
count__2934_3040 = G__3076;
i__2935_3041 = G__3077;
continue;
} else {
var temp__5804__auto___3078 = cljs.core.seq.call(null,seq__2932_3038);
if(temp__5804__auto___3078){
var seq__2932_3079__$1 = temp__5804__auto___3078;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__2932_3079__$1)){
var c__5565__auto___3080 = cljs.core.chunk_first.call(null,seq__2932_3079__$1);
var G__3081 = cljs.core.chunk_rest.call(null,seq__2932_3079__$1);
var G__3082 = c__5565__auto___3080;
var G__3083 = cljs.core.count.call(null,c__5565__auto___3080);
var G__3084 = (0);
seq__2932_3038 = G__3081;
chunk__2933_3039 = G__3082;
count__2934_3040 = G__3083;
i__2935_3041 = G__3084;
continue;
} else {
var vec__2969_3085 = cljs.core.first.call(null,seq__2932_3079__$1);
var column_3086 = cljs.core.nth.call(null,vec__2969_3085,(0),null);
var column_info_3087 = cljs.core.nth.call(null,vec__2969_3085,(1),null);
var seq__2972_3088 = cljs.core.seq.call(null,column_info_3087);
var chunk__2973_3089 = null;
var count__2974_3090 = (0);
var i__2975_3091 = (0);
while(true){
if((i__2975_3091 < count__2974_3090)){
var map__2978_3092 = cljs.core._nth.call(null,chunk__2973_3089,i__2975_3091);
var map__2978_3093__$1 = cljs.core.__destructure_map.call(null,map__2978_3092);
var gline_3094 = cljs.core.get.call(null,map__2978_3093__$1,new cljs.core.Keyword(null,"gline","gline",-1086242431));
var gcol_3095 = cljs.core.get.call(null,map__2978_3093__$1,new cljs.core.Keyword(null,"gcol","gcol",309250807));
var name_3096 = cljs.core.get.call(null,map__2978_3093__$1,new cljs.core.Keyword(null,"name","name",1843675177));
cljs.core.swap_BANG_.call(null,inverted,cljs.core.update_in,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [gline_3094], null),cljs.core.fnil.call(null,((function (seq__2972_3088,chunk__2973_3089,count__2974_3090,i__2975_3091,seq__2932_3038,chunk__2933_3039,count__2934_3040,i__2935_3041,seq__2823_3031,chunk__2824_3032,count__2825_3033,i__2826_3034,map__2978_3092,map__2978_3093__$1,gline_3094,gcol_3095,name_3096,vec__2969_3085,column_3086,column_info_3087,seq__2932_3079__$1,temp__5804__auto___3078,vec__2929_3035,line_3036,columns_3037,inverted){
return (function (columns__$1){
return cljs.core.update_in.call(null,columns__$1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [gcol_3095], null),cljs.core.fnil.call(null,cljs.core.conj,cljs.core.PersistentVector.EMPTY),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"line","line",212345235),line_3036,new cljs.core.Keyword(null,"col","col",-1959363084),column_3086,new cljs.core.Keyword(null,"name","name",1843675177),name_3096], null));
});})(seq__2972_3088,chunk__2973_3089,count__2974_3090,i__2975_3091,seq__2932_3038,chunk__2933_3039,count__2934_3040,i__2935_3041,seq__2823_3031,chunk__2824_3032,count__2825_3033,i__2826_3034,map__2978_3092,map__2978_3093__$1,gline_3094,gcol_3095,name_3096,vec__2969_3085,column_3086,column_info_3087,seq__2932_3079__$1,temp__5804__auto___3078,vec__2929_3035,line_3036,columns_3037,inverted))
,cljs.core.sorted_map.call(null)));


var G__3097 = seq__2972_3088;
var G__3098 = chunk__2973_3089;
var G__3099 = count__2974_3090;
var G__3100 = (i__2975_3091 + (1));
seq__2972_3088 = G__3097;
chunk__2973_3089 = G__3098;
count__2974_3090 = G__3099;
i__2975_3091 = G__3100;
continue;
} else {
var temp__5804__auto___3101__$1 = cljs.core.seq.call(null,seq__2972_3088);
if(temp__5804__auto___3101__$1){
var seq__2972_3102__$1 = temp__5804__auto___3101__$1;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__2972_3102__$1)){
var c__5565__auto___3103 = cljs.core.chunk_first.call(null,seq__2972_3102__$1);
var G__3104 = cljs.core.chunk_rest.call(null,seq__2972_3102__$1);
var G__3105 = c__5565__auto___3103;
var G__3106 = cljs.core.count.call(null,c__5565__auto___3103);
var G__3107 = (0);
seq__2972_3088 = G__3104;
chunk__2973_3089 = G__3105;
count__2974_3090 = G__3106;
i__2975_3091 = G__3107;
continue;
} else {
var map__2979_3108 = cljs.core.first.call(null,seq__2972_3102__$1);
var map__2979_3109__$1 = cljs.core.__destructure_map.call(null,map__2979_3108);
var gline_3110 = cljs.core.get.call(null,map__2979_3109__$1,new cljs.core.Keyword(null,"gline","gline",-1086242431));
var gcol_3111 = cljs.core.get.call(null,map__2979_3109__$1,new cljs.core.Keyword(null,"gcol","gcol",309250807));
var name_3112 = cljs.core.get.call(null,map__2979_3109__$1,new cljs.core.Keyword(null,"name","name",1843675177));
cljs.core.swap_BANG_.call(null,inverted,cljs.core.update_in,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [gline_3110], null),cljs.core.fnil.call(null,((function (seq__2972_3088,chunk__2973_3089,count__2974_3090,i__2975_3091,seq__2932_3038,chunk__2933_3039,count__2934_3040,i__2935_3041,seq__2823_3031,chunk__2824_3032,count__2825_3033,i__2826_3034,map__2979_3108,map__2979_3109__$1,gline_3110,gcol_3111,name_3112,seq__2972_3102__$1,temp__5804__auto___3101__$1,vec__2969_3085,column_3086,column_info_3087,seq__2932_3079__$1,temp__5804__auto___3078,vec__2929_3035,line_3036,columns_3037,inverted){
return (function (columns__$1){
return cljs.core.update_in.call(null,columns__$1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [gcol_3111], null),cljs.core.fnil.call(null,cljs.core.conj,cljs.core.PersistentVector.EMPTY),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"line","line",212345235),line_3036,new cljs.core.Keyword(null,"col","col",-1959363084),column_3086,new cljs.core.Keyword(null,"name","name",1843675177),name_3112], null));
});})(seq__2972_3088,chunk__2973_3089,count__2974_3090,i__2975_3091,seq__2932_3038,chunk__2933_3039,count__2934_3040,i__2935_3041,seq__2823_3031,chunk__2824_3032,count__2825_3033,i__2826_3034,map__2979_3108,map__2979_3109__$1,gline_3110,gcol_3111,name_3112,seq__2972_3102__$1,temp__5804__auto___3101__$1,vec__2969_3085,column_3086,column_info_3087,seq__2932_3079__$1,temp__5804__auto___3078,vec__2929_3035,line_3036,columns_3037,inverted))
,cljs.core.sorted_map.call(null)));


var G__3113 = cljs.core.next.call(null,seq__2972_3102__$1);
var G__3114 = null;
var G__3115 = (0);
var G__3116 = (0);
seq__2972_3088 = G__3113;
chunk__2973_3089 = G__3114;
count__2974_3090 = G__3115;
i__2975_3091 = G__3116;
continue;
}
} else {
}
}
break;
}


var G__3117 = cljs.core.next.call(null,seq__2932_3079__$1);
var G__3118 = null;
var G__3119 = (0);
var G__3120 = (0);
seq__2932_3038 = G__3117;
chunk__2933_3039 = G__3118;
count__2934_3040 = G__3119;
i__2935_3041 = G__3120;
continue;
}
} else {
}
}
break;
}


var G__3121 = seq__2823_3031;
var G__3122 = chunk__2824_3032;
var G__3123 = count__2825_3033;
var G__3124 = (i__2826_3034 + (1));
seq__2823_3031 = G__3121;
chunk__2824_3032 = G__3122;
count__2825_3033 = G__3123;
i__2826_3034 = G__3124;
continue;
} else {
var temp__5804__auto___3125 = cljs.core.seq.call(null,seq__2823_3031);
if(temp__5804__auto___3125){
var seq__2823_3126__$1 = temp__5804__auto___3125;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__2823_3126__$1)){
var c__5565__auto___3127 = cljs.core.chunk_first.call(null,seq__2823_3126__$1);
var G__3128 = cljs.core.chunk_rest.call(null,seq__2823_3126__$1);
var G__3129 = c__5565__auto___3127;
var G__3130 = cljs.core.count.call(null,c__5565__auto___3127);
var G__3131 = (0);
seq__2823_3031 = G__3128;
chunk__2824_3032 = G__3129;
count__2825_3033 = G__3130;
i__2826_3034 = G__3131;
continue;
} else {
var vec__2980_3132 = cljs.core.first.call(null,seq__2823_3126__$1);
var line_3133 = cljs.core.nth.call(null,vec__2980_3132,(0),null);
var columns_3134 = cljs.core.nth.call(null,vec__2980_3132,(1),null);
var seq__2983_3135 = cljs.core.seq.call(null,columns_3134);
var chunk__2984_3136 = null;
var count__2985_3137 = (0);
var i__2986_3138 = (0);
while(true){
if((i__2986_3138 < count__2985_3137)){
var vec__3009_3139 = cljs.core._nth.call(null,chunk__2984_3136,i__2986_3138);
var column_3140 = cljs.core.nth.call(null,vec__3009_3139,(0),null);
var column_info_3141 = cljs.core.nth.call(null,vec__3009_3139,(1),null);
var seq__3012_3142 = cljs.core.seq.call(null,column_info_3141);
var chunk__3013_3143 = null;
var count__3014_3144 = (0);
var i__3015_3145 = (0);
while(true){
if((i__3015_3145 < count__3014_3144)){
var map__3018_3146 = cljs.core._nth.call(null,chunk__3013_3143,i__3015_3145);
var map__3018_3147__$1 = cljs.core.__destructure_map.call(null,map__3018_3146);
var gline_3148 = cljs.core.get.call(null,map__3018_3147__$1,new cljs.core.Keyword(null,"gline","gline",-1086242431));
var gcol_3149 = cljs.core.get.call(null,map__3018_3147__$1,new cljs.core.Keyword(null,"gcol","gcol",309250807));
var name_3150 = cljs.core.get.call(null,map__3018_3147__$1,new cljs.core.Keyword(null,"name","name",1843675177));
cljs.core.swap_BANG_.call(null,inverted,cljs.core.update_in,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [gline_3148], null),cljs.core.fnil.call(null,((function (seq__3012_3142,chunk__3013_3143,count__3014_3144,i__3015_3145,seq__2983_3135,chunk__2984_3136,count__2985_3137,i__2986_3138,seq__2823_3031,chunk__2824_3032,count__2825_3033,i__2826_3034,map__3018_3146,map__3018_3147__$1,gline_3148,gcol_3149,name_3150,vec__3009_3139,column_3140,column_info_3141,vec__2980_3132,line_3133,columns_3134,seq__2823_3126__$1,temp__5804__auto___3125,inverted){
return (function (columns__$1){
return cljs.core.update_in.call(null,columns__$1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [gcol_3149], null),cljs.core.fnil.call(null,cljs.core.conj,cljs.core.PersistentVector.EMPTY),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"line","line",212345235),line_3133,new cljs.core.Keyword(null,"col","col",-1959363084),column_3140,new cljs.core.Keyword(null,"name","name",1843675177),name_3150], null));
});})(seq__3012_3142,chunk__3013_3143,count__3014_3144,i__3015_3145,seq__2983_3135,chunk__2984_3136,count__2985_3137,i__2986_3138,seq__2823_3031,chunk__2824_3032,count__2825_3033,i__2826_3034,map__3018_3146,map__3018_3147__$1,gline_3148,gcol_3149,name_3150,vec__3009_3139,column_3140,column_info_3141,vec__2980_3132,line_3133,columns_3134,seq__2823_3126__$1,temp__5804__auto___3125,inverted))
,cljs.core.sorted_map.call(null)));


var G__3151 = seq__3012_3142;
var G__3152 = chunk__3013_3143;
var G__3153 = count__3014_3144;
var G__3154 = (i__3015_3145 + (1));
seq__3012_3142 = G__3151;
chunk__3013_3143 = G__3152;
count__3014_3144 = G__3153;
i__3015_3145 = G__3154;
continue;
} else {
var temp__5804__auto___3155__$1 = cljs.core.seq.call(null,seq__3012_3142);
if(temp__5804__auto___3155__$1){
var seq__3012_3156__$1 = temp__5804__auto___3155__$1;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__3012_3156__$1)){
var c__5565__auto___3157 = cljs.core.chunk_first.call(null,seq__3012_3156__$1);
var G__3158 = cljs.core.chunk_rest.call(null,seq__3012_3156__$1);
var G__3159 = c__5565__auto___3157;
var G__3160 = cljs.core.count.call(null,c__5565__auto___3157);
var G__3161 = (0);
seq__3012_3142 = G__3158;
chunk__3013_3143 = G__3159;
count__3014_3144 = G__3160;
i__3015_3145 = G__3161;
continue;
} else {
var map__3019_3162 = cljs.core.first.call(null,seq__3012_3156__$1);
var map__3019_3163__$1 = cljs.core.__destructure_map.call(null,map__3019_3162);
var gline_3164 = cljs.core.get.call(null,map__3019_3163__$1,new cljs.core.Keyword(null,"gline","gline",-1086242431));
var gcol_3165 = cljs.core.get.call(null,map__3019_3163__$1,new cljs.core.Keyword(null,"gcol","gcol",309250807));
var name_3166 = cljs.core.get.call(null,map__3019_3163__$1,new cljs.core.Keyword(null,"name","name",1843675177));
cljs.core.swap_BANG_.call(null,inverted,cljs.core.update_in,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [gline_3164], null),cljs.core.fnil.call(null,((function (seq__3012_3142,chunk__3013_3143,count__3014_3144,i__3015_3145,seq__2983_3135,chunk__2984_3136,count__2985_3137,i__2986_3138,seq__2823_3031,chunk__2824_3032,count__2825_3033,i__2826_3034,map__3019_3162,map__3019_3163__$1,gline_3164,gcol_3165,name_3166,seq__3012_3156__$1,temp__5804__auto___3155__$1,vec__3009_3139,column_3140,column_info_3141,vec__2980_3132,line_3133,columns_3134,seq__2823_3126__$1,temp__5804__auto___3125,inverted){
return (function (columns__$1){
return cljs.core.update_in.call(null,columns__$1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [gcol_3165], null),cljs.core.fnil.call(null,cljs.core.conj,cljs.core.PersistentVector.EMPTY),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"line","line",212345235),line_3133,new cljs.core.Keyword(null,"col","col",-1959363084),column_3140,new cljs.core.Keyword(null,"name","name",1843675177),name_3166], null));
});})(seq__3012_3142,chunk__3013_3143,count__3014_3144,i__3015_3145,seq__2983_3135,chunk__2984_3136,count__2985_3137,i__2986_3138,seq__2823_3031,chunk__2824_3032,count__2825_3033,i__2826_3034,map__3019_3162,map__3019_3163__$1,gline_3164,gcol_3165,name_3166,seq__3012_3156__$1,temp__5804__auto___3155__$1,vec__3009_3139,column_3140,column_info_3141,vec__2980_3132,line_3133,columns_3134,seq__2823_3126__$1,temp__5804__auto___3125,inverted))
,cljs.core.sorted_map.call(null)));


var G__3167 = cljs.core.next.call(null,seq__3012_3156__$1);
var G__3168 = null;
var G__3169 = (0);
var G__3170 = (0);
seq__3012_3142 = G__3167;
chunk__3013_3143 = G__3168;
count__3014_3144 = G__3169;
i__3015_3145 = G__3170;
continue;
}
} else {
}
}
break;
}


var G__3171 = seq__2983_3135;
var G__3172 = chunk__2984_3136;
var G__3173 = count__2985_3137;
var G__3174 = (i__2986_3138 + (1));
seq__2983_3135 = G__3171;
chunk__2984_3136 = G__3172;
count__2985_3137 = G__3173;
i__2986_3138 = G__3174;
continue;
} else {
var temp__5804__auto___3175__$1 = cljs.core.seq.call(null,seq__2983_3135);
if(temp__5804__auto___3175__$1){
var seq__2983_3176__$1 = temp__5804__auto___3175__$1;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__2983_3176__$1)){
var c__5565__auto___3177 = cljs.core.chunk_first.call(null,seq__2983_3176__$1);
var G__3178 = cljs.core.chunk_rest.call(null,seq__2983_3176__$1);
var G__3179 = c__5565__auto___3177;
var G__3180 = cljs.core.count.call(null,c__5565__auto___3177);
var G__3181 = (0);
seq__2983_3135 = G__3178;
chunk__2984_3136 = G__3179;
count__2985_3137 = G__3180;
i__2986_3138 = G__3181;
continue;
} else {
var vec__3020_3182 = cljs.core.first.call(null,seq__2983_3176__$1);
var column_3183 = cljs.core.nth.call(null,vec__3020_3182,(0),null);
var column_info_3184 = cljs.core.nth.call(null,vec__3020_3182,(1),null);
var seq__3023_3185 = cljs.core.seq.call(null,column_info_3184);
var chunk__3024_3186 = null;
var count__3025_3187 = (0);
var i__3026_3188 = (0);
while(true){
if((i__3026_3188 < count__3025_3187)){
var map__3029_3189 = cljs.core._nth.call(null,chunk__3024_3186,i__3026_3188);
var map__3029_3190__$1 = cljs.core.__destructure_map.call(null,map__3029_3189);
var gline_3191 = cljs.core.get.call(null,map__3029_3190__$1,new cljs.core.Keyword(null,"gline","gline",-1086242431));
var gcol_3192 = cljs.core.get.call(null,map__3029_3190__$1,new cljs.core.Keyword(null,"gcol","gcol",309250807));
var name_3193 = cljs.core.get.call(null,map__3029_3190__$1,new cljs.core.Keyword(null,"name","name",1843675177));
cljs.core.swap_BANG_.call(null,inverted,cljs.core.update_in,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [gline_3191], null),cljs.core.fnil.call(null,((function (seq__3023_3185,chunk__3024_3186,count__3025_3187,i__3026_3188,seq__2983_3135,chunk__2984_3136,count__2985_3137,i__2986_3138,seq__2823_3031,chunk__2824_3032,count__2825_3033,i__2826_3034,map__3029_3189,map__3029_3190__$1,gline_3191,gcol_3192,name_3193,vec__3020_3182,column_3183,column_info_3184,seq__2983_3176__$1,temp__5804__auto___3175__$1,vec__2980_3132,line_3133,columns_3134,seq__2823_3126__$1,temp__5804__auto___3125,inverted){
return (function (columns__$1){
return cljs.core.update_in.call(null,columns__$1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [gcol_3192], null),cljs.core.fnil.call(null,cljs.core.conj,cljs.core.PersistentVector.EMPTY),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"line","line",212345235),line_3133,new cljs.core.Keyword(null,"col","col",-1959363084),column_3183,new cljs.core.Keyword(null,"name","name",1843675177),name_3193], null));
});})(seq__3023_3185,chunk__3024_3186,count__3025_3187,i__3026_3188,seq__2983_3135,chunk__2984_3136,count__2985_3137,i__2986_3138,seq__2823_3031,chunk__2824_3032,count__2825_3033,i__2826_3034,map__3029_3189,map__3029_3190__$1,gline_3191,gcol_3192,name_3193,vec__3020_3182,column_3183,column_info_3184,seq__2983_3176__$1,temp__5804__auto___3175__$1,vec__2980_3132,line_3133,columns_3134,seq__2823_3126__$1,temp__5804__auto___3125,inverted))
,cljs.core.sorted_map.call(null)));


var G__3194 = seq__3023_3185;
var G__3195 = chunk__3024_3186;
var G__3196 = count__3025_3187;
var G__3197 = (i__3026_3188 + (1));
seq__3023_3185 = G__3194;
chunk__3024_3186 = G__3195;
count__3025_3187 = G__3196;
i__3026_3188 = G__3197;
continue;
} else {
var temp__5804__auto___3198__$2 = cljs.core.seq.call(null,seq__3023_3185);
if(temp__5804__auto___3198__$2){
var seq__3023_3199__$1 = temp__5804__auto___3198__$2;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__3023_3199__$1)){
var c__5565__auto___3200 = cljs.core.chunk_first.call(null,seq__3023_3199__$1);
var G__3201 = cljs.core.chunk_rest.call(null,seq__3023_3199__$1);
var G__3202 = c__5565__auto___3200;
var G__3203 = cljs.core.count.call(null,c__5565__auto___3200);
var G__3204 = (0);
seq__3023_3185 = G__3201;
chunk__3024_3186 = G__3202;
count__3025_3187 = G__3203;
i__3026_3188 = G__3204;
continue;
} else {
var map__3030_3205 = cljs.core.first.call(null,seq__3023_3199__$1);
var map__3030_3206__$1 = cljs.core.__destructure_map.call(null,map__3030_3205);
var gline_3207 = cljs.core.get.call(null,map__3030_3206__$1,new cljs.core.Keyword(null,"gline","gline",-1086242431));
var gcol_3208 = cljs.core.get.call(null,map__3030_3206__$1,new cljs.core.Keyword(null,"gcol","gcol",309250807));
var name_3209 = cljs.core.get.call(null,map__3030_3206__$1,new cljs.core.Keyword(null,"name","name",1843675177));
cljs.core.swap_BANG_.call(null,inverted,cljs.core.update_in,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [gline_3207], null),cljs.core.fnil.call(null,((function (seq__3023_3185,chunk__3024_3186,count__3025_3187,i__3026_3188,seq__2983_3135,chunk__2984_3136,count__2985_3137,i__2986_3138,seq__2823_3031,chunk__2824_3032,count__2825_3033,i__2826_3034,map__3030_3205,map__3030_3206__$1,gline_3207,gcol_3208,name_3209,seq__3023_3199__$1,temp__5804__auto___3198__$2,vec__3020_3182,column_3183,column_info_3184,seq__2983_3176__$1,temp__5804__auto___3175__$1,vec__2980_3132,line_3133,columns_3134,seq__2823_3126__$1,temp__5804__auto___3125,inverted){
return (function (columns__$1){
return cljs.core.update_in.call(null,columns__$1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [gcol_3208], null),cljs.core.fnil.call(null,cljs.core.conj,cljs.core.PersistentVector.EMPTY),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"line","line",212345235),line_3133,new cljs.core.Keyword(null,"col","col",-1959363084),column_3183,new cljs.core.Keyword(null,"name","name",1843675177),name_3209], null));
});})(seq__3023_3185,chunk__3024_3186,count__3025_3187,i__3026_3188,seq__2983_3135,chunk__2984_3136,count__2985_3137,i__2986_3138,seq__2823_3031,chunk__2824_3032,count__2825_3033,i__2826_3034,map__3030_3205,map__3030_3206__$1,gline_3207,gcol_3208,name_3209,seq__3023_3199__$1,temp__5804__auto___3198__$2,vec__3020_3182,column_3183,column_info_3184,seq__2983_3176__$1,temp__5804__auto___3175__$1,vec__2980_3132,line_3133,columns_3134,seq__2823_3126__$1,temp__5804__auto___3125,inverted))
,cljs.core.sorted_map.call(null)));


var G__3210 = cljs.core.next.call(null,seq__3023_3199__$1);
var G__3211 = null;
var G__3212 = (0);
var G__3213 = (0);
seq__3023_3185 = G__3210;
chunk__3024_3186 = G__3211;
count__3025_3187 = G__3212;
i__3026_3188 = G__3213;
continue;
}
} else {
}
}
break;
}


var G__3214 = cljs.core.next.call(null,seq__2983_3176__$1);
var G__3215 = null;
var G__3216 = (0);
var G__3217 = (0);
seq__2983_3135 = G__3214;
chunk__2984_3136 = G__3215;
count__2985_3137 = G__3216;
i__2986_3138 = G__3217;
continue;
}
} else {
}
}
break;
}


var G__3218 = cljs.core.next.call(null,seq__2823_3126__$1);
var G__3219 = null;
var G__3220 = (0);
var G__3221 = (0);
seq__2823_3031 = G__3218;
chunk__2824_3032 = G__3219;
count__2825_3033 = G__3220;
i__2826_3034 = G__3221;
continue;
}
} else {
}
}
break;
}

return cljs.core.deref.call(null,inverted);
});

//# sourceMappingURL=source_map.js.map
