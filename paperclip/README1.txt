PAPERCLIP COMPUTER 26-BIT DRUM ASSEMBLER & SIMULATOR
=====================================================

ABOUT THIS SIMULATOR
====================

This is a standalone browser simulator for the manually operated computer
described in How to Build a Working Digital Computer (1967/68), with its
program represented as the machine's flat 26-contact drum words.

Open index.html in a modern browser. No installation, network connection,
or web server is required.

The interface is organised around the main machine units:

ENCODER          decimal INPUT A and INPUT B
DECODER          decimal TENS and UNITS, plus the red ANS indicator
ARITHMETIC UNIT  ACCUMULATOR, EXTENSION and X REGISTER
CORE MEMORY      five writable four-bit words
PROGRAM          the 65-position program drum


QUICK START
===========

1. Open index.html.
2. Paste or upload assembly source in the Assembly source panel.
3. Click Assemble.
4. Set any required encoder and core-memory values.
5. Click Run, or use Step to execute one drum position at a time.

Controls
--------

Run       Executes continuously until an instruction explicitly requires
          operator attention, or Pause is pressed.

Step      Executes exactly one drum position. It does not perform the
          automatic Run-mode pause before an input request.

Pause     Stops automatic execution without changing machine state.

PC to 1   Sets the program counter to drum position 1 while preserving
          the registers, decoder, encoders and core memory.

Reset all Resets PC, ACCUMULATOR, EXTENSION, X REGISTER, TENS, UNITS,
          INPUT A, INPUT B, CORE1-CORE5, ANS and execution state to zero.


QUICK START EXAMPLE 1: ADDITION
===============================

In the Assembler panel at startup:

// Add INPUT A and INPUT B
RIN A
TRA
RIN B
ADD
RUT UNITS ANS

Then:

1. Click Assemble.
2. Set INPUT A and INPUT B to a pair of single digit numbers.
3. Click Run.
4. The program reads both encoder values without pausing.
5. The 4-bit sum is formed in the ACCUMULATOR 
6. RUT UNITS ANS sets the UNITS decoder to the sum and lights the ANS lamp.
7. The lit ANS lamp causes the simulator to pause so the result can be inspected.

Important: plain RIN A and RIN B do not request new operator input. They
simply read whatever value is currently present on the encoder.

To make an input instruction request operator attention, add ANS:

RIN A ANS
RIN B ANS

In Run mode, the simulator pauses before such an instruction. Change the
requested encoder value and click Run again to execute the RIN.

To run the program again, reset the PC to 1.


QUICK START EXAMPLE 2: MISÈRE NIM
=================================

Single-pile misère Nim allows the player to remove 1, 2 or 3 pebbles. The player who takes the last pebble loses. The supplied Nim example uses the computer strategy of taking 4 minus the player's move. The possible starting piles for this strategy are 5, 9 and 13. The human player goes first.

1. Load and Assemble the program
2. You need to set the cores manually:

CORE1 = 13     size of pile; 5 (0101), 9 (1001), or 13 (1101) may be used.
CORE2 = 1      constant 1 (0001)
CORE3 = 4      constant 4 (0100)
CORE4 = 0      player's current move
CORE5 = 0      computer's most recent move

3. Run the program
4. The size of the pile is decoded as a decimal value in TENS/UNITS.
5. When it reaches RIN B ANS, the ANS lights red, and it pauses for your move.
6. Enter 1, 2 or 3 in INPUT B.
7. Click Run.
8. The player's move is stored in CORE4.
9. The computer's computed move is stored in CORE5.
10. The remaining pile is written back to CORE1.
11. The program updates TENS/UNITS and returns for the next move.

For example, from 13 pebbles:

INPUT B = 3
CORE4   = 3     player's move
CORE5   = 1     computer's move
CORE1   = 9     pebbles remaining
DECODER = 09

The two constants are adjacent in CORE2 and CORE3, while the player's and
computer's moves are adjacent in CORE4 and CORE5.


ASSEMBLY LANGUAGE
=================

Write one drum position per source instruction. The assembler is case
insensitive and commas are optional.

Comments may begin with:

// comment
; comment
# comment

Instruction summary
-------------------

RIN  A, B, CORE1-CORE5; optional ANS
     Read the selected encoder or core word into the accumulator. RIN with
     COREn automatically adds the physical C contact. In Run mode, external
     RIN A/B pauses only when ANS is also present.

ADD
     Add the four-bit X register to the lower four accumulator stages. The
     carry is represented by the fifth 2^4/SIGN accumulator stage.
     DISPLAY (ACC) is added automatically by the assembler.

SUB
     Subtract X from the lower four accumulator stages. A borrow/negative
     result sets the 2^4/SIGN stage. DISPLAY (ACC) is added automatically.

SHR  1-4
     Shift the combined five-stage accumulator and four-stage extension
     path right by the specified number of positions. DISPLAY (ACC) is
     added automatically.

SHL  1-4
     Shift the combined accumulator/extension path left by the specified
     number of positions. DISPLAY (ACC) is added automatically.

TRA
     Copy the lower four accumulator bits to the separate X register.
     DISPLAY (ACC) is added automatically.

RUT  TENS and/or UNITS; optional ANS
     Copy/decode the lower four accumulator bits into the selected decimal
     decoder position. TENS maps to the physical 10^1 contact and UNITS to
     10^0. ANS lights the red answer indicator and pauses Run after readout.
     DISPLAY (ACC) is added automatically.

STO  CORE1-CORE5
     Store the lower four accumulator bits in the selected core word. The
     assembler automatically adds both the physical C and DISPLAY contacts.

COJ  label
     Conditional jump. The jump is taken when the accumulator 2^4/SIGN
     stage is 1. DISPLAY (ACC) is added automatically so the operator can
     inspect the accumulator condition.

JUP  label
     Unconditional jump to the specified jump marker.

Examples
--------

RIN A
RIN B ANS
RIN CORE1
STO CORE5
SHR 2
RUT UNITS
RUT TENS UNITS ANS
COJ negative
JUP loop


ANS AND OPERATOR ATTENTION
==========================

ANS is a control contact, not a HALT instruction.

Its simulator meaning is "operator attention required":

RIN B
    Read INPUT B immediately and continue.

RIN B ANS
    Light ANS and, during Run, pause before reading INPUT B. The operator
    changes INPUT B and clicks Run again.

RUT UNITS ANS
    Write the accumulator to UNITS, light ANS, then pause Run so the result
    can be inspected.

A program may continue after an ANS pause by clicking Run again.


DISPLAY (ACC)
=============

DISPLAY is a physical control contact that causes the accumulator and
extension-register contents to be displayed to the operator. The symbolic
assembler automatically adds DISPLAY to operations where the operator needs
to see those registers:

ADD  SUB  SHR  SHL  TRA  STO  RUT  COJ

It is not automatically added to:

RIN  JUP

When DISPLAY is active, the ACCUMULATOR and EXTENSION lamps are shown amber
in the simulator. Otherwise their lit lamps are green. DISPLAY does not
pause execution.

The execution trace explicitly shows the automatically generated signal,
for example:

4: ADD + DISPLAY (ACC) | ...

Literal 26-bit words are never altered by the assembler, so DISPLAY must be
set explicitly in a literal word when required.


ACCUMULATOR, X AND EXTENSION
============================

The ACCUMULATOR consists of five stages:

2^4/SIGN  2^3  2^2  2^1  2^0

The 2^4 stage acts as carry for addition and sign/borrow indication for
subtraction. COJ tests this stage.

The four-stage EXTENSION register is connected to the accumulator for
shifting. SHL and SHR therefore operate over a nine-stage path:

ACCUMULATOR                     EXTENSION
2^4  2^3  2^2  2^1  2^0       E1 E2 E3 E4

The X REGISTER is separate. TRA copies ACC[3:0] to X, and ADD/SUB use X as
the second arithmetic operand.


ENCODER AND DECODER
===================

INPUT A and INPUT B are decimal encoder values and are restricted to the
single decimal-digit range 0-9.

TENS and UNITS are decimal decoder outputs. They always contain a decimal
number and initialise to 0.

RUT TENS
    Decode ACC[3:0] into the tens position.

RUT UNITS
    Decode ACC[3:0] into the units position.

RUT TENS UNITS
    Writes the same accumulator value to both decoder positions. This is
    useful when the value is zero.

ANS is displayed beside TENS and UNITS because it signals that the displayed
answer or prompt requires operator attention.


CORE MEMORY
===========

CORE1-CORE5 are five four-bit writable memory words, displayed as rows of
four lamps. Click a lamp to toggle that bit before or during a program.

The programmer writes:

RIN CORE2
STO CORE4

The assembler automatically activates the physical C contact as well as the
selected COREn contact. There is no need to write C explicitly.


LABELS AND JUMPS
================

The original architecture provides four jump-marker contacts numbered 1-4.
The assembler allows up to four symbolic labels and allocates these contacts
in label-definition order.

Example:

loop:
RIN B ANS
...
JUP loop

A label may also prefix an instruction:

loop: RIN B ANS

After assembly, the status line reports mappings such as:

LOOP=1 -> word 12, LOST=2 -> word 43

JUP and COJ use absolute jump markers: JUP 1 means go to the drum position
marked by jump contact 1, not move one position relatively.


RAW 26-BIT DRUM WORDS
=====================

No BITS, WORD or NOP pseudo-instructions are used.

A source line containing exactly 26 binary digits is interpreted literally
as one physical drum word:

10000000001000000000000000

An explicit blank drum position is therefore simply:

00000000000000000000000000

Raw words are not changed by the assembler. In particular, automatic C or
DISPLAY contacts are not added to them.

Blank positions beyond the assembled source are also present on the full
65-position simulated drum. A blank word performs no action and advances to
the next drum position. Position 65 wraps to position 1.


THE PROGRAM DRUM
================

The simulator models one drum word as 26 independent, multi-hot contact
tracks rather than an encoded opcode plus operand.

The first ten tracks are the order contacts:

RIN ADD SUB SHR SHL TRA RUT STO COJ JUP

The following sixteen are address/control contacts:

A B C CORE1 CORE2 CORE3 CORE4 CORE5
1 2 3 4 DISPLAY 10^0 10^1 ANS

The simulator shows order contacts in amber and address/control contacts in
blue, followed by the complete 26-bit pattern.

Several contacts may be active in the same word. For example, symbolic:

STO CORE2

assembles with the STO, C, CORE2 and DISPLAY contacts active.

The simulator displays all 65 drum positions. Positions not explicitly
programmed contain no contacts.


MACHINE CONTROLS
================

Run
---
Runs continuously. Plain RIN A/B does not pause. RIN A/B ANS pauses before
the read so the encoder can be changed. RUT ... ANS pauses after readout.

Step
----
Executes one drum word immediately. It does not perform the automatic
Run-mode pre-input pause.

Pause
-----
Stops Run without changing machine state.

PC to 1
-------
Sets PC to drum word 1 while preserving the encoder, decoder, registers and
core memory.

Reset all
---------
Resets PC, INPUT A/B, ACCUMULATOR, EXTENSION, X, TENS, UNITS, CORE1-CORE5,
ANS and execution state to zero, and clears the execution trace.


PROGRAM DISPLAY AND EXECUTION TRACE
===================================

The PROGRAM panel shows:

- all 65 physical drum positions;
- the source instruction;
- ten order contacts;
- sixteen address/control contacts;
- the complete 26-bit contact pattern;
- the highlighted next drum position.

The execution trace shows the symbolic source instruction plus important
physical control activity. In particular, automatically generated DISPLAY
is reported as:

+ DISPLAY (ACC)


LIMITS AND IMPLEMENTATION NOTES
===============================

- Drum capacity: 65 positions.
- INPUT A/B: decimal 0-9.
- Core words and X register: four bits, 0-15.
- Accumulator: four data stages plus the 2^4/SIGN carry/borrow stage.
- Extension register: four stages connected to ACC for shifts.
- ADD and SUB use four-bit operands plus the fifth carry/sign stage.
- SHL/SHR operate across the nine ACC/extension stages.
- COJ jumps when 2^4/SIGN is 1, not when ACC equals zero.
- At most four symbolic jump labels may be defined.
- ANS means operator attention/pause; it is not a halt instruction.
- There is no NOP instruction. A drum position with no contacts simply does
  nothing and advances.
- The simulator is a behavioural reconstruction of the manually operated
  architecture, not an electrical simulation of its paperclip circuitry.


TROUBLESHOOTING
===============

Run stops at RIN A or RIN B
---------------------------
Check whether ANS is present. RIN B ANS deliberately pauses before the read.
Enter the requested encoder value and click Run again. Plain RIN B should
not pause.

Nim pauses with PC at its RIN B ANS word and CORE4/CORE5 are still zero
-------------------------------------------------------------------------
That is expected. The paused RIN has not yet executed. Enter 1-3 in INPUT B
and click Run. The following words store the player's move and later the
computer's move.

Nim behaves incorrectly after Reset all
---------------------------------------
Reset all now clears every core. Restore the Nim initial values before Run:

CORE1 = 13 (or 5 or 9)
CORE2 = 1
CORE3 = 4
CORE4 = 0
CORE5 = 0

JUP or COJ reports a missing target
-----------------------------------
Check that the target label is defined and that the source uses no more than
four labels.

A raw binary line fails to assemble
-----------------------------------
It must contain exactly 26 binary digits after comments have been removed.
Do not prefix it with BITS.

Browser displays source rather than the simulator
-------------------------------------------------
Ensure the file is saved with an .html extension and open it in a modern web
browser such as Edge, Chrome, Firefox or Safari.
