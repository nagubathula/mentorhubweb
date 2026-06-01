with open("/home/rustymachine/Documents/GitHub/mentorhubweb/components/student/StudentGames.tsx", "r") as f:
    content = f.read()

# Normalize
content = content.replace('\r\n', '\n')

start_marker = '  return (\n    <div className="flex flex-col gap-3 font-sans pb-10">'
end_marker = 'function LeaderboardView'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    print(f"Found KbcGame return block from {start_idx} to {end_idx}")
    
    # We will replace everything in between start_idx and end_idx (excluding function LeaderboardView)
    # Let's construct the new code block
    replacement_code = '''  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 font-sans pb-10">
      {/* Column 1: KBC Game Board */}
      <div className="lg:col-span-8 flex flex-col gap-3">
        {/* Time & Income Header */}
        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-50 border border-slate-100">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className={`text-xs font-medium tabular-nums ${timer <= 10 ? "text-rose-500" : "text-slate-600"}`}>{timer}s</span>
            </div>

            <button
              onClick={() => setShowQuestionsList(!showQuestionsList)}
              className="text-xs font-medium text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 active:scale-95 transition-all lg:hidden"
            >
              Income Ladder: {activeLadderNode.amount}
            </button>

            <span className="hidden lg:inline-flex text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100/50">
              Current Rank: Level {level + 1}
            </span>

            <button
              onClick={handleQuitGame}
              className="text-xs font-medium text-slate-400 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 hover:text-slate-600 active:bg-slate-100"
            >
              {confirmQuitPrompt ? "Confirm Quit?" : "Quit"}
            </button>
          </div>

          {/* Horizontal Timer Bar */}
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div className={`h-full rounded-full ${timerColor}`} animate={{ width: `${timerPercent}%` }} transition={{ duration: 0.5 }} />
          </div>

          {/* Milestones Progress Tracker */}
          <div className="mt-3 flex items-center justify-between text-[9px] font-bold text-slate-400 border-t border-slate-50 pt-2 px-1">
            <span className={level >= 0 ? "text-indigo-600 font-extrabold" : ""}>Start (0)</span>
            <div className="flex-1 mx-2 h-0.5 border-t border-dashed border-slate-200" />
            <span className={level >= 5 ? "text-amber-500 font-extrabold" : ""}>🛡️ 20 Coins</span>
            <div className="flex-1 mx-2 h-0.5 border-t border-dashed border-slate-200" />
            <span className={level >= 10 ? "text-amber-500 font-extrabold" : ""}>🛡️ 80 Coins</span>
            <div className="flex-1 mx-2 h-0.5 border-t border-dashed border-slate-200" />
            <span className={level >= 14 ? "text-emerald-500 font-extrabold" : ""}>🏆 200 Coins</span>
          </div>
        </div>

        {/* Income Ladder Overlay List (Mobile only) */}
        <AnimatePresence>
          {showQuestionsList && (
            <motion.div
              className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm max-h-52 overflow-y-auto space-y-1.5 lg:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {[...KBC_LADDER].reverse().map((ladder, idx) => {
                const activeIdx = KBC_LADDER.length - 1 - idx;
                const isCurrent = activeIdx === level;
                const isPassed = activeIdx < level;

                return (
                  <div
                    key={ladder.level}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-[10px] font-medium ${
                      isCurrent
                        ? "bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm"
                        : isPassed
                        ? "bg-emerald-50 text-emerald-600"
                        : "text-slate-400"
                    }`}
                  >
                    <span className="w-5">{ladder.level}</span>
                    <span className={ladder.safe ? "text-amber-500 font-extrabold" : ""}>{ladder.amount}</span>
                    {ladder.safe && <span className="text-[8px] opacity-75">🛡️ Checkpoint</span>}
                    {isPassed && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                    {isCurrent && <span className="text-indigo-600">▶ Current</span>}
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Question Card */}
        <div className="relative bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-5 mb-1.5 overflow-hidden border border-indigo-500/25 shadow-lg">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />
          <div className="flex items-center justify-between mb-3 text-[10px] font-extrabold uppercase tracking-wide">
            <span className="text-indigo-300">Question {level + 1} of 15</span>
            <span className="text-yellow-400">For {activeLadderNode.amount}</span>
          </div>
          <p className="text-white text-xs font-medium leading-relaxed">{activeQuestion.question}</p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          {activeQuestion.options.map((opt: string, idx: number) => {
            const isRemoved = removedOptions.has(idx);
            const isSelected = lockedOption === idx;
            const isCorrect = idx === activeQuestion.correctIndex;

            let btnStyle = "bg-white border-slate-200 text-slate-700";
            if (isRemoved) btnStyle = "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed";
            else if (revealingStatus) {
              if (isCorrect) btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-700 font-medium";
              else if (isSelected) btnStyle = "bg-rose-50 border-rose-500 text-rose-700 font-medium";
            } else if (isSelected) {
              btnStyle = "bg-indigo-50 border-indigo-500 text-indigo-700 font-medium ring-1 ring-indigo-400";
            }

            return (
              <button
                key={idx}
                disabled={isRemoved || isRevealing}
                onClick={() => handleOptionClick(idx)}
                className={`px-3 py-3.5 rounded-xl border text-left transition-all text-xs flex items-center gap-2.5 ${btnStyle}`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 ${
                  isSelected ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-400"
                }`}>
                  {["A", "B", "C", "D"][idx]}
                </span>
                <span className="flex-1 leading-snug">{isRemoved ? "—" : opt}</span>
              </button>
            );
          })}
        </div>

        {/* Audience Poll Render */}
        <AnimatePresence>
          {audiencePoll && (
            <motion.div className="bg-purple-50 rounded-2xl p-4 mb-2 border border-purple-100 shadow-sm" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center gap-1.5 mb-3 text-purple-900">
                <span className="text-sm">📊</span>
                <p className="text-[10px] font-extrabold tracking-wider uppercase">Audience Poll Results</p>
              </div>
              <div className="space-y-2">
                {audiencePoll.map((percent, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-[10px] font-medium text-purple-500 w-3">{["A", "B", "C", "D"][idx]}</span>
                    <div className="flex-1 h-3 bg-purple-100 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-purple-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 0.6 }} />
                    </div>
                    <span className="text-[10px] font-extrabold text-purple-600 w-8 text-right">{percent}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lifeline Buttons */}
        <div className="flex items-center gap-2.5 mb-2">
          <button
            onClick={triggerFiftyFifty}
            disabled={!lifelines.fifty || isRevealing || !!revealingStatus}
            className={`flex-1 py-3 rounded-xl text-[10px] font-medium flex flex-col items-center gap-1 border transition-all ${
              lifelines.fifty && !isRevealing && !revealingStatus
                ? "bg-white border-slate-200 text-slate-600 active:scale-95 shadow-sm"
                : "bg-slate-100 border-slate-200 text-slate-300"
            }`}
          >
            <BadgeHelp className="w-4 h-4" />
            50:50 Lifeline
          </button>

          <button
            onClick={triggerAudiencePoll}
            disabled={!lifelines.audience || isRevealing || !!revealingStatus}
            className={`flex-1 py-3 rounded-xl text-[10px] font-medium flex flex-col items-center gap-1 border transition-all ${
              lifelines.audience && !isRevealing && !revealingStatus
                ? "bg-white border-slate-200 text-slate-600 active:scale-95 shadow-sm"
                : "bg-slate-100 border-slate-200 text-slate-300"
            }`}
          >
            <Users className="w-4 h-4" />
            Audience Poll
          </button>
        </div>

        {/* Lock Answer Action Trigger */}
        <Button
          onClick={lockOptionSelected}
          disabled={lockedOption === null || isRevealing}
          className={`w-full py-4 h-12 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
            lockedOption !== null && !isRevealing
              ? "bg-slate-900 hover:bg-slate-800 text-white shadow-md active:scale-[0.98]"
              : isRevealing
              ? "bg-amber-100 text-amber-700 cursor-not-allowed"
              : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
          }`}
        >
          {isRevealing ? (
            <>
              <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>⏳</motion.span>
              Locking Answer...
            </>
          ) : "Confirm Answer"}
        </Button>

        {/* Feedback Banner */}
        <AnimatePresence>
          {revealingStatus && (
            <motion.div
              className={`rounded-xl px-3.5 py-3 flex items-center gap-2 text-xs font-medium border ${
                revealingStatus === "correct" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span>{revealingStatus === "correct" ? "🎉" : "😔"}</span>
              <span>
                {revealingStatus === "correct"
                  ? level === KBC_LADDER.length - 1
                    ? "AMAZING! You won 200 Coins!"
                    : "Correct! Level Up ➔ " + KBC_LADDER[level + 1].amount
                  : "Wrong! You walk away with " + getSafeCheckPointAmount().amount}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Column 2: KBC Coin Ladder Panel (Always visible on Desktop) */}
      <div className="hidden lg:flex lg:flex-col lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm self-start space-y-1.5 sticky top-4">
        <h4 className="text-slate-800 text-xs font-black tracking-tight mb-2 uppercase text-center border-b border-slate-100 pb-2 flex items-center justify-center gap-1.5">
          💎 Coin Ladder
        </h4>
        {[...KBC_LADDER].reverse().map((ladder, idx) => {
          const activeIdx = KBC_LADDER.length - 1 - idx;
          const isCurrent = activeIdx === level;
          const isPassed = activeIdx < level;

          return (
            <div
              key={ladder.level}
              className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-[10px] font-semibold transition-all ${
                isCurrent
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-[1.02]"
                  : isPassed
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-slate-400"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] ${isCurrent ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"}`}>
                  {ladder.level}
                </span>
                <span className={ladder.safe && !isCurrent ? "text-amber-500 font-extrabold animate-pulse" : ""}>
                  {ladder.amount}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {ladder.safe && <span className={`text-[7px] uppercase font-bold tracking-wider ${isCurrent ? "text-white/80" : "text-amber-500"}`}>🛡️ Checkpoint</span>}
                {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                {isCurrent && <span className="text-[8px] uppercase font-extrabold tracking-wider bg-white/25 text-white px-1.5 py-0.5 rounded-md animate-pulse">▶ Playing</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );\n\n  '''
    
    new_content = content[:start_idx] + replacement_code + content[end_idx:]
    with open("/home/rustymachine/Documents/GitHub/mentorhubweb/components/student/StudentGames.tsx", "w") as f:
        f.write(new_content)
    print("SUCCESS: Perfectly replaced KBC game layout!")
else:
    print("Could not locate start or end index markers!")
