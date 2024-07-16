;; build and run with:
;; clj -M -m cljs.main -co build.edn -c -s

(ns robiota.sketch)

(def SIZE 24)
(def VEHICLES 10)
(def LUMINENCE 2E2)
(def SATURATION 10)
(def W 50) ;; angular weighting
(def F 1)
(def vehicles (volatile! nil))
(def DENSITY 1)
(def SIDE 1)
(def OFFSET 2.1) ;; offset of eye from motor
(def RADIUS 1)

(defn randomInt [n] (Math/floor (* (Math/random) n )))

(defn polygon [cx cy sides radius rot]
  (let [
        theta (/ (* 2 Math/PI) sides)
        angles (map (fn [n] (+ (* n theta) rot)) (range sides))
        p (map (fn [a] (js/b2Vec2. (+ cx (* radius (Math/cos (+ a (* Math/PI 0.5))))) (+ cx (* radius (Math/sin (+ a (* Math/PI 0.5))))))) angles)
  ] p
    ))

;;box (js/b2PolygonShape.) ;; box shape
;;(.SetAsBox box SIDE SIDE)

(defn createMotor []
  (let [
        rot (- (/ Math/PI 2)) ;; this is just the rotation of the shape, not the body
        shape (js/createPolygonShape (clj->js (polygon 0 0 3 RADIUS rot)) )
        def (js/b2BodyDef.)]
    (.set_position def (js/b2Vec2. (- (randomInt SIZE) (/ SIZE 2)) (- (randomInt SIZE) (/ SIZE 2))))
    (.set_type def js/Module.b2_dynamicBody)
    (let [body (js/world.CreateBody def)]
      (.CreateFixture body shape DENSITY)
      (.SetTransform body (.GetPosition body) 0) ;; set angle
      (aset body "userData" "M")
      body)))

(defn createSensor [b] ;; offset from motor body
  (let [shape (js/b2CircleShape.) ;; new b2CircleShape()
        def (js/b2BodyDef.)
        p (.GetPosition b)
        ]
    (.set_m_radius shape 1)
    (.set_position def (js/b2Vec2. (+ (aget p "x") OFFSET) (aget p "y"))) ;; offset from b
    (.set_type def js/Module.b2_dynamicBody)
    (let [body (js/world.CreateBody def)]
      (.CreateFixture body shape DENSITY)
      (.SetTransform body (.GetPosition body) 0) ;; set angle
      (aset body "userData" "S")
      body) ))

(defn createVehicle []
  (let [m (createMotor)
        s (createSensor m)
        def (js/b2WeldJointDef.) ]
    (.Initialize def s m (.GetWorldCenter s))
    (aset def "stiffness" 1)
    (aset def "damping" 1)
    (js/world.CreateJoint def) 
    [s m]))
  
(defn setup [] 
  (loop [i 0] 
    (when (< i VEHICLES) 
      (vswap! vehicles concat (createVehicle)) 
      (recur (inc i))
      )
    )
  )

(defn angle-to [a b] ;; atan2(b.y - a.y, b.x - a.x)
  (let [dx (- (aget b "x") (aget a "x")) 
        dy (- (aget b "y") (aget a "y"))]
    (Math/atan2 dy dx)))

;; angular deviation from origin
(defn deviation [ v ] 
  (let [
        a (angle-to (.GetPosition v) (js/b2Vec2. 0 0))
        tau (* 2 Math/PI)
        theta (.GetAngle v) 
        ] 
    (mod (- a theta) tau)
    ))

(defn gaussian [mean std] ;; Standard Normal variate using Box-Muller transform
  (let [
        u (- 1.0 (Math/random)) ;; Convert [0,1) to (0,1]
        v (Math/random)
        z (Math/sqrt (* -2.0 (Math/log u) (Math/cos (* 2.0 Math/PI v))))
  ] (+ (* z std) mean))
  )

(defn solveM [v] 
 (let [
       dt (/ 1 js/frameRate)
       d (.Length (.GetPosition v)) ;; distance from origin (vector norm) 
       b (/ LUMINENCE d) ;; apparent brightness 
       a (deviation v) ;; angle with light source 
       l (if (> (Math/cos a) 0) (Math/cos a) 0) ;; Lambert's cosine law with half-rectification 
       s (* (min (* b l) SATURATION) F) ;; speed proportional to input with saturation
       ;;fa (* W dt (- (Math/random) 0.5)) ;; angular force
       theta (.GetAngle v)
       force (js/b2Vec2. (* s (Math/cos theta)) (* s (Math/sin theta)))
       ]
   (.ApplyForce v force (.GetWorldCenter v))
   )
   )

(defn solveS [v]
  (let [dt (/ 1 js/frameRate)
        fa (* W dt (- (Math/random) 0.5)) ;; angular force
        ]
    ;;(.ApplyAngularImpulse v fa true)
    (.SetTransform v (.GetPosition v) (+ (.GetAngle v) (* W dt (- (Math/random) 0.5))) )
        )
    )

(defn step [] 
  (let [v (deref vehicles)]
   (loop [i 0]
     (when (< i (count v))
       (case (aget (nth v i) "userData")
         "M" (solveM (nth v i)) 
         "S" (solveS (nth v i))
       )
       (recur (inc i)))))
  )

