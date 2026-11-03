// Misère Nim
//
// Core 1 = starting pile: 5, 9, or D hexadecimal (13 decimal)
// Core 2 = constant 1
// Core 3 = constant 4
// Core 4 = computer's most recent move, initially 0
// Core 5 = scratch, initially 0; later holds decimal 10
// Input B = player's move: 1, 2, or 3
//
// Markers 1-3 search forwards. Marker 4 searches backwards.
// Taking the last pebble loses.

// Initialise all five core words.
RIN 1 D
RIN 2 1
RIN 3 4
RIN 4 0
RIN 5 0

// Display the current pile in the DECODER.
4: RIN 2

// Build decimal 10: (1 << 3) + (1 << 1).
// ADD clears X, so save the result in core 5 before using it.
SHL 3
TRA
RIN 2
SHL 1
ADD
STO 5
RIN 5
TRA

// Calculate pile - 10. A negative result sets SIGN.
RIN 1
SUB
COJ 1

// Pile is 10-15: ACC contains the units digit and TENS is 1.
RUT UNITS
RIN 2
RUT TENS
JUP 2

1: RIN 1

// Pile is 0-9: copy it to UNITS, then generate zero for TENS.
RUT UNITS
TRA
RIN 1
SUB
RUT TENS
JUP 2

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

// The lost position carries both marker 3 and marker 4.
// COJ 3 reaches it forwards; JUP 4 loops back to it backwards.
3:
4: RIN 1

// Player took the final pebble: display 00 and signal answer ready.
RUT TENS UNITS ANS
JUP 4