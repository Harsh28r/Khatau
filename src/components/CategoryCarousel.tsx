import { useEffect, useRef } from 'react'

export default function CategoryCarousel({ items, onSelect, active }: { items: string[]; onSelect: (v: string) => void; active: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let pos = 0
    let raf: number
    const animate = () => {
      pos -= 0.3
      el.style.backgroundPosition = `${pos}px 0`
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <div className="overflow-x-auto">
      <div ref={ref} className="flex gap-2 bg-[linear-gradient(90deg,rgba(0,0,0,0.04)_50%,transparent_50%)] bg-[length:20px_100%] p-2">
        <button onClick={() => onSelect('')} className={`whitespace-nowrap rounded-full px-4 py-1 text-sm ${active === '' ? 'bg-red-600 text-white' : 'border'}`}>All</button>
        {items.map((c) => (
          <button key={c} onClick={() => onSelect(c)} className={`whitespace-nowrap rounded-full px-4 py-1 text-sm ${active === c ? 'bg-red-600 text-white' : 'border'}`}>{c}</button>
        ))}
      </div>
    </div>
  )
}


