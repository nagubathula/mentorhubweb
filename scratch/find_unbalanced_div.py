
def find_unbalanced_div(filename):
    with open(filename, 'r') as f:
        lines = f.readlines()
    
    count = 0
    import re
    # Match <div but not <div.../ >
    for i, line in enumerate(lines):
        line_num = i + 1
        # Skip strings and comments
        clean_line = re.sub(r'//.*', '', line)
        clean_line = re.sub(r'".*?"', '""', clean_line)
        
        # This is tricky because a div might start on one line and end its tag on another.
        # But usually <div is on one line.
        opens = len(re.findall(r'<div(?![a-zA-Z0-9])', clean_line))
        # Self closing divs like <div ... />
        self_closes = len(re.findall(r'<div[^>]*/>', clean_line))
        closes = clean_line.count('</div>')
        
        count += (opens - self_closes)
        count -= closes
        
        if line_num in [1400, 1500, 1800, 1910, 2376, 2821, 3127, 3379]:
            print(f"Line {line_num}: Balance = {count}")

find_unbalanced_div('app/page.tsx')
