PAPERCLIP COMPUTER 26-BIT DRUM ASSEMBLER & SIMULATOR
=====================================================

QUICK START
===========

1. Open paperclip_computer_simulator_fixed.html in a modern web browser.
   No installation, internet connection, or web server is required.

2. Paste a program into the Assembly source box, or use the addition
   example already provided.

3. Click Assemble.

4. Set any required Input A, Input B, and CORE1-CORE5 values.

5. Click:

   Run       Run automatically. The simulator pauses before RIN A or
             RIN B so that you can enter a new external input value.
             After entering the value, click Run again to continue.

   Step      Execute one drum word immediately. Step does not pause
             before RIN.

   Pause     Pause automatic execution without changing machine state.

   PC to 1   Return to drum word 1 while preserving ACC, X, output,
             inputs, and core memory.

   Reset all Reset PC, ACC, X, output, core memory, and execution state.


QUICK START EXAMPLE 1: ADDITION
===============================

Paste or retain this program:

// Add Input A to Input B
RIN A
TRA
RIN B
ADD
RUT DISPLAY
ANS

Then:

1. Click Assemble.
2. Set Input A to 3.
3. Set Input B to 4.
4. Click Run.
5. The simulator pauses at RIN A. Confirm or change Input A, then click
   Run again.
6. It pauses at RIN B. Confirm or change Input B, then click Run again.
7. The program stops at ANS.

Expected final state:

ACC     7
X       3
OUTPUT  7

Program explanation:

RIN A          Read Input A into ACC.
TRA            Copy ACC to X.
RIN B          Read Input B into ACC.
ADD            Add X to ACC.
RUT DISPLAY    Copy ACC to the output display.
ANS            Stop the program.


QUICK START EXAMPLE 2: MISERE NIM
=================================

This is single-pile misere Nim. A player may take 1, 2, or 3 counters.
The player who takes the last counter loses.

Paste this program:

// Misere Nim
// CORE1 = CORE1 must initially be 1, 5, 9 or 13.
// CORE2 = constant 4
// CORE3 = computer's most recent move
// Input B = player's move (1-3)
//
// The CORE1 value must be of the form 4n+1, where n is between 0 and 3.
// The computer strategy is to take 4 - your move.
// Taking the last counter loses.

turn:
RIN B
TRA
RIN C CORE1
SUB
STO C CORE1
COJ lost

RIN C CORE2
SUB
STO C CORE3
TRA
RIN C CORE1
SUB
STO C CORE1
RUT DISPLAY
JUP turn

lost:
ANS

Set the machine state before playing:

CORE1 = 13    Starting pile. You may instead use 5 or 9.
CORE2 = 4     Constant used to calculate the computer's move.
CORE3 = 0     The computer's move will be stored here.
Input B = 1   Your first move. Change this when prompted.

How to play:

1. Click Assemble.
2. Enter the starting values shown above.
3. Click Run.
4. The simulator pauses before RIN B at the label turn.
5. Enter your move, 1, 2, or 3, in Input B.
6. Click Run again.
7. The computer completes its turn and returns automatically to turn.
8. Read the new state:

   CORE1   Number of counters remaining.
   CORE3   Number of counters taken by the computer on its latest turn.
   OUTPUT  Number of counters remaining after the computer's move.

9. Enter your next move in Input B and click Run again.
10. Repeat until the program reaches lost and stops at ANS.

Example round:

Starting CORE1       13
Your Input B          2
Computer CORE3        2
Resulting CORE1       9

The computer calculates 4 minus your move, so each complete round removes
four counters and restores a 4n+1 position.


ASSEMBLY LANGUAGE
=================

Write one drum word per line. The assembler accepts uppercase or lowercase.
Commas are optional.

Comments
--------

Comments may begin with any of these markers:

// comment
; comment
# comment

Orders
------

RIN    Read an input or core-memory value into ACC.
ADD    Add X to ACC using four-bit wraparound arithmetic.
SUB    Subtract X from ACC using four-bit wraparound arithmetic.
SHR    Shift ACC right.
SHL    Shift ACC left using four-bit wraparound.
TRA    Copy ACC to X.
RUT    Copy ACC to the output display.
STO    Store ACC in a selected core-memory word.
COJ    Jump to a label when ACC is zero.
JUP    Jump unconditionally to a label.

Address and control contacts
----------------------------

A, B
C
CORE1, CORE2, CORE3, CORE4, CORE5
1, 2, 3, 4
DISPLAY
10^0, 10^1
ANS

Examples
--------

RIN A
RIN B
RIN C CORE1
STO C CORE3
SHL 2
RUT DISPLAY

Labels and jumps
----------------

The original architecture provides four jump contacts, numbered 1-4.
The assembler assigns labels to these contacts in the order in which the
labels are defined. A program can therefore contain at most four labels.

A label may appear on a line by itself:

loop:
RIN B
JUP loop

Or before an instruction:

loop: RIN B

After assembly, the status message reports each mapping, for example:

TURN=1 -> word 1, LOST=2 -> word 16

Raw drum words
--------------

Use WORD to activate contacts directly:

WORD RIN A 1

Use BITS to enter an exact 26-bit word:

BITS 10000000001000000000000000

BITS must be followed by exactly 26 binary digits.


THE 26-BIT DRUM DISPLAY
=======================

Each assembled row represents one drum word. The drum supports up to 65
words. The display shows:

- the source instruction;
- ten amber order contacts;
- sixteen blue address/control contacts;
- the complete 26-bit pattern;
- the highlighted word that will execute next.

The first 10 bits correspond to:

RIN ADD SUB SHR SHL TRA RUT STO COJ JUP

The following 16 bits correspond to:

A B C CORE1 CORE2 CORE3 CORE4 CORE5
1 2 3 4 DISPLAY 10^0 10^1 ANS

This is a multi-hot control word. More than one contact may be active in a
single drum word.


MACHINE STATE
=============

PC
--
The next drum word to execute. The display numbers drum words from 1.

ACC
---
The four-bit accumulator. Values are limited to 0-15.

X
-
The four-bit secondary arithmetic register.

Input A and Input B
-------------------
External four-bit input values. During Run, execution pauses before RIN A
or RIN B. Enter the required value and click Run again.

CORE1-CORE5
-----------
Five writable four-bit core-memory words. Reads from core memory do not
cause an automatic input pause.

OUTPUT
------
The most recent value sent by RUT.


RUNNING, STEPPING, AND RESETTING
===============================

Run
---
Executes repeatedly at the selected delay. Run pauses before external input
instructions RIN A and RIN B. It does not pause before RIN from core memory.

Step
----
Executes exactly one drum word. Step reads Input A or Input B immediately.

Pause
-----
Stops automatic execution while preserving all state.

PC to 1
-------
Sets PC to drum word 1 and clears the stopped state, but preserves ACC, X,
output, input values, and all core-memory words.

Reset all
---------
Sets PC, ACC, X, output, and CORE1-CORE5 to zero and clears the execution
log and stopped state. Input A and Input B remain available for editing.


LIMITS AND IMPLEMENTATION NOTES
===============================

- Drum capacity is 65 words.
- ACC, X, inputs, output, and core-memory words are four-bit values, 0-15.
- Arithmetic wraps within four bits.
- A program may define at most four jump labels.
- COJ is currently modelled as jump when ACC equals zero.
- Run automatically pauses only for external RIN A and RIN B instructions.
- The simulator models the reconstructed 10-order plus 16-address multi-hot
  instruction format. It is not an electrical simulation of the original
  paperclip circuits.


TROUBLESHOOTING
===============

The program does not assemble
-----------------------------
Read the assembly status message. It reports the source line and unknown
order, contact, label, or invalid BITS value.

JUP or COJ reports a missing target
-----------------------------------
Ensure the target label is defined and that the program contains no more
than four labels.

Run appears to stop at RIN
--------------------------
This is intentional. Enter or confirm Input A or Input B, then click Run
again.

Nim loses its pile when Reset all is clicked
---------------------------------------------
Reset all clears core memory. Re-enter CORE1=13, CORE2=4, and CORE3=0.
Use Pause rather than Reset all during a game.

Nim is waiting at word 1
------------------------
Enter a move from 1 to 3 in Input B, then click Run. The program should
return to word 1 after the computer's response.

The browser displays source text instead of the simulator
----------------------------------------------------------
Ensure that the filename ends in .html, then open it in a web browser such
as Edge, Chrome, Firefox, or Safari.
