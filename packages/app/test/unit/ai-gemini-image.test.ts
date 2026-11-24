import { describe, it, expect } from 'vitest'
import { extractGeminiImage } from '../../server/utils/ai'

const png = Buffer.from('fake image bytes')
const imagePart = { inlineData: { mimeType: 'image/png', data: png.toString('base64') } }

describe('extractGeminiImage', () => {
  it('reads the image of a generateContent response', () => {
    const data = { candidates: [{ content: { parts: [imagePart] } }] }
    expect(extractGeminiImage(data)?.equals(png)).toBe(true)
  })

  it('skips text parts in front of the image', () => {
    const data = { candidates: [{ content: { parts: [{ text: 'Here you go' }, imagePart] } }] }
    expect(extractGeminiImage(data)?.equals(png)).toBe(true)
  })

  it('returns null when the response has no image', () => {
    expect(extractGeminiImage({ candidates: [{ finishReason: 'IMAGE_SAFETY' }] })).toBeNull()
    expect(extractGeminiImage({ candidates: [{ content: { parts: [{ text: 'I cannot draw that' }] } }] })).toBeNull()
    expect(extractGeminiImage({ predictions: [{ bytesBase64Encoded: 'abc' }] })).toBeNull()
    expect(extractGeminiImage({})).toBeNull()
  })
})
