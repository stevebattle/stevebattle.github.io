// Misere Nim
//
// Initial settings:
// CORE1 = starting pile: 5, 9, or 13
// CORE2 = constant 1
// CORE3 = constant 4
// CORE4 = computer's most recent move (initially 0)
// CORE5 = spare
// Input B = player's move: 1, 2, or 3
//
// The program begins by displaying CORE1 in the DECODER.
// After every computer move it returns to 'show' before requesting input.
// Taking the last pebble loses.

show:
// Build decimal 10 in X: (1 << 3) + (1 << 1).
RIN CORE2
SHL 3
TRA
RIN CORE2
SHL 1
ADD
TRA

// Calculate CORE1 - 10. A negative result sets SIGN.
RIN CORE1
SUB
COJ one_digit

// Pile is 10-15: ACC contains the units digit and TENS is 1.
RUT UNITS
RIN CORE2
RUT TENS
JUP turn

one_digit:
// Pile is 0-9: copy it to UNITS, then generate zero for TENS.
RIN CORE1
RUT UNITS
TRA
RIN CORE1
SUB
RUT TENS
JUP turn

turn:
// Wait for and apply the player's move.
RIN B ANS
TRA
RIN CORE1
SUB
STO CORE1

// Test whether the player took the last pebble.
// CORE1 - 1 is negative only when CORE1 is zero.
RIN CORE2
TRA
RIN CORE1
SUB
COJ lost

// Computer move = 4 - player's move.
// Re-read the unchanged INPUT B value without pausing.
RIN B
TRA
RIN CORE3
SUB
STO CORE4

// Subtract the computer's move from the pile.
TRA
RIN CORE1
SUB
STO CORE1
JUP show

lost:
// Player took the final pebble: display 00 and signal answer ready.
RIN CORE1
RUT TENS UNITS ANS
JUP lost
