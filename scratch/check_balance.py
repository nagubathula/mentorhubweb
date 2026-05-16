
import sys
import re

def check_balance(filename):
    with open(filename, 'r') as f:
        content = f.read()
    
    braces = 0
    parens = 0
    brackets = 0
    tags = []
    
    # Improved regex to avoid matching TS generics like <any>
    # Tags usually start with Uppercase or are lowercase HTML tags.
    # We skip common TS generics.
    skip_generics = {'any', 'string', 'number', 'boolean', 'Record', 'Partial', 'Pick', 'Omit', 'FlowState', 'QuizStepData'}
    tag_pattern = re.compile(r'<(/?[a-zA-Z][a-zA-Z0-9\.]*)([^>]*?)(/?)>')
    
    lines = content.split('\n')
    for i, line in enumerate(lines):
        line_num = i + 1
        clean_line = re.sub(r'//.*', '', line)
        clean_line = re.sub(r'".*?"', '""', clean_line)
        clean_line = re.sub(r"'.*?'", "''", clean_line)
        
        for char in clean_line:
            if char == '{': braces += 1
            elif char == '}': braces -= 1
            elif char == '(': parens += 1
            elif char == ')': parens -= 1
            elif char == '[': brackets += 1
            elif char == ']': brackets -= 1
            
        for match in tag_pattern.finditer(line):
            tag_name = match.group(1)
            is_closing = tag_name.startswith('/')
            is_self_closing = match.group(3) == '/'
            
            clean_tag_name = tag_name[1:] if is_closing else tag_name
            if clean_tag_name in skip_generics:
                continue
            
            if is_self_closing:
                continue
            
            if is_closing:
                if not tags:
                    print(f"Error: Unexpected closing tag </{clean_tag_name}> at line {line_num}")
                else:
                    last = tags.pop()
                    if last != clean_tag_name:
                        print(f"Error: Mismatched tag. Expected </{last}>, found </{clean_tag_name}> at line {line_num}")
            else:
                tags.append(tag_name)
                
    print(f"File: {filename}")
    print(f"Final counts: Braces: {braces}, Parens: {parens}, Brackets: {brackets}")
    if tags:
        print(f"Unclosed tags: {tags}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        check_balance(sys.argv[1])
    else:
        print("Usage: python3 check_balance.py <filename>")
