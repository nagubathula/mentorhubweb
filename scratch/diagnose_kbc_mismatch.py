import difflib

with open("/home/rustymachine/Documents/GitHub/mentorhubweb/components/student/StudentGames.tsx", "r") as f:
    file_content = f.read()

# Let's inspect the target content from the replace script
with open("/home/rustymachine/Documents/GitHub/mentorhubweb/scratch/replace_kbc_layout.py", "r") as f:
    replace_content = f.read()

# Extract target_string from replace_content
start_mark = "target_string = '''"
end_mark = "'''"
start_idx = replace_content.find(start_mark) + len(start_mark)
end_idx = replace_content.find(end_mark, start_idx)
target_string = replace_content[start_idx:end_idx]

# Let's check matching ratios of substrings
file_sub_idx = file_content.find('  return (\n    <div className="flex flex-col gap-3 font-sans pb-10">')
if file_sub_idx != -1:
    file_sub = file_content[file_sub_idx:file_sub_idx+len(target_string)]
    diff = difflib.ndiff(target_string.splitlines(keepends=True), file_sub.splitlines(keepends=True))
    print("--- DIFF REPORT ---")
    count = 0
    for line in diff:
        if line.startswith('+') or line.startswith('-'):
            print(repr(line))
            count += 1
            if count > 40:
                break
else:
    print("Could not find start index in file!")
