import json

# Read data from generate_catalog.py
import sys
sys.path.append("/Users/karthiktalluri/Documents/Mentorhub/mentorhubweb/scratch")
from generate_catalog import cs_courses, ece_courses

header = """import React from "react";
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
  Terminal,
  Radio,
  CircuitBoard,
  GitBranch,
  Smartphone,
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
  domain?: "Computer Science" | "Electronics & ECE" | "Other";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  modules: MentorModule[];
  enrolled: boolean;
  progress: number;
  keywords?: string[];
}

export const mentorCoursesCatalog: MentorCourse[] = [
"""

footer = """];\n"""

def slugify(text):
    return text.lower().replace(" ", "-").replace("&", "and").replace("+", "p").replace("/", "-").replace(".", "dot").replace("(", "").replace(")", "")

courses_ts = []

# Process Computer Science courses
for i, item in enumerate(cs_courses, 1):
    title, shortTitle, desc, bgColor, color, icon_name, difficulty, duration, keywords = item
    course_id = f"cs-{slugify(title)}"
    mod_id_prefix = f"cs-{i}"
    
    course_code = f"""  {{
    id: "{course_id}",
    title: "{title}",
    shortTitle: "{shortTitle}",
    description: "{desc}",
    color: "{color}",
    bgColor: "{bgColor}",
    icon: <{icon_name} className="w-5 h-5" />,
    category: "Computer Science",
    domain: "Computer Science",
    difficulty: "{difficulty}",
    duration: "{duration}",
    enrolled: false,
    progress: 0,
    keywords: {json.dumps(keywords)},
    modules: [
      {{
        id: "{mod_id_prefix}-m1", title: "Foundations & Core Principles of {shortTitle}", description: "Introduction, core concepts, environment setup, and fundamental syntax", color: "{bgColor}",
        icon: <Sparkles className="w-4 h-4" />,
        lessons: [
          {{ id: "{mod_id_prefix}-l1", title: "Introduction & Overview of {title}", duration: "12 min", type: "video" }},
          {{ id: "{mod_id_prefix}-l2", title: "Environment Setup & Core Syntax", duration: "15 min", type: "video" }},
          {{ id: "{mod_id_prefix}-l3", title: "Fundamental Concepts & Practice", duration: "18 min", type: "reading" }},
          {{ id: "{mod_id_prefix}-l4", title: "Foundations Quiz", duration: "10 min", type: "quiz" }},
        ],
      }},
      {{
        id: "{mod_id_prefix}-m2", title: "Core Features & Deep Dive", description: "Hands-on exercises, key features, and algorithmic patterns", color: "bg-indigo-500",
        icon: <Layers className="w-4 h-4" />,
        lessons: [
          {{ id: "{mod_id_prefix}-l5", title: "Building Blocks & Key Features", duration: "20 min", type: "video" }},
          {{ id: "{mod_id_prefix}-l6", title: "Practical Hands-on Coding", duration: "25 min", type: "exercise" }},
          {{ id: "{mod_id_prefix}-l7", title: "Problem Solving Workshop", duration: "22 min", type: "exercise" }},
        ],
      }},
      {{
        id: "{mod_id_prefix}-m3", title: "Advanced Topics & Best Practices", description: "Optimization, architecture design, and industry standard patterns", color: "bg-violet-600",
        icon: <Zap className="w-4 h-4" />,
        lessons: [
          {{ id: "{mod_id_prefix}-l8", title: "Advanced Patterns & Optimization", duration: "24 min", type: "video" }},
          {{ id: "{mod_id_prefix}-l9", title: "Debugging & Performance Tuning", duration: "20 min", type: "exercise" }},
        ],
      }},
      {{
        id: "{mod_id_prefix}-m4", title: "Capstone Project", description: "Build a real-world production ready application", color: "bg-gray-900",
        icon: <Award className="w-4 h-4" />,
        lessons: [
          {{ id: "{mod_id_prefix}-l10", title: "Project Architecture & Requirements", duration: "15 min", type: "video" }},
          {{ id: "{mod_id_prefix}-l11", title: "Full Project Implementation", duration: "45 min", type: "project" }},
          {{ id: "{mod_id_prefix}-l12", title: "Final Evaluation & Knowledge Check", duration: "15 min", type: "quiz" }},
        ],
      }},
    ],
  }}"""
    courses_ts.append(course_code)

# Process Electronics / ECE courses
for i, item in enumerate(ece_courses, 1):
    title, shortTitle, desc, bgColor, color, icon_name, difficulty, duration, keywords = item
    course_id = f"ece-{slugify(title)}"
    mod_id_prefix = f"ece-{i}"
    
    course_code = f"""  {{
    id: "{course_id}",
    title: "{title}",
    shortTitle: "{shortTitle}",
    description: "{desc}",
    color: "{color}",
    bgColor: "{bgColor}",
    icon: <{icon_name} className="w-5 h-5" />,
    category: "Electronics & ECE",
    domain: "Electronics & ECE",
    difficulty: "{difficulty}",
    duration: "{duration}",
    enrolled: false,
    progress: 0,
    keywords: {json.dumps(keywords)},
    modules: [
      {{
        id: "{mod_id_prefix}-m1", title: "Fundamentals of {shortTitle}", description: "Basic theory, principles, mathematical foundation, and component analysis", color: "{bgColor}",
        icon: <Sparkles className="w-4 h-4" />,
        lessons: [
          {{ id: "{mod_id_prefix}-l1", title: "Introduction to {title}", duration: "14 min", type: "video" }},
          {{ id: "{mod_id_prefix}-l2", title: "Core Principles & Equations", duration: "18 min", type: "video" }},
          {{ id: "{mod_id_prefix}-l3", title: "Circuit & System Concepts", duration: "16 min", type: "reading" }},
          {{ id: "{mod_id_prefix}-l4", title: "Fundamentals Quiz", duration: "10 min", type: "quiz" }},
        ],
      }},
      {{
        id: "{mod_id_prefix}-m2", title: "Design & Simulation", description: "Schematic design, simulation tools, and practical lab experiments", color: "bg-blue-600",
        icon: <Layers className="w-4 h-4" />,
        lessons: [
          {{ id: "{mod_id_prefix}-l5", title: "Design Methodology & Flow", duration: "22 min", type: "video" }},
          {{ id: "{mod_id_prefix}-l6", title: "Simulation & Modeling Lab", duration: "28 min", type: "exercise" }},
          {{ id: "{mod_id_prefix}-l7", title: "Practical Circuit Analysis", duration: "20 min", type: "exercise" }},
        ],
      }},
      {{
        id: "{mod_id_prefix}-m3", title: "Advanced Hardware Engineering", description: "High-frequency design, physical signoff, and hardware testing", color: "bg-rose-600",
        icon: <Zap className="w-4 h-4" />,
        lessons: [
          {{ id: "{mod_id_prefix}-l8", title: "Advanced Design Techniques", duration: "25 min", type: "video" }},
          {{ id: "{mod_id_prefix}-l9", title: "Hardware Verification & Testing", duration: "22 min", type: "exercise" }},
        ],
      }},
      {{
        id: "{mod_id_prefix}-m4", title: "Hardware Capstone Project", description: "Design, simulate, and verify a complete hardware system", color: "bg-gray-900",
        icon: <Award className="w-4 h-4" />,
        lessons: [
          {{ id: "{mod_id_prefix}-l10", title: "Project Specification & Block Diagram", duration: "15 min", type: "video" }},
          {{ id: "{mod_id_prefix}-l11", title: "Hardware System Implementation", duration: "50 min", type: "project" }},
          {{ id: "{mod_id_prefix}-l12", title: "Review & Signoff", duration: "15 min", type: "quiz" }},
        ],
      }},
    ],
  }}"""
    courses_ts.append(course_code)

# Other Mechanical / Civil / Biotech / Aerospace courses
other_courses = [
  ("Mechanical Design & CAD", "Mech CAD", "Master mechanical engineering design principles, 3D CAD modeling, FEA simulation, and manufacturing processes.", "bg-orange-500", "text-orange-600", "Wrench", "Intermediate", "40 hours", ["mechanical", "cad", "solidworks", "fea", "design", "drawing"]),
  ("Civil & Structural Engineering", "Civil Eng", "Learn structural analysis, concrete & steel design, geotechnical engineering, and construction management fundamentals.", "bg-stone-600", "text-stone-600", "Building2", "Intermediate", "44 hours", ["civil", "structural", "concrete", "steel", "rcc", "building", "construction"]),
  ("Biotechnology & Genetic Engineering", "Biotech", "Explore molecular biology, genetic engineering, bioinformatics, and bioprocess engineering for modern biotech applications.", "bg-lime-600", "text-lime-600", "FlaskConical", "Intermediate", "38 hours", ["biotech", "dna", "genetics", "crispr", "bioinformatics", "pcr"]),
  ("Aerospace Engineering Fundamentals", "Aerospace", "Dive into aerodynamics, flight mechanics, propulsion, aircraft structures, and space systems engineering.", "bg-sky-600", "text-sky-600", "Plane", "Advanced", "46 hours", ["aerospace", "aerodynamics", "flight", "propulsion", "aircraft", "rockets"])
]

for i, item in enumerate(other_courses, 1):
    title, shortTitle, desc, bgColor, color, icon_name, difficulty, duration, keywords = item
    course_id = f"other-{slugify(title)}"
    mod_id_prefix = f"oth-{i}"
    
    course_code = f"""  {{
    id: "{course_id}",
    title: "{title}",
    shortTitle: "{shortTitle}",
    description: "{desc}",
    color: "{color}",
    bgColor: "{bgColor}",
    icon: <{icon_name} className="w-5 h-5" />,
    category: "Other Engineering",
    domain: "Other",
    difficulty: "{difficulty}",
    duration: "{duration}",
    enrolled: false,
    progress: 0,
    keywords: {json.dumps(keywords)},
    modules: [
      {{
        id: "{mod_id_prefix}-m1", title: "Foundations of {shortTitle}", description: "Core concepts, principles, and fundamental equations", color: "{bgColor}",
        icon: <Sparkles className="w-4 h-4" />,
        lessons: [
          {{ id: "{mod_id_prefix}-l1", title: "Introduction to {title}", duration: "15 min", type: "video" }},
          {{ id: "{mod_id_prefix}-l2", title: "Core Concepts & Fundamentals", duration: "18 min", type: "reading" }},
          {{ id: "{mod_id_prefix}-l3", title: "Fundamentals Quiz", duration: "10 min", type: "quiz" }},
        ],
      }},
      {{
        id: "{mod_id_prefix}-m2", title: "Design & Analysis", description: "Practical tools, simulation, and industry analysis", color: "bg-blue-600",
        icon: <Layers className="w-4 h-4" />,
        lessons: [
          {{ id: "{mod_id_prefix}-l4", title: "Modeling & Analysis Techniques", duration: "22 min", type: "video" }},
          {{ id: "{mod_id_prefix}-l5", title: "Hands-on Design Lab", duration: "30 min", type: "exercise" }},
        ],
      }},
      {{
        id: "{mod_id_prefix}-m3", title: "Capstone Project", description: "Complete industry design project", color: "bg-gray-900",
        icon: <Award className="w-4 h-4" />,
        lessons: [
          {{ id: "{mod_id_prefix}-l6", title: "Project Specification", duration: "15 min", type: "video" }},
          {{ id: "{mod_id_prefix}-l7", title: "Project Execution", duration: "45 min", type: "project" }},
        ],
      }},
    ],
  }}"""
    courses_ts.append(course_code)

output_file = "/Users/karthiktalluri/Documents/Mentorhub/mentorhubweb/lib/mentorCoursesData.tsx"
with open(output_file, "w") as f:
    f.write(header)
    f.write(",\n".join(courses_ts))
    f.write(footer)

print("Successfully generated lib/mentorCoursesData.tsx with", len(courses_ts), "courses!")
