import os
import re

directories = ['app', 'components']
files_changed = 0

for d in directories:
    for root, dirs, files in os.walk(d):
        for file in files:
            if file.endswith(('.tsx', '.ts')):
                path = os.path.join(root, file)
                with open(path, 'r') as f:
                    content = f.read()
                
                new_content = content
                
                # 1. Remove font-volkhov, font-mulish, font-poppins
                new_content = re.sub(r'\s*font-volkhov\b', '', new_content)
                new_content = re.sub(r'\s*font-mulish\b', '', new_content)
                new_content = re.sub(r'\s*font-poppins\b', '', new_content)
                
                # 2. Adjust heading sizes and weights to match 1st screen
                new_content = new_content.replace('text-3xl font-bold', 'text-2xl font-medium tracking-tight')
                new_content = new_content.replace('text-2xl font-bold', 'text-xl font-medium tracking-tight')
                new_content = new_content.replace('text-xl font-bold', 'text-[17px] font-medium tracking-tight')
                new_content = new_content.replace('text-[18px] font-bold', 'text-[17px] font-medium')
                
                # 3. Adjust other elements using font-bold to font-medium (1st screen avoids heavy bold)
                new_content = new_content.replace('font-bold', 'font-medium')
                
                if new_content != content:
                    with open(path, 'w') as f:
                        f.write(new_content)
                    files_changed += 1

print(f"Applied changes to {files_changed} files.")
