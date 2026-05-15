import sys

with open('components/admin/CourseCustomizer.tsx', 'r') as f:
    lines = f.readlines()

with open('scratch/course_customizer_ui.txt', 'r') as f:
    new_block = f.read()

# Target start and end
start_marker = '        {/* Module List */}'
end_marker = '    </motion.div>\n  );\n}\n'

# Find the start line
start_idx = -1
for i, line in enumerate(lines):
    if start_marker in line and i > 1300:
        start_idx = i
        break

# Find the end line
end_idx = -1
for i in range(len(lines)-1, 0, -1):
    if end_marker in "".join(lines[i:i+4]):
        end_idx = i + 3 # Adjust to include the end lines
        break

if start_idx != -1 and end_idx != -1:
    new_lines = lines[:start_idx] + [new_block] + lines[end_idx+1:]
    with open('components/admin/CourseCustomizer.tsx', 'w') as f:
        f.writelines(new_lines)
    print("Successfully replaced block.")
else:
    print(f"Failed to find markers: start_idx={start_idx}, end_idx={end_idx}")
