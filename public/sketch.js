var turtle, 
	manager,
	container,
	program_text,
	button,
	canvas;

function setup(){
    canvas = createCanvas(800,800);
    container = createDiv("");
    program_text = createElement("textarea");
    program_text.parent(container);
    button = createButton("Run");
    createElement("br").parent(container);
    button.parent(container);
    button.mousePressed(run_program)
    turtle = new Turtle(width/2, height/2);
    manager = new Manager(turtle);
}

function run_program(){
	var program = program_text.value();
	manager.reset();
	manager.setProgram(program);
}

function draw(){
    background(255);
    if(frameCount % 20 === 0)
	    manager.step();
    manager.show();
}
