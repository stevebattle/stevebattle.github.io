// Misère Nim
//
// Core 1 = starting pile: 5, 9, or D hexadecimal (13 decimal)
// Core 2 = constant 1
// Core 3 = constant 4
// Core 4 = computer's most recent move, initially 0
// Input B = player's move: 1, 2, or 3
// Taking the last pebble loses.

// Initialise the four core words.
RIN 1 D
RIN 2 1
RIN 3 4
RIN 4 0

// Display the current pile in the DECODER.
4: RIN 2

// Build decimal 10: (1 << 3) + (1 << 1).
SHL 3
TRA
RIN 2
SHL 1
ADD
TRA

// Calculate pile - 10. A negative result sets SIGN.
RIN 1
SUB
COJ 1

// Pile is 10-15: ACC contains the units digit and MSH is 1.
RUT LSH
RIN 2
RUT MSH
JUP 2

1: RIN 1

// Pile is 0-9: copy it to LSH, then generate zero for MSH.
RUT LSH
TRA
RIN 1
SUB
RUT MSH

2: RIN B ANS

// Wait for and apply the player's move.
TRA
RIN 1
SUB
STO 1

// Test whether the player took the last pebble.
// Core 1 - 1 is negative only when the pile is zero.
RIN 2
TRA
RIN 1
SUB
COJ 3

// Computer move = 4 - player's move.
// Re-read the unchanged INPUT B value without pausing.
RIN B
TRA
RIN 3
SUB
STO 4

// SUB clears X, so transfer the computer move back to X before using it.
TRA
RIN 1
SUB
STO 1

// Marker 4 searches backwards to the display routine.
JUP 4

// Player took the final pebble.
3: RIN 1

// Display 00 and signal answer ready.
RUT LSH MSH ANS