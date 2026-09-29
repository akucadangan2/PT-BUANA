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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Support Chat</h1>
        <p className="text-sm text-muted">Percakapan bantuan langsung dengan customer</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="overflow-hidden rounded-lg border border-line bg-surface">
          {loading ? (
            <p className="p-4 text-sm text-muted">Memuat...</p>
          ) : threads.length === 0 ? (
            <p className="p-4 text-sm text-muted">Belum ada percakapan</p>
          ) : (
            <div className="divide-y divide-line">
              {threads.map((t) => (
                <button
                  key={t.customer_id}
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
              ))}
            </div>
          )}
        </div>

        <div className="flex min-h-[500px] flex-col rounded-lg border border-line bg-surface">
          {!selected ? (
            <div className="flex flex-1 items-center justify-center text-sm text-muted">Pilih percakapan di sebelah kiri</div>
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
                  placeholder="Tulis balasan..."
                  className="flex-1 rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <button onClick={send} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white">Kirim</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}