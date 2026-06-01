with open("/home/rustymachine/Documents/GitHub/mentorhubweb/components/student/StudentGames.tsx", "r") as f:
    content = f.read()

# Let's find the start of the return statement
start_idx = content.find('  return (\n    <div className="flex flex-col gap-3 font-sans pb-10">')
if start_idx != -1:
    print("Found start at index:", start_idx)
    # Let's print the next 2000 characters
    print(repr(content[start_idx:start_idx+1500]))
else:
    print("Return start not found exactly!")
