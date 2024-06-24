// Compiled by ClojureScript 1.11.54 {:optimizations :none}
goog.provide('cljs.compiler');
goog.require('cljs.core');
goog.require('cljs.analyzer');
goog.require('cljs.analyzer.impl');
goog.require('cljs.env');
goog.require('cljs.source_map');
goog.require('cljs.tools.reader');
goog.require('clojure.set');
goog.require('clojure.string');
goog.require('goog.string');
goog.require('goog.string.StringBuffer');
cljs.compiler.js_reserved = cljs.analyzer.js_reserved;
cljs.compiler.es5_GT__EQ_ = cljs.core.into.call(null,cljs.core.PersistentHashSet.EMPTY,cljs.core.comp.call(null,cljs.core.mapcat.call(null,(function (lang){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [lang,cljs.core.keyword.call(null,clojure.string.replace.call(null,cljs.core.name.call(null,lang),/^ecmascript/,"es"))], null);
}))),new cljs.core.PersistentVector(null, 9, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"ecmascript5","ecmascript5",342717552),new cljs.core.Keyword(null,"ecmascript5-strict","ecmascript5-strict",888234811),new cljs.core.Keyword(null,"ecmascript6","ecmascript6",723864898),new cljs.core.Keyword(null,"ecmascript6-strict","ecmascript6-strict",-786049555),new cljs.core.Keyword(null,"ecmascript-2015","ecmascript-2015",-902254444),new cljs.core.Keyword(null,"ecmascript6-typed","ecmascript6-typed",-1978203054),new cljs.core.Keyword(null,"ecmascript-2016","ecmascript-2016",471574729),new cljs.core.Keyword(null,"ecmascript-2017","ecmascript-2017",620145058),new cljs.core.Keyword(null,"ecmascript-next","ecmascript-next",-1935155962)], null));
cljs.compiler._STAR_recompiled_STAR_ = null;
cljs.compiler._STAR_inputs_STAR_ = null;
cljs.compiler._STAR_source_map_data_STAR_ = null;
cljs.compiler._STAR_source_map_data_gen_col_STAR_ = null;
cljs.compiler._STAR_lexical_renames_STAR_ = cljs.core.PersistentArrayMap.EMPTY;
cljs.compiler.cljs_reserved_file_names = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, ["deps.cljs",null], null), null);
/**
 * Gets the part up to the first `.` of a namespace.
 * Returns the empty string for nil.
 * Returns the entire string if no `.` in namespace
 */
cljs.compiler.get_first_ns_segment = (function cljs$compiler$get_first_ns_segment(ns){
var ns__$1 = cljs.core.str.cljs$core$IFn$_invoke$arity$1(ns);
var idx = ns__$1.indexOf(".");
if(((-1) === idx)){
return ns__$1;
} else {
return cljs.core.subs.call(null,ns__$1,(0),idx);
}
});
cljs.compiler.find_ns_starts_with = (function cljs$compiler$find_ns_starts_with(needle){
return cljs.core.reduce_kv.call(null,(function (xs,ns,_){
if(cljs.core._EQ_.call(null,needle,cljs.compiler.get_first_ns_segment.call(null,ns))){
return cljs.core.reduced.call(null,needle);
} else {
return null;
}
}),null,new cljs.core.Keyword("cljs.analyzer","namespaces","cljs.analyzer/namespaces",-260788927).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,cljs.env._STAR_compiler_STAR_)));
});
cljs.compiler.shadow_depth = (function cljs$compiler$shadow_depth(s){
var map__3224 = s;
var map__3224__$1 = cljs.core.__destructure_map.call(null,map__3224);
var name = cljs.core.get.call(null,map__3224__$1,new cljs.core.Keyword(null,"name","name",1843675177));
var info = cljs.core.get.call(null,map__3224__$1,new cljs.core.Keyword(null,"info","info",-317069002));
var d = (0);
var G__3226 = info;
var map__3227 = G__3226;
var map__3227__$1 = cljs.core.__destructure_map.call(null,map__3227);
var shadow = cljs.core.get.call(null,map__3227__$1,new cljs.core.Keyword(null,"shadow","shadow",873231803));
var d__$1 = d;
var G__3226__$1 = G__3226;
while(true){
var d__$2 = d__$1;
var map__3229 = G__3226__$1;
var map__3229__$1 = cljs.core.__destructure_map.call(null,map__3229);
var shadow__$1 = cljs.core.get.call(null,map__3229__$1,new cljs.core.Keyword(null,"shadow","shadow",873231803));
if(cljs.core.truth_(shadow__$1)){
var G__3230 = (d__$2 + (1));
var G__3231 = shadow__$1;
d__$1 = G__3230;
G__3226__$1 = G__3231;
continue;
} else {
if(cljs.core.truth_(cljs.compiler.find_ns_starts_with.call(null,cljs.core.str.cljs$core$IFn$_invoke$arity$1(name)))){
return (d__$2 + (1));
} else {
return d__$2;

}
}
break;
}
});
cljs.compiler.hash_scope = (function cljs$compiler$hash_scope(s){
return cljs.core.hash_combine.call(null,cljs.core._hash.call(null,new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(s)),cljs.compiler.shadow_depth.call(null,s));
});
cljs.compiler.fn_self_name = (function cljs$compiler$fn_self_name(p__3232){
var map__3233 = p__3232;
var map__3233__$1 = cljs.core.__destructure_map.call(null,map__3233);
var name_var = map__3233__$1;
var name = cljs.core.get.call(null,map__3233__$1,new cljs.core.Keyword(null,"name","name",1843675177));
var info = cljs.core.get.call(null,map__3233__$1,new cljs.core.Keyword(null,"info","info",-317069002));
var name__$1 = clojure.string.replace.call(null,cljs.core.str.cljs$core$IFn$_invoke$arity$1(name),"..","_DOT__DOT_");
var map__3234 = info;
var map__3234__$1 = cljs.core.__destructure_map.call(null,map__3234);
var ns = cljs.core.get.call(null,map__3234__$1,new cljs.core.Keyword(null,"ns","ns",441598760));
var fn_scope = cljs.core.get.call(null,map__3234__$1,new cljs.core.Keyword(null,"fn-scope","fn-scope",-865664859));
var scoped_name = cljs.core.apply.call(null,cljs.core.str,cljs.core.interpose.call(null,"_$_",cljs.core.concat.call(null,cljs.core.map.call(null,cljs.core.comp.call(null,cljs.core.str,new cljs.core.Keyword(null,"name","name",1843675177)),fn_scope),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [name__$1], null))));
return cljs.core.symbol.call(null,cljs.compiler.munge.call(null,[clojure.string.replace.call(null,cljs.core.str.cljs$core$IFn$_invoke$arity$1(ns),".","$"),"$",cljs.core.str.cljs$core$IFn$_invoke$arity$1(scoped_name)].join('')));
});
cljs.compiler.munge_reserved = (function cljs$compiler$munge_reserved(reserved){
return (function (s){
if((!((cljs.core.get.call(null,reserved,s) == null)))){
return [cljs.core.str.cljs$core$IFn$_invoke$arity$1(s),"$"].join('');
} else {
return s;
}
});
});
cljs.compiler.munge = (function cljs$compiler$munge(var_args){
var G__3236 = arguments.length;
switch (G__3236) {
case 1:
return cljs.compiler.munge.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs.compiler.munge.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs.compiler.munge.cljs$core$IFn$_invoke$arity$1 = (function (s){
return cljs.compiler.munge.call(null,s,cljs.compiler.js_reserved);
}));

(cljs.compiler.munge.cljs$core$IFn$_invoke$arity$2 = (function (s,reserved){
if(cljs.analyzer.impl.cljs_map_QMARK_.call(null,s)){
var name_var = s;
var name = new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(name_var);
var field = new cljs.core.Keyword(null,"field","field",-1302436500).cljs$core$IFn$_invoke$arity$1(name_var);
var info = new cljs.core.Keyword(null,"info","info",-317069002).cljs$core$IFn$_invoke$arity$1(name_var);
if((!((new cljs.core.Keyword(null,"fn-self-name","fn-self-name",1461143531).cljs$core$IFn$_invoke$arity$1(info) == null)))){
return cljs.compiler.fn_self_name.call(null,s);
} else {
var depth = cljs.compiler.shadow_depth.call(null,s);
var code = cljs.compiler.hash_scope.call(null,s);
var renamed = cljs.core.get.call(null,cljs.compiler._STAR_lexical_renames_STAR_,code);
var name__$1 = ((field === true)?["self__.",cljs.core.str.cljs$core$IFn$_invoke$arity$1(name)].join(''):(((!((renamed == null))))?renamed:name
));
var munged_name = cljs.compiler.munge.call(null,name__$1,reserved);
if(((field === true) || ((depth === (0))))){
return munged_name;
} else {
return cljs.core.symbol.call(null,[cljs.core.str.cljs$core$IFn$_invoke$arity$1(munged_name),"__$",cljs.core.str.cljs$core$IFn$_invoke$arity$1(depth)].join(''));
}
}
} else {
var ss = clojure.string.replace.call(null,cljs.core.str.cljs$core$IFn$_invoke$arity$1(s),"..","_DOT__DOT_");
var ss__$1 = clojure.string.replace.call(null,ss,(new RegExp("\\/(.)")),".$1");
var rf = cljs.compiler.munge_reserved.call(null,reserved);
var ss__$2 = cljs.core.map.call(null,rf,clojure.string.split.call(null,ss__$1,/\./));
var ss__$3 = clojure.string.join.call(null,".",ss__$2);
var ms = new cljs.core.Var(function(){return cljs.core.munge_str;},new cljs.core.Symbol("cljs.core","munge-str","cljs.core/munge-str",-301346665,null),cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"private","private",-558947994),new cljs.core.Keyword(null,"ns","ns",441598760),new cljs.core.Keyword(null,"name","name",1843675177),new cljs.core.Keyword(null,"file","file",-1269645878),new cljs.core.Keyword(null,"end-column","end-column",1425389514),new cljs.core.Keyword(null,"column","column",2078222095),new cljs.core.Keyword(null,"line","line",212345235),new cljs.core.Keyword(null,"end-line","end-line",1837326455),new cljs.core.Keyword(null,"tag","tag",-1290361223),new cljs.core.Keyword(null,"arglists","arglists",1661989754),new cljs.core.Keyword(null,"doc","doc",1913296891),new cljs.core.Keyword(null,"test","test",577538877)],[true,new cljs.core.Symbol(null,"cljs.core","cljs.core",770546058,null),new cljs.core.Symbol(null,"munge-str","munge-str",-2042069652,null),"cljs/core.cljs",(25),(1),(11790),(11790),new cljs.core.Symbol(null,"string","string",-349010059,null),cljs.core.list(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"name","name",-810760592,null)], null)),null,(cljs.core.truth_(cljs.core.munge_str)?cljs.core.munge_str.cljs$lang$test:null)])).call(null,ss__$3);
if((s instanceof cljs.core.Symbol)){
return cljs.core.symbol.call(null,ms);
} else {
return ms;
}
}
}));

(cljs.compiler.munge.cljs$lang$maxFixedArity = 2);

cljs.compiler.comma_sep = (function cljs$compiler$comma_sep(xs){
return cljs.core.interpose.call(null,",",xs);
});
cljs.compiler.escape_char = (function cljs$compiler$escape_char(c){
var cp = goog.string.hashCode(c);
var G__3238 = cp;
switch (G__3238) {
case (34):
return "\\\"";

break;
case (92):
return "\\\\";

break;
case (8):
return "\\b";

break;
case (12):
return "\\f";

break;
case (10):
return "\\n";

break;
case (13):
return "\\r";

break;
case (9):
return "\\t";

break;
default:
if(((((31) < cp)) && ((cp < (127))))){
return c;
} else {
var unpadded = cp.toString((16));
var pad = cljs.core.subs.call(null,"0000",unpadded.length);
return ["\\u",pad,cljs.core.str.cljs$core$IFn$_invoke$arity$1(unpadded)].join('');
}

}
});
cljs.compiler.escape_string = (function cljs$compiler$escape_string(s){
var sb = (new goog.string.StringBuffer());
var seq__3240_3244 = cljs.core.seq.call(null,s);
var chunk__3241_3245 = null;
var count__3242_3246 = (0);
var i__3243_3247 = (0);
while(true){
if((i__3243_3247 < count__3242_3246)){
var c_3248 = cljs.core._nth.call(null,chunk__3241_3245,i__3243_3247);
sb.append(cljs.compiler.escape_char.call(null,c_3248));


var G__3249 = seq__3240_3244;
var G__3250 = chunk__3241_3245;
var G__3251 = count__3242_3246;
var G__3252 = (i__3243_3247 + (1));
seq__3240_3244 = G__3249;
chunk__3241_3245 = G__3250;
count__3242_3246 = G__3251;
i__3243_3247 = G__3252;
continue;
} else {
var temp__5804__auto___3253 = cljs.core.seq.call(null,seq__3240_3244);
if(temp__5804__auto___3253){
var seq__3240_3254__$1 = temp__5804__auto___3253;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__3240_3254__$1)){
var c__5565__auto___3255 = cljs.core.chunk_first.call(null,seq__3240_3254__$1);
var G__3256 = cljs.core.chunk_rest.call(null,seq__3240_3254__$1);
var G__3257 = c__5565__auto___3255;
var G__3258 = cljs.core.count.call(null,c__5565__auto___3255);
var G__3259 = (0);
seq__3240_3244 = G__3256;
chunk__3241_3245 = G__3257;
count__3242_3246 = G__3258;
i__3243_3247 = G__3259;
continue;
} else {
var c_3260 = cljs.core.first.call(null,seq__3240_3254__$1);
sb.append(cljs.compiler.escape_char.call(null,c_3260));


var G__3261 = cljs.core.next.call(null,seq__3240_3254__$1);
var G__3262 = null;
var G__3263 = (0);
var G__3264 = (0);
seq__3240_3244 = G__3261;
chunk__3241_3245 = G__3262;
count__3242_3246 = G__3263;
i__3243_3247 = G__3264;
continue;
}
} else {
}
}
break;
}

return sb.toString();
});
cljs.compiler.wrap_in_double_quotes = (function cljs$compiler$wrap_in_double_quotes(x){
return ["\"",cljs.core.str.cljs$core$IFn$_invoke$arity$1(x),"\""].join('');
});
if((typeof cljs !== 'undefined') && (typeof cljs.compiler !== 'undefined') && (typeof cljs.compiler.emit_STAR_ !== 'undefined')){
} else {
cljs.compiler.emit_STAR_ = (function (){var method_table__5639__auto__ = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
var prefer_table__5640__auto__ = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
var method_cache__5641__auto__ = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
var cached_hierarchy__5642__auto__ = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
var hierarchy__5643__auto__ = cljs.core.get.call(null,cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"hierarchy","hierarchy",-1053470341),cljs.core.get_global_hierarchy.call(null));
return (new cljs.core.MultiFn(cljs.core.symbol.call(null,"cljs.compiler","emit*"),new cljs.core.Keyword(null,"op","op",-1882987955),new cljs.core.Keyword(null,"default","default",-1987822328),hierarchy__5643__auto__,method_table__5639__auto__,prefer_table__5640__auto__,method_cache__5641__auto__,cached_hierarchy__5642__auto__));
})();
}
cljs.compiler.emit = (function cljs$compiler$emit(ast){
if(cljs.core.truth_(cljs.compiler._STAR_source_map_data_STAR_)){
var map__3265_3268 = ast;
var map__3265_3269__$1 = cljs.core.__destructure_map.call(null,map__3265_3268);
var env_3270 = cljs.core.get.call(null,map__3265_3269__$1,new cljs.core.Keyword(null,"env","env",-1815813235));
if(cljs.core.truth_(new cljs.core.Keyword(null,"line","line",212345235).cljs$core$IFn$_invoke$arity$1(env_3270))){
var map__3266_3271 = env_3270;
var map__3266_3272__$1 = cljs.core.__destructure_map.call(null,map__3266_3271);
var line_3273 = cljs.core.get.call(null,map__3266_3272__$1,new cljs.core.Keyword(null,"line","line",212345235));
var column_3274 = cljs.core.get.call(null,map__3266_3272__$1,new cljs.core.Keyword(null,"column","column",2078222095));
cljs.core.swap_BANG_.call(null,cljs.compiler._STAR_source_map_data_STAR_,(function (m){
var minfo = (function (){var G__3267 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"gcol","gcol",309250807),new cljs.core.Keyword(null,"gen-col","gen-col",1901918303).cljs$core$IFn$_invoke$arity$1(m),new cljs.core.Keyword(null,"gline","gline",-1086242431),new cljs.core.Keyword(null,"gen-line","gen-line",589592125).cljs$core$IFn$_invoke$arity$1(m)], null);
if(cljs.core.truth_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"binding","binding",539932593),null,new cljs.core.Keyword(null,"var","var",-769682797),null,new cljs.core.Keyword(null,"js-var","js-var",-1177899142),null,new cljs.core.Keyword(null,"local","local",-1497766724),null], null), null).call(null,new cljs.core.Keyword(null,"op","op",-1882987955).cljs$core$IFn$_invoke$arity$1(ast)))){
return cljs.core.assoc.call(null,G__3267,new cljs.core.Keyword(null,"name","name",1843675177),cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"info","info",-317069002).cljs$core$IFn$_invoke$arity$1(ast))));
} else {
return G__3267;
}
})();
return cljs.core.update_in.call(null,m,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"source-map","source-map",1706252311),(line_3273 - (1))], null),cljs.core.fnil.call(null,(function (line__$1){
return cljs.core.update_in.call(null,line__$1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(cljs.core.truth_(column_3274)?(column_3274 - (1)):(0))], null),cljs.core.fnil.call(null,(function (column__$1){
return cljs.core.conj.call(null,column__$1,minfo);
}),cljs.core.PersistentVector.EMPTY));
}),cljs.core.sorted_map.call(null)));
}));
} else {
}
} else {
}

return cljs.compiler.emit_STAR_.call(null,ast);
});
cljs.compiler.emits = (function cljs$compiler$emits(var_args){
var G__3283 = arguments.length;
switch (G__3283) {
case 0:
return cljs.compiler.emits.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return cljs.compiler.emits.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs.compiler.emits.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.compiler.emits.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return cljs.compiler.emits.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
case 5:
return cljs.compiler.emits.cljs$core$IFn$_invoke$arity$5((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]));

break;
default:
var args_arr__5791__auto__ = [];
var len__5766__auto___3290 = arguments.length;
var i__5767__auto___3291 = (0);
while(true){
if((i__5767__auto___3291 < len__5766__auto___3290)){
args_arr__5791__auto__.push((arguments[i__5767__auto___3291]));

var G__3292 = (i__5767__auto___3291 + (1));
i__5767__auto___3291 = G__3292;
continue;
} else {
}
break;
}

var argseq__5792__auto__ = (new cljs.core.IndexedSeq(args_arr__5791__auto__.slice((5)),(0),null));
return cljs.compiler.emits.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]),argseq__5792__auto__);

}
});

(cljs.compiler.emits.cljs$core$IFn$_invoke$arity$0 = (function (){
return null;
}));

(cljs.compiler.emits.cljs$core$IFn$_invoke$arity$1 = (function (a){
if((a == null)){
} else {
if(cljs.analyzer.impl.cljs_map_QMARK_.call(null,a)){
cljs.compiler.emit.call(null,a);
} else {
if(cljs.analyzer.impl.cljs_seq_QMARK_.call(null,a)){
cljs.core.apply.call(null,cljs.compiler.emits,a);
} else {
if(typeof a === 'function'){
a.call(null);
} else {
var s_3293 = (function (){var G__3284 = a;
if((!(typeof a === 'string'))){
return G__3284.toString();
} else {
return G__3284;
}
})();
var temp__5808__auto___3294 = cljs.compiler._STAR_source_map_data_STAR_;
if((temp__5808__auto___3294 == null)){
} else {
var sm_data_3295 = temp__5808__auto___3294;
cljs.core.swap_BANG_.call(null,sm_data_3295,cljs.core.update,new cljs.core.Keyword(null,"gen-col","gen-col",1901918303),(function (p1__3275_SHARP_){
return (p1__3275_SHARP_ + s_3293.length);
}));
}

cljs.core.print.call(null,s_3293);

}
}
}
}

return null;
}));

(cljs.compiler.emits.cljs$core$IFn$_invoke$arity$2 = (function (a,b){
cljs.compiler.emits.call(null,a);

return cljs.compiler.emits.call(null,b);
}));

(cljs.compiler.emits.cljs$core$IFn$_invoke$arity$3 = (function (a,b,c){
cljs.compiler.emits.call(null,a);

cljs.compiler.emits.call(null,b);

return cljs.compiler.emits.call(null,c);
}));

(cljs.compiler.emits.cljs$core$IFn$_invoke$arity$4 = (function (a,b,c,d){
cljs.compiler.emits.call(null,a);

cljs.compiler.emits.call(null,b);

cljs.compiler.emits.call(null,c);

return cljs.compiler.emits.call(null,d);
}));

(cljs.compiler.emits.cljs$core$IFn$_invoke$arity$5 = (function (a,b,c,d,e){
cljs.compiler.emits.call(null,a);

cljs.compiler.emits.call(null,b);

cljs.compiler.emits.call(null,c);

cljs.compiler.emits.call(null,d);

return cljs.compiler.emits.call(null,e);
}));

(cljs.compiler.emits.cljs$core$IFn$_invoke$arity$variadic = (function (a,b,c,d,e,xs){
cljs.compiler.emits.call(null,a);

cljs.compiler.emits.call(null,b);

cljs.compiler.emits.call(null,c);

cljs.compiler.emits.call(null,d);

cljs.compiler.emits.call(null,e);

var seq__3285 = cljs.core.seq.call(null,xs);
var chunk__3286 = null;
var count__3287 = (0);
var i__3288 = (0);
while(true){
if((i__3288 < count__3287)){
var x = cljs.core._nth.call(null,chunk__3286,i__3288);
cljs.compiler.emits.call(null,x);


var G__3296 = seq__3285;
var G__3297 = chunk__3286;
var G__3298 = count__3287;
var G__3299 = (i__3288 + (1));
seq__3285 = G__3296;
chunk__3286 = G__3297;
count__3287 = G__3298;
i__3288 = G__3299;
continue;
} else {
var temp__5804__auto__ = cljs.core.seq.call(null,seq__3285);
if(temp__5804__auto__){
var seq__3285__$1 = temp__5804__auto__;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__3285__$1)){
var c__5565__auto__ = cljs.core.chunk_first.call(null,seq__3285__$1);
var G__3300 = cljs.core.chunk_rest.call(null,seq__3285__$1);
var G__3301 = c__5565__auto__;
var G__3302 = cljs.core.count.call(null,c__5565__auto__);
var G__3303 = (0);
seq__3285 = G__3300;
chunk__3286 = G__3301;
count__3287 = G__3302;
i__3288 = G__3303;
continue;
} else {
var x = cljs.core.first.call(null,seq__3285__$1);
cljs.compiler.emits.call(null,x);


var G__3304 = cljs.core.next.call(null,seq__3285__$1);
var G__3305 = null;
var G__3306 = (0);
var G__3307 = (0);
seq__3285 = G__3304;
chunk__3286 = G__3305;
count__3287 = G__3306;
i__3288 = G__3307;
continue;
}
} else {
return null;
}
}
break;
}
}));

/** @this {Function} */
(cljs.compiler.emits.cljs$lang$applyTo = (function (seq3277){
var G__3278 = cljs.core.first.call(null,seq3277);
var seq3277__$1 = cljs.core.next.call(null,seq3277);
var G__3279 = cljs.core.first.call(null,seq3277__$1);
var seq3277__$2 = cljs.core.next.call(null,seq3277__$1);
var G__3280 = cljs.core.first.call(null,seq3277__$2);
var seq3277__$3 = cljs.core.next.call(null,seq3277__$2);
var G__3281 = cljs.core.first.call(null,seq3277__$3);
var seq3277__$4 = cljs.core.next.call(null,seq3277__$3);
var G__3282 = cljs.core.first.call(null,seq3277__$4);
var seq3277__$5 = cljs.core.next.call(null,seq3277__$4);
var self__5751__auto__ = this;
return self__5751__auto__.cljs$core$IFn$_invoke$arity$variadic(G__3278,G__3279,G__3280,G__3281,G__3282,seq3277__$5);
}));

(cljs.compiler.emits.cljs$lang$maxFixedArity = (5));

cljs.compiler._emitln = (function cljs$compiler$_emitln(){
cljs.core.newline.call(null);

if(cljs.core.truth_(cljs.compiler._STAR_source_map_data_STAR_)){
cljs.core.swap_BANG_.call(null,cljs.compiler._STAR_source_map_data_STAR_,(function (p__3308){
var map__3309 = p__3308;
var map__3309__$1 = cljs.core.__destructure_map.call(null,map__3309);
var m = map__3309__$1;
var gen_line = cljs.core.get.call(null,map__3309__$1,new cljs.core.Keyword(null,"gen-line","gen-line",589592125));
return cljs.core.assoc.call(null,m,new cljs.core.Keyword(null,"gen-line","gen-line",589592125),(gen_line + (1)),new cljs.core.Keyword(null,"gen-col","gen-col",1901918303),(0));
}));
} else {
}

return null;
});
cljs.compiler.emitln = (function cljs$compiler$emitln(var_args){
var G__3317 = arguments.length;
switch (G__3317) {
case 0:
return cljs.compiler.emitln.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return cljs.compiler.emitln.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs.compiler.emitln.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.compiler.emitln.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return cljs.compiler.emitln.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
case 5:
return cljs.compiler.emitln.cljs$core$IFn$_invoke$arity$5((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]));

break;
default:
var args_arr__5791__auto__ = [];
var len__5766__auto___3323 = arguments.length;
var i__5767__auto___3324 = (0);
while(true){
if((i__5767__auto___3324 < len__5766__auto___3323)){
args_arr__5791__auto__.push((arguments[i__5767__auto___3324]));

var G__3325 = (i__5767__auto___3324 + (1));
i__5767__auto___3324 = G__3325;
continue;
} else {
}
break;
}

var argseq__5792__auto__ = (new cljs.core.IndexedSeq(args_arr__5791__auto__.slice((5)),(0),null));
return cljs.compiler.emitln.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]),argseq__5792__auto__);

}
});

(cljs.compiler.emitln.cljs$core$IFn$_invoke$arity$0 = (function (){
return cljs.compiler._emitln.call(null);
}));

(cljs.compiler.emitln.cljs$core$IFn$_invoke$arity$1 = (function (a){
cljs.compiler.emits.call(null,a);

return cljs.compiler._emitln.call(null);
}));

(cljs.compiler.emitln.cljs$core$IFn$_invoke$arity$2 = (function (a,b){
cljs.compiler.emits.call(null,a);

cljs.compiler.emits.call(null,b);

return cljs.compiler._emitln.call(null);
}));

(cljs.compiler.emitln.cljs$core$IFn$_invoke$arity$3 = (function (a,b,c){
cljs.compiler.emits.call(null,a);

cljs.compiler.emits.call(null,b);

cljs.compiler.emits.call(null,c);

return cljs.compiler._emitln.call(null);
}));

(cljs.compiler.emitln.cljs$core$IFn$_invoke$arity$4 = (function (a,b,c,d){
cljs.compiler.emits.call(null,a);

cljs.compiler.emits.call(null,b);

cljs.compiler.emits.call(null,c);

cljs.compiler.emits.call(null,d);

return cljs.compiler._emitln.call(null);
}));

(cljs.compiler.emitln.cljs$core$IFn$_invoke$arity$5 = (function (a,b,c,d,e){
cljs.compiler.emits.call(null,a);

cljs.compiler.emits.call(null,b);

cljs.compiler.emits.call(null,c);

cljs.compiler.emits.call(null,d);

cljs.compiler.emits.call(null,e);

return cljs.compiler._emitln.call(null);
}));

(cljs.compiler.emitln.cljs$core$IFn$_invoke$arity$variadic = (function (a,b,c,d,e,xs){
cljs.compiler.emits.call(null,a);

cljs.compiler.emits.call(null,b);

cljs.compiler.emits.call(null,c);

cljs.compiler.emits.call(null,d);

cljs.compiler.emits.call(null,e);

var seq__3318_3326 = cljs.core.seq.call(null,xs);
var chunk__3319_3327 = null;
var count__3320_3328 = (0);
var i__3321_3329 = (0);
while(true){
if((i__3321_3329 < count__3320_3328)){
var x_3330 = cljs.core._nth.call(null,chunk__3319_3327,i__3321_3329);
cljs.compiler.emits.call(null,x_3330);


var G__3331 = seq__3318_3326;
var G__3332 = chunk__3319_3327;
var G__3333 = count__3320_3328;
var G__3334 = (i__3321_3329 + (1));
seq__3318_3326 = G__3331;
chunk__3319_3327 = G__3332;
count__3320_3328 = G__3333;
i__3321_3329 = G__3334;
continue;
} else {
var temp__5804__auto___3335 = cljs.core.seq.call(null,seq__3318_3326);
if(temp__5804__auto___3335){
var seq__3318_3336__$1 = temp__5804__auto___3335;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__3318_3336__$1)){
var c__5565__auto___3337 = cljs.core.chunk_first.call(null,seq__3318_3336__$1);
var G__3338 = cljs.core.chunk_rest.call(null,seq__3318_3336__$1);
var G__3339 = c__5565__auto___3337;
var G__3340 = cljs.core.count.call(null,c__5565__auto___3337);
var G__3341 = (0);
seq__3318_3326 = G__3338;
chunk__3319_3327 = G__3339;
count__3320_3328 = G__3340;
i__3321_3329 = G__3341;
continue;
} else {
var x_3342 = cljs.core.first.call(null,seq__3318_3336__$1);
cljs.compiler.emits.call(null,x_3342);


var G__3343 = cljs.core.next.call(null,seq__3318_3336__$1);
var G__3344 = null;
var G__3345 = (0);
var G__3346 = (0);
seq__3318_3326 = G__3343;
chunk__3319_3327 = G__3344;
count__3320_3328 = G__3345;
i__3321_3329 = G__3346;
continue;
}
} else {
}
}
break;
}

return cljs.compiler._emitln.call(null);
}));

/** @this {Function} */
(cljs.compiler.emitln.cljs$lang$applyTo = (function (seq3311){
var G__3312 = cljs.core.first.call(null,seq3311);
var seq3311__$1 = cljs.core.next.call(null,seq3311);
var G__3313 = cljs.core.first.call(null,seq3311__$1);
var seq3311__$2 = cljs.core.next.call(null,seq3311__$1);
var G__3314 = cljs.core.first.call(null,seq3311__$2);
var seq3311__$3 = cljs.core.next.call(null,seq3311__$2);
var G__3315 = cljs.core.first.call(null,seq3311__$3);
var seq3311__$4 = cljs.core.next.call(null,seq3311__$3);
var G__3316 = cljs.core.first.call(null,seq3311__$4);
var seq3311__$5 = cljs.core.next.call(null,seq3311__$4);
var self__5751__auto__ = this;
return self__5751__auto__.cljs$core$IFn$_invoke$arity$variadic(G__3312,G__3313,G__3314,G__3315,G__3316,seq3311__$5);
}));

(cljs.compiler.emitln.cljs$lang$maxFixedArity = (5));

cljs.compiler.emit_str = (function cljs$compiler$emit_str(expr){
var sb__5687__auto__ = (new goog.string.StringBuffer());
var _STAR_print_newline_STAR__orig_val__3347_3351 = cljs.core._STAR_print_newline_STAR_;
var _STAR_print_fn_STAR__orig_val__3348_3352 = cljs.core._STAR_print_fn_STAR_;
var _STAR_print_newline_STAR__temp_val__3349_3353 = true;
var _STAR_print_fn_STAR__temp_val__3350_3354 = (function (x__5688__auto__){
return sb__5687__auto__.append(x__5688__auto__);
});
(cljs.core._STAR_print_newline_STAR_ = _STAR_print_newline_STAR__temp_val__3349_3353);

(cljs.core._STAR_print_fn_STAR_ = _STAR_print_fn_STAR__temp_val__3350_3354);

try{cljs.compiler.emit.call(null,expr);
}finally {(cljs.core._STAR_print_fn_STAR_ = _STAR_print_fn_STAR__orig_val__3348_3352);

(cljs.core._STAR_print_newline_STAR_ = _STAR_print_newline_STAR__orig_val__3347_3351);
}
return cljs.core.str.cljs$core$IFn$_invoke$arity$1(sb__5687__auto__);
});
if((typeof cljs !== 'undefined') && (typeof cljs.compiler !== 'undefined') && (typeof cljs.compiler.emit_constant_STAR_ !== 'undefined')){
} else {
cljs.compiler.emit_constant_STAR_ = (function (){var method_table__5639__auto__ = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
var prefer_table__5640__auto__ = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
var method_cache__5641__auto__ = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
var cached_hierarchy__5642__auto__ = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
var hierarchy__5643__auto__ = cljs.core.get.call(null,cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"hierarchy","hierarchy",-1053470341),cljs.core.get_global_hierarchy.call(null));
return (new cljs.core.MultiFn(cljs.core.symbol.call(null,"cljs.compiler","emit-constant*"),cljs.core.type,new cljs.core.Keyword(null,"default","default",-1987822328),hierarchy__5643__auto__,method_table__5639__auto__,prefer_table__5640__auto__,method_cache__5641__auto__,cached_hierarchy__5642__auto__));
})();
}









cljs.compiler.all_distinct_QMARK_ = (function cljs$compiler$all_distinct_QMARK_(xs){
return cljs.core.apply.call(null,cljs.core.distinct_QMARK_,xs);
});
cljs.compiler.emit_constant_no_meta = (function cljs$compiler$emit_constant_no_meta(x){
if(cljs.analyzer.impl.cljs_seq_QMARK_.call(null,x)){
return cljs.compiler.emit_list.call(null,x,cljs.compiler.emit_constants_comma_sep);
} else {
if(cljs.core.record_QMARK_.call(null,x)){
var vec__3355 = cljs.analyzer.record_ns_PLUS_name.call(null,x);
var ns = cljs.core.nth.call(null,vec__3355,(0),null);
var name = cljs.core.nth.call(null,vec__3355,(1),null);
return cljs.compiler.emit_record_value.call(null,ns,name,(function (){
return cljs.compiler.emit_constant.call(null,cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,x));
}));
} else {
if(cljs.analyzer.impl.cljs_map_QMARK_.call(null,x)){
return cljs.compiler.emit_map.call(null,cljs.core.keys.call(null,x),cljs.core.vals.call(null,x),cljs.compiler.emit_constants_comma_sep,cljs.compiler.all_distinct_QMARK_);
} else {
if(cljs.analyzer.impl.cljs_vector_QMARK_.call(null,x)){
return cljs.compiler.emit_vector.call(null,x,cljs.compiler.emit_constants_comma_sep);
} else {
if(cljs.analyzer.impl.cljs_set_QMARK_.call(null,x)){
return cljs.compiler.emit_set.call(null,x,cljs.compiler.emit_constants_comma_sep,cljs.compiler.all_distinct_QMARK_);
} else {
return cljs.compiler.emit_constant_STAR_.call(null,x);

}
}
}
}
}
});
cljs.compiler.emit_constant = (function cljs$compiler$emit_constant(v){
var m = cljs.analyzer.elide_irrelevant_meta.call(null,cljs.core.meta.call(null,v));
if((!((cljs.core.seq.call(null,m) == null)))){
return cljs.compiler.emit_with_meta.call(null,(function (){
return cljs.compiler.emit_constant_no_meta.call(null,v);
}),(function (){
return cljs.compiler.emit_constant_no_meta.call(null,m);
}));
} else {
return cljs.compiler.emit_constant_no_meta.call(null,v);
}
});
cljs.core._add_method.call(null,cljs.compiler.emit_constant_STAR_,new cljs.core.Keyword(null,"default","default",-1987822328),(function (x){
throw cljs.core.ex_info.call(null,["failed compiling constant: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(x),"; ",cljs.core.pr_str.call(null,cljs.core.type.call(null,x))," is not a valid ClojureScript constant."].join(''),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"constant","constant",-379609303),x,new cljs.core.Keyword(null,"type","type",1174270348),cljs.core.type.call(null,x),new cljs.core.Keyword("clojure.error","phase","clojure.error/phase",275140358),new cljs.core.Keyword(null,"compilation","compilation",-1328774561)], null));
}));
cljs.core._add_method.call(null,cljs.compiler.emit_constant_STAR_,null,(function (x){
return cljs.compiler.emits.call(null,"null");
}));
cljs.core._add_method.call(null,cljs.compiler.emit_constant_STAR_,Number,(function (x){
if(cljs.core.truth_(isNaN(x))){
return cljs.compiler.emits.call(null,"NaN");
} else {
if(cljs.core.not.call(null,isFinite(x))){
return cljs.compiler.emits.call(null,(((x > (0)))?"Infinity":"-Infinity"));
} else {
if((((x === (0))) && ((((1) / x) < (0))))){
return cljs.compiler.emits.call(null,"(-0)");
} else {
return cljs.compiler.emits.call(null,"(",x,")");

}
}
}
}));
cljs.core._add_method.call(null,cljs.compiler.emit_constant_STAR_,String,(function (x){
return cljs.compiler.emits.call(null,cljs.compiler.wrap_in_double_quotes.call(null,cljs.compiler.escape_string.call(null,x)));
}));
cljs.core._add_method.call(null,cljs.compiler.emit_constant_STAR_,Boolean,(function (x){
return cljs.compiler.emits.call(null,(cljs.core.truth_(x)?"true":"false"));
}));
cljs.core._add_method.call(null,cljs.compiler.emit_constant_STAR_,RegExp,(function (x){
if(cljs.core._EQ_.call(null,"",cljs.core.str.cljs$core$IFn$_invoke$arity$1(x))){
return cljs.compiler.emits.call(null,"(new RegExp(\"\"))");
} else {
var vec__3358 = cljs.core.re_find.call(null,/^(?:\(\?([idmsux]*)\))?(.*)/,cljs.core.str.cljs$core$IFn$_invoke$arity$1(x));
var _ = cljs.core.nth.call(null,vec__3358,(0),null);
var flags = cljs.core.nth.call(null,vec__3358,(1),null);
var pattern = cljs.core.nth.call(null,vec__3358,(2),null);
return cljs.compiler.emits.call(null,pattern);
}
}));
cljs.compiler.emits_keyword = (function cljs$compiler$emits_keyword(kw){
var ns = cljs.core.namespace.call(null,kw);
var name = cljs.core.name.call(null,kw);
cljs.compiler.emits.call(null,"new cljs.core.Keyword(");

cljs.compiler.emit_constant.call(null,ns);

cljs.compiler.emits.call(null,",");

cljs.compiler.emit_constant.call(null,name);

cljs.compiler.emits.call(null,",");

cljs.compiler.emit_constant.call(null,(cljs.core.truth_(ns)?[ns,"/",name].join(''):name));

cljs.compiler.emits.call(null,",");

cljs.compiler.emit_constant.call(null,cljs.core.hash.call(null,kw));

return cljs.compiler.emits.call(null,")");
});
cljs.compiler.emits_symbol = (function cljs$compiler$emits_symbol(sym){
var ns = cljs.core.namespace.call(null,sym);
var name = cljs.core.name.call(null,sym);
var symstr = (((!((ns == null))))?[ns,"/",name].join(''):name);
cljs.compiler.emits.call(null,"new cljs.core.Symbol(");

cljs.compiler.emit_constant.call(null,ns);

cljs.compiler.emits.call(null,",");

cljs.compiler.emit_constant.call(null,name);

cljs.compiler.emits.call(null,",");

cljs.compiler.emit_constant.call(null,symstr);

cljs.compiler.emits.call(null,",");

cljs.compiler.emit_constant.call(null,cljs.core.hash.call(null,sym));

cljs.compiler.emits.call(null,",");

cljs.compiler.emit_constant.call(null,null);

return cljs.compiler.emits.call(null,")");
});
cljs.core._add_method.call(null,cljs.compiler.emit_constant_STAR_,cljs.core.Keyword,(function (x){
var temp__5802__auto__ = (function (){var and__5041__auto__ = new cljs.core.Keyword(null,"emit-constants","emit-constants",-476585410).cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"options","options",99638489).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,cljs.env._STAR_compiler_STAR_)));
if(cljs.core.truth_(and__5041__auto__)){
return x.call(null,new cljs.core.Keyword("cljs.analyzer","constant-table","cljs.analyzer/constant-table",-114131889).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,cljs.env._STAR_compiler_STAR_)));
} else {
return and__5041__auto__;
}
})();
if(cljs.core.truth_(temp__5802__auto__)){
var value = temp__5802__auto__;
return cljs.compiler.emits.call(null,"cljs.core.",value);
} else {
return cljs.compiler.emits_keyword.call(null,x);
}
}));
cljs.core._add_method.call(null,cljs.compiler.emit_constant_STAR_,cljs.core.Symbol,(function (x){
var temp__5802__auto__ = (function (){var and__5041__auto__ = new cljs.core.Keyword(null,"emit-constants","emit-constants",-476585410).cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"options","options",99638489).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,cljs.env._STAR_compiler_STAR_)));
if(cljs.core.truth_(and__5041__auto__)){
return x.call(null,new cljs.core.Keyword("cljs.analyzer","constant-table","cljs.analyzer/constant-table",-114131889).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,cljs.env._STAR_compiler_STAR_)));
} else {
return and__5041__auto__;
}
})();
if(cljs.core.truth_(temp__5802__auto__)){
var value = temp__5802__auto__;
return cljs.compiler.emits.call(null,"cljs.core.",value);
} else {
return cljs.compiler.emits_symbol.call(null,x);
}
}));
cljs.compiler.emit_constants_comma_sep = (function cljs$compiler$emit_constants_comma_sep(cs){
return (function (){
return cljs.core.doall.call(null,cljs.core.map_indexed.call(null,(function (i,m){
if(cljs.core.even_QMARK_.call(null,i)){
return cljs.compiler.emit_constant.call(null,m);
} else {
return cljs.compiler.emits.call(null,m);
}
}),cljs.compiler.comma_sep.call(null,cs)));
});
});
cljs.compiler.array_map_threshold = (8);
cljs.compiler.emit_inst = (function cljs$compiler$emit_inst(inst_ms){
return cljs.compiler.emits.call(null,"new Date(",inst_ms,")");
});
cljs.core._add_method.call(null,cljs.compiler.emit_constant_STAR_,Date,(function (date){
return cljs.compiler.emit_inst.call(null,date.getTime());
}));
cljs.core._add_method.call(null,cljs.compiler.emit_constant_STAR_,cljs.core.UUID,(function (uuid){
var uuid_str = uuid.toString();
return cljs.compiler.emits.call(null,"new cljs.core.UUID(\"",uuid_str,"\", ",cljs.core.hash.call(null,uuid_str),")");
}));
cljs.core._add_method.call(null,cljs.compiler.emit_constant_STAR_,cljs.tagged_literals.JSValue,(function (v){
var items = v.val;
if(cljs.core.map_QMARK_.call(null,items)){
return cljs.compiler.emit_js_object.call(null,items,(function (p1__3361_SHARP_){
return (function (){
return cljs.compiler.emit_constant.call(null,p1__3361_SHARP_);
});
}));
} else {
return cljs.compiler.emit_js_array.call(null,items,cljs.compiler.emit_constants_comma_sep);
}
}));
cljs.core._add_method.call(null,cljs.compiler.emit_STAR_,new cljs.core.Keyword(null,"no-op","no-op",-93046065),(function (m){
return null;
}));
cljs.compiler.emit_var = (function cljs$compiler$emit_var(p__3363){
var map__3364 = p__3363;
var map__3364__$1 = cljs.core.__destructure_map.call(null,map__3364);
var ast = map__3364__$1;
var info = cljs.core.get.call(null,map__3364__$1,new cljs.core.Keyword(null,"info","info",-317069002));
var env = cljs.core.get.call(null,map__3364__$1,new cljs.core.Keyword(null,"env","env",-1815813235));
var form = cljs.core.get.call(null,map__3364__$1,new cljs.core.Keyword(null,"form","form",-1624062471));
var temp__5802__auto__ = new cljs.core.Keyword(null,"const-expr","const-expr",-1379382292).cljs$core$IFn$_invoke$arity$1(ast);
if(cljs.core.truth_(temp__5802__auto__)){
var const_expr = temp__5802__auto__;
return cljs.compiler.emit.call(null,cljs.core.assoc.call(null,const_expr,new cljs.core.Keyword(null,"env","env",-1815813235),env));
} else {
var map__3365 = cljs.core.deref.call(null,cljs.env._STAR_compiler_STAR_);
var map__3365__$1 = cljs.core.__destructure_map.call(null,map__3365);
var cenv = map__3365__$1;
var options = cljs.core.get.call(null,map__3365__$1,new cljs.core.Keyword(null,"options","options",99638489));
var var_name = new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(info);
var info__$1 = ((cljs.core._EQ_.call(null,cljs.core.namespace.call(null,var_name),"js"))?(function (){var js_module_name = cljs.core.get_in.call(null,cenv,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"js-module-index","js-module-index",2072061931),cljs.core.name.call(null,var_name),new cljs.core.Keyword(null,"name","name",1843675177)], null));
var or__5043__auto__ = js_module_name;
if(cljs.core.truth_(or__5043__auto__)){
return or__5043__auto__;
} else {
return cljs.core.name.call(null,var_name);
}
})():info);
if(cljs.core.truth_(new cljs.core.Keyword(null,"binding-form?","binding-form?",1728940169).cljs$core$IFn$_invoke$arity$1(ast))){
return cljs.compiler.emits.call(null,cljs.compiler.munge.call(null,ast));
} else {
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"statement","statement",-32780863),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env))){
return null;
} else {
var reserved = (function (){var G__3366 = cljs.compiler.js_reserved;
if(cljs.core.truth_((function (){var and__5041__auto__ = cljs.compiler.es5_GT__EQ_.call(null,new cljs.core.Keyword(null,"language-out","language-out",334619882).cljs$core$IFn$_invoke$arity$1(options));
if(cljs.core.truth_(and__5041__auto__)){
return (!((cljs.core.namespace.call(null,var_name) == null)));
} else {
return and__5041__auto__;
}
})())){
return clojure.set.difference.call(null,G__3366,cljs.analyzer.es5_allowed);
} else {
return G__3366;
}
})();
var js_module = cljs.core.get_in.call(null,cenv,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"js-namespaces","js-namespaces",-471353612),(function (){var or__5043__auto__ = cljs.core.namespace.call(null,var_name);
if(cljs.core.truth_(or__5043__auto__)){
return or__5043__auto__;
} else {
return cljs.core.name.call(null,var_name);
}
})()], null));
var info__$2 = (function (){var G__3367 = info__$1;
if(cljs.core.not_EQ_.call(null,form,new cljs.core.Symbol("js","-Infinity","js/-Infinity",958706333,null))){
return cljs.compiler.munge.call(null,G__3367,reserved);
} else {
return G__3367;
}
})();
var env__9253__auto__ = env;
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"return","return",-1891502105),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env__9253__auto__))){
cljs.compiler.emits.call(null,"return ");
} else {
}

var G__3368_3369 = new cljs.core.Keyword(null,"module-type","module-type",1392760304).cljs$core$IFn$_invoke$arity$1(js_module);
var G__3368_3370__$1 = (((G__3368_3369 instanceof cljs.core.Keyword))?G__3368_3369.fqn:null);
switch (G__3368_3370__$1) {
case "commonjs":
if(cljs.core.truth_(cljs.core.namespace.call(null,var_name))){
cljs.compiler.emits.call(null,cljs.compiler.munge.call(null,cljs.core.namespace.call(null,var_name),reserved),"[\"default\"].",cljs.compiler.munge.call(null,cljs.core.name.call(null,var_name),reserved));
} else {
cljs.compiler.emits.call(null,cljs.compiler.munge.call(null,cljs.core.name.call(null,var_name),reserved),"[\"default\"]");
}

break;
case "es6":
if(cljs.core.truth_((function (){var and__5041__auto__ = cljs.core.namespace.call(null,var_name);
if(cljs.core.truth_(and__5041__auto__)){
return cljs.core._EQ_.call(null,"default",cljs.core.name.call(null,var_name));
} else {
return and__5041__auto__;
}
})())){
cljs.compiler.emits.call(null,cljs.compiler.munge.call(null,cljs.core.namespace.call(null,var_name),reserved),"[\"default\"]");
} else {
cljs.compiler.emits.call(null,info__$2);
}

break;
default:
cljs.compiler.emits.call(null,info__$2);

}

if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"expr","expr",745722291),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env__9253__auto__))){
return null;
} else {
return cljs.compiler.emitln.call(null,";");
}
}
}
}
});
cljs.core._add_method.call(null,cljs.compiler.emit_STAR_,new cljs.core.Keyword(null,"var","var",-769682797),(function (expr){
return cljs.compiler.emit_var.call(null,expr);
}));
cljs.core._add_method.call(null,cljs.compiler.emit_STAR_,new cljs.core.Keyword(null,"binding","binding",539932593),(function (expr){
return cljs.compiler.emit_var.call(null,expr);
}));
cljs.core._add_method.call(null,cljs.compiler.emit_STAR_,new cljs.core.Keyword(null,"js-var","js-var",-1177899142),(function (expr){
return cljs.compiler.emit_var.call(null,expr);
}));
cljs.core._add_method.call(null,cljs.compiler.emit_STAR_,new cljs.core.Keyword(null,"local","local",-1497766724),(function (expr){
return cljs.compiler.emit_var.call(null,expr);
}));
cljs.core._add_method.call(null,cljs.compiler.emit_STAR_,new cljs.core.Keyword(null,"the-var","the-var",1428415613),(function (p__3372){
var map__3373 = p__3372;
var map__3373__$1 = cljs.core.__destructure_map.call(null,map__3373);
var arg = map__3373__$1;
var env = cljs.core.get.call(null,map__3373__$1,new cljs.core.Keyword(null,"env","env",-1815813235));
var var$ = cljs.core.get.call(null,map__3373__$1,new cljs.core.Keyword(null,"var","var",-769682797));
var sym = cljs.core.get.call(null,map__3373__$1,new cljs.core.Keyword(null,"sym","sym",-1444860305));
var meta = cljs.core.get.call(null,map__3373__$1,new cljs.core.Keyword(null,"meta","meta",1499536964));
if(cljs.analyzer.ast_QMARK_.call(null,sym)){
} else {
throw (new Error("Assert failed: (ana/ast? sym)"));
}

if(cljs.analyzer.ast_QMARK_.call(null,meta)){
} else {
throw (new Error("Assert failed: (ana/ast? meta)"));
}

var map__3374 = new cljs.core.Keyword(null,"info","info",-317069002).cljs$core$IFn$_invoke$arity$1(var$);
var map__3374__$1 = cljs.core.__destructure_map.call(null,map__3374);
var name = cljs.core.get.call(null,map__3374__$1,new cljs.core.Keyword(null,"name","name",1843675177));
var env__9253__auto__ = env;
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"return","return",-1891502105),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env__9253__auto__))){
cljs.compiler.emits.call(null,"return ");
} else {
}

cljs.compiler.emits.call(null,"new cljs.core.Var(function(){return ",cljs.compiler.munge.call(null,name),";},",sym,",",meta,")");

if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"expr","expr",745722291),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env__9253__auto__))){
return null;
} else {
return cljs.compiler.emitln.call(null,";");
}
}));
cljs.compiler.emit_with_meta = (function cljs$compiler$emit_with_meta(expr,meta){
return cljs.compiler.emits.call(null,"cljs.core.with_meta(",expr,",",meta,")");
});
cljs.core._add_method.call(null,cljs.compiler.emit_STAR_,new cljs.core.Keyword(null,"with-meta","with-meta",-1566856820),(function (p__3375){
var map__3376 = p__3375;
var map__3376__$1 = cljs.core.__destructure_map.call(null,map__3376);
var expr = cljs.core.get.call(null,map__3376__$1,new cljs.core.Keyword(null,"expr","expr",745722291));
var meta = cljs.core.get.call(null,map__3376__$1,new cljs.core.Keyword(null,"meta","meta",1499536964));
var env = cljs.core.get.call(null,map__3376__$1,new cljs.core.Keyword(null,"env","env",-1815813235));
var env__9253__auto__ = env;
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"return","return",-1891502105),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env__9253__auto__))){
cljs.compiler.emits.call(null,"return ");
} else {
}

cljs.compiler.emit_with_meta.call(null,expr,meta);

if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"expr","expr",745722291),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env__9253__auto__))){
return null;
} else {
return cljs.compiler.emitln.call(null,";");
}
}));
cljs.compiler.distinct_keys_QMARK_ = (function cljs$compiler$distinct_keys_QMARK_(keys){
var keys__$1 = cljs.core.map.call(null,cljs.analyzer.unwrap_quote,keys);
return ((cljs.core.every_QMARK_.call(null,(function (p1__3377_SHARP_){
return cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"op","op",-1882987955).cljs$core$IFn$_invoke$arity$1(p1__3377_SHARP_),new cljs.core.Keyword(null,"const","const",1709929842));
}),keys__$1)) && (cljs.core._EQ_.call(null,cljs.core.count.call(null,cljs.core.into.call(null,cljs.core.PersistentHashSet.EMPTY,keys__$1)),cljs.core.count.call(null,keys__$1))));
});
cljs.compiler.emit_map = (function cljs$compiler$emit_map(keys,vals,comma_sep,distinct_keys_QMARK_){
if((cljs.core.count.call(null,keys) === (0))){
return cljs.compiler.emits.call(null,"cljs.core.PersistentArrayMap.EMPTY");
} else {
if((cljs.core.count.call(null,keys) <= cljs.compiler.array_map_threshold)){
if(cljs.core.truth_(distinct_keys_QMARK_.call(null,keys))){
return cljs.compiler.emits.call(null,"new cljs.core.PersistentArrayMap(null, ",cljs.core.count.call(null,keys),", [",comma_sep.call(null,cljs.core.interleave.call(null,keys,vals)),"], null)");
} else {
return cljs.compiler.emits.call(null,"cljs.core.PersistentArrayMap.createAsIfByAssoc([",comma_sep.call(null,cljs.core.interleave.call(null,keys,vals)),"])");
}
} else {
return cljs.compiler.emits.call(null,"cljs.core.PersistentHashMap.fromArrays([",comma_sep.call(null,keys),"],[",comma_sep.call(null,vals),"])");

}
}
});
cljs.core._add_method.call(null,cljs.compiler.emit_STAR_,new cljs.core.Keyword(null,"map","map",1371690461),(function (p__3378){
var map__3379 = p__3378;
var map__3379__$1 = cljs.core.__destructure_map.call(null,map__3379);
var env = cljs.core.get.call(null,map__3379__$1,new cljs.core.Keyword(null,"env","env",-1815813235));
var keys = cljs.core.get.call(null,map__3379__$1,new cljs.core.Keyword(null,"keys","keys",1068423698));
var vals = cljs.core.get.call(null,map__3379__$1,new cljs.core.Keyword(null,"vals","vals",768058733));
var env__9253__auto__ = env;
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"return","return",-1891502105),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env__9253__auto__))){
cljs.compiler.emits.call(null,"return ");
} else {
}

cljs.compiler.emit_map.call(null,keys,vals,cljs.compiler.comma_sep,cljs.compiler.distinct_keys_QMARK_);

if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"expr","expr",745722291),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env__9253__auto__))){
return null;
} else {
return cljs.compiler.emitln.call(null,";");
}
}));
cljs.compiler.emit_list = (function cljs$compiler$emit_list(items,comma_sep){
if(cljs.core.empty_QMARK_.call(null,items)){
return cljs.compiler.emits.call(null,"cljs.core.List.EMPTY");
} else {
return cljs.compiler.emits.call(null,"cljs.core.list(",comma_sep.call(null,items),")");
}
});
cljs.compiler.emit_vector = (function cljs$compiler$emit_vector(items,comma_sep){
if(cljs.core.empty_QMARK_.call(null,items)){
return cljs.compiler.emits.call(null,"cljs.core.PersistentVector.EMPTY");
} else {
var cnt = cljs.core.count.call(null,items);
if((cnt < (32))){
return cljs.compiler.emits.call(null,"new cljs.core.PersistentVector(null, ",cnt,", 5, cljs.core.PersistentVector.EMPTY_NODE, [",comma_sep.call(null,items),"], null)");
} else {
return cljs.compiler.emits.call(null,"cljs.core.PersistentVector.fromArray([",comma_sep.call(null,items),"], true)");
}
}
});
cljs.core._add_method.call(null,cljs.compiler.emit_STAR_,new cljs.core.Keyword(null,"vector","vector",1902966158),(function (p__3380){
var map__3381 = p__3380;
var map__3381__$1 = cljs.core.__destructure_map.call(null,map__3381);
var items = cljs.core.get.call(null,map__3381__$1,new cljs.core.Keyword(null,"items","items",1031954938));
var env = cljs.core.get.call(null,map__3381__$1,new cljs.core.Keyword(null,"env","env",-1815813235));
var env__9253__auto__ = env;
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"return","return",-1891502105),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env__9253__auto__))){
cljs.compiler.emits.call(null,"return ");
} else {
}

cljs.compiler.emit_vector.call(null,items,cljs.compiler.comma_sep);

if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"expr","expr",745722291),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env__9253__auto__))){
return null;
} else {
return cljs.compiler.emitln.call(null,";");
}
}));
cljs.compiler.distinct_constants_QMARK_ = (function cljs$compiler$distinct_constants_QMARK_(items){
var items__$1 = cljs.core.map.call(null,cljs.analyzer.unwrap_quote,items);
return ((cljs.core.every_QMARK_.call(null,(function (p1__3382_SHARP_){
return cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"op","op",-1882987955).cljs$core$IFn$_invoke$arity$1(p1__3382_SHARP_),new cljs.core.Keyword(null,"const","const",1709929842));
}),items__$1)) && (cljs.core._EQ_.call(null,cljs.core.count.call(null,cljs.core.into.call(null,cljs.core.PersistentHashSet.EMPTY,items__$1)),cljs.core.count.call(null,items__$1))));
});
cljs.compiler.emit_set = (function cljs$compiler$emit_set(items,comma_sep,distinct_constants_QMARK_){
if(cljs.core.empty_QMARK_.call(null,items)){
return cljs.compiler.emits.call(null,"cljs.core.PersistentHashSet.EMPTY");
} else {
if(cljs.core.truth_(distinct_constants_QMARK_.call(null,items))){
return cljs.compiler.emits.call(null,"new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, ",cljs.core.count.call(null,items),", [",comma_sep.call(null,cljs.core.interleave.call(null,items,cljs.core.repeat.call(null,"null"))),"], null), null)");
} else {
return cljs.compiler.emits.call(null,"cljs.core.PersistentHashSet.createAsIfByAssoc([",comma_sep.call(null,items),"])");

}
}
});
cljs.core._add_method.call(null,cljs.compiler.emit_STAR_,new cljs.core.Keyword(null,"set","set",304602554),(function (p__3383){
var map__3384 = p__3383;
var map__3384__$1 = cljs.core.__destructure_map.call(null,map__3384);
var items = cljs.core.get.call(null,map__3384__$1,new cljs.core.Keyword(null,"items","items",1031954938));
var env = cljs.core.get.call(null,map__3384__$1,new cljs.core.Keyword(null,"env","env",-1815813235));
var env__9253__auto__ = env;
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"return","return",-1891502105),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env__9253__auto__))){
cljs.compiler.emits.call(null,"return ");
} else {
}

cljs.compiler.emit_set.call(null,items,cljs.compiler.comma_sep,cljs.compiler.distinct_constants_QMARK_);

if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"expr","expr",745722291),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env__9253__auto__))){
return null;
} else {
return cljs.compiler.emitln.call(null,";");
}
}));
cljs.compiler.emit_js_object = (function cljs$compiler$emit_js_object(items,emit_js_object_val){
cljs.compiler.emits.call(null,"({");

var temp__5804__auto___3407 = cljs.core.seq.call(null,items);
if(temp__5804__auto___3407){
var items_3408__$1 = temp__5804__auto___3407;
var vec__3385_3409 = items_3408__$1;
var seq__3386_3410 = cljs.core.seq.call(null,vec__3385_3409);
var first__3387_3411 = cljs.core.first.call(null,seq__3386_3410);
var seq__3386_3412__$1 = cljs.core.next.call(null,seq__3386_3410);
var vec__3388_3413 = first__3387_3411;
var k_3414 = cljs.core.nth.call(null,vec__3388_3413,(0),null);
var v_3415 = cljs.core.nth.call(null,vec__3388_3413,(1),null);
var r_3416 = seq__3386_3412__$1;
cljs.compiler.emits.call(null,"\"",cljs.core.name.call(null,k_3414),"\": ",emit_js_object_val.call(null,v_3415));

var seq__3391_3417 = cljs.core.seq.call(null,r_3416);
var chunk__3392_3418 = null;
var count__3393_3419 = (0);
var i__3394_3420 = (0);
while(true){
if((i__3394_3420 < count__3393_3419)){
var vec__3401_3421 = cljs.core._nth.call(null,chunk__3392_3418,i__3394_3420);
var k_3422__$1 = cljs.core.nth.call(null,vec__3401_3421,(0),null);
var v_3423__$1 = cljs.core.nth.call(null,vec__3401_3421,(1),null);
cljs.compiler.emits.call(null,", \"",cljs.core.name.call(null,k_3422__$1),"\": ",emit_js_object_val.call(null,v_3423__$1));


var G__3424 = seq__3391_3417;
var G__3425 = chunk__3392_3418;
var G__3426 = count__3393_3419;
var G__3427 = (i__3394_3420 + (1));
seq__3391_3417 = G__3424;
chunk__3392_3418 = G__3425;
count__3393_3419 = G__3426;
i__3394_3420 = G__3427;
continue;
} else {
var temp__5804__auto___3428__$1 = cljs.core.seq.call(null,seq__3391_3417);
if(temp__5804__auto___3428__$1){
var seq__3391_3429__$1 = temp__5804__auto___3428__$1;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__3391_3429__$1)){
var c__5565__auto___3430 = cljs.core.chunk_first.call(null,seq__3391_3429__$1);
var G__3431 = cljs.core.chunk_rest.call(null,seq__3391_3429__$1);
var G__3432 = c__5565__auto___3430;
var G__3433 = cljs.core.count.call(null,c__5565__auto___3430);
var G__3434 = (0);
seq__3391_3417 = G__3431;
chunk__3392_3418 = G__3432;
count__3393_3419 = G__3433;
i__3394_3420 = G__3434;
continue;
} else {
var vec__3404_3435 = cljs.core.first.call(null,seq__3391_3429__$1);
var k_3436__$1 = cljs.core.nth.call(null,vec__3404_3435,(0),null);
var v_3437__$1 = cljs.core.nth.call(null,vec__3404_3435,(1),null);
cljs.compiler.emits.call(null,", \"",cljs.core.name.call(null,k_3436__$1),"\": ",emit_js_object_val.call(null,v_3437__$1));


var G__3438 = cljs.core.next.call(null,seq__3391_3429__$1);
var G__3439 = null;
var G__3440 = (0);
var G__3441 = (0);
seq__3391_3417 = G__3438;
chunk__3392_3418 = G__3439;
count__3393_3419 = G__3440;
i__3394_3420 = G__3441;
continue;
}
} else {
}
}
break;
}
} else {
}

return cljs.compiler.emits.call(null,"})");
});
cljs.compiler.emit_js_array = (function cljs$compiler$emit_js_array(items,comma_sep){
return cljs.compiler.emits.call(null,"[",comma_sep.call(null,items),"]");
});
cljs.core._add_method.call(null,cljs.compiler.emit_STAR_,new cljs.core.Keyword(null,"js-object","js-object",1830199158),(function (p__3442){
var map__3443 = p__3442;
var map__3443__$1 = cljs.core.__destructure_map.call(null,map__3443);
var keys = cljs.core.get.call(null,map__3443__$1,new cljs.core.Keyword(null,"keys","keys",1068423698));
var vals = cljs.core.get.call(null,map__3443__$1,new cljs.core.Keyword(null,"vals","vals",768058733));
var env = cljs.core.get.call(null,map__3443__$1,new cljs.core.Keyword(null,"env","env",-1815813235));
var env__9253__auto__ = env;
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"return","return",-1891502105),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env__9253__auto__))){
cljs.compiler.emits.call(null,"return ");
} else {
}

cljs.compiler.emit_js_object.call(null,cljs.core.map.call(null,cljs.core.vector,keys,vals),cljs.core.identity);

if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"expr","expr",745722291),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env__9253__auto__))){
return null;
} else {
return cljs.compiler.emitln.call(null,";");
}
}));
cljs.core._add_method.call(null,cljs.compiler.emit_STAR_,new cljs.core.Keyword(null,"js-array","js-array",-1210185421),(function (p__3444){
var map__3445 = p__3444;
var map__3445__$1 = cljs.core.__destructure_map.call(null,map__3445);
var items = cljs.core.get.call(null,map__3445__$1,new cljs.core.Keyword(null,"items","items",1031954938));
var env = cljs.core.get.call(null,map__3445__$1,new cljs.core.Keyword(null,"env","env",-1815813235));
var env__9253__auto__ = env;
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"return","return",-1891502105),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env__9253__auto__))){
cljs.compiler.emits.call(null,"return ");
} else {
}

cljs.compiler.emit_js_array.call(null,items,cljs.compiler.comma_sep);

if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"expr","expr",745722291),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env__9253__auto__))){
return null;
} else {
return cljs.compiler.emitln.call(null,";");
}
}));
cljs.compiler.emit_record_value = (function cljs$compiler$emit_record_value(ns,name,items){
return cljs.compiler.emits.call(null,ns,".map__GT_",name,"(",items,")");
});
cljs.core._add_method.call(null,cljs.compiler.emit_STAR_,new cljs.core.Keyword(null,"quote","quote",-262615245),(function (p__3446){
var map__3447 = p__3446;
var map__3447__$1 = cljs.core.__destructure_map.call(null,map__3447);
var expr = cljs.core.get.call(null,map__3447__$1,new cljs.core.Keyword(null,"expr","expr",745722291));
return cljs.compiler.emit.call(null,expr);
}));
cljs.core._add_method.call(null,cljs.compiler.emit_STAR_,new cljs.core.Keyword(null,"const","const",1709929842),(function (p__3448){
var map__3449 = p__3448;
var map__3449__$1 = cljs.core.__destructure_map.call(null,map__3449);
var form = cljs.core.get.call(null,map__3449__$1,new cljs.core.Keyword(null,"form","form",-1624062471));
var env = cljs.core.get.call(null,map__3449__$1,new cljs.core.Keyword(null,"env","env",-1815813235));
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"statement","statement",-32780863),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env))){
return null;
} else {
var env__9253__auto__ = env;
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"return","return",-1891502105),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env__9253__auto__))){
cljs.compiler.emits.call(null,"return ");
} else {
}

cljs.compiler.emit_constant.call(null,form);

if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"expr","expr",745722291),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env__9253__auto__))){
return null;
} else {
return cljs.compiler.emitln.call(null,";");
}
}
}));
cljs.compiler.truthy_constant_QMARK_ = (function cljs$compiler$truthy_constant_QMARK_(expr){
var map__3450 = cljs.analyzer.unwrap_quote.call(null,expr);
var map__3450__$1 = cljs.core.__destructure_map.call(null,map__3450);
var op = cljs.core.get.call(null,map__3450__$1,new cljs.core.Keyword(null,"op","op",-1882987955));
var form = cljs.core.get.call(null,map__3450__$1,new cljs.core.Keyword(null,"form","form",-1624062471));
var const_expr = cljs.core.get.call(null,map__3450__$1,new cljs.core.Keyword(null,"const-expr","const-expr",-1379382292));
var or__5043__auto__ = (function (){var and__5041__auto__ = cljs.core._EQ_.call(null,op,new cljs.core.Keyword(null,"const","const",1709929842));
if(and__5041__auto__){
var and__5041__auto____$1 = form;
if(cljs.core.truth_(and__5041__auto____$1)){
return (!(((((typeof form === 'string') && (cljs.core._EQ_.call(null,form,"")))) || (((typeof form === 'number') && ((form === (0))))))));
} else {
return and__5041__auto____$1;
}
} else {
return and__5041__auto__;
}
})();
if(cljs.core.truth_(or__5043__auto__)){
return or__5043__auto__;
} else {
var and__5041__auto__ = (!((const_expr == null)));
if(and__5041__auto__){
return cljs.compiler.truthy_constant_QMARK_.call(null,const_expr);
} else {
return and__5041__auto__;
}
}
});
cljs.compiler.falsey_constant_QMARK_ = (function cljs$compiler$falsey_constant_QMARK_(expr){
var map__3451 = cljs.analyzer.unwrap_quote.call(null,expr);
var map__3451__$1 = cljs.core.__destructure_map.call(null,map__3451);
var op = cljs.core.get.call(null,map__3451__$1,new cljs.core.Keyword(null,"op","op",-1882987955));
var form = cljs.core.get.call(null,map__3451__$1,new cljs.core.Keyword(null,"form","form",-1624062471));
var const_expr = cljs.core.get.call(null,map__3451__$1,new cljs.core.Keyword(null,"const-expr","const-expr",-1379382292));
var or__5043__auto__ = ((cljs.core._EQ_.call(null,op,new cljs.core.Keyword(null,"const","const",1709929842))) && (((form === false) || ((form == null)))));
if(or__5043__auto__){
return or__5043__auto__;
} else {
var and__5041__auto__ = (!((const_expr == null)));
if(and__5041__auto__){
return cljs.compiler.falsey_constant_QMARK_.call(null,const_expr);
} else {
return and__5041__auto__;
}
}
});
cljs.compiler.safe_test_QMARK_ = (function cljs$compiler$safe_test_QMARK_(env,e){
var tag = cljs.analyzer.infer_tag.call(null,env,e);
var or__5043__auto__ = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Symbol(null,"seq","seq",-177272256,null),null,new cljs.core.Symbol(null,"boolean","boolean",-278886877,null),null], null), null).call(null,tag);
if(cljs.core.truth_(or__5043__auto__)){
return or__5043__auto__;
} else {
return cljs.compiler.truthy_constant_QMARK_.call(null,e);
}
});
cljs.core._add_method.call(null,cljs.compiler.emit_STAR_,new cljs.core.Keyword(null,"if","if",-458814265),(function (p__3452){
var map__3453 = p__3452;
var map__3453__$1 = cljs.core.__destructure_map.call(null,map__3453);
var test = cljs.core.get.call(null,map__3453__$1,new cljs.core.Keyword(null,"test","test",577538877));
var then = cljs.core.get.call(null,map__3453__$1,new cljs.core.Keyword(null,"then","then",460598070));
var else$ = cljs.core.get.call(null,map__3453__$1,new cljs.core.Keyword(null,"else","else",-1508377146));
var env = cljs.core.get.call(null,map__3453__$1,new cljs.core.Keyword(null,"env","env",-1815813235));
var unchecked = cljs.core.get.call(null,map__3453__$1,new cljs.core.Keyword(null,"unchecked","unchecked",924418378));
var context = new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env);
var checked = cljs.core.not.call(null,(function (){var or__5043__auto__ = unchecked;
if(cljs.core.truth_(or__5043__auto__)){
return or__5043__auto__;
} else {
return cljs.compiler.safe_test_QMARK_.call(null,env,test);
}
})());
if(cljs.core.truth_(cljs.compiler.truthy_constant_QMARK_.call(null,test))){
return cljs.compiler.emitln.call(null,then);
} else {
if(cljs.core.truth_(cljs.compiler.falsey_constant_QMARK_.call(null,test))){
return cljs.compiler.emitln.call(null,else$);
} else {
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"expr","expr",745722291),context)){
return cljs.compiler.emits.call(null,"(",((checked)?"cljs.core.truth_":null),"(",test,")?",then,":",else$,")");
} else {
if(checked){
cljs.compiler.emitln.call(null,"if(cljs.core.truth_(",test,")){");
} else {
cljs.compiler.emitln.call(null,"if(",test,"){");
}

cljs.compiler.emitln.call(null,then,"} else {");

return cljs.compiler.emitln.call(null,else$,"}");
}

}
}
}));
cljs.core._add_method.call(null,cljs.compiler.emit_STAR_,new cljs.core.Keyword(null,"case","case",1143702196),(function (p__3454){
var map__3455 = p__3454;
var map__3455__$1 = cljs.core.__destructure_map.call(null,map__3455);
var v = cljs.core.get.call(null,map__3455__$1,new cljs.core.Keyword(null,"test","test",577538877));
var nodes = cljs.core.get.call(null,map__3455__$1,new cljs.core.Keyword(null,"nodes","nodes",-2099585805));
var default$ = cljs.core.get.call(null,map__3455__$1,new cljs.core.Keyword(null,"default","default",-1987822328));
var env = cljs.core.get.call(null,map__3455__$1,new cljs.core.Keyword(null,"env","env",-1815813235));
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env),new cljs.core.Keyword(null,"expr","expr",745722291))){
cljs.compiler.emitln.call(null,"(function(){");
} else {
}

var gs = cljs.core.gensym.call(null,"caseval__");
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"expr","expr",745722291),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env))){
cljs.compiler.emitln.call(null,"var ",gs,";");
} else {
}

cljs.compiler.emitln.call(null,"switch (",v,") {");

var seq__3456_3484 = cljs.core.seq.call(null,nodes);
var chunk__3457_3485 = null;
var count__3458_3486 = (0);
var i__3459_3487 = (0);
while(true){
if((i__3459_3487 < count__3458_3486)){
var map__3472_3488 = cljs.core._nth.call(null,chunk__3457_3485,i__3459_3487);
var map__3472_3489__$1 = cljs.core.__destructure_map.call(null,map__3472_3488);
var ts_3490 = cljs.core.get.call(null,map__3472_3489__$1,new cljs.core.Keyword(null,"tests","tests",-1041085625));
var map__3473_3491 = cljs.core.get.call(null,map__3472_3489__$1,new cljs.core.Keyword(null,"then","then",460598070));
var map__3473_3492__$1 = cljs.core.__destructure_map.call(null,map__3473_3491);
var then_3493 = cljs.core.get.call(null,map__3473_3492__$1,new cljs.core.Keyword(null,"then","then",460598070));
var seq__3474_3494 = cljs.core.seq.call(null,cljs.core.map.call(null,new cljs.core.Keyword(null,"test","test",577538877),ts_3490));
var chunk__3475_3495 = null;
var count__3476_3496 = (0);
var i__3477_3497 = (0);
while(true){
if((i__3477_3497 < count__3476_3496)){
var test_3498 = cljs.core._nth.call(null,chunk__3475_3495,i__3477_3497);
cljs.compiler.emitln.call(null,"case ",test_3498,":");


var G__3499 = seq__3474_3494;
var G__3500 = chunk__3475_3495;
var G__3501 = count__3476_3496;
var G__3502 = (i__3477_3497 + (1));
seq__3474_3494 = G__3499;
chunk__3475_3495 = G__3500;
count__3476_3496 = G__3501;
i__3477_3497 = G__3502;
continue;
} else {
var temp__5804__auto___3503 = cljs.core.seq.call(null,seq__3474_3494);
if(temp__5804__auto___3503){
var seq__3474_3504__$1 = temp__5804__auto___3503;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__3474_3504__$1)){
var c__5565__auto___3505 = cljs.core.chunk_first.call(null,seq__3474_3504__$1);
var G__3506 = cljs.core.chunk_rest.call(null,seq__3474_3504__$1);
var G__3507 = c__5565__auto___3505;
var G__3508 = cljs.core.count.call(null,c__5565__auto___3505);
var G__3509 = (0);
seq__3474_3494 = G__3506;
chunk__3475_3495 = G__3507;
count__3476_3496 = G__3508;
i__3477_3497 = G__3509;
continue;
} else {
var test_3510 = cljs.core.first.call(null,seq__3474_3504__$1);
cljs.compiler.emitln.call(null,"case ",test_3510,":");


var G__3511 = cljs.core.next.call(null,seq__3474_3504__$1);
var G__3512 = null;
var G__3513 = (0);
var G__3514 = (0);
seq__3474_3494 = G__3511;
chunk__3475_3495 = G__3512;
count__3476_3496 = G__3513;
i__3477_3497 = G__3514;
continue;
}
} else {
}
}
break;
}

if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"expr","expr",745722291),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env))){
cljs.compiler.emitln.call(null,gs,"=",then_3493);
} else {
cljs.compiler.emitln.call(null,then_3493);
}

cljs.compiler.emitln.call(null,"break;");


var G__3515 = seq__3456_3484;
var G__3516 = chunk__3457_3485;
var G__3517 = count__3458_3486;
var G__3518 = (i__3459_3487 + (1));
seq__3456_3484 = G__3515;
chunk__3457_3485 = G__3516;
count__3458_3486 = G__3517;
i__3459_3487 = G__3518;
continue;
} else {
var temp__5804__auto___3519 = cljs.core.seq.call(null,seq__3456_3484);
if(temp__5804__auto___3519){
var seq__3456_3520__$1 = temp__5804__auto___3519;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__3456_3520__$1)){
var c__5565__auto___3521 = cljs.core.chunk_first.call(null,seq__3456_3520__$1);
var G__3522 = cljs.core.chunk_rest.call(null,seq__3456_3520__$1);
var G__3523 = c__5565__auto___3521;
var G__3524 = cljs.core.count.call(null,c__5565__auto___3521);
var G__3525 = (0);
seq__3456_3484 = G__3522;
chunk__3457_3485 = G__3523;
count__3458_3486 = G__3524;
i__3459_3487 = G__3525;
continue;
} else {
var map__3478_3526 = cljs.core.first.call(null,seq__3456_3520__$1);
var map__3478_3527__$1 = cljs.core.__destructure_map.call(null,map__3478_3526);
var ts_3528 = cljs.core.get.call(null,map__3478_3527__$1,new cljs.core.Keyword(null,"tests","tests",-1041085625));
var map__3479_3529 = cljs.core.get.call(null,map__3478_3527__$1,new cljs.core.Keyword(null,"then","then",460598070));
var map__3479_3530__$1 = cljs.core.__destructure_map.call(null,map__3479_3529);
var then_3531 = cljs.core.get.call(null,map__3479_3530__$1,new cljs.core.Keyword(null,"then","then",460598070));
var seq__3480_3532 = cljs.core.seq.call(null,cljs.core.map.call(null,new cljs.core.Keyword(null,"test","test",577538877),ts_3528));
var chunk__3481_3533 = null;
var count__3482_3534 = (0);
var i__3483_3535 = (0);
while(true){
if((i__3483_3535 < count__3482_3534)){
var test_3536 = cljs.core._nth.call(null,chunk__3481_3533,i__3483_3535);
cljs.compiler.emitln.call(null,"case ",test_3536,":");


var G__3537 = seq__3480_3532;
var G__3538 = chunk__3481_3533;
var G__3539 = count__3482_3534;
var G__3540 = (i__3483_3535 + (1));
seq__3480_3532 = G__3537;
chunk__3481_3533 = G__3538;
count__3482_3534 = G__3539;
i__3483_3535 = G__3540;
continue;
} else {
var temp__5804__auto___3541__$1 = cljs.core.seq.call(null,seq__3480_3532);
if(temp__5804__auto___3541__$1){
var seq__3480_3542__$1 = temp__5804__auto___3541__$1;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__3480_3542__$1)){
var c__5565__auto___3543 = cljs.core.chunk_first.call(null,seq__3480_3542__$1);
var G__3544 = cljs.core.chunk_rest.call(null,seq__3480_3542__$1);
var G__3545 = c__5565__auto___3543;
var G__3546 = cljs.core.count.call(null,c__5565__auto___3543);
var G__3547 = (0);
seq__3480_3532 = G__3544;
chunk__3481_3533 = G__3545;
count__3482_3534 = G__3546;
i__3483_3535 = G__3547;
continue;
} else {
var test_3548 = cljs.core.first.call(null,seq__3480_3542__$1);
cljs.compiler.emitln.call(null,"case ",test_3548,":");


var G__3549 = cljs.core.next.call(null,seq__3480_3542__$1);
var G__3550 = null;
var G__3551 = (0);
var G__3552 = (0);
seq__3480_3532 = G__3549;
chunk__3481_3533 = G__3550;
count__3482_3534 = G__3551;
i__3483_3535 = G__3552;
continue;
}
} else {
}
}
break;
}

if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"expr","expr",745722291),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env))){
cljs.compiler.emitln.call(null,gs,"=",then_3531);
} else {
cljs.compiler.emitln.call(null,then_3531);
}

cljs.compiler.emitln.call(null,"break;");


var G__3553 = cljs.core.next.call(null,seq__3456_3520__$1);
var G__3554 = null;
var G__3555 = (0);
var G__3556 = (0);
seq__3456_3484 = G__3553;
chunk__3457_3485 = G__3554;
count__3458_3486 = G__3555;
i__3459_3487 = G__3556;
continue;
}
} else {
}
}
break;
}

if(cljs.core.truth_(default$)){
cljs.compiler.emitln.call(null,"default:");

if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"expr","expr",745722291),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env))){
cljs.compiler.emitln.call(null,gs,"=",default$);
} else {
cljs.compiler.emitln.call(null,default$);
}
} else {
}

cljs.compiler.emitln.call(null,"}");

if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"expr","expr",745722291),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env))){
return cljs.compiler.emitln.call(null,"return ",gs,";})()");
} else {
return null;
}
}));
cljs.core._add_method.call(null,cljs.compiler.emit_STAR_,new cljs.core.Keyword(null,"throw","throw",-1044625833),(function (p__3557){
var map__3558 = p__3557;
var map__3558__$1 = cljs.core.__destructure_map.call(null,map__3558);
var throw$ = cljs.core.get.call(null,map__3558__$1,new cljs.core.Keyword(null,"exception","exception",-335277064));
var env = cljs.core.get.call(null,map__3558__$1,new cljs.core.Keyword(null,"env","env",-1815813235));
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"expr","expr",745722291),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env))){
return cljs.compiler.emits.call(null,"(function(){throw ",throw$,"})()");
} else {
return cljs.compiler.emitln.call(null,"throw ",throw$,";");
}
}));
cljs.compiler.base_types = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 15, ["boolean",null,"object",null,"*",null,"string",null,"Object",null,"Number",null,"null",null,"Date",null,"number",null,"String",null,"RegExp",null,"...*",null,"Array",null,"array",null,"Boolean",null], null), null);
cljs.compiler.mapped_types = new cljs.core.PersistentArrayMap(null, 1, ["nil","null"], null);
cljs.compiler.resolve_type = (function cljs$compiler$resolve_type(env,t){
if(cljs.core.truth_(cljs.core.get.call(null,cljs.compiler.base_types,t))){
return t;
} else {
if(cljs.core.truth_(cljs.core.get.call(null,cljs.compiler.mapped_types,t))){
return cljs.core.get.call(null,cljs.compiler.mapped_types,t);
} else {
if(goog.string.startsWith(t,"!")){
return ["!",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.compiler.resolve_type.call(null,env,cljs.core.subs.call(null,t,(1))))].join('');
} else {
if(goog.string.startsWith(t,"{")){
return t;
} else {
if(goog.string.startsWith(t,"function")){
var idx = t.lastIndexOf(":");
var vec__3560 = (((!(((-1) === idx))))?new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.subs.call(null,t,(0),idx),cljs.core.subs.call(null,t,(idx + (1)),cljs.core.count.call(null,t))], null):new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [t,null], null));
var fstr = cljs.core.nth.call(null,vec__3560,(0),null);
var rstr = cljs.core.nth.call(null,vec__3560,(1),null);
var ret_t = (cljs.core.truth_(rstr)?cljs.compiler.resolve_type.call(null,env,rstr):null);
var axstr = cljs.core.subs.call(null,fstr,(9),(cljs.core.count.call(null,fstr) - (1)));
var args_ts = ((clojure.string.blank_QMARK_.call(null,axstr))?null:cljs.core.map.call(null,cljs.core.comp.call(null,(function (p1__3559_SHARP_){
return cljs.compiler.resolve_type.call(null,env,p1__3559_SHARP_);
}),clojure.string.trim),clojure.string.split.call(null,axstr,/,/)));
var G__3563 = ["function(",clojure.string.join.call(null,",",args_ts),")"].join('');
if(cljs.core.truth_(ret_t)){
return [G__3563,":",cljs.core.str.cljs$core$IFn$_invoke$arity$1(ret_t)].join('');
} else {
return G__3563;
}
} else {
if(goog.string.endsWith(t,"=")){
return [cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.compiler.resolve_type.call(null,env,cljs.core.subs.call(null,t,(0),(cljs.core.count.call(null,t) - (1))))),"="].join('');
} else {
return cljs.compiler.munge.call(null,cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(cljs.analyzer.resolve_var.call(null,env,cljs.core.symbol.call(null,t)))));

}
}
}
}
}
}
});
cljs.compiler.resolve_types = (function cljs$compiler$resolve_types(env,ts){
var ts__$1 = cljs.core.subs.call(null,clojure.string.trim.call(null,ts),(1),(cljs.core.count.call(null,ts) - (1)));
var xs = clojure.string.split.call(null,ts__$1,/\|/);
return ["{",clojure.string.join.call(null,"|",cljs.core.map.call(null,(function (p1__3564_SHARP_){
return cljs.compiler.resolve_type.call(null,env,p1__3564_SHARP_);
}),xs)),"}"].join('');
});
cljs.compiler.munge_param_return = (function cljs$compiler$munge_param_return(env,line){
if(cljs.core.truth_(cljs.core.re_find.call(null,/@param/,line))){
var vec__3565 = cljs.core.map.call(null,clojure.string.trim,clojure.string.split.call(null,clojure.string.trim.call(null,line),/ /));
var seq__3566 = cljs.core.seq.call(null,vec__3565);
var first__3567 = cljs.core.first.call(null,seq__3566);
var seq__3566__$1 = cljs.core.next.call(null,seq__3566);
var p = first__3567;
var first__3567__$1 = cljs.core.first.call(null,seq__3566__$1);
var seq__3566__$2 = cljs.core.next.call(null,seq__3566__$1);
var ts = first__3567__$1;
var first__3567__$2 = cljs.core.first.call(null,seq__3566__$2);
var seq__3566__$3 = cljs.core.next.call(null,seq__3566__$2);
var n = first__3567__$2;
var xs = seq__3566__$3;
if(cljs.core.truth_((function (){var and__5041__auto__ = cljs.core._EQ_.call(null,"@param",p);
if(and__5041__auto__){
var and__5041__auto____$1 = ts;
if(cljs.core.truth_(and__5041__auto____$1)){
return goog.string.startsWith(ts,"{");
} else {
return and__5041__auto____$1;
}
} else {
return and__5041__auto__;
}
})())){
return clojure.string.join.call(null," ",cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [p,cljs.compiler.resolve_types.call(null,env,ts),cljs.compiler.munge.call(null,n)], null),xs));
} else {
return line;
}
} else {
if(cljs.core.truth_(cljs.core.re_find.call(null,/@return/,line))){
var vec__3568 = cljs.core.map.call(null,clojure.string.trim,clojure.string.split.call(null,clojure.string.trim.call(null,line),/ /));
var seq__3569 = cljs.core.seq.call(null,vec__3568);
var first__3570 = cljs.core.first.call(null,seq__3569);
var seq__3569__$1 = cljs.core.next.call(null,seq__3569);
var p = first__3570;
var first__3570__$1 = cljs.core.first.call(null,seq__3569__$1);
var seq__3569__$2 = cljs.core.next.call(null,seq__3569__$1);
var ts = first__3570__$1;
var xs = seq__3569__$2;
if(cljs.core.truth_((function (){var and__5041__auto__ = cljs.core._EQ_.call(null,"@return",p);
if(and__5041__auto__){
var and__5041__auto____$1 = ts;
if(cljs.core.truth_(and__5041__auto____$1)){
return goog.string.startsWith(ts,"{");
} else {
return and__5041__auto____$1;
}
} else {
return and__5041__auto__;
}
})())){
return clojure.string.join.call(null," ",cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [p,cljs.compiler.resolve_types.call(null,env,ts)], null),xs));
} else {
return line;
}
} else {
return line;

}
}
});
cljs.compiler.checking_types_QMARK_ = (function cljs$compiler$checking_types_QMARK_(){
return new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"warning","warning",-1685650671),null,new cljs.core.Keyword(null,"error","error",-978969032),null], null), null).call(null,cljs.core.get_in.call(null,cljs.core.deref.call(null,cljs.env._STAR_compiler_STAR_),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"options","options",99638489),new cljs.core.Keyword(null,"closure-warnings","closure-warnings",1362834211),new cljs.core.Keyword(null,"check-types","check-types",-833794607)], null)));
});
/**
 * Emit a nicely formatted comment string.
 */
cljs.compiler.emit_comment = (function cljs$compiler$emit_comment(var_args){
var G__3573 = arguments.length;
switch (G__3573) {
case 2:
return cljs.compiler.emit_comment.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.compiler.emit_comment.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs.compiler.emit_comment.cljs$core$IFn$_invoke$arity$2 = (function (doc,jsdoc){
return cljs.compiler.emit_comment.call(null,null,doc,jsdoc);
}));

(cljs.compiler.emit_comment.cljs$core$IFn$_invoke$arity$3 = (function (env,doc,jsdoc){
var docs = (cljs.core.truth_(doc)?new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [doc], null):null);
var docs__$1 = (cljs.core.truth_(jsdoc)?cljs.core.concat.call(null,docs,jsdoc):docs);
var docs__$2 = cljs.core.remove.call(null,cljs.core.nil_QMARK_,docs__$1);
var print_comment_lines = (function cljs$compiler$print_comment_lines(e){
var vec__3581 = cljs.core.map.call(null,(function (p1__3571_SHARP_){
if(cljs.core.truth_(cljs.compiler.checking_types_QMARK_.call(null))){
return cljs.compiler.munge_param_return.call(null,env,p1__3571_SHARP_);
} else {
return p1__3571_SHARP_;
}
}),clojure.string.split_lines.call(null,e));
var seq__3582 = cljs.core.seq.call(null,vec__3581);
var first__3583 = cljs.core.first.call(null,seq__3582);
var seq__3582__$1 = cljs.core.next.call(null,seq__3582);
var x = first__3583;
var ys = seq__3582__$1;
cljs.compiler.emitln.call(null," * ",clojure.string.replace.call(null,x,"*/","* /"));

var seq__3584 = cljs.core.seq.call(null,ys);
var chunk__3585 = null;
var count__3586 = (0);
var i__3587 = (0);
while(true){
if((i__3587 < count__3586)){
var next_line = cljs.core._nth.call(null,chunk__3585,i__3587);
cljs.compiler.emitln.call(null," * ",clojure.string.replace.call(null,clojure.string.replace.call(null,next_line,/^   /,""),"*/","* /"));


var G__3593 = seq__3584;
var G__3594 = chunk__3585;
var G__3595 = count__3586;
var G__3596 = (i__3587 + (1));
seq__3584 = G__3593;
chunk__3585 = G__3594;
count__3586 = G__3595;
i__3587 = G__3596;
continue;
} else {
var temp__5804__auto__ = cljs.core.seq.call(null,seq__3584);
if(temp__5804__auto__){
var seq__3584__$1 = temp__5804__auto__;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__3584__$1)){
var c__5565__auto__ = cljs.core.chunk_first.call(null,seq__3584__$1);
var G__3597 = cljs.core.chunk_rest.call(null,seq__3584__$1);
var G__3598 = c__5565__auto__;
var G__3599 = cljs.core.count.call(null,c__5565__auto__);
var G__3600 = (0);
seq__3584 = G__3597;
chunk__3585 = G__3598;
count__3586 = G__3599;
i__3587 = G__3600;
continue;
} else {
var next_line = cljs.core.first.call(null,seq__3584__$1);
cljs.compiler.emitln.call(null," * ",clojure.string.replace.call(null,clojure.string.replace.call(null,next_line,/^   /,""),"*/","* /"));


var G__3601 = cljs.core.next.call(null,seq__3584__$1);
var G__3602 = null;
var G__3603 = (0);
var G__3604 = (0);
seq__3584 = G__3601;
chunk__3585 = G__3602;
count__3586 = G__3603;
i__3587 = G__3604;
continue;
}
} else {
return null;
}
}
break;
}
});
if(cljs.core.seq.call(null,docs__$2)){
cljs.compiler.emitln.call(null,"/**");

var seq__3588_3605 = cljs.core.seq.call(null,docs__$2);
var chunk__3589_3606 = null;
var count__3590_3607 = (0);
var i__3591_3608 = (0);
while(true){
if((i__3591_3608 < count__3590_3607)){
var e_3609 = cljs.core._nth.call(null,chunk__3589_3606,i__3591_3608);
if(cljs.core.truth_(e_3609)){
print_comment_lines.call(null,e_3609);
} else {
}


var G__3610 = seq__3588_3605;
var G__3611 = chunk__3589_3606;
var G__3612 = count__3590_3607;
var G__3613 = (i__3591_3608 + (1));
seq__3588_3605 = G__3610;
chunk__3589_3606 = G__3611;
count__3590_3607 = G__3612;
i__3591_3608 = G__3613;
continue;
} else {
var temp__5804__auto___3614 = cljs.core.seq.call(null,seq__3588_3605);
if(temp__5804__auto___3614){
var seq__3588_3615__$1 = temp__5804__auto___3614;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__3588_3615__$1)){
var c__5565__auto___3616 = cljs.core.chunk_first.call(null,seq__3588_3615__$1);
var G__3617 = cljs.core.chunk_rest.call(null,seq__3588_3615__$1);
var G__3618 = c__5565__auto___3616;
var G__3619 = cljs.core.count.call(null,c__5565__auto___3616);
var G__3620 = (0);
seq__3588_3605 = G__3617;
chunk__3589_3606 = G__3618;
count__3590_3607 = G__3619;
i__3591_3608 = G__3620;
continue;
} else {
var e_3621 = cljs.core.first.call(null,seq__3588_3615__$1);
if(cljs.core.truth_(e_3621)){
print_comment_lines.call(null,e_3621);
} else {
}


var G__3622 = cljs.core.next.call(null,seq__3588_3615__$1);
var G__3623 = null;
var G__3624 = (0);
var G__3625 = (0);
seq__3588_3605 = G__3622;
chunk__3589_3606 = G__3623;
count__3590_3607 = G__3624;
i__3591_3608 = G__3625;
continue;
}
} else {
}
}
break;
}

return cljs.compiler.emitln.call(null," */");
} else {
return null;
}
}));

(cljs.compiler.emit_comment.cljs$lang$maxFixedArity = 3);

cljs.compiler.valid_define_value_QMARK_ = (function cljs$compiler$valid_define_value_QMARK_(x){
return ((typeof x === 'string') || (((x === true) || (((x === false) || (typeof x === 'number'))))));
});
cljs.compiler.get_define = (function cljs$compiler$get_define(mname,jsdoc){
var opts = cljs.core.get.call(null,cljs.core.deref.call(null,cljs.env._STAR_compiler_STAR_),new cljs.core.Keyword(null,"options","options",99638489));
var and__5041__auto__ = cljs.core.some.call(null,(function (p1__3627_SHARP_){
return goog.string.startsWith(p1__3627_SHARP_,"@define");
}),jsdoc);
if(cljs.core.truth_(and__5041__auto__)){
var and__5041__auto____$1 = opts;
if(cljs.core.truth_(and__5041__auto____$1)){
var and__5041__auto____$2 = cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"optimizations","optimizations",-2047476854).cljs$core$IFn$_invoke$arity$1(opts),new cljs.core.Keyword(null,"none","none",1333468478));
if(and__5041__auto____$2){
var define = cljs.core.get_in.call(null,opts,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"closure-defines","closure-defines",-1213856476),cljs.core.str.cljs$core$IFn$_invoke$arity$1(mname)], null));
if(cljs.compiler.valid_define_value_QMARK_.call(null,define)){
return cljs.core.pr_str.call(null,define);
} else {
return null;
}
} else {
return and__5041__auto____$2;
}
} else {
return and__5041__auto____$1;
}
} else {
return and__5041__auto__;
}
});
cljs.core._add_method.call(null,cljs.compiler.emit_STAR_,new cljs.core.Keyword(null,"def","def",-1043430536),(function (p__3628){
var map__3629 = p__3628;
var map__3629__$1 = cljs.core.__destructure_map.call(null,map__3629);
var doc = cljs.core.get.call(null,map__3629__$1,new cljs.core.Keyword(null,"doc","doc",1913296891));
var jsdoc = cljs.core.get.call(null,map__3629__$1,new cljs.core.Keyword(null,"jsdoc","jsdoc",1745183516));
var test = cljs.core.get.call(null,map__3629__$1,new cljs.core.Keyword(null,"test","test",577538877));
var goog_define = cljs.core.get.call(null,map__3629__$1,new cljs.core.Keyword(null,"goog-define","goog-define",-1048305441));
var init = cljs.core.get.call(null,map__3629__$1,new cljs.core.Keyword(null,"init","init",-1875481434));
var name = cljs.core.get.call(null,map__3629__$1,new cljs.core.Keyword(null,"name","name",1843675177));
var env = cljs.core.get.call(null,map__3629__$1,new cljs.core.Keyword(null,"env","env",-1815813235));
var export$ = cljs.core.get.call(null,map__3629__$1,new cljs.core.Keyword(null,"export","export",214356590));
var var$ = cljs.core.get.call(null,map__3629__$1,new cljs.core.Keyword(null,"var","var",-769682797));
var var_ast = cljs.core.get.call(null,map__3629__$1,new cljs.core.Keyword(null,"var-ast","var-ast",1200379319));
if(cljs.core.truth_((function (){var or__5043__auto__ = init;
if(cljs.core.truth_(or__5043__auto__)){
return or__5043__auto__;
} else {
return new cljs.core.Keyword(null,"def-emits-var","def-emits-var",-1551927320).cljs$core$IFn$_invoke$arity$1(env);
}
})())){
var mname = cljs.compiler.munge.call(null,name);
cljs.compiler.emit_comment.call(null,env,doc,cljs.core.concat.call(null,(cljs.core.truth_(goog_define)?new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [["@define {",cljs.core.str.cljs$core$IFn$_invoke$arity$1(goog_define),"}"].join('')], null):null),jsdoc,new cljs.core.Keyword(null,"jsdoc","jsdoc",1745183516).cljs$core$IFn$_invoke$arity$1(init)));

if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"return","return",-1891502105),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env))){
cljs.compiler.emitln.call(null,"return (");
} else {
}

if(cljs.core.truth_(new cljs.core.Keyword(null,"def-emits-var","def-emits-var",-1551927320).cljs$core$IFn$_invoke$arity$1(env))){
cljs.compiler.emitln.call(null,"(function (){");
} else {
}

cljs.compiler.emits.call(null,var$);

if(cljs.core.truth_(init)){
cljs.compiler.emits.call(null," = ",(function (){var temp__5802__auto__ = cljs.compiler.get_define.call(null,mname,jsdoc);
if(cljs.core.truth_(temp__5802__auto__)){
var define = temp__5802__auto__;
return define;
} else {
return init;
}
})());
} else {
}

if(cljs.core.truth_(new cljs.core.Keyword(null,"def-emits-var","def-emits-var",-1551927320).cljs$core$IFn$_invoke$arity$1(env))){
cljs.compiler.emitln.call(null,"; return (");

cljs.compiler.emits.call(null,cljs.core.merge.call(null,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"op","op",-1882987955),new cljs.core.Keyword(null,"the-var","the-var",1428415613),new cljs.core.Keyword(null,"env","env",-1815813235),cljs.core.assoc.call(null,env,new cljs.core.Keyword(null,"context","context",-830191113),new cljs.core.Keyword(null,"expr","expr",745722291))], null),var_ast));

cljs.compiler.emitln.call(null,");})()");
} else {
}

if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"return","return",-1891502105),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env))){
cljs.compiler.emitln.call(null,")");
} else {
}

if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"expr","expr",745722291),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env))){
} else {
cljs.compiler.emitln.call(null,";");
}

if(cljs.core.truth_(export$)){
cljs.compiler.emitln.call(null,"goog.exportSymbol('",cljs.compiler.munge.call(null,export$),"', ",mname,");");
} else {
}

if(cljs.core.truth_((function (){var and__5041__auto__ = cljs.analyzer._STAR_load_tests_STAR_;
if(cljs.core.truth_(and__5041__auto__)){
return test;
} else {
return and__5041__auto__;
}
})())){
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"expr","expr",745722291),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env))){
cljs.compiler.emitln.call(null,";");
} else {
}

return cljs.compiler.emitln.call(null,var$,".cljs$lang$test = ",test,";");
} else {
return null;
}
} else {
return null;
}
}));
cljs.compiler.emit_apply_to = (function cljs$compiler$emit_apply_to(p__3630){
var map__3631 = p__3630;
var map__3631__$1 = cljs.core.__destructure_map.call(null,map__3631);
var name = cljs.core.get.call(null,map__3631__$1,new cljs.core.Keyword(null,"name","name",1843675177));
var params = cljs.core.get.call(null,map__3631__$1,new cljs.core.Keyword(null,"params","params",710516235));
var env = cljs.core.get.call(null,map__3631__$1,new cljs.core.Keyword(null,"env","env",-1815813235));
var arglist = cljs.core.gensym.call(null,"arglist__");
var delegate_name = [cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.compiler.munge.call(null,name)),"__delegate"].join('');
cljs.compiler.emitln.call(null,"(function (",arglist,"){");

var seq__3632_3656 = cljs.core.seq.call(null,cljs.core.map_indexed.call(null,cljs.core.vector,cljs.core.drop_last.call(null,(2),params)));
var chunk__3633_3657 = null;
var count__3634_3658 = (0);
var i__3635_3659 = (0);
while(true){
if((i__3635_3659 < count__3634_3658)){
var vec__3642_3660 = cljs.core._nth.call(null,chunk__3633_3657,i__3635_3659);
var i_3661 = cljs.core.nth.call(null,vec__3642_3660,(0),null);
var param_3662 = cljs.core.nth.call(null,vec__3642_3660,(1),null);
cljs.compiler.emits.call(null,"var ");

cljs.compiler.emit.call(null,param_3662);

cljs.compiler.emits.call(null," = cljs.core.first(");

cljs.compiler.emitln.call(null,arglist,");");

cljs.compiler.emitln.call(null,arglist," = cljs.core.next(",arglist,");");


var G__3663 = seq__3632_3656;
var G__3664 = chunk__3633_3657;
var G__3665 = count__3634_3658;
var G__3666 = (i__3635_3659 + (1));
seq__3632_3656 = G__3663;
chunk__3633_3657 = G__3664;
count__3634_3658 = G__3665;
i__3635_3659 = G__3666;
continue;
} else {
var temp__5804__auto___3667 = cljs.core.seq.call(null,seq__3632_3656);
if(temp__5804__auto___3667){
var seq__3632_3668__$1 = temp__5804__auto___3667;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__3632_3668__$1)){
var c__5565__auto___3669 = cljs.core.chunk_first.call(null,seq__3632_3668__$1);
var G__3670 = cljs.core.chunk_rest.call(null,seq__3632_3668__$1);
var G__3671 = c__5565__auto___3669;
var G__3672 = cljs.core.count.call(null,c__5565__auto___3669);
var G__3673 = (0);
seq__3632_3656 = G__3670;
chunk__3633_3657 = G__3671;
count__3634_3658 = G__3672;
i__3635_3659 = G__3673;
continue;
} else {
var vec__3645_3674 = cljs.core.first.call(null,seq__3632_3668__$1);
var i_3675 = cljs.core.nth.call(null,vec__3645_3674,(0),null);
var param_3676 = cljs.core.nth.call(null,vec__3645_3674,(1),null);
cljs.compiler.emits.call(null,"var ");

cljs.compiler.emit.call(null,param_3676);

cljs.compiler.emits.call(null," = cljs.core.first(");

cljs.compiler.emitln.call(null,arglist,");");

cljs.compiler.emitln.call(null,arglist," = cljs.core.next(",arglist,");");


var G__3677 = cljs.core.next.call(null,seq__3632_3668__$1);
var G__3678 = null;
var G__3679 = (0);
var G__3680 = (0);
seq__3632_3656 = G__3677;
chunk__3633_3657 = G__3678;
count__3634_3658 = G__3679;
i__3635_3659 = G__3680;
continue;
}
} else {
}
}
break;
}

if(((1) < cljs.core.count.call(null,params))){
cljs.compiler.emits.call(null,"var ");

cljs.compiler.emit.call(null,cljs.core.last.call(null,cljs.core.butlast.call(null,params)));

cljs.compiler.emitln.call(null," = cljs.core.first(",arglist,");");

cljs.compiler.emits.call(null,"var ");

cljs.compiler.emit.call(null,cljs.core.last.call(null,params));

cljs.compiler.emitln.call(null," = cljs.core.rest(",arglist,");");

cljs.compiler.emits.call(null,"return ",delegate_name,"(");

var seq__3648_3681 = cljs.core.seq.call(null,params);
var chunk__3649_3682 = null;
var count__3650_3683 = (0);
var i__3651_3684 = (0);
while(true){
if((i__3651_3684 < count__3650_3683)){
var param_3685 = cljs.core._nth.call(null,chunk__3649_3682,i__3651_3684);
cljs.compiler.emit.call(null,param_3685);

if(cljs.core._EQ_.call(null,param_3685,cljs.core.last.call(null,params))){
} else {
cljs.compiler.emits.call(null,",");
}


var G__3686 = seq__3648_3681;
var G__3687 = chunk__3649_3682;
var G__3688 = count__3650_3683;
var G__3689 = (i__3651_3684 + (1));
seq__3648_3681 = G__3686;
chunk__3649_3682 = G__3687;
count__3650_3683 = G__3688;
i__3651_3684 = G__3689;
continue;
} else {
var temp__5804__auto___3690 = cljs.core.seq.call(null,seq__3648_3681);
if(temp__5804__auto___3690){
var seq__3648_3691__$1 = temp__5804__auto___3690;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__3648_3691__$1)){
var c__5565__auto___3692 = cljs.core.chunk_first.call(null,seq__3648_3691__$1);
var G__3693 = cljs.core.chunk_rest.call(null,seq__3648_3691__$1);
var G__3694 = c__5565__auto___3692;
var G__3695 = cljs.core.count.call(null,c__5565__auto___3692);
var G__3696 = (0);
seq__3648_3681 = G__3693;
chunk__3649_3682 = G__3694;
count__3650_3683 = G__3695;
i__3651_3684 = G__3696;
continue;
} else {
var param_3697 = cljs.core.first.call(null,seq__3648_3691__$1);
cljs.compiler.emit.call(null,param_3697);

if(cljs.core._EQ_.call(null,param_3697,cljs.core.last.call(null,params))){
} else {
cljs.compiler.emits.call(null,",");
}


var G__3698 = cljs.core.next.call(null,seq__3648_3691__$1);
var G__3699 = null;
var G__3700 = (0);
var G__3701 = (0);
seq__3648_3681 = G__3698;
chunk__3649_3682 = G__3699;
count__3650_3683 = G__3700;
i__3651_3684 = G__3701;
continue;
}
} else {
}
}
break;
}

cljs.compiler.emitln.call(null,");");
} else {
cljs.compiler.emits.call(null,"var ");

cljs.compiler.emit.call(null,cljs.core.last.call(null,params));

cljs.compiler.emitln.call(null," = cljs.core.seq(",arglist,");");

cljs.compiler.emits.call(null,"return ",delegate_name,"(");

var seq__3652_3702 = cljs.core.seq.call(null,params);
var chunk__3653_3703 = null;
var count__3654_3704 = (0);
var i__3655_3705 = (0);
while(true){
if((i__3655_3705 < count__3654_3704)){
var param_3706 = cljs.core._nth.call(null,chunk__3653_3703,i__3655_3705);
cljs.compiler.emit.call(null,param_3706);

if(cljs.core._EQ_.call(null,param_3706,cljs.core.last.call(null,params))){
} else {
cljs.compiler.emits.call(null,",");
}


var G__3707 = seq__3652_3702;
var G__3708 = chunk__3653_3703;
var G__3709 = count__3654_3704;
var G__3710 = (i__3655_3705 + (1));
seq__3652_3702 = G__3707;
chunk__3653_3703 = G__3708;
count__3654_3704 = G__3709;
i__3655_3705 = G__3710;
continue;
} else {
var temp__5804__auto___3711 = cljs.core.seq.call(null,seq__3652_3702);
if(temp__5804__auto___3711){
var seq__3652_3712__$1 = temp__5804__auto___3711;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__3652_3712__$1)){
var c__5565__auto___3713 = cljs.core.chunk_first.call(null,seq__3652_3712__$1);
var G__3714 = cljs.core.chunk_rest.call(null,seq__3652_3712__$1);
var G__3715 = c__5565__auto___3713;
var G__3716 = cljs.core.count.call(null,c__5565__auto___3713);
var G__3717 = (0);
seq__3652_3702 = G__3714;
chunk__3653_3703 = G__3715;
count__3654_3704 = G__3716;
i__3655_3705 = G__3717;
continue;
} else {
var param_3718 = cljs.core.first.call(null,seq__3652_3712__$1);
cljs.compiler.emit.call(null,param_3718);

if(cljs.core._EQ_.call(null,param_3718,cljs.core.last.call(null,params))){
} else {
cljs.compiler.emits.call(null,",");
}


var G__3719 = cljs.core.next.call(null,seq__3652_3712__$1);
var G__3720 = null;
var G__3721 = (0);
var G__3722 = (0);
seq__3652_3702 = G__3719;
chunk__3653_3703 = G__3720;
count__3654_3704 = G__3721;
i__3655_3705 = G__3722;
continue;
}
} else {
}
}
break;
}

cljs.compiler.emitln.call(null,");");
}

return cljs.compiler.emits.call(null,"})");
});
cljs.compiler.emit_fn_params = (function cljs$compiler$emit_fn_params(params){
var seq__3723 = cljs.core.seq.call(null,params);
var chunk__3724 = null;
var count__3725 = (0);
var i__3726 = (0);
while(true){
if((i__3726 < count__3725)){
var param = cljs.core._nth.call(null,chunk__3724,i__3726);
cljs.compiler.emit.call(null,param);

if(cljs.core._EQ_.call(null,param,cljs.core.last.call(null,params))){
} else {
cljs.compiler.emits.call(null,",");
}


var G__3727 = seq__3723;
var G__3728 = chunk__3724;
var G__3729 = count__3725;
var G__3730 = (i__3726 + (1));
seq__3723 = G__3727;
chunk__3724 = G__3728;
count__3725 = G__3729;
i__3726 = G__3730;
continue;
} else {
var temp__5804__auto__ = cljs.core.seq.call(null,seq__3723);
if(temp__5804__auto__){
var seq__3723__$1 = temp__5804__auto__;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__3723__$1)){
var c__5565__auto__ = cljs.core.chunk_first.call(null,seq__3723__$1);
var G__3731 = cljs.core.chunk_rest.call(null,seq__3723__$1);
var G__3732 = c__5565__auto__;
var G__3733 = cljs.core.count.call(null,c__5565__auto__);
var G__3734 = (0);
seq__3723 = G__3731;
chunk__3724 = G__3732;
count__3725 = G__3733;
i__3726 = G__3734;
continue;
} else {
var param = cljs.core.first.call(null,seq__3723__$1);
cljs.compiler.emit.call(null,param);

if(cljs.core._EQ_.call(null,param,cljs.core.last.call(null,params))){
} else {
cljs.compiler.emits.call(null,",");
}


var G__3735 = cljs.core.next.call(null,seq__3723__$1);
var G__3736 = null;
var G__3737 = (0);
var G__3738 = (0);
seq__3723 = G__3735;
chunk__3724 = G__3736;
count__3725 = G__3737;
i__3726 = G__3738;
continue;
}
} else {
return null;
}
}
break;
}
});
cljs.compiler.emit_fn_method = (function cljs$compiler$emit_fn_method(p__3739){
var map__3740 = p__3739;
var map__3740__$1 = cljs.core.__destructure_map.call(null,map__3740);
var expr = cljs.core.get.call(null,map__3740__$1,new cljs.core.Keyword(null,"body","body",-2049205669));
var type = cljs.core.get.call(null,map__3740__$1,new cljs.core.Keyword(null,"type","type",1174270348));
var name = cljs.core.get.call(null,map__3740__$1,new cljs.core.Keyword(null,"name","name",1843675177));
var params = cljs.core.get.call(null,map__3740__$1,new cljs.core.Keyword(null,"params","params",710516235));
var env = cljs.core.get.call(null,map__3740__$1,new cljs.core.Keyword(null,"env","env",-1815813235));
var recurs = cljs.core.get.call(null,map__3740__$1,new cljs.core.Keyword(null,"recurs","recurs",-1959309309));
var env__9253__auto__ = env;
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"return","return",-1891502105),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env__9253__auto__))){
cljs.compiler.emits.call(null,"return ");
} else {
}

cljs.compiler.emits.call(null,"(function ",cljs.compiler.munge.call(null,name),"(");

cljs.compiler.emit_fn_params.call(null,params);

cljs.compiler.emitln.call(null,"){");

if(cljs.core.truth_(type)){
cljs.compiler.emitln.call(null,"var self__ = this;");
} else {
}

if(cljs.core.truth_(recurs)){
cljs.compiler.emitln.call(null,"while(true){");
} else {
}

cljs.compiler.emits.call(null,expr);

if(cljs.core.truth_(recurs)){
cljs.compiler.emitln.call(null,"break;");

cljs.compiler.emitln.call(null,"}");
} else {
}

cljs.compiler.emits.call(null,"})");

if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"expr","expr",745722291),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env__9253__auto__))){
return null;
} else {
return cljs.compiler.emitln.call(null,";");
}
});
/**
 * Emit code that copies function arguments into an array starting at an index.
 *   Returns name of var holding the array.
 */
cljs.compiler.emit_arguments_to_array = (function cljs$compiler$emit_arguments_to_array(startslice){
if((((startslice >= (0))) && (cljs.core.integer_QMARK_.call(null,startslice)))){
} else {
throw (new Error("Assert failed: (and (>= startslice 0) (integer? startslice))"));
}

var mname = cljs.compiler.munge.call(null,cljs.core.gensym.call(null));
var i = [cljs.core.str.cljs$core$IFn$_invoke$arity$1(mname),"__i"].join('');
var a = [cljs.core.str.cljs$core$IFn$_invoke$arity$1(mname),"__a"].join('');
cljs.compiler.emitln.call(null,"var ",i," = 0, ",a," = new Array(arguments.length -  ",startslice,");");

cljs.compiler.emitln.call(null,"while (",i," < ",a,".length) {",a,"[",i,"] = arguments[",i," + ",startslice,"]; ++",i,";}");

return a;
});
cljs.compiler.emit_variadic_fn_method = (function cljs$compiler$emit_variadic_fn_method(p__3741){
var map__3742 = p__3741;
var map__3742__$1 = cljs.core.__destructure_map.call(null,map__3742);
var f = map__3742__$1;
var expr = cljs.core.get.call(null,map__3742__$1,new cljs.core.Keyword(null,"body","body",-2049205669));
var max_fixed_arity = cljs.core.get.call(null,map__3742__$1,new cljs.core.Keyword(null,"fixed-arity","fixed-arity",1586445869));
var variadic = cljs.core.get.call(null,map__3742__$1,new cljs.core.Keyword(null,"variadic?","variadic?",584179762));
var type = cljs.core.get.call(null,map__3742__$1,new cljs.core.Keyword(null,"type","type",1174270348));
var name = cljs.core.get.call(null,map__3742__$1,new cljs.core.Keyword(null,"name","name",1843675177));
var params = cljs.core.get.call(null,map__3742__$1,new cljs.core.Keyword(null,"params","params",710516235));
var env = cljs.core.get.call(null,map__3742__$1,new cljs.core.Keyword(null,"env","env",-1815813235));
var recurs = cljs.core.get.call(null,map__3742__$1,new cljs.core.Keyword(null,"recurs","recurs",-1959309309));
var env__9253__auto__ = env;
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"return","return",-1891502105),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env__9253__auto__))){
cljs.compiler.emits.call(null,"return ");
} else {
}

var name_3751__$1 = (function (){var or__5043__auto__ = name;
if(cljs.core.truth_(or__5043__auto__)){
return or__5043__auto__;
} else {
return cljs.core.gensym.call(null);
}
})();
var mname_3752 = cljs.compiler.munge.call(null,name_3751__$1);
var delegate_name_3753 = [cljs.core.str.cljs$core$IFn$_invoke$arity$1(mname_3752),"__delegate"].join('');
cljs.compiler.emitln.call(null,"(function() { ");

cljs.compiler.emits.call(null,"var ",delegate_name_3753," = function (");

var seq__3743_3754 = cljs.core.seq.call(null,params);
var chunk__3744_3755 = null;
var count__3745_3756 = (0);
var i__3746_3757 = (0);
while(true){
if((i__3746_3757 < count__3745_3756)){
var param_3758 = cljs.core._nth.call(null,chunk__3744_3755,i__3746_3757);
cljs.compiler.emit.call(null,param_3758);

if(cljs.core._EQ_.call(null,param_3758,cljs.core.last.call(null,params))){
} else {
cljs.compiler.emits.call(null,",");
}


var G__3759 = seq__3743_3754;
var G__3760 = chunk__3744_3755;
var G__3761 = count__3745_3756;
var G__3762 = (i__3746_3757 + (1));
seq__3743_3754 = G__3759;
chunk__3744_3755 = G__3760;
count__3745_3756 = G__3761;
i__3746_3757 = G__3762;
continue;
} else {
var temp__5804__auto___3763 = cljs.core.seq.call(null,seq__3743_3754);
if(temp__5804__auto___3763){
var seq__3743_3764__$1 = temp__5804__auto___3763;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__3743_3764__$1)){
var c__5565__auto___3765 = cljs.core.chunk_first.call(null,seq__3743_3764__$1);
var G__3766 = cljs.core.chunk_rest.call(null,seq__3743_3764__$1);
var G__3767 = c__5565__auto___3765;
var G__3768 = cljs.core.count.call(null,c__5565__auto___3765);
var G__3769 = (0);
seq__3743_3754 = G__3766;
chunk__3744_3755 = G__3767;
count__3745_3756 = G__3768;
i__3746_3757 = G__3769;
continue;
} else {
var param_3770 = cljs.core.first.call(null,seq__3743_3764__$1);
cljs.compiler.emit.call(null,param_3770);

if(cljs.core._EQ_.call(null,param_3770,cljs.core.last.call(null,params))){
} else {
cljs.compiler.emits.call(null,",");
}


var G__3771 = cljs.core.next.call(null,seq__3743_3764__$1);
var G__3772 = null;
var G__3773 = (0);
var G__3774 = (0);
seq__3743_3754 = G__3771;
chunk__3744_3755 = G__3772;
count__3745_3756 = G__3773;
i__3746_3757 = G__3774;
continue;
}
} else {
}
}
break;
}

cljs.compiler.emitln.call(null,"){");

if(cljs.core.truth_(type)){
cljs.compiler.emitln.call(null,"var self__ = this;");
} else {
}

if(cljs.core.truth_(recurs)){
cljs.compiler.emitln.call(null,"while(true){");
} else {
}

cljs.compiler.emits.call(null,expr);

if(cljs.core.truth_(recurs)){
cljs.compiler.emitln.call(null,"break;");

cljs.compiler.emitln.call(null,"}");
} else {
}

cljs.compiler.emitln.call(null,"};");

cljs.compiler.emitln.call(null,"var ",mname_3752," = function (",cljs.compiler.comma_sep.call(null,(cljs.core.truth_(variadic)?cljs.core.concat.call(null,cljs.core.butlast.call(null,params),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"var_args","var_args",1214280389,null)], null)):params)),"){");

if(cljs.core.truth_(type)){
cljs.compiler.emitln.call(null,"var self__ = this;");
} else {
}

if(cljs.core.truth_(variadic)){
cljs.compiler.emits.call(null,"var ");

cljs.compiler.emit.call(null,cljs.core.last.call(null,params));

cljs.compiler.emitln.call(null," = null;");

cljs.compiler.emitln.call(null,"if (arguments.length > ",(cljs.core.count.call(null,params) - (1)),") {");

var a_3775 = cljs.compiler.emit_arguments_to_array.call(null,(cljs.core.count.call(null,params) - (1)));
cljs.compiler.emitln.call(null,"  ",cljs.core.last.call(null,params)," = new cljs.core.IndexedSeq(",a_3775,",0,null);");

cljs.compiler.emitln.call(null,"} ");
} else {
}

cljs.compiler.emits.call(null,"return ",delegate_name_3753,".call(this,");

var seq__3747_3776 = cljs.core.seq.call(null,params);
var chunk__3748_3777 = null;
var count__3749_3778 = (0);
var i__3750_3779 = (0);
while(true){
if((i__3750_3779 < count__3749_3778)){
var param_3780 = cljs.core._nth.call(null,chunk__3748_3777,i__3750_3779);
cljs.compiler.emit.call(null,param_3780);

if(cljs.core._EQ_.call(null,param_3780,cljs.core.last.call(null,params))){
} else {
cljs.compiler.emits.call(null,",");
}


var G__3781 = seq__3747_3776;
var G__3782 = chunk__3748_3777;
var G__3783 = count__3749_3778;
var G__3784 = (i__3750_3779 + (1));
seq__3747_3776 = G__3781;
chunk__3748_3777 = G__3782;
count__3749_3778 = G__3783;
i__3750_3779 = G__3784;
continue;
} else {
var temp__5804__auto___3785 = cljs.core.seq.call(null,seq__3747_3776);
if(temp__5804__auto___3785){
var seq__3747_3786__$1 = temp__5804__auto___3785;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__3747_3786__$1)){
var c__5565__auto___3787 = cljs.core.chunk_first.call(null,seq__3747_3786__$1);
var G__3788 = cljs.core.chunk_rest.call(null,seq__3747_3786__$1);
var G__3789 = c__5565__auto___3787;
var G__3790 = cljs.core.count.call(null,c__5565__auto___3787);
var G__3791 = (0);
seq__3747_3776 = G__3788;
chunk__3748_3777 = G__3789;
count__3749_3778 = G__3790;
i__3750_3779 = G__3791;
continue;
} else {
var param_3792 = cljs.core.first.call(null,seq__3747_3786__$1);
cljs.compiler.emit.call(null,param_3792);

if(cljs.core._EQ_.call(null,param_3792,cljs.core.last.call(null,params))){
} else {
cljs.compiler.emits.call(null,",");
}


var G__3793 = cljs.core.next.call(null,seq__3747_3786__$1);
var G__3794 = null;
var G__3795 = (0);
var G__3796 = (0);
seq__3747_3776 = G__3793;
chunk__3748_3777 = G__3794;
count__3749_3778 = G__3795;
i__3750_3779 = G__3796;
continue;
}
} else {
}
}
break;
}

cljs.compiler.emits.call(null,");");

cljs.compiler.emitln.call(null,"};");

cljs.compiler.emitln.call(null,mname_3752,".cljs$lang$maxFixedArity = ",max_fixed_arity,";");

cljs.compiler.emits.call(null,mname_3752,".cljs$lang$applyTo = ");

cljs.compiler.emit_apply_to.call(null,cljs.core.assoc.call(null,f,new cljs.core.Keyword(null,"name","name",1843675177),name_3751__$1));

cljs.compiler.emitln.call(null,";");

cljs.compiler.emitln.call(null,mname_3752,".cljs$core$IFn$_invoke$arity$variadic = ",delegate_name_3753,";");

cljs.compiler.emitln.call(null,"return ",mname_3752,";");

cljs.compiler.emitln.call(null,"})()");

if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"expr","expr",745722291),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env__9253__auto__))){
return null;
} else {
return cljs.compiler.emitln.call(null,";");
}
});
cljs.core._add_method.call(null,cljs.compiler.emit_STAR_,new cljs.core.Keyword(null,"fn","fn",-1175266204),(function (p__3800){
var map__3801 = p__3800;
var map__3801__$1 = cljs.core.__destructure_map.call(null,map__3801);
var variadic = cljs.core.get.call(null,map__3801__$1,new cljs.core.Keyword(null,"variadic?","variadic?",584179762));
var name = cljs.core.get.call(null,map__3801__$1,new cljs.core.Keyword(null,"name","name",1843675177));
var env = cljs.core.get.call(null,map__3801__$1,new cljs.core.Keyword(null,"env","env",-1815813235));
var methods$ = cljs.core.get.call(null,map__3801__$1,new cljs.core.Keyword(null,"methods","methods",453930866));
var max_fixed_arity = cljs.core.get.call(null,map__3801__$1,new cljs.core.Keyword(null,"max-fixed-arity","max-fixed-arity",-690205543));
var recur_frames = cljs.core.get.call(null,map__3801__$1,new cljs.core.Keyword(null,"recur-frames","recur-frames",-307205196));
var in_loop = cljs.core.get.call(null,map__3801__$1,new cljs.core.Keyword(null,"in-loop","in-loop",-187298246));
var loop_lets = cljs.core.get.call(null,map__3801__$1,new cljs.core.Keyword(null,"loop-lets","loop-lets",2036794185));
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"statement","statement",-32780863),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env))){
return null;
} else {
var recur_params = cljs.core.mapcat.call(null,new cljs.core.Keyword(null,"params","params",710516235),cljs.core.filter.call(null,(function (p1__3797_SHARP_){
var and__5041__auto__ = p1__3797_SHARP_;
if(cljs.core.truth_(and__5041__auto__)){
return cljs.core.deref.call(null,new cljs.core.Keyword(null,"flag","flag",1088647881).cljs$core$IFn$_invoke$arity$1(p1__3797_SHARP_));
} else {
return and__5041__auto__;
}
}),recur_frames));
var loop_locals = cljs.core.seq.call(null,cljs.core.map.call(null,cljs.compiler.munge,cljs.core.concat.call(null,recur_params,(cljs.core.truth_((function (){var or__5043__auto__ = in_loop;
if(cljs.core.truth_(or__5043__auto__)){
return or__5043__auto__;
} else {
return cljs.core.seq.call(null,recur_params);
}
})())?cljs.core.mapcat.call(null,new cljs.core.Keyword(null,"params","params",710516235),loop_lets):null))));
if(loop_locals){
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"return","return",-1891502105),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env))){
cljs.compiler.emits.call(null,"return ");
} else {
}

cljs.compiler.emitln.call(null,"((function (",cljs.compiler.comma_sep.call(null,cljs.core.map.call(null,cljs.compiler.munge,loop_locals)),"){");

if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"return","return",-1891502105),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env))){
} else {
cljs.compiler.emits.call(null,"return ");
}
} else {
}

if(cljs.core._EQ_.call(null,(1),cljs.core.count.call(null,methods$))){
if(cljs.core.truth_(variadic)){
cljs.compiler.emit_variadic_fn_method.call(null,cljs.core.assoc.call(null,cljs.core.first.call(null,methods$),new cljs.core.Keyword(null,"name","name",1843675177),name));
} else {
cljs.compiler.emit_fn_method.call(null,cljs.core.assoc.call(null,cljs.core.first.call(null,methods$),new cljs.core.Keyword(null,"name","name",1843675177),name));
}
} else {
var name_3853__$1 = (function (){var or__5043__auto__ = name;
if(cljs.core.truth_(or__5043__auto__)){
return or__5043__auto__;
} else {
return cljs.core.gensym.call(null);
}
})();
var mname_3854 = cljs.compiler.munge.call(null,name_3853__$1);
var maxparams_3855 = cljs.core.apply.call(null,cljs.core.max_key,cljs.core.count,cljs.core.map.call(null,new cljs.core.Keyword(null,"params","params",710516235),methods$));
var mmap_3856 = cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.call(null,(function (method){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.compiler.munge.call(null,cljs.core.symbol.call(null,[cljs.core.str.cljs$core$IFn$_invoke$arity$1(mname_3854),"__",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.count.call(null,new cljs.core.Keyword(null,"params","params",710516235).cljs$core$IFn$_invoke$arity$1(method)))].join(''))),method], null);
}),methods$));
var ms_3857 = cljs.core.sort_by.call(null,(function (p1__3798_SHARP_){
return cljs.core.count.call(null,new cljs.core.Keyword(null,"params","params",710516235).cljs$core$IFn$_invoke$arity$1(cljs.core.second.call(null,p1__3798_SHARP_)));
}),cljs.core.seq.call(null,mmap_3856));
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"return","return",-1891502105),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env))){
cljs.compiler.emits.call(null,"return ");
} else {
}

cljs.compiler.emitln.call(null,"(function() {");

cljs.compiler.emitln.call(null,"var ",mname_3854," = null;");

var seq__3802_3858 = cljs.core.seq.call(null,ms_3857);
var chunk__3803_3859 = null;
var count__3804_3860 = (0);
var i__3805_3861 = (0);
while(true){
if((i__3805_3861 < count__3804_3860)){
var vec__3812_3862 = cljs.core._nth.call(null,chunk__3803_3859,i__3805_3861);
var n_3863 = cljs.core.nth.call(null,vec__3812_3862,(0),null);
var meth_3864 = cljs.core.nth.call(null,vec__3812_3862,(1),null);
cljs.compiler.emits.call(null,"var ",n_3863," = ");

if(cljs.core.truth_(new cljs.core.Keyword(null,"variadic?","variadic?",584179762).cljs$core$IFn$_invoke$arity$1(meth_3864))){
cljs.compiler.emit_variadic_fn_method.call(null,meth_3864);
} else {
cljs.compiler.emit_fn_method.call(null,meth_3864);
}

cljs.compiler.emitln.call(null,";");


var G__3865 = seq__3802_3858;
var G__3866 = chunk__3803_3859;
var G__3867 = count__3804_3860;
var G__3868 = (i__3805_3861 + (1));
seq__3802_3858 = G__3865;
chunk__3803_3859 = G__3866;
count__3804_3860 = G__3867;
i__3805_3861 = G__3868;
continue;
} else {
var temp__5804__auto___3869 = cljs.core.seq.call(null,seq__3802_3858);
if(temp__5804__auto___3869){
var seq__3802_3870__$1 = temp__5804__auto___3869;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__3802_3870__$1)){
var c__5565__auto___3871 = cljs.core.chunk_first.call(null,seq__3802_3870__$1);
var G__3872 = cljs.core.chunk_rest.call(null,seq__3802_3870__$1);
var G__3873 = c__5565__auto___3871;
var G__3874 = cljs.core.count.call(null,c__5565__auto___3871);
var G__3875 = (0);
seq__3802_3858 = G__3872;
chunk__3803_3859 = G__3873;
count__3804_3860 = G__3874;
i__3805_3861 = G__3875;
continue;
} else {
var vec__3815_3876 = cljs.core.first.call(null,seq__3802_3870__$1);
var n_3877 = cljs.core.nth.call(null,vec__3815_3876,(0),null);
var meth_3878 = cljs.core.nth.call(null,vec__3815_3876,(1),null);
cljs.compiler.emits.call(null,"var ",n_3877," = ");

if(cljs.core.truth_(new cljs.core.Keyword(null,"variadic?","variadic?",584179762).cljs$core$IFn$_invoke$arity$1(meth_3878))){
cljs.compiler.emit_variadic_fn_method.call(null,meth_3878);
} else {
cljs.compiler.emit_fn_method.call(null,meth_3878);
}

cljs.compiler.emitln.call(null,";");


var G__3879 = cljs.core.next.call(null,seq__3802_3870__$1);
var G__3880 = null;
var G__3881 = (0);
var G__3882 = (0);
seq__3802_3858 = G__3879;
chunk__3803_3859 = G__3880;
count__3804_3860 = G__3881;
i__3805_3861 = G__3882;
continue;
}
} else {
}
}
break;
}

cljs.compiler.emitln.call(null,mname_3854," = function(",cljs.compiler.comma_sep.call(null,(cljs.core.truth_(variadic)?cljs.core.concat.call(null,cljs.core.butlast.call(null,maxparams_3855),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"var_args","var_args",1214280389,null)], null)):maxparams_3855)),"){");

if(cljs.core.truth_(variadic)){
cljs.compiler.emits.call(null,"var ");

cljs.compiler.emit.call(null,cljs.core.last.call(null,maxparams_3855));

cljs.compiler.emitln.call(null," = var_args;");
} else {
}

cljs.compiler.emitln.call(null,"switch(arguments.length){");

var seq__3818_3883 = cljs.core.seq.call(null,ms_3857);
var chunk__3819_3884 = null;
var count__3820_3885 = (0);
var i__3821_3886 = (0);
while(true){
if((i__3821_3886 < count__3820_3885)){
var vec__3828_3887 = cljs.core._nth.call(null,chunk__3819_3884,i__3821_3886);
var n_3888 = cljs.core.nth.call(null,vec__3828_3887,(0),null);
var meth_3889 = cljs.core.nth.call(null,vec__3828_3887,(1),null);
if(cljs.core.truth_(new cljs.core.Keyword(null,"variadic?","variadic?",584179762).cljs$core$IFn$_invoke$arity$1(meth_3889))){
cljs.compiler.emitln.call(null,"default:");

var restarg_3890 = cljs.compiler.munge.call(null,cljs.core.gensym.call(null));
cljs.compiler.emitln.call(null,"var ",restarg_3890," = null;");

cljs.compiler.emitln.call(null,"if (arguments.length > ",max_fixed_arity,") {");

var a_3891 = cljs.compiler.emit_arguments_to_array.call(null,max_fixed_arity);
cljs.compiler.emitln.call(null,restarg_3890," = new cljs.core.IndexedSeq(",a_3891,",0,null);");

cljs.compiler.emitln.call(null,"}");

cljs.compiler.emitln.call(null,"return ",n_3888,".cljs$core$IFn$_invoke$arity$variadic(",cljs.compiler.comma_sep.call(null,cljs.core.butlast.call(null,maxparams_3855)),(((cljs.core.count.call(null,maxparams_3855) > (1)))?", ":null),restarg_3890,");");
} else {
var pcnt_3892 = cljs.core.count.call(null,new cljs.core.Keyword(null,"params","params",710516235).cljs$core$IFn$_invoke$arity$1(meth_3889));
cljs.compiler.emitln.call(null,"case ",pcnt_3892,":");

cljs.compiler.emitln.call(null,"return ",n_3888,".call(this",(((pcnt_3892 === (0)))?null:(new cljs.core.List(null,",",(new cljs.core.List(null,cljs.compiler.comma_sep.call(null,cljs.core.take.call(null,pcnt_3892,maxparams_3855)),null,(1),null)),(2),null))),");");
}


var G__3893 = seq__3818_3883;
var G__3894 = chunk__3819_3884;
var G__3895 = count__3820_3885;
var G__3896 = (i__3821_3886 + (1));
seq__3818_3883 = G__3893;
chunk__3819_3884 = G__3894;
count__3820_3885 = G__3895;
i__3821_3886 = G__3896;
continue;
} else {
var temp__5804__auto___3897 = cljs.core.seq.call(null,seq__3818_3883);
if(temp__5804__auto___3897){
var seq__3818_3898__$1 = temp__5804__auto___3897;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__3818_3898__$1)){
var c__5565__auto___3899 = cljs.core.chunk_first.call(null,seq__3818_3898__$1);
var G__3900 = cljs.core.chunk_rest.call(null,seq__3818_3898__$1);
var G__3901 = c__5565__auto___3899;
var G__3902 = cljs.core.count.call(null,c__5565__auto___3899);
var G__3903 = (0);
seq__3818_3883 = G__3900;
chunk__3819_3884 = G__3901;
count__3820_3885 = G__3902;
i__3821_3886 = G__3903;
continue;
} else {
var vec__3831_3904 = cljs.core.first.call(null,seq__3818_3898__$1);
var n_3905 = cljs.core.nth.call(null,vec__3831_3904,(0),null);
var meth_3906 = cljs.core.nth.call(null,vec__3831_3904,(1),null);
if(cljs.core.truth_(new cljs.core.Keyword(null,"variadic?","variadic?",584179762).cljs$core$IFn$_invoke$arity$1(meth_3906))){
cljs.compiler.emitln.call(null,"default:");

var restarg_3907 = cljs.compiler.munge.call(null,cljs.core.gensym.call(null));
cljs.compiler.emitln.call(null,"var ",restarg_3907," = null;");

cljs.compiler.emitln.call(null,"if (arguments.length > ",max_fixed_arity,") {");

var a_3908 = cljs.compiler.emit_arguments_to_array.call(null,max_fixed_arity);
cljs.compiler.emitln.call(null,restarg_3907," = new cljs.core.IndexedSeq(",a_3908,",0,null);");

cljs.compiler.emitln.call(null,"}");

cljs.compiler.emitln.call(null,"return ",n_3905,".cljs$core$IFn$_invoke$arity$variadic(",cljs.compiler.comma_sep.call(null,cljs.core.butlast.call(null,maxparams_3855)),(((cljs.core.count.call(null,maxparams_3855) > (1)))?", ":null),restarg_3907,");");
} else {
var pcnt_3909 = cljs.core.count.call(null,new cljs.core.Keyword(null,"params","params",710516235).cljs$core$IFn$_invoke$arity$1(meth_3906));
cljs.compiler.emitln.call(null,"case ",pcnt_3909,":");

cljs.compiler.emitln.call(null,"return ",n_3905,".call(this",(((pcnt_3909 === (0)))?null:(new cljs.core.List(null,",",(new cljs.core.List(null,cljs.compiler.comma_sep.call(null,cljs.core.take.call(null,pcnt_3909,maxparams_3855)),null,(1),null)),(2),null))),");");
}


var G__3910 = cljs.core.next.call(null,seq__3818_3898__$1);
var G__3911 = null;
var G__3912 = (0);
var G__3913 = (0);
seq__3818_3883 = G__3910;
chunk__3819_3884 = G__3911;
count__3820_3885 = G__3912;
i__3821_3886 = G__3913;
continue;
}
} else {
}
}
break;
}

cljs.compiler.emitln.call(null,"}");

var arg_count_js_3914 = ((cljs.core._EQ_.call(null,new cljs.core.Symbol(null,"self__","self__",-153190816,null),new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(cljs.core.first.call(null,new cljs.core.Keyword(null,"params","params",710516235).cljs$core$IFn$_invoke$arity$1(cljs.core.val.call(null,cljs.core.first.call(null,ms_3857)))))))?"(arguments.length - 1)":"arguments.length");
cljs.compiler.emitln.call(null,"throw(new Error('Invalid arity: ' + ",arg_count_js_3914,"));");

cljs.compiler.emitln.call(null,"};");

if(cljs.core.truth_(variadic)){
cljs.compiler.emitln.call(null,mname_3854,".cljs$lang$maxFixedArity = ",max_fixed_arity,";");

cljs.compiler.emitln.call(null,mname_3854,".cljs$lang$applyTo = ",cljs.core.some.call(null,(function (p1__3799_SHARP_){
var vec__3834 = p1__3799_SHARP_;
var n = cljs.core.nth.call(null,vec__3834,(0),null);
var m = cljs.core.nth.call(null,vec__3834,(1),null);
if(cljs.core.truth_(new cljs.core.Keyword(null,"variadic?","variadic?",584179762).cljs$core$IFn$_invoke$arity$1(m))){
return n;
} else {
return null;
}
}),ms_3857),".cljs$lang$applyTo;");
} else {
}

var seq__3837_3915 = cljs.core.seq.call(null,ms_3857);
var chunk__3838_3916 = null;
var count__3839_3917 = (0);
var i__3840_3918 = (0);
while(true){
if((i__3840_3918 < count__3839_3917)){
var vec__3847_3919 = cljs.core._nth.call(null,chunk__3838_3916,i__3840_3918);
var n_3920 = cljs.core.nth.call(null,vec__3847_3919,(0),null);
var meth_3921 = cljs.core.nth.call(null,vec__3847_3919,(1),null);
var c_3922 = cljs.core.count.call(null,new cljs.core.Keyword(null,"params","params",710516235).cljs$core$IFn$_invoke$arity$1(meth_3921));
if(cljs.core.truth_(new cljs.core.Keyword(null,"variadic?","variadic?",584179762).cljs$core$IFn$_invoke$arity$1(meth_3921))){
cljs.compiler.emitln.call(null,mname_3854,".cljs$core$IFn$_invoke$arity$variadic = ",n_3920,".cljs$core$IFn$_invoke$arity$variadic;");
} else {
cljs.compiler.emitln.call(null,mname_3854,".cljs$core$IFn$_invoke$arity$",c_3922," = ",n_3920,";");
}


var G__3923 = seq__3837_3915;
var G__3924 = chunk__3838_3916;
var G__3925 = count__3839_3917;
var G__3926 = (i__3840_3918 + (1));
seq__3837_3915 = G__3923;
chunk__3838_3916 = G__3924;
count__3839_3917 = G__3925;
i__3840_3918 = G__3926;
continue;
} else {
var temp__5804__auto___3927 = cljs.core.seq.call(null,seq__3837_3915);
if(temp__5804__auto___3927){
var seq__3837_3928__$1 = temp__5804__auto___3927;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__3837_3928__$1)){
var c__5565__auto___3929 = cljs.core.chunk_first.call(null,seq__3837_3928__$1);
var G__3930 = cljs.core.chunk_rest.call(null,seq__3837_3928__$1);
var G__3931 = c__5565__auto___3929;
var G__3932 = cljs.core.count.call(null,c__5565__auto___3929);
var G__3933 = (0);
seq__3837_3915 = G__3930;
chunk__3838_3916 = G__3931;
count__3839_3917 = G__3932;
i__3840_3918 = G__3933;
continue;
} else {
var vec__3850_3934 = cljs.core.first.call(null,seq__3837_3928__$1);
var n_3935 = cljs.core.nth.call(null,vec__3850_3934,(0),null);
var meth_3936 = cljs.core.nth.call(null,vec__3850_3934,(1),null);
var c_3937 = cljs.core.count.call(null,new cljs.core.Keyword(null,"params","params",710516235).cljs$core$IFn$_invoke$arity$1(meth_3936));
if(cljs.core.truth_(new cljs.core.Keyword(null,"variadic?","variadic?",584179762).cljs$core$IFn$_invoke$arity$1(meth_3936))){
cljs.compiler.emitln.call(null,mname_3854,".cljs$core$IFn$_invoke$arity$variadic = ",n_3935,".cljs$core$IFn$_invoke$arity$variadic;");
} else {
cljs.compiler.emitln.call(null,mname_3854,".cljs$core$IFn$_invoke$arity$",c_3937," = ",n_3935,";");
}


var G__3938 = cljs.core.next.call(null,seq__3837_3928__$1);
var G__3939 = null;
var G__3940 = (0);
var G__3941 = (0);
seq__3837_3915 = G__3938;
chunk__3838_3916 = G__3939;
count__3839_3917 = G__3940;
i__3840_3918 = G__3941;
continue;
}
} else {
}
}
break;
}

cljs.compiler.emitln.call(null,"return ",mname_3854,";");

cljs.compiler.emitln.call(null,"})()");
}

if(loop_locals){
return cljs.compiler.emitln.call(null,";})(",cljs.compiler.comma_sep.call(null,loop_locals),"))");
} else {
return null;
}
}
}));
cljs.core._add_method.call(null,cljs.compiler.emit_STAR_,new cljs.core.Keyword(null,"do","do",46310725),(function (p__3942){
var map__3943 = p__3942;
var map__3943__$1 = cljs.core.__destructure_map.call(null,map__3943);
var statements = cljs.core.get.call(null,map__3943__$1,new cljs.core.Keyword(null,"statements","statements",600349855));
var ret = cljs.core.get.call(null,map__3943__$1,new cljs.core.Keyword(null,"ret","ret",-468222814));
var env = cljs.core.get.call(null,map__3943__$1,new cljs.core.Keyword(null,"env","env",-1815813235));
var context = new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env);
if(((cljs.core.seq.call(null,statements)) && (cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"expr","expr",745722291),context)))){
cljs.compiler.emitln.call(null,"(function (){");
} else {
}

var seq__3944_3948 = cljs.core.seq.call(null,statements);
var chunk__3945_3949 = null;
var count__3946_3950 = (0);
var i__3947_3951 = (0);
while(true){
if((i__3947_3951 < count__3946_3950)){
var s_3952 = cljs.core._nth.call(null,chunk__3945_3949,i__3947_3951);
cljs.compiler.emitln.call(null,s_3952);


var G__3953 = seq__3944_3948;
var G__3954 = chunk__3945_3949;
var G__3955 = count__3946_3950;
var G__3956 = (i__3947_3951 + (1));
seq__3944_3948 = G__3953;
chunk__3945_3949 = G__3954;
count__3946_3950 = G__3955;
i__3947_3951 = G__3956;
continue;
} else {
var temp__5804__auto___3957 = cljs.core.seq.call(null,seq__3944_3948);
if(temp__5804__auto___3957){
var seq__3944_3958__$1 = temp__5804__auto___3957;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__3944_3958__$1)){
var c__5565__auto___3959 = cljs.core.chunk_first.call(null,seq__3944_3958__$1);
var G__3960 = cljs.core.chunk_rest.call(null,seq__3944_3958__$1);
var G__3961 = c__5565__auto___3959;
var G__3962 = cljs.core.count.call(null,c__5565__auto___3959);
var G__3963 = (0);
seq__3944_3948 = G__3960;
chunk__3945_3949 = G__3961;
count__3946_3950 = G__3962;
i__3947_3951 = G__3963;
continue;
} else {
var s_3964 = cljs.core.first.call(null,seq__3944_3958__$1);
cljs.compiler.emitln.call(null,s_3964);


var G__3965 = cljs.core.next.call(null,seq__3944_3958__$1);
var G__3966 = null;
var G__3967 = (0);
var G__3968 = (0);
seq__3944_3948 = G__3965;
chunk__3945_3949 = G__3966;
count__3946_3950 = G__3967;
i__3947_3951 = G__3968;
continue;
}
} else {
}
}
break;
}

cljs.compiler.emit.call(null,ret);

if(((cljs.core.seq.call(null,statements)) && (cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"expr","expr",745722291),context)))){
return cljs.compiler.emitln.call(null,"})()");
} else {
return null;
}
}));
cljs.core._add_method.call(null,cljs.compiler.emit_STAR_,new cljs.core.Keyword(null,"try","try",1380742522),(function (p__3969){
var map__3970 = p__3969;
var map__3970__$1 = cljs.core.__destructure_map.call(null,map__3970);
var try$ = cljs.core.get.call(null,map__3970__$1,new cljs.core.Keyword(null,"body","body",-2049205669));
var env = cljs.core.get.call(null,map__3970__$1,new cljs.core.Keyword(null,"env","env",-1815813235));
var catch$ = cljs.core.get.call(null,map__3970__$1,new cljs.core.Keyword(null,"catch","catch",1038065524));
var name = cljs.core.get.call(null,map__3970__$1,new cljs.core.Keyword(null,"name","name",1843675177));
var finally$ = cljs.core.get.call(null,map__3970__$1,new cljs.core.Keyword(null,"finally","finally",1589088705));
var context = new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env);
if(cljs.core.truth_((function (){var or__5043__auto__ = name;
if(cljs.core.truth_(or__5043__auto__)){
return or__5043__auto__;
} else {
return finally$;
}
})())){
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"expr","expr",745722291),context)){
cljs.compiler.emits.call(null,"(function (){");
} else {
}

cljs.compiler.emits.call(null,"try{",try$,"}");

if(cljs.core.truth_(name)){
cljs.compiler.emits.call(null,"catch (",cljs.compiler.munge.call(null,name),"){",catch$,"}");
} else {
}

if(cljs.core.truth_(finally$)){
if(cljs.core.not_EQ_.call(null,new cljs.core.Keyword(null,"const","const",1709929842),new cljs.core.Keyword(null,"op","op",-1882987955).cljs$core$IFn$_invoke$arity$1(cljs.analyzer.unwrap_quote.call(null,finally$)))){
} else {
throw (new Error(["Assert failed: ","finally block cannot contain constant","\n","(not= :const (:op (ana/unwrap-quote finally)))"].join('')));
}

cljs.compiler.emits.call(null,"finally {",finally$,"}");
} else {
}

if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"expr","expr",745722291),context)){
return cljs.compiler.emits.call(null,"})()");
} else {
return null;
}
} else {
return cljs.compiler.emits.call(null,try$);
}
}));
cljs.compiler.emit_let = (function cljs$compiler$emit_let(p__3971,is_loop){
var map__3972 = p__3971;
var map__3972__$1 = cljs.core.__destructure_map.call(null,map__3972);
var expr = cljs.core.get.call(null,map__3972__$1,new cljs.core.Keyword(null,"body","body",-2049205669));
var bindings = cljs.core.get.call(null,map__3972__$1,new cljs.core.Keyword(null,"bindings","bindings",1271397192));
var env = cljs.core.get.call(null,map__3972__$1,new cljs.core.Keyword(null,"env","env",-1815813235));
var context = new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env);
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"expr","expr",745722291),context)){
cljs.compiler.emits.call(null,"(function (){");
} else {
}

var _STAR_lexical_renames_STAR__orig_val__3973_3983 = cljs.compiler._STAR_lexical_renames_STAR_;
var _STAR_lexical_renames_STAR__temp_val__3974_3984 = cljs.core.into.call(null,cljs.compiler._STAR_lexical_renames_STAR_,((cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"statement","statement",-32780863),context))?cljs.core.map.call(null,(function (binding){
var name = new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(binding);
return (new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[cljs.compiler.hash_scope.call(null,binding),cljs.core.gensym.call(null,[cljs.core.str.cljs$core$IFn$_invoke$arity$1(name),"-"].join(''))],null));
}),bindings):null));
(cljs.compiler._STAR_lexical_renames_STAR_ = _STAR_lexical_renames_STAR__temp_val__3974_3984);

try{var seq__3975_3985 = cljs.core.seq.call(null,bindings);
var chunk__3976_3986 = null;
var count__3977_3987 = (0);
var i__3978_3988 = (0);
while(true){
if((i__3978_3988 < count__3977_3987)){
var map__3981_3989 = cljs.core._nth.call(null,chunk__3976_3986,i__3978_3988);
var map__3981_3990__$1 = cljs.core.__destructure_map.call(null,map__3981_3989);
var binding_3991 = map__3981_3990__$1;
var init_3992 = cljs.core.get.call(null,map__3981_3990__$1,new cljs.core.Keyword(null,"init","init",-1875481434));
cljs.compiler.emits.call(null,"var ");

cljs.compiler.emit.call(null,binding_3991);

cljs.compiler.emitln.call(null," = ",init_3992,";");


var G__3993 = seq__3975_3985;
var G__3994 = chunk__3976_3986;
var G__3995 = count__3977_3987;
var G__3996 = (i__3978_3988 + (1));
seq__3975_3985 = G__3993;
chunk__3976_3986 = G__3994;
count__3977_3987 = G__3995;
i__3978_3988 = G__3996;
continue;
} else {
var temp__5804__auto___3997 = cljs.core.seq.call(null,seq__3975_3985);
if(temp__5804__auto___3997){
var seq__3975_3998__$1 = temp__5804__auto___3997;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__3975_3998__$1)){
var c__5565__auto___3999 = cljs.core.chunk_first.call(null,seq__3975_3998__$1);
var G__4000 = cljs.core.chunk_rest.call(null,seq__3975_3998__$1);
var G__4001 = c__5565__auto___3999;
var G__4002 = cljs.core.count.call(null,c__5565__auto___3999);
var G__4003 = (0);
seq__3975_3985 = G__4000;
chunk__3976_3986 = G__4001;
count__3977_3987 = G__4002;
i__3978_3988 = G__4003;
continue;
} else {
var map__3982_4004 = cljs.core.first.call(null,seq__3975_3998__$1);
var map__3982_4005__$1 = cljs.core.__destructure_map.call(null,map__3982_4004);
var binding_4006 = map__3982_4005__$1;
var init_4007 = cljs.core.get.call(null,map__3982_4005__$1,new cljs.core.Keyword(null,"init","init",-1875481434));
cljs.compiler.emits.call(null,"var ");

cljs.compiler.emit.call(null,binding_4006);

cljs.compiler.emitln.call(null," = ",init_4007,";");


var G__4008 = cljs.core.next.call(null,seq__3975_3998__$1);
var G__4009 = null;
var G__4010 = (0);
var G__4011 = (0);
seq__3975_3985 = G__4008;
chunk__3976_3986 = G__4009;
count__3977_3987 = G__4010;
i__3978_3988 = G__4011;
continue;
}
} else {
}
}
break;
}

if(cljs.core.truth_(is_loop)){
cljs.compiler.emitln.call(null,"while(true){");
} else {
}

cljs.compiler.emits.call(null,expr);

if(cljs.core.truth_(is_loop)){
cljs.compiler.emitln.call(null,"break;");

cljs.compiler.emitln.call(null,"}");
} else {
}
}finally {(cljs.compiler._STAR_lexical_renames_STAR_ = _STAR_lexical_renames_STAR__orig_val__3973_3983);
}
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"expr","expr",745722291),context)){
return cljs.compiler.emits.call(null,"})()");
} else {
return null;
}
});
cljs.core._add_method.call(null,cljs.compiler.emit_STAR_,new cljs.core.Keyword(null,"let","let",-1282412701),(function (ast){
return cljs.compiler.emit_let.call(null,ast,false);
}));
cljs.core._add_method.call(null,cljs.compiler.emit_STAR_,new cljs.core.Keyword(null,"loop","loop",-395552849),(function (ast){
return cljs.compiler.emit_let.call(null,ast,true);
}));
cljs.core._add_method.call(null,cljs.compiler.emit_STAR_,new cljs.core.Keyword(null,"recur","recur",-437573268),(function (p__4012){
var map__4013 = p__4012;
var map__4013__$1 = cljs.core.__destructure_map.call(null,map__4013);
var frame = cljs.core.get.call(null,map__4013__$1,new cljs.core.Keyword(null,"frame","frame",-1711082588));
var exprs = cljs.core.get.call(null,map__4013__$1,new cljs.core.Keyword(null,"exprs","exprs",1795829094));
var env = cljs.core.get.call(null,map__4013__$1,new cljs.core.Keyword(null,"env","env",-1815813235));
var temps = cljs.core.vec.call(null,cljs.core.take.call(null,cljs.core.count.call(null,exprs),cljs.core.repeatedly.call(null,cljs.core.gensym)));
var params = new cljs.core.Keyword(null,"params","params",710516235).cljs$core$IFn$_invoke$arity$1(frame);
var n__5633__auto___4014 = cljs.core.count.call(null,exprs);
var i_4015 = (0);
while(true){
if((i_4015 < n__5633__auto___4014)){
cljs.compiler.emitln.call(null,"var ",temps.call(null,i_4015)," = ",exprs.call(null,i_4015),";");

var G__4016 = (i_4015 + (1));
i_4015 = G__4016;
continue;
} else {
}
break;
}

var n__5633__auto___4017 = cljs.core.count.call(null,exprs);
var i_4018 = (0);
while(true){
if((i_4018 < n__5633__auto___4017)){
cljs.compiler.emitln.call(null,cljs.compiler.munge.call(null,params.call(null,i_4018))," = ",temps.call(null,i_4018),";");

var G__4019 = (i_4018 + (1));
i_4018 = G__4019;
continue;
} else {
}
break;
}

return cljs.compiler.emitln.call(null,"continue;");
}));
cljs.core._add_method.call(null,cljs.compiler.emit_STAR_,new cljs.core.Keyword(null,"letfn","letfn",-2121022354),(function (p__4020){
var map__4021 = p__4020;
var map__4021__$1 = cljs.core.__destructure_map.call(null,map__4021);
var expr = cljs.core.get.call(null,map__4021__$1,new cljs.core.Keyword(null,"body","body",-2049205669));
var bindings = cljs.core.get.call(null,map__4021__$1,new cljs.core.Keyword(null,"bindings","bindings",1271397192));
var env = cljs.core.get.call(null,map__4021__$1,new cljs.core.Keyword(null,"env","env",-1815813235));
var context = new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env);
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"expr","expr",745722291),context)){
cljs.compiler.emits.call(null,"(function (){");
} else {
}

var seq__4022_4030 = cljs.core.seq.call(null,bindings);
var chunk__4023_4031 = null;
var count__4024_4032 = (0);
var i__4025_4033 = (0);
while(true){
if((i__4025_4033 < count__4024_4032)){
var map__4028_4034 = cljs.core._nth.call(null,chunk__4023_4031,i__4025_4033);
var map__4028_4035__$1 = cljs.core.__destructure_map.call(null,map__4028_4034);
var binding_4036 = map__4028_4035__$1;
var init_4037 = cljs.core.get.call(null,map__4028_4035__$1,new cljs.core.Keyword(null,"init","init",-1875481434));
cljs.compiler.emitln.call(null,"var ",cljs.compiler.munge.call(null,binding_4036)," = ",init_4037,";");


var G__4038 = seq__4022_4030;
var G__4039 = chunk__4023_4031;
var G__4040 = count__4024_4032;
var G__4041 = (i__4025_4033 + (1));
seq__4022_4030 = G__4038;
chunk__4023_4031 = G__4039;
count__4024_4032 = G__4040;
i__4025_4033 = G__4041;
continue;
} else {
var temp__5804__auto___4042 = cljs.core.seq.call(null,seq__4022_4030);
if(temp__5804__auto___4042){
var seq__4022_4043__$1 = temp__5804__auto___4042;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__4022_4043__$1)){
var c__5565__auto___4044 = cljs.core.chunk_first.call(null,seq__4022_4043__$1);
var G__4045 = cljs.core.chunk_rest.call(null,seq__4022_4043__$1);
var G__4046 = c__5565__auto___4044;
var G__4047 = cljs.core.count.call(null,c__5565__auto___4044);
var G__4048 = (0);
seq__4022_4030 = G__4045;
chunk__4023_4031 = G__4046;
count__4024_4032 = G__4047;
i__4025_4033 = G__4048;
continue;
} else {
var map__4029_4049 = cljs.core.first.call(null,seq__4022_4043__$1);
var map__4029_4050__$1 = cljs.core.__destructure_map.call(null,map__4029_4049);
var binding_4051 = map__4029_4050__$1;
var init_4052 = cljs.core.get.call(null,map__4029_4050__$1,new cljs.core.Keyword(null,"init","init",-1875481434));
cljs.compiler.emitln.call(null,"var ",cljs.compiler.munge.call(null,binding_4051)," = ",init_4052,";");


var G__4053 = cljs.core.next.call(null,seq__4022_4043__$1);
var G__4054 = null;
var G__4055 = (0);
var G__4056 = (0);
seq__4022_4030 = G__4053;
chunk__4023_4031 = G__4054;
count__4024_4032 = G__4055;
i__4025_4033 = G__4056;
continue;
}
} else {
}
}
break;
}

cljs.compiler.emits.call(null,expr);

if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"expr","expr",745722291),context)){
return cljs.compiler.emits.call(null,"})()");
} else {
return null;
}
}));
cljs.compiler.protocol_prefix = (function cljs$compiler$protocol_prefix(psym){
return cljs.core.symbol.call(null,[cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.str.cljs$core$IFn$_invoke$arity$1(psym).replace((new RegExp("\\.","g")),"$").replace("/","$")),"$"].join(''));
});
cljs.core._add_method.call(null,cljs.compiler.emit_STAR_,new cljs.core.Keyword(null,"invoke","invoke",1145927159),(function (p__4059){
var map__4060 = p__4059;
var map__4060__$1 = cljs.core.__destructure_map.call(null,map__4060);
var expr = map__4060__$1;
var f = cljs.core.get.call(null,map__4060__$1,new cljs.core.Keyword(null,"fn","fn",-1175266204));
var args = cljs.core.get.call(null,map__4060__$1,new cljs.core.Keyword(null,"args","args",1315556576));
var env = cljs.core.get.call(null,map__4060__$1,new cljs.core.Keyword(null,"env","env",-1815813235));
var info = new cljs.core.Keyword(null,"info","info",-317069002).cljs$core$IFn$_invoke$arity$1(f);
var fn_QMARK_ = (function (){var and__5041__auto__ = cljs.analyzer._STAR_cljs_static_fns_STAR_;
if(cljs.core.truth_(and__5041__auto__)){
var and__5041__auto____$1 = cljs.core.not.call(null,new cljs.core.Keyword(null,"dynamic","dynamic",704819571).cljs$core$IFn$_invoke$arity$1(info));
if(and__5041__auto____$1){
return new cljs.core.Keyword(null,"fn-var","fn-var",1086204730).cljs$core$IFn$_invoke$arity$1(info);
} else {
return and__5041__auto____$1;
}
} else {
return and__5041__auto__;
}
})();
var protocol = new cljs.core.Keyword(null,"protocol","protocol",652470118).cljs$core$IFn$_invoke$arity$1(info);
var tag = cljs.analyzer.infer_tag.call(null,env,cljs.core.first.call(null,new cljs.core.Keyword(null,"args","args",1315556576).cljs$core$IFn$_invoke$arity$1(expr)));
var proto_QMARK_ = (function (){var and__5041__auto__ = protocol;
if(cljs.core.truth_(and__5041__auto__)){
var and__5041__auto____$1 = tag;
if(cljs.core.truth_(and__5041__auto____$1)){
var or__5043__auto__ = (function (){var and__5041__auto____$2 = cljs.analyzer._STAR_cljs_static_fns_STAR_;
if(cljs.core.truth_(and__5041__auto____$2)){
var and__5041__auto____$3 = protocol;
if(cljs.core.truth_(and__5041__auto____$3)){
return cljs.core._EQ_.call(null,tag,new cljs.core.Symbol(null,"not-native","not-native",-236392494,null));
} else {
return and__5041__auto____$3;
}
} else {
return and__5041__auto____$2;
}
})();
if(cljs.core.truth_(or__5043__auto__)){
return or__5043__auto__;
} else {
var and__5041__auto____$2 = (function (){var or__5043__auto____$1 = cljs.analyzer._STAR_cljs_static_fns_STAR_;
if(cljs.core.truth_(or__5043__auto____$1)){
return or__5043__auto____$1;
} else {
return new cljs.core.Keyword(null,"protocol-inline","protocol-inline",1550487556).cljs$core$IFn$_invoke$arity$1(env);
}
})();
if(cljs.core.truth_(and__5041__auto____$2)){
var or__5043__auto____$1 = cljs.core._EQ_.call(null,protocol,tag);
if(or__5043__auto____$1){
return or__5043__auto____$1;
} else {
var and__5041__auto____$3 = (!(cljs.core.set_QMARK_.call(null,tag)));
if(and__5041__auto____$3){
var and__5041__auto____$4 = cljs.core.not.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 11, [new cljs.core.Symbol(null,"clj","clj",980036099,null),"null",new cljs.core.Symbol(null,"boolean","boolean",-278886877,null),"null",new cljs.core.Symbol(null,"object","object",-1179821820,null),"null",new cljs.core.Symbol(null,"any","any",-948528346,null),"null",new cljs.core.Symbol(null,"js","js",-886355190,null),"null",new cljs.core.Symbol(null,"number","number",-1084057331,null),"null",new cljs.core.Symbol(null,"clj-or-nil","clj-or-nil",-2008798668,null),"null",new cljs.core.Symbol(null,"array","array",-440182315,null),"null",new cljs.core.Symbol(null,"string","string",-349010059,null),"null",new cljs.core.Symbol(null,"function","function",-486723946,null),"null",new cljs.core.Symbol(null,"clj-nil","clj-nil",1321798654,null),"null"], null), null).call(null,tag));
if(and__5041__auto____$4){
var temp__5804__auto__ = new cljs.core.Keyword(null,"protocols","protocols",-5615896).cljs$core$IFn$_invoke$arity$1(cljs.analyzer.resolve_existing_var.call(null,env,cljs.core.vary_meta.call(null,tag,cljs.core.assoc,new cljs.core.Keyword("cljs.analyzer","no-resolve","cljs.analyzer/no-resolve",-1872351017),true)));
if(cljs.core.truth_(temp__5804__auto__)){
var ps = temp__5804__auto__;
return ps.call(null,protocol);
} else {
return null;
}
} else {
return and__5041__auto____$4;
}
} else {
return and__5041__auto____$3;
}
}
} else {
return and__5041__auto____$2;
}
}
} else {
return and__5041__auto____$1;
}
} else {
return and__5041__auto__;
}
})();
var first_arg_tag = cljs.analyzer.infer_tag.call(null,env,cljs.core.first.call(null,new cljs.core.Keyword(null,"args","args",1315556576).cljs$core$IFn$_invoke$arity$1(expr)));
var opt_not_QMARK_ = ((cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(info),new cljs.core.Symbol("cljs.core","not","cljs.core/not",100665144,null))) && (cljs.core._EQ_.call(null,first_arg_tag,new cljs.core.Symbol(null,"boolean","boolean",-278886877,null))));
var opt_count_QMARK_ = ((cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(info),new cljs.core.Symbol("cljs.core","count","cljs.core/count",-921270233,null))) && (cljs.core.boolean$.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Symbol(null,"array","array",-440182315,null),"null",new cljs.core.Symbol(null,"string","string",-349010059,null),"null"], null), null).call(null,first_arg_tag))));
var ns = new cljs.core.Keyword(null,"ns","ns",441598760).cljs$core$IFn$_invoke$arity$1(info);
var ftag = cljs.analyzer.infer_tag.call(null,env,f);
var js_QMARK_ = (function (){var or__5043__auto__ = cljs.core._EQ_.call(null,ns,new cljs.core.Symbol(null,"js","js",-886355190,null));
if(or__5043__auto__){
return or__5043__auto__;
} else {
var or__5043__auto____$1 = cljs.core._EQ_.call(null,ns,new cljs.core.Symbol(null,"Math","Math",2033287572,null));
if(or__5043__auto____$1){
return or__5043__auto____$1;
} else {
return new cljs.core.Keyword(null,"foreign","foreign",990521149).cljs$core$IFn$_invoke$arity$1(info);
}
}
})();
var goog_QMARK_ = (cljs.core.truth_(ns)?(function (){var or__5043__auto__ = cljs.core._EQ_.call(null,ns,new cljs.core.Symbol(null,"goog","goog",-70603925,null));
if(or__5043__auto__){
return or__5043__auto__;
} else {
var or__5043__auto____$1 = (function (){var temp__5804__auto__ = cljs.core.str.cljs$core$IFn$_invoke$arity$1(ns);
if(cljs.core.truth_(temp__5804__auto__)){
var ns_str = temp__5804__auto__;
return cljs.core._EQ_.call(null,cljs.core.get.call(null,clojure.string.split.call(null,ns_str,/\./),(0),null),"goog");
} else {
return null;
}
})();
if(cljs.core.truth_(or__5043__auto____$1)){
return or__5043__auto____$1;
} else {
return (!(cljs.core.contains_QMARK_.call(null,new cljs.core.Keyword("cljs.analyzer","namespaces","cljs.analyzer/namespaces",-260788927).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,cljs.env._STAR_compiler_STAR_)),ns)));
}
}
})():null);
var keyword_QMARK_ = (function (){var or__5043__auto__ = cljs.core._EQ_.call(null,new cljs.core.Symbol("cljs.core","Keyword","cljs.core/Keyword",-451434488,null),ftag);
if(or__5043__auto__){
return or__5043__auto__;
} else {
var f__$1 = cljs.analyzer.unwrap_quote.call(null,f);
return ((cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"op","op",-1882987955).cljs$core$IFn$_invoke$arity$1(f__$1),new cljs.core.Keyword(null,"const","const",1709929842))) && ((new cljs.core.Keyword(null,"form","form",-1624062471).cljs$core$IFn$_invoke$arity$1(f__$1) instanceof cljs.core.Keyword)));
}
})();
var vec__4061 = (cljs.core.truth_(fn_QMARK_)?(function (){var arity = cljs.core.count.call(null,args);
var variadic_QMARK_ = new cljs.core.Keyword(null,"variadic?","variadic?",584179762).cljs$core$IFn$_invoke$arity$1(info);
var mps = new cljs.core.Keyword(null,"method-params","method-params",-980792179).cljs$core$IFn$_invoke$arity$1(info);
var mfa = new cljs.core.Keyword(null,"max-fixed-arity","max-fixed-arity",-690205543).cljs$core$IFn$_invoke$arity$1(info);
if(((cljs.core.not.call(null,variadic_QMARK_)) && (cljs.core._EQ_.call(null,cljs.core.count.call(null,mps),(1))))){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [f,null], null);
} else {
if(cljs.core.truth_((function (){var and__5041__auto__ = variadic_QMARK_;
if(cljs.core.truth_(and__5041__auto__)){
return (arity > mfa);
} else {
return and__5041__auto__;
}
})())){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.update_in.call(null,f,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"info","info",-317069002)], null),(function (info__$1){
return cljs.core.update_in.call(null,cljs.core.assoc.call(null,info__$1,new cljs.core.Keyword(null,"name","name",1843675177),cljs.core.symbol.call(null,[cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.compiler.munge.call(null,info__$1)),".cljs$core$IFn$_invoke$arity$variadic"].join(''))),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"info","info",-317069002)], null),(function (p1__4057_SHARP_){
return cljs.core.dissoc.call(null,cljs.core.dissoc.call(null,p1__4057_SHARP_,new cljs.core.Keyword(null,"shadow","shadow",873231803)),new cljs.core.Keyword(null,"fn-self-name","fn-self-name",1461143531));
}));
})),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"max-fixed-arity","max-fixed-arity",-690205543),mfa], null)], null);
} else {
var arities = cljs.core.map.call(null,cljs.core.count,mps);
if(cljs.core.truth_(cljs.core.some.call(null,cljs.core.PersistentHashSet.createAsIfByAssoc([arity]),arities))){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.update_in.call(null,f,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"info","info",-317069002)], null),(function (info__$1){
return cljs.core.update_in.call(null,cljs.core.assoc.call(null,info__$1,new cljs.core.Keyword(null,"name","name",1843675177),cljs.core.symbol.call(null,[cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.compiler.munge.call(null,info__$1)),".cljs$core$IFn$_invoke$arity$",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arity)].join(''))),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"info","info",-317069002)], null),(function (p1__4058_SHARP_){
return cljs.core.dissoc.call(null,cljs.core.dissoc.call(null,p1__4058_SHARP_,new cljs.core.Keyword(null,"shadow","shadow",873231803)),new cljs.core.Keyword(null,"fn-self-name","fn-self-name",1461143531));
}));
})),null], null);
} else {
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [f,null], null);
}

}
}
})():new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [f,null], null));
var f__$1 = cljs.core.nth.call(null,vec__4061,(0),null);
var variadic_invoke = cljs.core.nth.call(null,vec__4061,(1),null);
var env__9253__auto__ = env;
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"return","return",-1891502105),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env__9253__auto__))){
cljs.compiler.emits.call(null,"return ");
} else {
}

if(opt_not_QMARK_){
cljs.compiler.emits.call(null,"(!(",cljs.core.first.call(null,args),"))");
} else {
if(opt_count_QMARK_){
cljs.compiler.emits.call(null,"((",cljs.core.first.call(null,args),").length)");
} else {
if(cljs.core.truth_(proto_QMARK_)){
var pimpl_4064 = [cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.compiler.munge.call(null,cljs.compiler.protocol_prefix.call(null,protocol))),cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.compiler.munge.call(null,cljs.core.name.call(null,new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(info)))),"$arity$",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.count.call(null,args))].join('');
cljs.compiler.emits.call(null,cljs.core.first.call(null,args),".",pimpl_4064,"(",cljs.compiler.comma_sep.call(null,cljs.core.cons.call(null,"null",cljs.core.rest.call(null,args))),")");
} else {
if(keyword_QMARK_){
cljs.compiler.emits.call(null,f__$1,".cljs$core$IFn$_invoke$arity$",cljs.core.count.call(null,args),"(",cljs.compiler.comma_sep.call(null,args),")");
} else {
if(cljs.core.truth_(variadic_invoke)){
var mfa_4065 = new cljs.core.Keyword(null,"max-fixed-arity","max-fixed-arity",-690205543).cljs$core$IFn$_invoke$arity$1(variadic_invoke);
cljs.compiler.emits.call(null,f__$1,"(",cljs.compiler.comma_sep.call(null,cljs.core.take.call(null,mfa_4065,args)),(((mfa_4065 === (0)))?null:","),"cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([",cljs.compiler.comma_sep.call(null,cljs.core.drop.call(null,mfa_4065,args)),"], 0))");
} else {
if(cljs.core.truth_((function (){var or__5043__auto__ = fn_QMARK_;
if(cljs.core.truth_(or__5043__auto__)){
return or__5043__auto__;
} else {
var or__5043__auto____$1 = js_QMARK_;
if(cljs.core.truth_(or__5043__auto____$1)){
return or__5043__auto____$1;
} else {
return goog_QMARK_;
}
}
})())){
cljs.compiler.emits.call(null,f__$1,"(",cljs.compiler.comma_sep.call(null,args),")");
} else {
if(cljs.core.truth_((function (){var and__5041__auto__ = cljs.analyzer._STAR_cljs_static_fns_STAR_;
if(cljs.core.truth_(and__5041__auto__)){
return new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"var","var",-769682797),null,new cljs.core.Keyword(null,"js-var","js-var",-1177899142),null,new cljs.core.Keyword(null,"local","local",-1497766724),null], null), null).call(null,new cljs.core.Keyword(null,"op","op",-1882987955).cljs$core$IFn$_invoke$arity$1(f__$1));
} else {
return and__5041__auto__;
}
})())){
var fprop_4066 = [".cljs$core$IFn$_invoke$arity$",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.count.call(null,args))].join('');
if(cljs.core.truth_(cljs.analyzer._STAR_fn_invoke_direct_STAR_)){
cljs.compiler.emits.call(null,"(",f__$1,fprop_4066," ? ",f__$1,fprop_4066,"(",cljs.compiler.comma_sep.call(null,args),") : ",f__$1,"(",cljs.compiler.comma_sep.call(null,args),"))");
} else {
cljs.compiler.emits.call(null,"(",f__$1,fprop_4066," ? ",f__$1,fprop_4066,"(",cljs.compiler.comma_sep.call(null,args),") : ",f__$1,".call(",cljs.compiler.comma_sep.call(null,cljs.core.cons.call(null,"null",args)),"))");
}
} else {
cljs.compiler.emits.call(null,f__$1,".call(",cljs.compiler.comma_sep.call(null,cljs.core.cons.call(null,"null",args)),")");
}

}
}
}
}
}
}

if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"expr","expr",745722291),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env__9253__auto__))){
return null;
} else {
return cljs.compiler.emitln.call(null,";");
}
}));
cljs.core._add_method.call(null,cljs.compiler.emit_STAR_,new cljs.core.Keyword(null,"new","new",-2085437848),(function (p__4067){
var map__4068 = p__4067;
var map__4068__$1 = cljs.core.__destructure_map.call(null,map__4068);
var ctor = cljs.core.get.call(null,map__4068__$1,new cljs.core.Keyword(null,"class","class",-2030961996));
var args = cljs.core.get.call(null,map__4068__$1,new cljs.core.Keyword(null,"args","args",1315556576));
var env = cljs.core.get.call(null,map__4068__$1,new cljs.core.Keyword(null,"env","env",-1815813235));
var env__9253__auto__ = env;
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"return","return",-1891502105),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env__9253__auto__))){
cljs.compiler.emits.call(null,"return ");
} else {
}

cljs.compiler.emits.call(null,"(new ",ctor,"(",cljs.compiler.comma_sep.call(null,args),"))");

if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"expr","expr",745722291),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env__9253__auto__))){
return null;
} else {
return cljs.compiler.emitln.call(null,";");
}
}));
cljs.core._add_method.call(null,cljs.compiler.emit_STAR_,new cljs.core.Keyword(null,"set!","set!",-1389817006),(function (p__4069){
var map__4070 = p__4069;
var map__4070__$1 = cljs.core.__destructure_map.call(null,map__4070);
var target = cljs.core.get.call(null,map__4070__$1,new cljs.core.Keyword(null,"target","target",253001721));
var val = cljs.core.get.call(null,map__4070__$1,new cljs.core.Keyword(null,"val","val",128701612));
var env = cljs.core.get.call(null,map__4070__$1,new cljs.core.Keyword(null,"env","env",-1815813235));
var env__9253__auto__ = env;
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"return","return",-1891502105),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env__9253__auto__))){
cljs.compiler.emits.call(null,"return ");
} else {
}

cljs.compiler.emits.call(null,"(",target," = ",val,")");

if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"expr","expr",745722291),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env__9253__auto__))){
return null;
} else {
return cljs.compiler.emitln.call(null,";");
}
}));
cljs.compiler.sublib_select = (function cljs$compiler$sublib_select(sublib){
if(cljs.core.truth_(sublib)){
var xs = clojure.string.split.call(null,sublib,/\./);
return cljs.core.apply.call(null,cljs.core.str,cljs.core.map.call(null,(function (p1__4071_SHARP_){
return ["['",cljs.core.str.cljs$core$IFn$_invoke$arity$1(p1__4071_SHARP_),"']"].join('');
}),xs));
} else {
return null;
}
});
cljs.compiler.emit_global_export = (function cljs$compiler$emit_global_export(ns_name,global_exports,lib){
var vec__4072 = cljs.analyzer.lib_AMPERSAND_sublib.call(null,lib);
var lib_SINGLEQUOTE_ = cljs.core.nth.call(null,vec__4072,(0),null);
var sublib = cljs.core.nth.call(null,vec__4072,(1),null);
return cljs.compiler.emitln.call(null,cljs.compiler.munge.call(null,ns_name),".",cljs.analyzer.munge_global_export.call(null,lib)," = goog.global",cljs.core.apply.call(null,cljs.core.str,cljs.core.map.call(null,(function (prop){
return ["[\"",cljs.core.str.cljs$core$IFn$_invoke$arity$1(prop),"\"]"].join('');
}),clojure.string.split.call(null,cljs.core.name.call(null,(function (){var or__5043__auto__ = cljs.core.get.call(null,global_exports,cljs.core.symbol.call(null,lib_SINGLEQUOTE_));
if(cljs.core.truth_(or__5043__auto__)){
return or__5043__auto__;
} else {
return cljs.core.get.call(null,global_exports,cljs.core.name.call(null,lib_SINGLEQUOTE_));
}
})()),/\./))),cljs.compiler.sublib_select.call(null,sublib),";");
});
cljs.compiler.load_libs = (function cljs$compiler$load_libs(libs,seen,reloads,deps,ns_name){
var map__4075 = cljs.core.deref.call(null,cljs.env._STAR_compiler_STAR_);
var map__4075__$1 = cljs.core.__destructure_map.call(null,map__4075);
var options = cljs.core.get.call(null,map__4075__$1,new cljs.core.Keyword(null,"options","options",99638489));
var js_dependency_index = cljs.core.get.call(null,map__4075__$1,new cljs.core.Keyword(null,"js-dependency-index","js-dependency-index",-1887042131));
var map__4076 = options;
var map__4076__$1 = cljs.core.__destructure_map.call(null,map__4076);
var target = cljs.core.get.call(null,map__4076__$1,new cljs.core.Keyword(null,"target","target",253001721));
var nodejs_rt = cljs.core.get.call(null,map__4076__$1,new cljs.core.Keyword(null,"nodejs-rt","nodejs-rt",-512437071));
var optimizations = cljs.core.get.call(null,map__4076__$1,new cljs.core.Keyword(null,"optimizations","optimizations",-2047476854));
var loaded_libs = cljs.compiler.munge.call(null,new cljs.core.Symbol(null,"cljs.core.*loaded-libs*","cljs.core.*loaded-libs*",-1847086525,null));
var loaded_libs_temp = cljs.compiler.munge.call(null,cljs.core.gensym.call(null,new cljs.core.Symbol(null,"cljs.core.*loaded-libs*","cljs.core.*loaded-libs*",-1847086525,null)));
var vec__4077 = (function (){var libs__$1 = cljs.core.remove.call(null,cljs.core.set.call(null,cljs.core.vals.call(null,seen)),cljs.core.filter.call(null,cljs.core.set.call(null,cljs.core.vals.call(null,libs)),deps));
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"nodejs","nodejs",321212524),target)){
var map__4083 = cljs.core.group_by.call(null,cljs.analyzer.node_module_dep_QMARK_,libs__$1);
var map__4083__$1 = cljs.core.__destructure_map.call(null,map__4083);
var node_libs = cljs.core.get.call(null,map__4083__$1,true);
var libs_to_load = cljs.core.get.call(null,map__4083__$1,false);
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [node_libs,libs_to_load], null);
} else {
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [null,libs__$1], null);
}
})();
var node_libs = cljs.core.nth.call(null,vec__4077,(0),null);
var libs_to_load = cljs.core.nth.call(null,vec__4077,(1),null);
var vec__4080 = (function (){var map__4084 = cljs.core.group_by.call(null,cljs.analyzer.goog_module_dep_QMARK_,libs_to_load);
var map__4084__$1 = cljs.core.__destructure_map.call(null,map__4084);
var goog_modules = cljs.core.get.call(null,map__4084__$1,true);
var libs_to_load__$1 = cljs.core.get.call(null,map__4084__$1,false);
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [goog_modules,libs_to_load__$1], null);
})();
var goog_modules = cljs.core.nth.call(null,vec__4080,(0),null);
var libs_to_load__$1 = cljs.core.nth.call(null,vec__4080,(1),null);
var global_exports_libs = cljs.core.filter.call(null,cljs.analyzer.dep_has_global_exports_QMARK_,libs_to_load__$1);
if(cljs.core.truth_(new cljs.core.Keyword(null,"reload-all","reload-all",761570200).cljs$core$IFn$_invoke$arity$1(cljs.core.meta.call(null,libs)))){
cljs.compiler.emitln.call(null,"if(!COMPILED) ",loaded_libs_temp," = ",loaded_libs," || cljs.core.set([\"cljs.core\"]);");

cljs.compiler.emitln.call(null,"if(!COMPILED) ",loaded_libs," = cljs.core.set([\"cljs.core\"]);");
} else {
}

var seq__4085_4129 = cljs.core.seq.call(null,libs_to_load__$1);
var chunk__4086_4130 = null;
var count__4087_4131 = (0);
var i__4088_4132 = (0);
while(true){
if((i__4088_4132 < count__4087_4131)){
var lib_4133 = cljs.core._nth.call(null,chunk__4086_4130,i__4088_4132);
if(((cljs.analyzer.foreign_dep_QMARK_.call(null,lib_4133)) && ((!(cljs.core.keyword_identical_QMARK_.call(null,optimizations,new cljs.core.Keyword(null,"none","none",1333468478))))))){
} else {
if(cljs.core.truth_((function (){var or__5043__auto__ = new cljs.core.Keyword(null,"reload","reload",863702807).cljs$core$IFn$_invoke$arity$1(cljs.core.meta.call(null,libs));
if(cljs.core.truth_(or__5043__auto__)){
return or__5043__auto__;
} else {
return cljs.core._EQ_.call(null,cljs.core.get.call(null,reloads,lib_4133),new cljs.core.Keyword(null,"reload","reload",863702807));
}
})())){
cljs.compiler.emitln.call(null,"goog.require('",cljs.compiler.munge.call(null,lib_4133),"', 'reload');");
} else {
if(cljs.core.truth_((function (){var or__5043__auto__ = new cljs.core.Keyword(null,"reload-all","reload-all",761570200).cljs$core$IFn$_invoke$arity$1(cljs.core.meta.call(null,libs));
if(cljs.core.truth_(or__5043__auto__)){
return or__5043__auto__;
} else {
return cljs.core._EQ_.call(null,cljs.core.get.call(null,reloads,lib_4133),new cljs.core.Keyword(null,"reload-all","reload-all",761570200));
}
})())){
cljs.compiler.emitln.call(null,"goog.require('",cljs.compiler.munge.call(null,lib_4133),"', 'reload-all');");
} else {
if(cljs.core._EQ_.call(null,lib_4133,new cljs.core.Symbol(null,"goog","goog",-70603925,null))){
} else {
cljs.compiler.emitln.call(null,"goog.require('",cljs.compiler.munge.call(null,lib_4133),"');");
}

}
}
}


var G__4134 = seq__4085_4129;
var G__4135 = chunk__4086_4130;
var G__4136 = count__4087_4131;
var G__4137 = (i__4088_4132 + (1));
seq__4085_4129 = G__4134;
chunk__4086_4130 = G__4135;
count__4087_4131 = G__4136;
i__4088_4132 = G__4137;
continue;
} else {
var temp__5804__auto___4138 = cljs.core.seq.call(null,seq__4085_4129);
if(temp__5804__auto___4138){
var seq__4085_4139__$1 = temp__5804__auto___4138;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__4085_4139__$1)){
var c__5565__auto___4140 = cljs.core.chunk_first.call(null,seq__4085_4139__$1);
var G__4141 = cljs.core.chunk_rest.call(null,seq__4085_4139__$1);
var G__4142 = c__5565__auto___4140;
var G__4143 = cljs.core.count.call(null,c__5565__auto___4140);
var G__4144 = (0);
seq__4085_4129 = G__4141;
chunk__4086_4130 = G__4142;
count__4087_4131 = G__4143;
i__4088_4132 = G__4144;
continue;
} else {
var lib_4145 = cljs.core.first.call(null,seq__4085_4139__$1);
if(((cljs.analyzer.foreign_dep_QMARK_.call(null,lib_4145)) && ((!(cljs.core.keyword_identical_QMARK_.call(null,optimizations,new cljs.core.Keyword(null,"none","none",1333468478))))))){
} else {
if(cljs.core.truth_((function (){var or__5043__auto__ = new cljs.core.Keyword(null,"reload","reload",863702807).cljs$core$IFn$_invoke$arity$1(cljs.core.meta.call(null,libs));
if(cljs.core.truth_(or__5043__auto__)){
return or__5043__auto__;
} else {
return cljs.core._EQ_.call(null,cljs.core.get.call(null,reloads,lib_4145),new cljs.core.Keyword(null,"reload","reload",863702807));
}
})())){
cljs.compiler.emitln.call(null,"goog.require('",cljs.compiler.munge.call(null,lib_4145),"', 'reload');");
} else {
if(cljs.core.truth_((function (){var or__5043__auto__ = new cljs.core.Keyword(null,"reload-all","reload-all",761570200).cljs$core$IFn$_invoke$arity$1(cljs.core.meta.call(null,libs));
if(cljs.core.truth_(or__5043__auto__)){
return or__5043__auto__;
} else {
return cljs.core._EQ_.call(null,cljs.core.get.call(null,reloads,lib_4145),new cljs.core.Keyword(null,"reload-all","reload-all",761570200));
}
})())){
cljs.compiler.emitln.call(null,"goog.require('",cljs.compiler.munge.call(null,lib_4145),"', 'reload-all');");
} else {
if(cljs.core._EQ_.call(null,lib_4145,new cljs.core.Symbol(null,"goog","goog",-70603925,null))){
} else {
cljs.compiler.emitln.call(null,"goog.require('",cljs.compiler.munge.call(null,lib_4145),"');");
}

}
}
}


var G__4146 = cljs.core.next.call(null,seq__4085_4139__$1);
var G__4147 = null;
var G__4148 = (0);
var G__4149 = (0);
seq__4085_4129 = G__4146;
chunk__4086_4130 = G__4147;
count__4087_4131 = G__4148;
i__4088_4132 = G__4149;
continue;
}
} else {
}
}
break;
}

var seq__4089_4150 = cljs.core.seq.call(null,node_libs);
var chunk__4090_4151 = null;
var count__4091_4152 = (0);
var i__4092_4153 = (0);
while(true){
if((i__4092_4153 < count__4091_4152)){
var lib_4154 = cljs.core._nth.call(null,chunk__4090_4151,i__4092_4153);
var vec__4099_4155 = cljs.analyzer.lib_AMPERSAND_sublib.call(null,lib_4154);
var lib_SINGLEQUOTE__4156 = cljs.core.nth.call(null,vec__4099_4155,(0),null);
var sublib_4157 = cljs.core.nth.call(null,vec__4099_4155,(1),null);
cljs.compiler.emitln.call(null,cljs.compiler.munge.call(null,ns_name),".",cljs.analyzer.munge_node_lib.call(null,lib_4154)," = require('",lib_SINGLEQUOTE__4156,"')",cljs.compiler.sublib_select.call(null,sublib_4157),";");


var G__4158 = seq__4089_4150;
var G__4159 = chunk__4090_4151;
var G__4160 = count__4091_4152;
var G__4161 = (i__4092_4153 + (1));
seq__4089_4150 = G__4158;
chunk__4090_4151 = G__4159;
count__4091_4152 = G__4160;
i__4092_4153 = G__4161;
continue;
} else {
var temp__5804__auto___4162 = cljs.core.seq.call(null,seq__4089_4150);
if(temp__5804__auto___4162){
var seq__4089_4163__$1 = temp__5804__auto___4162;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__4089_4163__$1)){
var c__5565__auto___4164 = cljs.core.chunk_first.call(null,seq__4089_4163__$1);
var G__4165 = cljs.core.chunk_rest.call(null,seq__4089_4163__$1);
var G__4166 = c__5565__auto___4164;
var G__4167 = cljs.core.count.call(null,c__5565__auto___4164);
var G__4168 = (0);
seq__4089_4150 = G__4165;
chunk__4090_4151 = G__4166;
count__4091_4152 = G__4167;
i__4092_4153 = G__4168;
continue;
} else {
var lib_4169 = cljs.core.first.call(null,seq__4089_4163__$1);
var vec__4102_4170 = cljs.analyzer.lib_AMPERSAND_sublib.call(null,lib_4169);
var lib_SINGLEQUOTE__4171 = cljs.core.nth.call(null,vec__4102_4170,(0),null);
var sublib_4172 = cljs.core.nth.call(null,vec__4102_4170,(1),null);
cljs.compiler.emitln.call(null,cljs.compiler.munge.call(null,ns_name),".",cljs.analyzer.munge_node_lib.call(null,lib_4169)," = require('",lib_SINGLEQUOTE__4171,"')",cljs.compiler.sublib_select.call(null,sublib_4172),";");


var G__4173 = cljs.core.next.call(null,seq__4089_4163__$1);
var G__4174 = null;
var G__4175 = (0);
var G__4176 = (0);
seq__4089_4150 = G__4173;
chunk__4090_4151 = G__4174;
count__4091_4152 = G__4175;
i__4092_4153 = G__4176;
continue;
}
} else {
}
}
break;
}

var seq__4105_4177 = cljs.core.seq.call(null,goog_modules);
var chunk__4106_4178 = null;
var count__4107_4179 = (0);
var i__4108_4180 = (0);
while(true){
if((i__4108_4180 < count__4107_4179)){
var lib_4181 = cljs.core._nth.call(null,chunk__4106_4178,i__4108_4180);
var vec__4115_4182 = cljs.analyzer.lib_AMPERSAND_sublib.call(null,lib_4181);
var lib_SINGLEQUOTE__4183 = cljs.core.nth.call(null,vec__4115_4182,(0),null);
var sublib_4184 = cljs.core.nth.call(null,vec__4115_4182,(1),null);
cljs.compiler.emitln.call(null,"goog.require('",lib_SINGLEQUOTE__4183,"');");

cljs.compiler.emitln.call(null,"goog.scope(function(){");

cljs.compiler.emitln.call(null,cljs.compiler.munge.call(null,ns_name),".",cljs.analyzer.munge_goog_module_lib.call(null,lib_4181)," = goog.module.get('",lib_SINGLEQUOTE__4183,"')",cljs.compiler.sublib_select.call(null,sublib_4184),";");

cljs.compiler.emitln.call(null,"});");


var G__4185 = seq__4105_4177;
var G__4186 = chunk__4106_4178;
var G__4187 = count__4107_4179;
var G__4188 = (i__4108_4180 + (1));
seq__4105_4177 = G__4185;
chunk__4106_4178 = G__4186;
count__4107_4179 = G__4187;
i__4108_4180 = G__4188;
continue;
} else {
var temp__5804__auto___4189 = cljs.core.seq.call(null,seq__4105_4177);
if(temp__5804__auto___4189){
var seq__4105_4190__$1 = temp__5804__auto___4189;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__4105_4190__$1)){
var c__5565__auto___4191 = cljs.core.chunk_first.call(null,seq__4105_4190__$1);
var G__4192 = cljs.core.chunk_rest.call(null,seq__4105_4190__$1);
var G__4193 = c__5565__auto___4191;
var G__4194 = cljs.core.count.call(null,c__5565__auto___4191);
var G__4195 = (0);
seq__4105_4177 = G__4192;
chunk__4106_4178 = G__4193;
count__4107_4179 = G__4194;
i__4108_4180 = G__4195;
continue;
} else {
var lib_4196 = cljs.core.first.call(null,seq__4105_4190__$1);
var vec__4118_4197 = cljs.analyzer.lib_AMPERSAND_sublib.call(null,lib_4196);
var lib_SINGLEQUOTE__4198 = cljs.core.nth.call(null,vec__4118_4197,(0),null);
var sublib_4199 = cljs.core.nth.call(null,vec__4118_4197,(1),null);
cljs.compiler.emitln.call(null,"goog.require('",lib_SINGLEQUOTE__4198,"');");

cljs.compiler.emitln.call(null,"goog.scope(function(){");

cljs.compiler.emitln.call(null,cljs.compiler.munge.call(null,ns_name),".",cljs.analyzer.munge_goog_module_lib.call(null,lib_4196)," = goog.module.get('",lib_SINGLEQUOTE__4198,"')",cljs.compiler.sublib_select.call(null,sublib_4199),";");

cljs.compiler.emitln.call(null,"});");


var G__4200 = cljs.core.next.call(null,seq__4105_4190__$1);
var G__4201 = null;
var G__4202 = (0);
var G__4203 = (0);
seq__4105_4177 = G__4200;
chunk__4106_4178 = G__4201;
count__4107_4179 = G__4202;
i__4108_4180 = G__4203;
continue;
}
} else {
}
}
break;
}

var seq__4121_4204 = cljs.core.seq.call(null,global_exports_libs);
var chunk__4122_4205 = null;
var count__4123_4206 = (0);
var i__4124_4207 = (0);
while(true){
if((i__4124_4207 < count__4123_4206)){
var lib_4208 = cljs.core._nth.call(null,chunk__4122_4205,i__4124_4207);
var map__4127_4209 = cljs.core.get.call(null,js_dependency_index,cljs.core.name.call(null,cljs.core.first.call(null,cljs.analyzer.lib_AMPERSAND_sublib.call(null,lib_4208))));
var map__4127_4210__$1 = cljs.core.__destructure_map.call(null,map__4127_4209);
var global_exports_4211 = cljs.core.get.call(null,map__4127_4210__$1,new cljs.core.Keyword(null,"global-exports","global-exports",-1644865592));
cljs.compiler.emit_global_export.call(null,ns_name,global_exports_4211,lib_4208);


var G__4212 = seq__4121_4204;
var G__4213 = chunk__4122_4205;
var G__4214 = count__4123_4206;
var G__4215 = (i__4124_4207 + (1));
seq__4121_4204 = G__4212;
chunk__4122_4205 = G__4213;
count__4123_4206 = G__4214;
i__4124_4207 = G__4215;
continue;
} else {
var temp__5804__auto___4216 = cljs.core.seq.call(null,seq__4121_4204);
if(temp__5804__auto___4216){
var seq__4121_4217__$1 = temp__5804__auto___4216;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__4121_4217__$1)){
var c__5565__auto___4218 = cljs.core.chunk_first.call(null,seq__4121_4217__$1);
var G__4219 = cljs.core.chunk_rest.call(null,seq__4121_4217__$1);
var G__4220 = c__5565__auto___4218;
var G__4221 = cljs.core.count.call(null,c__5565__auto___4218);
var G__4222 = (0);
seq__4121_4204 = G__4219;
chunk__4122_4205 = G__4220;
count__4123_4206 = G__4221;
i__4124_4207 = G__4222;
continue;
} else {
var lib_4223 = cljs.core.first.call(null,seq__4121_4217__$1);
var map__4128_4224 = cljs.core.get.call(null,js_dependency_index,cljs.core.name.call(null,cljs.core.first.call(null,cljs.analyzer.lib_AMPERSAND_sublib.call(null,lib_4223))));
var map__4128_4225__$1 = cljs.core.__destructure_map.call(null,map__4128_4224);
var global_exports_4226 = cljs.core.get.call(null,map__4128_4225__$1,new cljs.core.Keyword(null,"global-exports","global-exports",-1644865592));
cljs.compiler.emit_global_export.call(null,ns_name,global_exports_4226,lib_4223);


var G__4227 = cljs.core.next.call(null,seq__4121_4217__$1);
var G__4228 = null;
var G__4229 = (0);
var G__4230 = (0);
seq__4121_4204 = G__4227;
chunk__4122_4205 = G__4228;
count__4123_4206 = G__4229;
i__4124_4207 = G__4230;
continue;
}
} else {
}
}
break;
}

if(cljs.core.truth_(new cljs.core.Keyword(null,"reload-all","reload-all",761570200).cljs$core$IFn$_invoke$arity$1(cljs.core.meta.call(null,libs)))){
return cljs.compiler.emitln.call(null,"if(!COMPILED) ",loaded_libs," = cljs.core.into(",loaded_libs_temp,", ",loaded_libs,");");
} else {
return null;
}
});
cljs.core._add_method.call(null,cljs.compiler.emit_STAR_,new cljs.core.Keyword(null,"ns*","ns*",200417856),(function (p__4231){
var map__4232 = p__4231;
var map__4232__$1 = cljs.core.__destructure_map.call(null,map__4232);
var name = cljs.core.get.call(null,map__4232__$1,new cljs.core.Keyword(null,"name","name",1843675177));
var requires = cljs.core.get.call(null,map__4232__$1,new cljs.core.Keyword(null,"requires","requires",-1201390927));
var uses = cljs.core.get.call(null,map__4232__$1,new cljs.core.Keyword(null,"uses","uses",232664692));
var require_macros = cljs.core.get.call(null,map__4232__$1,new cljs.core.Keyword(null,"require-macros","require-macros",707947416));
var reloads = cljs.core.get.call(null,map__4232__$1,new cljs.core.Keyword(null,"reloads","reloads",610698522));
var env = cljs.core.get.call(null,map__4232__$1,new cljs.core.Keyword(null,"env","env",-1815813235));
var deps = cljs.core.get.call(null,map__4232__$1,new cljs.core.Keyword(null,"deps","deps",1883360319));
cljs.compiler.load_libs.call(null,requires,null,new cljs.core.Keyword(null,"require","require",-468001333).cljs$core$IFn$_invoke$arity$1(reloads),deps,name);

cljs.compiler.load_libs.call(null,uses,requires,new cljs.core.Keyword(null,"use","use",-1846382424).cljs$core$IFn$_invoke$arity$1(reloads),deps,name);

if(cljs.core.truth_(new cljs.core.Keyword(null,"repl-env","repl-env",-1976503928).cljs$core$IFn$_invoke$arity$1(env))){
return cljs.compiler.emitln.call(null,"'nil';");
} else {
return null;
}
}));
cljs.core._add_method.call(null,cljs.compiler.emit_STAR_,new cljs.core.Keyword(null,"ns","ns",441598760),(function (p__4233){
var map__4234 = p__4233;
var map__4234__$1 = cljs.core.__destructure_map.call(null,map__4234);
var name = cljs.core.get.call(null,map__4234__$1,new cljs.core.Keyword(null,"name","name",1843675177));
var requires = cljs.core.get.call(null,map__4234__$1,new cljs.core.Keyword(null,"requires","requires",-1201390927));
var uses = cljs.core.get.call(null,map__4234__$1,new cljs.core.Keyword(null,"uses","uses",232664692));
var require_macros = cljs.core.get.call(null,map__4234__$1,new cljs.core.Keyword(null,"require-macros","require-macros",707947416));
var reloads = cljs.core.get.call(null,map__4234__$1,new cljs.core.Keyword(null,"reloads","reloads",610698522));
var env = cljs.core.get.call(null,map__4234__$1,new cljs.core.Keyword(null,"env","env",-1815813235));
var deps = cljs.core.get.call(null,map__4234__$1,new cljs.core.Keyword(null,"deps","deps",1883360319));
cljs.compiler.emitln.call(null,"goog.provide('",cljs.compiler.munge.call(null,name),"');");

if(cljs.core._EQ_.call(null,name,new cljs.core.Symbol(null,"cljs.core","cljs.core",770546058,null))){
} else {
cljs.compiler.emitln.call(null,"goog.require('cljs.core');");

if(cljs.core.truth_(new cljs.core.Keyword(null,"emit-constants","emit-constants",-476585410).cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"options","options",99638489).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,cljs.env._STAR_compiler_STAR_))))){
cljs.compiler.emitln.call(null,"goog.require('",cljs.compiler.munge.call(null,cljs.analyzer.constants_ns_sym),"');");
} else {
}
}

cljs.compiler.load_libs.call(null,requires,null,new cljs.core.Keyword(null,"require","require",-468001333).cljs$core$IFn$_invoke$arity$1(reloads),deps,name);

return cljs.compiler.load_libs.call(null,uses,requires,new cljs.core.Keyword(null,"use","use",-1846382424).cljs$core$IFn$_invoke$arity$1(reloads),deps,name);
}));
cljs.core._add_method.call(null,cljs.compiler.emit_STAR_,new cljs.core.Keyword(null,"deftype","deftype",340294561),(function (p__4235){
var map__4236 = p__4235;
var map__4236__$1 = cljs.core.__destructure_map.call(null,map__4236);
var t = cljs.core.get.call(null,map__4236__$1,new cljs.core.Keyword(null,"t","t",-1397832519));
var fields = cljs.core.get.call(null,map__4236__$1,new cljs.core.Keyword(null,"fields","fields",-1932066230));
var pmasks = cljs.core.get.call(null,map__4236__$1,new cljs.core.Keyword(null,"pmasks","pmasks",-871416698));
var body = cljs.core.get.call(null,map__4236__$1,new cljs.core.Keyword(null,"body","body",-2049205669));
var protocols = cljs.core.get.call(null,map__4236__$1,new cljs.core.Keyword(null,"protocols","protocols",-5615896));
var fields__$1 = cljs.core.map.call(null,cljs.compiler.munge,fields);
cljs.compiler.emitln.call(null,"");

cljs.compiler.emitln.call(null,"/**");

cljs.compiler.emitln.call(null,"* @constructor");

var seq__4237_4261 = cljs.core.seq.call(null,protocols);
var chunk__4238_4262 = null;
var count__4239_4263 = (0);
var i__4240_4264 = (0);
while(true){
if((i__4240_4264 < count__4239_4263)){
var protocol_4265 = cljs.core._nth.call(null,chunk__4238_4262,i__4240_4264);
cljs.compiler.emitln.call(null," * @implements {",cljs.compiler.munge.call(null,cljs.core.str.cljs$core$IFn$_invoke$arity$1(protocol_4265)),"}");


var G__4266 = seq__4237_4261;
var G__4267 = chunk__4238_4262;
var G__4268 = count__4239_4263;
var G__4269 = (i__4240_4264 + (1));
seq__4237_4261 = G__4266;
chunk__4238_4262 = G__4267;
count__4239_4263 = G__4268;
i__4240_4264 = G__4269;
continue;
} else {
var temp__5804__auto___4270 = cljs.core.seq.call(null,seq__4237_4261);
if(temp__5804__auto___4270){
var seq__4237_4271__$1 = temp__5804__auto___4270;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__4237_4271__$1)){
var c__5565__auto___4272 = cljs.core.chunk_first.call(null,seq__4237_4271__$1);
var G__4273 = cljs.core.chunk_rest.call(null,seq__4237_4271__$1);
var G__4274 = c__5565__auto___4272;
var G__4275 = cljs.core.count.call(null,c__5565__auto___4272);
var G__4276 = (0);
seq__4237_4261 = G__4273;
chunk__4238_4262 = G__4274;
count__4239_4263 = G__4275;
i__4240_4264 = G__4276;
continue;
} else {
var protocol_4277 = cljs.core.first.call(null,seq__4237_4271__$1);
cljs.compiler.emitln.call(null," * @implements {",cljs.compiler.munge.call(null,cljs.core.str.cljs$core$IFn$_invoke$arity$1(protocol_4277)),"}");


var G__4278 = cljs.core.next.call(null,seq__4237_4271__$1);
var G__4279 = null;
var G__4280 = (0);
var G__4281 = (0);
seq__4237_4261 = G__4278;
chunk__4238_4262 = G__4279;
count__4239_4263 = G__4280;
i__4240_4264 = G__4281;
continue;
}
} else {
}
}
break;
}

cljs.compiler.emitln.call(null,"*/");

cljs.compiler.emitln.call(null,cljs.compiler.munge.call(null,t)," = (function (",cljs.compiler.comma_sep.call(null,fields__$1),"){");

var seq__4241_4282 = cljs.core.seq.call(null,fields__$1);
var chunk__4242_4283 = null;
var count__4243_4284 = (0);
var i__4244_4285 = (0);
while(true){
if((i__4244_4285 < count__4243_4284)){
var fld_4286 = cljs.core._nth.call(null,chunk__4242_4283,i__4244_4285);
cljs.compiler.emitln.call(null,"this.",fld_4286," = ",fld_4286,";");


var G__4287 = seq__4241_4282;
var G__4288 = chunk__4242_4283;
var G__4289 = count__4243_4284;
var G__4290 = (i__4244_4285 + (1));
seq__4241_4282 = G__4287;
chunk__4242_4283 = G__4288;
count__4243_4284 = G__4289;
i__4244_4285 = G__4290;
continue;
} else {
var temp__5804__auto___4291 = cljs.core.seq.call(null,seq__4241_4282);
if(temp__5804__auto___4291){
var seq__4241_4292__$1 = temp__5804__auto___4291;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__4241_4292__$1)){
var c__5565__auto___4293 = cljs.core.chunk_first.call(null,seq__4241_4292__$1);
var G__4294 = cljs.core.chunk_rest.call(null,seq__4241_4292__$1);
var G__4295 = c__5565__auto___4293;
var G__4296 = cljs.core.count.call(null,c__5565__auto___4293);
var G__4297 = (0);
seq__4241_4282 = G__4294;
chunk__4242_4283 = G__4295;
count__4243_4284 = G__4296;
i__4244_4285 = G__4297;
continue;
} else {
var fld_4298 = cljs.core.first.call(null,seq__4241_4292__$1);
cljs.compiler.emitln.call(null,"this.",fld_4298," = ",fld_4298,";");


var G__4299 = cljs.core.next.call(null,seq__4241_4292__$1);
var G__4300 = null;
var G__4301 = (0);
var G__4302 = (0);
seq__4241_4282 = G__4299;
chunk__4242_4283 = G__4300;
count__4243_4284 = G__4301;
i__4244_4285 = G__4302;
continue;
}
} else {
}
}
break;
}

var seq__4245_4303 = cljs.core.seq.call(null,pmasks);
var chunk__4246_4304 = null;
var count__4247_4305 = (0);
var i__4248_4306 = (0);
while(true){
if((i__4248_4306 < count__4247_4305)){
var vec__4255_4307 = cljs.core._nth.call(null,chunk__4246_4304,i__4248_4306);
var pno_4308 = cljs.core.nth.call(null,vec__4255_4307,(0),null);
var pmask_4309 = cljs.core.nth.call(null,vec__4255_4307,(1),null);
cljs.compiler.emitln.call(null,"this.cljs$lang$protocol_mask$partition",pno_4308,"$ = ",pmask_4309,";");


var G__4310 = seq__4245_4303;
var G__4311 = chunk__4246_4304;
var G__4312 = count__4247_4305;
var G__4313 = (i__4248_4306 + (1));
seq__4245_4303 = G__4310;
chunk__4246_4304 = G__4311;
count__4247_4305 = G__4312;
i__4248_4306 = G__4313;
continue;
} else {
var temp__5804__auto___4314 = cljs.core.seq.call(null,seq__4245_4303);
if(temp__5804__auto___4314){
var seq__4245_4315__$1 = temp__5804__auto___4314;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__4245_4315__$1)){
var c__5565__auto___4316 = cljs.core.chunk_first.call(null,seq__4245_4315__$1);
var G__4317 = cljs.core.chunk_rest.call(null,seq__4245_4315__$1);
var G__4318 = c__5565__auto___4316;
var G__4319 = cljs.core.count.call(null,c__5565__auto___4316);
var G__4320 = (0);
seq__4245_4303 = G__4317;
chunk__4246_4304 = G__4318;
count__4247_4305 = G__4319;
i__4248_4306 = G__4320;
continue;
} else {
var vec__4258_4321 = cljs.core.first.call(null,seq__4245_4315__$1);
var pno_4322 = cljs.core.nth.call(null,vec__4258_4321,(0),null);
var pmask_4323 = cljs.core.nth.call(null,vec__4258_4321,(1),null);
cljs.compiler.emitln.call(null,"this.cljs$lang$protocol_mask$partition",pno_4322,"$ = ",pmask_4323,";");


var G__4324 = cljs.core.next.call(null,seq__4245_4315__$1);
var G__4325 = null;
var G__4326 = (0);
var G__4327 = (0);
seq__4245_4303 = G__4324;
chunk__4246_4304 = G__4325;
count__4247_4305 = G__4326;
i__4248_4306 = G__4327;
continue;
}
} else {
}
}
break;
}

cljs.compiler.emitln.call(null,"});");

return cljs.compiler.emit.call(null,body);
}));
cljs.core._add_method.call(null,cljs.compiler.emit_STAR_,new cljs.core.Keyword(null,"defrecord","defrecord",-1367493418),(function (p__4328){
var map__4329 = p__4328;
var map__4329__$1 = cljs.core.__destructure_map.call(null,map__4329);
var t = cljs.core.get.call(null,map__4329__$1,new cljs.core.Keyword(null,"t","t",-1397832519));
var fields = cljs.core.get.call(null,map__4329__$1,new cljs.core.Keyword(null,"fields","fields",-1932066230));
var pmasks = cljs.core.get.call(null,map__4329__$1,new cljs.core.Keyword(null,"pmasks","pmasks",-871416698));
var body = cljs.core.get.call(null,map__4329__$1,new cljs.core.Keyword(null,"body","body",-2049205669));
var protocols = cljs.core.get.call(null,map__4329__$1,new cljs.core.Keyword(null,"protocols","protocols",-5615896));
var fields__$1 = cljs.core.concat.call(null,cljs.core.map.call(null,cljs.compiler.munge,fields),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"__meta","__meta",-946752628,null),new cljs.core.Symbol(null,"__extmap","__extmap",-1435580931,null),new cljs.core.Symbol(null,"__hash","__hash",-1328796629,null)], null));
cljs.compiler.emitln.call(null,"");

cljs.compiler.emitln.call(null,"/**");

cljs.compiler.emitln.call(null,"* @constructor");

var seq__4330_4354 = cljs.core.seq.call(null,protocols);
var chunk__4331_4355 = null;
var count__4332_4356 = (0);
var i__4333_4357 = (0);
while(true){
if((i__4333_4357 < count__4332_4356)){
var protocol_4358 = cljs.core._nth.call(null,chunk__4331_4355,i__4333_4357);
cljs.compiler.emitln.call(null," * @implements {",cljs.compiler.munge.call(null,cljs.core.str.cljs$core$IFn$_invoke$arity$1(protocol_4358)),"}");


var G__4359 = seq__4330_4354;
var G__4360 = chunk__4331_4355;
var G__4361 = count__4332_4356;
var G__4362 = (i__4333_4357 + (1));
seq__4330_4354 = G__4359;
chunk__4331_4355 = G__4360;
count__4332_4356 = G__4361;
i__4333_4357 = G__4362;
continue;
} else {
var temp__5804__auto___4363 = cljs.core.seq.call(null,seq__4330_4354);
if(temp__5804__auto___4363){
var seq__4330_4364__$1 = temp__5804__auto___4363;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__4330_4364__$1)){
var c__5565__auto___4365 = cljs.core.chunk_first.call(null,seq__4330_4364__$1);
var G__4366 = cljs.core.chunk_rest.call(null,seq__4330_4364__$1);
var G__4367 = c__5565__auto___4365;
var G__4368 = cljs.core.count.call(null,c__5565__auto___4365);
var G__4369 = (0);
seq__4330_4354 = G__4366;
chunk__4331_4355 = G__4367;
count__4332_4356 = G__4368;
i__4333_4357 = G__4369;
continue;
} else {
var protocol_4370 = cljs.core.first.call(null,seq__4330_4364__$1);
cljs.compiler.emitln.call(null," * @implements {",cljs.compiler.munge.call(null,cljs.core.str.cljs$core$IFn$_invoke$arity$1(protocol_4370)),"}");


var G__4371 = cljs.core.next.call(null,seq__4330_4364__$1);
var G__4372 = null;
var G__4373 = (0);
var G__4374 = (0);
seq__4330_4354 = G__4371;
chunk__4331_4355 = G__4372;
count__4332_4356 = G__4373;
i__4333_4357 = G__4374;
continue;
}
} else {
}
}
break;
}

cljs.compiler.emitln.call(null,"*/");

cljs.compiler.emitln.call(null,cljs.compiler.munge.call(null,t)," = (function (",cljs.compiler.comma_sep.call(null,fields__$1),"){");

var seq__4334_4375 = cljs.core.seq.call(null,fields__$1);
var chunk__4335_4376 = null;
var count__4336_4377 = (0);
var i__4337_4378 = (0);
while(true){
if((i__4337_4378 < count__4336_4377)){
var fld_4379 = cljs.core._nth.call(null,chunk__4335_4376,i__4337_4378);
cljs.compiler.emitln.call(null,"this.",fld_4379," = ",fld_4379,";");


var G__4380 = seq__4334_4375;
var G__4381 = chunk__4335_4376;
var G__4382 = count__4336_4377;
var G__4383 = (i__4337_4378 + (1));
seq__4334_4375 = G__4380;
chunk__4335_4376 = G__4381;
count__4336_4377 = G__4382;
i__4337_4378 = G__4383;
continue;
} else {
var temp__5804__auto___4384 = cljs.core.seq.call(null,seq__4334_4375);
if(temp__5804__auto___4384){
var seq__4334_4385__$1 = temp__5804__auto___4384;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__4334_4385__$1)){
var c__5565__auto___4386 = cljs.core.chunk_first.call(null,seq__4334_4385__$1);
var G__4387 = cljs.core.chunk_rest.call(null,seq__4334_4385__$1);
var G__4388 = c__5565__auto___4386;
var G__4389 = cljs.core.count.call(null,c__5565__auto___4386);
var G__4390 = (0);
seq__4334_4375 = G__4387;
chunk__4335_4376 = G__4388;
count__4336_4377 = G__4389;
i__4337_4378 = G__4390;
continue;
} else {
var fld_4391 = cljs.core.first.call(null,seq__4334_4385__$1);
cljs.compiler.emitln.call(null,"this.",fld_4391," = ",fld_4391,";");


var G__4392 = cljs.core.next.call(null,seq__4334_4385__$1);
var G__4393 = null;
var G__4394 = (0);
var G__4395 = (0);
seq__4334_4375 = G__4392;
chunk__4335_4376 = G__4393;
count__4336_4377 = G__4394;
i__4337_4378 = G__4395;
continue;
}
} else {
}
}
break;
}

var seq__4338_4396 = cljs.core.seq.call(null,pmasks);
var chunk__4339_4397 = null;
var count__4340_4398 = (0);
var i__4341_4399 = (0);
while(true){
if((i__4341_4399 < count__4340_4398)){
var vec__4348_4400 = cljs.core._nth.call(null,chunk__4339_4397,i__4341_4399);
var pno_4401 = cljs.core.nth.call(null,vec__4348_4400,(0),null);
var pmask_4402 = cljs.core.nth.call(null,vec__4348_4400,(1),null);
cljs.compiler.emitln.call(null,"this.cljs$lang$protocol_mask$partition",pno_4401,"$ = ",pmask_4402,";");


var G__4403 = seq__4338_4396;
var G__4404 = chunk__4339_4397;
var G__4405 = count__4340_4398;
var G__4406 = (i__4341_4399 + (1));
seq__4338_4396 = G__4403;
chunk__4339_4397 = G__4404;
count__4340_4398 = G__4405;
i__4341_4399 = G__4406;
continue;
} else {
var temp__5804__auto___4407 = cljs.core.seq.call(null,seq__4338_4396);
if(temp__5804__auto___4407){
var seq__4338_4408__$1 = temp__5804__auto___4407;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__4338_4408__$1)){
var c__5565__auto___4409 = cljs.core.chunk_first.call(null,seq__4338_4408__$1);
var G__4410 = cljs.core.chunk_rest.call(null,seq__4338_4408__$1);
var G__4411 = c__5565__auto___4409;
var G__4412 = cljs.core.count.call(null,c__5565__auto___4409);
var G__4413 = (0);
seq__4338_4396 = G__4410;
chunk__4339_4397 = G__4411;
count__4340_4398 = G__4412;
i__4341_4399 = G__4413;
continue;
} else {
var vec__4351_4414 = cljs.core.first.call(null,seq__4338_4408__$1);
var pno_4415 = cljs.core.nth.call(null,vec__4351_4414,(0),null);
var pmask_4416 = cljs.core.nth.call(null,vec__4351_4414,(1),null);
cljs.compiler.emitln.call(null,"this.cljs$lang$protocol_mask$partition",pno_4415,"$ = ",pmask_4416,";");


var G__4417 = cljs.core.next.call(null,seq__4338_4408__$1);
var G__4418 = null;
var G__4419 = (0);
var G__4420 = (0);
seq__4338_4396 = G__4417;
chunk__4339_4397 = G__4418;
count__4340_4398 = G__4419;
i__4341_4399 = G__4420;
continue;
}
} else {
}
}
break;
}

cljs.compiler.emitln.call(null,"});");

return cljs.compiler.emit.call(null,body);
}));
cljs.compiler.emit_dot = (function cljs$compiler$emit_dot(p__4421){
var map__4422 = p__4421;
var map__4422__$1 = cljs.core.__destructure_map.call(null,map__4422);
var target = cljs.core.get.call(null,map__4422__$1,new cljs.core.Keyword(null,"target","target",253001721));
var field = cljs.core.get.call(null,map__4422__$1,new cljs.core.Keyword(null,"field","field",-1302436500));
var method = cljs.core.get.call(null,map__4422__$1,new cljs.core.Keyword(null,"method","method",55703592));
var args = cljs.core.get.call(null,map__4422__$1,new cljs.core.Keyword(null,"args","args",1315556576));
var env = cljs.core.get.call(null,map__4422__$1,new cljs.core.Keyword(null,"env","env",-1815813235));
var env__9253__auto__ = env;
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"return","return",-1891502105),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env__9253__auto__))){
cljs.compiler.emits.call(null,"return ");
} else {
}

if(cljs.core.truth_(field)){
cljs.compiler.emits.call(null,target,".",cljs.compiler.munge.call(null,field,cljs.core.PersistentHashSet.EMPTY));
} else {
cljs.compiler.emits.call(null,target,".",cljs.compiler.munge.call(null,method,cljs.core.PersistentHashSet.EMPTY),"(",cljs.compiler.comma_sep.call(null,args),")");
}

if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"expr","expr",745722291),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env__9253__auto__))){
return null;
} else {
return cljs.compiler.emitln.call(null,";");
}
});
cljs.core._add_method.call(null,cljs.compiler.emit_STAR_,new cljs.core.Keyword(null,"host-field","host-field",-72662140),(function (ast){
return cljs.compiler.emit_dot.call(null,ast);
}));
cljs.core._add_method.call(null,cljs.compiler.emit_STAR_,new cljs.core.Keyword(null,"host-call","host-call",1059629755),(function (ast){
return cljs.compiler.emit_dot.call(null,ast);
}));
cljs.core._add_method.call(null,cljs.compiler.emit_STAR_,new cljs.core.Keyword(null,"js","js",1768080579),(function (p__4423){
var map__4424 = p__4423;
var map__4424__$1 = cljs.core.__destructure_map.call(null,map__4424);
var op = cljs.core.get.call(null,map__4424__$1,new cljs.core.Keyword(null,"op","op",-1882987955));
var env = cljs.core.get.call(null,map__4424__$1,new cljs.core.Keyword(null,"env","env",-1815813235));
var code = cljs.core.get.call(null,map__4424__$1,new cljs.core.Keyword(null,"code","code",1586293142));
var segs = cljs.core.get.call(null,map__4424__$1,new cljs.core.Keyword(null,"segs","segs",-1940299576));
var args = cljs.core.get.call(null,map__4424__$1,new cljs.core.Keyword(null,"args","args",1315556576));
if(cljs.core.truth_((function (){var and__5041__auto__ = code;
if(cljs.core.truth_(and__5041__auto__)){
return goog.string.startsWith(clojure.string.trim.call(null,code),"/*");
} else {
return and__5041__auto__;
}
})())){
return cljs.compiler.emits.call(null,code);
} else {
var env__9253__auto__ = env;
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"return","return",-1891502105),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env__9253__auto__))){
cljs.compiler.emits.call(null,"return ");
} else {
}

if(cljs.core.truth_(code)){
cljs.compiler.emits.call(null,code);
} else {
cljs.compiler.emits.call(null,cljs.core.interleave.call(null,cljs.core.concat.call(null,segs,cljs.core.repeat.call(null,null)),cljs.core.concat.call(null,args,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [null], null))));
}

if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"expr","expr",745722291),new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(env__9253__auto__))){
return null;
} else {
return cljs.compiler.emitln.call(null,";");
}
}
}));
cljs.compiler.emit_constants_table = (function cljs$compiler$emit_constants_table(table){
cljs.compiler.emitln.call(null,"goog.provide('",cljs.compiler.munge.call(null,cljs.analyzer.constants_ns_sym),"');");

cljs.compiler.emitln.call(null,"goog.require('cljs.core');");

var seq__4429 = cljs.core.seq.call(null,table);
var chunk__4430 = null;
var count__4431 = (0);
var i__4432 = (0);
while(true){
if((i__4432 < count__4431)){
var vec__4439 = cljs.core._nth.call(null,chunk__4430,i__4432);
var sym = cljs.core.nth.call(null,vec__4439,(0),null);
var value = cljs.core.nth.call(null,vec__4439,(1),null);
var ns_4445 = cljs.core.namespace.call(null,sym);
var name_4446 = cljs.core.name.call(null,sym);
cljs.compiler.emits.call(null,"cljs.core.",value," = ");

if((sym instanceof cljs.core.Keyword)){
cljs.compiler.emits_keyword.call(null,sym);
} else {
if((sym instanceof cljs.core.Symbol)){
cljs.compiler.emits_symbol.call(null,sym);
} else {
throw cljs.core.ex_info.call(null,["Cannot emit constant for type ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.type.call(null,sym))].join(''),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"invalid-constant-type","invalid-constant-type",1294847471),new cljs.core.Keyword("clojure.error","phase","clojure.error/phase",275140358),new cljs.core.Keyword(null,"compilation","compilation",-1328774561)], null));

}
}

cljs.compiler.emits.call(null,";\n");


var G__4447 = seq__4429;
var G__4448 = chunk__4430;
var G__4449 = count__4431;
var G__4450 = (i__4432 + (1));
seq__4429 = G__4447;
chunk__4430 = G__4448;
count__4431 = G__4449;
i__4432 = G__4450;
continue;
} else {
var temp__5804__auto__ = cljs.core.seq.call(null,seq__4429);
if(temp__5804__auto__){
var seq__4429__$1 = temp__5804__auto__;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__4429__$1)){
var c__5565__auto__ = cljs.core.chunk_first.call(null,seq__4429__$1);
var G__4451 = cljs.core.chunk_rest.call(null,seq__4429__$1);
var G__4452 = c__5565__auto__;
var G__4453 = cljs.core.count.call(null,c__5565__auto__);
var G__4454 = (0);
seq__4429 = G__4451;
chunk__4430 = G__4452;
count__4431 = G__4453;
i__4432 = G__4454;
continue;
} else {
var vec__4442 = cljs.core.first.call(null,seq__4429__$1);
var sym = cljs.core.nth.call(null,vec__4442,(0),null);
var value = cljs.core.nth.call(null,vec__4442,(1),null);
var ns_4455 = cljs.core.namespace.call(null,sym);
var name_4456 = cljs.core.name.call(null,sym);
cljs.compiler.emits.call(null,"cljs.core.",value," = ");

if((sym instanceof cljs.core.Keyword)){
cljs.compiler.emits_keyword.call(null,sym);
} else {
if((sym instanceof cljs.core.Symbol)){
cljs.compiler.emits_symbol.call(null,sym);
} else {
throw cljs.core.ex_info.call(null,["Cannot emit constant for type ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.type.call(null,sym))].join(''),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"invalid-constant-type","invalid-constant-type",1294847471),new cljs.core.Keyword("clojure.error","phase","clojure.error/phase",275140358),new cljs.core.Keyword(null,"compilation","compilation",-1328774561)], null));

}
}

cljs.compiler.emits.call(null,";\n");


var G__4457 = cljs.core.next.call(null,seq__4429__$1);
var G__4458 = null;
var G__4459 = (0);
var G__4460 = (0);
seq__4429 = G__4457;
chunk__4430 = G__4458;
count__4431 = G__4459;
i__4432 = G__4460;
continue;
}
} else {
return null;
}
}
break;
}
});
cljs.compiler.emit_externs = (function cljs$compiler$emit_externs(var_args){
var G__4462 = arguments.length;
switch (G__4462) {
case 1:
return cljs.compiler.emit_externs.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 4:
return cljs.compiler.emit_externs.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs.compiler.emit_externs.cljs$core$IFn$_invoke$arity$1 = (function (externs){
return cljs.compiler.emit_externs.call(null,cljs.core.PersistentVector.EMPTY,externs,cljs.core.atom.call(null,cljs.core.PersistentHashSet.EMPTY),(cljs.core.truth_(cljs.env._STAR_compiler_STAR_)?cljs.analyzer.get_externs.call(null):null));
}));

(cljs.compiler.emit_externs.cljs$core$IFn$_invoke$arity$4 = (function (prefix,externs,top_level,known_externs){
var ks = cljs.core.seq.call(null,cljs.core.keys.call(null,externs));
while(true){
if(ks){
var k_4467 = cljs.core.first.call(null,ks);
var vec__4463_4468 = cljs.core.conj.call(null,prefix,k_4467);
var top_4469 = cljs.core.nth.call(null,vec__4463_4468,(0),null);
var prefix_SINGLEQUOTE__4470 = vec__4463_4468;
if(((cljs.core.not_EQ_.call(null,new cljs.core.Symbol(null,"prototype","prototype",519166522,null),k_4467)) && ((cljs.core.get_in.call(null,known_externs,prefix_SINGLEQUOTE__4470) == null)))){
if((!(((cljs.core.contains_QMARK_.call(null,cljs.core.deref.call(null,top_level),top_4469)) || (cljs.core.contains_QMARK_.call(null,known_externs,top_4469)))))){
cljs.compiler.emitln.call(null,"var ",clojure.string.join.call(null,".",cljs.core.map.call(null,cljs.compiler.munge,prefix_SINGLEQUOTE__4470)),";");

cljs.core.swap_BANG_.call(null,top_level,cljs.core.conj,top_4469);
} else {
cljs.compiler.emitln.call(null,clojure.string.join.call(null,".",cljs.core.map.call(null,cljs.compiler.munge,prefix_SINGLEQUOTE__4470)),";");
}
} else {
}

var m_4471 = cljs.core.get.call(null,externs,k_4467);
if(cljs.core.empty_QMARK_.call(null,m_4471)){
} else {
cljs.compiler.emit_externs.call(null,prefix_SINGLEQUOTE__4470,m_4471,top_level,known_externs);
}

var G__4472 = cljs.core.next.call(null,ks);
ks = G__4472;
continue;
} else {
return null;
}
break;
}
}));

(cljs.compiler.emit_externs.cljs$lang$maxFixedArity = 4);


//# sourceMappingURL=compiler.js.map
