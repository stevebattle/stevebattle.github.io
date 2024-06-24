// Compiled by ClojureScript 1.11.54 {:optimizations :none}
goog.provide('cljs.analyzer.impl.namespaces');
goog.require('cljs.core');
/**
 * Given a libspec return a map of :as-alias alias, if was present. Return the
 * libspec with :as-alias elided. If the libspec was *only* :as-alias do not
 * return it.
 */
cljs.analyzer.impl.namespaces.check_and_remove_as_alias = (function cljs$analyzer$impl$namespaces$check_and_remove_as_alias(libspec){
if((((libspec instanceof cljs.core.Symbol)) || ((libspec instanceof cljs.core.Keyword)))){
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"libspec","libspec",1228503756),libspec], null);
} else {
var vec__922 = libspec;
var seq__923 = cljs.core.seq.call(null,vec__922);
var first__924 = cljs.core.first.call(null,seq__923);
var seq__923__$1 = cljs.core.next.call(null,seq__923);
var lib = first__924;
var spec = seq__923__$1;
var libspec__$1 = vec__922;
var vec__925 = cljs.core.split_with.call(null,cljs.core.complement.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"as-alias","as-alias",82482467),null], null), null)),spec);
var pre_spec = cljs.core.nth.call(null,vec__925,(0),null);
var vec__928 = cljs.core.nth.call(null,vec__925,(1),null);
var seq__929 = cljs.core.seq.call(null,vec__928);
var first__930 = cljs.core.first.call(null,seq__929);
var seq__929__$1 = cljs.core.next.call(null,seq__929);
var _ = first__930;
var first__930__$1 = cljs.core.first.call(null,seq__929__$1);
var seq__929__$2 = cljs.core.next.call(null,seq__929__$1);
var alias = first__930__$1;
var post_spec = seq__929__$2;
var post = vec__928;
if(cljs.core.seq.call(null,post)){
var libspec_SINGLEQUOTE_ = cljs.core.into.call(null,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [lib], null),cljs.core.concat.call(null,pre_spec,post_spec));
if((alias instanceof cljs.core.Symbol)){
} else {
throw (new Error(["Assert failed: ",[":as-alias must be followed by a symbol, got: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(alias)].join(''),"\n","(symbol? alias)"].join('')));
}

var G__931 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"as-alias","as-alias",82482467),cljs.core.PersistentArrayMap.createAsIfByAssoc([alias,lib])], null);
if((cljs.core.count.call(null,libspec_SINGLEQUOTE_) > (1))){
return cljs.core.assoc.call(null,G__931,new cljs.core.Keyword(null,"libspec","libspec",1228503756),libspec_SINGLEQUOTE_);
} else {
return G__931;
}
} else {
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"libspec","libspec",1228503756),libspec__$1], null);
}
}
});
cljs.analyzer.impl.namespaces.check_as_alias_duplicates = (function cljs$analyzer$impl$namespaces$check_as_alias_duplicates(as_aliases,new_as_aliases){
var seq__932 = cljs.core.seq.call(null,new_as_aliases);
var chunk__933 = null;
var count__934 = (0);
var i__935 = (0);
while(true){
if((i__935 < count__934)){
var vec__942 = cljs.core._nth.call(null,chunk__933,i__935);
var alias = cljs.core.nth.call(null,vec__942,(0),null);
var _ = cljs.core.nth.call(null,vec__942,(1),null);
if((!(cljs.core.contains_QMARK_.call(null,as_aliases,alias)))){
} else {
throw (new Error(["Assert failed: ",["Duplicate :as-alias ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(alias),", already in use for lib ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.get.call(null,as_aliases,alias))].join(''),"\n","(not (contains? as-aliases alias))"].join('')));
}


var G__948 = seq__932;
var G__949 = chunk__933;
var G__950 = count__934;
var G__951 = (i__935 + (1));
seq__932 = G__948;
chunk__933 = G__949;
count__934 = G__950;
i__935 = G__951;
continue;
} else {
var temp__5804__auto__ = cljs.core.seq.call(null,seq__932);
if(temp__5804__auto__){
var seq__932__$1 = temp__5804__auto__;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__932__$1)){
var c__5565__auto__ = cljs.core.chunk_first.call(null,seq__932__$1);
var G__952 = cljs.core.chunk_rest.call(null,seq__932__$1);
var G__953 = c__5565__auto__;
var G__954 = cljs.core.count.call(null,c__5565__auto__);
var G__955 = (0);
seq__932 = G__952;
chunk__933 = G__953;
count__934 = G__954;
i__935 = G__955;
continue;
} else {
var vec__945 = cljs.core.first.call(null,seq__932__$1);
var alias = cljs.core.nth.call(null,vec__945,(0),null);
var _ = cljs.core.nth.call(null,vec__945,(1),null);
if((!(cljs.core.contains_QMARK_.call(null,as_aliases,alias)))){
} else {
throw (new Error(["Assert failed: ",["Duplicate :as-alias ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(alias),", already in use for lib ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.get.call(null,as_aliases,alias))].join(''),"\n","(not (contains? as-aliases alias))"].join('')));
}


var G__956 = cljs.core.next.call(null,seq__932__$1);
var G__957 = null;
var G__958 = (0);
var G__959 = (0);
seq__932 = G__956;
chunk__933 = G__957;
count__934 = G__958;
i__935 = G__959;
continue;
}
} else {
return null;
}
}
break;
}
});
/**
 * Given libspecs, elide all :as-alias. Return a map of :libspecs (filtered)
 * and :as-aliases.
 */
cljs.analyzer.impl.namespaces.elide_aliases_from_libspecs = (function cljs$analyzer$impl$namespaces$elide_aliases_from_libspecs(var_args){
var G__961 = arguments.length;
switch (G__961) {
case 1:
return cljs.analyzer.impl.namespaces.elide_aliases_from_libspecs.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs.analyzer.impl.namespaces.elide_aliases_from_libspecs.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(cljs.analyzer.impl.namespaces.elide_aliases_from_libspecs.cljs$core$IFn$_invoke$arity$1 = (function (libspecs){
return cljs.analyzer.impl.namespaces.elide_aliases_from_libspecs.call(null,libspecs,cljs.core.PersistentArrayMap.EMPTY);
}));

(cljs.analyzer.impl.namespaces.elide_aliases_from_libspecs.cljs$core$IFn$_invoke$arity$2 = (function (libspecs,as_aliases){
var ret = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"as-aliases","as-aliases",1485064798),as_aliases,new cljs.core.Keyword(null,"libspecs","libspecs",59807195),cljs.core.PersistentVector.EMPTY], null);
return cljs.core.reduce.call(null,(function (ret__$1,libspec){
var map__962 = cljs.analyzer.impl.namespaces.check_and_remove_as_alias.call(null,libspec);
var map__962__$1 = cljs.core.__destructure_map.call(null,map__962);
var as_alias = cljs.core.get.call(null,map__962__$1,new cljs.core.Keyword(null,"as-alias","as-alias",82482467));
var libspec__$1 = cljs.core.get.call(null,map__962__$1,new cljs.core.Keyword(null,"libspec","libspec",1228503756));
cljs.analyzer.impl.namespaces.check_as_alias_duplicates.call(null,new cljs.core.Keyword(null,"as-aliases","as-aliases",1485064798).cljs$core$IFn$_invoke$arity$1(ret__$1),as_alias);

var G__963 = ret__$1;
var G__963__$1 = (cljs.core.truth_(libspec__$1)?cljs.core.update.call(null,G__963,new cljs.core.Keyword(null,"libspecs","libspecs",59807195),cljs.core.conj,libspec__$1):G__963);
if(cljs.core.truth_(as_alias)){
return cljs.core.update.call(null,G__963__$1,new cljs.core.Keyword(null,"as-aliases","as-aliases",1485064798),cljs.core.merge,as_alias);
} else {
return G__963__$1;
}
}),ret,libspecs);
}));

(cljs.analyzer.impl.namespaces.elide_aliases_from_libspecs.cljs$lang$maxFixedArity = 2);

cljs.analyzer.impl.namespaces.elide_aliases_from_ns_specs = (function cljs$analyzer$impl$namespaces$elide_aliases_from_ns_specs(ns_specs){

var ret = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"as-aliases","as-aliases",1485064798),cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"libspecs","libspecs",59807195),cljs.core.PersistentVector.EMPTY], null);
return cljs.core.reduce.call(null,(function (p__965,p__966){
var map__967 = p__965;
var map__967__$1 = cljs.core.__destructure_map.call(null,map__967);
var ret__$1 = map__967__$1;
var as_aliases = cljs.core.get.call(null,map__967__$1,new cljs.core.Keyword(null,"as-aliases","as-aliases",1485064798));
var vec__968 = p__966;
var seq__969 = cljs.core.seq.call(null,vec__968);
var first__970 = cljs.core.first.call(null,seq__969);
var seq__969__$1 = cljs.core.next.call(null,seq__969);
var spec_key = first__970;
var libspecs = seq__969__$1;
if((!(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"refer-clojure","refer-clojure",813784440),spec_key)))){
var map__971 = cljs.analyzer.impl.namespaces.elide_aliases_from_libspecs.call(null,libspecs,as_aliases);
var map__971__$1 = cljs.core.__destructure_map.call(null,map__971);
var as_aliases__$1 = cljs.core.get.call(null,map__971__$1,new cljs.core.Keyword(null,"as-aliases","as-aliases",1485064798));
var libspecs__$1 = cljs.core.get.call(null,map__971__$1,new cljs.core.Keyword(null,"libspecs","libspecs",59807195));
var G__972 = ret__$1;
var G__972__$1 = (((!(cljs.core.empty_QMARK_.call(null,as_aliases__$1))))?cljs.core.update.call(null,G__972,new cljs.core.Keyword(null,"as-aliases","as-aliases",1485064798),cljs.core.merge,as_aliases__$1):G__972);
if((!(cljs.core.empty_QMARK_.call(null,libspecs__$1)))){
return cljs.core.update.call(null,G__972__$1,new cljs.core.Keyword(null,"libspecs","libspecs",59807195),cljs.core.conj,cljs.core.list_STAR_.call(null,spec_key,libspecs__$1));
} else {
return G__972__$1;
}
} else {
return cljs.core.update.call(null,ret__$1,new cljs.core.Keyword(null,"libspecs","libspecs",59807195),cljs.core.conj,cljs.core.list_STAR_.call(null,spec_key,libspecs));
}
}),ret,ns_specs);
});

//# sourceMappingURL=namespaces.js.map
