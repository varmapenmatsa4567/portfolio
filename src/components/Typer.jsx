import { useEffect, useState } from 'react'

// Typewriter that cycles through phrases.
export default function Typer({ phrases, speed = 55, pause = 1600 }) {
  const [text, setText] = useState('')
  const [i, setI] = useState(0)
  const [del, setDel] = useState(false)

  useEffect(() => {
    const word = phrases[i % phrases.length]
    let t
    if (!del && text === word) {
      t = setTimeout(() => setDel(true), pause)
    } else if (del && text === '') {
      setDel(false)
      setI((v) => v + 1)
    } else {
      t = setTimeout(() => {
        setText(word.slice(0, text.length + (del ? -1 : 1)))
      }, del ? 28 : speed)
    }
    return () => clearTimeout(t)
  }, [text, del, i, phrases, speed, pause])

  return (
    <span className="typer">
      {text}
      <span className="caret">▍</span>
    </span>
  )
}
