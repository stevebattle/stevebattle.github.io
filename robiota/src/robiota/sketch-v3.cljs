;; build and run with:
;; clj -M -m cljs.main -co build.edn -c -s

(ns robiota.sketch)

(def SIZE 24)
(def VEHICLES 5)
(def LUMINENCE 2E2)
(def SATURATION 5)
(def F 250)
(def DENSITY 1)
(def SIDE 0.2)
(def OFFSET 2) ;; offset of eye from body
(def TOUCH_OFFSET 1.6) ;; offset of eye from body
(def HEX_RADIUS 1)
(def CIRCLE_RADIUS 0.6)
(def BALL_RADIUS 0.8)
(def TRI_RADIUS 0.75)
(def DRAG 10)
(def DRAG_ANGULAR 30)
(def CENTERING 0.05)
(def REVERSE -20)

;; volatiles
;; Every part {:label L :body B :joint J} has a label L for message passing, body B connected by joint J
(def parts (volatile! nil))
(def posi (volatile! nil)) ;; The position of the ball, stored as a js/b2Vec2 vector
(def contacts (volatile! nil)) ;; list of touch sensor activations

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

(defn create-eye [b a] ;; offset from motor body
  (let [shape (js/b2CircleShape.) ;; new b2CircleShape()
        bdef (js/b2BodyDef.)
        pos (.GetPosition b)
        x (aget pos "x")
        y (aget pos "y")
        ]
    (.set_m_radius shape CIRCLE_RADIUS)
    (.set_position bdef (js/b2Vec2. (+ x (* (Math/cos a) OFFSET)) (+ y (* (Math/sin a) OFFSET)))) ;; offset & angle from b
    (.set_type bdef js/Module.b2_dynamicBody)
    (let [body (js/world.CreateBody bdef)]
      (.CreateFixture body shape DENSITY)
      (.SetTransform body (.GetPosition body) a) ;; set angle
      body) ))

(defn eye [b label a]
          (let [e (create-eye b a)]
            (aset e "userData" #js {:type "eye"})
            {:label label :body e :joint (weld b e)}))

(defn create-motor [b a v] ;; a: angle from body, v: angle of thrust vector
  (let [rot (/ Math/PI 6)
        shape (js/createPolygonShape (clj->js (polygon 0 0 3 TRI_RADIUS rot)))
        bdef (js/b2BodyDef.)
        pos (.GetPosition b)
        x (aget pos "x")
        y (aget pos "y")
        a1 (+ Math/PI a v)
        ] 
    (.set_position bdef (js/b2Vec2. (+ x (* (Math/cos a) OFFSET)) (+ y (* (Math/sin a) OFFSET)))) ;; offset & angle from body
    (.set_type bdef js/Module.b2_dynamicBody)
    (let [body (js/world.CreateBody bdef)]
      (.CreateFixture body shape DENSITY)
      (.SetTransform body (.GetPosition body) a1) ;; set angle
      body)))

(defn motor [b label a v]
  (let [m (create-motor b a v)]
    (aset m "userData" #js {:type "motor"})
    {:label label :body m :joint (weld b m)} ))

(defn create-touch [b a] ;; offset from body
  (let [shape (js/b2PolygonShape.) 
        bdef (js/b2BodyDef.)
        pos (.GetPosition b)
        x (aget pos "x")
        y (aget pos "y") ]
    (.SetAsBox shape SIDE SIDE) ;; box shape
    (.set_position bdef (js/b2Vec2. (+ x (* (Math/cos a) TOUCH_OFFSET)) (+ y (* (Math/sin a) TOUCH_OFFSET)))) ;; offset & angle from b
    (.set_type bdef js/Module.b2_dynamicBody)
    (let [body (js/world.CreateBody bdef)]
      (.CreateFixture body shape DENSITY)
      (.SetTransform body (.GetPosition body) a) ;; set angle
      body)))

(defn touch [b label a]
  (let [t (create-touch b a)]
    (aset t "userData" #js {:type "touch"})
    {:label label :body t :joint (weld b t)}))

(defn ball []
  (let [shape (js/b2CircleShape.)
        bdef (js/b2BodyDef.) ;; with default position 0,0 
        ]
    (.set_type bdef js/Module.b2_dynamicBody)
    (let  [ body (js/world.CreateBody bdef)] 
         (.set_m_radius shape BALL_RADIUS)
         (.CreateFixture body shape DENSITY)
         (aset body "userData" #js {:type "ball"})
         {:body body})))

(defn evaluate [s] ;; no eval?
  (case (aget (first s) "name")
    "eye" (eye (nth s 1) (nth s 2) (nth s 3))
    "touch" (touch (nth s 1) (nth s 2) (nth s 3))
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

(defn cell [& parts]
  (let [ b (create-cell)
        blist (map (fn [p] (evaluate (list-insert p b 1))) parts)  
        ]
    (aset b "userData" #js {:type "cell" :LEFT_EYE 0 :RIGHT_EYE 0 :TOUCH 0 :LEFT_MOTOR 0 :RIGHT_MOTOR 0}) ;; JS dictionary
    (cons {:body b} blist)
    ))

(defn setup []
  (vswap! parts conj (ball))
  (vreset! posi (js/b2Vec2. 0 0)) ;; initial position of the ball
  (loop [i 0]
    (when (< i VEHICLES)
      (vswap! parts concat (let [ pi Math/PI] ;; can't unquote constant?
        (cell
          ;; `(net "RIGHT_EYE" "LEFT_MOTOR" 1.0)
          ;; `(net "LEFT_EYE" "RIGHT_MOTOR" 1.0)
          ;; `(net "TOUCH" "LEFT_MOTOR" -REVERSE)
          ;; `(net "TOUCH" "RIGHT_MOTOR" -REVERSE)
          `(eye "RIGHT_EYE" 0) ;; labels needed for message passing
          `(eye "LEFT_EYE" ~(/ pi 3))
          `(touch "TOUCH" ~(/ pi 6))
          `(motor "LEFT_MOTOR" ~pi ~(/ pi 6))
          `(motor "RIGHT_MOTOR" ~(* -2 (/ pi 3)) ~(/ pi -6)))))
      (recur (inc i)))))

(defn angle-to [a b] ;; atan2(b.y - a.y, b.x - a.x)
  (let [dx (- (aget b "x") (aget a "x")) 
        dy (- (aget b "y") (aget a "y"))]
    (Math/atan2 dy dx)
))

(defn distance [a b] ;; distance between two points
  (let [dx (- (aget b "x") (aget a "x"))
        dy (- (aget b "y") (aget a "y"))]
    (.Length (js/b2Vec2. dx dy))
))

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
 (let [v (:body p)
       u (aget v "userData")
       l (aget u "LEFT_EYE")
       r (aget u "RIGHT_EYE")
       t (aget u "TOUCH")

       ;; linear drag
       dragVector (.GetLinearVelocity v)
       x (aget dragVector "x")
       y (aget dragVector "y")
       dragAngle (+ Math/PI (Math/atan2 y x))
       drag (.Length dragVector)
       force (js/b2Vec2. (* drag DRAG (Math/cos dragAngle)) (* drag DRAG (Math/sin dragAngle)))

       ;; angular drag
       torque (* (- (.GetAngularVelocity v)) DRAG_ANGULAR)
       ]
   (.ApplyLinearImpulse v force (.GetWorldCenter v))
   (.ApplyTorque v torque true)
   (aset u "LEFT_MOTOR" (+ r (* t REVERSE)))
   (aset u "RIGHT_MOTOR" (+ l (* t REVERSE)))
   ))

(defn solveEye [p]
  (let [e (:body p)
        ;;d (.Length (.GetPosition e)) ;; distance from origin (vector norm) 
        d (distance (deref posi) (.GetPosition e)) ;; distance from ball
        b (/ LUMINENCE d) ;; apparent brightness at this position
        a (deviation e (deref posi)) ;; angle with light source 
        c (+ (Math/cos a) 1) ;; Lambert's cosine law offset to positive interval
        ;; get the body A joined to eye B
        body (.GetBodyA (:joint p)) 
        u (aget body "userData")
        ]
    (aset u (:label p) (min (* b c) SATURATION) ) ;; set eye value on connected body, with saturation
    ))

(defn solveTouch [p]
  (let [ t (:body p)
      id (aget t "a")
      c (deref contacts)
      ;; get the body A joined to touch sensor B
      body (.GetBodyA (:joint p))
      test (some? (some #{id} c))
      u (aget body "userData")
    ]
    (aset u (:label p) (if (some? (some #{id} c)) 1 0 ))
))

(defn solveMotor [p]
  (let [m (:body p) 
        dt (/ 1 js/frameRate) 
        body (.GetBodyA (:joint p)) ;; get the body A joined to motor B
        u (aget body "userData")
        n (aget u (:label p)) ;; get motor value from connected body
        s (* dt n F) ;; speed proportional to input 
        force (js/b2Vec2. (* s (Math/cos (.GetAngle m))) (* s (Math/sin (.GetAngle m))))
        ] 
    (.ApplyLinearImpulse m force (.GetWorldCenter m))
    ))

(defn solveBall [p]
  (let [ b (:body p)
        pos (.GetPosition b)
        x (aget pos "x")
        y (aget pos "y")
        ;; apply pressure towards the origin
        force (js/b2Vec2. (* (- CENTERING) x) (* (- CENTERING) y))]
    (.ApplyLinearImpulse b force (.GetWorldCenter b))
    pos) ;; return the position for the vehicles to track
  )

(defn step [] 
  (let [p (deref parts)]
   (loop [i 0]
     (when (< i (count p))
       (let [ type (aget (aget (:body (nth p i)) "userData") "type") ] 
       (case type
         "ball" (vreset! posi (solveBall (nth p i))) ;; save the position for the vehicles
         "cell" (solveCell (nth p i)) 
         "eye" (solveEye (nth p i))
         "touch" (solveTouch (nth p i))
         "motor" (solveMotor (nth p i))
       ))
       (recur (inc i))))) )

(defn beginContact [contact]
  (let [ a (.GetBody (.GetFixtureA contact))
        b (.GetBody (.GetFixtureB contact))
        aid (aget a "a")
        bid (aget b "a")
        atype (aget (aget a "userData") "type")
        btype (aget (aget b "userData") "type")
        c (deref contacts)
      ]
      (when (and (= atype "touch") (not= btype "ball"))
        (vreset! contacts (conj c aid)) ;; add touch ID to list
      )
      (when (and (= btype "touch") (not= atype "ball"))
        (vreset! contacts (conj c bid)) ;; add touch ID to list
      )
  )
)

(defn removeFirst [x l]
  (let [[n m] (split-with (partial not= x) l)] 
  (concat n (rest m)))
)

(defn endContact [contact]
  (let [ a (.GetBody (.GetFixtureA contact))
        b (.GetBody (.GetFixtureB contact))
        aid (aget a "a")
        bid (aget b "a")
        atype (aget (aget a "userData") "type")
        btype (aget (aget b "userData") "type")
        c (deref contacts)
      ]
      (when (and (= atype "touch") (not= btype "ball"))
        (vreset! contacts (removeFirst aid c)) ;; remove first touch ID from list
      )
      (when (and (= btype "touch") (not= atype "ball"))
        (vreset! contacts (removeFirst bid c)) ;; remove first touch ID from list
      )
  )
)