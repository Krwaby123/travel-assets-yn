import DOMPurify from 'dompurify'

const ALLOWED_TAGS = ['strong', 'br', 'em', 'b', 'i', 'span']
const ALLOWED_ATTR = ['class']

export function sanitizeHtml (dirty) {
  if (!dirty) return ''
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    KEEP_CONTENT: true
  })
}

export default sanitizeHtml
