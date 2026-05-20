with open("app/page.tsx", "r") as f:
    content = f.read()

# 1. Today's Inspiration & Mentor Chat Card wrap chat block
old_chat_block = """                    <div className="pt-4 border-t border-slate-100/60">
                      {messages.length > 0 && (
                        <div className="mb-2 space-y-3 pr-1">
                          {messages.slice(-1).map((msg, i) => {
                            const isMe = msg.from_user_id === mappedMentor?.id ? false : true;
                            return (
                              <div key={msg.id || i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group relative`}>
                                <div className="flex items-center gap-2 max-w-[85%]">
                                  {isMe && <button onClick={() => handleDeleteMessage(msg.id)} className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 transition-opacity shrink-0 animate-in fade-in" title="Delete Message"><Trash2 className="w-3.5 h-3.5" /></button>}
                                  <div className={`px-4 py-2.5 rounded-[1.25rem] text-[13.5px] font-medium leading-relaxed ${isMe ? 'bg-slate-900 text-white rounded-tr-none shadow-sm shadow-slate-900/5' : 'bg-slate-50 text-slate-700 border border-slate-100/60 rounded-tl-none shadow-xs'}`}>
                                    {msg.body}
                                  </div>
                                  {!isMe && <button onClick={() => handleDeleteMessage(msg.id)} className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 transition-opacity shrink-0 animate-in fade-in" title="Delete Message"><Trash2 className="w-3.5 h-3.5" /></button>}
                                </div>
                                <span className="text-[10px] font-medium text-slate-300 uppercase tracking-wider mt-1 ml-2 mr-2">{isMe ? 'You' : mappedMentor?.name || 'Mentor'}</span>
                              </div>
                            );
                          })}
                          {messages.length > 1 && (
                            <div className="flex justify-center -mt-1">
                              <button 
                                onClick={() => setState("MESSAGES")}
                                className="text-[10px] font-medium text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest px-4 py-1.5"
                              >
                                View all messages
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      <p className="text-[11px] text-slate-400 mb-1 font-medium">
                        {sendSuccess ? (
                          <span className="text-emerald-500 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Message sent successfully!
                          </span>
                        ) : mappedMentor ? (
                          `Connected with ${mappedMentor.name}`
                        ) : (
                          "Don't hesitate, every question matters."
                        )}
                      </p>
                      <div className="flex gap-2">
                        <Input 
                          value={messageInput}
                          disabled={sendLoading}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder={mappedMentor ? `Ask ${mappedMentor.name}...` : "Ask a quick question..."}
                          className="flex-1 border border-slate-200 rounded-2xl px-4.5 py-3 bg-slate-50/50 text-[14px] text-slate-800 outline-none hover:bg-slate-50 hover:border-slate-300 focus-visible:ring-slate-950 transition-all disabled:opacity-50 h-11"
                        />
                        <Button 
                          onClick={handleSendMessage}
                          disabled={sendLoading || !messageInput.trim()}
                          className={`${messageInput.trim() && !sendLoading ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-100 text-slate-400'} w-11 h-11 rounded-2xl flex items-center justify-center transition-all active:scale-95 shrink-0 disabled:opacity-50`}
                        >
                          {sendLoading ? (
                            <div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Send className="w-[18px] h-[18px]" />
                          )}
                        </Button>
                      </div>
                    </div>"""

new_chat_block = """                    {featureFlags.student_messages !== false && (
                      <div className="pt-4 border-t border-slate-100/60">
                        {messages.length > 0 && (
                          <div className="mb-2 space-y-3 pr-1">
                            {messages.slice(-1).map((msg, i) => {
                              const isMe = msg.from_user_id === mappedMentor?.id ? false : true;
                              return (
                                <div key={msg.id || i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group relative`}>
                                  <div className="flex items-center gap-2 max-w-[85%]">
                                    {isMe && <button onClick={() => handleDeleteMessage(msg.id)} className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 transition-opacity shrink-0 animate-in fade-in" title="Delete Message"><Trash2 className="w-3.5 h-3.5" /></button>}
                                    <div className={`px-4 py-2.5 rounded-[1.25rem] text-[13.5px] font-medium leading-relaxed ${isMe ? 'bg-slate-900 text-white rounded-tr-none shadow-sm shadow-slate-900/5' : 'bg-slate-50 text-slate-700 border border-slate-100/60 rounded-tl-none shadow-xs'}`}>
                                      {msg.body}
                                    </div>
                                    {!isMe && <button onClick={() => handleDeleteMessage(msg.id)} className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 transition-opacity shrink-0 animate-in fade-in" title="Delete Message"><Trash2 className="w-3.5 h-3.5" /></button>}
                                  </div>
                                  <span className="text-[10px] font-medium text-slate-300 uppercase tracking-wider mt-1 ml-2 mr-2">{isMe ? 'You' : mappedMentor?.name || 'Mentor'}</span>
                                </div>
                              );
                            })}
                            {messages.length > 1 && (
                              <div className="flex justify-center -mt-1">
                                <button 
                                  onClick={() => setState("MESSAGES")}
                                  className="text-[10px] font-medium text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest px-4 py-1.5"
                                >
                                  View all messages
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                        <p className="text-[11px] text-slate-400 mb-1 font-medium">
                          {sendSuccess ? (
                            <span className="text-emerald-500 font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Message sent successfully!
                            </span>
                          ) : mappedMentor ? (
                            `Connected with ${mappedMentor.name}`
                          ) : (
                            "Don't hesitate, every question matters."
                          )}
                        </p>
                        <div className="flex gap-2">
                          <Input 
                            value={messageInput}
                            disabled={sendLoading}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder={mappedMentor ? `Ask ${mappedMentor.name}...` : "Ask a quick question..."}
                            className="flex-1 border border-slate-200 rounded-2xl px-4.5 py-3 bg-slate-50/50 text-[14px] text-slate-800 outline-none hover:bg-slate-50 hover:border-slate-300 focus-visible:ring-slate-950 transition-all disabled:opacity-50 h-11"
                          />
                          <Button 
                            onClick={handleSendMessage}
                            disabled={sendLoading || !messageInput.trim()}
                            className={`${messageInput.trim() && !sendLoading ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-100 text-slate-400'} w-11 h-11 rounded-2xl flex items-center justify-center transition-all active:scale-95 shrink-0 disabled:opacity-50`}
                          >
                            {sendLoading ? (
                              <div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                            ) : (
                              <Send className="w-[18px] h-[18px]" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}"""

content = content.replace(old_chat_block, new_chat_block)

# 2. Dynamic Content Rows / cards in DASHBOARD_MAIN
# Games row wrap
old_games_row = """                  {/* Gaming Quiz Row (Redirects directly to GAMES state) */}
                  <div 
                    onClick={() => setState("GAMES")}
                    className="bg-white rounded-[1.25rem] p-4 flex items-center shadow-sm border border-slate-100/50 relative cursor-pointer group hover:shadow-md hover:border-slate-200 transition-all active:scale-99"
                  >
                    <div className="bg-gradient-to-tr from-amber-500 to-orange-600 text-white p-3.5 rounded-2xl mr-4.5 shadow-sm group-hover:scale-105 group-hover:rotate-3 transition-all"><Swords className="w-5 h-5" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-[14.5px] font-medium text-slate-800">Learning Arena</p>
                        <span className="bg-[#dcfce7] text-[#166534] text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-widest">Live</span>
                      </div>
                      <p className="text-[12px] text-slate-400 font-medium">S&L or KBC points quiz · 300+ coins</p>
                    </div>
                    <div className="flex items-center shrink-0">
                      <div className="flex -space-x-1.5 mr-3">
                         <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 bg-[url('https://i.pravatar.cc/100?img=11')] bg-cover shadow-xs"></div>
                         <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 bg-[url('https://i.pravatar.cc/100?img=12')] bg-cover shadow-xs"></div>
                         <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 bg-[url('https://i.pravatar.cc/100?img=5')] bg-cover shadow-xs"></div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>"""

new_games_row = """                  {/* Gaming Quiz Row (Redirects directly to GAMES state) */}
                  {featureFlags.student_games !== false && (
                    <div 
                      onClick={() => setState("GAMES")}
                      className="bg-white rounded-[1.25rem] p-4 flex items-center shadow-sm border border-slate-100/50 relative cursor-pointer group hover:shadow-md hover:border-slate-200 transition-all active:scale-99"
                    >
                      <div className="bg-gradient-to-tr from-amber-500 to-orange-600 text-white p-3.5 rounded-2xl mr-4.5 shadow-sm group-hover:scale-105 group-hover:rotate-3 transition-all"><Swords className="w-5 h-5" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-[14.5px] font-medium text-slate-800">Learning Arena</p>
                          <span className="bg-[#dcfce7] text-[#166534] text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-widest">Live</span>
                        </div>
                        <p className="text-[12px] text-slate-400 font-medium">S&L or KBC points quiz · 300+ coins</p>
                      </div>
                      <div className="flex items-center shrink-0">
                        <div className="flex -space-x-1.5 mr-3">
                           <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 bg-[url('https://i.pravatar.cc/100?img=11')] bg-cover shadow-xs"></div>
                           <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 bg-[url('https://i.pravatar.cc/100?img=12')] bg-cover shadow-xs"></div>
                           <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 bg-[url('https://i.pravatar.cc/100?img=5')] bg-cover shadow-xs"></div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  )}"""

content = content.replace(old_games_row, new_games_row)

# Notes row wrap
old_notes_row = """                  {/* Running Notes Row (Redirects to NOTES state) */}
                  <div 
                    onClick={() => setState("NOTES")}
                    className="bg-white rounded-[1.25rem] p-4 flex items-center shadow-sm border border-slate-100/50 relative cursor-pointer group hover:shadow-md hover:border-slate-200 transition-all active:scale-99"
                  >
                    <div className="bg-slate-100 text-slate-500 p-3.5 rounded-2xl mr-4.5 shadow-xs group-hover:scale-105 group-hover:rotate-3 transition-all"><NotebookPen className="w-5 h-5" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-[14.5px] font-medium text-slate-800">Study Notebook</p>
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-full font-lato">2</span>
                      </div>
                      <p className="text-[12px] text-slate-400 font-medium">Text notes & lecture boards</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </div>"""

new_notes_row = """                  {/* Running Notes Row (Redirects to NOTES state) */}
                  {featureFlags.student_notes !== false && (
                    <div 
                      onClick={() => setState("NOTES")}
                      className="bg-white rounded-[1.25rem] p-4 flex items-center shadow-sm border border-slate-100/50 relative cursor-pointer group hover:shadow-md hover:border-slate-200 transition-all active:scale-99"
                    >
                      <div className="bg-slate-100 text-slate-500 p-3.5 rounded-2xl mr-4.5 shadow-xs group-hover:scale-105 group-hover:rotate-3 transition-all"><NotebookPen className="w-5 h-5" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-[14.5px] font-medium text-slate-800">Study Notebook</p>
                          <span className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-full font-lato">2</span>
                        </div>
                        <p className="text-[12px] text-slate-400 font-medium">Text notes & lecture boards</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </div>
                  )}"""

content = content.replace(old_notes_row, new_notes_row)

# Gratitude wall wrap
old_gratitude_row = """                   {/* Gratitude Wall */}
                  <div className="bg-white rounded-[1.25rem] p-4 flex items-center shadow-sm border border-slate-100/50 relative cursor-pointer group hover:shadow-md hover:border-slate-200 transition-all active:scale-99" onClick={() => setState("GRATITUDE_WALL")}>
                    <div className="bg-rose-50 text-rose-500 p-3.5 rounded-2xl mr-4.5 shadow-xs group-hover:scale-105 group-hover:rotate-3 transition-all"><Heart className="w-5 h-5" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-[14.5px] font-medium text-slate-800">Gratitude Wall</p>
                        <span className="text-rose-500 text-[11px] font-medium font-lato">3 / 12</span>
                      </div>
                      <p className="text-[12px] text-slate-400 font-medium">Send tokens of appreciation</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </div>"""

new_gratitude_row = """                   {/* Gratitude Wall */}
                  {featureFlags.student_gratitude !== false && (
                    <div className="bg-white rounded-[1.25rem] p-4 flex items-center shadow-sm border border-slate-100/50 relative cursor-pointer group hover:shadow-md hover:border-slate-200 transition-all active:scale-99" onClick={() => setState("GRATITUDE_WALL")}>
                      <div className="bg-rose-50 text-rose-500 p-3.5 rounded-2xl mr-4.5 shadow-xs group-hover:scale-105 group-hover:rotate-3 transition-all"><Heart className="w-5 h-5" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-[14.5px] font-medium text-slate-800">Gratitude Wall</p>
                          <span className="text-rose-500 text-[11px] font-medium font-lato">3 / 12</span>
                        </div>
                        <p className="text-[12px] text-slate-400 font-medium">Send tokens of appreciation</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </div>
                  )}"""

content = content.replace(old_gratitude_row, new_gratitude_row)

# Portfolio wrap
old_portfolio_row = """                  {/* My Portfolio */}
                  <div className="bg-white rounded-[1.25rem] p-4 flex items-center shadow-sm border border-slate-100/50 relative cursor-pointer group hover:shadow-md hover:border-slate-200 transition-all active:scale-99" onClick={() => setState("PORTFOLIO")}>
                    <div className="bg-indigo-50 text-indigo-500 p-3.5 rounded-2xl mr-4.5 shadow-xs group-hover:scale-105 group-hover:rotate-3 transition-all"><Briefcase className="w-5 h-5" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-[14.5px] font-medium text-slate-800">Showcase Portfolio</p>
                        <span className="bg-indigo-50 text-indigo-600 text-[10px] font-medium px-2 py-0.5 rounded-full font-lato">4 projects</span>
                      </div>
                      <p className="text-[12px] text-slate-400 font-medium">Build as you learn modules</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </div>"""

new_portfolio_row = """                  {/* My Portfolio */}
                  {featureFlags.student_portfolio !== false && (
                    <div className="bg-white rounded-[1.25rem] p-4 flex items-center shadow-sm border border-slate-100/50 relative cursor-pointer group hover:shadow-md hover:border-slate-200 transition-all active:scale-99" onClick={() => setState("PORTFOLIO")}>
                      <div className="bg-indigo-50 text-indigo-500 p-3.5 rounded-2xl mr-4.5 shadow-xs group-hover:scale-105 group-hover:rotate-3 transition-all"><Briefcase className="w-5 h-5" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-[14.5px] font-medium text-slate-800">Showcase Portfolio</p>
                          <span className="bg-indigo-50 text-indigo-600 text-[10px] font-medium px-2 py-0.5 rounded-full font-lato">4 projects</span>
                        </div>
                        <p className="text-[12px] text-slate-400 font-medium">Build as you learn modules</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </div>
                  )}"""

content = content.replace(old_portfolio_row, new_portfolio_row)

# Wellness wrap
old_wellness_card = """                  {/* Mental Wellness card */}
                  <div className="bg-gradient-to-r from-[#effdf5] to-[#e0f2fe] rounded-[1.25rem] border border-[#a7f3d0]/30 p-4 flex flex-col shadow-sm cursor-pointer relative overflow-hidden group hover:shadow-md transition-all active:scale-99" onClick={() => setState("WELLNESS")}>
                     <div className="flex items-center justify-between relative z-10 mb-3">
                       <div className="flex items-center gap-3">
                         <div className="bg-white/75 text-[#14b8a6] p-2.5 rounded-xl backdrop-blur-sm shadow-xs group-hover:scale-105 transition-transform"><Heart className="w-[18px] h-[18px]" strokeWidth={2.5} /></div>
                         <div>
                           <div className="flex items-center gap-2">
                             <p className="text-[14.5px] font-medium text-teal-900">Mental Wellness</p>
                             <span className="bg-teal-100 text-teal-700 text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-widest">New</span>
                           </div>
                           <p className="text-[12px] text-teal-700/70 font-semibold leading-relaxed mt-0.5">Calm Reset · Gratitude Game · Memes</p>
                         </div>
                       </div>
                       <ChevronRight className="w-4 h-4 text-teal-500/50 group-hover:translate-x-0.5 transition-transform" />
                     </div>
                     <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-medium text-teal-800/60 relative z-10 px-1">
                       <span className="flex items-center gap-1">🧘 Brain Recharge</span>
                       <span className="flex items-center gap-1">🙏 Gratitude Points</span>
                       <span className="flex items-center gap-1">😂 Daily Memes</span>
                     </div>
                  </div>"""

new_wellness_card = """                  {/* Mental Wellness card */}
                  {featureFlags.student_wellness !== false && (
                    <div className="bg-gradient-to-r from-[#effdf5] to-[#e0f2fe] rounded-[1.25rem] border border-[#a7f3d0]/30 p-4 flex flex-col shadow-sm cursor-pointer relative overflow-hidden group hover:shadow-md transition-all active:scale-99" onClick={() => setState("WELLNESS")}>
                       <div className="flex items-center justify-between relative z-10 mb-3">
                         <div className="flex items-center gap-3">
                           <div className="bg-white/75 text-[#14b8a6] p-2.5 rounded-xl backdrop-blur-sm shadow-xs group-hover:scale-105 transition-transform"><Heart className="w-[18px] h-[18px]" strokeWidth={2.5} /></div>
                           <div>
                             <div className="flex items-center gap-2">
                               <p className="text-[14.5px] font-medium text-teal-900">Mental Wellness</p>
                               <span className="bg-teal-100 text-teal-700 text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-widest">New</span>
                             </div>
                             <p className="text-[12px] text-teal-700/70 font-semibold leading-relaxed mt-0.5">Calm Reset · Gratitude Game · Memes</p>
                           </div>
                         </div>
                         <ChevronRight className="w-4 h-4 text-teal-500/50 group-hover:translate-x-0.5 transition-transform" />
                       </div>
                       <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-medium text-teal-800/60 relative z-10 px-1">
                         <span className="flex items-center gap-1">🧘 Brain Recharge</span>
                         <span className="flex items-center gap-1">🙏 Gratitude Points</span>
                         <span className="flex items-center gap-1">😂 Daily Memes</span>
                       </div>
                    </div>
                  )}"""

content = content.replace(old_wellness_card, new_wellness_card)

# Facts wrap
old_facts_card = """                  {/* Interesting Facts card */}
                  <div className="bg-gradient-to-r from-[#fefce8] to-[#fffbeb] rounded-[1.25rem] border border-[#fde047]/30 p-4 flex flex-col shadow-sm cursor-pointer relative overflow-hidden group hover:shadow-md transition-all active:scale-99" onClick={() => setState("FACTS")}>
                     <div className="flex items-center justify-between relative z-10 mb-3">
                       <div className="flex items-center gap-3">
                         <div className="bg-amber-100/50 text-amber-600 p-2.5 rounded-xl backdrop-blur-sm shadow-xs group-hover:scale-105 transition-transform"><Lightbulb className="w-[18px] h-[18px]" strokeWidth={2.5} /></div>
                         <div>
                           <div className="flex items-center gap-2">
                             <p className="text-[14.5px] font-medium text-amber-900">Interesting Facts</p>
                             <span className="bg-amber-100 text-amber-700 text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-widest">New</span>
                           </div>
                           <p className="text-[12px] text-amber-700/70 font-semibold leading-relaxed mt-0.5">Small facts. Big inspiration.</p>
                         </div>
                       </div>
                       <ChevronRight className="w-4 h-4 text-amber-500/50 group-hover:translate-x-0.5 transition-transform" />
                     </div>
                     <span className="text-[11px] font-medium text-amber-800/60 px-1 relative z-10 leading-relaxed truncate block">
                        💡 {activeFact?.message || "Did you know? The first computer programmer was Ada Lovelace."}
                     </span>
                  </div>"""

new_facts_card = """                  {/* Interesting Facts card */}
                  {featureFlags.student_facts !== false && (
                    <div className="bg-gradient-to-r from-[#fefce8] to-[#fffbeb] rounded-[1.25rem] border border-[#fde047]/30 p-4 flex flex-col shadow-sm cursor-pointer relative overflow-hidden group hover:shadow-md transition-all active:scale-99" onClick={() => setState("FACTS")}>
                       <div className="flex items-center justify-between relative z-10 mb-3">
                         <div className="flex items-center gap-3">
                           <div className="bg-amber-100/50 text-amber-600 p-2.5 rounded-xl backdrop-blur-sm shadow-xs group-hover:scale-105 transition-transform"><Lightbulb className="w-[18px] h-[18px]" strokeWidth={2.5} /></div>
                           <div>
                             <div className="flex items-center gap-2">
                               <p className="text-[14.5px] font-medium text-amber-900">Interesting Facts</p>
                               <span className="bg-amber-100 text-amber-700 text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-widest">New</span>
                             </div>
                             <p className="text-[12px] text-amber-700/70 font-semibold leading-relaxed mt-0.5">Small facts. Big inspiration.</p>
                           </div>
                         </div>
                         <ChevronRight className="w-4 h-4 text-amber-500/50 group-hover:translate-x-0.5 transition-transform" />
                       </div>
                       <span className="text-[11px] font-medium text-amber-800/60 px-1 relative z-10 leading-relaxed truncate block">
                          💡 {activeFact?.message || "Did you know? The first computer programmer was Ada Lovelace."}
                       </span>
                    </div>
                  )}"""

content = content.replace(old_facts_card, new_facts_card)

# Let's save Step 1 changes
with open("app/page.tsx", "w") as f:
    f.write(content)

print("Step 1 changes completed successfully!")
