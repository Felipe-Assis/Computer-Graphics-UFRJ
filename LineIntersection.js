var ls = []; //line segments array
var points = []; //points array
var tp = []; //temporary mouse coordinates
var dragline = false; //indicates line
var index = null; //selected segment index
var lo = 'start' //line segment orientation
var circle = false;
var c = [] //background color

function setup() {
  createCanvas(1000, 500);
}

function getAngle(a,b){
  angle = Math.atan2(a[1]-b[1], b[0]-a[0]);
  return angle;
}

function ccw(a,b,c){
  var res = (b[1] - a[1])*(c[0]-b[0]) - (b[0]-a[0])*(c[1]-b[1]);
  if (res < 0) return -1;
  else if (res > 0) return 1;
  else return 0; }

function collinear(a,b,c){
  return ccw(a,b,c) == 0;
}

function verify(a,b,c,d){
  var t1 = ccw(a,c,d)*ccw(b,c,d);
  var t2 = ccw(a,b,c)*ccw(a,b,d);
  return ((t1 <= 0) && (t2 <= 0));
}

function intersection(l1, l2){
  var x1 = l1[0],   y1 = l1[1],   x2 = l1[2],   y2 = l1[3];
  var x3 = l2[0],   y3 = l2[1],   x4 = l2[2],   y4 = l2[3];
  
  if (verify([x1,y1],[x2,y2],[x3,y3],[x4,y4]) == false) return false;
  
  px = ((x1*y2 - y1*x2)*(x3 - x4) - (x1 - x2)*(x3*y4 - y3*x4)) / ((x1 - x2)*(y3 - y4) - (y1 - y2)*(x3 - x4));
  py = ((x1*y2 - y1*x2)*(y3 - y4) - (y1 - y2)*(x3*y4 - y3*x4)) / ((x1 - x2)*(y3 - y4) - (y1 - y2)*(x3 - x4));
  return [px, py];
}

function findPoints(){
  points = [];
  for (i=0; i<ls.length; i++){
    for (j=i+1; j<ls.length; j++){
      var po = intersection(ls[i],ls[j]);
      if  (po != false){
        append(points, po);}}} 
}

function drawPoints(){
	fill(255);
	for (i=0; i<points.length;i++){
		ellipse(points[i][0],points[i][1],10,10);
	}
}

function pointDist(l, p){
	res = abs((l[3]-l[1])*p[0] - (l[2]-l[0])*p[1] + l[2]*l[1] - l[3]*l[0]) / sqrt((l[3]-l[1])**2 + (l[2]-l[0])**2);
	return res;
}

function onSegment(l, p){
	if ((p[0] >= min(l[0],l[2])) && (p[0] <= max(l[0],l[2])) && (p[1] >= min(l[1],l[3])) && (p[1] <= max(l[1],l[3]))) 
		return true;
}

function drawShape(){
	fill(255);
	beginShape();
	for (i=0; i<points.length; i++){
		vertex(points[i][0],points[i][1]);
		//print(points[i]);
	}
	endShape();
}

function mousePressed(){
  circle = true;
  for (i=0; i<ls.length; i++){
    if (dist(mouseX, mouseY, ls[i][0], ls[i][1]) < 10){
      cursor(HAND);
      lo = 'start';
      index = i;}
      
    else if (dist(mouseX, mouseY, ls[i][2], ls[i][3]) < 10){
      cursor(HAND);
      lo = 'end';
      index = i;}

    else if ((pointDist(ls[i], [mouseX,mouseY]) < 5) && (onSegment(ls[i], [mouseX,mouseY]) == true)){
    	//print (pointDist(ls[i], [mouseX,mouseY]));
    	cursor(HAND);
    	index = i;
    	tp = [mouseX,mouseY];
    	dragline = true;
    	lo = null;
    }}
      
  if (index == null){
  	cursor(CROSS);
    append(ls,[mouseX, mouseY, mouseX, mouseY]);
    lo = 'end';
    index = ls.length-1;}
}

function mouseDragged(){
  if (index != null){
    if (lo == 'start'){
      ls[index][0]=mouseX,   ls[index][1]=mouseY;
    }
    else if (lo == 'end'){
      ls[index][2]=mouseX,   ls[index][3]=mouseY;}
  }
  if (dragline == true){
  	ls[index][0] = (ls[index][0] + (mouseX - tp[0]));
  	ls[index][1] = (ls[index][1] + (mouseY - tp[1]));
  	ls[index][2] = (ls[index][2] + (mouseX - tp[0]));
  	ls[index][3] = (ls[index][3] + (mouseY - tp[1]));
  	tp = [mouseX, mouseY];
  }

}  

function mouseReleased(){
  index = null;
  cursor(ARROW);
  circle = false;
  dragline = false;
  //print (ls);
}

function keyPressed(){
  if (keyCode === (BACKSPACE)){
    ls.splice(ls.length-1, 1);}
}

function getColor(){
  var r = document.getElementById("Red").value;
  var g = document.getElementById("Green").value;
  var b = document.getElementById("Blue").value;
  var colorHTML = [r,g,b];
  return colorHTML
}

function draw() {
  c = getColor();
  background(c[0], c[1], c[2]);
  textSize(12);
  text("Push BACKSPACE to delete last line segment",5,15);
  findPoints();
  //drawShape();
  for (i=0; i<ls.length; i++){
    line(ls[i][0], ls[i][1], ls[i][2], ls[i][3]);}
  drawPoints();
  
  if (circle == true){
    noFill(), strokeWeight(2);
    ellipse(mouseX, mouseY, 35, 35);}
    fill(0), strokeWeight(1);
}