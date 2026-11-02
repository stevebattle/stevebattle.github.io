// Misere Nim
//
// Initial settings:
// Core 1 = starting pile: 5, 9, or 13
// Core 2 = constant 1
// Core 3 = constant 4
// Core 4 = computer's most recent move (initially 0)
// Core 5 = scratch: decimal 10 during display conversion
// Input B = player's move: 1, 2, or 3
//
// The program begins by displaying core 1 in the DECODER.
// After every computer move it returns to 'show' before requesting input.
// Taking the last pebble loses.

show:
// Build decimal 10: (1 << 3) + (1 << 1).
// ADD now clears X, so save the result in core 5 before using it.
RIN 2
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
COJ one_digit

// Pile is 10-15: ACC contains the units digit and TENS is 1.
RUT UNITS
RIN 2
RUT TENS
JUP turn

one_digit:
// Pile is 0-9: copy it to UNITS, then generate zero for TENS.
RIN 1
RUT UNITS
TRA
RIN 1
SUB
RUT TENS
JUP turn

turn:
// Wait for and apply the player's move.
RIN B ANS
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
COJ lost

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
JUP show

lost:
// Player took the final pebble: display 00 and signal answer ready.
RIN 1
RUT TENS UNITS ANS
JUP lost
