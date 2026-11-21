import { GoogleGenerativeAI } from '@google/generative-ai'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { title, category, subCategory, techStack } = body

  // Ambil API Key dari runtime config biar kebaca mulus di Vercel
  const config = useRuntimeConfig()
  const apiKey = config.geminiApiKey
  
  if (!apiKey) {
    throw createError({ 
      statusCode: 500, 
      statusMessage: 'API Key Gemini belum terdeteksi dari env!' 
    })
  }
  
  const genAI = new GoogleGenerativeAI(apiKey)
  
  // Model paling ngebut dan akurat sekarang
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const prompt = `
    Kamu adalah copywriter untuk web portofolio software engineer & digital agency.
    Buatkan deskripsi yang profesional, padat, menarik, dan elegan.
    
    Data Project:
    - Judul: ${title}
    - Kategori: ${category} - ${subCategory}
    - Tech Stack: ${techStack || 'Tidak ada spesifikasi'}

    Kembalikan HANYA dalam format JSON valid (tanpa backtick markdown text atau hal lain):
    {
      "shortDescription": "1-2 kalimat padat yang fokus pada fungsi utama project",
      "longDescription": "Deskripsi lengkap 2 paragraf. Paragraf 1 overview. Paragraf 2 highlight fitur utama dan tech stack."
    }
  `

  try {
    const result = await model.generateContent(prompt)
    const responseText = result.response.text().trim()
    
    // Bersihkan kalau Gemini iseng ngasih formatting backtick markdown
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim()
    
    return JSON.parse(cleanJson)
  } catch (error: any) {
    console.error('Error Generative AI:', error)
    
    // Lempar pesan error bawaan supaya bisa dibaca di Log Vercel / UI Dashboard
    throw createError({ 
      statusCode: 500, 
      statusMessage: error.message || 'Gagal memproses AI' 
    })
  }
})