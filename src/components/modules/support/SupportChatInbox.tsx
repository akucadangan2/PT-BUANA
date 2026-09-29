'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Thread = { customer_id: string; customer_name: string; customer_phone: string | null; last_message: string; last_message_at: string; unread_count: number }
type Message = { id: string; sender_id: string; message: string; created_at: string }

export default function SupportChatInbox() {
  const supabase = createClient()
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Thread | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [myId, setMyId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [showRead, setShowRead] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setMyId(data.user?.id ?? null))
  }, [])

  async function loadThreads() {
    setLoading(true)
    const { data } = await supabase.rpc('get_support_threads_admin')
    setThreads(data ?? [])
    setLoading(false)
  }

  useEffect(() => { loadThreads() }, [])

  async function openThread(t: Thread) {
    setSelected(t)
    const { data } = await supabase.from('chat_messages').select('id, sender_id, message, created_at').eq('support_customer_id', t.customer_id).order('created_at')
    setMessages(data ?? [])
    if (myId) {
      await supabase.from('chat_messages').update({ read_at: new Date().toISOString() }).eq('support_customer_id', t.customer_id).neq('sender_id', myId).is('read_at', null)
    }
    loadThreads()
    setTimeout(() => bottomRef.current?.scrollIntoView(), 100)
  }

  async function send() {
    if (!selected || !input.trim() || !myId) return
    const text = input.trim()
    setInput('')
    await supabase.from('chat_messages').insert({ support_customer_id: selected.customer_id, sender_id: myId, message: text })
    const { data } = await supabase.from('chat_messages').select('id, sender_id, message, created_at').eq('support_customer_id', selected.customer_id).order('created_at')
    setMessages(data ?? [])
    setTimeout(() => bottomRef.current?.scrollIntoView(), 100)
  }

  function filterThreads(list: Thread[]) {
    if (!search.trim()) return list
    const q = search.trim().toLowerCase()
    return list.filter((t) => (t.customer_name ?? '').toLowerCase().includes(q) || (t.customer_phone ?? '').toLowerCase().includes(q))
  }

  const unreadThreads = filterThreads(threads.filter((t) => t.unread_count > 0))
  const readThreads = filterThreads(threads.filter((t) => t.unread_count === 0))

  function ThreadRow({ t }: { t: Thread }) {
    return (
      <button
        onClick={() => openThread(t)}
        className={`w-full px-4 py-3 text-left hover:bg-canvas ${selected?.customer_id === t.customer_id ? 'bg-primary-light' : ''}`}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-ink">{t.customer_name || '-'}</p>
          {t.unread_count > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber px-1.5 text-[11px] font-semibold text-white">{t.unread_count}</span>
          )}
        </div>
        <p className="mt-1 truncate text-xs text-muted">{t.last_message}</p>
      </button>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Support Chat</h1>
        <p className="text-sm text-muted">Direct support conversations with customers</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="overflow-hidden rounded-lg border border-line bg-surface">
          <div className="border-b border-line p-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or phone..."
              className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          {loading ? (
            <p className="p-4 text-sm text-muted">Loading...</p>
          ) : unreadThreads.length === 0 && readThreads.length === 0 ? (
            <p className="p-4 text-sm text-muted">{search ? 'No matching conversations' : 'No conversations yet'}</p>
          ) : (
            <div className="max-h-[560px] overflow-y-auto">
              <div className="divide-y divide-line">
                {unreadThreads.map((t) => <ThreadRow key={t.customer_id} t={t} />)}
              </div>

              {readThreads.length > 0 && (
                <>
                  <button
                    onClick={() => setShowRead(!showRead)}
                    className="flex w-full items-center gap-2 border-t border-line px-4 py-2.5 text-xs font-semibold text-muted hover:bg-canvas"
                  >
                    <svg className={`h-3 w-3 transition-transform ${showRead ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Read ({readThreads.length})
                  </button>
                  {showRead && (
                    <div className="divide-y divide-line border-t border-line">
                      {readThreads.map((t) => <ThreadRow key={t.customer_id} t={t} />)}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex min-h-[500px] flex-col rounded-lg border border-line bg-surface">
          {!selected ? (
            <div className="flex flex-1 items-center justify-center text-sm text-muted">Select a conversation on the left</div>
          ) : (
            <>
              <div className="border-b border-line px-4 py-3">
                <p className="text-sm font-semibold text-ink">{selected.customer_name}</p>
                <p className="text-xs text-muted">{selected.customer_phone ?? '-'}</p>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto p-4">
                {messages.map((m) => {
                  const isMe = m.sender_id === myId
                  return (
                    <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${isMe ? 'bg-primary text-white' : 'border border-line bg-canvas text-ink'}`}>
                        {m.message}
                      </div>
                    </div>
                  )
                })}
                <div ref={bottomRef} />
              </div>
              <div className="flex gap-2 border-t border-line p-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  placeholder="Type a reply..."
                  className="flex-1 rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <button onClick={send} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white">Send</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}