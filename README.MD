# Turtle

This is a project idea that was obtained from this [website](http://nifty.stanford.edu/2013/roberts-turtlegraphics/).

There is a turtle on the screen and you can input a program
to get it to move forward and rotate either left or right.

# Syntax for Input Programs

Here is what the possible kinds of inputs are in a turtle program:

* F\<Integer> : Move forward an \<Integer> number of pixels
* R\<Integer> : Rotate right by \<Integer> degrees
* L\<Integer> : Rotate left by \<Integer> degrees
* X\<Integer>{ \<CODE> } : Repeat the code within the braces an \<Integer> number of times

## Example programs

* F100 L90 // Move forward 100 pixels and rotate left 90 degrees
* F100 R30 F100 L90 // Move forward 100 pixels, rotate right 30 degrees, move forward 100 pixels, and rotate left 90 degrees
* X15{F100 L30} // Move forward 100 pixels and rotate left 30 degrees 15 times. 
