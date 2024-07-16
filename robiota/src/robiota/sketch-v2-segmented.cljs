;; build and run with:
;; clj -M -m cljs.main -co build.edn -c -s

(ns robiota.sketch)

(def SIZE 24)
(def VEHICLES 1)
(def LUMINENCE 2E2)
(def SATURATION 5)
(def F 5)
(def DENSITY 1)
(def SIDE 1)
(def OFFSET 2) ;; offset of eye from body
(def HEX_RADIUS 1)
(def CIRCLE_RADIUS 0.75)
(def TRI_RADIUS 0.75)
(def DRAG 10)

(def bodies (volatile! nil))
(def joints (volatile! nil))

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

(defn createBody []
  (let [
        rot 0
        shape (js/createPolygonShape (clj->js (polygon 0 0 6 HEX_RADIUS rot)) )
        bdef (js/b2BodyDef.)]
    (.set_position bdef (js/b2Vec2. (- (randomInt SIZE) (/ SIZE 2)) (- (randomInt SIZE) (/ SIZE 2))))
    (.set_type bdef js/Module.b2_dynamicBody)
    (let [body (js/world.CreateBody bdef)]
      (.CreateFixture body shape (* 10 DENSITY))
      (.SetTransform body (.GetPosition body) 0) ;; set angle
      (aset body "userData" #js {:body "BODY" :LEFT_EYE 0 :RIGHT_EYE 0 :LEFT_MOTOR 0 :RIGHT_MOTOR 0}) ;; JS dictionary
      body)))


(defn createEye [label b a] ;; offset from motor body
  (let [shape (js/b2CircleShape.) ;; new b2CircleShape()
        bdef (js/b2BodyDef.)
        pos (.GetPosition b)
        ]
    (.set_m_radius shape CIRCLE_RADIUS)
    (.set_position bdef (js/b2Vec2. (+ (aget pos "x") (* (Math/cos a) OFFSET)) (+ (aget pos "y") (* (Math/sin a) OFFSET)))) ;; offset & angle from b
    (.set_type bdef js/Module.b2_dynamicBody)
    (let [body (js/world.CreateBody bdef)]
      (.CreateFixture body shape DENSITY)
      (.SetTransform body (.GetPosition body) a) ;; set angle
      (aset body "userData" #js {:body label})
      body) ))

(defn createMotor [label b a v] ;; a: angle from body, v: angle of thrust vector
  (let [rot (/ Math/PI 6)
        shape (js/createPolygonShape (clj->js (polygon 0 0 3 TRI_RADIUS rot)))
        bdef (js/b2BodyDef.)
        pos (.GetPosition b)
        a1 (+ Math/PI a v)
        ] 
    (.set_position bdef (js/b2Vec2. (+ (aget pos "x") (* (Math/cos a) OFFSET)) (+ (aget pos "y") (* (Math/sin a) OFFSET)))) ;; offset & angle from body
    (.set_type bdef js/Module.b2_dynamicBody)
    (let [body (js/world.CreateBody bdef)]
      (.CreateFixture body shape DENSITY)
      (.SetTransform body (.GetPosition body) a1) ;; set angle
      (aset body "userData" #js {:body label })
      body)))

(defn weld [a b] ;; create and initialise weld joint
  (let [ jdef (js/b2WeldJointDef.) ]
    (.Initialize jdef a b (.GetWorldCenter a))
    (aset jdef "stiffness" 1)
    (aset jdef "damping" 1)
    (js/world.CreateJoint jdef) 
    ))

(defn createVehicle []
  (let [body (createBody)
        rightEye (createEye "RIGHT_EYE" body 0)
        leftEye (createEye "LEFT_EYE" body (/ Math/PI 3))
        leftMotor (createMotor "LEFT_MOTOR" body Math/PI (/ Math/PI 6)) ;; (/ Math/PI 3)
        rightMotor (createMotor "RIGHT_MOTOR" body (* -2 (/ Math/PI 3)) (/ Math/PI -6)) ;; (- (/ Math/PI 3))
        ]
    (vswap! joints conj (weld body rightEye))
    (vswap! joints conj (weld body leftEye))
    (vswap! joints conj (weld body leftMotor))
    (vswap! joints conj (weld body rightMotor))
    ;;(.SetTransform body (.GetPosition body) (* Math/random 2 Math/PI)) ;; set angle
    [body rightEye leftEye leftMotor rightMotor]))

(defn createSun []
  (let [shape (js/b2CircleShape.)
        bdef (js/b2BodyDef.) ;; with default position 0,0
        body (js/world.CreateBody bdef)]
    (.set_m_radius shape CIRCLE_RADIUS)
    (.CreateFixture body shape DENSITY)
    ))

(defn setup [] 
  (createSun)
  (loop [i 0] 
    (when (< i VEHICLES) 
      (vswap! bodies concat (createVehicle)) 
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

;; (defn gaussian [mean std] ;; Standard Normal variate using Box-Muller transform
;;   (let [
;;         u (- 1.0 (Math/random)) ;; Convert [0,1) to (0,1]
;;         v (Math/random)
;;         z (Math/sqrt (* -2.0 (Math/log u) (Math/cos (* 2.0 Math/PI v))))
;;   ] (+ (* z std) mean))
;;   )

(defn solveBody [v] 
 (let [
       u (aget v "userData")
       l (aget u "LEFT_EYE")
       r (aget u "RIGHT_EYE")
       dragVector (.GetLinearVelocity v)
       dragAngle (+ Math/PI (Math/atan2 (aget dragVector "y") (aget dragVector "x")) ) 
       d (Math/sqrt (+ (Math/pow (aget dragVector "x") 2) (Math/pow (aget dragVector "y") 2))) ;; drag
       force (js/b2Vec2. (* d DRAG (Math/cos dragAngle)) (* d DRAG (Math/sin dragAngle)))
       ]
   (.ApplyLinearImpulse v force (.GetWorldCenter v))
   (aset u "LEFT_MOTOR" r)
   (aset u "RIGHT_MOTOR" l)
   )
   )

(defn solveEye [e]
  (let [dt (/ 1 js/frameRate) 
        d (.Length (.GetPosition e)) ;; distance from origin (vector norm) 
        b (/ LUMINENCE d) ;; apparent brightness at this position
        a (deviation e) ;; angle with light source 
        c (+ (Math/cos a) 1) ;; Lambert's cosine law offset to positive interval
        ;; get the body A joined to eye B
        body (first (map (fn [j] (.GetBodyA j)) (filter (fn [i] (= (.GetBodyB i) e)) (deref joints))))
        u (aget body "userData")
        eu (aget e "userData")
        label (aget eu "body")
        ]
    (aset u label (* b c))
    ))

(defn solveMotor [m]
  (let [mu (aget m "userData")
        label (aget mu "body") 
        body (first (map (fn [j] (.GetBodyA j)) (filter (fn [i] (= (.GetBodyB i) m)) (deref joints))))
        u (aget body "userData")
        n (aget u label)
        s (* (min n SATURATION) F) ;; speed proportional to input with saturation 
        force (js/b2Vec2. (* s (Math/cos (.GetAngle m))) (* s (Math/sin (.GetAngle m))))
        ] 
    (.ApplyLinearImpulse m force (.GetWorldCenter m))
    ))

(defn step [] 
  (let [v (deref bodies)]
   (loop [i 0]
     (when (< i (count v))
       (case (aget (aget (nth v i) "userData") "body") 
         "BODY" (solveBody (nth v i)) 
         "LEFT_EYE" (solveEye (nth v i))
         "RIGHT_EYE" (solveEye (nth v i))
         "LEFT_MOTOR" (solveMotor (nth v i))
         "RIGHT_MOTOR" (solveMotor (nth v i))
       )
       (recur (inc i)))))
  )

