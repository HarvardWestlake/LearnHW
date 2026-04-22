import { useEffect } from 'react'

type StaticEmbedProps = {
  title: string
  src: string
}

export default function StaticEmbed({ title, src }: StaticEmbedProps) {
  useEffect(() => {
    const prev = document.title
    document.title = `${title} · Class Resources`
    // #region agent log
    fetch('/ingest/d9d3d22d-7daf-4f71-800f-c73eb656f3aa',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2bd63b'},body:JSON.stringify({sessionId:'2bd63b',location:'StaticEmbed.tsx:mount',message:'StaticEmbed mounted',data:{title,src},timestamp:Date.now(),hypothesisId:'H1-H3'})}).catch(()=>{});
    // #endregion
    return () => {
      document.title = prev
      // #region agent log
      fetch('/ingest/d9d3d22d-7daf-4f71-800f-c73eb656f3aa',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2bd63b'},body:JSON.stringify({sessionId:'2bd63b',location:'StaticEmbed.tsx:unmount',message:'StaticEmbed unmounted',data:{title},timestamp:Date.now(),hypothesisId:'H1-H3'})}).catch(()=>{});
      // #endregion
    }
  }, [title])

  // #region agent log
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'widget-nav') {
        fetch('/ingest/d9d3d22d-7daf-4f71-800f-c73eb656f3aa',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2bd63b'},body:JSON.stringify({sessionId:'2bd63b',location:'StaticEmbed.tsx:iframe-nav',message:'Iframe navigation detected via postMessage',data:e.data,timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])
  // #endregion

  return (
    <main className="page">
      <div className="container widgets-page">
        <div style={{ display: 'flex', gap: '.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <h1 className="h1" style={{ margin: 0 }}>{title}</h1>
          <a className="btn" href={src} target="_blank" rel="noreferrer">Open in new tab</a>
        </div>

        <section className="panel" style={{ marginTop: '1rem' }}>
          <iframe
            title={title}
            src={src}
            style={{
              width: '100%',
              height: '75vh',
              border: '1px solid rgba(0,0,0,.15)',
              borderRadius: 12,
              background: '#fff'
            }}
          />
        </section>
      </div>
    </main>
  )
}

