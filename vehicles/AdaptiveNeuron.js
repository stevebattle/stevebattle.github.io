/* Adaptive Neuron */

// Activation function a, float x
function AdaptiveNeuron(a,x) {
  
  this.activation = a;
  this.output = 0;
  this.x = x;  
  this.v = 0;

  this.solve = function(bias, ta, tr, s, b, y) {
    this.output = this.activation(this.x + bias);
    this.dv = (this.output - this.v)/ta;
    this.dx = (s - this.v*b - this.x + y)/tr;
  }

  this.step = function(dt) {
    this.x += this.dx*dt;
    this.v += this.dv*dt;
  }

}
