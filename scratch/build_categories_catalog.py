import json

categories_data = [
    {
        "id": "cat-prog-lang",
        "name": "Programming Languages",
        "shortName": "Programming",
        "description": "Learn popular programming languages and build strong coding fundamentals.",
        "icon": "Code",
        "domain": "Programming",
        "bgColor": "bg-blue-600",
        "textColor": "text-blue-600",
        "courses": [
            ("Python", "Master Python programming from core syntax, data structures, OOP to real-world scripting.", "Beginner", "36 hours", ["python", "programming", "scripting", "backend", "django", "flask"]),
            ("C", "Build a solid foundation in low-level system programming, memory management, pointers, and structures.", "Beginner", "32 hours", ["c", "programming", "pointers", "memory", "low level"]),
            ("C++", "Master Object-Oriented Programming, Standard Template Library (STL), memory pointers, and generic templates.", "Intermediate", "40 hours", ["c++", "cpp", "stl", "oop", "pointers", "templates"]),
            ("Java", "Learn enterprise Java development, JVM internals, object-oriented principles, multithreading, and Spring.", "Beginner", "44 hours", ["java", "jvm", "spring", "oop", "multithreading"]),
            ("JavaScript", "Master modern JavaScript (ES6+), closures, promises, async/await, DOM manipulation, and V8 engine.", "Beginner", "38 hours", ["javascript", "js", "es6", "async", "promises", "dom"])
        ]
    },
    {
        "id": "cat-web-dev",
        "name": "Web Development",
        "shortName": "Web Dev",
        "description": "Master modern web design, responsive frontend frameworks, backend servers, and full stack applications.",
        "icon": "Monitor",
        "domain": "Programming",
        "bgColor": "bg-cyan-600",
        "textColor": "text-cyan-600",
        "courses": [
            ("HTML & CSS", "Learn modern semantic HTML5, CSS Flexbox, Grid layouts, animations, and responsive web design.", "Beginner", "24 hours", ["html", "css", "flexbox", "grid", "responsive"]),
            ("JavaScript", "Deep dive into JS for front-end interactivity, DOM manipulation, events, and API integration.", "Beginner", "38 hours", ["javascript", "js", "es6", "web", "dom"]),
            ("React.js", "Build scalable interactive single-page applications using React components, hooks, and state management.", "Intermediate", "42 hours", ["react", "react.js", "jsx", "hooks", "nextjs", "frontend"]),
            ("Node.js", "Build fast event-driven server-side applications and RESTful APIs using Node.js and Express.", "Intermediate", "40 hours", ["node", "node.js", "express", "backend", "api", "rest"]),
            ("Full Stack Development", "Master end-to-end full stack web development using React, Node.js, databases, auth, and deployment.", "Intermediate", "56 hours", ["full stack", "react", "node", "express", "mongodb", "postgresql"])
        ]
    },
    {
        "id": "cat-data-science",
        "name": "Data Science & Analytics",
        "shortName": "Data Analytics",
        "description": "Analyze data, extract business insights, build predictive models, and master BI dashboard tools.",
        "icon": "BarChart3",
        "domain": "Data",
        "bgColor": "bg-emerald-600",
        "textColor": "text-emerald-600",
        "courses": [
            ("Data Analytics", "Master data analysis with Python, SQL, and visualization tools to derive actionable business insights.", "Intermediate", "42 hours", ["data analytics", "sql", "excel", "tableau", "power bi", "analytics"]),
            ("Data Science", "Learn end-to-end data science: wrangling, exploratory analysis, statistical modeling, and ML pipelines.", "Intermediate", "50 hours", ["data science", "python", "pandas", "numpy", "statistics", "eda"]),
            ("SQL", "Master database queries, complex joins, window functions, aggregation, and schema query optimization.", "Beginner", "30 hours", ["sql", "queries", "postgresql", "mysql", "joins", "database"]),
            ("Excel", "Master advanced Excel formulas, pivot tables, Power Query, VLOOKUP/XLOOKUP, and business dashboards.", "Beginner", "26 hours", ["excel", "spreadsheets", "pivot tables", "vlookup", "formulas", "analytics"]),
            ("Power BI", "Create interactive business intelligence dashboards, DAX measures, data modeling, and reports in Power BI.", "Intermediate", "28 hours", ["power bi", "dax", "bi", "dashboards", "business intelligence", "reports"])
        ]
    },
    {
        "id": "cat-ai-ml",
        "name": "Artificial Intelligence & Machine Learning",
        "shortName": "AI & ML",
        "description": "Explore intelligent algorithms, deep neural networks, computer vision, NLP, and Generative AI models.",
        "icon": "Brain",
        "domain": "AI/ML",
        "bgColor": "bg-purple-600",
        "textColor": "text-purple-600",
        "courses": [
            ("Artificial Intelligence", "Introduction to AI principles, search algorithms, knowledge representation, game playing, and logic.", "Intermediate", "46 hours", ["ai", "artificial intelligence", "search", "heuristics", "logic"]),
            ("Machine Learning", "Supervised and unsupervised learning, regression, classification, decision trees, SVMs, and Scikit-Learn.", "Intermediate", "48 hours", ["machine learning", "ml", "scikit-learn", "regression", "classification"]),
            ("Deep Learning", "Build deep neural networks, CNNs, RNNs, LSTMs, and Transformers using PyTorch and TensorFlow.", "Advanced", "52 hours", ["deep learning", "neural networks", "pytorch", "tensorflow", "cnn", "rnn"]),
            ("Generative AI", "Learn Large Language Models, prompt engineering, RAG, Fine-tuning, LangChain, and AI agent frameworks.", "Advanced", "42 hours", ["generative ai", "genai", "llm", "langchain", "rag", "gpt"]),
            ("Computer Vision", "Master image processing, object detection, facial recognition, image segmentation, and OpenCV.", "Advanced", "46 hours", ["computer vision", "opencv", "yolo", "cnn", "image processing"]),
            ("Natural Language Processing", "Process text data using tokenization, word embeddings, sentiment analysis, Transformers, and LLMs.", "Advanced", "44 hours", ["nlp", "text", "natural language", "bert", "gpt", "transformers"])
        ]
    },
    {
        "id": "cat-ui-ux",
        "name": "UI/UX & Designing",
        "shortName": "UI/UX Design",
        "description": "Learn user interface design, user experience, Figma prototyping, graphic design, and design thinking.",
        "icon": "Palette",
        "domain": "Design",
        "bgColor": "bg-pink-600",
        "textColor": "text-pink-600",
        "courses": [
            ("UI Design", "Master visual hierarchy, typography, color theory, component layouts, and high-fidelity interface design.", "Beginner", "32 hours", ["ui design", "user interface", "visual design", "typography", "layout"]),
            ("UX Design", "Design user-centered digital experiences: user research, wireframing, prototyping, and usability testing.", "Beginner", "38 hours", ["ux design", "user experience", "research", "wireframing", "usability"]),
            ("Figma", "Master Figma for UI/UX design: auto-layout, design tokens, interactive prototyping, and component libraries.", "Beginner", "28 hours", ["figma", "prototyping", "components", "auto layout", "design"]),
            ("Graphic Design", "Learn design fundamentals, branding, vector graphics, typography, composition, and visual storytelling.", "Beginner", "30 hours", ["graphic design", "branding", "graphics", "vector", "typography"]),
            ("Design Thinking", "Human-centered problem solving process: empathize, define, ideate, prototype, and test innovative solutions.", "Beginner", "24 hours", ["design thinking", "innovation", "problem solving", "empathy", "ideation"])
        ]
    },
    {
        "id": "cat-embedded",
        "name": "Electronics & Embedded Systems",
        "shortName": "Embedded Systems",
        "description": "Build hardware systems using microcontrollers, Embedded C, Linux, and real-time operating systems.",
        "icon": "Zap",
        "domain": "Electronics",
        "bgColor": "bg-emerald-600",
        "textColor": "text-emerald-600",
        "courses": [
            ("Embedded Systems", "Design real-time embedded hardware using ARM microcontrollers, RTOS, embedded C, and peripherals.", "Intermediate", "48 hours", ["embedded systems", "arm", "rtos", "microcontroller", "peripherals"]),
            ("Embedded C", "Specialized C programming techniques for hardware registers, bitwise operations, volatile, and memory I/O.", "Beginner", "30 hours", ["embedded c", "registers", "bitwise", "volatile", "firmware"]),
            ("Microcontrollers", "8051, PIC, and AVR microcontroller architecture, timers, counter programming, and I/O interfacing.", "Intermediate", "40 hours", ["microcontrollers", "8051", "pic", "avr", "timers", "gpio"]),
            ("Arduino", "Hands-on electronics prototyping with Arduino boards, sensor interfacing, motor drivers, and C++ sketches.", "Beginner", "26 hours", ["arduino", "prototyping", "sensors", "microcontroller", "diy"]),
            ("Raspberry Pi", "Single-board computing with Raspberry Pi, Linux CLI, Python GPIO control, camera modules, and IoT servers.", "Beginner", "32 hours", ["raspberry pi", "linux", "python", "gpio", "single board"]),
            ("Embedded Linux", "Build custom embedded Linux systems using Yocto, U-Boot bootloader, Linux kernel compilation, and device tree.", "Advanced", "46 hours", ["embedded linux", "yocto", "u-boot", "kernel", "device tree"])
        ]
    },
    {
        "id": "cat-vlsi",
        "name": "VLSI & Semiconductor",
        "shortName": "VLSI & Chips",
        "description": "Design integrated circuits, RTL logic, Verilog/SystemVerilog HDL, FPGA, and CMOS physical design.",
        "icon": "Cpu",
        "domain": "Electronics",
        "bgColor": "bg-rose-600",
        "textColor": "text-rose-600",
        "courses": [
            ("VLSI Design", "Learn VLSI chip design flow from RTL specification to GDSII layout, CMOS logic, and physical signoff.", "Advanced", "56 hours", ["vlsi", "vlsi design", "cmos", "rtl", "verilog", "gdsii"]),
            ("Digital VLSI", "Digital IC design, standard cell synthesis, static timing analysis (STA), clock distribution, and low power.", "Advanced", "48 hours", ["digital vlsi", "sta", "synthesis", "stdcell", "low power", "ic design"]),
            ("Verilog", "Hardware description language syntax, behavioral and structural modeling, testbenches, and logic synthesis.", "Intermediate", "36 hours", ["verilog", "hdl", "rtl", "synthesis", "testbench", "fpga"]),
            ("SystemVerilog", "Advanced verification and design: SystemVerilog OOP testbenches, assertions, coverage, and UVM framework.", "Advanced", "44 hours", ["systemverilog", "sv", "verification", "uvm", "assertions", "coverage"]),
            ("FPGA", "Design digital systems on Xilinx & Intel FPGAs using Vivado/Quartus, timing constraints, and IP core integration.", "Intermediate", "42 hours", ["fpga", "xilinx", "vivado", "quartus", "intel fpga", "rtl"]),
            ("CMOS Design", "Transistor-level CMOS logic gates, layout techniques, parasitic extraction, delay estimation, and SPICE simulation.", "Advanced", "44 hours", ["cmos", "layout", "spice", "parasitic", "mosfet", "transistor"]),
            ("RTL Design", "Register Transfer Level logic design, finite state machines (FSM), pipeline architectures, and timing closure.", "Intermediate", "38 hours", ["rtl", "rtl design", "fsm", "pipeline", "timing closure", "synthesis"])
        ]
    },
    {
        "id": "cat-iot-robotics",
        "name": "IoT & Robotics",
        "shortName": "IoT & Robotics",
        "description": "Build connected IoT sensors, autonomous robots, ROS2 navigation, and motor control systems.",
        "icon": "Bot",
        "domain": "Electronics",
        "bgColor": "bg-teal-600",
        "textColor": "text-teal-600",
        "courses": [
            ("Internet of Things", "Build connected IoT devices using microcontrollers, sensors, MQTT protocol, and cloud dashboards.", "Intermediate", "40 hours", ["iot", "internet of things", "mqtt", "cloud", "sensors", "wifi"]),
            ("IoT with Arduino", "Combine Arduino hardware with WiFi/Bluetooth modules to transmit sensor data to IoT cloud platforms.", "Beginner", "30 hours", ["iot with arduino", "arduino", "esp8266", "esp32", "sensors", "cloud"]),
            ("IoT with Raspberry Pi", "Build edge IoT gateways with Raspberry Pi, Python, MQTT, Node-RED, and cloud data analytics.", "Intermediate", "34 hours", ["iot with raspberry pi", "raspberry pi", "mqtt", "node-red", "gateway"]),
            ("Robotics", "Build autonomous robots: kinematics, sensors, ROS2 navigation, computer vision, motor control, and path planning.", "Advanced", "48 hours", ["robotics", "ros", "ros2", "kinematics", "sensors", "bot"]),
            ("Sensors & Actuators", "Working principles of accelerometers, LIDAR, ultrasonic, optical, chemical sensors, and motor drivers.", "Intermediate", "32 hours", ["sensors", "actuators", "lidar", "accelerometer", "motors", "transducers"])
        ]
    },
    {
        "id": "cat-cybersec",
        "name": "Cybersecurity & Ethical Hacking",
        "shortName": "Cybersecurity",
        "description": "Protect computer networks, perform vulnerability testing, cryptography, and ethical hacking.",
        "icon": "Shield",
        "domain": "Other",
        "bgColor": "bg-red-700",
        "textColor": "text-red-700",
        "courses": [
            ("Cybersecurity Fundamentals", "CIA triad, threat landscape, risk management, security frameworks (NIST, ISO 27001), and defense.", "Beginner", "36 hours", ["cybersecurity", "cia triad", "nist", "infosec", "security"]),
            ("Network Security", "Firewalls, Intrusion Detection Systems (IDS/IPS), VPNs, TCP/IP security, and network monitoring.", "Intermediate", "40 hours", ["network security", "firewall", "ids", "vpn", "tcp/ip", "packet"]),
            ("Ethical Hacking", "Penetration testing methodologies, Nmap recon, Metasploit exploitation, Wireshark, and reporting.", "Advanced", "48 hours", ["ethical hacking", "pentesting", "nmap", "metasploit", "exploitation"]),
            ("Web Security", "Web application security, OWASP Top 10 vulnerabilities, SQL injection, XSS, CSRF, and secure coding.", "Intermediate", "34 hours", ["web security", "owasp", "sqli", "xss", "csrf", "vulnerability"])
        ]
    },
    {
        "id": "cat-networking",
        "name": "Networking",
        "shortName": "Networking",
        "description": "Master computer networking protocols, TCP/IP, network administration, and wireless security.",
        "icon": "Wifi",
        "domain": "Other",
        "bgColor": "bg-indigo-600",
        "textColor": "text-indigo-600",
        "courses": [
            ("Computer Networks", "OSI 7-layer model, TCP/IP protocol suite, IP addressing, subnetting, routing protocols, and HTTP/S.", "Intermediate", "36 hours", ["computer networks", "tcp/ip", "osi", "routing", "subnetting", "dns"]),
            ("Network Administration", "Configure routers, switches, VLANs, NAT, DHCP, DNS servers, and network monitoring tools.", "Intermediate", "38 hours", ["network administration", "cisco", "routers", "switches", "vlan", "nat"]),
            ("Wireless Networking", "WiFi standards (802.11ax/be), cellular networks, 5G architecture, WPA3 security, and RF propagation.", "Intermediate", "32 hours", ["wireless networking", "wifi", "5g", "wpa3", "rf", "cellular"]),
            ("Network Security", "Network defense, firewalls, intrusion prevention, secure tunneling, and network traffic analysis.", "Intermediate", "40 hours", ["network security", "firewall", "ids", "vpn", "security", "traffic"])
        ]
    },
    {
        "id": "cat-cloud-devops",
        "name": "Cloud Computing & DevOps",
        "shortName": "Cloud & DevOps",
        "description": "Master AWS, Azure, Docker containers, Kubernetes orchestration, CI/CD pipelines, and DevOps.",
        "icon": "Cloud",
        "domain": "Other",
        "bgColor": "bg-sky-600",
        "textColor": "text-sky-600",
        "courses": [
            ("Cloud Computing", "Cloud architecture concepts across AWS, Azure, and GCP: compute, storage, IAM, and virtual networks.", "Intermediate", "44 hours", ["cloud computing", "aws", "azure", "gcp", "serverless", "cloud"]),
            ("AWS", "Amazon Web Services core services: EC2, S3, RDS, Lambda, VPC, IAM, and cloud solution architecture.", "Intermediate", "40 hours", ["aws", "ec2", "s3", "lambda", "vpc", "iam", "cloud"]),
            ("Microsoft Azure", "Microsoft Azure cloud platform: Virtual Machines, Blob Storage, Azure Functions, Entra ID, and Azure DevOps.", "Intermediate", "38 hours", ["azure", "microsoft azure", "virtual machines", "blob", "entra id"]),
            ("DevOps", "DevOps culture, CI/CD automation, Infrastructure as Code (Terraform), Ansible, and monitoring.", "Intermediate", "46 hours", ["devops", "ci/cd", "terraform", "ansible", "jenkins", "automation"]),
            ("Docker", "Containerization with Docker: Dockerfiles, image optimization, multi-stage builds, and Docker Compose.", "Beginner", "24 hours", ["docker", "containers", "dockerfile", "docker compose", "devops"]),
            ("Kubernetes", "Container orchestration with Kubernetes: Pods, Deployments, Services, Ingress, Helm charts, and scaling.", "Advanced", "40 hours", ["kubernetes", "k8s", "pods", "deployments", "helm", "orchestration"]),
            ("CI/CD", "Automate software delivery pipelines using GitHub Actions, GitLab CI, Jenkins, and automated testing.", "Intermediate", "30 hours", ["ci/cd", "github actions", "jenkins", "pipelines", "automation", "deploy"])
        ]
    },
    {
        "id": "cat-databases",
        "name": "Databases",
        "shortName": "Databases",
        "description": "Design relational and NoSQL databases, write SQL queries, and manage database systems.",
        "icon": "Database",
        "domain": "Data",
        "bgColor": "bg-teal-700",
        "textColor": "text-teal-700",
        "courses": [
            ("Database Management Systems", "Relational database concepts, ER modeling, schema design, indexing, transactions, and ACID properties.", "Intermediate", "38 hours", ["dbms", "database", "relational", "acid", "indexing", "er model"]),
            ("SQL", "Master SQL query writing, joins, subqueries, CTEs, window functions, and performance tuning.", "Beginner", "30 hours", ["sql", "queries", "postgresql", "mysql", "joins", "database"]),
            ("MySQL", "Relational database development with MySQL: table design, stored procedures, indexing, and administration.", "Beginner", "32 hours", ["mysql", "sql", "relational", "database", "tables", "indexes"]),
            ("PostgreSQL", "Advanced open-source relational database: JSONB data types, spatial extensions (PostGIS), and optimization.", "Intermediate", "36 hours", ["postgresql", "postgres", "sql", "jsonb", "database", "indexing"]),
            ("MongoDB", "NoSQL document database: BSON collections, aggregation pipeline, indexing, and Mongoose ORM.", "Intermediate", "34 hours", ["mongodb", "nosql", "document", "bson", "mongoose", "database"])
        ]
    },
    {
        "id": "cat-soft-dev",
        "name": "Software Development",
        "shortName": "Software Dev",
        "description": "Learn software engineering principles, OOP, Data Structures & Algorithms, and Git version control.",
        "icon": "Wrench",
        "domain": "Programming",
        "bgColor": "bg-blue-700",
        "textColor": "text-blue-700",
        "courses": [
            ("Software Engineering", "Software lifecycle methodologies, Agile/Scrum, requirement analysis, software architecture, and QA.", "Beginner", "34 hours", ["software engineering", "agile", "scrum", "sdlc", "testing", "architecture"]),
            ("Object-Oriented Programming", "OOP design principles, SOLID guidelines, encapsulation, inheritance, polymorphism, and design patterns.", "Beginner", "28 hours", ["oop", "object-oriented", "solid", "classes", "inheritance", "polymorphism"]),
            ("Data Structures & Algorithms", "Master arrays, linked lists, stacks, queues, trees, graphs, dynamic programming, and algorithm analysis.", "Intermediate", "50 hours", ["dsa", "algorithms", "data structures", "leetcode", "trees", "graphs"]),
            ("Software Testing", "Manual and automated software testing, unit testing, integration tests, Selenium, Cypress, and QA practices.", "Beginner", "32 hours", ["software testing", "qa", "selenium", "cypress", "unit test", "automation"]),
            ("Git & GitHub", "Version control with Git: commits, branching strategies, merge conflicts, pull requests, and GitHub Actions.", "Beginner", "20 hours", ["git", "github", "version control", "branching", "commits", "pull requests"])
        ]
    },
    {
        "id": "cat-mobile-dev",
        "name": "Mobile App Development",
        "shortName": "Mobile Apps",
        "description": "Build native and cross-platform mobile apps using Android, Flutter, and React Native.",
        "icon": "Smartphone",
        "domain": "Programming",
        "bgColor": "bg-sky-600",
        "textColor": "text-sky-600",
        "courses": [
            ("Android Development", "Build native Android applications with Kotlin, Android Jetpack, UI layouts, activities, and Room DB.", "Intermediate", "44 hours", ["android", "kotlin", "jetpack", "mobile", "app", "android studio"]),
            ("Flutter", "Build beautiful cross-platform iOS and Android apps from a single codebase using Dart and Flutter widgets.", "Intermediate", "42 hours", ["flutter", "dart", "mobile app", "cross platform", "widgets", "ios", "android"]),
            ("React Native", "Build cross-platform mobile applications using JavaScript, React components, native modules, and Expo.", "Intermediate", "40 hours", ["react native", "react", "expo", "mobile app", "ios", "android", "javascript"])
        ]
    },
    {
        "id": "cat-core-electronics",
        "name": "Core Electronics & Communication",
        "shortName": "Core Electronics",
        "description": "Explore digital & analog electronics, signals & systems, DSP, RF, antennas, and PCB design.",
        "icon": "Radio",
        "domain": "Electronics",
        "bgColor": "bg-amber-600",
        "textColor": "text-amber-600",
        "courses": [
            ("Digital Electronics", "Digital logic gates, Boolean algebra, combinational and sequential circuit design, flip-flops, and counters.", "Beginner", "36 hours", ["digital electronics", "logic gates", "boolean algebra", "flip flops", "counters"]),
            ("Analog Electronics", "Operational amplifiers, diodes, BJT/MOSFET biasing, frequency response, and active filter design.", "Intermediate", "40 hours", ["analog electronics", "op-amp", "diodes", "bjt", "amplifiers", "filters"]),
            ("Signals & Systems", "Continuous & discrete-time signals, Fourier transform, Laplace transform, and linear time-invariant (LTI) systems.", "Intermediate", "40 hours", ["signals and systems", "fourier", "laplace", "lti", "convolution", "frequency"]),
            ("Digital Signal Processing", "Sampling theorem, Z-transform, FIR & IIR digital filter design, FFT algorithms, and DSP processors.", "Advanced", "44 hours", ["dsp", "digital signal processing", "fft", "fir", "iir", "filters"]),
            ("Communication Systems", "Analog & digital modulation (AM, FM, PSK, QAM), noise analysis, information theory, and receiver design.", "Intermediate", "44 hours", ["communication systems", "modulation", "am", "fm", "psk", "qam", "receiver"]),
            ("Control Systems", "Feedback control systems, transfer functions, block diagrams, root locus, Bode plots, and PID tuning.", "Intermediate", "42 hours", ["control systems", "pid", "bode plot", "transfer function", "feedback"]),
            ("Antenna & Wave Propagation", "Electromagnetic wave propagation, dipole antennas, patch antennas, antenna arrays, and radiation patterns.", "Advanced", "42 hours", ["antenna", "wave propagation", "electromagnetics", "rf", "radiation pattern"]),
            ("RF & Microwave Engineering", "Radio frequency circuit design, Smith charts, S-parameters, microstrip transmission lines, and amplifiers.", "Advanced", "46 hours", ["rf", "microwave", "smith chart", "s-parameters", "microstrip", "power amplifier"]),
            ("PCB Design", "Printed circuit board schematic capture, component footprinting, multi-layer routing, and Gerber file export in KiCad.", "Beginner", "36 hours", ["pcb", "pcb design", "kicad", "schematic", "routing", "gerber"])
        ]
    },
    {
        "id": "cat-other-eng",
        "name": "Other Engineering Disciplines",
        "shortName": "Other Eng",
        "description": "Mechanical design & CAD, civil structural engineering, biotechnology, and aerospace engineering.",
        "icon": "Wrench",
        "domain": "Other",
        "bgColor": "bg-slate-700",
        "textColor": "text-slate-700",
        "courses": [
            ("Mechanical Design & CAD", "Master mechanical engineering design principles, 3D CAD modeling, FEA simulation, and manufacturing.", "Intermediate", "40 hours", ["mechanical", "cad", "solidworks", "fea", "design", "drawing"]),
            ("Civil & Structural Engineering", "Structural analysis, concrete & steel design, geotechnical engineering, and construction management.", "Intermediate", "44 hours", ["civil", "structural", "concrete", "steel", "rcc", "building", "construction"]),
            ("Biotechnology & Genetic Engineering", "Molecular biology, genetic engineering, CRISPR, bioinformatics, and bioprocess engineering.", "Intermediate", "38 hours", ["biotech", "dna", "genetics", "crispr", "bioinformatics", "pcr"]),
            ("Aerospace Engineering Fundamentals", "Aerodynamics, flight mechanics, propulsion systems, aircraft structures, and space systems.", "Advanced", "46 hours", ["aerospace", "aerodynamics", "flight", "propulsion", "aircraft", "rockets"])
        ]
    }
]

print("Total categories:", len(categories_data))
total_c = sum(len(cat["courses"]) for cat in categories_data)
print("Total courses:", total_c)
