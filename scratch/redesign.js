const fs = require('fs');
const path = require('path');

const rootDir = '/Users/karthiktalluri/Documents/Mentorhub/mentorhubweb';

function replaceInFile(filePath, replacements) {
  const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(rootDir, filePath);
  if (!fs.existsSync(absolutePath)) {
    console.log(`File not found: ${absolutePath}`);
    return;
  }
  let content = fs.readFileSync(absolutePath, 'utf8');
  let original = content;

  for (const [target, replacement] of replacements) {
    content = content.split(target).join(replacement);
  }

  if (content !== original) {
    fs.writeFileSync(absolutePath, content, 'utf8');
    console.log(`Updated file: ${filePath}`);
  } else {
    console.log(`No changes made to: ${filePath}`);
  }
}

// 1. app/page.tsx replacements
replaceInFile('app/page.tsx', [
  ['"from-pink-500 to-rose-600"', '"from-indigo-500 to-sky-500"'],
  ['bg-gradient-to-b from-[#fdfbf7] via-[#f7f5ff] to-[#f0f4ff]', 'bg-gradient-to-b from-[#F8FAFC] to-[#EFF6FF]'],
  ['bg-[#fdfdfc]', 'bg-[#F8FAFC]'],
  ['from-[#fdfdfc]', 'from-[#F8FAFC]'],
  ['to-[#fdfdfc]', 'to-[#F8FAFC]'],
  ['bg-rose-50/50 hover:bg-rose-50 text-rose-600 border border-rose-100/40', 'bg-indigo-50/50 hover:bg-indigo-50 text-indigo-600 border border-indigo-100/40'],
  ['<Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />', '<Heart className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500" />'],
  ['className="text-rose-500">37%</span>', 'className="text-primary font-bold">37%</span>'],
  ['className="h-full bg-rose-400 w-[37%] rounded-full"', 'className="h-full bg-primary w-[37%] rounded-full"'],
  ['selection:bg-orange-200', 'selection:bg-indigo-100'],
  ['bg-white/90 backdrop-blur-3xl border-slate-200/50', 'bg-white border-[#E2E8F0]'],
  ['bg-white/70 backdrop-blur-2xl border-white/60 premium-shadow', 'bg-white border-[#E2E8F0] shadow-sm'],
  ['rounded-none md:rounded-[1.5rem]', 'rounded-none md:rounded-[16px]'],
  ['text-pink-500 fill-pink-500/5', 'text-indigo-500 fill-indigo-500/5']
]);

// 2. components/student/MentalWellness.tsx replacements
replaceInFile('components/student/MentalWellness.tsx', [
  ['className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border border-rose-100 p-4 space-y-3"', 'className="bg-white rounded-2xl border border-[#E2E8F0] p-4 space-y-3 shadow-sm"'],
  ['className="h-full bg-gradient-to-r from-rose-400 to-pink-400 rounded-full"', 'className="h-full bg-primary rounded-full"'],
  ['bg-rose-100 text-rose-500 text-[11px] px-2 py-0.5 rounded-full ml-1', 'bg-indigo-50 text-indigo-600 text-[11px] px-2 py-0.5 rounded-full ml-1'],
  ['bg-rose-50 text-rose-500', 'bg-indigo-50 text-indigo-600'],
  ['text-rose-600 text-[10px] font-semibold', 'text-indigo-600 text-[10px] font-semibold'],
  ['text-rose-500 text-[10px] ml-auto font-medium', 'text-indigo-600 text-[10px] ml-auto font-medium'],
  ['bg-rose-50 text-rose-500 text-[10px]', 'bg-indigo-50 text-indigo-600 text-[10px]'],
  ['focus:ring-rose-200 focus:border-rose-300', 'focus:ring-indigo-100 focus:border-indigo-300'],
  ['bg-rose-500 text-white shadow-rose-500/10 hover:bg-rose-600', 'bg-primary text-white shadow-indigo-600/10 hover:bg-indigo-700'],
  ['text-rose-500', 'text-indigo-600'],
  ['fill-rose-50', 'fill-indigo-50']
]);

// 3. components/student/GratitudeWall.tsx replacements
replaceInFile('components/student/GratitudeWall.tsx', [
  ['bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-5 text-white', 'bg-gradient-to-br from-[#4F46E5] to-[#3B82F6] rounded-2xl p-5 text-white'],
  ['className="bg-white border border-rose-100 rounded-2xl p-4 shadow-sm space-y-4"', 'className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm space-y-4"'],
  ['focus:ring-rose-200 border border-gray-100', 'focus:ring-indigo-100 border border-gray-100'],
  ['focus:ring-rose-200 resize-none', 'focus:ring-indigo-100 resize-none'],
  ['bg-rose-500 text-white border-transparent', 'bg-indigo-600 text-white border-transparent'],
  ['text-rose-500 focus:ring-rose-200', 'text-indigo-600 focus:ring-indigo-100'],
  ['bg-rose-500 text-white shadow-rose-500/10 hover:bg-rose-600', 'bg-primary text-white shadow-indigo-600/10 hover:bg-indigo-700'],
  ['border border-rose-100 rounded-2xl flex items-center justify-center gap-2 text-rose-600 text-xs font-medium shadow-sm hover:bg-rose-50/50', 'border border-indigo-100 rounded-2xl flex items-center justify-center gap-2 text-indigo-600 text-xs font-medium shadow-sm hover:bg-indigo-50/50'],
  ['text-rose-500', 'text-indigo-600'],
  ['bg-rose-50', 'bg-indigo-50'],
  ['color: "text-rose-500",\n    bgColor: "bg-rose-50"', 'color: "text-indigo-600",\n    bgColor: "bg-indigo-50"'],
  ['color: "text-rose-450",\n    bgColor: "bg-rose-50"', 'color: "text-indigo-600",\n    bgColor: "bg-indigo-50"'],
  ['color: "text-pink-500",\n    bgColor: "bg-pink-50"', 'color: "text-indigo-600",\n    bgColor: "bg-indigo-50"'],
  ['color: "text-rose-400",\n    bgColor: "bg-rose-50"', 'color: "text-indigo-500",\n    bgColor: "bg-indigo-50"'],
  ['text-rose-5050 fill-rose-50', 'text-indigo-600 fill-indigo-50']
]);

// 4. components/student/StudentPortfolio.tsx replacements
replaceInFile('components/student/StudentPortfolio.tsx', [
  ['bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600', 'bg-gradient-to-r from-indigo-500 via-sky-500 to-indigo-600'],
  ['hover:bg-rose-50 hover:border-rose-100 text-gray-400 hover:text-rose-500', 'hover:bg-indigo-50 hover:border-indigo-100 text-gray-400 hover:text-indigo-600']
]);

// 5. components/student/StudentResources.tsx replacements
replaceInFile('components/student/StudentResources.tsx', [
  ['text-rose-5050', 'text-indigo-600'],
  ['text-pink-500', 'text-indigo-500'],
  ['text-rose-500', 'text-indigo-500']
]);

// 6. components/mentor/MentorHome.tsx replacements
replaceInFile('components/mentor/MentorHome.tsx', [
  ['"from-pink-500 to-rose-600"', '"from-indigo-500 to-sky-500"'],
  ['"from-rose-50 to-rose-100/80 text-rose-600 border-rose-200/40"', '"from-indigo-50 to-indigo-100/80 text-indigo-600 border-indigo-200/40"'],
  ['bg-rose-100 text-rose-500', 'bg-indigo-50 text-indigo-600'],
  ['hover:text-rose-500 hover:bg-rose-50/50', 'hover:text-indigo-600 hover:bg-indigo-50/50']
]);

// 7. components/mentor/MentorStudents.tsx replacements
replaceInFile('components/mentor/MentorStudents.tsx', [
  ['"from-pink-500 to-rose-600"', '"from-indigo-500 to-sky-500"'],
  ['"from-rose-50 to-rose-100/80 text-rose-600 border-rose-200/40"', '"from-indigo-50 to-indigo-100/80 text-indigo-600 border-indigo-200/40"'],
  ['bg-rose-50 text-rose-500', 'bg-indigo-50 text-indigo-600']
]);

// 8. components/mentor/MentorCircle.tsx replacements
replaceInFile('components/mentor/MentorCircle.tsx', [
  ['text-rose-300 hover:text-rose-200 border border-rose-500/20', 'text-red-300 hover:text-red-200 border border-red-500/20'],
  ['bg-rose-500/10 hover:bg-rose-500/20', 'bg-red-500/10 hover:bg-red-500/20']
]);

// 9. components/admin/AdminPanel.tsx replacements
replaceInFile('components/admin/AdminPanel.tsx', [
  ['bg-rose-5050 hover:bg-rose-600', 'bg-primary hover:bg-indigo-700'],
  ['bg-rose-500 hover:bg-rose-600', 'bg-primary hover:bg-indigo-700'],
  ['iconBg:"bg-rose-100",   iconColor:"text-rose-600"', 'iconBg:"bg-indigo-50",   iconColor:"text-indigo-600"'],
  ['text-rose-300 hover:text-rose-600 hover:bg-rose-50', 'text-red-400 hover:text-red-600 hover:bg-red-50'],
  ['hover:text-rose-500 hover:bg-rose-50', 'hover:text-red-500 hover:bg-red-50'],
  ['text-rose-5050 hover:text-rose-700 px-2.5 py-1 rounded-lg hover:bg-rose-50', 'text-red-500 hover:text-red-700 hover:bg-red-50'],
  ['text-rose-500 hover:text-rose-700 px-2.5 py-1 rounded-lg hover:bg-rose-50', 'text-red-500 hover:text-red-700 hover:bg-red-50'],
  ['className="p-5 bg-gradient-to-br from-rose-50 to-amber-50 border-rose-100"', 'className="p-5 bg-white border border-[#E2E8F0] shadow-sm rounded-[16px]"'],
  ['text-rose-400 mb-3 fill-rose-200', 'text-indigo-600 mb-3 fill-indigo-100'],
  ['border-rose-100', 'border-[#E2E8F0]']
]);

console.log("Redesign replacement task complete!");
