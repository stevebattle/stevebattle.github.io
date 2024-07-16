(ns robiota.sketch)

(def SIDEX 8)
(def SIDEY 8)

(defn setup []
  (let [edge (js/b2EdgeShape.) ;; new b2EdgeShape()
        ground (js/world.CreateBody (js/b2BodyDef.)) ;; world.CreateBody(new b2BodyDef())
        circle (js/b2CircleShape.) ;; new b2CircleShape()
        cdef (js/b2BodyDef.) ;; new b2BodyDef()
        ]
    (.Set edge (js/b2Vec2. (/ (- SIDEX) 2) (/ (- SIDEY) 2)) (js/b2Vec2. (/ SIDEX 2) (/ (- SIDEY) 2)))
    (.CreateFixture ground edge 0)
    (.set_m_radius circle 1)
    (.set_position cdef (js/b2Vec2. 0 0))
    (.set_type cdef js/Module.b2_dynamicBody)
    (let [body (js/world.CreateBody cdef)]
     (.CreateFixture body circle 1))
    ))

(defn step [] ())

