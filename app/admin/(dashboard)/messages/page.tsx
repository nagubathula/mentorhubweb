import { Input } from "@/components/ui/input";
import { Search, MessageSquare } from "lucide-react";

export default function MessagesPage() {
  const messages = [
    {
      id: 1,
      sender: "Arjun Mehta",
      time: "9:15 AM",
      snippet: "Sir, I'm stuck on list comprehensions. Can we discuss in today's session?",
      unread: true,
    },
    {
      id: 2,
      sender: "Sneha Iyer",
      time: "8:42 AM",
      snippet: "Submitted my Grade Calculator project for review!",
      unread: false,
    },
    {
      id: 3,
      sender: "Rahul Verma",
      time: "Yesterday",
      snippet: "I missed yesterday's lesson. How do I catch up?",
      unread: true,
    },
    {
      id: 4,
      sender: "Priya Sharma",
      time: "Yesterday",
      snippet: "Thanks for the extra resources on recursion!",
      unread: false,
    },
    {
      id: 5,
      sender: "Karthik Nair",
      time: "2 days ago",
      snippet: "Can I get an extension on the Data Types project?",
      unread: false,
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] p-10">
      <div className="mb-6 shrink-0">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Messages</h1>
        <p className="text-[15px] text-slate-500 mt-1">2 unread • 5 total</p>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* Left pane - Message List */}
        <div className="w-80 flex flex-col bg-white rounded-xl border object-contain shadow-sm overflow-hidden shrink-0">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search messages..."
                className="w-full pl-9 bg-slate-50 border-slate-100 h-9 text-sm"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {messages.map((msg) => (
              <button
                key={msg.id}
                className="w-full text-left p-4 border-b last:border-b-0 hover:bg-slate-50 transition-colors"
              >
                <div className="flex justify-between items-baseline mb-1">
                  <span className={`text-sm ${msg.unread ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                    {msg.sender}
                  </span>
                  <span className="text-xs text-slate-400">{msg.time}</span>
                </div>
                <p className="text-[13px] text-slate-500 line-clamp-1 mb-2">
                  {msg.snippet}
                </p>
                {msg.unread && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right pane - Message Detail (Empty State) */}
        <div className="flex-1 bg-white rounded-xl border shadow-sm flex flex-col items-center justify-center p-8">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100 text-slate-300">
            <MessageSquare className="w-8 h-8" />
          </div>
          <p className="text-slate-500 text-[15px]">Select a message to view</p>
        </div>
      </div>
    </div>
  );
}
