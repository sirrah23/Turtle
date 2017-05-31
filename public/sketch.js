var turtle, manager;

function setup(){
    createCanvas(800,800);
    turtle = new Turtle(width/2, height/2);
    manager = new Manager(turtle, "F200 L90 F200 L90 F200 L90 F200");

}

function draw(){
    background(255);
    manager.show();
}
