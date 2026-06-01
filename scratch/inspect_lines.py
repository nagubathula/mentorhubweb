with open("/home/rustymachine/Documents/GitHub/mentorhubweb/app/page.tsx", "r") as f:
    lines = f.readlines()
for idx in range(2784, 2794):
    print(f"{idx+1}: {repr(lines[idx])}")
