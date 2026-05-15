const fs = require('fs');
const file = 'app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the start of DASHBOARD_MAIN
content = content.replace(
  /\{state === "DASHBOARD_MAIN" && \(\n\s*<motion\.div key="dashboard_main" variants=\{variants\} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col pt-0 bg-slate-50 -mx-6 px-8 -mt-2 overflow-y-auto hidden-scrollbar pb-36 relative w-full items-center">/,
  `{(state === "DASHBOARD_MAIN" || state === "COURSE_DETAILS" || state === "GAMES" || state === "NOTES" || state === "PROFILE") && (
              <motion.div key="student_portal" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col bg-slate-50 -mx-6 -mt-2 -mb-6">
                <div className="flex-1 overflow-y-auto hidden-scrollbar px-4 pb-4">
            {state === "DASHBOARD_MAIN" && (
              <div className="flex flex-col pt-0 relative w-full items-center">`
);

// Replace the ends of the components and the Fixed Bottom Navs
// DASHBOARD_MAIN end
content = content.replace(
  /\s*\{\/\* Fixed Bottom Navigation Menu \*\/\}\n\s*<div className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-100 shadow-\[0_-10px_40px_-20px_rgba\(0,0,0,0\.1\)\] flex items-center justify-between px-6 sm:rounded-b-2xl z-50">[\s\S]*?<\/div>\n\n\s*<\/motion\.div>\n\s*\)}/,
  `\n              </div>\n            )}`
);

// COURSE_DETAILS start
content = content.replace(
  /\{state === "COURSE_DETAILS" && \(\n\s*<motion\.div key="course_details" variants=\{variants\} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col pt-0 bg-white -mx-6 px-4 -mt-2 overflow-y-auto hidden-scrollbar pb-40 relative">/,
  `{state === "COURSE_DETAILS" && (\n              <div className="flex flex-col pt-0 bg-white -mx-4 px-4 overflow-y-auto relative rounded-3xl pb-8">`
);

// COURSE_DETAILS end (Note: line 1276 is Fixed Bottom Container)
content = content.replace(
  /\s*\{\/\* Fixed Bottom Container \(Button \+ Nav\) \*\/\}\n\s*<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-\[0_-10px_40px_-20px_rgba\(0,0,0,0\.1\)\] flex flex-col px-6 pb-6 pt-4 sm:rounded-b-2xl z-50">[\s\S]*?<\/div>\n\n\s*<\/motion\.div>\n\s*\)}/,
  `\n              </div>\n            )}`
);

// GAMES start
content = content.replace(
  /\{state === "GAMES" && \(\n\s*<motion\.div key="games" variants=\{variants\} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col pt-0 bg-slate-50 -mx-6 px-4 -mt-2 overflow-y-auto hidden-scrollbar pb-32">/,
  `{state === "GAMES" && (\n              <div className="flex flex-col pt-0 bg-slate-50 overflow-y-auto pb-8">`
);

// GAMES end
content = content.replace(
  /\s*\{\/\* Fixed Bottom Navigation Menu \*\/\}\n\s*<div className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-100 shadow-\[0_-10px_40px_-20px_rgba\(0,0,0,0\.1\)\] flex items-center justify-between px-6 sm:rounded-b-2xl z-50">[\s\S]*?<\/div>\n\s*<\/motion\.div>\n\s*\)}/,
  `\n              </div>\n            )}`
);

// NOTES start
content = content.replace(
  /\{state === "NOTES" && \(\n\s*<motion\.div key="notes" variants=\{variants\} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col pt-0 bg-slate-50 -mx-6 px-4 -mt-2 overflow-y-auto hidden-scrollbar pb-32">/,
  `{state === "NOTES" && (\n              <div className="flex flex-col pt-0 bg-slate-50 overflow-y-auto pb-8 relative">`
);

// NOTES end
content = content.replace(
  /\s*\{\/\* Fixed Bottom Navigation Menu \*\/\}\n\s*<div className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-100 shadow-\[0_-10px_40px_-20px_rgba\(0,0,0,0\.1\)\] flex items-center justify-between px-6 sm:rounded-b-2xl z-50">[\s\S]*?<\/div>\n\s*<\/motion\.div>\n\s*\)}/,
  `\n              </div>\n            )}`
);

// PROFILE start
content = content.replace(
  /\{state === "PROFILE" && \(\n\s*<motion\.div key="profile" variants=\{variants\} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col pt-0 bg-slate-50 -mx-6 -mt-2 overflow-y-auto hidden-scrollbar pb-32">/,
  `{state === "PROFILE" && (\n              <div className="flex flex-col pt-0 bg-slate-50 overflow-y-auto pb-8 -mx-4 px-4">`
);

// PROFILE end
content = content.replace(
  /\s*\{\/\* Fixed Bottom Navigation Menu \*\/\}\n\s*<div className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-100 shadow-\[0_-10px_40px_-20px_rgba\(0,0,0,0\.1\)\] flex items-center justify-between px-6 sm:rounded-b-2xl z-50">[\s\S]*?<\/div>\n\n\s*<\/motion\.div>\n\s*\)}/,
  `\n              </div>\n            )}\n                </div>\n                \n                {/* Bottom Navigation */}\n                <div className="shrink-0 bg-white border-t border-slate-100 flex justify-between px-6 pt-3 pb-8 sm:rounded-b-2xl">\n                  <button onClick={() => setState("DASHBOARD_MAIN")} className={\`flex flex-col items-center gap-1 w-12 \${state === "DASHBOARD_MAIN" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}\`}><Home className="w-5 h-5" strokeWidth={state === "DASHBOARD_MAIN" ? 2.5 : 2}/><span className="text-[10px] font-semibold">Home</span></button>\n                  <button onClick={() => setState("COURSE_DETAILS")} className={\`flex flex-col items-center gap-1 w-12 \${state === "COURSE_DETAILS" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}\`}><BookOpen className="w-5 h-5" strokeWidth={state === "COURSE_DETAILS" ? 2.5 : 2}/><span className="text-[10px] font-medium">Courses</span></button>\n                  <button onClick={() => setState("GAMES")} className={\`flex flex-col items-center gap-1 w-12 \${state === "GAMES" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"} relative\`}><Gamepad2 className="w-5 h-5" strokeWidth={state === "GAMES" ? 2.5 : 2}/>{state !== "GAMES" && <div className="absolute top-0 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>}<span className="text-[10px] font-medium">Games</span></button>\n                  <button onClick={() => setState("NOTES")} className={\`flex flex-col items-center gap-1 w-12 \${state === "NOTES" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}\`}><NotebookPen className="w-5 h-5" strokeWidth={state === "NOTES" ? 2.5 : 2}/><span className="text-[10px] font-medium">Notes</span></button>\n                  <button onClick={() => setState("PROFILE")} className={\`flex flex-col items-center gap-1 w-12 \${state === "PROFILE" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}\`}><User className="w-5 h-5" strokeWidth={state === "PROFILE" ? 2.5 : 2}/><span className="text-[10px] font-medium">Profile</span></button>\n                </div>\n              </motion.div>\n            )}`
);

fs.writeFileSync(file, content);
console.log('Refactor complete');
