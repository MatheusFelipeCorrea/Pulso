/**
 * useCopyToClipboard() - Hook para copiar texto
 * 
 * Copia texto para clipboard com feedback de sucesso.
 * 
 * @returns {object} - { copy, copied, error }
 * 
 * Uso:
 *   const { copy, copied } = useCopyToClipboard()
 *   <button onClick={() => copy('Texto a copiar')}>
 *     {copied ? 'Copiado!' : 'Copiar'}
 *   </button>
 */

import { useState } from 'react'

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(null)

  const copy = async (text) => {
    // Reset estados
    setCopied(false)
    setError(null)

    // Tenta usar API moderna
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        
        // Reset após 2s
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        setError(err)
        console.warn('useCopyToClipboard: Error copying to clipboard:', err)
      }
    }
    // Fallback para browsers antigos
    else {
      try {
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        
        const success = document.execCommand('copy')
        document.body.removeChild(textarea)

        if (success) {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } else {
          setError(new Error('execCommand failed'))
        }
      } catch (err) {
        setError(err)
        console.warn('useCopyToClipboard: Error with fallback method:', err)
      }
    }
  }

  return { copy, copied, error }
}
