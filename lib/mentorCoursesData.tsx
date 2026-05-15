import React from "react";
import {
  BarChart3,
  Zap,
  Lightbulb,
  Code,
  Layers,
  Sparkles,
  Eye,
  Target,
  TrendingUp,
  Brain,
  FileText,
  Award,
  Shield,
  Rocket,
  Globe,
  Clock,
  MessageSquare,
  BookOpen,
  Users,
  Heart,
  UserCheck,
  PenLine,
  Cpu,
  Wrench,
  Building2,
  Plane,
  Monitor,
  Cloud,
  Bot,
  Database,
  Activity,
  Server,
  Wifi,
  FlaskConical,
  Palette,
} from "lucide-react";

export interface MentorLesson {
  id: string;
  title: string;
  duration: string;
  type: "video" | "exercise" | "quiz" | "project" | "reading";
}

export interface MentorModule {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: React.ReactNode;
  lessons: MentorLesson[];
}

export interface MentorCourse {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  modules: MentorModule[];
  enrolled: boolean;
  progress: number;
}

export const mentorCoursesCatalog: MentorCourse[] = [
  {
    id: "mc1",
    title: "Data Analytics",
    shortTitle: "Data Analytics",
    description: "Master data analysis with Python, SQL, and visualization tools. Learn to derive insights from complex datasets and drive data-informed decisions.",
    color: "text-blue-600",
    bgColor: "bg-blue-500",
    icon: <BarChart3 className="w-5 h-5" />,
    category: "Data Science",
    difficulty: "Intermediate",
    duration: "42 hours",
    enrolled: true,
    progress: 35,
    modules: [
      {
        id: "da-m1", title: "Foundations of Data Analytics", description: "Core concepts, analytics lifecycle, and the role of a data analyst", color: "bg-blue-500",
        icon: <Sparkles className="w-4 h-4" />,
        lessons: [
          { id: "da-l1", title: "What is Data Analytics?", duration: "12 min", type: "video" },
          { id: "da-l2", title: "Types of Analytics: Descriptive to Prescriptive", duration: "15 min", type: "video" },
          { id: "da-l3", title: "Analytics Lifecycle & Workflow", duration: "10 min", type: "reading" },
          { id: "da-l4", title: "Quiz: Foundations", duration: "8 min", type: "quiz" },
        ],
      },
      {
        id: "da-m2", title: "Data Collection & Cleaning", description: "Gathering, cleaning, and preparing data for analysis", color: "bg-blue-600",
        icon: <Layers className="w-4 h-4" />,
        lessons: [
          { id: "da-l5", title: "Data Sources & Collection Methods", duration: "14 min", type: "video" },
          { id: "da-l6", title: "Handling Missing Data", duration: "18 min", type: "exercise" },
          { id: "da-l7", title: "Data Cleaning with Pandas", duration: "20 min", type: "exercise" },
          { id: "da-l8", title: "Data Validation Techniques", duration: "12 min", type: "video" },
        ],
      },
      {
        id: "da-m3", title: "Exploratory Data Analysis (EDA)", description: "Techniques to explore and understand your data", color: "bg-sky-500",
        icon: <Eye className="w-4 h-4" />,
        lessons: [
          { id: "da-l9", title: "Summary Statistics & Distributions", duration: "15 min", type: "video" },
          { id: "da-l10", title: "Correlation & Relationships", duration: "14 min", type: "video" },
          { id: "da-l11", title: "EDA with Python — Hands-on", duration: "25 min", type: "exercise" },
        ],
      },
      {
        id: "da-m4", title: "SQL for Analytics", description: "Query databases to extract and analyze data", color: "bg-indigo-500",
        icon: <Code className="w-4 h-4" />,
        lessons: [
          { id: "da-l12", title: "SQL Basics: SELECT, WHERE, JOIN", duration: "18 min", type: "video" },
          { id: "da-l13", title: "Aggregations & GROUP BY", duration: "15 min", type: "video" },
          { id: "da-l14", title: "Subqueries & CTEs", duration: "20 min", type: "exercise" },
          { id: "da-l15", title: "Window Functions", duration: "18 min", type: "exercise" },
          { id: "da-l16", title: "SQL Challenge", duration: "12 min", type: "quiz" },
        ],
      },
      {
        id: "da-m5", title: "Data Visualization", description: "Create compelling charts and dashboards", color: "bg-violet-500",
        icon: <BarChart3 className="w-4 h-4" />,
        lessons: [
          { id: "da-l17", title: "Visualization Principles", duration: "12 min", type: "video" },
          { id: "da-l18", title: "Matplotlib & Seaborn", duration: "20 min", type: "exercise" },
          { id: "da-l19", title: "Interactive Dashboards with Plotly", duration: "22 min", type: "exercise" },
          { id: "da-l20", title: "Storytelling with Data", duration: "15 min", type: "video" },
        ],
      },
      {
        id: "da-m6", title: "Statistical Analysis", description: "Hypothesis testing, probability, and statistical modeling", color: "bg-purple-500",
        icon: <TrendingUp className="w-4 h-4" />,
        lessons: [
          { id: "da-l21", title: "Probability & Distributions", duration: "18 min", type: "video" },
          { id: "da-l22", title: "Hypothesis Testing", duration: "20 min", type: "video" },
          { id: "da-l23", title: "A/B Testing in Practice", duration: "22 min", type: "exercise" },
        ],
      },
      {
        id: "da-m7", title: "Machine Learning Basics", description: "Introduction to ML models for analytics", color: "bg-fuchsia-500",
        icon: <Brain className="w-4 h-4" />,
        lessons: [
          { id: "da-l24", title: "Regression Models", duration: "20 min", type: "video" },
          { id: "da-l25", title: "Classification Basics", duration: "18 min", type: "video" },
          { id: "da-l26", title: "Build a Prediction Model", duration: "30 min", type: "project" },
        ],
      },
      {
        id: "da-m8", title: "Excel & Spreadsheet Mastery", description: "Advanced Excel functions and pivot tables", color: "bg-emerald-500",
        icon: <FileText className="w-4 h-4" />,
        lessons: [
          { id: "da-l27", title: "Advanced Formulas & Functions", duration: "15 min", type: "video" },
          { id: "da-l28", title: "Pivot Tables & Power Query", duration: "18 min", type: "exercise" },
          { id: "da-l29", title: "Dashboard Building in Excel", duration: "20 min", type: "exercise" },
        ],
      },
      {
        id: "da-m9", title: "Business Intelligence Tools", description: "Tableau, Power BI, and real-world BI workflows", color: "bg-amber-500",
        icon: <Lightbulb className="w-4 h-4" />,
        lessons: [
          { id: "da-l30", title: "Intro to Tableau", duration: "18 min", type: "video" },
          { id: "da-l31", title: "Power BI Fundamentals", duration: "18 min", type: "video" },
          { id: "da-l32", title: "Build a BI Dashboard", duration: "30 min", type: "project" },
        ],
      },
      {
        id: "da-m10", title: "Capstone: End-to-End Analytics Project", description: "Complete a real-world analytics project from data to insights", color: "bg-gray-900",
        icon: <Award className="w-4 h-4" />,
        lessons: [
          { id: "da-l33", title: "Project Planning & Data Acquisition", duration: "15 min", type: "video" },
          { id: "da-l34", title: "Analysis & Visualization", duration: "45 min", type: "project" },
          { id: "da-l35", title: "Presentation & Review", duration: "20 min", type: "quiz" },
        ],
      },
    ],
  },
  {
    id: "mc2",
    title: "VLSI Design",
    shortTitle: "VLSI",
    description: "Learn VLSI chip design from RTL to GDSII. Cover Verilog/VHDL, synthesis, physical design, and verification methodologies.",
    color: "text-rose-600",
    bgColor: "bg-rose-500",
    icon: <Zap className="w-5 h-5" />,
    category: "Hardware",
    difficulty: "Advanced",
    duration: "56 hours",
    enrolled: true,
    progress: 18,
    modules: [
      {
        id: "vl-m1", title: "Introduction to VLSI", description: "VLSI design flow, Moore's law, and semiconductor basics", color: "bg-rose-500",
        icon: <Sparkles className="w-4 h-4" />,
        lessons: [
          { id: "vl-l1", title: "History & Evolution of VLSI", duration: "12 min", type: "video" },
          { id: "vl-l2", title: "VLSI Design Flow Overview", duration: "15 min", type: "video" },
          { id: "vl-l3", title: "Semiconductor Fundamentals", duration: "18 min", type: "reading" },
          { id: "vl-l4", title: "CMOS Technology Basics", duration: "20 min", type: "video" },
        ],
      },
      {
        id: "vl-m2", title: "Digital Logic Design", description: "Boolean algebra, combinational and sequential circuits", color: "bg-red-500",
        icon: <Target className="w-4 h-4" />,
        lessons: [
          { id: "vl-l5", title: "Boolean Algebra & Gates", duration: "15 min", type: "video" },
          { id: "vl-l6", title: "Combinational Circuits", duration: "18 min", type: "exercise" },
          { id: "vl-l7", title: "Sequential Circuits & Flip-Flops", duration: "20 min", type: "video" },
          { id: "vl-l8", title: "Finite State Machines", duration: "22 min", type: "exercise" },
        ],
      },
      {
        id: "vl-m3", title: "Verilog HDL", description: "Hardware description language for digital design", color: "bg-orange-500",
        icon: <Code className="w-4 h-4" />,
        lessons: [
          { id: "vl-l9", title: "Verilog Syntax & Data Types", duration: "18 min", type: "video" },
          { id: "vl-l10", title: "Modules & Port Mapping", duration: "15 min", type: "video" },
          { id: "vl-l11", title: "Behavioral vs Structural Modeling", duration: "20 min", type: "exercise" },
          { id: "vl-l12", title: "Testbench Writing", duration: "22 min", type: "exercise" },
          { id: "vl-l13", title: "Verilog Challenge", duration: "15 min", type: "quiz" },
        ],
      },
      {
        id: "vl-m4", title: "RTL Design & Synthesis", description: "Register Transfer Level design and logic synthesis", color: "bg-amber-500",
        icon: <Layers className="w-4 h-4" />,
        lessons: [
          { id: "vl-l14", title: "RTL Coding Guidelines", duration: "15 min", type: "video" },
          { id: "vl-l15", title: "Synthesis Flow & Tools", duration: "20 min", type: "video" },
          { id: "vl-l16", title: "Timing Constraints & STA", duration: "25 min", type: "exercise" },
        ],
      },
      {
        id: "vl-m5", title: "Physical Design", description: "Floorplanning, placement, routing, and signoff", color: "bg-violet-500",
        icon: <Layers className="w-4 h-4" />,
        lessons: [
          { id: "vl-l17", title: "Floorplanning & Power Planning", duration: "20 min", type: "video" },
          { id: "vl-l18", title: "Placement & Optimization", duration: "18 min", type: "video" },
          { id: "vl-l19", title: "Clock Tree Synthesis (CTS)", duration: "22 min", type: "exercise" },
          { id: "vl-l20", title: "Routing & DRC/LVS", duration: "25 min", type: "exercise" },
        ],
      },
      {
        id: "vl-m6", title: "Verification & Validation", description: "Functional verification, UVM, and coverage-driven testing", color: "bg-teal-500",
        icon: <Shield className="w-4 h-4" />,
        lessons: [
          { id: "vl-l21", title: "Verification Planning", duration: "15 min", type: "video" },
          { id: "vl-l22", title: "SystemVerilog for Verification", duration: "22 min", type: "video" },
          { id: "vl-l23", title: "UVM Framework Basics", duration: "25 min", type: "exercise" },
          { id: "vl-l24", title: "Coverage-Driven Verification", duration: "20 min", type: "exercise" },
        ],
      },
      {
        id: "vl-m7", title: "Low Power Design", description: "Power optimization techniques for modern chips", color: "bg-green-500",
        icon: <Zap className="w-4 h-4" />,
        lessons: [
          { id: "vl-l25", title: "Power Dissipation Sources", duration: "15 min", type: "video" },
          { id: "vl-l26", title: "Multi-Vt & Power Gating", duration: "20 min", type: "video" },
          { id: "vl-l27", title: "Dynamic Voltage Scaling", duration: "18 min", type: "exercise" },
        ],
      },
      {
        id: "vl-m8", title: "Analog & Mixed-Signal Basics", description: "Introduction to analog design within VLSI", color: "bg-pink-500",
        icon: <TrendingUp className="w-4 h-4" />,
        lessons: [
          { id: "vl-l28", title: "Op-Amps & Amplifier Design", duration: "20 min", type: "video" },
          { id: "vl-l29", title: "ADC/DAC Converters", duration: "18 min", type: "video" },
          { id: "vl-l30", title: "PLL & Clock Generation", duration: "22 min", type: "exercise" },
        ],
      },
      {
        id: "vl-m9", title: "FPGA Prototyping", description: "FPGA-based design prototyping and validation", color: "bg-cyan-500",
        icon: <Rocket className="w-4 h-4" />,
        lessons: [
          { id: "vl-l31", title: "FPGA Architecture Overview", duration: "15 min", type: "video" },
          { id: "vl-l32", title: "FPGA Development Flow", duration: "20 min", type: "exercise" },
          { id: "vl-l33", title: "Implement a CPU on FPGA", duration: "40 min", type: "project" },
        ],
      },
      {
        id: "vl-m10", title: "Capstone: SoC Design Project", description: "Design a complete System-on-Chip from spec to GDSII", color: "bg-gray-900",
        icon: <Award className="w-4 h-4" />,
        lessons: [
          { id: "vl-l34", title: "SoC Architecture Planning", duration: "15 min", type: "video" },
          { id: "vl-l35", title: "Full Chip Implementation", duration: "60 min", type: "project" },
          { id: "vl-l36", title: "Signoff & Tapeout Review", duration: "20 min", type: "quiz" },
        ],
      },
    ],
  },
  {
    id: "mc3",
    title: "Embedded Systems",
    shortTitle: "Embedded",
    description: "Build real-time embedded systems with microcontrollers. Learn ARM architecture, RTOS, peripheral programming, and IoT integration.",
    color: "text-emerald-600",
    bgColor: "bg-emerald-500",
    icon: <Zap className="w-5 h-5" />,
    category: "Hardware",
    difficulty: "Intermediate",
    duration: "48 hours",
    enrolled: false,
    progress: 0,
    modules: [
      {
        id: "es-m1", title: "Embedded Systems Fundamentals", description: "Core concepts, architecture, and development environment", color: "bg-emerald-500",
        icon: <Sparkles className="w-4 h-4" />,
        lessons: [
          { id: "es-l1", title: "What are Embedded Systems?", duration: "10 min", type: "video" },
          { id: "es-l2", title: "Microcontroller vs Microprocessor", duration: "12 min", type: "video" },
          { id: "es-l3", title: "Development Environment Setup", duration: "15 min", type: "exercise" },
        ],
      },
      {
        id: "es-m2", title: "ARM Architecture", description: "ARM Cortex-M series processor architecture", color: "bg-green-500",
        icon: <Layers className="w-4 h-4" />,
        lessons: [
          { id: "es-l4", title: "ARM Cortex-M Overview", duration: "18 min", type: "video" },
          { id: "es-l5", title: "Registers & Memory Map", duration: "15 min", type: "video" },
          { id: "es-l6", title: "Instruction Set Basics", duration: "20 min", type: "exercise" },
          { id: "es-l7", title: "Exception & Interrupt Model", duration: "22 min", type: "video" },
        ],
      },
      {
        id: "es-m3", title: "C for Embedded", description: "Embedded C programming — bit manipulation, volatile, pointers", color: "bg-teal-500",
        icon: <Code className="w-4 h-4" />,
        lessons: [
          { id: "es-l8", title: "Pointers & Memory", duration: "18 min", type: "video" },
          { id: "es-l9", title: "Bit Manipulation Techniques", duration: "15 min", type: "exercise" },
          { id: "es-l10", title: "Volatile, Static & Const", duration: "12 min", type: "video" },
          { id: "es-l11", title: "Structs & Unions for Registers", duration: "18 min", type: "exercise" },
        ],
      },
      {
        id: "es-m4", title: "GPIO & Peripheral Programming", description: "Configure and use digital I/O, timers, and ADCs", color: "bg-blue-500",
        icon: <Zap className="w-4 h-4" />,
        lessons: [
          { id: "es-l12", title: "GPIO Configuration & Control", duration: "15 min", type: "video" },
          { id: "es-l13", title: "Timer/Counter Programming", duration: "20 min", type: "exercise" },
          { id: "es-l14", title: "ADC & DAC Interfacing", duration: "18 min", type: "exercise" },
          { id: "es-l15", title: "PWM Generation", duration: "15 min", type: "exercise" },
        ],
      },
      {
        id: "es-m5", title: "Communication Protocols", description: "UART, SPI, I2C, CAN bus communication", color: "bg-indigo-500",
        icon: <MessageSquare className="w-4 h-4" />,
        lessons: [
          { id: "es-l16", title: "UART Communication", duration: "15 min", type: "video" },
          { id: "es-l17", title: "SPI Protocol & Implementation", duration: "18 min", type: "exercise" },
          { id: "es-l18", title: "I2C Protocol Deep Dive", duration: "20 min", type: "video" },
          { id: "es-l19", title: "CAN Bus for Automotive", duration: "18 min", type: "video" },
          { id: "es-l20", title: "Protocol Lab Challenge", duration: "15 min", type: "quiz" },
        ],
      },
      {
        id: "es-m6", title: "Interrupts & DMA", description: "Interrupt handling, priorities, and DMA transfers", color: "bg-violet-500",
        icon: <Zap className="w-4 h-4" />,
        lessons: [
          { id: "es-l21", title: "Interrupt Vector Table & NVIC", duration: "18 min", type: "video" },
          { id: "es-l22", title: "Interrupt Service Routines", duration: "15 min", type: "exercise" },
          { id: "es-l23", title: "DMA Configuration & Channels", duration: "20 min", type: "exercise" },
        ],
      },
      {
        id: "es-m7", title: "RTOS Fundamentals", description: "Real-time operating systems — FreeRTOS, tasks, scheduling", color: "bg-amber-500",
        icon: <Clock className="w-4 h-4" />,
        lessons: [
          { id: "es-l24", title: "RTOS Concepts & Scheduling", duration: "18 min", type: "video" },
          { id: "es-l25", title: "Tasks, Queues & Semaphores", duration: "22 min", type: "video" },
          { id: "es-l26", title: "FreeRTOS Hands-on", duration: "30 min", type: "exercise" },
          { id: "es-l27", title: "Mutex & Priority Inversion", duration: "15 min", type: "video" },
        ],
      },
      {
        id: "es-m8", title: "Sensor & Actuator Interfacing", description: "Work with real-world sensors and motors", color: "bg-orange-500",
        icon: <TrendingUp className="w-4 h-4" />,
        lessons: [
          { id: "es-l28", title: "Temperature & Humidity Sensors", duration: "15 min", type: "exercise" },
          { id: "es-l29", title: "IMU & Accelerometer", duration: "18 min", type: "exercise" },
          { id: "es-l30", title: "Motor Control (Stepper & Servo)", duration: "20 min", type: "exercise" },
        ],
      },
      {
        id: "es-m9", title: "IoT & Wireless", description: "WiFi, BLE, MQTT, and cloud connectivity", color: "bg-cyan-500",
        icon: <Globe className="w-4 h-4" />,
        lessons: [
          { id: "es-l31", title: "WiFi with ESP32", duration: "18 min", type: "video" },
          { id: "es-l32", title: "BLE Communication", duration: "15 min", type: "video" },
          { id: "es-l33", title: "MQTT Protocol & Cloud", duration: "22 min", type: "exercise" },
        ],
      },
      {
        id: "es-m10", title: "Capstone: IoT Weather Station", description: "Build a complete IoT device from hardware to cloud", color: "bg-gray-900",
        icon: <Award className="w-4 h-4" />,
        lessons: [
          { id: "es-l34", title: "Hardware Design & Assembly", duration: "20 min", type: "video" },
          { id: "es-l35", title: "Firmware Development", duration: "50 min", type: "project" },
          { id: "es-l36", title: "Cloud Dashboard & Demo", duration: "20 min", type: "quiz" },
        ],
      },
    ],
  },
  {
    id: "mc4",
    title: "UX Design",
    shortTitle: "UX Design",
    description: "Design user-centered digital experiences. Master research, wireframing, prototyping, usability testing, and design systems.",
    color: "text-violet-600",
    bgColor: "bg-violet-500",
    icon: <Lightbulb className="w-5 h-5" />,
    category: "Design",
    difficulty: "Beginner",
    duration: "38 hours",
    enrolled: true,
    progress: 62,
    modules: [
      {
        id: "ux-m1", title: "Introduction to UX Design", description: "What is UX, design thinking, and the role of a UX designer", color: "bg-violet-500",
        icon: <Sparkles className="w-4 h-4" />,
        lessons: [
          { id: "ux-l1", title: "What is UX Design?", duration: "10 min", type: "video" },
          { id: "ux-l2", title: "Design Thinking Process", duration: "15 min", type: "video" },
          { id: "ux-l3", title: "UX vs UI vs Product Design", duration: "8 min", type: "reading" },
        ],
      },
      {
        id: "ux-m2", title: "User Research", description: "Interviews, surveys, personas, and empathy mapping", color: "bg-purple-500",
        icon: <Users className="w-4 h-4" />,
        lessons: [
          { id: "ux-l4", title: "Research Methods Overview", duration: "14 min", type: "video" },
          { id: "ux-l5", title: "Conducting User Interviews", duration: "18 min", type: "video" },
          { id: "ux-l6", title: "Creating Personas", duration: "20 min", type: "exercise" },
          { id: "ux-l7", title: "Empathy & Journey Mapping", duration: "18 min", type: "exercise" },
        ],
      },
      {
        id: "ux-m3", title: "Information Architecture", description: "Content structure, navigation patterns, and card sorting", color: "bg-indigo-500",
        icon: <Layers className="w-4 h-4" />,
        lessons: [
          { id: "ux-l8", title: "IA Principles & Sitemaps", duration: "15 min", type: "video" },
          { id: "ux-l9", title: "Card Sorting Workshop", duration: "20 min", type: "exercise" },
          { id: "ux-l10", title: "Navigation Patterns", duration: "12 min", type: "video" },
        ],
      },
      {
        id: "ux-m4", title: "Wireframing & Sketching", description: "Low-fidelity wireframes and rapid ideation", color: "bg-blue-500",
        icon: <PenLine className="w-4 h-4" />,
        lessons: [
          { id: "ux-l11", title: "Sketching Techniques", duration: "12 min", type: "video" },
          { id: "ux-l12", title: "Low-Fi Wireframing", duration: "18 min", type: "exercise" },
          { id: "ux-l13", title: "Wireframe to Mid-Fi", duration: "20 min", type: "exercise" },
          { id: "ux-l14", title: "Quiz: Wireframing", duration: "8 min", type: "quiz" },
        ],
      },
      {
        id: "ux-m5", title: "Prototyping in Figma", description: "High-fidelity prototypes with interactions", color: "bg-pink-500",
        icon: <Rocket className="w-4 h-4" />,
        lessons: [
          { id: "ux-l15", title: "Figma Basics for UX", duration: "15 min", type: "video" },
          { id: "ux-l16", title: "Components & Auto Layout", duration: "20 min", type: "exercise" },
          { id: "ux-l17", title: "Interactive Prototyping", duration: "25 min", type: "exercise" },
          { id: "ux-l18", title: "Micro-interactions & Animation", duration: "18 min", type: "video" },
        ],
      },
      {
        id: "ux-m6", title: "Visual Design Foundations", description: "Typography, color theory, spacing, and visual hierarchy", color: "bg-rose-500",
        icon: <Eye className="w-4 h-4" />,
        lessons: [
          { id: "ux-l19", title: "Typography & Readability", duration: "14 min", type: "video" },
          { id: "ux-l20", title: "Color Theory for UI", duration: "12 min", type: "video" },
          { id: "ux-l21", title: "Layout, Spacing & Grid Systems", duration: "18 min", type: "exercise" },
        ],
      },
      {
        id: "ux-m7", title: "Usability Testing", description: "Plan, conduct, and analyze usability tests", color: "bg-amber-500",
        icon: <UserCheck className="w-4 h-4" />,
        lessons: [
          { id: "ux-l22", title: "Test Planning & Script Writing", duration: "15 min", type: "video" },
          { id: "ux-l23", title: "Moderated vs Unmoderated Testing", duration: "12 min", type: "video" },
          { id: "ux-l24", title: "Analyzing Test Results", duration: "20 min", type: "exercise" },
          { id: "ux-l25", title: "Iterating Based on Feedback", duration: "15 min", type: "exercise" },
        ],
      },
      {
        id: "ux-m8", title: "Accessibility & Inclusive Design", description: "WCAG guidelines and designing for everyone", color: "bg-teal-500",
        icon: <Heart className="w-4 h-4" />,
        lessons: [
          { id: "ux-l26", title: "WCAG Standards & Guidelines", duration: "15 min", type: "video" },
          { id: "ux-l27", title: "Screen Readers & Assistive Tech", duration: "12 min", type: "video" },
          { id: "ux-l28", title: "Accessibility Audit Exercise", duration: "25 min", type: "exercise" },
        ],
      },
      {
        id: "ux-m9", title: "Design Systems", description: "Building and maintaining scalable design systems", color: "bg-cyan-500",
        icon: <Layers className="w-4 h-4" />,
        lessons: [
          { id: "ux-l29", title: "What is a Design System?", duration: "12 min", type: "video" },
          { id: "ux-l30", title: "Tokens, Components & Patterns", duration: "18 min", type: "video" },
          { id: "ux-l31", title: "Build a Mini Design System", duration: "30 min", type: "project" },
        ],
      },
      {
        id: "ux-m10", title: "Capstone: Redesign a Product", description: "End-to-end UX case study from research to prototype", color: "bg-gray-900",
        icon: <Award className="w-4 h-4" />,
        lessons: [
          { id: "ux-l32", title: "Research & Problem Definition", duration: "15 min", type: "video" },
          { id: "ux-l33", title: "Design & Prototype", duration: "45 min", type: "project" },
          { id: "ux-l34", title: "Presentation & Critique", duration: "20 min", type: "quiz" },
        ],
      },
    ],
  },
  {
    id: "mc5",
    title: "Back End Development",
    shortTitle: "Back End",
    description: "Build scalable server-side applications with Node.js, databases, APIs, authentication, and cloud deployment.",
    color: "text-amber-600",
    bgColor: "bg-amber-500",
    icon: <Code className="w-5 h-5" />,
    category: "Engineering",
    difficulty: "Intermediate",
    duration: "52 hours",
    enrolled: false,
    progress: 0,
    modules: [
      {
        id: "be-m1", title: "Backend Fundamentals", description: "How the web works, HTTP, REST, and server basics", color: "bg-amber-500",
        icon: <Sparkles className="w-4 h-4" />,
        lessons: [
          { id: "be-l1", title: "How the Web Works", duration: "12 min", type: "video" },
          { id: "be-l2", title: "HTTP Methods & Status Codes", duration: "10 min", type: "video" },
          { id: "be-l3", title: "REST API Principles", duration: "15 min", type: "reading" },
          { id: "be-l4", title: "Quiz: Web Fundamentals", duration: "8 min", type: "quiz" },
        ],
      },
      {
        id: "be-m2", title: "Node.js & Express", description: "Server setup, routing, and middleware", color: "bg-yellow-500",
        icon: <Code className="w-4 h-4" />,
        lessons: [
          { id: "be-l5", title: "Node.js Runtime & Event Loop", duration: "15 min", type: "video" },
          { id: "be-l6", title: "Express Setup & Routing", duration: "18 min", type: "exercise" },
          { id: "be-l7", title: "Middleware & Error Handling", duration: "20 min", type: "exercise" },
          { id: "be-l8", title: "Build a REST API", duration: "25 min", type: "project" },
        ],
      },
      {
        id: "be-m3", title: "Databases — SQL", description: "PostgreSQL, schema design, queries, and migrations", color: "bg-blue-500",
        icon: <Layers className="w-4 h-4" />,
        lessons: [
          { id: "be-l9", title: "Relational DB Concepts", duration: "14 min", type: "video" },
          { id: "be-l10", title: "PostgreSQL Setup & SQL Queries", duration: "20 min", type: "exercise" },
          { id: "be-l11", title: "Schema Design & Normalization", duration: "18 min", type: "video" },
          { id: "be-l12", title: "ORMs: Prisma & Drizzle", duration: "22 min", type: "exercise" },
        ],
      },
      {
        id: "be-m4", title: "Databases — NoSQL", description: "MongoDB, Redis, and choosing the right database", color: "bg-emerald-500",
        icon: <Layers className="w-4 h-4" />,
        lessons: [
          { id: "be-l13", title: "NoSQL Concepts & MongoDB", duration: "15 min", type: "video" },
          { id: "be-l14", title: "CRUD Operations with Mongoose", duration: "20 min", type: "exercise" },
          { id: "be-l15", title: "Redis for Caching", duration: "15 min", type: "video" },
          { id: "be-l16", title: "SQL vs NoSQL Decision Framework", duration: "10 min", type: "reading" },
        ],
      },
      {
        id: "be-m5", title: "Authentication & Security", description: "JWT, OAuth, password hashing, and security best practices", color: "bg-rose-500",
        icon: <Shield className="w-4 h-4" />,
        lessons: [
          { id: "be-l17", title: "Authentication vs Authorization", duration: "12 min", type: "video" },
          { id: "be-l18", title: "JWT & Session-based Auth", duration: "20 min", type: "exercise" },
          { id: "be-l19", title: "OAuth 2.0 & Social Login", duration: "22 min", type: "exercise" },
          { id: "be-l20", title: "Security Best Practices (OWASP)", duration: "15 min", type: "video" },
          { id: "be-l21", title: "Quiz: Security", duration: "10 min", type: "quiz" },
        ],
      },
      {
        id: "be-m6", title: "API Design & GraphQL", description: "RESTful API design, versioning, and GraphQL basics", color: "bg-violet-500",
        icon: <MessageSquare className="w-4 h-4" />,
        lessons: [
          { id: "be-l22", title: "API Design Best Practices", duration: "15 min", type: "video" },
          { id: "be-l23", title: "API Versioning & Documentation", duration: "12 min", type: "video" },
          { id: "be-l24", title: "GraphQL Fundamentals", duration: "20 min", type: "exercise" },
          { id: "be-l25", title: "Build a GraphQL API", duration: "25 min", type: "project" },
        ],
      },
      {
        id: "be-m7", title: "Testing & Debugging", description: "Unit tests, integration tests, and debugging strategies", color: "bg-teal-500",
        icon: <Target className="w-4 h-4" />,
        lessons: [
          { id: "be-l26", title: "Testing Fundamentals & Jest", duration: "15 min", type: "video" },
          { id: "be-l27", title: "API Testing with Supertest", duration: "18 min", type: "exercise" },
          { id: "be-l28", title: "Integration & E2E Tests", duration: "20 min", type: "exercise" },
        ],
      },
      {
        id: "be-m8", title: "Cloud & DevOps Basics", description: "Docker, CI/CD, and deploying to AWS/GCP", color: "bg-orange-500",
        icon: <Globe className="w-4 h-4" />,
        lessons: [
          { id: "be-l29", title: "Docker Fundamentals", duration: "18 min", type: "video" },
          { id: "be-l30", title: "CI/CD Pipelines", duration: "15 min", type: "video" },
          { id: "be-l31", title: "Deploying to AWS", duration: "25 min", type: "exercise" },
          { id: "be-l32", title: "Monitoring & Logging", duration: "12 min", type: "video" },
        ],
      },
      {
        id: "be-m9", title: "Scaling & Performance", description: "Caching, load balancing, and microservices", color: "bg-pink-500",
        icon: <TrendingUp className="w-4 h-4" />,
        lessons: [
          { id: "be-l33", title: "Caching Strategies", duration: "15 min", type: "video" },
          { id: "be-l34", title: "Load Balancing & Horizontal Scaling", duration: "18 min", type: "video" },
          { id: "be-l35", title: "Intro to Microservices", duration: "20 min", type: "video" },
        ],
      },
      {
        id: "be-m10", title: "Capstone: Full-Stack API", description: "Build a production-ready API with auth, DB, and deployment", color: "bg-gray-900",
        icon: <Award className="w-4 h-4" />,
        lessons: [
          { id: "be-l36", title: "Architecture & Planning", duration: "15 min", type: "video" },
          { id: "be-l37", title: "Build the Full API", duration: "60 min", type: "project" },
          { id: "be-l38", title: "Deploy & Code Review", duration: "20 min", type: "quiz" },
        ],
      },
    ],
  },
  {
    id: "mc6",
    title: "Software Architecture",
    shortTitle: "Architecture",
    description: "Design large-scale systems with clean architecture, design patterns, domain-driven design, and distributed systems principles.",
    color: "text-gray-700",
    bgColor: "bg-gray-800",
    icon: <Layers className="w-5 h-5" />,
    category: "Engineering",
    difficulty: "Advanced",
    duration: "46 hours",
    enrolled: true,
    progress: 8,
    modules: [
      {
        id: "sa-m1", title: "Foundations of Architecture", description: "What is software architecture and why it matters", color: "bg-gray-700",
        icon: <Sparkles className="w-4 h-4" />,
        lessons: [
          { id: "sa-l1", title: "What is Software Architecture?", duration: "12 min", type: "video" },
          { id: "sa-l2", title: "Architecture vs Design", duration: "10 min", type: "video" },
          { id: "sa-l3", title: "Quality Attributes & Trade-offs", duration: "15 min", type: "reading" },
        ],
      },
      {
        id: "sa-m2", title: "Design Patterns", description: "Essential GoF patterns and when to use them", color: "bg-slate-600",
        icon: <Target className="w-4 h-4" />,
        lessons: [
          { id: "sa-l4", title: "Creational Patterns", duration: "18 min", type: "video" },
          { id: "sa-l5", title: "Structural Patterns", duration: "18 min", type: "video" },
          { id: "sa-l6", title: "Behavioral Patterns", duration: "20 min", type: "video" },
          { id: "sa-l7", title: "Patterns in Practice", duration: "25 min", type: "exercise" },
          { id: "sa-l8", title: "Quiz: Design Patterns", duration: "10 min", type: "quiz" },
        ],
      },
      {
        id: "sa-m3", title: "Clean Architecture", description: "Uncle Bob's clean architecture and SOLID principles", color: "bg-blue-600",
        icon: <Layers className="w-4 h-4" />,
        lessons: [
          { id: "sa-l9", title: "SOLID Principles Deep Dive", duration: "22 min", type: "video" },
          { id: "sa-l10", title: "Dependency Inversion in Practice", duration: "18 min", type: "exercise" },
          { id: "sa-l11", title: "Hexagonal Architecture", duration: "20 min", type: "video" },
          { id: "sa-l12", title: "Clean Architecture Layers", duration: "22 min", type: "exercise" },
        ],
      },
      {
        id: "sa-m4", title: "Domain-Driven Design", description: "Bounded contexts, aggregates, and ubiquitous language", color: "bg-violet-600",
        icon: <BookOpen className="w-4 h-4" />,
        lessons: [
          { id: "sa-l13", title: "Strategic DDD: Bounded Contexts", duration: "20 min", type: "video" },
          { id: "sa-l14", title: "Tactical DDD: Entities & Value Objects", duration: "18 min", type: "video" },
          { id: "sa-l15", title: "Aggregates & Repositories", duration: "22 min", type: "exercise" },
          { id: "sa-l16", title: "Event Storming Workshop", duration: "25 min", type: "exercise" },
        ],
      },
      {
        id: "sa-m5", title: "Microservices Architecture", description: "Decomposition strategies, communication, and data management", color: "bg-emerald-600",
        icon: <Globe className="w-4 h-4" />,
        lessons: [
          { id: "sa-l17", title: "Monolith vs Microservices", duration: "15 min", type: "video" },
          { id: "sa-l18", title: "Service Decomposition", duration: "18 min", type: "video" },
          { id: "sa-l19", title: "Inter-Service Communication", duration: "22 min", type: "exercise" },
          { id: "sa-l20", title: "Data Consistency Patterns (Saga)", duration: "20 min", type: "video" },
        ],
      },
      {
        id: "sa-m6", title: "Event-Driven Architecture", description: "Event sourcing, CQRS, and message brokers", color: "bg-amber-600",
        icon: <Zap className="w-4 h-4" />,
        lessons: [
          { id: "sa-l21", title: "Event-Driven Concepts", duration: "15 min", type: "video" },
          { id: "sa-l22", title: "Event Sourcing & CQRS", duration: "22 min", type: "video" },
          { id: "sa-l23", title: "Kafka & Message Brokers", duration: "20 min", type: "exercise" },
        ],
      },
      {
        id: "sa-m7", title: "System Design", description: "Design interviews prep — URL shortener, chat system, etc.", color: "bg-rose-600",
        icon: <Brain className="w-4 h-4" />,
        lessons: [
          { id: "sa-l24", title: "System Design Framework", duration: "15 min", type: "video" },
          { id: "sa-l25", title: "Design a URL Shortener", duration: "25 min", type: "exercise" },
          { id: "sa-l26", title: "Design a Chat System", duration: "30 min", type: "exercise" },
          { id: "sa-l27", title: "Design a Feed System", duration: "25 min", type: "exercise" },
        ],
      },
      {
        id: "sa-m8", title: "Distributed Systems", description: "CAP theorem, consensus, and distributed data", color: "bg-teal-600",
        icon: <Globe className="w-4 h-4" />,
        lessons: [
          { id: "sa-l28", title: "CAP Theorem & Consistency Models", duration: "18 min", type: "video" },
          { id: "sa-l29", title: "Consensus Algorithms (Raft, Paxos)", duration: "22 min", type: "video" },
          { id: "sa-l30", title: "Distributed Caching & Storage", duration: "20 min", type: "exercise" },
        ],
      },
      {
        id: "sa-m9", title: "Architecture Documentation", description: "C4 model, ADRs, and communicating architecture", color: "bg-indigo-600",
        icon: <FileText className="w-4 h-4" />,
        lessons: [
          { id: "sa-l31", title: "C4 Model & Diagrams", duration: "15 min", type: "video" },
          { id: "sa-l32", title: "Architecture Decision Records", duration: "12 min", type: "video" },
          { id: "sa-l33", title: "Document Your Architecture", duration: "25 min", type: "project" },
        ],
      },
      {
        id: "sa-m10", title: "Capstone: Architect a Platform", description: "Design a complete system architecture for a real-world platform", color: "bg-gray-900",
        icon: <Award className="w-4 h-4" />,
        lessons: [
          { id: "sa-l34", title: "Requirements & Constraints", duration: "15 min", type: "video" },
          { id: "sa-l35", title: "Architecture Design & Review", duration: "50 min", type: "project" },
          { id: "sa-l36", title: "Presentation & Feedback", duration: "20 min", type: "quiz" },
        ],
      },
    ],
  },
  {
    id: "mc7",
    title: "Artificial Intelligence & Machine Learning",
    shortTitle: "AI / ML",
    description: "From neural networks to NLP and computer vision — build intelligent systems with Python, TensorFlow, and PyTorch.",
    color: "text-purple-600",
    bgColor: "bg-purple-600",
    icon: <Brain className="w-5 h-5" />,
    category: "Computer Science",
    difficulty: "Advanced",
    duration: "54 hours",
    enrolled: false,
    progress: 0,
    modules: [
      { id: "ai-m1", title: "Foundations of AI & ML", description: "History, types of learning, and the ML pipeline", color: "bg-purple-500", icon: <Sparkles className="w-4 h-4" />, lessons: [
        { id: "ai-l1", title: "What is AI vs ML vs Deep Learning?", duration: "12 min", type: "video" },
        { id: "ai-l2", title: "Supervised, Unsupervised & Reinforcement", duration: "15 min", type: "video" },
        { id: "ai-l3", title: "The ML Project Lifecycle", duration: "10 min", type: "reading" },
      ]},
      { id: "ai-m2", title: "Mathematics for ML", description: "Linear algebra, calculus, probability & statistics essentials", color: "bg-violet-500", icon: <Target className="w-4 h-4" />, lessons: [
        { id: "ai-l4", title: "Linear Algebra Refresher", duration: "18 min", type: "video" },
        { id: "ai-l5", title: "Calculus & Gradient Descent", duration: "20 min", type: "video" },
        { id: "ai-l6", title: "Probability & Bayes Theorem", duration: "15 min", type: "exercise" },
      ]},
      { id: "ai-m3", title: "Classical ML Algorithms", description: "Regression, trees, SVM, k-NN, and ensemble methods", color: "bg-indigo-500", icon: <TrendingUp className="w-4 h-4" />, lessons: [
        { id: "ai-l7", title: "Linear & Logistic Regression", duration: "18 min", type: "video" },
        { id: "ai-l8", title: "Decision Trees & Random Forests", duration: "20 min", type: "exercise" },
        { id: "ai-l9", title: "SVM & k-NN Classifiers", duration: "18 min", type: "exercise" },
        { id: "ai-l10", title: "Model Evaluation & Cross-Validation", duration: "15 min", type: "quiz" },
      ]},
      { id: "ai-m4", title: "Deep Learning & Neural Networks", description: "Feed-forward, CNN, RNN, and Transformers", color: "bg-fuchsia-500", icon: <Brain className="w-4 h-4" />, lessons: [
        { id: "ai-l11", title: "Perceptrons & Backpropagation", duration: "20 min", type: "video" },
        { id: "ai-l12", title: "CNNs for Image Recognition", duration: "22 min", type: "exercise" },
        { id: "ai-l13", title: "RNNs, LSTMs & Attention", duration: "25 min", type: "video" },
        { id: "ai-l14", title: "Transformers & BERT Overview", duration: "18 min", type: "video" },
      ]},
      { id: "ai-m5", title: "Capstone: Build an AI Application", description: "End-to-end ML project from data to deployment", color: "bg-gray-900", icon: <Award className="w-4 h-4" />, lessons: [
        { id: "ai-l15", title: "Problem Framing & Data Prep", duration: "15 min", type: "video" },
        { id: "ai-l16", title: "Train, Tune & Evaluate", duration: "45 min", type: "project" },
        { id: "ai-l17", title: "Deploy with Flask / FastAPI", duration: "20 min", type: "project" },
      ]},
    ],
  },
  {
    id: "mc8",
    title: "Cybersecurity",
    shortTitle: "CyberSec",
    description: "Protect systems and networks from cyber threats. Learn ethical hacking, cryptography, network security, and incident response.",
    color: "text-red-600",
    bgColor: "bg-red-600",
    icon: <Shield className="w-5 h-5" />,
    category: "Information Technology",
    difficulty: "Intermediate",
    duration: "44 hours",
    enrolled: false,
    progress: 0,
    modules: [
      { id: "cy-m1", title: "Cybersecurity Fundamentals", description: "CIA triad, threat landscape, and security frameworks", color: "bg-red-500", icon: <Sparkles className="w-4 h-4" />, lessons: [
        { id: "cy-l1", title: "The CIA Triad & Security Principles", duration: "12 min", type: "video" },
        { id: "cy-l2", title: "Common Threats & Attack Vectors", duration: "15 min", type: "video" },
        { id: "cy-l3", title: "Security Frameworks (NIST, ISO 27001)", duration: "10 min", type: "reading" },
      ]},
      { id: "cy-m2", title: "Network Security", description: "Firewalls, IDS/IPS, VPNs, and network monitoring", color: "bg-orange-500", icon: <Wifi className="w-4 h-4" />, lessons: [
        { id: "cy-l4", title: "TCP/IP & Network Fundamentals", duration: "18 min", type: "video" },
        { id: "cy-l5", title: "Firewalls & IDS Configuration", duration: "22 min", type: "exercise" },
        { id: "cy-l6", title: "VPN & Secure Tunneling", duration: "15 min", type: "video" },
      ]},
      { id: "cy-m3", title: "Cryptography", description: "Symmetric, asymmetric encryption, hashing, and PKI", color: "bg-amber-500", icon: <Shield className="w-4 h-4" />, lessons: [
        { id: "cy-l7", title: "Symmetric Encryption (AES, DES)", duration: "15 min", type: "video" },
        { id: "cy-l8", title: "Asymmetric Encryption & RSA", duration: "18 min", type: "video" },
        { id: "cy-l9", title: "Hashing & Digital Signatures", duration: "20 min", type: "exercise" },
      ]},
      { id: "cy-m4", title: "Ethical Hacking & Penetration Testing", description: "Reconnaissance, exploitation, and reporting", color: "bg-rose-600", icon: <Target className="w-4 h-4" />, lessons: [
        { id: "cy-l10", title: "Penetration Testing Methodology", duration: "15 min", type: "video" },
        { id: "cy-l11", title: "Recon & Scanning (Nmap, Burp Suite)", duration: "25 min", type: "exercise" },
        { id: "cy-l12", title: "Exploitation & Post-Exploitation", duration: "22 min", type: "exercise" },
        { id: "cy-l13", title: "Writing a Pentest Report", duration: "12 min", type: "quiz" },
      ]},
      { id: "cy-m5", title: "Capstone: Security Audit", description: "Perform a full security assessment on a target system", color: "bg-gray-900", icon: <Award className="w-4 h-4" />, lessons: [
        { id: "cy-l14", title: "Audit Planning & Scope", duration: "12 min", type: "video" },
        { id: "cy-l15", title: "Conduct the Audit", duration: "45 min", type: "project" },
        { id: "cy-l16", title: "Findings & Recommendations", duration: "18 min", type: "quiz" },
      ]},
    ],
  },
  {
    id: "mc9",
    title: "Mechanical Design & CAD",
    shortTitle: "Mech CAD",
    description: "Master mechanical engineering design principles, 3D CAD modeling, FEA simulation, and manufacturing processes.",
    color: "text-orange-600",
    bgColor: "bg-orange-500",
    icon: <Wrench className="w-5 h-5" />,
    category: "Mechanical Engineering",
    difficulty: "Intermediate",
    duration: "40 hours",
    enrolled: false,
    progress: 0,
    modules: [
      { id: "me-m1", title: "Engineering Drawing & GD&T", description: "Technical drawing, tolerancing, and dimensioning standards", color: "bg-orange-500", icon: <PenLine className="w-4 h-4" />, lessons: [
        { id: "me-l1", title: "Orthographic & Isometric Views", duration: "14 min", type: "video" },
        { id: "me-l2", title: "GD&T Symbols & Datums", duration: "18 min", type: "video" },
        { id: "me-l3", title: "Reading Engineering Drawings", duration: "15 min", type: "exercise" },
      ]},
      { id: "me-m2", title: "3D CAD with SolidWorks", description: "Sketching, part modeling, assemblies, and sheet metal", color: "bg-amber-500", icon: <Layers className="w-4 h-4" />, lessons: [
        { id: "me-l4", title: "SolidWorks Interface & Sketching", duration: "18 min", type: "video" },
        { id: "me-l5", title: "Part Modeling: Extrude, Revolve, Sweep", duration: "22 min", type: "exercise" },
        { id: "me-l6", title: "Assemblies & Mates", duration: "20 min", type: "exercise" },
        { id: "me-l7", title: "Sheet Metal Design", duration: "15 min", type: "exercise" },
      ]},
      { id: "me-m3", title: "Strength of Materials", description: "Stress, strain, bending, torsion, and failure theories", color: "bg-yellow-600", icon: <Activity className="w-4 h-4" />, lessons: [
        { id: "me-l8", title: "Stress & Strain Fundamentals", duration: "15 min", type: "video" },
        { id: "me-l9", title: "Bending & Torsion Analysis", duration: "20 min", type: "video" },
        { id: "me-l10", title: "Failure Theories & Safety Factors", duration: "18 min", type: "exercise" },
      ]},
      { id: "me-m4", title: "FEA Simulation", description: "Finite Element Analysis for structural and thermal problems", color: "bg-red-500", icon: <BarChart3 className="w-4 h-4" />, lessons: [
        { id: "me-l11", title: "FEA Concepts & Meshing", duration: "18 min", type: "video" },
        { id: "me-l12", title: "Static Structural Analysis", duration: "25 min", type: "exercise" },
        { id: "me-l13", title: "Thermal & Modal Analysis", duration: "22 min", type: "exercise" },
      ]},
      { id: "me-m5", title: "Capstone: Design a Mechanical Product", description: "Complete product design from concept to manufacturing drawings", color: "bg-gray-900", icon: <Award className="w-4 h-4" />, lessons: [
        { id: "me-l14", title: "Concept Generation & Selection", duration: "15 min", type: "video" },
        { id: "me-l15", title: "Detailed Design & Simulation", duration: "40 min", type: "project" },
        { id: "me-l16", title: "Manufacturing Drawings & BOM", duration: "20 min", type: "quiz" },
      ]},
    ],
  },
  {
    id: "mc10",
    title: "Electrical Power Systems",
    shortTitle: "Power Sys",
    description: "Understand power generation, transmission, distribution, and renewable energy integration for modern electrical grids.",
    color: "text-yellow-600",
    bgColor: "bg-yellow-500",
    icon: <Zap className="w-5 h-5" />,
    category: "Electrical Engineering",
    difficulty: "Intermediate",
    duration: "42 hours",
    enrolled: false,
    progress: 0,
    modules: [
      { id: "ep-m1", title: "Power System Fundamentals", description: "AC circuits, power factor, and three-phase systems", color: "bg-yellow-500", icon: <Sparkles className="w-4 h-4" />, lessons: [
        { id: "ep-l1", title: "AC Circuit Analysis", duration: "15 min", type: "video" },
        { id: "ep-l2", title: "Three-Phase Power Systems", duration: "18 min", type: "video" },
        { id: "ep-l3", title: "Power Factor Correction", duration: "15 min", type: "exercise" },
      ]},
      { id: "ep-m2", title: "Power Generation", description: "Thermal, hydro, nuclear, and renewable energy sources", color: "bg-amber-500", icon: <Zap className="w-4 h-4" />, lessons: [
        { id: "ep-l4", title: "Thermal & Nuclear Power Plants", duration: "18 min", type: "video" },
        { id: "ep-l5", title: "Hydroelectric & Wind Energy", duration: "15 min", type: "video" },
        { id: "ep-l6", title: "Solar PV Systems & Grid Tie", duration: "20 min", type: "exercise" },
      ]},
      { id: "ep-m3", title: "Transmission & Distribution", description: "Transmission lines, transformers, and protection systems", color: "bg-orange-500", icon: <Globe className="w-4 h-4" />, lessons: [
        { id: "ep-l7", title: "Transmission Line Parameters", duration: "18 min", type: "video" },
        { id: "ep-l8", title: "Transformers: Design & Testing", duration: "20 min", type: "exercise" },
        { id: "ep-l9", title: "Protection & Relay Systems", duration: "22 min", type: "video" },
      ]},
      { id: "ep-m4", title: "Smart Grids & Renewables", description: "IoT in power, SCADA, and renewable integration", color: "bg-green-500", icon: <Cpu className="w-4 h-4" />, lessons: [
        { id: "ep-l10", title: "Smart Grid Architecture", duration: "15 min", type: "video" },
        { id: "ep-l11", title: "SCADA & IoT for Power", duration: "18 min", type: "exercise" },
        { id: "ep-l12", title: "Energy Storage & Microgrids", duration: "20 min", type: "video" },
      ]},
      { id: "ep-m5", title: "Capstone: Grid Design Project", description: "Design a power distribution system for a small township", color: "bg-gray-900", icon: <Award className="w-4 h-4" />, lessons: [
        { id: "ep-l13", title: "Load Analysis & Planning", duration: "12 min", type: "video" },
        { id: "ep-l14", title: "Design & Simulation", duration: "40 min", type: "project" },
        { id: "ep-l15", title: "Review & Optimization", duration: "18 min", type: "quiz" },
      ]},
    ],
  },
  {
    id: "mc11",
    title: "Civil & Structural Engineering",
    shortTitle: "Civil Eng",
    description: "Learn structural analysis, concrete & steel design, geotechnical engineering, and construction management fundamentals.",
    color: "text-stone-600",
    bgColor: "bg-stone-600",
    icon: <Building2 className="w-5 h-5" />,
    category: "Civil Engineering",
    difficulty: "Intermediate",
    duration: "44 hours",
    enrolled: false,
    progress: 0,
    modules: [
      { id: "ci-m1", title: "Structural Analysis", description: "Forces, moments, trusses, and beam analysis", color: "bg-stone-500", icon: <Sparkles className="w-4 h-4" />, lessons: [
        { id: "ci-l1", title: "Statics & Free Body Diagrams", duration: "14 min", type: "video" },
        { id: "ci-l2", title: "Truss Analysis Methods", duration: "18 min", type: "exercise" },
        { id: "ci-l3", title: "Shear Force & Bending Moment Diagrams", duration: "20 min", type: "exercise" },
      ]},
      { id: "ci-m2", title: "RCC Design", description: "Reinforced cement concrete design per IS / ACI codes", color: "bg-amber-700", icon: <Layers className="w-4 h-4" />, lessons: [
        { id: "ci-l4", title: "Concrete Properties & Mix Design", duration: "15 min", type: "video" },
        { id: "ci-l5", title: "Beam & Slab Design", duration: "22 min", type: "exercise" },
        { id: "ci-l6", title: "Column & Footing Design", duration: "20 min", type: "exercise" },
      ]},
      { id: "ci-m3", title: "Steel Structures", description: "Steel design, connections, and industrial buildings", color: "bg-gray-600", icon: <Building2 className="w-4 h-4" />, lessons: [
        { id: "ci-l7", title: "Steel Section Properties", duration: "12 min", type: "video" },
        { id: "ci-l8", title: "Tension & Compression Members", duration: "18 min", type: "video" },
        { id: "ci-l9", title: "Connection Design (Bolted & Welded)", duration: "20 min", type: "exercise" },
      ]},
      { id: "ci-m4", title: "Geotechnical Engineering", description: "Soil mechanics, foundations, and earth retaining structures", color: "bg-yellow-700", icon: <TrendingUp className="w-4 h-4" />, lessons: [
        { id: "ci-l10", title: "Soil Classification & Properties", duration: "15 min", type: "video" },
        { id: "ci-l11", title: "Bearing Capacity & Settlement", duration: "20 min", type: "exercise" },
        { id: "ci-l12", title: "Retaining Walls & Slope Stability", duration: "18 min", type: "video" },
      ]},
      { id: "ci-m5", title: "Capstone: Structural Design Project", description: "Design a multi-story building from foundation to roof", color: "bg-gray-900", icon: <Award className="w-4 h-4" />, lessons: [
        { id: "ci-l13", title: "Architectural Planning & Load Calc", duration: "15 min", type: "video" },
        { id: "ci-l14", title: "Structural Design & Detailing", duration: "45 min", type: "project" },
        { id: "ci-l15", title: "Presentation & Review", duration: "18 min", type: "quiz" },
      ]},
    ],
  },
  {
    id: "mc12",
    title: "Biotechnology & Genetic Engineering",
    shortTitle: "Biotech",
    description: "Explore molecular biology, genetic engineering, bioinformatics, and bioprocess engineering for modern biotech applications.",
    color: "text-lime-600",
    bgColor: "bg-lime-600",
    icon: <FlaskConical className="w-5 h-5" />,
    category: "Biotechnology",
    difficulty: "Intermediate",
    duration: "38 hours",
    enrolled: false,
    progress: 0,
    modules: [
      { id: "bt-m1", title: "Molecular Biology Essentials", description: "DNA, RNA, proteins, and the central dogma", color: "bg-lime-500", icon: <Sparkles className="w-4 h-4" />, lessons: [
        { id: "bt-l1", title: "DNA Structure & Replication", duration: "14 min", type: "video" },
        { id: "bt-l2", title: "Transcription & Translation", duration: "16 min", type: "video" },
        { id: "bt-l3", title: "Gene Regulation Mechanisms", duration: "12 min", type: "reading" },
      ]},
      { id: "bt-m2", title: "Genetic Engineering Techniques", description: "Cloning, PCR, CRISPR, and gene therapy", color: "bg-green-600", icon: <Target className="w-4 h-4" />, lessons: [
        { id: "bt-l4", title: "Restriction Enzymes & Cloning", duration: "15 min", type: "video" },
        { id: "bt-l5", title: "PCR & Gel Electrophoresis", duration: "18 min", type: "exercise" },
        { id: "bt-l6", title: "CRISPR-Cas9 Gene Editing", duration: "20 min", type: "video" },
      ]},
      { id: "bt-m3", title: "Bioinformatics", description: "Sequence analysis, phylogenetics, and computational biology", color: "bg-teal-500", icon: <Database className="w-4 h-4" />, lessons: [
        { id: "bt-l7", title: "Sequence Alignment (BLAST)", duration: "18 min", type: "exercise" },
        { id: "bt-l8", title: "Phylogenetic Trees", duration: "15 min", type: "video" },
        { id: "bt-l9", title: "Protein Structure Prediction", duration: "20 min", type: "exercise" },
      ]},
      { id: "bt-m4", title: "Bioprocess Engineering", description: "Fermentation, downstream processing, and bioreactor design", color: "bg-emerald-600", icon: <Activity className="w-4 h-4" />, lessons: [
        { id: "bt-l10", title: "Fermentation Technology", duration: "15 min", type: "video" },
        { id: "bt-l11", title: "Bioreactor Design & Scale-Up", duration: "20 min", type: "exercise" },
        { id: "bt-l12", title: "Downstream Processing", duration: "18 min", type: "video" },
      ]},
      { id: "bt-m5", title: "Capstone: Biotech Product Development", description: "Design a biotech product from gene to market", color: "bg-gray-900", icon: <Award className="w-4 h-4" />, lessons: [
        { id: "bt-l13", title: "Target Identification & Design", duration: "12 min", type: "video" },
        { id: "bt-l14", title: "Lab Workflow & Analysis", duration: "40 min", type: "project" },
        { id: "bt-l15", title: "Regulatory & Review", duration: "18 min", type: "quiz" },
      ]},
    ],
  },
  {
    id: "mc13",
    title: "Aerospace Engineering Fundamentals",
    shortTitle: "Aerospace",
    description: "Dive into aerodynamics, flight mechanics, propulsion, aircraft structures, and space systems engineering.",
    color: "text-sky-600",
    bgColor: "bg-sky-600",
    icon: <Plane className="w-5 h-5" />,
    category: "Aerospace Engineering",
    difficulty: "Advanced",
    duration: "46 hours",
    enrolled: false,
    progress: 0,
    modules: [
      { id: "ae-m1", title: "Aerodynamics", description: "Airfoils, lift & drag, boundary layers, and wind tunnels", color: "bg-sky-500", icon: <Sparkles className="w-4 h-4" />, lessons: [
        { id: "ae-l1", title: "Fluid Mechanics Review", duration: "15 min", type: "video" },
        { id: "ae-l2", title: "Airfoil Theory & Lift Generation", duration: "18 min", type: "video" },
        { id: "ae-l3", title: "Drag Types & Reduction Strategies", duration: "14 min", type: "exercise" },
      ]},
      { id: "ae-m2", title: "Flight Mechanics", description: "Equations of motion, stability, and control surfaces", color: "bg-blue-500", icon: <TrendingUp className="w-4 h-4" />, lessons: [
        { id: "ae-l4", title: "Aircraft Performance Parameters", duration: "18 min", type: "video" },
        { id: "ae-l5", title: "Static & Dynamic Stability", duration: "20 min", type: "video" },
        { id: "ae-l6", title: "Control Surfaces & Maneuvering", duration: "15 min", type: "exercise" },
      ]},
      { id: "ae-m3", title: "Propulsion Systems", description: "Jet engines, turbofans, rockets, and electric propulsion", color: "bg-orange-500", icon: <Rocket className="w-4 h-4" />, lessons: [
        { id: "ae-l7", title: "Turbojet & Turbofan Engines", duration: "20 min", type: "video" },
        { id: "ae-l8", title: "Rocket Propulsion Fundamentals", duration: "18 min", type: "video" },
        { id: "ae-l9", title: "Electric & Hybrid Propulsion", duration: "15 min", type: "exercise" },
      ]},
      { id: "ae-m4", title: "Aircraft Structures & Materials", description: "Structural analysis, composites, and fatigue life", color: "bg-indigo-500", icon: <Layers className="w-4 h-4" />, lessons: [
        { id: "ae-l10", title: "Aerospace Materials (Al, Ti, Composites)", duration: "15 min", type: "video" },
        { id: "ae-l11", title: "Thin-Walled Structures & Monocoque", duration: "20 min", type: "exercise" },
        { id: "ae-l12", title: "Fatigue & Damage Tolerance", duration: "18 min", type: "video" },
      ]},
      { id: "ae-m5", title: "Capstone: Aircraft Preliminary Design", description: "Conceptual design of a light aircraft", color: "bg-gray-900", icon: <Award className="w-4 h-4" />, lessons: [
        { id: "ae-l13", title: "Mission Requirements & Config", duration: "12 min", type: "video" },
        { id: "ae-l14", title: "Sizing, Layout & Performance", duration: "40 min", type: "project" },
        { id: "ae-l15", title: "Design Review & Presentation", duration: "18 min", type: "quiz" },
      ]},
    ],
  },
  {
    id: "mc14",
    title: "Front End Development",
    shortTitle: "Front End",
    description: "Build modern, responsive web interfaces with HTML, CSS, JavaScript, React, and performance optimization techniques.",
    color: "text-cyan-600",
    bgColor: "bg-cyan-500",
    icon: <Monitor className="w-5 h-5" />,
    category: "Engineering",
    difficulty: "Beginner",
    duration: "44 hours",
    enrolled: false,
    progress: 0,
    modules: [
      { id: "fe-m1", title: "HTML & CSS Mastery", description: "Semantic HTML, CSS layouts, Flexbox, and Grid", color: "bg-cyan-500", icon: <Sparkles className="w-4 h-4" />, lessons: [
        { id: "fe-l1", title: "Semantic HTML5 Elements", duration: "12 min", type: "video" },
        { id: "fe-l2", title: "CSS Flexbox Deep Dive", duration: "18 min", type: "exercise" },
        { id: "fe-l3", title: "CSS Grid & Responsive Design", duration: "20 min", type: "exercise" },
      ]},
      { id: "fe-m2", title: "JavaScript Essentials", description: "ES6+, DOM manipulation, async programming", color: "bg-yellow-500", icon: <Code className="w-4 h-4" />, lessons: [
        { id: "fe-l4", title: "ES6+ Features & Destructuring", duration: "15 min", type: "video" },
        { id: "fe-l5", title: "DOM Manipulation & Events", duration: "18 min", type: "exercise" },
        { id: "fe-l6", title: "Promises, Async/Await & Fetch", duration: "20 min", type: "exercise" },
        { id: "fe-l7", title: "JS Fundamentals Quiz", duration: "10 min", type: "quiz" },
      ]},
      { id: "fe-m3", title: "React Fundamentals", description: "Components, state, hooks, and the React ecosystem", color: "bg-blue-500", icon: <Layers className="w-4 h-4" />, lessons: [
        { id: "fe-l8", title: "JSX & Components", duration: "15 min", type: "video" },
        { id: "fe-l9", title: "State & Props", duration: "18 min", type: "exercise" },
        { id: "fe-l10", title: "Hooks: useState, useEffect, useRef", duration: "22 min", type: "exercise" },
        { id: "fe-l11", title: "React Router & Navigation", duration: "15 min", type: "exercise" },
      ]},
      { id: "fe-m4", title: "Styling & UI Libraries", description: "Tailwind CSS, component libraries, and animation", color: "bg-pink-500", icon: <Palette className="w-4 h-4" />, lessons: [
        { id: "fe-l12", title: "Tailwind CSS Fundamentals", duration: "18 min", type: "video" },
        { id: "fe-l13", title: "Component Libraries (shadcn/ui)", duration: "15 min", type: "exercise" },
        { id: "fe-l14", title: "Animation with Motion", duration: "20 min", type: "exercise" },
      ]},
      { id: "fe-m5", title: "Capstone: Build a Web App", description: "Create a complete React application from scratch", color: "bg-gray-900", icon: <Award className="w-4 h-4" />, lessons: [
        { id: "fe-l15", title: "Project Setup & Architecture", duration: "12 min", type: "video" },
        { id: "fe-l16", title: "Build & Style the App", duration: "45 min", type: "project" },
        { id: "fe-l17", title: "Deploy & Code Review", duration: "18 min", type: "quiz" },
      ]},
    ],
  },
  {
    id: "mc15",
    title: "Cloud Computing & DevOps",
    shortTitle: "Cloud/DevOps",
    description: "Master cloud platforms (AWS, Azure, GCP), containerization, infrastructure as code, and CI/CD pipelines.",
    color: "text-indigo-600",
    bgColor: "bg-indigo-600",
    icon: <Cloud className="w-5 h-5" />,
    category: "Information Technology",
    difficulty: "Intermediate",
    duration: "48 hours",
    enrolled: false,
    progress: 0,
    modules: [
      { id: "cl-m1", title: "Cloud Fundamentals", description: "Cloud models (IaaS, PaaS, SaaS), regions, and pricing", color: "bg-indigo-500", icon: <Cloud className="w-4 h-4" />, lessons: [
        { id: "cl-l1", title: "What is Cloud Computing?", duration: "12 min", type: "video" },
        { id: "cl-l2", title: "AWS vs Azure vs GCP Overview", duration: "15 min", type: "video" },
        { id: "cl-l3", title: "Cloud Pricing & Cost Management", duration: "10 min", type: "reading" },
      ]},
      { id: "cl-m2", title: "Containers & Kubernetes", description: "Docker, Kubernetes orchestration, and Helm charts", color: "bg-blue-600", icon: <Server className="w-4 h-4" />, lessons: [
        { id: "cl-l4", title: "Docker Deep Dive", duration: "20 min", type: "exercise" },
        { id: "cl-l5", title: "Kubernetes Architecture & Pods", duration: "22 min", type: "video" },
        { id: "cl-l6", title: "Deployments, Services & Ingress", duration: "25 min", type: "exercise" },
      ]},
      { id: "cl-m3", title: "Infrastructure as Code", description: "Terraform, CloudFormation, and Ansible", color: "bg-violet-500", icon: <Code className="w-4 h-4" />, lessons: [
        { id: "cl-l7", title: "Terraform Basics & HCL", duration: "18 min", type: "video" },
        { id: "cl-l8", title: "Provisioning AWS with Terraform", duration: "25 min", type: "exercise" },
        { id: "cl-l9", title: "Configuration Management (Ansible)", duration: "20 min", type: "exercise" },
      ]},
      { id: "cl-m4", title: "CI/CD & GitOps", description: "GitHub Actions, Jenkins, ArgoCD, and deployment strategies", color: "bg-emerald-500", icon: <Rocket className="w-4 h-4" />, lessons: [
        { id: "cl-l10", title: "CI/CD Pipeline Design", duration: "15 min", type: "video" },
        { id: "cl-l11", title: "GitHub Actions Hands-on", duration: "22 min", type: "exercise" },
        { id: "cl-l12", title: "GitOps with ArgoCD", duration: "18 min", type: "exercise" },
      ]},
      { id: "cl-m5", title: "Capstone: Deploy a Microservices App", description: "Full cloud deployment with monitoring and scaling", color: "bg-gray-900", icon: <Award className="w-4 h-4" />, lessons: [
        { id: "cl-l13", title: "Architecture & Infra Planning", duration: "12 min", type: "video" },
        { id: "cl-l14", title: "Build & Deploy Pipeline", duration: "45 min", type: "project" },
        { id: "cl-l15", title: "Monitoring, Alerts & Review", duration: "18 min", type: "quiz" },
      ]},
    ],
  },
  {
    id: "mc16",
    title: "Robotics & Automation",
    shortTitle: "Robotics",
    description: "Build autonomous robots — learn kinematics, sensors, ROS, computer vision, and path planning for real-world automation.",
    color: "text-teal-600",
    bgColor: "bg-teal-600",
    icon: <Bot className="w-5 h-5" />,
    category: "Multidisciplinary",
    difficulty: "Advanced",
    duration: "50 hours",
    enrolled: false,
    progress: 0,
    modules: [
      { id: "ro-m1", title: "Robotics Fundamentals", description: "Types of robots, kinematics, and coordinate frames", color: "bg-teal-500", icon: <Sparkles className="w-4 h-4" />, lessons: [
        { id: "ro-l1", title: "Introduction to Robotics", duration: "12 min", type: "video" },
        { id: "ro-l2", title: "Forward & Inverse Kinematics", duration: "20 min", type: "video" },
        { id: "ro-l3", title: "DH Parameters & Transformations", duration: "18 min", type: "exercise" },
      ]},
      { id: "ro-m2", title: "Sensors & Actuators", description: "LIDAR, cameras, IMUs, and motor control", color: "bg-green-600", icon: <Cpu className="w-4 h-4" />, lessons: [
        { id: "ro-l4", title: "Sensor Types & Selection", duration: "15 min", type: "video" },
        { id: "ro-l5", title: "LIDAR & Point Clouds", duration: "18 min", type: "exercise" },
        { id: "ro-l6", title: "Motor Drivers & PID Control", duration: "22 min", type: "exercise" },
      ]},
      { id: "ro-m3", title: "ROS (Robot Operating System)", description: "Nodes, topics, services, and robot simulation", color: "bg-blue-600", icon: <Server className="w-4 h-4" />, lessons: [
        { id: "ro-l7", title: "ROS2 Architecture & Setup", duration: "18 min", type: "video" },
        { id: "ro-l8", title: "Publishers, Subscribers & Services", duration: "22 min", type: "exercise" },
        { id: "ro-l9", title: "Gazebo Simulation", duration: "25 min", type: "exercise" },
      ]},
      { id: "ro-m4", title: "Computer Vision for Robotics", description: "Object detection, SLAM, and visual navigation", color: "bg-violet-600", icon: <Eye className="w-4 h-4" />, lessons: [
        { id: "ro-l10", title: "OpenCV Basics for Robotics", duration: "18 min", type: "exercise" },
        { id: "ro-l11", title: "Object Detection with YOLO", duration: "22 min", type: "video" },
        { id: "ro-l12", title: "SLAM & Mapping", duration: "25 min", type: "exercise" },
      ]},
      { id: "ro-m5", title: "Capstone: Autonomous Robot", description: "Build an autonomous navigating robot from scratch", color: "bg-gray-900", icon: <Award className="w-4 h-4" />, lessons: [
        { id: "ro-l13", title: "System Design & Sensor Fusion", duration: "15 min", type: "video" },
        { id: "ro-l14", title: "Build & Program the Robot", duration: "50 min", type: "project" },
        { id: "ro-l15", title: "Demo & Evaluation", duration: "18 min", type: "quiz" },
      ]},
    ],
  },
];
