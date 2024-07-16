;; build and run with:
;; clj -M -m cljs.main -co build.edn -c -s

(ns robiota.sketch)

(def SIZE 24)
(def VEHICLES 10)
(def LUMINENCE 2E2)
(def SATURATION 10)
(def F 250)
(def DENSITY 1)
(def SIDE 0.2)
(def OFFSET 2) ;; offset of eye from body
(def TOUCH_OFFSET 1.8) ;; offset of eye from body
(def HEX_RADIUS 1)
(def CIRCLE_RADIUS 0.6)
(def BALL_RADIUS 1)
(def TRI_RADIUS 0.75)
(def DRAG 8)
(def DRAG_ANGULAR 80)
(def CENTERING 0.1)
(def REVERSE -30)
(def SCALE 0.1) ;; for normal function, the larger the narrower
(def SLOPE 50) ;; for sigmoid function 

;; volatiles
(def parts (volatile! nil)) ;; list of parts (bodies)
(def posi (volatile! nil)) ;; The position of the ball, stored as a js/b2Vec2 vector
(def contacts (volatile! nil)) ;; list of touch sensor activations (list of touch sensor body ID)

(defn randomInt [n] (Math/floor (* (Math/random) n)))

(defn list-insert [list e i]
  (let [[left right] (split-at i list)]
    (concat left [e] right)))

(defn polygon [cx cy sides radius rot]
  (let [
        theta (/ (* 2 Math/PI) sides)
        angles (map (fn [n] (+ (* n theta) rot)) (range sides))
        p (map (fn [a] (js/b2Vec2. (+ cx (* radius (Math/cos (+ a (* Math/PI 0.5))))) (+ cy (* radius (Math/sin (+ a (* Math/PI 0.5))))))) angles)]
   p))

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
        y (aget pos "y")]
        
    (.set_m_radius shape CIRCLE_RADIUS)
    (.set_position bdef (js/b2Vec2. (+ x (* (Math/cos a) OFFSET)) (+ y (* (Math/sin a) OFFSET)))) ;; offset & angle from b
    (.set_type bdef js/Module.b2_dynamicBody)
    (let [body (js/world.CreateBody bdef)]
      (.CreateFixture body shape DENSITY)
      (.SetTransform body (.GetPosition body) a) ;; set angle
      body)))

(defn eye [b label a]
          (let [e (create-eye b a)]
            (aset e "userData" {:type "eye" :label label :joint (weld b e) }) e))

(defn create-motor [b a v] ;; a: angle from body, v: angle of thrust vector
  (let [rot (/ Math/PI 6)
        shape (js/createPolygonShape (clj->js (polygon 0 0 3 TRI_RADIUS rot)))
        bdef (js/b2BodyDef.)
        pos (.GetPosition b)
        x (aget pos "x")
        y (aget pos "y")
        theta (+ Math/PI a v)]
         
    (.set_position bdef (js/b2Vec2. (+ x (* (Math/cos a) OFFSET)) (+ y (* (Math/sin a) OFFSET)))) ;; offset & angle from body
    (.set_type bdef js/Module.b2_dynamicBody)
    (let [body (js/world.CreateBody bdef)]
      (.CreateFixture body shape DENSITY)
      (.SetTransform body (.GetPosition body) theta) ;; set angle
      body)))

(defn motor [b label a v]
  (let [m (create-motor b a v)]
    (aset m "userData" {:type "motor" :label label :joint (weld b m)}) m))

(defn create-touch [b a] ;; offset from body
  (let [shape (js/b2PolygonShape.) 
        bdef (js/b2BodyDef.)
        pos (.GetPosition b)
        x (aget pos "x")
        y (aget pos "y")]
    (.SetAsBox shape SIDE SIDE) ;; box shape
    (.set_position bdef (js/b2Vec2. (+ x (* (Math/cos a) TOUCH_OFFSET)) (+ y (* (Math/sin a) TOUCH_OFFSET)))) ;; offset & angle from b
    (.set_type bdef js/Module.b2_dynamicBody)
    (let [body (js/world.CreateBody bdef)]
      (.CreateFixture body shape DENSITY)
      (.SetTransform body (.GetPosition body) a) ;; set angle
      body)))

(defn touch [b label targets a]
  (let [t (create-touch b a)]
    (aset t "userData" {:type "touch" :label label :joint (weld b t) :targets targets}) t))

(defn net [ b label input output weight]
  (let [n (js/world.CreateBody (js/b2BodyDef.))] ;; a neuron is a body with no fixture
      (aset n "userData"  {:label label :type "net" :input input :output output :weight weight :joint b }) n)) ;; joint is simply the joined body

;; radial basis function
(defn radial [b label input bias]
  (let [n (js/world.CreateBody (js/b2BodyDef.))] ;; a neuron is a body with no fixture
    (aset n "userData"  {:label label :type "radial" :input input :bias bias :joint b}) 
    n
    )) ;; joint is simply the joined body

;; Heaviside threshold function
(defn threshold [ b label inputs output bias weight] 
  (let [ th (js/world.CreateBody (js/b2BodyDef.)) ] ;; a body with no fixture
    (aset th "userData"  {:label label :type "threshold" :inputs inputs :bias bias :weight weight :joint b}) 
    th
    ))

(defn ball []
  (let [shape (js/b2CircleShape.)
        bdef (js/b2BodyDef.)] ;; with default position 0,0 
        
    (.set_type bdef js/Module.b2_dynamicBody)
    (let  [ body (js/world.CreateBody bdef)] 
         (.set_m_radius shape BALL_RADIUS)
         (.CreateFixture body shape DENSITY)
         (aset body "userData" {:type "ball"})
         body)))

(defn evaluate [s] ;; no eval?
  (case (aget (first s) "name")
    "net" (net (nth s 1) (nth s 2) (nth s 3) (nth s 4) (nth s 5))
    "radial" (radial (nth s 1) (nth s 2) (nth s 3) (nth s 4))
    "eye" (eye (nth s 1) (nth s 2) (nth s 3))
    "touch" (touch (nth s 1) (nth s 2) (nth s 3) (nth s 4))
    "motor" (motor (nth s 1) (nth s 2) (nth s 3) (nth s 4))
    "threshold" (threshold (nth s 1) (nth s 2) (nth s 3) (nth s 4) (nth s 5) (nth s 6))
    ))

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
        blist (map (fn [p] (evaluate (list-insert p b 1))) parts)]  
        
    (aset b "userData" {:type "cell" :label label}) ;; #js JS dictionary
    (cons b blist)))
    

(defn angle-to [a b] ;; atan2(b.y - a.y, b.x - a.x)
  (let [dx (- (aget b "x") (aget a "x")) 
        dy (- (aget b "y") (aget a "y"))]
    (Math/atan2 dy dx)))


(defn distance [a b] ;; distance between two points
  (let [dx (- (aget b "x") (aget a "x"))
        dy (- (aget b "y") (aget a "y"))]
    (.Length (js/b2Vec2. dx dy))))


;; angular deviation from origin
(defn deviation [ v posi] 
  (let [
        a (angle-to (.GetPosition v) posi)
        tau (* 2 Math/PI)
        theta (.GetAngle v)] 
         
    (mod (- a theta) tau)))


;;activation function for the normal distribution provides radial basis function
(defn normal [x e] (Math/exp (* (- e) x x)))

;; sigmoid (log-sigmoid or logistic) activation function of x, with tuning b for steepness.
(defn sigmoid [x b] (/ 1 (+ 1 (Math/exp (* (- b) x)))))

;; wrap angles [-180,180] deg - (TAU * floor((deg + PI) * (1 / TAU)))
;; https://stackoverflow.com/questions/11498169/dealing-with-angle-wrap-in-c-code
(defn wrapAngle [a] (let [tau (* 2 Math/PI)] (- a (* tau (Math/floor (/ (+ a Math/PI) tau))))))

;; (defn gaussian [mean std] ;; Standard Normal variate using Box-Muller transform
;;   (let [
;;         u (- 1.0 (Math/random)) ;; Convert [0,1) to (0,1]
;;         v (Math/random)
;;         z (Math/sqrt (* -2.0 (Math/log u) (Math/cos (* 2.0 Math/PI v))))
;;   ] (+ (* z std) mean))
;;   )

(defn getValue [b key]
  (let [ u (aget b "userData") 
        v (get u key 0)] ;; get key value with default 0
    
   (if (coll? v)
     (let [ sum (reduce + (map val (seq v))) ] sum) ;; sum the values in the collection
     v))) ;; otherwise return the scalar


(defn getParameter [b key]
  (let [ u (aget b "userData")] 
   (get u key nil)))


(defn setValue [b key n]
  (let [ u (aget b "userData")]
    (aset b "userData" (assoc u key n))))
  

(defn setMultiValue [b key subkey n]
  (let [ u (aget b "userData") 
        v (assoc-in u [key subkey] n)] ;; add multi-level association
    
    (aset b "userData" v)))

(defn removeMultiValue [b key subkey]
  (let [u (aget b "userData")
        v (update-in u [key] dissoc subkey)] ;; multi-level dissociation
    (aset b "userData" v)))
  

(defn solveCell [v] 
 (let [
       label (getParameter v :label)
       ;; linear drag
       dragVector (.GetLinearVelocity v)
       x (aget dragVector "x")
       y (aget dragVector "y")
       theta (+ Math/PI (Math/atan2 y x))
       drag (.Length dragVector)
       force (js/b2Vec2. (* drag DRAG (Math/cos theta)) (* drag DRAG (Math/sin theta)))
       ;; angular drag
       torque (* (- (.GetAngularVelocity v)) DRAG_ANGULAR)
       angle (.GetAngle v)]
       
   (.ApplyLinearImpulse v force (.GetWorldCenter v))
   (.ApplyTorque v torque true)
   (setValue v label angle))) ;; save body angle (e.g. magnetic compass)
   

(defn solveEye [e]
  (let [
        d (distance (deref posi) (.GetPosition e)) ;; distance from ball
        b (/ LUMINENCE d) ;; apparent brightness at this position
        a (deviation e (deref posi)) ;; angle with light source 
        c (+ (Math/cos a) 1) ;; Lambert's cosine law offset to positive interval
        label (getValue e :label)
        ;; get the body A joined to eye B
        body (.GetBodyA (getParameter e :joint))] 
        
    (setValue body label (min (* b c) SATURATION)))) ;; set eye value on connected body, with saturation


(defn solveTouch [t]) ;; see beginContact, endContact


(defn solveMotor [m]
  (let [
        dt (/ 1 js/frameRate) 
        body (.GetBodyA (getParameter m :joint)) ;; get the body A joined to motor B
        label (getValue m :label)
        n (getValue body label) ;; get motor value from connected body
        s (* dt n F) ;; speed proportional to input 
        force (js/b2Vec2. (* s (Math/cos (.GetAngle m))) (* s (Math/sin (.GetAngle m))))]
    (.ApplyLinearImpulse m force (.GetWorldCenter m))))
    

(defn solveNet [n] 
  (let [ 
         body (getParameter n :joint)
         label (getParameter n :label)
         input (getParameter n :input)
         output (getParameter n :output)
         weight (getParameter n :weight)
         v (getValue body input)]
    (setMultiValue body output label (* v weight))))


(defn solveRadial [n]
  (let [body (getParameter n :joint)
        label (getParameter n :label)
        input (getParameter n :input)
        bias (getParameter n :bias)
        v (getValue body input)
        a (+ v bias)
        w (wrapAngle a)
        r (normal w SCALE)] ;; output in range [0, 1]
    (setValue body label r)))

(defn solveThreshold [n]
  (let [body (getParameter n :joint)
        label (getParameter n :label)
        inputs (getParameter n :inputs)
        bias (getParameter n :bias)
        weight (getParameter n :weight)
        v (reduce + (map (partial getValue body) inputs)) ;; sum inputs
        a (- v bias)
        ]
    (setValue body label (if (>= a 0) (* weight a) 0))
    )
  )

(defn solveBall [b]
  (let [ 
        pos (.GetPosition b)
        x (aget pos "x")
        y (aget pos "y")

       ;; linear drag + pressure towards the origin
        dragVector (.GetLinearVelocity b)
        dx (aget dragVector "x")
        dy (aget dragVector "y")
        theta (+ Math/PI (Math/atan2 dy dx))
        drag (* (.Length dragVector) 0.01)
        force (js/b2Vec2. (+ (* (- CENTERING) x) (* drag (Math/cos theta))) (+ (* (- CENTERING) y) (* drag (Math/sin theta))))]
      
    (.ApplyLinearImpulse b force (.GetWorldCenter b))
    pos)) ;; return the position for the vehicles to track
  
(defn beginContact [contact]
  (let [id (aget contact "a")
        a (.GetBody (.GetFixtureA contact))
        b (.GetBody (.GetFixtureB contact))
        atype (getParameter a :type)
        btype (getParameter b :type)
        atargets (getParameter a :targets)
        btargets (getParameter b :targets) ]
      (when (and (= atype "touch") (contains? (set (keys atargets)) btype))
        (let [ label (getValue a :label)
              body (.GetBodyA (getParameter a :joint)) 
              value (get atargets btype 0) ]
          (setMultiValue body label id value) ;; touch is a multi-value indexed by contact IDs
          ))
    
      (when (and (= btype "touch") (contains? (set (keys btargets)) atype))
        (let [label (getValue b :label)
              body (.GetBodyA (getParameter b :joint))
              value (get btargets atype 0) ]
          (setMultiValue body label id value)
          ))
    ))

(defn endContact [contact]
  (let [ id (aget contact "a")
        a (.GetBody (.GetFixtureA contact))
        b (.GetBody (.GetFixtureB contact))
        atype (getParameter a :type)
        btype (getParameter b :type) 
        atargets (getParameter a :targets)
        btargets (getParameter b :targets)
        ]
      (when (and (= atype "touch") (contains? (set (keys atargets)) btype))
  (let [label (getValue a :label)
        body (.GetBodyA (getParameter a :joint))]
    (removeMultiValue body label id)) ;; touch is a multi-value indexed by contact IDs
    )
(when (and (= btype "touch") (contains? (set (keys btargets)) atype))
  (let [label (getValue b :label)
        body (.GetBodyA (getParameter b :joint)) ]
    (removeMultiValue body label id)
    ))
    ))

(defn setup []
  (vswap! parts conj (ball))
  (vreset! posi (js/b2Vec2. 0 0)) ;; initial position of the ball
  (loop [i 0]
    (when (< i VEHICLES)
      (vswap! parts concat (let [
                                 pi Math/PI ;; can't unquote constant
                                 sector (/ pi 6) 
                                 team (if (even? i) 1 -1 ) ;; 1 or -1 even/odd teams
                                 ] 
                             (cell "CELL"
                                   `(net "L1" "RIGHT_EYE" "LEFT_MOTOR" 1)
                                   `(net "R1" "LEFT_EYE" "RIGHT_MOTOR" 1)
                                   `(net "L2" "TOUCH" "LEFT_MOTOR" 10) ;; touch sensor cannot distinguish / touch parts of self
                                   `(net "R2" "TOUCH" "RIGHT_MOTOR" 10)
                                   `(radial "RAD1" "CELL" ~(* team sector)) ;; what's the initial angle of the cell?
                                   `(radial "RAD2" "CELL" ~(* team (- sector))) ;; what's the initial angle of the cell?
                                   `(threshold "TH1" [ "RAD1" "TOUCH"] "RIGHT_MOTOR" 1 5)
                                   `(threshold "TH2" [ "RAD2" "TOUCH"] "LEFT_MOTOR" 1 5)
                                   `(eye "RIGHT_EYE" ~(- sector)) ;; labels needed for message passing
                                   `(eye "LEFT_EYE" ~sector) ;; positive angles for anti-clockwise
                                   `(touch "TOUCH" ~{"cell" -3 "motor" -3 "eye" -3 "ball" 1} 0)
                                   `(motor "LEFT_MOTOR" ~(* 5 sector) ~sector) ;; angle, thrust vector
                                   `(motor "RIGHT_MOTOR" ~(* -5 sector) ~(- sector)))))
      (recur (inc i)))))


(defn step []
  (let [p (deref parts)]
    (loop [i 0]
      (when (< i (count p))
        (let [type ((aget (nth p i) "userData") :type)] ;;aget type
          (case type
            "ball" (vreset! posi (solveBall (nth p i))) ;; save the position for the vehicles
            "cell" (solveCell (nth p i))
            "radial" (solveRadial (nth p i))
            "threshold" (solveThreshold (nth p i))
            "eye" (solveEye (nth p i))
            "touch" (solveTouch (nth p i))
            "motor" (solveMotor (nth p i))
            "net" (solveNet (nth p i))))
        (recur (inc i))))))