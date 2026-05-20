const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://vhrmcfwlkjgepdcyhmnw.supabase.co', 'sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe');

const vlsiQuestions = [
  // EASY (1-30)
  { question: "What does VLSI stand for?", options: ["Very Large Scale Integration", "Very Low Scale Integration", "Virtual Large Scale Integration", "Variable Large Scale Integration"], correctIndex: 0, difficulty: "easy" },
  { question: "Who proposed Moore's Law?", options: ["Gordon Moore", "Steve Jobs", "Bill Gates", "Alan Turing"], correctIndex: 0, difficulty: "easy" },
  { question: "Moore's Law states that the number of transistors on a chip doubles approximately every:", options: ["12 months", "18-24 months", "5 years", "10 years"], correctIndex: 1, difficulty: "easy" },
  { question: "What is the primary material used in semiconductor manufacturing?", options: ["Silicon", "Copper", "Gold", "Aluminum"], correctIndex: 0, difficulty: "easy" },
  { question: "A PMOS transistor is ON when the gate voltage is:", options: ["High", "Low", "Zero", "Floating"], correctIndex: 1, difficulty: "easy" },
  { question: "An NMOS transistor is ON when the gate voltage is:", options: ["High", "Low", "Zero", "Floating"], correctIndex: 0, difficulty: "easy" },
  { question: "What are the three terminals of a MOSFET?", options: ["Source, Drain, Gate", "Emitter, Base, Collector", "Anode, Cathode, Gate", "Positive, Negative, Neutral"], correctIndex: 0, difficulty: "easy" },
  { question: "In a CMOS inverter, if the input is 1, the output is:", options: ["1", "0", "Z", "X"], correctIndex: 1, difficulty: "easy" },
  { question: "Which logic gate is known as a Universal Gate?", options: ["AND", "OR", "NAND", "XOR"], correctIndex: 2, difficulty: "easy" },
  { question: "What is the full form of RTL in VLSI?", options: ["Register Transfer Level", "Ready To Load", "Real Time Logic", "Reset Toggle Level"], correctIndex: 0, difficulty: "easy" },
  { question: "Which HDL is most commonly used in the US?", options: ["Verilog", "VHDL", "SystemC", "Python"], correctIndex: 0, difficulty: "easy" },
  { question: "A multiplexer with 4 inputs needs how many select lines?", options: ["1", "2", "3", "4"], correctIndex: 1, difficulty: "easy" },
  { question: "What is the boolean expression for an XOR gate with inputs A and B?", options: ["A + B", "A.B", "A'B + AB'", "A + B'"], correctIndex: 2, difficulty: "easy" },
  { question: "Which device is used to store 1 bit of data?", options: ["MUX", "Flip-Flop", "Encoder", "Decoder"], correctIndex: 1, difficulty: "easy" },
  { question: "What is the majority carrier in an N-type semiconductor?", options: ["Holes", "Electrons", "Protons", "Neutrons"], correctIndex: 1, difficulty: "easy" },
  { question: "CMOS stands for:", options: ["Complementary Metal-Oxide-Semiconductor", "Common Metal-Oxide-Semiconductor", "Complex Metal-Oxide-Semiconductor", "Condensed Metal-Oxide-Semiconductor"], correctIndex: 0, difficulty: "easy" },
  { question: "What is the threshold voltage (Vt)?", options: ["Minimum voltage to turn on a transistor", "Maximum voltage a chip can handle", "Average operating voltage", "Voltage at which leakage stops"], correctIndex: 0, difficulty: "easy" },
  { question: "Fan-out of a logic gate is defined as:", options: ["Number of inputs it can handle", "Number of gates it can drive", "Total power consumption", "Switching speed"], correctIndex: 1, difficulty: "easy" },
  { question: "What is the base of the Hexadecimal system?", options: ["2", "8", "10", "16"], correctIndex: 3, difficulty: "easy" },
  { question: "A 3-to-8 line decoder has how many select lines?", options: ["2", "3", "4", "8"], correctIndex: 1, difficulty: "easy" },
  { question: "Which logic family has the lowest power dissipation?", options: ["TTL", "ECL", "CMOS", "NMOS"], correctIndex: 2, difficulty: "easy" },
  { question: "What is the purpose of a testbench in Verilog?", options: ["To synthesize the design", "To simulate and verify the design", "To calculate power", "To perform floorplanning"], correctIndex: 1, difficulty: "easy" },
  { question: "Propagation delay is defined as:", options: ["Time for output to change after input change", "Time to manufacture a chip", "Time between clock cycles", "Time for a signal to reach the moon"], correctIndex: 0, difficulty: "easy" },
  { question: "What does GDSII stand for?", options: ["Graphic Data System II", "General Design Standard II", "Global Device System II", "Graph Design Specification II"], correctIndex: 0, difficulty: "easy" },
  { question: "A half-adder adds how many bits?", options: ["1", "2", "3", "4"], correctIndex: 1, difficulty: "easy" },
  { question: "What is the main advantage of CMOS over TTL?", options: ["Higher speed", "Lower static power consumption", "Better heat resistance", "Simpler fabrication"], correctIndex: 1, difficulty: "easy" },
  { question: "Which terminal is usually connected to the body (bulk) in NMOS?", options: ["VDD", "VSS / Ground", "Input", "Output"], correctIndex: 1, difficulty: "easy" },
  { question: "What is a 'net' in Verilog?", options: ["A storage element", "A physical connection", "A software loop", "A memory bank"], correctIndex: 1, difficulty: "easy" },
  { question: "How many entries are there in a truth table for 3 variables?", options: ["3", "6", "8", "9"], correctIndex: 2, difficulty: "easy" },
  { question: "What is the full form of EDA?", options: ["Electronic Design Automation", "Electric Device Analysis", "Efficient Design Architecture", "Engineering Data Application"], correctIndex: 0, difficulty: "easy" },

  // MEDIUM (31-70)
  { question: "Which effect causes a decrease in threshold voltage as channel length decreases?", options: ["Body Effect", "Short Channel Effect (SCE)", "Channel Length Modulation", "Velocity Saturation"], correctIndex: 1, difficulty: "medium" },
  { question: "What is the purpose of Clock Tree Synthesis (CTS)?", options: ["To increase clock speed", "To minimize clock skew and latency", "To reduce total power", "To generate the clock signal"], correctIndex: 1, difficulty: "medium" },
  { question: "In Static Timing Analysis (STA), what is 'Setup Time'?", options: ["Time before clock edge that data must be stable", "Time after clock edge that data must be stable", "Total time to power up the chip", "Time to reset the flip-flops"], correctIndex: 0, difficulty: "medium" },
  { question: "What does 'Hold Time' violation mean?", options: ["Data changes too fast after clock edge", "Data changes too slow before clock edge", "Clock is too slow", "Power is too low"], correctIndex: 0, difficulty: "medium" },
  { question: "Which tool is commonly used for Physical Verification (DRC/LVS)?", options: ["Design Compiler", "Calibre", "PrimeTime", "VCS"], correctIndex: 1, difficulty: "medium" },
  { question: "What is the main purpose of 'Floorplanning'?", options: ["To define chip area and block placement", "To route all signal wires", "To perform timing signoff", "To generate GDSII"], correctIndex: 0, difficulty: "medium" },
  { question: "What is 'Electromigration'?", options: ["Movement of atoms in a conductor due to high current density", "Movement of electrons in a vacuum", "Movement of holes in P-type material", "Scaling of transistors"], correctIndex: 0, difficulty: "medium" },
  { question: "Which Verilog keyword is used for sequential logic?", options: ["assign", "always", "initial", "wire"], correctIndex: 1, difficulty: "medium" },
  { question: "What is a 'Blocking Assignment' in Verilog?", options: ["=", "<=", "==", "!="], correctIndex: 0, difficulty: "medium" },
  { question: "What is 'Clock Gating' used for?", options: ["Increasing speed", "Reducing dynamic power", "Reducing static power", "Minimizing area"], correctIndex: 1, difficulty: "medium" },
  { question: "What is 'Multi-Vt' design?", options: ["Using transistors with different threshold voltages", "Using different supply voltages", "Using multiple clock frequencies", "Using multiple layers of metal"], correctIndex: 0, difficulty: "medium" },
  { question: "Static Power is primarily caused by:", options: ["Capacitive switching", "Leakage currents", "Short circuit current", "Resistance of wires"], correctIndex: 1, difficulty: "medium" },
  { question: "What is 'LVS' in physical design?", options: ["Layout Vs Schematic", "Logic Via Silicon", "Linear Voltage Source", "Logic Verification System"], correctIndex: 0, difficulty: "medium" },
  { question: "What is 'DRC'?", options: ["Design Rule Check", "Data Rate Control", "Device Resistance Calculation", "Digital Routing Compiler"], correctIndex: 0, difficulty: "medium" },
  { question: "Which layer in a chip is used for global power routing?", options: ["Poly-silicon", "Local Metal (M1)", "Top Metal (Global)", "Diffusion"], correctIndex: 2, difficulty: "medium" },
  { question: "What is 'Antenna Effect' during fabrication?", options: ["Signal interference", "Charge accumulation on metal wires during plasma etching", "Wireless connectivity issue", "Heat dissipation problem"], correctIndex: 1, difficulty: "medium" },
  { question: "The 'Noise Margin' of a CMOS gate represents:", options: ["The power of the noise", "Tolerance of the gate to input noise", "The speed of signal", "The area of the gate"], correctIndex: 1, difficulty: "medium" },
  { question: "What is a 'Standard Cell'?", options: ["A reusable logic block with fixed height", "A battery used in testing", "A memory cell", "A pad on the chip"], correctIndex: 0, difficulty: "medium" },
  { question: "What is 'Logical Effort'?", options: ["A method to estimate delay in logic circuits", "The amount of logic in a chip", "The power consumed by logic", "The time to write code"], correctIndex: 0, difficulty: "medium" },
  { question: "Which type of flip-flop is usually used in scan chains for DFT?", options: ["JK Flip-Flop", "Mux-D Flip-Flop", "SR Flip-Flop", "T Flip-Flop"], correctIndex: 1, difficulty: "medium" },
  { question: "What is 'Stuck-at' fault model?", options: ["Signal is stuck at 0 or 1", "Transistor is stuck in off state", "Chip is stuck in reset", "Signal is stuck in transition"], correctIndex: 0, difficulty: "medium" },
  { question: "What is 'BIST'?", options: ["Built-In Self Test", "Binary Integrated System Tool", "Basic Interface Speed Test", "Bit Integrity Scan Technique"], correctIndex: 0, difficulty: "medium" },
  { question: "What does 'Tapeout' mean?", options: ["Final design release for manufacturing", "Applying tape to the chip", "Measuring the chip area", "Testing the chip after fabrication"], correctIndex: 0, difficulty: "medium" },
  { question: "Which tool is used for Logic Synthesis?", options: ["Design Compiler", "Virtuoso", "PrimeTime", "Calibre"], correctIndex: 0, difficulty: "medium" },
  { question: "In a Moore machine, the output depends on:", options: ["Current state only", "Current state and current input", "Current input only", "Previous input only"], correctIndex: 0, difficulty: "medium" },
  { question: "In a Mealy machine, the output depends on:", options: ["Current state only", "Current state and current input", "Current input only", "Previous input only"], correctIndex: 1, difficulty: "medium" },
  { question: "What is 'Elmore Delay'?", options: ["A model for estimating RC interconnect delay", "A type of clock jitter", "Delay in fabrication", "Delay in signal propagation through space"], correctIndex: 0, difficulty: "medium" },
  { question: "What is 'Interconnect Scaling'?", options: ["Making wires thinner and closer together", "Making transistors larger", "Adding more metal layers", "Reducing the number of pins"], correctIndex: 0, difficulty: "medium" },
  { question: "Which effect causes leakage even when Vgs = 0?", options: ["Sub-threshold leakage", "Gate oxide leakage", "Drain-induced barrier lowering (DIBL)", "Punch-through"], correctIndex: 0, difficulty: "medium" },
  { question: "What is the purpose of 'Filler Cells'?", options: ["To fill empty spaces and ensure N-well continuity", "To add more logic", "To increase power", "To store data"], correctIndex: 0, difficulty: "medium" },
  { question: "What is 'Tie-High' and 'Tie-Low' cells?", options: ["Cells to connect signals to VDD or VSS safely", "Cells to speed up the chip", "Cells for testing", "Cells for IO"], correctIndex: 0, difficulty: "medium" },
  { question: "What is 'Double Patterning'?", options: ["A lithography technique to print features below the limit", "Printing the chip twice", "Using two layers of silicon", "Testing the chip twice"], correctIndex: 0, difficulty: "medium" },
  { question: "Which tool is used for Static Timing Analysis (STA)?", options: ["PrimeTime", "VCS", "Design Compiler", "ICC2"], correctIndex: 0, difficulty: "medium" },
  { question: "What is 'Negative Slack' in timing?", options: ["Timing violation (Setup or Hold)", "Good timing margin", "The clock is negative", "The power is negative"], correctIndex: 0, difficulty: "medium" },
  { question: "What is 'Crosstalk' in VLSI?", options: ["Interference between adjacent signal wires", "Talking between designers", "Communication between chips", "Software bug"], correctIndex: 0, difficulty: "medium" },
  { question: "What is 'Filler Cap' cells?", options: ["Cells with decoupling capacitors to reduce power noise", "Cells that store data", "Cells that fill area", "Cells for testing"], correctIndex: 0, difficulty: "medium" },
  { question: "What is 'OCV'?", options: ["On-Chip Variation", "Outer Circuit Verification", "Open Circuit Voltage", "Operational Cell Variety"], correctIndex: 0, difficulty: "medium" },
  { question: "Which parameter increases significantly with FinFETs compared to Planar FETs?", options: ["Drive current (Ion)", "Gate leakage", "Sub-threshold swing", "Chip area"], correctIndex: 0, difficulty: "medium" },
  { question: "What is 'MTBF' in terms of metastability?", options: ["Mean Time Between Failures", "Maximum Time Before Failure", "Minimum Time between Flip-flops", "Many Tools Build Failures"], correctIndex: 0, difficulty: "medium" },
  { question: "What is 'Synchronizer' used for?", options: ["Transferring signals between different clock domains", "Generating the clock", "Reducing power", "Increasing speed"], correctIndex: 0, difficulty: "medium" },

  // HARD (71-100)
  { question: "What is 'Drain-Induced Barrier Lowering' (DIBL)?", options: ["Drain voltage lowering the source-channel barrier", "Source voltage increasing", "Gate voltage failing", "Channel getting longer"], correctIndex: 0, difficulty: "hard" },
  { question: "Which effect is responsible for 'Velocity Saturation'?", options: ["High longitudinal electric field", "High vertical electric field", "Low temperature", "Small gate oxide thickness"], correctIndex: 0, difficulty: "hard" },
  { question: "What is 'Gate-Induced Drain Leakage' (GIDL)?", options: ["Leakage in the overlap region of gate and drain", "Leakage through the gate oxide", "Leakage from source to drain", "Leakage to the bulk"], correctIndex: 0, difficulty: "hard" },
  { question: "In FinFET, what is the 'Effective Width' (Weff) of a single fin?", options: ["2 * Fin Height + Fin Width", "Fin Height + Fin Width", "2 * Fin Height", "Fin Width"], correctIndex: 0, difficulty: "hard" },
  { question: "What is 'NBTI' (Negative Bias Temperature Instability)?", options: ["Degradation of PMOS Vt over time at high temperature", "Cooling of the chip", "Speeding up of the chip", "NMOS threshold shift"], correctIndex: 0, difficulty: "hard" },
  { question: "What is 'HCI' (Hot Carrier Injection)?", options: ["High energy carriers damaging the Si-SiO2 interface", "Injecting heat into the chip", "Speeding up the electrons", "Scaling the gate oxide"], correctIndex: 0, difficulty: "hard" },
  { question: "What is 'Multi-Patterning' in 7nm and below nodes?", options: ["Using multiple masks to print one layer", "Printing multiple chips at once", "Using multiple colors on the chip", "Designing multiple chips"], correctIndex: 0, difficulty: "hard" },
  { question: "What is 'EUV' Lithography?", options: ["Extreme Ultra Violet Lithography", "Extra Ultra Vision", "Efficient Universal Verification", "Electronic Utility Vault"], correctIndex: 0, difficulty: "hard" },
  { question: "What is 'UVM' in verification?", options: ["Universal Verification Methodology", "Unified Verification Machine", "Ultimate Variable Method", "User Verified Metadata"], correctIndex: 0, difficulty: "hard" },
  { question: "Which coverage metric is used to ensure every line of code is executed?", options: ["Statement Coverage", "Branch Coverage", "Toggle Coverage", "Functional Coverage"], correctIndex: 0, difficulty: "hard" },
  { question: "What is 'Functional Coverage'?", options: ["Measuring if all specified features are exercised", "Measuring if all lines are executed", "Measuring if all gates switched", "Measuring if the chip works"], correctIndex: 0, difficulty: "hard" },
  { question: "What is 'Constrained Random Verification'?", options: ["Generating random stimulus within specific constraints", "Randomly testing the chip", "Testing without rules", "Testing only specific cases"], correctIndex: 0, difficulty: "hard" },
  { question: "What is 'Formal Verification'?", options: ["Using mathematical proofs to verify design properties", "Testing in a formal suit", "Using a formal language", "Testing with a customer present"], correctIndex: 0, difficulty: "hard" },
  { question: "What is 'Clock Skew'?", options: ["Difference in arrival time of clock at different registers", "The clock frequency", "The clock duty cycle", "The clock power"], correctIndex: 0, difficulty: "hard" },
  { question: "What is 'Clock Jitter'?", options: ["Cycle-to-cycle variation in clock period", "Difference between clock edges", "Noise in the clock wire", "The clock being too fast"], correctIndex: 0, difficulty: "hard" },
  { question: "What is 'Slew Rate' in digital signals?", options: ["Rate of change of voltage with respect to time", "The speed of the clock", "The number of gates", "The power consumed"], correctIndex: 0, difficulty: "hard" },
  { question: "What is 'IR Drop'?", options: ["Voltage drop across the power distribution network", "Dropping the infrared sensor", "Drop in current", "Drop in yield"], correctIndex: 0, difficulty: "hard" },
  { question: "What is 'EMC' in chip design?", options: ["Electromagnetic Compatibility", "Electronic Machine Control", "Efficient Metal Connection", "Extracted Model Calculation"], correctIndex: 0, difficulty: "hard" },
  { question: "What is 'DFT' insertion?", options: ["Design For Testability", "Digital Flow Transition", "Data File Transfer", "Design Function Toggle"], correctIndex: 0, difficulty: "hard" },
  { question: "What is 'ATPG'?", options: ["Automatic Test Pattern Generation", "Advanced Timing Power Generator", "Automatic Toggle Power Grid", "All-Test Pattern Group"], correctIndex: 0, difficulty: "hard" },
  { question: "What is 'Boundary Scan' (JTAG)?", options: ["Testing IO pins and interconnects between chips", "Scanning the chip boundaries", "Testing the memory", "Scanning the GDSII"], correctIndex: 0, difficulty: "hard" },
  { question: "What is 'Yield' in semiconductor manufacturing?", options: ["Percentage of good chips on a wafer", "Total number of chips", "Speed of manufacturing", "Power efficiency"], correctIndex: 0, difficulty: "hard" },
  { question: "What is 'OPC' (Optical Proximity Correction)?", options: ["Modifying layout features to compensate for lithography effects", "Correcting the optical sensor", "Using better glasses for designers", "Changing the mask color"], correctIndex: 0, difficulty: "hard" },
  { question: "What is 'CMP' (Chemical Mechanical Polishing)?", options: ["Process to flatten the wafer surface during fabrication", "Polishing the chip manually", "Cleaning the chip with water", "A type of design tool"], correctIndex: 0, difficulty: "hard" },
  { question: "What is 'STI' (Shallow Trench Isolation)?", options: ["Process to isolate adjacent transistors", "A type of memory", "A type of transistor", "A layout rule"], correctIndex: 0, difficulty: "hard" },
  { question: "What is 'Well Proximity Effect' (WPE)?", options: ["Threshold voltage shift due to distance from N-well edge", "Transistors being too close", "N-well being too deep", "Heat from the well"], correctIndex: 0, difficulty: "hard" },
  { question: "What is 'LOD' (Layout Dependent Effect)?", options: ["Performance variation based on transistor surroundings", "Logic On Demand", "Layout Of Devices", "Linear Operational Delay"], correctIndex: 0, difficulty: "hard" },
  { question: "What is 'FinFET' quantization?", options: ["Width can only be increased by adding integer number of fins", "Quantizing the signal", "Making the fins smaller", "Reducing power"], correctIndex: 0, difficulty: "hard" },
  { question: "What is 'Power Integrity' (PI)?", options: ["Ensuring stable supply voltage to all transistors", "Keeping the power high", "Honesty in power reporting", "Saving power"], correctIndex: 0, difficulty: "hard" },
  { question: "What is 'Signal Integrity' (SI)?", options: ["Ensuring signals are not distorted or corrupted during transmission", "Honesty in signal reporting", "Speed of signal", "Area of signal"], correctIndex: 0, difficulty: "hard" }
];

async function seed() {
  console.log("Seeding 100 VLSI Questions into questionnaires table...");
  
  const vlsiQuestionnaire = {
    title: 'VLSI Course Question Bank',
    description: 'A massive bank of 100 VLSI questions categorized by difficulty. Used for dynamic game generation.',
    target_role: 'STUDENT',
    is_active: true,
    questions: [
      {
        step: 1,
        title: "VLSI Technical Questions",
        questions: vlsiQuestions
      }
    ]
  };

  const { data, error } = await supabase.from('questionnaires').insert([vlsiQuestionnaire]).select();
  
  if (error) {
    console.error("Error seeding VLSI questionnaire:", error);
  } else {
    console.log("Successfully seeded 100 VLSI questions into questionnaires!");
    console.log("Questionnaire ID:", data[0].id);
  }
}

seed();
