// Compiled by ClojureScript 1.11.54 {:optimizations :none}
goog.provide('robiota.sketch');
goog.require('cljs.core');
robiota.sketch.SIZE = (24);
robiota.sketch.VEHICLES = (10);
robiota.sketch.LUMINENCE = 200.0;
robiota.sketch.SATURATION = (10);
robiota.sketch.F = (250);
robiota.sketch.DENSITY = (1);
robiota.sketch.SIDE = 0.2;
robiota.sketch.OFFSET = (2);
robiota.sketch.TOUCH_OFFSET = 1.8;
robiota.sketch.HEX_RADIUS = (1);
robiota.sketch.CIRCLE_RADIUS = 0.6;
robiota.sketch.BALL_RADIUS = (1);
robiota.sketch.TRI_RADIUS = 0.75;
robiota.sketch.DRAG = (8);
robiota.sketch.DRAG_ANGULAR = (80);
robiota.sketch.CENTERING = 0.1;
robiota.sketch.REVERSE = (-30);
robiota.sketch.SCALE = 0.1;
robiota.sketch.SLOPE = (50);
robiota.sketch.parts = cljs.core.volatile_BANG_.call(null,null);
robiota.sketch.posi = cljs.core.volatile_BANG_.call(null,null);
robiota.sketch.contacts = cljs.core.volatile_BANG_.call(null,null);
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
var x = (pos["x"]);
var y = (pos["y"]);
shape.set_m_radius(robiota.sketch.CIRCLE_RADIUS);

bdef.set_position((new b2Vec2((x + (Math.cos(a) * robiota.sketch.OFFSET)),(y + (Math.sin(a) * robiota.sketch.OFFSET)))));

bdef.set_type(Module.b2_dynamicBody);

var body = world.CreateBody(bdef);
body.CreateFixture(shape,robiota.sketch.DENSITY);

body.SetTransform(body.GetPosition(),a);

return body;
});
robiota.sketch.eye = (function robiota$sketch$eye(b,label,a){
var e = robiota.sketch.create_eye.call(null,b,a);
(e["userData"] = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"type","type",1174270348),"eye",new cljs.core.Keyword(null,"label","label",1718410804),label,new cljs.core.Keyword(null,"joint","joint",1699500471),robiota.sketch.weld.call(null,b,e)], null));

return e;
});
robiota.sketch.create_motor = (function robiota$sketch$create_motor(b,a,v){
var rot = (Math.PI / (6));
var shape = createPolygonShape(cljs.core.clj__GT_js.call(null,robiota.sketch.polygon.call(null,(0),(0),(3),robiota.sketch.TRI_RADIUS,rot)));
var bdef = (new b2BodyDef());
var pos = b.GetPosition();
var x = (pos["x"]);
var y = (pos["y"]);
var theta = ((Math.PI + a) + v);
bdef.set_position((new b2Vec2((x + (Math.cos(a) * robiota.sketch.OFFSET)),(y + (Math.sin(a) * robiota.sketch.OFFSET)))));

bdef.set_type(Module.b2_dynamicBody);

var body = world.CreateBody(bdef);
body.CreateFixture(shape,robiota.sketch.DENSITY);

body.SetTransform(body.GetPosition(),theta);

return body;
});
robiota.sketch.motor = (function robiota$sketch$motor(b,label,a,v){
var m = robiota.sketch.create_motor.call(null,b,a,v);
(m["userData"] = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"type","type",1174270348),"motor",new cljs.core.Keyword(null,"label","label",1718410804),label,new cljs.core.Keyword(null,"joint","joint",1699500471),robiota.sketch.weld.call(null,b,m)], null));

return m;
});
robiota.sketch.create_touch = (function robiota$sketch$create_touch(b,a){
var shape = (new b2PolygonShape());
var bdef = (new b2BodyDef());
var pos = b.GetPosition();
var x = (pos["x"]);
var y = (pos["y"]);
shape.SetAsBox(robiota.sketch.SIDE,robiota.sketch.SIDE);

bdef.set_position((new b2Vec2((x + (Math.cos(a) * robiota.sketch.TOUCH_OFFSET)),(y + (Math.sin(a) * robiota.sketch.TOUCH_OFFSET)))));

bdef.set_type(Module.b2_dynamicBody);

var body = world.CreateBody(bdef);
body.CreateFixture(shape,robiota.sketch.DENSITY);

body.SetTransform(body.GetPosition(),a);

return body;
});
robiota.sketch.touch = (function robiota$sketch$touch(b,label,targets,a){
var t = robiota.sketch.create_touch.call(null,b,a);
(t["userData"] = new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"type","type",1174270348),"touch",new cljs.core.Keyword(null,"label","label",1718410804),label,new cljs.core.Keyword(null,"joint","joint",1699500471),robiota.sketch.weld.call(null,b,t),new cljs.core.Keyword(null,"targets","targets",2014963406),targets], null));

return t;
});
robiota.sketch.net = (function robiota$sketch$net(b,label,input,output,weight){
var n = world.CreateBody((new b2BodyDef()));
(n["userData"] = new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"label","label",1718410804),label,new cljs.core.Keyword(null,"type","type",1174270348),"net",new cljs.core.Keyword(null,"input","input",556931961),input,new cljs.core.Keyword(null,"output","output",-1105869043),output,new cljs.core.Keyword(null,"weight","weight",-1262796205),weight,new cljs.core.Keyword(null,"joint","joint",1699500471),b], null));

return n;
});
robiota.sketch.radial = (function robiota$sketch$radial(b,label,input,bias){
var n = world.CreateBody((new b2BodyDef()));
(n["userData"] = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"label","label",1718410804),label,new cljs.core.Keyword(null,"type","type",1174270348),"radial",new cljs.core.Keyword(null,"input","input",556931961),input,new cljs.core.Keyword(null,"bias","bias",-315297926),bias,new cljs.core.Keyword(null,"joint","joint",1699500471),b], null));

return n;
});
robiota.sketch.threshold = (function robiota$sketch$threshold(b,label,inputs,output,bias,weight){
var th = world.CreateBody((new b2BodyDef()));
(th["userData"] = new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"label","label",1718410804),label,new cljs.core.Keyword(null,"type","type",1174270348),"threshold",new cljs.core.Keyword(null,"inputs","inputs",865803858),inputs,new cljs.core.Keyword(null,"bias","bias",-315297926),bias,new cljs.core.Keyword(null,"weight","weight",-1262796205),weight,new cljs.core.Keyword(null,"joint","joint",1699500471),b], null));

return th;
});
robiota.sketch.ball = (function robiota$sketch$ball(){
var shape = (new b2CircleShape());
var bdef = (new b2BodyDef());
bdef.set_type(Module.b2_dynamicBody);

var body = world.CreateBody(bdef);
shape.set_m_radius(robiota.sketch.BALL_RADIUS);

body.CreateFixture(shape,robiota.sketch.DENSITY);

(body["userData"] = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"type","type",1174270348),"ball"], null));

return body;
});
robiota.sketch.evaluate = (function robiota$sketch$evaluate(s){
var G__531 = (cljs.core.first.call(null,s)["name"]);
switch (G__531) {
case "net":
return robiota.sketch.net.call(null,cljs.core.nth.call(null,s,(1)),cljs.core.nth.call(null,s,(2)),cljs.core.nth.call(null,s,(3)),cljs.core.nth.call(null,s,(4)),cljs.core.nth.call(null,s,(5)));

break;
case "radial":
return robiota.sketch.radial.call(null,cljs.core.nth.call(null,s,(1)),cljs.core.nth.call(null,s,(2)),cljs.core.nth.call(null,s,(3)),cljs.core.nth.call(null,s,(4)));

break;
case "eye":
return robiota.sketch.eye.call(null,cljs.core.nth.call(null,s,(1)),cljs.core.nth.call(null,s,(2)),cljs.core.nth.call(null,s,(3)));

break;
case "touch":
return robiota.sketch.touch.call(null,cljs.core.nth.call(null,s,(1)),cljs.core.nth.call(null,s,(2)),cljs.core.nth.call(null,s,(3)),cljs.core.nth.call(null,s,(4)));

break;
case "motor":
return robiota.sketch.motor.call(null,cljs.core.nth.call(null,s,(1)),cljs.core.nth.call(null,s,(2)),cljs.core.nth.call(null,s,(3)),cljs.core.nth.call(null,s,(4)));

break;
case "threshold":
return robiota.sketch.threshold.call(null,cljs.core.nth.call(null,s,(1)),cljs.core.nth.call(null,s,(2)),cljs.core.nth.call(null,s,(3)),cljs.core.nth.call(null,s,(4)),cljs.core.nth.call(null,s,(5)),cljs.core.nth.call(null,s,(6)));

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
(b["userData"] = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),"cell",new cljs.core.Keyword(null,"label","label",1718410804),label], null));

return cljs.core.cons.call(null,b,blist);
}));

(robiota.sketch.cell.cljs$lang$maxFixedArity = (1));

/** @this {Function} */
(robiota.sketch.cell.cljs$lang$applyTo = (function (seq533){
var G__534 = cljs.core.first.call(null,seq533);
var seq533__$1 = cljs.core.next.call(null,seq533);
var self__5751__auto__ = this;
return self__5751__auto__.cljs$core$IFn$_invoke$arity$variadic(G__534,seq533__$1);
}));

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
robiota.sketch.normal = (function robiota$sketch$normal(x,e){
return Math.exp((((- e) * x) * x));
});
robiota.sketch.sigmoid = (function robiota$sketch$sigmoid(x,b){
return ((1) / ((1) + Math.exp(((- b) * x))));
});
robiota.sketch.wrapAngle = (function robiota$sketch$wrapAngle(a){
var tau = ((2) * Math.PI);
return (a - (tau * Math.floor(((a + Math.PI) / tau))));
});
robiota.sketch.getValue = (function robiota$sketch$getValue(b,key){
var u = (b["userData"]);
var v = cljs.core.get.call(null,u,key,(0));
if(cljs.core.coll_QMARK_.call(null,v)){
var sum = cljs.core.reduce.call(null,cljs.core._PLUS_,cljs.core.map.call(null,cljs.core.val,cljs.core.seq.call(null,v)));
return sum;
} else {
return v;
}
});
robiota.sketch.getParameter = (function robiota$sketch$getParameter(b,key){
var u = (b["userData"]);
return cljs.core.get.call(null,u,key,null);
});
robiota.sketch.setValue = (function robiota$sketch$setValue(b,key,n){
var u = (b["userData"]);
return (b["userData"] = cljs.core.assoc.call(null,u,key,n));
});
robiota.sketch.setMultiValue = (function robiota$sketch$setMultiValue(b,key,subkey,n){
var u = (b["userData"]);
var v = cljs.core.assoc_in.call(null,u,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [key,subkey], null),n);
return (b["userData"] = v);
});
robiota.sketch.removeMultiValue = (function robiota$sketch$removeMultiValue(b,key,subkey){
var u = (b["userData"]);
var v = cljs.core.update_in.call(null,u,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [key], null),cljs.core.dissoc,subkey);
return (b["userData"] = v);
});
robiota.sketch.solveCell = (function robiota$sketch$solveCell(v){
var label = robiota.sketch.getParameter.call(null,v,new cljs.core.Keyword(null,"label","label",1718410804));
var dragVector = v.GetLinearVelocity();
var x = (dragVector["x"]);
var y = (dragVector["y"]);
var theta = (Math.PI + Math.atan2(y,x));
var drag = dragVector.Length();
var force = (new b2Vec2(((drag * robiota.sketch.DRAG) * Math.cos(theta)),((drag * robiota.sketch.DRAG) * Math.sin(theta))));
var torque = ((- v.GetAngularVelocity()) * robiota.sketch.DRAG_ANGULAR);
var angle = v.GetAngle();
v.ApplyLinearImpulse(force,v.GetWorldCenter());

v.ApplyTorque(torque,true);

return robiota.sketch.setValue.call(null,v,label,angle);
});
robiota.sketch.solveEye = (function robiota$sketch$solveEye(e){
var d = robiota.sketch.distance.call(null,cljs.core.deref.call(null,robiota.sketch.posi),e.GetPosition());
var b = (robiota.sketch.LUMINENCE / d);
var a = robiota.sketch.deviation.call(null,e,cljs.core.deref.call(null,robiota.sketch.posi));
var c = (Math.cos(a) + (1));
var label = robiota.sketch.getValue.call(null,e,new cljs.core.Keyword(null,"label","label",1718410804));
var body = robiota.sketch.getParameter.call(null,e,new cljs.core.Keyword(null,"joint","joint",1699500471)).GetBodyA();
return robiota.sketch.setValue.call(null,body,label,(function (){var x__5131__auto__ = (b * c);
var y__5132__auto__ = robiota.sketch.SATURATION;
return ((x__5131__auto__ < y__5132__auto__) ? x__5131__auto__ : y__5132__auto__);
})());
});
robiota.sketch.solveTouch = (function robiota$sketch$solveTouch(t){
return null;
});
robiota.sketch.solveMotor = (function robiota$sketch$solveMotor(m){
var dt = ((1) / frameRate);
var body = robiota.sketch.getParameter.call(null,m,new cljs.core.Keyword(null,"joint","joint",1699500471)).GetBodyA();
var label = robiota.sketch.getValue.call(null,m,new cljs.core.Keyword(null,"label","label",1718410804));
var n = robiota.sketch.getValue.call(null,body,label);
var s = ((dt * n) * robiota.sketch.F);
var force = (new b2Vec2((s * Math.cos(m.GetAngle())),(s * Math.sin(m.GetAngle()))));
return m.ApplyLinearImpulse(force,m.GetWorldCenter());
});
robiota.sketch.solveNet = (function robiota$sketch$solveNet(n){
var body = robiota.sketch.getParameter.call(null,n,new cljs.core.Keyword(null,"joint","joint",1699500471));
var label = robiota.sketch.getParameter.call(null,n,new cljs.core.Keyword(null,"label","label",1718410804));
var input = robiota.sketch.getParameter.call(null,n,new cljs.core.Keyword(null,"input","input",556931961));
var output = robiota.sketch.getParameter.call(null,n,new cljs.core.Keyword(null,"output","output",-1105869043));
var weight = robiota.sketch.getParameter.call(null,n,new cljs.core.Keyword(null,"weight","weight",-1262796205));
var v = robiota.sketch.getValue.call(null,body,input);
return robiota.sketch.setMultiValue.call(null,body,output,label,(v * weight));
});
robiota.sketch.solveRadial = (function robiota$sketch$solveRadial(n){
var body = robiota.sketch.getParameter.call(null,n,new cljs.core.Keyword(null,"joint","joint",1699500471));
var label = robiota.sketch.getParameter.call(null,n,new cljs.core.Keyword(null,"label","label",1718410804));
var input = robiota.sketch.getParameter.call(null,n,new cljs.core.Keyword(null,"input","input",556931961));
var bias = robiota.sketch.getParameter.call(null,n,new cljs.core.Keyword(null,"bias","bias",-315297926));
var v = robiota.sketch.getValue.call(null,body,input);
var a = (v + bias);
var w = robiota.sketch.wrapAngle.call(null,a);
var r = robiota.sketch.normal.call(null,w,robiota.sketch.SCALE);
return robiota.sketch.setValue.call(null,body,label,r);
});
robiota.sketch.solveThreshold = (function robiota$sketch$solveThreshold(n){
var body = robiota.sketch.getParameter.call(null,n,new cljs.core.Keyword(null,"joint","joint",1699500471));
var label = robiota.sketch.getParameter.call(null,n,new cljs.core.Keyword(null,"label","label",1718410804));
var inputs = robiota.sketch.getParameter.call(null,n,new cljs.core.Keyword(null,"inputs","inputs",865803858));
var bias = robiota.sketch.getParameter.call(null,n,new cljs.core.Keyword(null,"bias","bias",-315297926));
var weight = robiota.sketch.getParameter.call(null,n,new cljs.core.Keyword(null,"weight","weight",-1262796205));
var v = cljs.core.reduce.call(null,cljs.core._PLUS_,cljs.core.map.call(null,cljs.core.partial.call(null,robiota.sketch.getValue,body),inputs));
var a = (v - bias);
return robiota.sketch.setValue.call(null,body,label,(((a >= (0)))?(weight * a):(0)));
});
robiota.sketch.solveBall = (function robiota$sketch$solveBall(b){
var pos = b.GetPosition();
var x = (pos["x"]);
var y = (pos["y"]);
var dragVector = b.GetLinearVelocity();
var dx = (dragVector["x"]);
var dy = (dragVector["y"]);
var theta = (Math.PI + Math.atan2(dy,dx));
var drag = (dragVector.Length() * 0.01);
var force = (new b2Vec2((((- robiota.sketch.CENTERING) * x) + (drag * Math.cos(theta))),(((- robiota.sketch.CENTERING) * y) + (drag * Math.sin(theta)))));
b.ApplyLinearImpulse(force,b.GetWorldCenter());

return pos;
});
robiota.sketch.beginContact = (function robiota$sketch$beginContact(contact){
var id = (contact["a"]);
var a = contact.GetFixtureA().GetBody();
var b = contact.GetFixtureB().GetBody();
var atype = robiota.sketch.getParameter.call(null,a,new cljs.core.Keyword(null,"type","type",1174270348));
var btype = robiota.sketch.getParameter.call(null,b,new cljs.core.Keyword(null,"type","type",1174270348));
var atargets = robiota.sketch.getParameter.call(null,a,new cljs.core.Keyword(null,"targets","targets",2014963406));
var btargets = robiota.sketch.getParameter.call(null,b,new cljs.core.Keyword(null,"targets","targets",2014963406));
if(((cljs.core._EQ_.call(null,atype,"touch")) && (cljs.core.contains_QMARK_.call(null,cljs.core.set.call(null,cljs.core.keys.call(null,atargets)),btype)))){
var label_538 = robiota.sketch.getValue.call(null,a,new cljs.core.Keyword(null,"label","label",1718410804));
var body_539 = robiota.sketch.getParameter.call(null,a,new cljs.core.Keyword(null,"joint","joint",1699500471)).GetBodyA();
var value_540 = cljs.core.get.call(null,atargets,btype,(0));
robiota.sketch.setMultiValue.call(null,body_539,label_538,id,value_540);
} else {
}

if(((cljs.core._EQ_.call(null,btype,"touch")) && (cljs.core.contains_QMARK_.call(null,cljs.core.set.call(null,cljs.core.keys.call(null,btargets)),atype)))){
var label = robiota.sketch.getValue.call(null,b,new cljs.core.Keyword(null,"label","label",1718410804));
var body = robiota.sketch.getParameter.call(null,b,new cljs.core.Keyword(null,"joint","joint",1699500471)).GetBodyA();
var value = cljs.core.get.call(null,btargets,atype,(0));
return robiota.sketch.setMultiValue.call(null,body,label,id,value);
} else {
return null;
}
});
robiota.sketch.endContact = (function robiota$sketch$endContact(contact){
var id = (contact["a"]);
var a = contact.GetFixtureA().GetBody();
var b = contact.GetFixtureB().GetBody();
var atype = robiota.sketch.getParameter.call(null,a,new cljs.core.Keyword(null,"type","type",1174270348));
var btype = robiota.sketch.getParameter.call(null,b,new cljs.core.Keyword(null,"type","type",1174270348));
var atargets = robiota.sketch.getParameter.call(null,a,new cljs.core.Keyword(null,"targets","targets",2014963406));
var btargets = robiota.sketch.getParameter.call(null,b,new cljs.core.Keyword(null,"targets","targets",2014963406));
if(((cljs.core._EQ_.call(null,atype,"touch")) && (cljs.core.contains_QMARK_.call(null,cljs.core.set.call(null,cljs.core.keys.call(null,atargets)),btype)))){
var label_541 = robiota.sketch.getValue.call(null,a,new cljs.core.Keyword(null,"label","label",1718410804));
var body_542 = robiota.sketch.getParameter.call(null,a,new cljs.core.Keyword(null,"joint","joint",1699500471)).GetBodyA();
robiota.sketch.removeMultiValue.call(null,body_542,label_541,id);
} else {
}

if(((cljs.core._EQ_.call(null,btype,"touch")) && (cljs.core.contains_QMARK_.call(null,cljs.core.set.call(null,cljs.core.keys.call(null,btargets)),atype)))){
var label = robiota.sketch.getValue.call(null,b,new cljs.core.Keyword(null,"label","label",1718410804));
var body = robiota.sketch.getParameter.call(null,b,new cljs.core.Keyword(null,"joint","joint",1699500471)).GetBodyA();
return robiota.sketch.removeMultiValue.call(null,body,label,id);
} else {
return null;
}
});
robiota.sketch.setup = (function robiota$sketch$setup(){
cljs.core._vreset_BANG_.call(null,robiota.sketch.parts,cljs.core.conj.call(null,cljs.core._deref.call(null,robiota.sketch.parts),robiota.sketch.ball.call(null)));

cljs.core.vreset_BANG_.call(null,robiota.sketch.posi,(new b2Vec2((0),(0))));

var i = (0);
while(true){
if((i < robiota.sketch.VEHICLES)){
cljs.core._vreset_BANG_.call(null,robiota.sketch.parts,cljs.core.concat.call(null,cljs.core._deref.call(null,robiota.sketch.parts),(function (){var pi = Math.PI;
var sector = (pi / (6));
var team = ((cljs.core.even_QMARK_.call(null,i))?(1):(-1));
return robiota.sketch.cell.call(null,"CELL",cljs.core.sequence.call(null,cljs.core.seq.call(null,cljs.core.concat.call(null,(new cljs.core.List(null,new cljs.core.Symbol("robiota.sketch","net","robiota.sketch/net",1217150832,null),null,(1),null)),(new cljs.core.List(null,"L1",null,(1),null)),(new cljs.core.List(null,"RIGHT_EYE",null,(1),null)),(new cljs.core.List(null,"LEFT_MOTOR",null,(1),null)),(new cljs.core.List(null,(1),null,(1),null))))),cljs.core.sequence.call(null,cljs.core.seq.call(null,cljs.core.concat.call(null,(new cljs.core.List(null,new cljs.core.Symbol("robiota.sketch","net","robiota.sketch/net",1217150832,null),null,(1),null)),(new cljs.core.List(null,"R1",null,(1),null)),(new cljs.core.List(null,"LEFT_EYE",null,(1),null)),(new cljs.core.List(null,"RIGHT_MOTOR",null,(1),null)),(new cljs.core.List(null,(1),null,(1),null))))),cljs.core.sequence.call(null,cljs.core.seq.call(null,cljs.core.concat.call(null,(new cljs.core.List(null,new cljs.core.Symbol("robiota.sketch","net","robiota.sketch/net",1217150832,null),null,(1),null)),(new cljs.core.List(null,"L2",null,(1),null)),(new cljs.core.List(null,"TOUCH",null,(1),null)),(new cljs.core.List(null,"LEFT_MOTOR",null,(1),null)),(new cljs.core.List(null,(10),null,(1),null))))),cljs.core.sequence.call(null,cljs.core.seq.call(null,cljs.core.concat.call(null,(new cljs.core.List(null,new cljs.core.Symbol("robiota.sketch","net","robiota.sketch/net",1217150832,null),null,(1),null)),(new cljs.core.List(null,"R2",null,(1),null)),(new cljs.core.List(null,"TOUCH",null,(1),null)),(new cljs.core.List(null,"RIGHT_MOTOR",null,(1),null)),(new cljs.core.List(null,(10),null,(1),null))))),cljs.core.sequence.call(null,cljs.core.seq.call(null,cljs.core.concat.call(null,(new cljs.core.List(null,new cljs.core.Symbol("robiota.sketch","radial","robiota.sketch/radial",-729569933,null),null,(1),null)),(new cljs.core.List(null,"RAD1",null,(1),null)),(new cljs.core.List(null,"CELL",null,(1),null)),(new cljs.core.List(null,(team * sector),null,(1),null))))),cljs.core.sequence.call(null,cljs.core.seq.call(null,cljs.core.concat.call(null,(new cljs.core.List(null,new cljs.core.Symbol("robiota.sketch","radial","robiota.sketch/radial",-729569933,null),null,(1),null)),(new cljs.core.List(null,"RAD2",null,(1),null)),(new cljs.core.List(null,"CELL",null,(1),null)),(new cljs.core.List(null,(team * (- sector)),null,(1),null))))),cljs.core.sequence.call(null,cljs.core.seq.call(null,cljs.core.concat.call(null,(new cljs.core.List(null,new cljs.core.Symbol("robiota.sketch","threshold","robiota.sketch/threshold",-1808352816,null),null,(1),null)),(new cljs.core.List(null,"TH1",null,(1),null)),(new cljs.core.List(null,cljs.core.vec.call(null,cljs.core.sequence.call(null,cljs.core.seq.call(null,cljs.core.concat.call(null,(new cljs.core.List(null,"RAD1",null,(1),null)),(new cljs.core.List(null,"TOUCH",null,(1),null)))))),null,(1),null)),(new cljs.core.List(null,"RIGHT_MOTOR",null,(1),null)),(new cljs.core.List(null,(1),null,(1),null)),(new cljs.core.List(null,(5),null,(1),null))))),cljs.core.sequence.call(null,cljs.core.seq.call(null,cljs.core.concat.call(null,(new cljs.core.List(null,new cljs.core.Symbol("robiota.sketch","threshold","robiota.sketch/threshold",-1808352816,null),null,(1),null)),(new cljs.core.List(null,"TH2",null,(1),null)),(new cljs.core.List(null,cljs.core.vec.call(null,cljs.core.sequence.call(null,cljs.core.seq.call(null,cljs.core.concat.call(null,(new cljs.core.List(null,"RAD2",null,(1),null)),(new cljs.core.List(null,"TOUCH",null,(1),null)))))),null,(1),null)),(new cljs.core.List(null,"LEFT_MOTOR",null,(1),null)),(new cljs.core.List(null,(1),null,(1),null)),(new cljs.core.List(null,(5),null,(1),null))))),cljs.core.sequence.call(null,cljs.core.seq.call(null,cljs.core.concat.call(null,(new cljs.core.List(null,new cljs.core.Symbol("robiota.sketch","eye","robiota.sketch/eye",954993266,null),null,(1),null)),(new cljs.core.List(null,"RIGHT_EYE",null,(1),null)),(new cljs.core.List(null,(- sector),null,(1),null))))),cljs.core.sequence.call(null,cljs.core.seq.call(null,cljs.core.concat.call(null,(new cljs.core.List(null,new cljs.core.Symbol("robiota.sketch","eye","robiota.sketch/eye",954993266,null),null,(1),null)),(new cljs.core.List(null,"LEFT_EYE",null,(1),null)),(new cljs.core.List(null,sector,null,(1),null))))),cljs.core.sequence.call(null,cljs.core.seq.call(null,cljs.core.concat.call(null,(new cljs.core.List(null,new cljs.core.Symbol("robiota.sketch","touch","robiota.sketch/touch",-198062182,null),null,(1),null)),(new cljs.core.List(null,"TOUCH",null,(1),null)),(new cljs.core.List(null,new cljs.core.PersistentArrayMap(null, 4, ["cell",(-3),"motor",(-3),"eye",(-3),"ball",(1)], null),null,(1),null)),(new cljs.core.List(null,(0),null,(1),null))))),cljs.core.sequence.call(null,cljs.core.seq.call(null,cljs.core.concat.call(null,(new cljs.core.List(null,new cljs.core.Symbol("robiota.sketch","motor","robiota.sketch/motor",1576436476,null),null,(1),null)),(new cljs.core.List(null,"LEFT_MOTOR",null,(1),null)),(new cljs.core.List(null,((5) * sector),null,(1),null)),(new cljs.core.List(null,sector,null,(1),null))))),cljs.core.sequence.call(null,cljs.core.seq.call(null,cljs.core.concat.call(null,(new cljs.core.List(null,new cljs.core.Symbol("robiota.sketch","motor","robiota.sketch/motor",1576436476,null),null,(1),null)),(new cljs.core.List(null,"RIGHT_MOTOR",null,(1),null)),(new cljs.core.List(null,((-5) * sector),null,(1),null)),(new cljs.core.List(null,(- sector),null,(1),null))))));
})()));

var G__543 = (i + (1));
i = G__543;
continue;
} else {
return null;
}
break;
}
});
robiota.sketch.step = (function robiota$sketch$step(){
var p = cljs.core.deref.call(null,robiota.sketch.parts);
var i = (0);
while(true){
if((i < cljs.core.count.call(null,p))){
var type_545 = (cljs.core.nth.call(null,p,i)["userData"]).call(null,new cljs.core.Keyword(null,"type","type",1174270348));
var G__544_546 = type_545;
switch (G__544_546) {
case "ball":
cljs.core.vreset_BANG_.call(null,robiota.sketch.posi,robiota.sketch.solveBall.call(null,cljs.core.nth.call(null,p,i)));

break;
case "cell":
robiota.sketch.solveCell.call(null,cljs.core.nth.call(null,p,i));

break;
case "radial":
robiota.sketch.solveRadial.call(null,cljs.core.nth.call(null,p,i));

break;
case "threshold":
robiota.sketch.solveThreshold.call(null,cljs.core.nth.call(null,p,i));

break;
case "eye":
robiota.sketch.solveEye.call(null,cljs.core.nth.call(null,p,i));

break;
case "touch":
robiota.sketch.solveTouch.call(null,cljs.core.nth.call(null,p,i));

break;
case "motor":
robiota.sketch.solveMotor.call(null,cljs.core.nth.call(null,p,i));

break;
case "net":
robiota.sketch.solveNet.call(null,cljs.core.nth.call(null,p,i));

break;
default:
throw (new Error(["No matching clause: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__544_546)].join('')));

}

var G__548 = (i + (1));
i = G__548;
continue;
} else {
return null;
}
break;
}
});

//# sourceMappingURL=sketch.js.map
