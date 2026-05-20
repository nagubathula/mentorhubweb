
def trace_divs(filename, start, end):
    with open(filename, 'r') as f:
        lines = f.readlines()
    
    count = 0
    import re
    for i in range(start-1, end):
        line_num = i + 1
        line = lines[i]
        clean_line = re.sub(r'//.*', '', line)
        clean_line = re.sub(r'".*?"', '""', clean_line)
        
        opens = len(re.findall(r'<div(?![a-zA-Z0-9])', clean_line))
        self_closes = len(re.findall(r'<div[^>]*/>', clean_line))
        closes = clean_line.count('</div>')
        
        diff = (opens - self_closes) - closes
        count += diff
        
        if diff != 0:
            print(f"Line {line_num}: Diff = {diff}, Total = {count}, Content: {line.strip()}")

trace_divs('app/page.tsx', 1910, 2376)
