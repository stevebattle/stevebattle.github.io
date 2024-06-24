// Compiled by ClojureScript 1.11.54 {:optimizations :none}
goog.provide('robiota.sketch');
goog.require('cljs.core');
robiota.sketch.SIZE = (24);
robiota.sketch.VEHICLES = (3);
robiota.sketch.LUMINENCE = 200.0;
robiota.sketch.SATURATION = (4);
robiota.sketch.F = (250);
robiota.sketch.DENSITY = (1);
robiota.sketch.SIDE = (1);
robiota.sketch.OFFSET = (2);
robiota.sketch.HEX_RADIUS = (1);
robiota.sketch.CIRCLE_RADIUS = 0.75;
robiota.sketch.TRI_RADIUS = 0.75;
robiota.sketch.DRAG = (10);
robiota.sketch.CENTERING = 0.05;
robiota.sketch.parts = cljs.core.volatile_BANG_.call(null,null);
robiota.sketch.posi = cljs.core.volatile_BANG_.call(null,null);
robiota.sketch.randomInt = (function robiota$sketch$randomInt(n){
return Math.floor((Math.random() * n));
});
robiota.sketch.list_insert = (function robiota$sketch$list_insert(list,e,i){
var vec__528 = cljs.core.split_at.call(null,i,list);
var left = cljs.core.nth.call(null,vec__528,(0),null);
var right = cljs.core.nth.call(null,vec__528,(1),null);
return cljs.core.concat.call(null,left,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [e], null),right);
});
robiota.sketch.polygon = (function robiota$sketch$polygon(cx,cy,sides,radius,rot){
var theta = (((2) * Math.PI) / sides);
var angles = cljs.core.map.call(null,(function (n){
return ((n * theta) + rot);
}),cljs.core.range.call(null,sides));
var p = cljs.core.map.call(null,(function (a){
return (new b2Vec2((cx + (radius * Math.cos((a + (Math.PI * 0.5))))),(cy + (radius * Math.sin((a + (Math.PI * 0.5)))))));
}),angles);
return p;
});
robiota.sketch.weld = (function robiota$sketch$weld(a,b){
var jdef = (new b2WeldJointDef());
jdef.Initialize(a,b,a.GetWorldCenter());

(jdef["stiffness"] = (1));

(jdef["damping"] = (1));

return world.CreateJoint(jdef);
});
robiota.sketch.create_eye = (function robiota$sketch$create_eye(b,a){
var shape = (new b2CircleShape());
var bdef = (new b2BodyDef());
var pos = b.GetPosition();
shape.set_m_radius(robiota.sketch.CIRCLE_RADIUS);

bdef.set_position((new b2Vec2(((pos["x"]) + (Math.cos(a) * robiota.sketch.OFFSET)),((pos["y"]) + (Math.sin(a) * robiota.sketch.OFFSET)))));

bdef.set_type(Module.b2_dynamicBody);

var body = world.CreateBody(bdef);
body.CreateFixture(shape,robiota.sketch.DENSITY);

body.SetTransform(body.GetPosition(),a);

return body;
});
robiota.sketch.eye = (function robiota$sketch$eye(b,label,a){
var e = robiota.sketch.create_eye.call(null,b,a);
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"label","label",1718410804),label,new cljs.core.Keyword(null,"body","body",-2049205669),e,new cljs.core.Keyword(null,"joint","joint",1699500471),robiota.sketch.weld.call(null,b,e)], null);
});
robiota.sketch.create_motor = (function robiota$sketch$create_motor(b,a,v){
var rot = (Math.PI / (6));
var shape = createPolygonShape(cljs.core.clj__GT_js.call(null,robiota.sketch.polygon.call(null,(0),(0),(3),robiota.sketch.TRI_RADIUS,rot)));
var bdef = (new b2BodyDef());
var pos = b.GetPosition();
var a1 = ((Math.PI + a) + v);
bdef.set_position((new b2Vec2(((pos["x"]) + (Math.cos(a) * robiota.sketch.OFFSET)),((pos["y"]) + (Math.sin(a) * robiota.sketch.OFFSET)))));

bdef.set_type(Module.b2_dynamicBody);

var body = world.CreateBody(bdef);
body.CreateFixture(shape,robiota.sketch.DENSITY);

body.SetTransform(body.GetPosition(),a1);

return body;
});
robiota.sketch.motor = (function robiota$sketch$motor(b,label,a,v){
var m = robiota.sketch.create_motor.call(null,b,a,v);
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"label","label",1718410804),label,new cljs.core.Keyword(null,"body","body",-2049205669),m,new cljs.core.Keyword(null,"joint","joint",1699500471),robiota.sketch.weld.call(null,b,m)], null);
});
robiota.sketch.sun = (function robiota$sketch$sun(label){
var shape = (new b2CircleShape());
var bdef = (new b2BodyDef());
bdef.set_type(Module.b2_dynamicBody);

var body = world.CreateBody(bdef);
shape.set_m_radius(robiota.sketch.CIRCLE_RADIUS);

body.CreateFixture(shape,robiota.sketch.DENSITY);

return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"label","label",1718410804),label,new cljs.core.Keyword(null,"body","body",-2049205669),body], null);
});
robiota.sketch.evaluate = (function robiota$sketch$evaluate(s){
var G__531 = (cljs.core.first.call(null,s)["name"]);
switch (G__531) {
case "eye":
return robiota.sketch.eye.call(null,cljs.core.nth.call(null,s,(1)),cljs.core.nth.call(null,s,(2)),cljs.core.nth.call(null,s,(3)));

break;
case "motor":
return robiota.sketch.motor.call(null,cljs.core.nth.call(null,s,(1)),cljs.core.nth.call(null,s,(2)),cljs.core.nth.call(null,s,(3)),cljs.core.nth.call(null,s,(4)));

break;
default:
throw (new Error(["No matching clause: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__531)].join('')));

}
});
robiota.sketch.create_cell = (function robiota$sketch$create_cell(){
var rot = (0);
var shape = createPolygonShape(cljs.core.clj__GT_js.call(null,robiota.sketch.polygon.call(null,(0),(0),(6),robiota.sketch.HEX_RADIUS,rot)));
var bdef = (new b2BodyDef());
bdef.set_position((new b2Vec2((robiota.sketch.randomInt.call(null,robiota.sketch.SIZE) - (robiota.sketch.SIZE / (2))),(robiota.sketch.randomInt.call(null,robiota.sketch.SIZE) - (robiota.sketch.SIZE / (2))))));

bdef.set_type(Module.b2_dynamicBody);

var body = world.CreateBody(bdef);
body.CreateFixture(shape,((10) * robiota.sketch.DENSITY));

body.SetTransform(body.GetPosition(),(0));

return body;
});
robiota.sketch.cell = (function robiota$sketch$cell(var_args){
var args__5772__auto__ = [];
var len__5766__auto___535 = arguments.length;
var i__5767__auto___536 = (0);
while(true){
if((i__5767__auto___536 < len__5766__auto___535)){
args__5772__auto__.push((arguments[i__5767__auto___536]));

var G__537 = (i__5767__auto___536 + (1));
i__5767__auto___536 = G__537;
continue;
} else {
}
break;
}

var argseq__5773__auto__ = ((((1) < args__5772__auto__.length))?(new cljs.core.IndexedSeq(args__5772__auto__.slice((1)),(0),null)):null);
return robiota.sketch.cell.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__5773__auto__);
});

(robiota.sketch.cell.cljs$core$IFn$_invoke$arity$variadic = (function (label,parts){
var b = robiota.sketch.create_cell.call(null);
var blist = cljs.core.map.call(null,(function (p){
return robiota.sketch.evaluate.call(null,robiota.sketch.list_insert.call(null,p,b,(1)));
}),parts);
(b["userData"] = ({"LEFT_EYE": (0), "RIGHT_EYE": (0), "LEFT_MOTOR": (0), "RIGHT_MOTOR": (0)}));

return cljs.core.cons.call(null,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"label","label",1718410804),label,new cljs.core.Keyword(null,"body","body",-2049205669),b], null),blist);
}));

(robiota.sketch.cell.cljs$lang$maxFixedArity = (1));

/** @this {Function} */
(robiota.sketch.cell.cljs$lang$applyTo = (function (seq533){
var G__534 = cljs.core.first.call(null,seq533);
var seq533__$1 = cljs.core.next.call(null,seq533);
var self__5751__auto__ = this;
return self__5751__auto__.cljs$core$IFn$_invoke$arity$variadic(G__534,seq533__$1);
}));

robiota.sketch.setup = (function robiota$sketch$setup(){
cljs.core._vreset_BANG_.call(null,robiota.sketch.parts,cljs.core.conj.call(null,cljs.core._deref.call(null,robiota.sketch.parts),robiota.sketch.sun.call(null,"SUN")));

cljs.core.vreset_BANG_.call(null,robiota.sketch.posi,(new b2Vec2((0),(0))));

var i = (0);
while(true){
if((i < robiota.sketch.VEHICLES)){
cljs.core._vreset_BANG_.call(null,robiota.sketch.parts,cljs.core.concat.call(null,cljs.core._deref.call(null,robiota.sketch.parts),(function (){var pi = Math.PI;
return robiota.sketch.cell.call(null,"CELL",cljs.core.sequence.call(null,cljs.core.seq.call(null,cljs.core.concat.call(null,(new cljs.core.List(null,new cljs.core.Symbol("robiota.sketch","eye","robiota.sketch/eye",954993266,null),null,(1),null)),(new cljs.core.List(null,"RIGHT_EYE",null,(1),null)),(new cljs.core.List(null,(0),null,(1),null))))),cljs.core.sequence.call(null,cljs.core.seq.call(null,cljs.core.concat.call(null,(new cljs.core.List(null,new cljs.core.Symbol("robiota.sketch","eye","robiota.sketch/eye",954993266,null),null,(1),null)),(new cljs.core.List(null,"LEFT_EYE",null,(1),null)),(new cljs.core.List(null,(pi / (3)),null,(1),null))))),cljs.core.sequence.call(null,cljs.core.seq.call(null,cljs.core.concat.call(null,(new cljs.core.List(null,new cljs.core.Symbol("robiota.sketch","motor","robiota.sketch/motor",1576436476,null),null,(1),null)),(new cljs.core.List(null,"LEFT_MOTOR",null,(1),null)),(new cljs.core.List(null,pi,null,(1),null)),(new cljs.core.List(null,(pi / (6)),null,(1),null))))),cljs.core.sequence.call(null,cljs.core.seq.call(null,cljs.core.concat.call(null,(new cljs.core.List(null,new cljs.core.Symbol("robiota.sketch","motor","robiota.sketch/motor",1576436476,null),null,(1),null)),(new cljs.core.List(null,"RIGHT_MOTOR",null,(1),null)),(new cljs.core.List(null,((-2) * (pi / (3))),null,(1),null)),(new cljs.core.List(null,(pi / (-6)),null,(1),null))))));
})()));

var G__538 = (i + (1));
i = G__538;
continue;
} else {
return null;
}
break;
}
});
robiota.sketch.angle_to = (function robiota$sketch$angle_to(a,b){
var dx = ((b["x"]) - (a["x"]));
var dy = ((b["y"]) - (a["y"]));
return Math.atan2(dy,dx);
});
robiota.sketch.distance = (function robiota$sketch$distance(a,b){
var dx = ((b["x"]) - (a["x"]));
var dy = ((b["y"]) - (a["y"]));
return (new b2Vec2(dx,dy)).Length();
});
robiota.sketch.deviation = (function robiota$sketch$deviation(v,posi){
var a = robiota.sketch.angle_to.call(null,v.GetPosition(),posi);
var tau = ((2) * Math.PI);
var theta = v.GetAngle();
return cljs.core.mod.call(null,(a - theta),tau);
});
robiota.sketch.solveCell = (function robiota$sketch$solveCell(p){
var v = new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(p);
var u = (v["userData"]);
var l = (u["LEFT_EYE"]);
var r = (u["RIGHT_EYE"]);
var dragVector = v.GetLinearVelocity();
var dragAngle = (Math.PI + Math.atan2((dragVector["y"]),(dragVector["x"])));
var d = Math.sqrt((Math.pow((dragVector["x"]),(2)) + Math.pow((dragVector["y"]),(2))));
var force = (new b2Vec2(((d * robiota.sketch.DRAG) * Math.cos(dragAngle)),((d * robiota.sketch.DRAG) * Math.sin(dragAngle))));
v.ApplyLinearImpulse(force,v.GetWorldCenter());

(u["LEFT_MOTOR"] = r);

return (u["RIGHT_MOTOR"] = l);
});
robiota.sketch.solveEye = (function robiota$sketch$solveEye(p){
var e = new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(p);
var d = robiota.sketch.distance.call(null,cljs.core.deref.call(null,robiota.sketch.posi),e.GetPosition());
var b = (robiota.sketch.LUMINENCE / d);
var a = robiota.sketch.deviation.call(null,e,cljs.core.deref.call(null,robiota.sketch.posi));
var c = (Math.cos(a) + (1));
var body = new cljs.core.Keyword(null,"joint","joint",1699500471).cljs$core$IFn$_invoke$arity$1(p).GetBodyA();
var u = (body["userData"]);
return (u[new cljs.core.Keyword(null,"label","label",1718410804).cljs$core$IFn$_invoke$arity$1(p)] = (b * c));
});
robiota.sketch.solveMotor = (function robiota$sketch$solveMotor(p){
var m = new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(p);
var dt = ((1) / frameRate);
var body = new cljs.core.Keyword(null,"joint","joint",1699500471).cljs$core$IFn$_invoke$arity$1(p).GetBodyA();
var u = (body["userData"]);
var n = (u[new cljs.core.Keyword(null,"label","label",1718410804).cljs$core$IFn$_invoke$arity$1(p)]);
var s = ((dt * (function (){var x__5131__auto__ = n;
var y__5132__auto__ = robiota.sketch.SATURATION;
return ((x__5131__auto__ < y__5132__auto__) ? x__5131__auto__ : y__5132__auto__);
})()) * robiota.sketch.F);
var force = (new b2Vec2((s * Math.cos(m.GetAngle())),(s * Math.sin(m.GetAngle()))));
return m.ApplyLinearImpulse(force,m.GetWorldCenter());
});
robiota.sketch.solveSun = (function robiota$sketch$solveSun(p){
var s = new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(p);
var pos = s.GetPosition();
var force = (new b2Vec2(((- robiota.sketch.CENTERING) * (pos["x"])),((- robiota.sketch.CENTERING) * (pos["y"]))));
s.ApplyLinearImpulse(force,s.GetWorldCenter());

return pos;
});
robiota.sketch.step = (function robiota$sketch$step(){
var p = cljs.core.deref.call(null,robiota.sketch.parts);
var i = (0);
while(true){
if((i < cljs.core.count.call(null,p))){
var G__539_540 = new cljs.core.Keyword(null,"label","label",1718410804).cljs$core$IFn$_invoke$arity$1(cljs.core.nth.call(null,p,i));
switch (G__539_540) {
case "SUN":
cljs.core.vreset_BANG_.call(null,robiota.sketch.posi,robiota.sketch.solveSun.call(null,cljs.core.nth.call(null,p,i)));

break;
case "CELL":
robiota.sketch.solveCell.call(null,cljs.core.nth.call(null,p,i));

break;
case "LEFT_EYE":
robiota.sketch.solveEye.call(null,cljs.core.nth.call(null,p,i));

break;
case "RIGHT_EYE":
robiota.sketch.solveEye.call(null,cljs.core.nth.call(null,p,i));

break;
case "LEFT_MOTOR":
robiota.sketch.solveMotor.call(null,cljs.core.nth.call(null,p,i));

break;
case "RIGHT_MOTOR":
robiota.sketch.solveMotor.call(null,cljs.core.nth.call(null,p,i));

break;
default:
throw (new Error(["No matching clause: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__539_540)].join('')));

}

var G__542 = (i + (1));
i = G__542;
continue;
} else {
return null;
}
break;
}
});

//# sourceMappingURL=sketch.js.map
