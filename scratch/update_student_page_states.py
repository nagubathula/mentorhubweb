with open("app/page.tsx", "r") as f:
    content = f.read()

replacements = [
    ('            {state === "MESSAGES" && (', '            {state === "MESSAGES" && featureFlags.student_messages !== false && ('),
    ('            {state === "COURSE_DETAILS" && (', '            {state === "COURSE_DETAILS" && featureFlags.student_courses !== false && ('),
    ('            {state === "GAMES" && (', '            {state === "GAMES" && featureFlags.student_games !== false && ('),
    ('            {state === "WELLNESS" && (', '            {state === "WELLNESS" && featureFlags.student_wellness !== false && ('),
    ('            {state === "FACTS" && (', '            {state === "FACTS" && featureFlags.student_facts !== false && ('),
    ('            {state === "PORTFOLIO" && (', '            {state === "PORTFOLIO" && featureFlags.student_portfolio !== false && ('),
    ('            {state === "GRATITUDE_WALL" && (', '            {state === "GRATITUDE_WALL" && featureFlags.student_gratitude !== false && ('),
    ('            {state === "NOTES" && (', '            {state === "NOTES" && featureFlags.student_notes !== false && ('),
]

for old, new in replacements:
    if old in content:
        content = content.replace(old, new, 1)
        print(f"Replaced state check: {old} -> {new}")
    else:
        print(f"FAILED to find state check: {old}")

with open("app/page.tsx", "w") as f:
    f.write(content)

