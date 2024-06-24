;; build and run with:
;; clj -M -m cljs.main -co build.edn -c -s

(ns robiota.sketch)

(def SIZE 24)
(def VEHICLES 3)
(def LUMINENCE 2E2)
(def SATURATION 4)
(def F 250)
(def DENSITY 1)
(def SIDE 1)
(def OFFSET 2) ;; offset of eye from body
(def HEX_RADIUS 1)
(def CIRCLE_RADIUS 0.75)
(def TRI_RADIUS 0.75)
(def DRAG 10)
(def CENTERING 0.05)

(def parts (volatile! nil))
;;(def joints (volatile! nil))
(def posi (volatile! nil))

(defn randomInt [n] (Math/floor (* (Math/random) n )))

(defn list-insert [list e i]
  (let [[left right] (split-at i list)]
    (concat left [e] right)))

(defn polygon [cx cy sides radius rot]
  (let [
        theta (/ (* 2 Math/PI) sides)
        angles (map (fn [n] (+ (* n theta) rot)) (range sides))
        p (map (fn [a] (js/b2Vec2. (+ cx (* radius (Math/cos (+ a (* Math/PI 0.5))))) (+ cy (* radius (Math/sin (+ a (* Math/PI 0.5))))))) angles)
  ] p ))

(defn weld [a b] ;; create and initialise weld joint
  (let [jdef (js/b2WeldJointDef.)]
    (.Initialize jdef a b (.GetWorldCenter a))
    (aset jdef "stiffness" 1)
    (aset jdef "damping" 1)
    (js/world.CreateJoint jdef)))

;;box (js/b2PolygonShape.) ;; box shape
;;(.SetAsBox box SIDE SIDE)

(defn create-eye [b a] ;; offset from motor body
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
      body) ))

(defn eye [b label a]
          (let [e (create-eye b a)]
            {:label label :body e :joint (weld b e)}))

(defn create-motor [b a v] ;; a: angle from body, v: angle of thrust vector
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
      body)))

(defn motor [b label a v]
  (let [m (create-motor b a v)]
    {:label label :body m :joint (weld b m)} ))

(defn sun [label]
  (let [shape (js/b2CircleShape.)
        bdef (js/b2BodyDef.) ;; with default position 0,0 
        ]
    (.set_type bdef js/Module.b2_dynamicBody)
    (let  [ body (js/world.CreateBody bdef)] 
         (.set_m_radius shape CIRCLE_RADIUS)
         (.CreateFixture body shape DENSITY)
         {:label label :body body})))

(defn evaluate [s] ;; no eval?
  (case (aget (first s) "name")
    "eye" (eye (nth s 1) (nth s 2) (nth s 3))
    "motor" (motor (nth s 1) (nth s 2) (nth s 3) (nth s 4))))

(defn create-cell []
  (let [rot 0
        shape (js/createPolygonShape (clj->js (polygon 0 0 6 HEX_RADIUS rot)))
        bdef (js/b2BodyDef.)]
    (.set_position bdef (js/b2Vec2. (- (randomInt SIZE) (/ SIZE 2)) (- (randomInt SIZE) (/ SIZE 2))))
    (.set_type bdef js/Module.b2_dynamicBody)
    (let [body (js/world.CreateBody bdef)]
      (.CreateFixture body shape (* 10 DENSITY))
      (.SetTransform body (.GetPosition body) 0) ;; set angle
      body)))

(defn cell [label & parts]
  (let [ b (create-cell)
        blist (map (fn [p] (evaluate (list-insert p b 1))) parts)  
        ]
    (aset b "userData" #js {:LEFT_EYE 0 :RIGHT_EYE 0 :LEFT_MOTOR 0 :RIGHT_MOTOR 0}) ;; JS dictionary
    (cons {:label label :body b} blist)
    ))

(defn setup []
  (vswap! parts conj (sun "SUN"))
  (vreset! posi (js/b2Vec2. 0 0)) ;; initial position of the sun
  (loop [i 0]
    (when (< i VEHICLES)
      (vswap! parts concat (let [ pi Math/PI] ;; can't unquote constant?
                              (cell "CELL"
                                    `(eye "RIGHT_EYE" 0)
                                    `(eye "LEFT_EYE" ~(/ pi 3))
                                    `(motor "LEFT_MOTOR" ~pi ~(/ pi 6))
                                    `(motor "RIGHT_MOTOR" ~(* -2 (/ pi 3)) ~(/ pi -6)))))
      (recur (inc i)))))

(defn angle-to [a b] ;; atan2(b.y - a.y, b.x - a.x)
  (let [dx (- (aget b "x") (aget a "x")) 
        dy (- (aget b "y") (aget a "y"))]
    (Math/atan2 dy dx)))

(defn distance [a b] ;; distance between two points
  (let [dx (- (aget b "x") (aget a "x"))
        dy (- (aget b "y") (aget a "y"))]
    (.Length (js/b2Vec2. dx dy))
    )
  )

;; angular deviation from origin
(defn deviation [ v posi ] 
  (let [
        ;;a (angle-to (.GetPosition v) (js/b2Vec2. 0 0))
        a (angle-to (.GetPosition v) posi)
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

(defn solveCell [p] 
 (let [
       v (:body p)
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
   ))

(defn solveEye [p]
  (let [e (:body p)
        ;;d (.Length (.GetPosition e)) ;; distance from origin (vector norm) 
        d (distance (deref posi) (.GetPosition e)) ;; distance from sun
        b (/ LUMINENCE d) ;; apparent brightness at this position
        a (deviation e (deref posi)) ;; angle with light source 
        c (+ (Math/cos a) 1) ;; Lambert's cosine law offset to positive interval
        ;; get the body A joined to eye B
        body (.GetBodyA (:joint p)) 
        u (aget body "userData")
        ]
    (aset u (:label p) (* b c))
    ))

(defn solveMotor [p]
  (let [m (:body p) 
        dt (/ 1 js/frameRate) 
        body (.GetBodyA (:joint p)) ;; get the body A joined to motor B
        u (aget body "userData")
        n (aget u (:label p))
        s (* dt (min n SATURATION) F) ;; speed proportional to input with saturation 
        force (js/b2Vec2. (* s (Math/cos (.GetAngle m))) (* s (Math/sin (.GetAngle m))))
        ] 
    (.ApplyLinearImpulse m force (.GetWorldCenter m))
    ))

(defn solveSun [p]
  (let [ s (:body p)
        pos (.GetPosition s)
        ;; apply pressure towards the origin
        force (js/b2Vec2. (* (- CENTERING) (aget pos "x")) (* (- CENTERING) (aget pos "y")))]
    (.ApplyLinearImpulse s force (.GetWorldCenter s))
    pos)
  )

(defn step [] 
  (let [p (deref parts)]
   (loop [i 0]
     (when (< i (count p))
       (case (:label (nth p i)) 
         "SUN" (vreset! posi (solveSun (nth p i))) ;; save the position
         "CELL" (solveCell (nth p i)) 
         "LEFT_EYE" (solveEye (nth p i))
         "RIGHT_EYE" (solveEye (nth p i))
         "LEFT_MOTOR" (solveMotor (nth p i))
         "RIGHT_MOTOR" (solveMotor (nth p i))
       )
       (recur (inc i))))) )

