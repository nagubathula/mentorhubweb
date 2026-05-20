with open("app/page.tsx", "r") as f:
    content = f.read()

replacements = [
    ('                  {state === "MENTOR_DASHBOARD" && <MentorHome />}', '                  {state === "MENTOR_DASHBOARD" && featureFlags.mentor_dashboard !== false && <MentorHome featureFlags={featureFlags} />}'),
    ('                  {state === "MENTOR_STUDENTS" && <MentorStudents />}', '                  {state === "MENTOR_STUDENTS" && featureFlags.mentor_students !== false && <MentorStudents />}'),
    ('                  {state === "MENTOR_COURSES" && <MentorCourses />}', '                  {state === "MENTOR_COURSES" && featureFlags.mentor_courses !== false && <MentorCourses />}'),
    ('                  {state === "MENTOR_NOTES" && <MentorNotes />}', '                  {state === "MENTOR_NOTES" && featureFlags.mentor_sessions !== false && <MentorNotes />}'),
    ('                  {state === "MENTOR_CIRCLE" && <MentorCircle />}', '                  {state === "MENTOR_CIRCLE" && featureFlags.mentor_circle !== false && <MentorCircle />}'),
    ('                  {state === "MENTOR_ACCOUNT" && <MentorProfile onSignOut={handleSignOut} />}', '                  {state === "MENTOR_ACCOUNT" && featureFlags.mentor_account !== false && <MentorProfile onSignOut={handleSignOut} />}'),
]

for old, new in replacements:
    if old in content:
        content = content.replace(old, new, 1)
        print(f"Replaced mentor state render: {old} -> {new}")
    else:
        print(f"FAILED to find mentor state render: {old}")

with open("app/page.tsx", "w") as f:
    f.write(content)

