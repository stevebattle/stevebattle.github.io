// Compiled by ClojureScript 1.11.54 {:optimizations :none}
goog.provide('cljs.repl');
goog.require('cljs.core');
goog.require('cljs.spec.alpha');
goog.require('goog.string');
goog.require('goog.string.format');
cljs.repl.print_doc = (function cljs$repl$print_doc(p__1484){
var map__1485 = p__1484;
var map__1485__$1 = cljs.core.__destructure_map.call(null,map__1485);
var m = map__1485__$1;
var n = cljs.core.get.call(null,map__1485__$1,new cljs.core.Keyword(null,"ns","ns",441598760));
var nm = cljs.core.get.call(null,map__1485__$1,new cljs.core.Keyword(null,"name","name",1843675177));
cljs.core.println.call(null,"-------------------------");

cljs.core.println.call(null,(function (){var or__5043__auto__ = new cljs.core.Keyword(null,"spec","spec",347520401).cljs$core$IFn$_invoke$arity$1(m);
if(cljs.core.truth_(or__5043__auto__)){
return or__5043__auto__;
} else {
return [(function (){var temp__5804__auto__ = new cljs.core.Keyword(null,"ns","ns",441598760).cljs$core$IFn$_invoke$arity$1(m);
if(cljs.core.truth_(temp__5804__auto__)){
var ns = temp__5804__auto__;
return [cljs.core.str.cljs$core$IFn$_invoke$arity$1(ns),"/"].join('');
} else {
return null;
}
})(),cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(m))].join('');
}
})());

if(cljs.core.truth_(new cljs.core.Keyword(null,"protocol","protocol",652470118).cljs$core$IFn$_invoke$arity$1(m))){
cljs.core.println.call(null,"Protocol");
} else {
}

if(cljs.core.truth_(new cljs.core.Keyword(null,"forms","forms",2045992350).cljs$core$IFn$_invoke$arity$1(m))){
var seq__1486_1514 = cljs.core.seq.call(null,new cljs.core.Keyword(null,"forms","forms",2045992350).cljs$core$IFn$_invoke$arity$1(m));
var chunk__1487_1515 = null;
var count__1488_1516 = (0);
var i__1489_1517 = (0);
while(true){
if((i__1489_1517 < count__1488_1516)){
var f_1518 = cljs.core._nth.call(null,chunk__1487_1515,i__1489_1517);
cljs.core.println.call(null,"  ",f_1518);


var G__1519 = seq__1486_1514;
var G__1520 = chunk__1487_1515;
var G__1521 = count__1488_1516;
var G__1522 = (i__1489_1517 + (1));
seq__1486_1514 = G__1519;
chunk__1487_1515 = G__1520;
count__1488_1516 = G__1521;
i__1489_1517 = G__1522;
continue;
} else {
var temp__5804__auto___1523 = cljs.core.seq.call(null,seq__1486_1514);
if(temp__5804__auto___1523){
var seq__1486_1524__$1 = temp__5804__auto___1523;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__1486_1524__$1)){
var c__5565__auto___1525 = cljs.core.chunk_first.call(null,seq__1486_1524__$1);
var G__1526 = cljs.core.chunk_rest.call(null,seq__1486_1524__$1);
var G__1527 = c__5565__auto___1525;
var G__1528 = cljs.core.count.call(null,c__5565__auto___1525);
var G__1529 = (0);
seq__1486_1514 = G__1526;
chunk__1487_1515 = G__1527;
count__1488_1516 = G__1528;
i__1489_1517 = G__1529;
continue;
} else {
var f_1530 = cljs.core.first.call(null,seq__1486_1524__$1);
cljs.core.println.call(null,"  ",f_1530);


var G__1531 = cljs.core.next.call(null,seq__1486_1524__$1);
var G__1532 = null;
var G__1533 = (0);
var G__1534 = (0);
seq__1486_1514 = G__1531;
chunk__1487_1515 = G__1532;
count__1488_1516 = G__1533;
i__1489_1517 = G__1534;
continue;
}
} else {
}
}
break;
}
} else {
if(cljs.core.truth_(new cljs.core.Keyword(null,"arglists","arglists",1661989754).cljs$core$IFn$_invoke$arity$1(m))){
var arglists_1535 = new cljs.core.Keyword(null,"arglists","arglists",1661989754).cljs$core$IFn$_invoke$arity$1(m);
if(cljs.core.truth_((function (){var or__5043__auto__ = new cljs.core.Keyword(null,"macro","macro",-867863404).cljs$core$IFn$_invoke$arity$1(m);
if(cljs.core.truth_(or__5043__auto__)){
return or__5043__auto__;
} else {
return new cljs.core.Keyword(null,"repl-special-function","repl-special-function",1262603725).cljs$core$IFn$_invoke$arity$1(m);
}
})())){
cljs.core.prn.call(null,arglists_1535);
} else {
cljs.core.prn.call(null,((cljs.core._EQ_.call(null,new cljs.core.Symbol(null,"quote","quote",1377916282,null),cljs.core.first.call(null,arglists_1535)))?cljs.core.second.call(null,arglists_1535):arglists_1535));
}
} else {
}
}

if(cljs.core.truth_(new cljs.core.Keyword(null,"special-form","special-form",-1326536374).cljs$core$IFn$_invoke$arity$1(m))){
cljs.core.println.call(null,"Special Form");

cljs.core.println.call(null," ",new cljs.core.Keyword(null,"doc","doc",1913296891).cljs$core$IFn$_invoke$arity$1(m));

if(cljs.core.contains_QMARK_.call(null,m,new cljs.core.Keyword(null,"url","url",276297046))){
if(cljs.core.truth_(new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(m))){
return cljs.core.println.call(null,["\n  Please see http://clojure.org/",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(m))].join(''));
} else {
return null;
}
} else {
return cljs.core.println.call(null,["\n  Please see http://clojure.org/special_forms#",cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(m))].join(''));
}
} else {
if(cljs.core.truth_(new cljs.core.Keyword(null,"macro","macro",-867863404).cljs$core$IFn$_invoke$arity$1(m))){
cljs.core.println.call(null,"Macro");
} else {
}

if(cljs.core.truth_(new cljs.core.Keyword(null,"spec","spec",347520401).cljs$core$IFn$_invoke$arity$1(m))){
cljs.core.println.call(null,"Spec");
} else {
}

if(cljs.core.truth_(new cljs.core.Keyword(null,"repl-special-function","repl-special-function",1262603725).cljs$core$IFn$_invoke$arity$1(m))){
cljs.core.println.call(null,"REPL Special Function");
} else {
}

cljs.core.println.call(null," ",new cljs.core.Keyword(null,"doc","doc",1913296891).cljs$core$IFn$_invoke$arity$1(m));

if(cljs.core.truth_(new cljs.core.Keyword(null,"protocol","protocol",652470118).cljs$core$IFn$_invoke$arity$1(m))){
var seq__1490_1536 = cljs.core.seq.call(null,new cljs.core.Keyword(null,"methods","methods",453930866).cljs$core$IFn$_invoke$arity$1(m));
var chunk__1491_1537 = null;
var count__1492_1538 = (0);
var i__1493_1539 = (0);
while(true){
if((i__1493_1539 < count__1492_1538)){
var vec__1502_1540 = cljs.core._nth.call(null,chunk__1491_1537,i__1493_1539);
var name_1541 = cljs.core.nth.call(null,vec__1502_1540,(0),null);
var map__1505_1542 = cljs.core.nth.call(null,vec__1502_1540,(1),null);
var map__1505_1543__$1 = cljs.core.__destructure_map.call(null,map__1505_1542);
var doc_1544 = cljs.core.get.call(null,map__1505_1543__$1,new cljs.core.Keyword(null,"doc","doc",1913296891));
var arglists_1545 = cljs.core.get.call(null,map__1505_1543__$1,new cljs.core.Keyword(null,"arglists","arglists",1661989754));
cljs.core.println.call(null);

cljs.core.println.call(null," ",name_1541);

cljs.core.println.call(null," ",arglists_1545);

if(cljs.core.truth_(doc_1544)){
cljs.core.println.call(null," ",doc_1544);
} else {
}


var G__1546 = seq__1490_1536;
var G__1547 = chunk__1491_1537;
var G__1548 = count__1492_1538;
var G__1549 = (i__1493_1539 + (1));
seq__1490_1536 = G__1546;
chunk__1491_1537 = G__1547;
count__1492_1538 = G__1548;
i__1493_1539 = G__1549;
continue;
} else {
var temp__5804__auto___1550 = cljs.core.seq.call(null,seq__1490_1536);
if(temp__5804__auto___1550){
var seq__1490_1551__$1 = temp__5804__auto___1550;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__1490_1551__$1)){
var c__5565__auto___1552 = cljs.core.chunk_first.call(null,seq__1490_1551__$1);
var G__1553 = cljs.core.chunk_rest.call(null,seq__1490_1551__$1);
var G__1554 = c__5565__auto___1552;
var G__1555 = cljs.core.count.call(null,c__5565__auto___1552);
var G__1556 = (0);
seq__1490_1536 = G__1553;
chunk__1491_1537 = G__1554;
count__1492_1538 = G__1555;
i__1493_1539 = G__1556;
continue;
} else {
var vec__1506_1557 = cljs.core.first.call(null,seq__1490_1551__$1);
var name_1558 = cljs.core.nth.call(null,vec__1506_1557,(0),null);
var map__1509_1559 = cljs.core.nth.call(null,vec__1506_1557,(1),null);
var map__1509_1560__$1 = cljs.core.__destructure_map.call(null,map__1509_1559);
var doc_1561 = cljs.core.get.call(null,map__1509_1560__$1,new cljs.core.Keyword(null,"doc","doc",1913296891));
var arglists_1562 = cljs.core.get.call(null,map__1509_1560__$1,new cljs.core.Keyword(null,"arglists","arglists",1661989754));
cljs.core.println.call(null);

cljs.core.println.call(null," ",name_1558);

cljs.core.println.call(null," ",arglists_1562);

if(cljs.core.truth_(doc_1561)){
cljs.core.println.call(null," ",doc_1561);
} else {
}


var G__1563 = cljs.core.next.call(null,seq__1490_1551__$1);
var G__1564 = null;
var G__1565 = (0);
var G__1566 = (0);
seq__1490_1536 = G__1563;
chunk__1491_1537 = G__1564;
count__1492_1538 = G__1565;
i__1493_1539 = G__1566;
continue;
}
} else {
}
}
break;
}
} else {
}

if(cljs.core.truth_(n)){
var temp__5804__auto__ = cljs.spec.alpha.get_spec.call(null,cljs.core.symbol.call(null,cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.ns_name.call(null,n)),cljs.core.name.call(null,nm)));
if(cljs.core.truth_(temp__5804__auto__)){
var fnspec = temp__5804__auto__;
cljs.core.print.call(null,"Spec");

var seq__1510 = cljs.core.seq.call(null,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"args","args",1315556576),new cljs.core.Keyword(null,"ret","ret",-468222814),new cljs.core.Keyword(null,"fn","fn",-1175266204)], null));
var chunk__1511 = null;
var count__1512 = (0);
var i__1513 = (0);
while(true){
if((i__1513 < count__1512)){
var role = cljs.core._nth.call(null,chunk__1511,i__1513);
var temp__5804__auto___1567__$1 = cljs.core.get.call(null,fnspec,role);
if(cljs.core.truth_(temp__5804__auto___1567__$1)){
var spec_1568 = temp__5804__auto___1567__$1;
cljs.core.print.call(null,["\n ",cljs.core.name.call(null,role),":"].join(''),cljs.spec.alpha.describe.call(null,spec_1568));
} else {
}


var G__1569 = seq__1510;
var G__1570 = chunk__1511;
var G__1571 = count__1512;
var G__1572 = (i__1513 + (1));
seq__1510 = G__1569;
chunk__1511 = G__1570;
count__1512 = G__1571;
i__1513 = G__1572;
continue;
} else {
var temp__5804__auto____$1 = cljs.core.seq.call(null,seq__1510);
if(temp__5804__auto____$1){
var seq__1510__$1 = temp__5804__auto____$1;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__1510__$1)){
var c__5565__auto__ = cljs.core.chunk_first.call(null,seq__1510__$1);
var G__1573 = cljs.core.chunk_rest.call(null,seq__1510__$1);
var G__1574 = c__5565__auto__;
var G__1575 = cljs.core.count.call(null,c__5565__auto__);
var G__1576 = (0);
seq__1510 = G__1573;
chunk__1511 = G__1574;
count__1512 = G__1575;
i__1513 = G__1576;
continue;
} else {
var role = cljs.core.first.call(null,seq__1510__$1);
var temp__5804__auto___1577__$2 = cljs.core.get.call(null,fnspec,role);
if(cljs.core.truth_(temp__5804__auto___1577__$2)){
var spec_1578 = temp__5804__auto___1577__$2;
cljs.core.print.call(null,["\n ",cljs.core.name.call(null,role),":"].join(''),cljs.spec.alpha.describe.call(null,spec_1578));
} else {
}


var G__1579 = cljs.core.next.call(null,seq__1510__$1);
var G__1580 = null;
var G__1581 = (0);
var G__1582 = (0);
seq__1510 = G__1579;
chunk__1511 = G__1580;
count__1512 = G__1581;
i__1513 = G__1582;
continue;
}
} else {
return null;
}
}
break;
}
} else {
return null;
}
} else {
return null;
}
}
});
/**
 * Constructs a data representation for a Error with keys:
 *  :cause - root cause message
 *  :phase - error phase
 *  :via - cause chain, with cause keys:
 *           :type - exception class symbol
 *           :message - exception message
 *           :data - ex-data
 *           :at - top stack element
 *  :trace - root cause stack elements
 */
cljs.repl.Error__GT_map = (function cljs$repl$Error__GT_map(o){
var base = (function (t){
return cljs.core.merge.call(null,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"type","type",1174270348),(((t instanceof cljs.core.ExceptionInfo))?new cljs.core.Symbol("cljs.core","ExceptionInfo","cljs.core/ExceptionInfo",701839050,null):(((t instanceof Error))?cljs.core.symbol.call(null,"js",t.name):null
))], null),(function (){var temp__5804__auto__ = cljs.core.ex_message.call(null,t);
if(cljs.core.truth_(temp__5804__auto__)){
var msg = temp__5804__auto__;
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"message","message",-406056002),msg], null);
} else {
return null;
}
})(),(function (){var temp__5804__auto__ = cljs.core.ex_data.call(null,t);
if(cljs.core.truth_(temp__5804__auto__)){
var ed = temp__5804__auto__;
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"data","data",-232669377),ed], null);
} else {
return null;
}
})());
});
var via = (function (){var via = cljs.core.PersistentVector.EMPTY;
var t = o;
while(true){
if(cljs.core.truth_(t)){
var G__1583 = cljs.core.conj.call(null,via,t);
var G__1584 = cljs.core.ex_cause.call(null,t);
via = G__1583;
t = G__1584;
continue;
} else {
return via;
}
break;
}
})();
var root = cljs.core.peek.call(null,via);
return cljs.core.merge.call(null,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"via","via",-1904457336),cljs.core.vec.call(null,cljs.core.map.call(null,base,via)),new cljs.core.Keyword(null,"trace","trace",-1082747415),null], null),(function (){var temp__5804__auto__ = cljs.core.ex_message.call(null,root);
if(cljs.core.truth_(temp__5804__auto__)){
var root_msg = temp__5804__auto__;
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"cause","cause",231901252),root_msg], null);
} else {
return null;
}
})(),(function (){var temp__5804__auto__ = cljs.core.ex_data.call(null,root);
if(cljs.core.truth_(temp__5804__auto__)){
var data = temp__5804__auto__;
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"data","data",-232669377),data], null);
} else {
return null;
}
})(),(function (){var temp__5804__auto__ = new cljs.core.Keyword("clojure.error","phase","clojure.error/phase",275140358).cljs$core$IFn$_invoke$arity$1(cljs.core.ex_data.call(null,o));
if(cljs.core.truth_(temp__5804__auto__)){
var phase = temp__5804__auto__;
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"phase","phase",575722892),phase], null);
} else {
return null;
}
})());
});
/**
 * Returns an analysis of the phase, error, cause, and location of an error that occurred
 *   based on Throwable data, as returned by Throwable->map. All attributes other than phase
 *   are optional:
 *  :clojure.error/phase - keyword phase indicator, one of:
 *    :read-source :compile-syntax-check :compilation :macro-syntax-check :macroexpansion
 *    :execution :read-eval-result :print-eval-result
 *  :clojure.error/source - file name (no path)
 *  :clojure.error/line - integer line number
 *  :clojure.error/column - integer column number
 *  :clojure.error/symbol - symbol being expanded/compiled/invoked
 *  :clojure.error/class - cause exception class symbol
 *  :clojure.error/cause - cause exception message
 *  :clojure.error/spec - explain-data for spec error
 */
cljs.repl.ex_triage = (function cljs$repl$ex_triage(datafied_throwable){
var map__1587 = datafied_throwable;
var map__1587__$1 = cljs.core.__destructure_map.call(null,map__1587);
var via = cljs.core.get.call(null,map__1587__$1,new cljs.core.Keyword(null,"via","via",-1904457336));
var trace = cljs.core.get.call(null,map__1587__$1,new cljs.core.Keyword(null,"trace","trace",-1082747415));
var phase = cljs.core.get.call(null,map__1587__$1,new cljs.core.Keyword(null,"phase","phase",575722892),new cljs.core.Keyword(null,"execution","execution",253283524));
var map__1588 = cljs.core.last.call(null,via);
var map__1588__$1 = cljs.core.__destructure_map.call(null,map__1588);
var type = cljs.core.get.call(null,map__1588__$1,new cljs.core.Keyword(null,"type","type",1174270348));
var message = cljs.core.get.call(null,map__1588__$1,new cljs.core.Keyword(null,"message","message",-406056002));
var data = cljs.core.get.call(null,map__1588__$1,new cljs.core.Keyword(null,"data","data",-232669377));
var map__1589 = data;
var map__1589__$1 = cljs.core.__destructure_map.call(null,map__1589);
var problems = cljs.core.get.call(null,map__1589__$1,new cljs.core.Keyword("cljs.spec.alpha","problems","cljs.spec.alpha/problems",447400814));
var fn = cljs.core.get.call(null,map__1589__$1,new cljs.core.Keyword("cljs.spec.alpha","fn","cljs.spec.alpha/fn",408600443));
var caller = cljs.core.get.call(null,map__1589__$1,new cljs.core.Keyword("cljs.spec.test.alpha","caller","cljs.spec.test.alpha/caller",-398302390));
var map__1590 = new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(cljs.core.first.call(null,via));
var map__1590__$1 = cljs.core.__destructure_map.call(null,map__1590);
var top_data = map__1590__$1;
var source = cljs.core.get.call(null,map__1590__$1,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397));
return cljs.core.assoc.call(null,(function (){var G__1591 = phase;
var G__1591__$1 = (((G__1591 instanceof cljs.core.Keyword))?G__1591.fqn:null);
switch (G__1591__$1) {
case "read-source":
var map__1592 = data;
var map__1592__$1 = cljs.core.__destructure_map.call(null,map__1592);
var line = cljs.core.get.call(null,map__1592__$1,new cljs.core.Keyword("clojure.error","line","clojure.error/line",-1816287471));
var column = cljs.core.get.call(null,map__1592__$1,new cljs.core.Keyword("clojure.error","column","clojure.error/column",304721553));
var G__1593 = cljs.core.merge.call(null,new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(cljs.core.second.call(null,via)),top_data);
var G__1593__$1 = (cljs.core.truth_(source)?cljs.core.assoc.call(null,G__1593,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397),source):G__1593);
var G__1593__$2 = (cljs.core.truth_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["NO_SOURCE_PATH",null,"NO_SOURCE_FILE",null], null), null).call(null,source))?cljs.core.dissoc.call(null,G__1593__$1,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397)):G__1593__$1);
if(cljs.core.truth_(message)){
return cljs.core.assoc.call(null,G__1593__$2,new cljs.core.Keyword("clojure.error","cause","clojure.error/cause",-1879175742),message);
} else {
return G__1593__$2;
}

break;
case "compile-syntax-check":
case "compilation":
case "macro-syntax-check":
case "macroexpansion":
var G__1594 = top_data;
var G__1594__$1 = (cljs.core.truth_(source)?cljs.core.assoc.call(null,G__1594,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397),source):G__1594);
var G__1594__$2 = (cljs.core.truth_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["NO_SOURCE_PATH",null,"NO_SOURCE_FILE",null], null), null).call(null,source))?cljs.core.dissoc.call(null,G__1594__$1,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397)):G__1594__$1);
var G__1594__$3 = (cljs.core.truth_(type)?cljs.core.assoc.call(null,G__1594__$2,new cljs.core.Keyword("clojure.error","class","clojure.error/class",278435890),type):G__1594__$2);
var G__1594__$4 = (cljs.core.truth_(message)?cljs.core.assoc.call(null,G__1594__$3,new cljs.core.Keyword("clojure.error","cause","clojure.error/cause",-1879175742),message):G__1594__$3);
if(cljs.core.truth_(problems)){
return cljs.core.assoc.call(null,G__1594__$4,new cljs.core.Keyword("clojure.error","spec","clojure.error/spec",2055032595),data);
} else {
return G__1594__$4;
}

break;
case "read-eval-result":
case "print-eval-result":
var vec__1595 = cljs.core.first.call(null,trace);
var source__$1 = cljs.core.nth.call(null,vec__1595,(0),null);
var method = cljs.core.nth.call(null,vec__1595,(1),null);
var file = cljs.core.nth.call(null,vec__1595,(2),null);
var line = cljs.core.nth.call(null,vec__1595,(3),null);
var G__1598 = top_data;
var G__1598__$1 = (cljs.core.truth_(line)?cljs.core.assoc.call(null,G__1598,new cljs.core.Keyword("clojure.error","line","clojure.error/line",-1816287471),line):G__1598);
var G__1598__$2 = (cljs.core.truth_(file)?cljs.core.assoc.call(null,G__1598__$1,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397),file):G__1598__$1);
var G__1598__$3 = (cljs.core.truth_((function (){var and__5041__auto__ = source__$1;
if(cljs.core.truth_(and__5041__auto__)){
return method;
} else {
return and__5041__auto__;
}
})())?cljs.core.assoc.call(null,G__1598__$2,new cljs.core.Keyword("clojure.error","symbol","clojure.error/symbol",1544821994),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[source__$1,method],null))):G__1598__$2);
var G__1598__$4 = (cljs.core.truth_(type)?cljs.core.assoc.call(null,G__1598__$3,new cljs.core.Keyword("clojure.error","class","clojure.error/class",278435890),type):G__1598__$3);
if(cljs.core.truth_(message)){
return cljs.core.assoc.call(null,G__1598__$4,new cljs.core.Keyword("clojure.error","cause","clojure.error/cause",-1879175742),message);
} else {
return G__1598__$4;
}

break;
case "execution":
var vec__1599 = cljs.core.first.call(null,trace);
var source__$1 = cljs.core.nth.call(null,vec__1599,(0),null);
var method = cljs.core.nth.call(null,vec__1599,(1),null);
var file = cljs.core.nth.call(null,vec__1599,(2),null);
var line = cljs.core.nth.call(null,vec__1599,(3),null);
var file__$1 = cljs.core.first.call(null,cljs.core.remove.call(null,(function (p1__1586_SHARP_){
var or__5043__auto__ = (p1__1586_SHARP_ == null);
if(or__5043__auto__){
return or__5043__auto__;
} else {
return new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["NO_SOURCE_PATH",null,"NO_SOURCE_FILE",null], null), null).call(null,p1__1586_SHARP_);
}
}),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"file","file",-1269645878).cljs$core$IFn$_invoke$arity$1(caller),file], null)));
var err_line = (function (){var or__5043__auto__ = new cljs.core.Keyword(null,"line","line",212345235).cljs$core$IFn$_invoke$arity$1(caller);
if(cljs.core.truth_(or__5043__auto__)){
return or__5043__auto__;
} else {
return line;
}
})();
var G__1602 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword("clojure.error","class","clojure.error/class",278435890),type], null);
var G__1602__$1 = (cljs.core.truth_(err_line)?cljs.core.assoc.call(null,G__1602,new cljs.core.Keyword("clojure.error","line","clojure.error/line",-1816287471),err_line):G__1602);
var G__1602__$2 = (cljs.core.truth_(message)?cljs.core.assoc.call(null,G__1602__$1,new cljs.core.Keyword("clojure.error","cause","clojure.error/cause",-1879175742),message):G__1602__$1);
var G__1602__$3 = (cljs.core.truth_((function (){var or__5043__auto__ = fn;
if(cljs.core.truth_(or__5043__auto__)){
return or__5043__auto__;
} else {
var and__5041__auto__ = source__$1;
if(cljs.core.truth_(and__5041__auto__)){
return method;
} else {
return and__5041__auto__;
}
}
})())?cljs.core.assoc.call(null,G__1602__$2,new cljs.core.Keyword("clojure.error","symbol","clojure.error/symbol",1544821994),(function (){var or__5043__auto__ = fn;
if(cljs.core.truth_(or__5043__auto__)){
return or__5043__auto__;
} else {
return (new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[source__$1,method],null));
}
})()):G__1602__$2);
var G__1602__$4 = (cljs.core.truth_(file__$1)?cljs.core.assoc.call(null,G__1602__$3,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397),file__$1):G__1602__$3);
if(cljs.core.truth_(problems)){
return cljs.core.assoc.call(null,G__1602__$4,new cljs.core.Keyword("clojure.error","spec","clojure.error/spec",2055032595),data);
} else {
return G__1602__$4;
}

break;
default:
throw (new Error(["No matching clause: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__1591__$1)].join('')));

}
})(),new cljs.core.Keyword("clojure.error","phase","clojure.error/phase",275140358),phase);
});
/**
 * Returns a string from exception data, as produced by ex-triage.
 *   The first line summarizes the exception phase and location.
 *   The subsequent lines describe the cause.
 */
cljs.repl.ex_str = (function cljs$repl$ex_str(p__1606){
var map__1607 = p__1606;
var map__1607__$1 = cljs.core.__destructure_map.call(null,map__1607);
var triage_data = map__1607__$1;
var phase = cljs.core.get.call(null,map__1607__$1,new cljs.core.Keyword("clojure.error","phase","clojure.error/phase",275140358));
var source = cljs.core.get.call(null,map__1607__$1,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397));
var line = cljs.core.get.call(null,map__1607__$1,new cljs.core.Keyword("clojure.error","line","clojure.error/line",-1816287471));
var column = cljs.core.get.call(null,map__1607__$1,new cljs.core.Keyword("clojure.error","column","clojure.error/column",304721553));
var symbol = cljs.core.get.call(null,map__1607__$1,new cljs.core.Keyword("clojure.error","symbol","clojure.error/symbol",1544821994));
var class$ = cljs.core.get.call(null,map__1607__$1,new cljs.core.Keyword("clojure.error","class","clojure.error/class",278435890));
var cause = cljs.core.get.call(null,map__1607__$1,new cljs.core.Keyword("clojure.error","cause","clojure.error/cause",-1879175742));
var spec = cljs.core.get.call(null,map__1607__$1,new cljs.core.Keyword("clojure.error","spec","clojure.error/spec",2055032595));
var loc = [cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5043__auto__ = source;
if(cljs.core.truth_(or__5043__auto__)){
return or__5043__auto__;
} else {
return "<cljs repl>";
}
})()),":",cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5043__auto__ = line;
if(cljs.core.truth_(or__5043__auto__)){
return or__5043__auto__;
} else {
return (1);
}
})()),(cljs.core.truth_(column)?[":",cljs.core.str.cljs$core$IFn$_invoke$arity$1(column)].join(''):"")].join('');
var class_name = cljs.core.name.call(null,(function (){var or__5043__auto__ = class$;
if(cljs.core.truth_(or__5043__auto__)){
return or__5043__auto__;
} else {
return "";
}
})());
var simple_class = class_name;
var cause_type = ((cljs.core.contains_QMARK_.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["RuntimeException",null,"Exception",null], null), null),simple_class))?"":[" (",simple_class,")"].join(''));
var format = goog.string.format;
var G__1608 = phase;
var G__1608__$1 = (((G__1608 instanceof cljs.core.Keyword))?G__1608.fqn:null);
switch (G__1608__$1) {
case "read-source":
return format.call(null,"Syntax error reading source at (%s).\n%s\n",loc,cause);

break;
case "macro-syntax-check":
return format.call(null,"Syntax error macroexpanding %sat (%s).\n%s",(cljs.core.truth_(symbol)?[cljs.core.str.cljs$core$IFn$_invoke$arity$1(symbol)," "].join(''):""),loc,(cljs.core.truth_(spec)?(function (){var sb__5687__auto__ = (new goog.string.StringBuffer());
var _STAR_print_newline_STAR__orig_val__1609_1618 = cljs.core._STAR_print_newline_STAR_;
var _STAR_print_fn_STAR__orig_val__1610_1619 = cljs.core._STAR_print_fn_STAR_;
var _STAR_print_newline_STAR__temp_val__1611_1620 = true;
var _STAR_print_fn_STAR__temp_val__1612_1621 = (function (x__5688__auto__){
return sb__5687__auto__.append(x__5688__auto__);
});
(cljs.core._STAR_print_newline_STAR_ = _STAR_print_newline_STAR__temp_val__1611_1620);

(cljs.core._STAR_print_fn_STAR_ = _STAR_print_fn_STAR__temp_val__1612_1621);

try{cljs.spec.alpha.explain_out.call(null,cljs.core.update.call(null,spec,new cljs.core.Keyword("cljs.spec.alpha","problems","cljs.spec.alpha/problems",447400814),(function (probs){
return cljs.core.map.call(null,(function (p1__1604_SHARP_){
return cljs.core.dissoc.call(null,p1__1604_SHARP_,new cljs.core.Keyword(null,"in","in",-1531184865));
}),probs);
}))
);
}finally {(cljs.core._STAR_print_fn_STAR_ = _STAR_print_fn_STAR__orig_val__1610_1619);

(cljs.core._STAR_print_newline_STAR_ = _STAR_print_newline_STAR__orig_val__1609_1618);
}
return cljs.core.str.cljs$core$IFn$_invoke$arity$1(sb__5687__auto__);
})():format.call(null,"%s\n",cause)));

break;
case "macroexpansion":
return format.call(null,"Unexpected error%s macroexpanding %sat (%s).\n%s\n",cause_type,(cljs.core.truth_(symbol)?[cljs.core.str.cljs$core$IFn$_invoke$arity$1(symbol)," "].join(''):""),loc,cause);

break;
case "compile-syntax-check":
return format.call(null,"Syntax error%s compiling %sat (%s).\n%s\n",cause_type,(cljs.core.truth_(symbol)?[cljs.core.str.cljs$core$IFn$_invoke$arity$1(symbol)," "].join(''):""),loc,cause);

break;
case "compilation":
return format.call(null,"Unexpected error%s compiling %sat (%s).\n%s\n",cause_type,(cljs.core.truth_(symbol)?[cljs.core.str.cljs$core$IFn$_invoke$arity$1(symbol)," "].join(''):""),loc,cause);

break;
case "read-eval-result":
return format.call(null,"Error reading eval result%s at %s (%s).\n%s\n",cause_type,symbol,loc,cause);

break;
case "print-eval-result":
return format.call(null,"Error printing return value%s at %s (%s).\n%s\n",cause_type,symbol,loc,cause);

break;
case "execution":
if(cljs.core.truth_(spec)){
return format.call(null,"Execution error - invalid arguments to %s at (%s).\n%s",symbol,loc,(function (){var sb__5687__auto__ = (new goog.string.StringBuffer());
var _STAR_print_newline_STAR__orig_val__1613_1622 = cljs.core._STAR_print_newline_STAR_;
var _STAR_print_fn_STAR__orig_val__1614_1623 = cljs.core._STAR_print_fn_STAR_;
var _STAR_print_newline_STAR__temp_val__1615_1624 = true;
var _STAR_print_fn_STAR__temp_val__1616_1625 = (function (x__5688__auto__){
return sb__5687__auto__.append(x__5688__auto__);
});
(cljs.core._STAR_print_newline_STAR_ = _STAR_print_newline_STAR__temp_val__1615_1624);

(cljs.core._STAR_print_fn_STAR_ = _STAR_print_fn_STAR__temp_val__1616_1625);

try{cljs.spec.alpha.explain_out.call(null,cljs.core.update.call(null,spec,new cljs.core.Keyword("cljs.spec.alpha","problems","cljs.spec.alpha/problems",447400814),(function (probs){
return cljs.core.map.call(null,(function (p1__1605_SHARP_){
return cljs.core.dissoc.call(null,p1__1605_SHARP_,new cljs.core.Keyword(null,"in","in",-1531184865));
}),probs);
}))
);
}finally {(cljs.core._STAR_print_fn_STAR_ = _STAR_print_fn_STAR__orig_val__1614_1623);

(cljs.core._STAR_print_newline_STAR_ = _STAR_print_newline_STAR__orig_val__1613_1622);
}
return cljs.core.str.cljs$core$IFn$_invoke$arity$1(sb__5687__auto__);
})());
} else {
return format.call(null,"Execution error%s at %s(%s).\n%s\n",cause_type,(cljs.core.truth_(symbol)?[cljs.core.str.cljs$core$IFn$_invoke$arity$1(symbol)," "].join(''):""),loc,cause);
}

break;
default:
throw (new Error(["No matching clause: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__1608__$1)].join('')));

}
});
cljs.repl.error__GT_str = (function cljs$repl$error__GT_str(error){
return cljs.repl.ex_str.call(null,cljs.repl.ex_triage.call(null,cljs.repl.Error__GT_map.call(null,error)));
});

//# sourceMappingURL=repl.js.map
