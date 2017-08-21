var ls = []; //line segments array
var p = []; //points array
var index = null; //selected segment index
var lo = 'start' //line segment orientation
var circle = false;

function setup() {
  createCanvas(1000, 500);
}

function ccw(a,b,c){
  var res = (b[1] - a[1])*(c[0]-b[0]) - (b[0]-a[0])*(c[1]-b[1]);
  if (res < 0) return true;
  else return false;
}

function verify(a,b,c,d){
  if (ccw(a,c,d) == ccw(b,c,d)) return false;
  else if (ccw(a,b,c) == ccw(a,b,d)) return false;
  else return true;
}

function intersection(l1, l2){
  var x1 = l1[0],   y1 = l1[1],   x2 = l1[2],   y2 = l1[3];
  var x3 = l2[0],   y3 = l2[1],   x4 = l2[2],   y4 = l2[3];
  
  if (verify([x1,y1],[x2,y2],[x3,y3],[x4,y4]) == false) return false;
  
  px = ((x1*y2 - y1*x2)*(x3 - x4) - (x1 - x2)*(x3*y4 - y3*x4)) / ((x1 - x2)*(y3 - y4) - (y1 - y2)*(x3 - x4));
  py = ((x1*y2 - y1*x2)*(y3 - y4) - (y1 - y2)*(x3*y4 - y3*x4)) / ((x1 - x2)*(y3 - y4) - (y1 - y2)*(x3 - x4));
  return [px, py];
}

function drawPoints(){
  for (i=0; i<ls.length; i++){
    for (j=i+1; j<ls.length; j++){
      var P = intersection(ls[i],ls[j]);
      if  (P != false){
        append(p, P);
        fill(255);
        ellipse(P[0],P[1],10,10);}}}
}

function mousePressed(){
  cursor(CROSS);
  circle = true;
  for (i=0; i<ls.length; i++){
    if (dist(mouseX, mouseY, ls[i][0], ls[i][1]) < 10){
      lo = 'start';
      index = i;}
      
    else if (dist(mouseX, mouseY, ls[i][2], ls[i][3]) < 10){
      lo = 'end';
      index = i;}}
      
  if (index == null){
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
}  

function mouseReleased(){
  index = null;
  cursor(ARROW);
  circle = false;
  print (ls);
}

function keyPressed(){
  if (keyCode === (BACKSPACE)){
    ls.splice(ls.length-1, 1);}
}

function draw() {
  background(220, 220, 240);
  textSize(12);
  text("Push BACKSPACE to delete last line segment",5,15);
  for (i=0; i<ls.length; i++){
    line(ls[i][0], ls[i][1], ls[i][2], ls[i][3]);}
  drawPoints();
  
  if (circle == true){
    noFill(), strokeWeight(2);
    ellipse(mouseX, mouseY, 35, 35);}
    fill(0), strokeWeight(1);
}