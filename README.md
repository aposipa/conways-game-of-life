## Deployed link: https://aposipa-conways-game-of-life.netlify.app/

# Implementing Conway's Game of Life

In computability theory, a system of data-manipulation rules (such as a computer's instruction set, a programming language, or a cellular automaton) is said to be Turing-complete or computationally universal if it can be used to simulate any Turing machine. This means that this system is able to recognize or decide other data-manipulation rule sets. Turing completeness is used as a way to express the power of such a data-manipulation rule set. Virtually all programming languages today are Turing-complete. The concept is named after English mathematician and computer scientist Alan Turing.

------

## Rules

In the Game of Life, these rules examine each cell of the grid. For each cell, it counts that cell's eight neighbors (up, down, left, right, and diagonals), and then act on that result.
* If the cell is alive and has 2 or 3 neighbors, then it remains alive. Else it dies.
* If the cell is dead and has exactly 3 neighbors, then it comes to life. Else if remains dead.


From those two rules, many types of "creatures" can be created that move around the "landscape". Note: cells that are off the edge of the grid are typically assumed to be dead.

------

## Interactive Rules

* You can customize the grid to your liking while the game is not running. Simply click on a square to make it alive, or dead.
* The 'Randomize Grid' button will generate a random grid to start with.
* The 'Next Generation' button will manually progress the game one generation at a time.
* You can set the runtime of the game via the 'Time Interval' by inputing your own time. Time is in milliseconds(1000 msec = 1 sec).

