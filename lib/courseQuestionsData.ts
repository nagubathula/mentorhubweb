export const COURSE_QUESTIONS: Record<string, { question: string; options: string[]; correct: string }> = {
  // ==========================================
  // 1. DATA ANALYTICS
  // ==========================================
  "What is Data Analytics?": {
    question: "Which of the following best defines the primary goal of Data Analytics?",
    options: [
      "Analyzing raw data to discover patterns, draw conclusions, and support decision-making",
      "Designing beautiful graphical layouts for mobile applications",
      "Writing backend database servers from scratch",
      "Configuring hardware routers and network switches"
    ],
    correct: "Analyzing raw data to discover patterns, draw conclusions, and support decision-making"
  },
  "Types of Analytics: Descriptive to Prescriptive": {
    question: "What is the primary objective of 'Prescriptive Analytics'?",
    options: [
      "Recommending specific actions to take based on analytics models",
      "Describing what happened in the past historically",
      "Predicting future trends and possibilities",
      "Explaining why a particular failure occurred"
    ],
    correct: "Recommending specific actions to take based on analytics models"
  },
  "Analytics Lifecycle & Workflow": {
    question: "Which stage typically comes first in the Data Analytics Lifecycle?",
    options: [
      "Understanding business requirements and goals",
      "Cleaning and formatting dirty data",
      "Deploying machine learning models to production",
      "Creating final storytelling dashboards"
    ],
    correct: "Understanding business requirements and goals"
  },
  "Data Sources & Collection Methods": {
    question: "Which of the following is considered a primary data collection source?",
    options: [
      "Direct customer surveys and sensor outputs",
      "Historical data downloaded from third-party blogs",
      "A cached static image file",
      "A local web browser styling sheet"
    ],
    correct: "Direct customer surveys and sensor outputs"
  },
  "Handling Missing Data": {
    question: "In Python Pandas, what is 'Imputation'?",
    options: [
      "Replacing missing NaN values with statistical estimates like mean, median, or mode",
      "Deleting all rows that have any missing values instantly",
      "Ignoring the missing data and letting calculations error out",
      "Converting floating-point numbers into string text"
    ],
    correct: "Replacing missing NaN values with statistical estimates like mean, median, or mode"
  },
  "Data Cleaning with Pandas": {
    question: "Which Pandas function is most commonly used to remove duplicate rows from a DataFrame?",
    options: [
      "drop_duplicates()",
      "remove_duplicates()",
      "delete_copied_rows()",
      "clean_unique()"
    ],
    correct: "drop_duplicates()"
  },
  "Data Validation Techniques": {
    question: "What is the main goal of Data Validation?",
    options: [
      "Ensuring the data meets quality constraints, schemas, and structural rules",
      "Making sure the data occupies minimal disk space",
      "Encrypting all columns so users cannot see them",
      "Automatically backing up the database every hour"
    ],
    correct: "Ensuring the data meets quality constraints, schemas, and structural rules"
  },
  "Summary Statistics & Distributions": {
    question: "Which statistical metric measures the central tendency of a skewed dataset most reliably?",
    options: [
      "Median",
      "Mean",
      "Standard Deviation",
      "Range"
    ],
    correct: "Median"
  },
  "Correlation & Relationships": {
    question: "What does a Pearson correlation coefficient of -0.9 indicate?",
    options: [
      "A strong negative linear relationship between two variables",
      "No relationship whatsoever between the variables",
      "A weak positive relationship between the variables",
      "A syntax error in our correlation formula"
    ],
    correct: "A strong negative linear relationship between two variables"
  },
  "EDA with Python — Hands-on": {
    question: "Which visualization tool is best suited for showing the distribution and outliers of a single numerical variable?",
    options: [
      "Box Plot (box-and-whisker plot)",
      "Pie Chart",
      "Line Chart",
      "Network Node Diagram"
    ],
    correct: "Box Plot (box-and-whisker plot)"
  },
  "SQL Basics: SELECT, WHERE, JOIN": {
    question: "Which SQL JOIN returns all rows from the left table, and the matched rows from the right table?",
    options: [
      "LEFT JOIN",
      "RIGHT JOIN",
      "INNER JOIN",
      "FULL JOIN"
    ],
    correct: "LEFT JOIN"
  },
  "Aggregations & GROUP BY": {
    question: "Which clause is used in SQL to filter aggregate results (like SUM or AVG)?",
    options: [
      "HAVING",
      "WHERE",
      "FILTER BY",
      "LIMIT"
    ],
    correct: "HAVING"
  },
  "Subqueries & CTEs": {
    question: "What does CTE stand for in SQL databases?",
    options: [
      "Common Table Expression",
      "Central Table Entity",
      "Correlated Transaction Event",
      "Custom Temporary Engine"
    ],
    correct: "Common Table Expression"
  },
  "Window Functions": {
    question: "Which window function assigns a unique sequential integer to rows within a partition?",
    options: [
      "ROW_NUMBER()",
      "RANK()",
      "DENSE_RANK()",
      "LEAD()"
    ],
    correct: "ROW_NUMBER()"
  },
  "Visualization Principles": {
    question: "What is a core principle of effective data storytelling and visual design?",
    options: [
      "Reducing visual clutter to maximize the data-ink ratio",
      "Using as many bright colors as possible on one chart",
      "Adding complex 3D perspective grids to all bars",
      "Removing all titles and legend keys to keep it mysterious"
    ],
    correct: "Reducing visual clutter to maximize the data-ink ratio"
  },
  "Matplotlib & Seaborn": {
    question: "Which high-level Python library is built on top of Matplotlib and integrates closely with Pandas DataFrames?",
    options: [
      "Seaborn",
      "NumPy",
      "Scikit-Learn",
      "BeautifulSoup"
    ],
    correct: "Seaborn"
  },
  "Interactive Dashboards with Plotly": {
    question: "What is a key benefit of using Plotly over static matplotlib charts?",
    options: [
      "Enabling users to hover, zoom, and filter data directly inside the browser",
      "Generating charts that load significantly slower",
      "Requiring custom operating system drivers to render",
      "Using only black and white colors"
    ],
    correct: "Enabling users to hover, zoom, and filter data directly inside the browser"
  },
  "Storytelling with Data": {
    question: "When presenting data insights to business executives, what is the best strategy?",
    options: [
      "Starting with the core insight and business recommendation first (the 'So What?')",
      "Showing all 100 pages of raw SQL scripts",
      "Using deep technical statistics terminology with no translation",
      "Letting the audience guess what the chart shows"
    ],
    correct: "Starting with the core insight and business recommendation first (the 'So What?')"
  },
  "Probability & Distributions": {
    question: "What is a key feature of a Normal (Gaussian) Distribution?",
    options: [
      "It is a symmetrical bell-shaped curve where mean, median, and mode are equal",
      "It is completely flat and has no peak",
      "It is highly skewed to the left with multiple modes",
      "It represents only discrete integer counts"
    ],
    correct: "It is a symmetrical bell-shaped curve where mean, median, and mode are equal"
  },
  "Hypothesis Testing": {
    question: "What does the 'p-value' represent in statistical hypothesis testing?",
    options: [
      "The probability of obtaining results as extreme as observed, assuming the null hypothesis is true",
      "The probability that the alternate hypothesis is 100% correct",
      "The percentage of missing data inside the sample size",
      "The absolute value of the population mean"
    ],
    correct: "The probability of obtaining results as extreme as observed, assuming the null hypothesis is true"
  },
  "A/B Testing in Practice": {
    question: "Why is randomization critical when assigning users to version A and version B in a trial?",
    options: [
      "To prevent selection bias and distribute confounding variables equally",
      "To ensure all users end up preferring version B",
      "To make the tracking script run faster",
      "To show random colors on the screen"
    ],
    correct: "To prevent selection bias and distribute confounding variables equally"
  },
  "Regression Models": {
    question: "What is the primary target of a 'Linear Regression' model?",
    options: [
      "Predicting a continuous numerical value",
      "Classifying an image into distinct category labels",
      "Grouping similar users into unsupervised clusters",
      "Compressing file sizes for database storage"
    ],
    correct: "Predicting a continuous numerical value"
  },
  "Classification Basics": {
    question: "Which of the following is a classic classification task?",
    options: [
      "Determining if an email is 'Spam' or 'Not Spam'",
      "Predicting tomorrow's exact stock price in dollars",
      "Finding the average house price in a city",
      "Calculating the exact runtime of a script"
    ],
    correct: "Determining if an email is 'Spam' or 'Not Spam'"
  },
  "Build a Prediction Model": {
    question: "Which metric is commonly used to evaluate the accuracy of a classification model?",
    options: [
      "F1-Score (Precision and Recall)",
      "Mean Squared Error (MSE)",
      "R-Squared (Coefficient of Determination)",
      "Adjusted R-Squared"
    ],
    correct: "F1-Score (Precision and Recall)"
  },
  "Advanced Formulas & Functions": {
    question: "Which Excel formula is designed to perform flexible lookup queries across any column index?",
    options: [
      "XLOOKUP",
      "VLOOKUP",
      "HLOOKUP",
      "FIND_COL"
    ],
    correct: "XLOOKUP"
  },
  "Pivot Tables & Power Query": {
    question: "What is the primary purpose of Excel's Power Query tool?",
    options: [
      "Extracting, transforming, and loading (ETL) data from external files",
      "Applying font formatting styles to cell boundaries",
      "Sending direct emails to coworkers",
      "Generating random numbers for password keys"
    ],
    correct: "Extracting, transforming, and loading (ETL) data from external files"
  },
  "Dashboard Building in Excel": {
    question: "Which Excel visual feature acts as an interactive button slider to filter Pivot Tables dynamically?",
    options: [
      "Slicers",
      "Sparklines",
      "Data Bars",
      "Formulas"
    ],
    correct: "Slicers"
  },
  "Intro to Tableau": {
    question: "In Tableau, what is the key difference between a Dimension and a Measure?",
    options: [
      "Dimensions are qualitative attributes, while Measures are numerical values that can be aggregated",
      "Dimensions are local variables, while Measures are global database tables",
      "Dimensions are styling sheets, while Measures are filtering menus",
      "There is no difference between them"
    ],
    correct: "Dimensions are qualitative attributes, while Measures are numerical values that can be aggregated"
  },
  "Power BI Fundamentals": {
    question: "What is the primary language used to write custom metrics and calculations in Power BI?",
    options: [
      "DAX (Data Analysis Expressions)",
      "Python Scripting",
      "SQL Select Query",
      "HTML Styling"
    ],
    correct: "DAX (Data Analysis Expressions)"
  },
  "Build a BI Dashboard": {
    question: "What does 'Data Modeling' in Power BI focus on establishing?",
    options: [
      "Relationships between different data tables to allow accurate visual interactions",
      "The color themes used for dashboards and graphs",
      "Converting CSV files into Excel spreadsheets",
      "Creating artificial user feedback profiles"
    ],
    correct: "Relationships between different data tables to allow accurate visual interactions"
  },

  // ==========================================
  // 2. VLSI DESIGN
  // ==========================================
  "History & Evolution of VLSI": {
    question: "What does 'Moore's Law' predict in VLSI history?",
    options: [
      "The number of transistors on a microchip doubles roughly every two years",
      "Software compilers become twice as fast every year",
      "Static power consumption drops to zero over time",
      "Semiconductor silicon is replaced by copper completely"
    ],
    correct: "The number of transistors on a microchip doubles roughly every two years"
  },
  "VLSI Design Flow Overview": {
    question: "In standard VLSI design flows, which phase directly follows RTL coding?",
    options: [
      "Logic Synthesis",
      "GDSII Tapeout",
      "Physical Placement",
      "Floorplanning"
    ],
    correct: "Logic Synthesis"
  },
  "Semiconductor Fundamentals": {
    question: "Which charge carriers dominate current flow in an N-type semiconductor?",
    options: [
      "Free Electrons",
      "Valence Holes",
      "Neutrons",
      "Positive Ions"
    ],
    correct: "Free Electrons"
  },
  "CMOS Technology Basics": {
    question: "Why is CMOS technology preferred over pure NMOS or PMOS designs?",
    options: [
      "It dissipates virtually zero static power during stable logic states",
      "It operates without any supply voltage",
      "It completely eliminates dynamic gate capacitance",
      "It requires no silicon substrate"
    ],
    correct: "It dissipates virtually zero static power during stable logic states"
  },
  "Boolean Algebra & Gates": {
    question: "According to De Morgan's Laws, what is equivalent to NOT(A AND B)?",
    options: [
      "(NOT A) OR (NOT B)",
      "(NOT A) AND (NOT B)",
      "A OR B",
      "NOT A"
    ],
    correct: "(NOT A) OR (NOT B)"
  },
  "Combinational Circuits": {
    question: "Which of the following is a classic combinational circuit?",
    options: [
      "Multiplexer (MUX)",
      "D Flip-Flop",
      "Shift Register",
      "SRAM Memory Cell"
    ],
    correct: "Multiplexer (MUX)"
  },
  "Sequential Circuits & Flip-Flops": {
    question: "What is the primary difference between a Latch and a Flip-Flop?",
    options: [
      "Latches are level-sensitive, while Flip-Flops are edge-triggered",
      "Latches store multiple bits, while Flip-Flops store only one",
      "Flip-Flops consume no dynamic clock power",
      "Latches are always synchronous"
    ],
    correct: "Latches are level-sensitive, while Flip-Flops are edge-triggered"
  },
  "Finite State Machines": {
    question: "What differentiates a Mealy state machine from a Moore state machine?",
    options: [
      "A Mealy machine's outputs depend on both current state and inputs, while Moore's depend only on current state",
      "A Mealy machine has no state registers",
      "A Moore machine responds faster to clock edges",
      "A Mealy machine is always asynchronous"
    ],
    correct: "A Mealy machine's outputs depend on both current state and inputs, while Moore's depend only on current state"
  },
  "Verilog Syntax & Data Types": {
    question: "Which data type in Verilog represents a physical connection wire that does not store values?",
    options: [
      "wire",
      "reg",
      "integer",
      "real"
    ],
    correct: "wire"
  },
  "Modules & Port Mapping": {
    question: "When instantiating a module in Verilog, what is the safest connection method?",
    options: [
      "Named port connection (e.g., .port_name(signal))",
      "Ordered positional connection",
      "Leaving all ports completely disconnected",
      "Connecting all inputs to the system clock"
    ],
    correct: "Named port connection (e.g., .port_name(signal))"
  },
  "Behavioral vs Structural Modeling": {
    question: "Which modeling style in Verilog uses 'always' blocks and procedural assignments?",
    options: [
      "Behavioral Modeling",
      "Structural Modeling",
      "Gate-Level Modeling",
      "Switch-Level Modeling"
    ],
    correct: "Behavioral Modeling"
  },
  "Testbench Writing": {
    question: "Which Verilog statement is used in testbenches to stop simulation runtimes?",
    options: [
      "$finish",
      "$stop",
      "end",
      "disable"
    ],
    correct: "$finish"
  },
  "RTL Coding Guidelines": {
    question: "Why should you avoid generating 'unintentional latches' in RTL code?",
    options: [
      "They complicate static timing analysis and cause race conditions",
      "They increase silicon chip area by 10x",
      "They block register transfer logic compiles",
      "They convert digital circuits into analog"
    ],
    correct: "They complicate static timing analysis and cause race conditions"
  },
  "Synthesis Flow & Tools": {
    question: "What is the primary input to a logic synthesis tool?",
    options: [
      "RTL code and technology standard cell libraries",
      "Layout GDSII file",
      "Finished silicon wafer",
      "System testbench files"
    ],
    correct: "RTL code and technology standard cell libraries"
  },
  "Timing Constraints & STA": {
    question: "What does Static Timing Analysis (STA) primarily verify?",
    options: [
      "Setup and hold timing requirements across all paths without dynamic simulation",
      "The exact software execution speed",
      "Analog DC bias points",
      "Power gating leakage ratios"
    ],
    correct: "Setup and hold timing requirements across all paths without dynamic simulation"
  },
  "Floorplanning & Power Planning": {
    question: "What is the primary goal of floorplanning in physical design?",
    options: [
      "Determining the core aspect ratio, placement of macros, and I/O pads",
      "Writing logic gates in Verilog",
      "Performing dynamic thermal stress simulations",
      "Optimizing the software compiler speeds"
    ],
    correct: "Determining the core aspect ratio, placement of macros, and I/O pads"
  },
  "Placement & Optimization": {
    question: "During placement, what is standard practice?",
    options: [
      "Placing standard cells inside standard rows while avoiding overlaps",
      "Arranging transistors by hand one by one",
      "Creating manual power grids around each cell",
      "Disconnecting timing-critical wires"
    ],
    correct: "Placing standard cells inside standard rows while avoiding overlaps"
  },
  "Clock Tree Synthesis (CTS)": {
    question: "What is the primary objective of Clock Tree Synthesis?",
    options: [
      "Minimizing clock skew and delay across all register endpoints",
      "Generating high-frequency carrier waves",
      "Routing signal wires in standard cells",
      "Disabling clocks to save static leakage power"
    ],
    correct: "Minimizing clock skew and delay across all register endpoints"
  },
  "Routing & DRC/LVS": {
    question: "What does 'LVS' verify in physical design signoff?",
    options: [
      "Layout Versus Schematic compatibility",
      "Logic Validation Speed",
      "Leakage Voltage Status",
      "Logical Variable Synthesis"
    ],
    correct: "Layout Versus Schematic compatibility"
  },
  "Verification Planning": {
    question: "What is the primary benefit of creating a structured Verification Plan?",
    options: [
      "Defining clear coverage goals, test scenarios, and verification metrics beforehand",
      "Automatically fixing code syntax bugs",
      "Increasing the transistor density",
      "Reducing static power leakage"
    ],
    correct: "Defining clear coverage goals, test scenarios, and verification metrics beforehand"
  },
  "SystemVerilog for Verification": {
    question: "Which SystemVerilog feature enables object-oriented verification testbenches?",
    options: [
      "Classes and interfaces",
      "Always blocks and registers",
      "Gate-level wire connections",
      "Structural netlists"
    ],
    correct: "Classes and interfaces"
  },
  "UVM Framework Basics": {
    question: "What are the primary structural components of a standard UVM Agent?",
    options: [
      "Sequencer, Driver, and Monitor",
      "Compiler, Linker, and Debugger",
      "Transistor, Capacitor, and Resistor",
      "Multiplexer, Flip-Flop, and Logic Gate"
    ],
    correct: "Sequencer, Driver, and Monitor"
  },
  "Coverage-Driven Verification": {
    question: "What is 'Functional Coverage' in verification?",
    options: [
      "A metric indicating which parts of the design specifications have been exercised by tests",
      "The percentage of code lines executed during simulation",
      "The physical silicon footprint of the test block",
      "The total clock cycles simulated"
    ],
    correct: "A metric indicating which parts of the design specifications have been exercised by tests"
  },
  "Power Dissipation Sources": {
    question: "What is the dominant source of dynamic power dissipation in CMOS circuits?",
    options: [
      "Charging and discharging of load capacitances during switching",
      "Subthreshold leakage current through off transistors",
      "Gate oxide tunneling leakage",
      "Junction reverse-bias leakage"
    ],
    correct: "Charging and discharging of load capacitances during switching"
  },
  "Multi-Vt & Power Gating": {
    question: "In Multi-Vt designs, where are High-Vt transistors typically deployed?",
    options: [
      "On non-critical timing paths to minimize subthreshold leakage power",
      "On critical timing paths to maximize switching speed",
      "Directly in the clock tree structures",
      "Inside analog-to-digital converters"
    ],
    correct: "On non-critical timing paths to minimize subthreshold leakage power"
  },
  "Dynamic Voltage Scaling": {
    question: "How does Dynamic Voltage and Frequency Scaling (DVFS) save dynamic power?",
    options: [
      "By lowering operating voltage and clock frequency during low workload phases",
      "By shutting down the supply rails completely",
      "By increasing standard cell heights",
      "By replacing silicon with sapphire substrates"
    ],
    correct: "By lowering operating voltage and clock frequency during low workload phases"
  },
  "Op-Amps & Amplifier Design": {
    question: "What is an ideal characteristic of an Operational Amplifier (Op-Amp)?",
    options: [
      "Infinite open-loop gain and infinite input impedance",
      "Zero open-loop gain and zero input impedance",
      "High output impedance and low input impedance",
      "Single-ended input and differential output"
    ],
    correct: "Infinite open-loop gain and infinite input impedance"
  },
  "ADC/DAC Converters": {
    question: "What does the resolution of a 10-bit Analog-to-Digital Converter represent?",
    options: [
      "It divides the input voltage range into 2^10 (1024) discrete levels",
      "It takes exactly 10 microseconds per conversion",
      "It supports 10 input channels simultaneously",
      "It operates on a 10-volt supply rail"
    ],
    correct: "It divides the input voltage range into 2^10 (1024) discrete levels"
  },
  "PLL & Clock Generation": {
    question: "What is the primary function of a Phase-Locked Loop (PLL) in SoC designs?",
    options: [
      "Generating a high-frequency stable clock locked to a low-frequency reference",
      "Filtering DC voltage ripples on the power rail",
      "Storing register values during sleep states",
      "Converting analog inputs to digital registers"
    ],
    correct: "Generating a high-frequency stable clock locked to a low-frequency reference"
  },
  "FPGA Architecture Overview": {
    question: "What is the core programmable component inside an FPGA fabric?",
    options: [
      "Configurable Logic Block (CLB) with Look-Up Tables (LUTs)",
      "Hardwired static microprocessor core",
      "Capacitive memory storage cell",
      "Transistor-transistor logic gates"
    ],
    correct: "Configurable Logic Block (CLB) with Look-Up Tables (LUTs)"
  },
  "FPGA Development Flow": {
    question: "Which file is ultimately loaded onto an FPGA to configure its logic fabric?",
    options: [
      "Bitstream file (.bit or .bin)",
      "Verilog source file (.v)",
      "Timing constraint file (.sdc)",
      "Standard cell library file (.lib)"
    ],
    correct: "Bitstream file (.bit or .bin)"
  },
  "SoC Architecture Planning": {
    question: "What is a primary decision during System-on-Chip (SoC) architecture planning?",
    options: [
      "Defining processor cores, on-chip buses (e.g., AMBA AXI), and memory hierarchies",
      "Placing individual standard cell cells by hand",
      "Choosing visual CSS themes for web dashboards",
      "Running gate-level timing analysis on all ports"
    ],
    correct: "Defining processor cores, on-chip buses (e.g., AMBA AXI), and memory hierarchies"
  },

  // ==========================================
  // 3. UX DESIGN
  // ==========================================
  "What is UX Design?": {
    question: "What is the central focus of User Experience (UX) Design?",
    options: [
      "Optimizing usability, accessibility, and pleasure provided in user-product interaction",
      "Creating purely visual graphic icons and logos",
      "Writing optimized backend server routers",
      "Structuring relational database schema indexes"
    ],
    correct: "Optimizing usability, accessibility, and pleasure provided in user-product interaction"
  },
  "Design Thinking Process": {
    question: "Which of the following represents the correct order of phases in Design Thinking?",
    options: [
      "Empathize, Define, Ideate, Prototype, Test",
      "Ideate, Prototype, Define, Empathize, Test",
      "Define, Ideate, Empathize, Test, Prototype",
      "Test, Prototype, Ideate, Define, Empathize"
    ],
    correct: "Empathize, Define, Ideate, Prototype, Test"
  },
  "UX vs UI vs Product Design": {
    question: "What primarily distinguishes UI Design from UX Design?",
    options: [
      "UI focuses on the visual design and layout of interfaces, while UX focuses on the overall user journey",
      "UI manages backend servers, while UX handles databases",
      "UX works only with paper wireframes",
      "There is no difference between them"
    ],
    correct: "UI focuses on the visual design and layout of interfaces, while UX focuses on the overall user journey"
  },
  "Research Methods Overview": {
    question: "Which of the following is considered a qualitative UX research method?",
    options: [
      "One-on-one user interviews",
      "Large-scale online surveys",
      "A/B multivariate trials",
      "Google Analytics bounce metrics"
    ],
    correct: "One-on-one user interviews"
  },
  "Conducting User Interviews": {
    question: "When conducting a user interview, what is a key best practice?",
    options: [
      "Asking open-ended, non-leading questions",
      "Directly suggesting the correct answer to the user",
      "Arguing with the user if they make mistakes",
      "Keeping the interview under two minutes"
    ],
    correct: "Asking open-ended, non-leading questions"
  },
  "Creating Personas": {
    question: "What is a 'User Persona' in UX Design?",
    options: [
      "A semi-fictional archetype representing a key segment of your target audience",
      "A photograph of a user database engineer",
      "An automated test script on mobile browsers",
      "A profile page inside the admin dashboard"
    ],
    correct: "A semi-fictional archetype representing a key segment of your target audience"
  },
  "Empathy & Journey Mapping": {
    question: "What is the primary benefit of creating a User Journey Map?",
    options: [
      "Visualizing user tasks, pain points, and emotions across touchpoints over time",
      "Compiling the front-end layout CSS files",
      "Creating secondary indexes in database tables",
      "Tracking real-time network packets"
    ],
    correct: "Visualizing user tasks, pain points, and emotions across touchpoints over time"
  },
  "IA Principles & Sitemaps": {
    question: "What is 'Information Architecture' (IA) in UX?",
    options: [
      "Structuring, labeling, and organizing content to help users find information easily",
      "Choosing database server host hardware providers",
      "Configuring safe network firewall routing ports",
      "Designing beautiful circular color palettes"
    ],
    correct: "Structuring, labeling, and organizing content to help users find information easily"
  },
  "Card Sorting Workshop": {
    question: "What does 'Card Sorting' primarily help designers determine?",
    options: [
      "How users naturally group and categorize information",
      "The absolute fastest layout rendering speed",
      "The color contrast ratios for buttons",
      "The optimal database query indices"
    ],
    correct: "How users naturally group and categorize information"
  },
  "Navigation Patterns": {
    question: "Which navigation pattern is best suited for secondary or hidden secondary options on mobile screens?",
    options: [
      "Hamburger Drawer Menu",
      "Sticky Bottom Navigation Tab Bar",
      "Horizontal Carousel Slider",
      "Direct Text Links in Content"
    ],
    correct: "Hamburger Drawer Menu"
  },
  "Sketching Techniques": {
    question: "What is the main purpose of rapid sketching in UX design?",
    options: [
      "Generating many diverse layout ideas quickly without worrying about visual polish",
      "Creating final high-resolution logo artwork",
      "Adding final interactive click handlers",
      "Drafting detailed structural system diagrams"
    ],
    correct: "Generating many diverse layout ideas quickly without worrying about visual polish"
  },
  "Low-Fi Wireframing": {
    question: "What characterizes a Low-Fidelity wireframe?",
    options: [
      "Using boxes, placeholders, and simple lines to represent content layouts with no visual styling",
      "Showing pixel-perfect final colors and custom photography",
      "Integrating active backend APIs and operational code",
      "Providing deep micro-animations on hover"
    ],
    correct: "Using boxes, placeholders, and simple lines to represent content layouts with no visual styling"
  },
  "Wireframe to Mid-Fi": {
    question: "What is typically added when transitioning from Low-Fi to Mid-Fi wireframes?",
    options: [
      "Precise copy, typographic hierarchy, and structural grid layouts",
      "Vibrant brand colors and gradients",
      "Final custom image assets",
      "Operational code hooks"
    ],
    correct: "Precise copy, typographic hierarchy, and structural grid layouts"
  },
  "Figma Basics for UX": {
    question: "What is a major advantage of using Figma for product design?",
    options: [
      "Real-time multiplayer collaboration directly in the cloud",
      "Writing compiled native binary firmware for microchips",
      "Providing built-in relational SQL database hosts",
      "Completely replacing the need for frontend React developers"
    ],
    correct: "Real-time multiplayer collaboration directly in the cloud"
  },
  "Components & Auto Layout": {
    question: "What does 'Auto Layout' in Figma primarily solve?",
    options: [
      "Creating responsive elements that grow, shrink, and align dynamically as content changes",
      "Automatically writing frontend Tailwind styles in React files",
      "Auto-publishing wireframes to the App Store",
      "Generating randomized database keys"
    ],
    correct: "Creating responsive elements that grow, shrink, and align dynamically as content changes"
  },
  "Interactive Prototyping": {
    question: "What is the goal of creating an Interactive Prototype in Figma?",
    options: [
      "Simulating real product behavior and click pathways for testing and feedback",
      "Creating a production-ready compiled website",
      "Writing complex server-side operational code",
      "Optimizing database transaction operations"
    ],
    correct: "Simulating real product behavior and click pathways for testing and feedback"
  },
  "Micro-interactions & Animation": {
    question: "What is a key benefit of micro-interactions?",
    options: [
      "Providing delightful visual feedback, signaling status, and guiding user interaction",
      "Increasing the file size and load latency of the app",
      "Preventing database access errors",
      "Completely replacing structural layouts"
    ],
    correct: "Providing delightful visual feedback, signaling status, and guiding user interaction"
  },
  "Typography & Readability": {
    question: "What is a recommended font size for standard body text on mobile interfaces to ensure readability?",
    options: [
      "14px to 16px",
      "6px to 8px",
      "28px to 32px",
      "40px to 48px"
    ],
    correct: "14px to 16px"
  },
  "Color Theory for UI": {
    question: "In UI Design, what does the '60-30-10 Rule' recommend?",
    options: [
      "60% dominant color, 30% secondary structural color, 10% focal accent color",
      "60 seconds to load, 30 frames per second, 10-millisecond latency",
      "60 font size, 30 line height, 10 letter spacing",
      "60 colors, 30 gradients, 10 patterns"
    ],
    correct: "60% dominant color, 30% secondary structural color, 10% focal accent color"
  },
  "Layout, Spacing & Grid Systems": {
    question: "Why do UI designers heavily utilize an 8pt Spacing Grid System?",
    options: [
      "It ensures clean, mathematically consistent spacing across diverse device screen sizes",
      "It restricts layouts to only 8 standard columns",
      "It limits standard color choices to 8 hues",
      "It makes the page load exactly 8 times faster"
    ],
    correct: "It ensures clean, mathematically consistent spacing across diverse device screen sizes"
  },
  "Test Planning & Script Writing": {
    question: "What is a primary rule when writing a Usability Test Script?",
    options: [
      "Creating realistic task scenarios rather than step-by-step click directions",
      "Detailing exactly which buttons the participant should click by name",
      "Including all visual styling choices directly inside tasks",
      "Avoiding any mention of the product being tested"
    ],
    correct: "Creating realistic task scenarios rather than step-by-step click directions"
  },
  "WCAG Standards & Guidelines": {
    question: "According to WCAG AA guidelines, what is the minimum color contrast ratio required for standard body text?",
    options: [
      "4.5:1",
      "2:1",
      "10:1",
      "20:1"
    ],
    correct: "4.5:1"
  },
  "What is a Design System?": {
    question: "What is a Design System?",
    options: [
      "A complete standard of reusable components, patterns, and style tokens guided by clear standards",
      "A collection of beautiful random colors in a sketch file",
      "A front-end framework compilation script",
      "A structured list of database schema indexes"
    ],
    correct: "A complete standard of reusable components, patterns, and style tokens guided by clear standards"
  },

  // ==========================================
  // 4. SOFTWARE ARCHITECTURE
  // ==========================================
  "What is Software Architecture?": {
    question: "Which of the following best defines Software Architecture?",
    options: [
      "The high-level structure of a system, its components, relationships, and design principles",
      "The exact code implementation of a single helper method",
      "Choosing between Tailwind CSS and Vanilla CSS",
      "Creating simple static mockup diagrams on paper"
    ],
    correct: "The high-level structure of a system, its components, relationships, and design principles"
  },
  "Architecture vs Design": {
    question: "How does Software Architecture differ from Software Design?",
    options: [
      "Architecture focuses on high-level system structures and constraints, while Design focuses on detail-level component logic",
      "Architecture handles physical database servers, while Design handles code files",
      "Design is only used in frontend layouts",
      "There is no difference between them"
    ],
    correct: "Architecture focuses on high-level system structures and constraints, while Design focuses on detail-level component logic"
  },
  "Quality Attributes & Trade-offs": {
    question: "What does the CAP Theorem state about distributed data systems?",
    options: [
      "You can guarantee at most two out of Consistency, Availability, and Partition Tolerance",
      "All three quality attributes are easily achieved in any environment",
      "System security always trades off with database compilation speeds",
      "Caching completely eliminates transaction limits"
    ],
    correct: "You can guarantee at most two out of Consistency, Availability, and Partition Tolerance"
  },
  "Creational Patterns": {
    question: "Which design pattern is best suited for ensuring a class has only one instance and provides a global access point?",
    options: [
      "Singleton",
      "Factory Method",
      "Abstract Factory",
      "Builder"
    ],
    correct: "Singleton"
  },
  "Structural Patterns": {
    question: "Which structural design pattern lets incompatible interfaces work together by converting one interface into another?",
    options: [
      "Adapter",
      "Decorator",
      "Proxy",
      "Composite"
    ],
    correct: "Adapter"
  },
  "Behavioral Patterns": {
    question: "Which design pattern defines a one-to-many dependency so that when one object changes state, all its dependents are notified automatically?",
    options: [
      "Observer",
      "Strategy",
      "Command",
      "State"
    ],
    correct: "Observer"
  },
  "SOLID Principles Deep Dive": {
    question: "What does the 'Liskov Substitution Principle' (L in SOLID) require?",
    options: [
      "Derived classes must be substitutable for their base classes without breaking correctness",
      "A class must have only one reason to change",
      "Interfaces must be split into small, client-specific modules",
      "Higher-level modules must depend directly on lower-level modules"
    ],
    correct: "Derived classes must be substitutable for their base classes without breaking correctness"
  },
  "Dependency Inversion in Practice": {
    question: "How do you achieve Dependency Inversion in OOP?",
    options: [
      "By depending on abstractions (interfaces) rather than concrete implementations",
      "By deleting concrete classes and using only abstract functions",
      "By instantiating classes directly inside helper components",
      "By reversing the direction of data flow"
    ],
    correct: "By depending on abstractions (interfaces) rather than concrete implementations"
  },
  "Hexagonal Architecture": {
    question: "What is the central focus of Hexagonal (Ports and Adapters) Architecture?",
    options: [
      "Isolating the core business logic from external dependencies like databases and UIs using ports and adapters",
      "Restructuring the application into exactly 6 code files",
      "Using only hexagonal graphical shapes in the UI design",
      "Using database triggers to enforce business rules"
    ],
    correct: "Isolating the core business logic from external dependencies like databases and UIs using ports and adapters"
  },
  "Clean Architecture Layers": {
    question: "According to Uncle Bob's Clean Architecture, where do the core business rules (Entities) reside?",
    options: [
      "In the center layer, completely independent of databases, web frameworks, and UI",
      "In the outermost framework layer",
      "Directly inside the client-side browser logic",
      "Directly in the SQL database storage triggers"
    ],
    correct: "In the center layer, completely independent of databases, web frameworks, and UI"
  },
  "Strategic DDD: Bounded Contexts": {
    question: "What is a 'Bounded Context' in Domain-Driven Design?",
    options: [
      "A boundary within which a specific domain model and ubiquitous language applies consistently",
      "A memory constraint limit on server execution runtimes",
      "A secure firewall boundary around database tables",
      "A localized client-side routing scope"
    ],
    correct: "A boundary within which a specific domain model and ubiquitous language applies consistently"
  },
  "Tactical DDD: Entities & Value Objects": {
    question: "What distinguishes an Entity from a Value Object in DDD?",
    options: [
      "An Entity has a thread of continuity and unique identity, whereas a Value Object is defined solely by its attributes",
      "Entities are stored in SQL databases, while Value Objects reside in memory",
      "Value Objects can be modified at any time, while Entities are immutable",
      "There is no functional difference"
    ],
    correct: "An Entity has a thread of continuity and unique identity, whereas a Value Object is defined solely by its attributes"
  },
  "Monolith vs Microservices": {
    question: "What is a primary advantage of a Microservices architecture over a Monolith?",
    options: [
      "Independent deployability, technology flexibility, and localized scaling of services",
      "Significantly simpler local testing and debugging loops",
      "Zero network communication overhead between components",
      "Elimination of all database transactions"
    ],
    correct: "Independent deployability, technology flexibility, and localized scaling of services"
  },
  "Service Decomposition": {
    question: "What is a common pattern for decomposing a monolith into microservices?",
    options: [
      "Decomposing by business capabilities or subdomain boundaries",
      "Splitting services by code line counts",
      "Dividing services based on the number of client screens",
      "Creating one service per database table"
    ],
    correct: "Decomposing by business capabilities or subdomain boundaries"
  },
  "Data Consistency Patterns (Saga)": {
    question: "What is the primary role of a Saga pattern in microservices?",
    options: [
      "Managing distributed transactions across multiple services using a sequence of local transactions and compensating actions",
      "Creating real-time read-only replicas of database tables",
      "Caching static API payloads on the gateway layer",
      "Encrypting communication channels between microservices"
    ],
    correct: "Managing distributed transactions across multiple services using a sequence of local transactions and compensating actions"
  },
  "Event Sourcing & CQRS": {
    question: "What is the core principle of Event Sourcing?",
    options: [
      "Storing the state of an entity as a sequential sequence of immutable state-changing events",
      "Triggering database backups based on server events",
      "Listening to keyboard events inside the front-end layout",
      "Routing REST requests dynamically through the server gateway"
    ],
    correct: "Storing the state of an entity as a sequential sequence of immutable state-changing events"
  },
  "Kafka & Message Brokers": {
    question: "What is a key benefit of utilizing an asynchronous message broker like Apache Kafka in microservices?",
    options: [
      "Decoupling services, enabling high-throughput event processing, and providing durable event storage",
      "Executing sub-millisecond ACID transactions across multiple physical hosts",
      "Eliminating the need to write backend API routing scripts",
      "Automatically compiling typescript files in development"
    ],
    correct: "Decoupling services, enabling high-throughput event processing, and providing durable event storage"
  },
  "C4 Model & Diagrams": {
    question: "What are the four levels of architectural abstraction in the C4 Model?",
    options: [
      "Context, Containers, Components, and Code",
      "Clients, Controllers, Connections, and Collections",
      "Calculations, Conditions, Commands, and Classes",
      "Compilation, Connection, Caching, and Core"
    ],
    correct: "Context, Containers, Components, and Code"
  },
  "Architecture Decision Records": {
    question: "What is the primary purpose of an Architecture Decision Record (ADR)?",
    options: [
      "Documenting a significant architectural decision, its context, consequences, and rationale permanently",
      "Tracking daily developer code commits in git logs",
      "Generating automated error reports from production crashes",
      "Authorizing financial budgets for server hosting providers"
    ],
    correct: "Documenting a significant architectural decision, its context, consequences, and rationale permanently"
  }
};
