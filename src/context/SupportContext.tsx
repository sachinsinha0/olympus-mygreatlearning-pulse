import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import data from "../mocks/programSupport.json";

export type ChatMessage = {
  role: "bot" | "user";
  text: string;
  options?: string[];
  /** Rich in-chat picker rendered under a bot message (e.g. project cards). */
  widget?: "projectCards" | "projectForm";
};
export type Thread = {
  id: string;
  category: string;
  title: string;
  status: "active" | "resolved" | "ticketed";
  timestamp: string;
  messages: ChatMessage[];
};
export type Ticket = {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  category: string;
};

type SupportState = {
  openTickets: Ticket[];
  closedTickets: Ticket[];
  threads: Thread[];
  getThread: (id: string) => Thread | undefined;
  createThread: (seed: { category: string; title: string; messages: ChatMessage[] }) => string;
  addMessage: (threadId: string, message: ChatMessage) => void;
  raiseTicket: (threadId: string) => void;
};

const SupportContext = createContext<SupportState | null>(null);

let counter = 0;
const nextId = (prefix: string) => `${prefix}_gen_${++counter}`;

export function SupportProvider({ children }: { children: ReactNode }) {
  const [openTickets, setOpenTickets] = useState<Ticket[]>(data.open as Ticket[]);
  const [closedTickets] = useState<Ticket[]>(data.closed as Ticket[]);
  const [threads, setThreads] = useState<Thread[]>(data.threads as Thread[]);

  const value = useMemo<SupportState>(
    () => ({
      openTickets,
      closedTickets,
      threads,
      getThread: (id) => threads.find((t) => t.id === id),
      createThread: (seed) => {
        const id = nextId("th");
        const thread: Thread = {
          id,
          category: seed.category,
          title: seed.title,
          status: "active",
          timestamp: "Just now",
          messages: seed.messages,
        };
        setThreads((prev) => [thread, ...prev]);
        return id;
      },
      addMessage: (threadId, message) =>
        setThreads((prev) =>
          prev.map((t) => (t.id === threadId ? { ...t, messages: [...t.messages, message] } : t))
        ),
      raiseTicket: (threadId) =>
        setThreads((prev) => {
          const thread = prev.find((t) => t.id === threadId);
          if (thread) {
            setOpenTickets((tickets) => [
              {
                id: nextId("t"),
                title: thread.title,
                subtitle: thread.messages[0]?.text ?? "Raised from Glaide chat",
                timestamp: "Just now",
                category: thread.category,
              },
              ...tickets,
            ]);
          }
          return prev.map((t) => (t.id === threadId ? { ...t, status: "ticketed" } : t));
        }),
    }),
    [openTickets, closedTickets, threads]
  );

  return <SupportContext.Provider value={value}>{children}</SupportContext.Provider>;
}

export function useSupport() {
  const ctx = useContext(SupportContext);
  if (!ctx) throw new Error("useSupport must be used within SupportProvider");
  return ctx;
}
