'use client'

import { useState } from 'react'

type Analytics = {
  views: number
  tests: number
  feedbackCount: number
  resultBreakdown: { result: string; value: number }[]
  recentSessions: { id: string; favoriteName: string; primaryResult: string; secondaryResult: string | null; createdAt: string }[]
  feedback: { id: string; answer: string; createdAt: string }[]
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [error, setError] = useState('')

  async function loadAnalytics(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    const response = await fetch('/api/admin', { headers: { 'x-admin-password': password } })
    if (!response.ok) {
      setError('Mật khẩu chưa đúng.')
      return
    }
    setAnalytics(await response.json())
  }

  if (!analytics) {
    return (
      <main className="admin-shell">
        <section className="admin-login">
          <p className="eyebrow">OWNER ACCESS</p>
          <h1>Analytics của bài test</h1>
          <p>Nhập mật khẩu để xem lượt truy cập, kết quả và câu trả lời.</p>
          <form onSubmit={loadAnalytics} className="admin-form">
            <input aria-label="Mật khẩu quản trị" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mật khẩu" required />
            <button type="submit">Xem thống kê</button>
          </form>
          {error && <p className="admin-error">{error}</p>}
        </section>
      </main>
    )
  }

  return (
    <main className="admin-shell">
      <section className="admin-content">
        <div className="admin-heading"><p className="eyebrow">OWNER DASHBOARD</p><h1>Những gì đang diễn ra</h1><p>Dữ liệu được cập nhật từ những lượt làm bài thật.</p></div>
        <div className="admin-stats">
          <article><span>Lượt xem</span><strong>{analytics.views}</strong></article>
          <article><span>Đã làm bài</span><strong>{analytics.tests}</strong></article>
          <article><span>Góc nhìn</span><strong>{analytics.feedbackCount}</strong></article>
        </div>
        <div className="admin-grid">
          <section className="admin-card"><h2>Kết quả chính</h2>{analytics.resultBreakdown.map((item) => <div className="breakdown-row" key={item.result}><span>{item.result}</span><strong>{item.value}</strong></div>)}</section>
          <section className="admin-card"><h2>Góc nhìn đã gửi</h2><div className="feedback-list">{analytics.feedback.length ? analytics.feedback.map((item) => <blockquote key={item.id}>{item.answer}<small>{new Date(item.createdAt).toLocaleString('vi-VN')}</small></blockquote>) : <p>Chưa có câu trả lời nào.</p>}</div></section>
        </div>
        <section className="admin-card"><h2>Lượt làm bài gần đây</h2><div className="session-list">{analytics.recentSessions.map((session) => <div className="session-row" key={session.id}><span>{session.favoriteName}</span><strong>{session.primaryResult}{session.secondaryResult ? ` + ${session.secondaryResult}` : ''}</strong><small>{new Date(session.createdAt).toLocaleString('vi-VN')}</small></div>)}</div></section>
      </section>
    </main>
  )
}
