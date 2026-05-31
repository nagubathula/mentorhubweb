with open("/home/rustymachine/Documents/GitHub/mentorhubweb/components/student/StudentGames.tsx", "r") as f:
    lines = f.readlines()
for idx in range(2090, 2110):
    print(f"{idx+1}: {repr(lines[idx])}")
