PAPERCLIP COMPUTER 26-BIT DRUM ASSEMBLER & SIMULATOR
=====================================================

ABOUT THIS SIMULATOR
====================
This is a standalone browser simulator for the manually operated computer
described in How to Build a Working Digital Computer (1967/68). Programs are
represented as the machine's flat, multi-hot drum control words.

Open the simulator HTML file in a modern browser. No installation, network
connection or web server is required.

The interface is organised around the main machine units:

ENCODER          one hexadecimal-digit INPUT A and INPUT B
DECODER          one hexadecimal-digit TENS and UNITS, plus ANS
ARITHMETIC UNIT  ACCUMULATOR, EXTENSION and X REGISTER
CORE MEMORY      five writable four-bit words
PROGRAM          65-position program drum

QUICK START
===========
1. Open the simulator HTML file.
2. Paste or upload assembly source in the Assembly source panel.
3. Click Assemble.
4. Click Run, or use Step to execute one drum position at a time.

Programs may initialise core memory themselves using RIN, so manual core
setup is no longer necessary when those initialisation instructions are
included.

Controls
--------
Run       Executes continuously until an instruction explicitly requires
          operator attention, or Pause is pressed.
Step      Executes exactly one drum position. It does not perform the
          automatic Run-mode pause before an input request.
Pause     Stops automatic execution without changing machine state.
PC to 1   Sets the program drum to position 1 while preserving registers,
          decoder, encoders and core memory.
Reset all Resets PC/drum position, ACCUMULATOR, EXTENSION, X REGISTER,
          TENS, UNITS, INPUT A, INPUT B, cores, ANS and execution state.

QUICK START EXAMPLE 1: ADDITION
===============================
The startup example is:

// Add INPUT A and INPUT B
RIN A
TRA
RIN B
ADD
RUT UNITS ANS

Then:
1. Click Assemble.
2. Set INPUT A and INPUT B to single hexadecimal digits, for example 3 and 4.
3. Click Run.
4. RIN A reads A into ACC.
5. TRA copies ACC to X.
6. RIN B reads B into ACC.
7. ADD forms ACC + X, then clears X to zero.
8. RUT UNITS ANS writes the low four accumulator bits to UNITS, lights ANS
   and pauses Run for inspection.

For 3 + 4, UNITS displays 7. Inputs and decoder positions may also display
A-F, representing four-bit values 10-15.

Plain RIN A and RIN B do not request new operator input; they read the value
already on the encoder. To request operator attention, add ANS:

RIN A ANS
RIN B ANS

In Run mode the simulator pauses before such an external RIN. Enter the new
value and click Run again to execute the instruction.

QUICK START EXAMPLE 2: MISERE NIM
=================================
Single-pile misere Nim allows the player to remove 1, 2 or 3 pebbles. The
player taking the last pebble loses. The supplied Nim program uses the
strategy of taking 4 minus the player's move. Useful starting piles are 5,
9 and 13.

The program now initialises all five core words itself at the beginning:

RIN 1 D    // Core 1 = starting pile, 13 decimal
RIN 2 1    // Core 2 = constant 1
RIN 3 4    // Core 3 = constant 4
RIN 4 0    // Core 4 = computer's most recent move
RIN 5 0    // Core 5 = scratch

The second operand is one hexadecimal digit, 0-F, representing the complete
four-bit value to be loaded. Thus the starting pile can be changed to 5 or 9
by changing the first instruction to RIN 1 5 or RIN 1 9.

The decimal pile count is deliberately calculated by the program and placed
across TENS and UNITS. Thus a pile of 13 is shown as 13, even though each
individual decoder position is capable of displaying a hexadecimal digit.

When the program reaches:

RIN B ANS

ANS lights and Run pauses before the RIN is executed. Enter 1, 2 or 3 in
INPUT B and click Run. The program then performs the player's move, computes
the computer's response, stores that response in core 4, updates core 1 and
refreshes the decoder.

Because ADD and SUB clear X, the Nim program explicitly reloads X where
necessary. Core 5 temporarily preserves decimal 10 during the pile-display
conversion.

Example:

Starting pile    13
INPUT B           3
Computer move     1  (core 4)
Remaining pile    9  (core 1)
DECODER          09

The current Nim program also demonstrates the physical marker mechanism.
Markers 1-3 are searched forwards; marker 4 is searched backwards. A drum
word may carry more than one marker. For example:

3:
4: RIN 1

assembles as a single drum position carrying both marker contacts 3 and 4.
The line containing only 3: does not consume a drum position.

ASSEMBLY LANGUAGE
=================
Write one drum position per source instruction. The assembler is case
insensitive and commas are optional.

Comments may begin with:

// comment
; comment
# comment

Markers use the physical control-line numbers directly:

1:
2:
3:
4:

They are not conventional symbolic labels. The same marker may occur at more
than one drum position.

Instruction summary
-------------------
RIN  A, B, 1-5; optional ANS
     Read INPUT A, INPUT B or a numbered core word into ACC. For a numeric
     operand 1-5 the assembler automatically activates the physical C and
     corresponding Core address contacts. Plain external RIN reads
     immediately; RIN A/B ANS pauses Run for operator input.
     CORE1-CORE5 are retained as aliases for compatibility.

RIN  1-5 0-F
     Initialise the selected core word with one hexadecimal digit. The first
     operand selects the core and the second represents the four-bit value.
     Example: RIN 2 5 initialises core 2 to 0101.

ADD
     Add the low four X bits to the low four accumulator stages. Carry is
     represented in the fifth 2^4/SIGN accumulator stage. After the addition
     completes, X is cleared to zero. DISPLAY (ACC) is added automatically.

SUB
     Subtract X from the low four accumulator stages. Borrow/negative sets
     the 2^4/SIGN stage. After subtraction completes, X is cleared to zero.
     DISPLAY (ACC) is added automatically.

SHR  1-4
     Shift the combined five-stage accumulator and four-stage extension path
     right by the specified number of positions. DISPLAY (ACC) is added
     automatically.

SHL  1-4
     Shift the combined accumulator/extension path left by the specified
     number of positions. DISPLAY (ACC) is added automatically.

TRA
     Copy ACC[3:0] to the separate X register. DISPLAY (ACC) is added
     automatically.

RUT  TENS and/or UNITS; optional ANS
     Write ACC[3:0] to the selected decoder position as one hexadecimal digit.
     TENS maps to the physical 10^1 control contact and UNITS to 10^0. ANS
     lights the red indicator and pauses Run after readout. DISPLAY (ACC) is
     added automatically.

STO  1-5
     Store ACC[3:0] in the numbered core word. The assembler automatically
     activates the physical C, selected Core and DISPLAY contacts.

COJ  1-4
     Conditional jump. If accumulator 2^4/SIGN is 1, search for the first
     occurrence of the specified marker. Markers 1-3 are searched forwards;
     marker 4 is searched backwards. DISPLAY (ACC) is added automatically.

JUP  1-4
     Unconditional marker search. Markers 1-3 roll the drum forwards to the
     first matching marker encountered; marker 4 rolls the drum backwards.

Examples
--------
RIN A
RIN B ANS
RIN 1
RIN 2 5
STO 5
SHR 2
RUT UNITS
RUT TENS UNITS ANS
1: RIN B ANS
JUP 1

IMPORTANT: SHARED CONTROL LINES 1-4
===================================
The four address/control contacts labelled 1, 2, 3 and 4 are shared physical
lines. Their interpretation depends on the active order.

For core initialisation with RIN they form a four-bit data value:

line 1 = 2^0
line 2 = 2^1
line 3 = 2^2
line 4 = 2^3

For example:

RIN 2 5

selects core 2 and activates lines 1 and 3, representing 0101 (hexadecimal
5). These contacts are genuinely assembled onto the drum word; they are not
merely assembler metadata.

The same physical lines are interpreted as marker contacts by JUP and COJ.
Consequently a jump search can encounter a 1-4 contact belonging to a RIN
core-initialisation word. Keeping initialisation instructions together at the
start of a program normally avoids interference, but a careless wrap-around
jump can encounter them.

The same 1-4 control lines also have instruction-specific meanings for
SHL/SHR.

IMPORTANT: X IS CLEARED BY ADD AND SUB
======================================
ADD and SUB both clear the X register after completing their arithmetic.
Consequently, programs must not assume that X still contains an operand or
result after ADD or SUB.

For example:

TRA
RIN 3
SUB

leaves the subtraction result in ACC but X = 0. To use that result as the
next X operand, explicitly transfer it again:

TRA

CORE MEMORY ADDRESS AND INITIALISATION NOTATION
===============================================
For RIN and STO, a numeric first operand from 1 to 5 means the corresponding
core-memory word:

RIN 1
RIN 2
RIN 3
RIN 4
RIN 5
STO 1
STO 2
STO 3
STO 4
STO 5

The assembler automatically asserts C as well as the selected Core contact.
CORE1-CORE5 remain accepted as aliases.

A RIN with a second hexadecimal operand initialises the selected core:

RIN 1 0    initialise core 1 to 0000
RIN 2 5    initialise core 2 to 0101
RIN 3 1    initialise core 3 to 0001
RIN 4 A    initialise core 4 to 1010
RIN 5 F    initialise core 5 to 1111

The hexadecimal digit is an assembler convenience for the four physical
1-4 lines. In the book's octal drum notation these are contact bits rather
than a conventional binary or octal numeric field.

The same numbers retain instruction-specific meanings elsewhere:

SHL 3     shift three places
SHR 2     shift two places
JUP 1     search using marker/contact 1
COJ 4     conditionally search using marker/contact 4

ANS AND OPERATOR ATTENTION
==========================
ANS is a control contact, not a HALT instruction. In the simulator it means
that operator attention is required.

RIN B
    Read INPUT B immediately and continue.

RIN B ANS
    Light ANS and, in Run mode, pause before reading INPUT B. Change INPUT B
    and click Run again.

RUT UNITS ANS
    Write ACC[3:0] to UNITS, light ANS and pause Run for inspection.

Execution can continue after an ANS pause by clicking Run again.

DISPLAY (ACC)
=============
DISPLAY is a physical control contact used when the accumulator/extension
contents must be visible to the operator. The symbolic assembler automatically
adds DISPLAY to:

ADD  SUB  SHR  SHL  TRA  STO  RUT  COJ

It is not automatically added to:

RIN  JUP

When DISPLAY is active, lit ACCUMULATOR and EXTENSION lamps appear amber.
Otherwise they appear green. DISPLAY does not pause execution.

Literal 26-bit words are never changed by the assembler, so DISPLAY must be
set explicitly in a literal word when required.

ACCUMULATOR, X AND EXTENSION
============================
The ACCUMULATOR has five stages:

2^4/SIGN  2^3  2^2  2^1  2^0

The 2^4 stage represents carry after addition and sign/borrow after
subtraction. COJ tests this stage.

The four-stage EXTENSION register is connected to the accumulator for shifts:

ACCUMULATOR                     EXTENSION
2^4  2^3  2^2  2^1  2^0       E1 E2 E3 E4

SHL and SHR operate across this nine-stage path.

The X REGISTER is separate. TRA copies ACC[3:0] to X. ADD and SUB consume X
as the second operand and then clear X to zero.

ENCODER AND DECODER
===================
INPUT A and INPUT B each represent one four-bit value. The simulator accepts
exactly one hexadecimal character per encoder: 0-9 or A-F. Lowercase a-f is
normalised to uppercase; an empty or invalid value resolves to 0.

This hexadecimal extension goes slightly beyond the original decimal encoder,
but maps directly onto all sixteen possible four-bit values.

TENS and UNITS likewise display one hexadecimal digit each, 0-F, and
initialise to 0. Their names retain the original 10^1 and 10^0 control-contact
terminology.

RUT TENS
    Display ACC[3:0] as one hexadecimal digit in TENS.

RUT UNITS
    Display ACC[3:0] as one hexadecimal digit in UNITS.

RUT TENS UNITS
    Write the same hexadecimal digit to both positions.

Software can still use these positions to present a multi-digit decimal
result by calculating the decimal digits separately, as the Nim example does.

MARKERS AND JUMPS
=================
The architecture provides four shared marker/control contacts numbered 1-4.
The assembler exposes them directly instead of allocating conventional
symbolic labels.

A marker prefixes the drum word on which its contact is active:

1: RIN B ANS

The same marker may occur at several positions. A jump does not target a
unique address; it rolls the drum until it encounters the first matching
contact in its search direction.

JUP 1, JUP 2 and JUP 3 search forwards.
JUP 4 searches backwards.

COJ uses the same search directions when its condition is true. If COJ is not
taken, execution simply advances to the next drum position.

The current drum position remains selected while an instruction executes.
Ordinary instructions advance one position only after execution completes.
A taken JUP or COJ has already repositioned the drum, so there is no additional
advance afterwards.

A marker may be placed on a source line by itself:

3:
4: RIN 1

Here marker 3 remains pending and is added to the following RIN word, which
also carries marker 4. The two source lines therefore describe ONE drum
position, with both contacts active.

Because markers are physical contacts, a jump can also stop on a matching
1-4 contact used for another purpose, such as RIN core initialisation.

RAW 26-BIT DRUM WORDS
=====================
There are no BITS, WORD or NOP pseudo-instructions.

A source line containing exactly 26 binary digits is interpreted literally:

10000000001000000000000000

An explicit blank drum position is therefore:

00000000000000000000000000

Raw words are not modified by the assembler. Automatic C or DISPLAY contacts
are not added to them.

Blank positions beyond the assembled source remain on the full 65-position
drum. A blank word does nothing and advances. Position 65 wraps to position 1.

THE PROGRAM DRUM
================
Each simulated program word is a set of 26 independent, multi-hot contacts,
not a binary-encoded opcode plus operand.

Ten order contacts:

RIN ADD SUB SHR SHL TRA RUT STO COJ JUP

Sixteen address/control contacts:

A B C CORE1 CORE2 CORE3 CORE4 CORE5
1 2 3 4 DISPLAY 10^0 10^1 ANS

The PROGRAM panel shows order contacts in amber, address/control contacts in
blue and the complete 26-bit pattern.

For example:

STO 2

activates the physical STO, C, CORE2 and DISPLAY contacts.

Similarly:

RIN 2 5

activates RIN, C, CORE2, line 1 and line 3. The four data lines are therefore
visible in the actual 26-bit drum word and can also be encountered by a jump
search.

All 65 drum positions are shown. Unprogrammed positions contain no contacts.
Imagine the drum unrolled into a flat sheet. Each row is a program step and
each column corresponds to a wire/contact. Because these are independent
contacts, the operand/control section is not restricted to selecting exactly
one thing. A drum position can activate multiple control lines simultaneously.

The two timing tracks are excluded from the 26-bit instruction word.

        26 CONTACT TRACKS ACROSS THE DRUM
        R A S S S T R S C J A B C C C C C C 1 2 3 4 D 1 1 A
        I D U H H R U T O U       1 2 3 4 5         I 0 0 N
        N D B R L A T O J P                         S ^ ^ S
                                                    P 0 1

RIN A   X . . . . . . . . . X . . . . . . . . . . . . . . .
TRA     . . . . . X . . . . . . . . . . . . . . . . . . . .
RIN B   X . . . . . . . . . . X . . . . . . . . . . . . . .
ADD     . X . . . . . . . . . . . . . . . . . . . . . . . .
RUT     . . . . . . X . . . . . . . . . . . . . . . X . . .

MACHINE CONTROLS
================
Run
---
Runs continuously. Plain RIN A/B reads immediately. RIN A/B ANS pauses before
the read. RUT ... ANS pauses after readout.

Step
----
Executes one drum word immediately and does not perform the automatic
Run-mode pre-input pause.

Pause
-----
Stops automatic execution without changing state.

PC to 1
-------
Sets the program drum to position 1 while preserving encoder, decoder,
registers and core memory.

Reset all
---------
Resets PC, INPUT A/B, ACCUMULATOR, EXTENSION, X, TENS, UNITS, all five cores,
ANS and execution state to zero, and clears the execution trace.

If the program begins with RIN core-initialisation instructions, running again
from position 1 will reconstruct its programmed core values.

LIMITS AND IMPLEMENTATION NOTES
===============================
- Drum capacity: 65 positions.
- INPUT A/B: one hexadecimal digit, 0-F.
- TENS/UNITS: one hexadecimal digit each, 0-F.
- Core words and X: four bits, 0-15.
- ACC: four data stages plus 2^4/SIGN.
- EXTENSION: four stages connected to ACC for shifting.
- ADD and SUB clear X after arithmetic completes.
- SHL/SHR operate across the nine ACC/extension stages.
- COJ jumps when 2^4/SIGN is 1, not when ACC is zero.
- RIN/STO numeric core addresses are 1-5.
- RIN core initialisation accepts one hexadecimal data digit, 0-F.
- Markers are the physical contacts 1-4 and may be repeated.
- Markers 1-3 are searched forwards; marker 4 is searched backwards.
- A taken jump leaves the drum at the marker found; there is no extra PC
  increment after the jump.
- ANS means operator attention/pause; it is not HALT.
- There is no NOP instruction. A blank drum position simply does nothing.
- The simulator is a behavioural reconstruction of the manually operated
  architecture, not an electrical simulation of the paperclip circuitry.

TROUBLESHOOTING
===============
A program that previously worked now gives the wrong arithmetic result
-----------------------------------------------------------------------
Check whether it relied on X surviving ADD or SUB. Both instructions now clear
X. Insert TRA or reload the required value before the next arithmetic step.

A core-memory instruction does not assemble
-------------------------------------------
Use a numeric core address from 1 to 5:

RIN 3
STO 4

To initialise a core directly, add exactly one hexadecimal digit:

RIN 3 A

CORE1-CORE5 are also accepted as compatibility aliases.

Run pauses at RIN A or RIN B
----------------------------
Check whether the instruction includes ANS. RIN B ANS deliberately pauses
before the read. Plain RIN B should not pause.

Nim behaves incorrectly after Reset all
---------------------------------------
Reset all clears every core. With the revised Nim program, return to drum
position 1 and execute its five opening RIN initialisation instructions:

RIN 1 D
RIN 2 1
RIN 3 4
RIN 4 0
RIN 5 0

There is no need to restore the core lamps manually.

JUP or COJ reaches an unexpected position
-----------------------------------------
Remember that the four marker contacts may be repeated and are shared with
other operations. JUP/COJ stops at the FIRST matching contact encountered in
the relevant direction: forwards for 1-3 and backwards for 4. Check for an
intervening marker or a shared 1-4 contact in a RIN initialisation word,
particularly after a wrap-around search.

A marker does not consume the drum position I expected
------------------------------------------------------
A marker written alone applies to the next instruction and does not itself
consume a drum position. Thus:

3:
4: RIN 1

is one drum word carrying both marker 3 and marker 4.

A raw binary line fails to assemble
-----------------------------------
It must contain exactly 26 binary digits after comments are removed. Do not
prefix it with BITS.

Browser displays source rather than the simulator
-------------------------------------------------
Ensure the file has an .html extension and open it in a modern browser such
as Edge, Chrome, Firefox or Safari.
