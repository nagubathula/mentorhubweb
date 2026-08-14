import os

# Lucide icon mapping to JSX
ICON_MAP = {
    "Code": "<Code className=\"w-5 h-5\" />",
    "Brain": "<Brain className=\"w-5 h-5\" />",
    "Layers": "<Layers className=\"w-5 h-5\" />",
    "Database": "<Database className=\"w-5 h-5\" />",
    "Monitor": "<Monitor className=\"w-5 h-5\" />",
    "Palette": "<Palette className=\"w-5 h-5\" />",
    "Server": "<Server className=\"w-5 h-5\" />",
    "Wrench": "<Wrench className=\"w-5 h-5\" />",
    "Wifi": "<Wifi className=\"w-5 h-5\" />",
    "Terminal": "<Terminal className=\"w-5 h-5\" />",
    "Cloud": "<Cloud className=\"w-5 h-5\" />",
    "Rocket": "<Rocket className=\"w-5 h-5\" />",
    "GitBranch": "<GitBranch className=\"w-5 h-5\" />",
    "Shield": "<Shield className=\"w-5 h-5\" />",
    "MessageSquare": "<MessageSquare className=\"w-5 h-5\" />",
    "Eye": "<Eye className=\"w-5 h-5\" />",
    "Sparkles": "<Sparkles className=\"w-5 h-5\" />",
    "BarChart3": "<BarChart3 className=\"w-5 h-5\" />",
    "Globe": "<Globe className=\"w-5 h-5\" />",
    "Smartphone": "<Smartphone className=\"w-5 h-5\" />",
    "UserCheck": "<UserCheck className=\"w-5 h-5\" />",
    "Zap": "<Zap className=\"w-5 h-5\" />",
    "Activity": "<Activity className=\"w-5 h-5\" />",
    "Cpu": "<Cpu className=\"w-5 h-5\" />",
    "Radio": "<Radio className=\"w-5 h-5\" />",
    "CircuitBoard": "<CircuitBoard className=\"w-5 h-5\" />",
    "Bot": "<Bot className=\"w-5 h-5\" />",
    "Building2": "<Building2 className=\"w-5 h-5\" />",
    "FlaskConical": "<FlaskConical className=\"w-5 h-5\" />",
    "Plane": "<Plane className=\"w-5 h-5\" />",
}

def generate_modules(course_id, title, domain):
    # Generates 4 to 6 realistic modules per course
    mod_prefix = course_id.replace("-", "")
    return [
        {
            "id": f"{mod_prefix}-m1",
            "title": f"Fundamentals & Foundations of {title}",
            "description": f"Core concepts, syntax, principles, and setup for {title}.",
            "color": "bg-indigo-500",
            "icon": "<Sparkles className=\"w-4 h-4\" />",
            "lessons": [
                {"id": f"{mod_prefix}-l1", "title": f"Introduction to {title}", "duration": "12 min", "type": "video"},
                {"id": f"{mod_prefix}-l2", "title": "Core Architecture & Setup", "duration": "15 min", "type": "video"},
                {"id": f"{mod_prefix}-l3", "title": "Key Principles & Workflow", "duration": "18 min", "type": "reading"},
                {"id": f"{mod_prefix}-l4", "title": "Knowledge Check Quiz", "duration": "10 min", "type": "quiz"},
            ]
        },
        {
            "id": f"{mod_prefix}-m2",
            "title": f"Core Concepts & Techniques in {title}",
            "description": f"Hands-on techniques, problem-solving, and practical applications in {title}.",
            "color": "bg-blue-600",
            "icon": "<Layers className=\"w-4 h-4\" />",
            "lessons": [
                {"id": f"{mod_prefix}-l5", "title": "Deep Dive into Core Components", "duration": "20 min", "type": "video"},
                {"id": f"{mod_prefix}-l6", "title": "Hands-on Guided Exercise", "duration": "25 min", "type": "exercise"},
                {"id": f"{mod_prefix}-l7", "title": "Best Practices & Common Patterns", "duration": "18 min", "type": "video"},
            ]
        },
        {
            "id": f"{mod_prefix}-m3",
            "title": f"Advanced {title} Implementation",
            "description": f"Advanced topics, optimization, performance, and real-world tools.",
            "color": "bg-violet-500",
            "icon": "<Zap className=\"w-4 h-4\" />",
            "lessons": [
                {"id": f"{mod_prefix}-l8", "title": "Advanced Design & Optimization", "duration": "22 min", "type": "video"},
                {"id": f"{mod_prefix}-l9", "title": "Debugging & Troubleshooting", "duration": "20 min", "type": "exercise"},
                {"id": f"{mod_prefix}-l10", "title": "Integration with Industry Tools", "duration": "24 min", "type": "exercise"},
            ]
        },
        {
            "id": f"{mod_prefix}-m4",
            "title": f"Capstone Project & Real-World Application",
            "description": f"Build a comprehensive portfolio project demonstrating mastery of {title}.",
            "color": "bg-slate-900",
            "icon": "<Award className=\"w-4 h-4\" />",
            "lessons": [
                {"id": f"{mod_prefix}-l11", "title": "Project Specification & Design", "duration": "15 min", "type": "video"},
                {"id": f"{mod_prefix}-l12", "title": "Hands-on Project Implementation", "duration": "45 min", "type": "project"},
                {"id": f"{mod_prefix}-l13", "title": "Final Assessment & Review", "duration": "15 min", "type": "quiz"},
            ]
        }
    ]

# Execute and build catalog
exec(open("/Users/karthiktalluri/Documents/Mentorhub/mentorhubweb/scratch/generate_catalog.py").read())
