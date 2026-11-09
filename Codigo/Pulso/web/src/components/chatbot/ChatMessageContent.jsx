/**
 * Renderiza Markdown leve do assistente (negrito, itálico, listas, R$).
 * Sem HTML cru — só nós React a partir do texto.
 */

function renderInline(text, keyPrefix = 'i') {
    const parts = String(text || '').split(/(\*\*[^*]+\*\*|\*[^*]+\*|R\$\s?[\d.,]+)/g)

    return parts.map((part, i) => {
        const key = `${keyPrefix}-${i}`
        if (!part) return null

        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
            return <strong key={key}>{renderInline(part.slice(2, -2), `${key}-b`)}</strong>
        }

        if (
            part.startsWith('*') &&
            part.endsWith('*') &&
            part.length > 2 &&
            !part.startsWith('**')
        ) {
            return <em key={key}>{renderInline(part.slice(1, -1), `${key}-e`)}</em>
        }

        if (/^R\$\s?[\d.,]+$/.test(part)) {
            return (
                <strong key={key} className="chatbot-msg__money">
                    {part}
                </strong>
            )
        }

        return <span key={key}>{part}</span>
    })
}

function isListLine(line) {
    return /^\s*([-*]|\d+\.)\s+/.test(line)
}

function listItemText(line) {
    return line.replace(/^\s*([-*]|\d+\.)\s+/, '')
}

export default function ChatMessageContent({ content }) {
    const lines = String(content || '')
        .replace(/\r\n/g, '\n')
        .split('\n')
    const blocks = []
    let i = 0

    while (i < lines.length) {
        const line = lines[i]

        if (!line.trim()) {
            i += 1
            continue
        }

        if (isListLine(line)) {
            const ordered = /^\s*\d+\./.test(line)
            const items = []
            while (i < lines.length && isListLine(lines[i])) {
                items.push(listItemText(lines[i]))
                i += 1
            }
            const ListTag = ordered ? 'ol' : 'ul'
            blocks.push(
                <ListTag key={`list-${blocks.length}`} className="chatbot-msg__list">
                    {items.map((item, idx) => (
                        <li key={idx}>{renderInline(item, `li-${blocks.length}-${idx}`)}</li>
                    ))}
                </ListTag>
            )
            continue
        }

        const para = []
        while (i < lines.length && lines[i].trim() && !isListLine(lines[i])) {
            para.push(lines[i])
            i += 1
        }
        blocks.push(
            <p key={`p-${blocks.length}`} className="chatbot-msg__p">
                {renderInline(para.join(' '), `p-${blocks.length}`)}
            </p>
        )
    }

    if (!blocks.length) {
        return <p className="chatbot-msg__p">{renderInline('')}</p>
    }

    return <div className="chatbot-msg__md">{blocks}</div>
}
