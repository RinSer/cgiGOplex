var url;
var canvasWidth;
var canvasHeight;
var backgroundColor;
var strokeColor;
var redC;
var blueC;
var greenC;
var fractal;
var counter;


function setup() {
  frameRate(5);
  counter = 0;
  url = getURL();
  url = url.split('_');
  if (url.length > 2) {
    // Set the canvas size
    canvasWidth = url[2];
    canvasHeight = url[4];
    var loader = createCanvas(canvasWidth, canvasHeight);
    loader.parent('#load');
    // Set the background
    if (url[13] == 'b') {
      backgroundColor = 0;
      strokeColor = 255;
    } else if (url[13] == 'w') {
      backgroundColor = 255;
      strokeColor = 0;
    }
    background(backgroundColor);
    // Set the colors
    redC = 0;
    greenC = 0;
    blueC = 0;
    if (url[14].indexOf('r') >= 0) {
      redC = 255;
    }
    if (url[14].indexOf('g') >= 0) {
      greenC = 255;
    }
    if (url[14].indexOf('b') >= 0) {
      blueC = 255;
    }
    // Set the rect mode and initialize squares
    rectMode(CENTER);
    fractal = new Squares(0, 0, canvasWidth/4, canvasHeight/4);
  }
}


function draw() {
  if (url.length > 2) {
    background(backgroundColor);
    stroke(strokeColor);
    fill(color(redC, greenC, blueC, 205));
    translate(canvasWidth/2, canvasHeight/2-canvasHeight/8);
    //rotate(radians(frameCount));
    fractal.display();
    // Animate the fractal
    if (counter == 5) {
      fractal.reset();
      counter = 0;
    } else {
      fractal.nextInside();
      counter++;
    }
  }
}


function Squares(Xstart, Ystart, Width, Height) {
  this.rects = [];
  this.Xfirst = Xstart;
  this.Yfirst = Ystart;
  this.firstWidth = Width;
  this.firstHeight = Height;
  // Initial square
  this.rects.push(new Square(Xstart, Ystart, Width, Height));

  // Function to create the next inside level
  this.nextInside = function() {
    var new_squares = [];
    this.rects.forEach(function(square) {
      var new_width = square.width/2;
      var new_height = square.height/2;
      var x_left = square.Xcoordinates+square.width/2;
      var x_right = square.Xcoordinates-square.width/2;
      var y_up = square.Ycoordinates+square.height/2;
      var y_down = square.Ycoordinates-square.height/2;
      new_squares.push(new Square(x_left, y_up, new_width, new_height));
      new_squares.push(new Square(x_left, y_down, new_width, new_height));
      new_squares.push(new Square(x_right, y_up, new_width, new_height));
      new_squares.push(new Square(x_right, y_down, new_width, new_height));
    });
    this.rects = new_squares;
  }

  // Function to create the next outside level
  this.nextOutside = function() {
    var new_squares = [];
    this.rects.forEach(function(square) {
      var new_width = square.width/2;
      var new_height = square.height/2;
      var x_left = square.Xcoordinates-square.width/2-square.width/4;
      var x_right = square.Xcoordinates+square.width/2+square.width/4;
      var y_up = square.Ycoordinates-square.height/2-square.height/4;
      var y_down = square.Ycoordinates+square.height/2+square.height/4;
      new_squares.push(new Square(x_left, y_up, new_width, new_height));
      new_squares.push(new Square(x_left, y_down, new_width, new_height));
      new_squares.push(new Square(x_right, y_up, new_width, new_height));
      new_squares.push(new Square(x_right, y_down, new_width, new_height));
    });
    this.rects = this.rects.concat(new_squares);
  }

  // Function to reset the figure
  this.reset = function() {
    this.rects = [];
    this.rects.push(new Square(this.Xfirst, this.Yfirst, this.firstWidth, this.firstHeight));
  }

  // Function to display the figure
  this.display = function() {
    this.rects.forEach(function(square) {
      square.display();
    });
  }
  
}


function Square(X, Y, width, height) {
  this.Xcoordinates = X;
  this.Ycoordinates = Y;
  this.width = width;
  this.height = height;

  this.display = function() {
    rect(this.Xcoordinates, this.Ycoordinates, this.width, this.height);
  }
}


