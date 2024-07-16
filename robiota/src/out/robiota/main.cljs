(ns robiota.main

  (:require [robiota.sketch :as sketch]
            [goog.object :as gobj]
            ))

(gobj/set js/window "setup" #(sketch/setup))
(gobj/set js/window "step" #(sketch/step))
(gobj/set js/window "beginContact" #(sketch/beginContact %))
(gobj/set js/window "endContact" #(sketch/endContact %))

