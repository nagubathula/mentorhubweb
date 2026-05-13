import re

input_path = "/home/rustymachine/Downloads/LearningPlace.apk_Decompiler.com/resources/assets/public/assets/index-TmZRJIKb.js"
output_path = "/home/rustymachine/Documents/GitHub/mentorhubweb/unminified_index.js"

print("Reading minified JS file...")
with open(input_path, "r", encoding="utf-8") as f:
    content = f.read()

print(f"File size: {len(content)} characters. Formatting content...")

# Let's do some simple formatting to make it readable line-by-line
# Split at semicolons, curly braces, and insert line breaks
formatted = content.replace(";", ";\n").replace("{", "{\n").replace("}", "}\n")

print(f"Writing formatted file to {output_path}...")
with open(output_path, "w", encoding="utf-8") as f:
    f.write(formatted)

print("Done! Formatted file has been successfully written.")
