class CA {
  
  constructor(wolframCode) {
    this.code = wolframCode;
    this.generation = 0;
  }
  
  initialise(dimension) { 
    this.cell = Array(dimension).fill(0);
    return this; // fluent constructor
  }
  
  setCode(wolframCode) {
    this.code = wolframCode;
    return this;
  }
  
  regular(n) { // regular initialisation, n = number of ones
    this.cell = Array(this.cell.length).fill(0);
    let step = Math.round(this.cell.length/n);
    let x = 0;
    for (let i=0; i<n; i++) {
      this.cell[x] = 1;
      x += step;
    }
    this.generation = 0;
    return this; // fluent constructor
  }
  
  randomize() {
    for (let i=0; i<this.cell.length; i++) {
      this.cell[i] = Math.round(Math.random());
    }
    this.generation = 0;
    return this; // fluent constructor
  }
  
  generate() {
    let gen = [];
    for (let i=0; i<this.cell.length; i++) {
      let nhood = null;
      if (i==0) {
        nhood = this.cell.slice(-1,this.cell.length).concat(this.cell.slice(0,2))
      }
      else if (i==this.cell.length-1) {
        nhood = this.cell.slice(-2,this.cell.length).concat(this.cell[0])
      }
      else {
        nhood = this.cell.slice(i-1,i+2);
      }
      let mask = 2 ** (4*nhood[0] + 2*nhood[1] + nhood[2]);
      gen[i] = this.code & mask ? 1 : 0;
    }
    this.cell = gen;
    this.generation++;
  }
  
}
