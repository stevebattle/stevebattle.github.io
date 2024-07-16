;; build and run with:
;; clj -M -m cljs.main -co build.edn -c -s

(ns robiota.sketch)

(def SIZE 24)
(def VEHICLES 10)
(def LUMINENCE 2E2)
(def SATURATION 10)
(def W 5) ;; angular weighting
(def F 0.002)
(def vehicles (volatile! nil))

(defn randomInt [n] (Math/floor (* (Math/random) n )))

(defn createVehicle [] 
  (let [circle (js/b2CircleShape.) ;; new b2CircleShape()
        cdef (js/b2BodyDef.) ;; new b2BodyDef()
        ]
    (.set_m_radius circle 1)
    (.set_position cdef (js/b2Vec2. (- (randomInt SIZE) (/ SIZE 2)) (- (randomInt SIZE) (/ SIZE 2))))
    (.set_type cdef js/Module.b2_dynamicBody)
    (let [body (js/world.CreateBody cdef)]
      (.CreateFixture body circle 1)
      (.SetTransform body (.GetPosition body) (* (Math/random) 2 Math/PI)) ;; set angle
      body) ))
  
(defn setup [] 
  (loop [i 0] 
    (when (< i VEHICLES) 
      (vswap! vehicles conj (createVehicle)) 
      (recur (inc i))
      )
    )
  )

(defn angle-to [a b] 
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


(defn solve [v] 
 (let [
       dt (/ 1 js/frameRate)
       d (.Length (.GetPosition v)) ;; distance from origin (vector norm) 
       b (/ LUMINENCE d) ;; apparent brightness 
       a (deviation v) ;; angle with light source 
       l (if (> (Math/cos a) 0) (Math/cos a) 0) ;; Lambert's cosine law with half-rectification 
       s (* (min (* b l) SATURATION) F) ;; speed proportional to input with saturation
       da (* W (- (* (Math/random) 2 Math/PI) Math/PI))
       a1 (mod (+ (.GetAngle v) (* da dt)) (* 2 Math/PI)) 
       force (js/b2Vec2. (* s (Math/cos (.GetAngle v))) (* s (Math/sin (.GetAngle v))))
       ]
   (.SetTransform v (.GetPosition v) a1 ) ;; set angle
   (when (> s 0) (.ApplyLinearImpulse v force (.GetPosition v) true))
   )
  ) 

(defn step [] 
  (let [v (deref vehicles)]
   (loop [i 0]
     (when (< i VEHICLES) 
       (solve (nth v i))
       (recur (inc i)))))
  )

