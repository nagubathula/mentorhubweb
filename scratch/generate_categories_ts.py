import json
import sys
sys.path.append("/Users/karthiktalluri/Documents/Mentorhub/mentorhubweb/scratch")
from build_categories_catalog import categories_data

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
  categoryId?: string;
  categoryName?: string;
  domain?: "Programming" | "Design" | "AI/ML" | "Electronics" | "Data" | "Other";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  modules: MentorModule[];
  enrolled: boolean;
  progress: number;
  keywords?: string[];
}

export interface CourseCategory {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  domain: "Programming" | "Design" | "AI/ML" | "Electronics" | "Data" | "Other";
  bgColor: string;
  textColor: string;
  courseCount?: number;
}
"""

def slugify(text):
    return text.lower().replace(" ", "-").replace("&", "and").replace("+", "p").replace("/", "-").replace(".", "dot").replace("(", "").replace(")", "")

# Build Course Categories array
categories_ts = []
for cat in categories_data:
    cat_code = f"""  {{
    id: "{cat['id']}",
    name: "{cat['name']}",
    shortName: "{cat['shortName']}",
    description: "{cat['description']}",
    icon: "{cat['icon']}",
    domain: "{cat['domain']}",
    bgColor: "{cat['bgColor']}",
    textColor: "{cat['textColor']}",
    courseCount: {len(cat['courses'])}
  }}"""
    categories_ts.append(cat_code)

# Build Courses array
courses_ts = []
global_idx = 1

for cat in categories_data:
    cat_id = cat['id']
    cat_name = cat['name']
    domain = cat['domain']
    cat_icon = cat['icon']
    cat_bg = cat['bgColor']
    cat_text = cat['textColor']

    for course_item in cat['courses']:
        title, desc, difficulty, duration, keywords = course_item
        course_id = f"c-{slugify(title)}"
        mod_prefix = f"m-{global_idx}"
        global_idx += 1

        course_code = f"""  {{
    id: "{course_id}",
    title: "{title}",
    shortTitle: "{title}",
    description: "{desc}",
    color: "{cat_text}",
    bgColor: "{cat_bg}",
    icon: <{cat_icon} className="w-5 h-5" />,
    category: "{cat_name}",
    categoryId: "{cat_id}",
    categoryName: "{cat_name}",
    domain: "{domain}",
    difficulty: "{difficulty}",
    duration: "{duration}",
    enrolled: false,
    progress: 0,
    keywords: {json.dumps(keywords)},
    modules: [
      {{
        id: "{mod_prefix}-m1", title: "Foundations & Core Principles of {title}", description: "Core concepts, syntax, principles, and environment setup", color: "{cat_bg}",
        icon: <Sparkles className="w-4 h-4" />,
        lessons: [
          {{ id: "{mod_prefix}-l1", title: "Introduction to {title}", duration: "12 min", type: "video" }},
          {{ id: "{mod_prefix}-l2", title: "Environment Setup & Fundamentals", duration: "15 min", type: "video" }},
          {{ id: "{mod_prefix}-l3", title: "Core Architecture & Practice", duration: "18 min", type: "reading" }},
          {{ id: "{mod_prefix}-l4", title: "Foundations Quiz", duration: "10 min", type: "quiz" }},
        ],
      }},
      {{
        id: "{mod_prefix}-m2", title: "Deep Dive & Guided Implementation", description: "Practical exercises, key building blocks, and hands-on projects", color: "bg-blue-600",
        icon: <Layers className="w-4 h-4" />,
        lessons: [
          {{ id: "{mod_prefix}-l5", title: "Building Blocks & Key Features", duration: "20 min", type: "video" }},
          {{ id: "{mod_prefix}-l6", title: "Hands-on Practical Exercise", duration: "25 min", type: "exercise" }},
          {{ id: "{mod_prefix}-l7", title: "Real-world Scenario Workshop", duration: "22 min", type: "exercise" }},
        ],
      }},
      {{
        id: "{mod_prefix}-m3", title: "Advanced Topics & Best Practices", description: "Optimization, architecture patterns, and industry workflows", color: "bg-purple-600",
        icon: <Zap className="w-4 h-4" />,
        lessons: [
          {{ id: "{mod_prefix}-l8", title: "Advanced Design & Optimization", duration: "24 min", type: "video" }},
          {{ id: "{mod_prefix}-l9", title: "Debugging & Performance Tuning", duration: "20 min", type: "exercise" }},
        ],
      }},
      {{
        id: "{mod_prefix}-m4", title: "Capstone Project", description: "Build a complete end-to-end production application", color: "bg-gray-900",
        icon: <Award className="w-4 h-4" />,
        lessons: [
          {{ id: "{mod_prefix}-l10", title: "Project Architecture & Requirements", duration: "15 min", type: "video" }},
          {{ id: "{mod_prefix}-l11", title: "Full Project Implementation", duration: "45 min", type: "project" }},
          {{ id: "{mod_prefix}-l12", title: "Final Review & Signoff", duration: "15 min", type: "quiz" }},
        ],
      }},
    ],
  }}"""
        courses_ts.append(course_code)

output_file = "/Users/karthiktalluri/Documents/Mentorhub/mentorhubweb/lib/mentorCoursesData.tsx"
with open(output_file, "w") as f:
    f.write(header)
    f.write("\nexport const courseCategories: CourseCategory[] = [\n")
    f.write(",\n".join(categories_ts))
    f.write("\n];\n\nexport const mentorCoursesCatalog: MentorCourse[] = [\n")
    f.write(",\n".join(courses_ts))
    f.write("\n];\n")

print("Successfully written lib/mentorCoursesData.tsx!")
