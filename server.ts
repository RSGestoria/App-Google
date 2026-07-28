import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get GoogleGenAI instance safely
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. API Route: Analyze Instagram / Website Brand Profile
app.post('/api/analyze-brand', async (req, res) => {
  try {
    const { url, handle } = req.body;
    if (!url && !handle) {
      return res.status(400).json({ error: 'Forneça um link de site ou usuário do Instagram.' });
    }

    const ai = getGenAI();
    const promptText = `Análise a marca/perfil com base nas seguintes informações:
Handle Instagram: ${handle || 'Não informado'}
URL / Website: ${url || 'Não informado'}

Identifique ou deduza estrategicamente para criar carrosséis do Instagram 3:4 de alta conversão:
1. Nome da marca
2. Paleta de cores recomendada (Primary, Secondary, Background, Text, Accent em HEX)
3. Estilo de tipografia (sans-modern, serif-display, tech-bold ou editorial)
4. Nicho principal de atuação
5. Tom de voz (ex: "Educativo e Confiante", "Direto e Minimalista", "Empoderador e Luxuoso")
6. Tagline ou frase marcante
7. Sugestão de cores de fundo do carrossel (escuro elegante #0f172a, claro minimalista #f8fafc, ou cor temática da marca).

Retorne EXATAMENTE em formato JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            handle: { type: Type.STRING },
            primaryColor: { type: Type.STRING },
            secondaryColor: { type: Type.STRING },
            backgroundColor: { type: Type.STRING },
            textColor: { type: Type.STRING },
            accentColor: { type: Type.STRING },
            fontPairing: { type: Type.STRING },
            niche: { type: Type.STRING },
            tone: { type: Type.STRING },
            tagline: { type: Type.STRING },
          },
          required: ['name', 'primaryColor', 'secondaryColor', 'backgroundColor', 'textColor', 'accentColor', 'fontPairing', 'niche', 'tone'],
        },
      },
    });

    const data = JSON.parse(response.text || '{}');
    const sanitizedHandle = handle ? (handle.startsWith('@') ? handle : `@${handle}`) : `@${(data.name || 'marca').toLowerCase().replace(/\s+/g, '')}`;

    return res.json({
      handle: sanitizedHandle,
      name: data.name || handle || 'Minha Marca',
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      primaryColor: data.primaryColor || '#6366f1',
      secondaryColor: data.secondaryColor || '#a855f7',
      backgroundColor: data.backgroundColor || '#0f172a',
      textColor: data.textColor || '#f8fafc',
      accentColor: data.accentColor || '#ec4899',
      fontPairing: (['sans-modern', 'serif-display', 'tech-bold', 'editorial'].includes(data.fontPairing) ? data.fontPairing : 'sans-modern'),
      website: url || '',
      niche: data.niche || 'Digital Marketing',
      tone: data.tone || 'Profissional e Atraente',
      tagline: data.tagline || 'Especialista no assunto',
    });
  } catch (error: any) {
    console.error('Error analyzing brand:', error);
    return res.status(500).json({ error: error?.message || 'Erro ao analisar a marca com IA.' });
  }
});

// 2. API Route: Generate Carousel from Prompt / Theme
app.post('/api/generate-carousel', async (req, res) => {
  try {
    const { prompt, niche, brand, slideCount = 5, language = 'pt-BR', useBrandData = false } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Descreva o tema do seu carrossel.' });
    }

    const ai = getGenAI();
    const isSpanish = language === 'es-LA';
    const numSlides = Math.max(1, Math.min(10, Number(slideCount) || 5));

    const brandInfoContext = (useBrandData || brand?.website)
      ? `\nCONTEXTO DA MARCA/WEBSITE:
Nome da Marca: ${brand?.name || 'Marca'}
Handle Instagram: ${brand?.handle || '@seuperfil'}
Website: ${brand?.website || 'Não informado'}
Nicho de Mercado: ${niche || brand?.niche || 'Geral'}
Tom de Voz: ${brand?.tone || 'Inspirador e Profissional'}
Slogan/Propósito: ${brand?.tagline || ''}`
      : '';

    const systemPrompt = isSpanish
      ? `Eres un estratega sénior de marketing de contenidos en Instagram especializado en publicaciones y carruseles de formato 3:4 de alta retención y conversión.
Tu misión es crear una secuencia de exactamente ${numSlides} ${numSlides === 1 ? 'diapositiva / publicación única' : 'diapositivas de carrusel'} EN ESPAÑOL LATINOAMERICANO con gatillos mentales, frases cortas, títulos magnéticos y llamados a la acción (CTA) súper efectivos.

REGLA OBLIGATORIA:
1. Todo el contenido DEBE ESTAR ESCRITO 100% EN ESPAÑOL LATINOAMERICANO.
2. DEBES GENERAR OBLIGATORIAMENTE DOS LEYENDAS (CAPTIONS) DISTINTAS:
   - 'caption' (Opción 1 - Directa & Persuasiva): Enfocada en valor inmediato, viñetas de puntos clave y un CTA claro de guardado/comentarios.
   - 'caption2' (Opción 2 - Storytelling & Interacción): Enfocada en narrativa, historia personal/de marca, conexión emocional y pregunta final para disparar comentarios.

Pautas de las diapositivas:
${numSlides === 1 
  ? "- Al ser 1 sola página/post: usa layout 'cover' o 'content' con un gran título impacto (Hook), cuerpo breve o bullets clave y un sello/badge atractivo."
  : `- Diapositiva 1: 'cover' -> Título principal llamativo (Hook), subtítulo que genere curiosidad y badge inicial.
- Diapositivas intermedias (2 a ${numSlides - 1}): 'content', 'comparison', 'checklist', 'quote' o 'stats' -> Puntos claros, 2-3 bullets por diapositiva.
- Diapositiva final (${numSlides}): 'cta' -> Llamado a la acción directo.`}
- Hashtags: 10 a 15 hashtags estratégicas en español.`
      : `Você é um estrategista sênior de marketing de conteúdo no Instagram especializado em posts e carrosséis de formato 3:4 de alta retenção e conversão.
Sua missão é criar uma sequência de exatamente ${numSlides} ${numSlides === 1 ? 'slide / publicação única' : 'slides de carrossel'} em PORTUGUÊS DO BRASIL com gatilhos mentais, frases curtas, títulos magnéticos e chamada para ação (CTA) fortíssima.

REGRA OBRIGATÓRIA:
1. Todo o conteúdo DEVE SER ESCRITO 100% EM PORTUGUÊS DO BRASIL.
2. VOCÊ DEVE GERAR OBRIGATORIAMENTE DUAS LEGENDAS (CAPTIONS) DISTINTAS E PRONTAS:
   - 'caption' (Opção 1 - Direta & Persuasiva): Focada em entrega direta de valor, tópicos resumidos e CTA claro para salvar/compartilhar.
   - 'caption2' (Opção 2 - Storytelling & Engajamento): Focada em narrativa envolvente, gancho de história de marca/experiência e pergunta instigante ao final para gerar comentários.

Diretrizes dos slides:
${numSlides === 1 
  ? "- Por ser apenas 1 página (post único): use layout 'cover' ou 'content' com um grande título chamativo (Hook), corpo/resumo de alto valor e um selo/badge de destaque."
  : `- Slide 1: 'cover' -> Título principal super chamativo (Hook), subtítulo que gera curiosidade e badge inicial.
- Slides intermediários (2 a ${numSlides - 1}): 'content', 'comparison', 'checklist', 'quote' ou 'stats' -> Pontos claros, 2-3 bullets por slide.
- Slide final (${numSlides}): 'cta' -> Chamada de ação direta.`}
- Hashtags: 10 a 15 hashtags estratégicas divididas entre alcance amplo, nicho e específicas.`;

    const userPrompt = `Tema da Publicação: ${prompt}
Nicho: ${niche || brand?.niche || 'Geral'}
Marca/Handle: ${brand?.handle || '@seuperfil'}
Tom de Voz: ${brand?.tone || 'Inspirador e Direto'}
Idioma Requerido: ${isSpanish ? 'Español (Latinoamérica)' : 'Português (Brasil)'}${brandInfoContext}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            slides: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  layout: { type: Type.STRING, description: "cover, content, quote, comparison, checklist, stats, or cta" },
                  title: { type: Type.STRING },
                  subtitle: { type: Type.STRING },
                  body: { type: Type.STRING },
                  bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
                  quoteAuthor: { type: Type.STRING },
                  statNumber: { type: Type.STRING },
                  statLabel: { type: Type.STRING },
                  comparisonBefore: { type: Type.STRING },
                  comparisonAfter: { type: Type.STRING },
                  ctaText: { type: Type.STRING },
                  badgeText: { type: Type.STRING },
                },
                required: ['layout', 'title'],
              },
            },
            caption: { type: Type.STRING, description: "Option 1: Direct & Persuasive caption" },
            caption2: { type: Type.STRING, description: "Option 2: Storytelling & Engagement caption" },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['title', 'slides', 'caption', 'caption2', 'hashtags'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      title: parsed.title || prompt,
      slides: parsed.slides.map((s: any, idx: number) => ({
        id: `gen-slide-${idx + 1}-${Date.now()}`,
        layout: ['cover', 'content', 'quote', 'comparison', 'checklist', 'stats', 'cta'].includes(s.layout) ? s.layout : (idx === 0 ? 'cover' : idx === parsed.slides.length - 1 ? 'cta' : 'content'),
        title: s.title || (isSpanish ? `Diapositiva ${idx + 1}` : `Slide ${idx + 1}`),
        subtitle: s.subtitle || '',
        body: s.body || '',
        bullets: s.bullets || [],
        quoteAuthor: s.quoteAuthor || '',
        statNumber: s.statNumber || '',
        statLabel: s.statLabel || '',
        comparisonBefore: s.comparisonBefore || '',
        comparisonAfter: s.comparisonAfter || '',
        ctaText: s.ctaText || (idx === parsed.slides.length - 1 ? (isSpanish ? 'Guarda para ver después 📌' : 'Salve para ver depois 📌') : ''),
        badgeText: s.badgeText || (idx === 0 ? (isSpanish ? 'DESTACADO' : 'PASSO A PASSO') : `0${idx + 1}`),
      })),
      caption: parsed.caption || (isSpanish
        ? `🚀 ${prompt}\n\n¡Revisa todos los detalles en la publicación de arriba!\n\n💬 ¿Te gustó? ¡Guarda este post y compártelo con alguien a quien le sirva!`
        : `🚀 ${prompt}\n\nConfira todos os detalhes no carrossel acima!\n\n💬 Gostou? Salve este post e compartilhe com quem precisa ver isso!`),
      caption2: parsed.caption2 || (isSpanish
        ? `💡 Alguna vez te has preguntado sobre ${prompt}?\n\nAquí te comparto un análisis práctico paso a paso...\n\n👇 ¿Qué opina tu equipo al respecto? ¡Déjalo en los comentarios!`
        : `💡 Você já se perguntou como lidar com ${prompt}?\n\nAqui está um método prático que transformou a forma como encaramos isso...\n\n👇 Qual a sua opinião sobre esse tema? Me conta aqui nos comentários!`),
      hashtags: parsed.hashtags || (isSpanish
        ? ['#carruselinstagram', '#marketingdigital', '#contenidoDeValor', '#estrategiaDigital']
        : ['#instagramcarousel', '#marketingdigital', '#conteudodevalor', '#dicasgerais']),
    });
  } catch (error: any) {
    console.error('Error generating carousel:', error);
    return res.status(500).json({ error: error?.message || 'Erro ao gerar carrossel com IA.' });
  }
});

// 3. API Route: Generate Trending Ideas for Niche
app.post('/api/generate-ideas', async (req, res) => {
  try {
    const { niche } = req.body;
    const ai = getGenAI();

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Gere 6 ideias virais e de alto engajamento de carrosséis para o Instagram 3:4 no nicho de: "${niche || 'Marketing Digital e Negócios'}".
Cada ideia deve ter um título forte, uma frase de gancho (Hook), a categoria (ex: Tutorial, Mito vs Verdade, Framework, Lista Top 5, Erros Comuns), uma breve descrição e as tags do tema.
Responda em JSON.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ideas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  hook: { type: Type.STRING },
                  category: { type: Type.STRING },
                  description: { type: Type.STRING },
                  slidesCount: { type: Type.NUMBER },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['title', 'hook', 'category', 'description'],
              },
            },
          },
          required: ['ideas'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const ideas = (parsed.ideas || []).map((idea: any, index: number) => ({
      id: `idea-${index + 1}-${Date.now()}`,
      title: idea.title,
      niche: niche || 'Geral',
      hook: idea.hook,
      category: idea.category,
      description: idea.description,
      slidesCount: idea.slidesCount || 5,
      tags: idea.tags || ['Viral', 'Engajamento'],
    }));

    return res.json({ ideas });
  } catch (error: any) {
    console.error('Error generating ideas:', error);
    return res.status(500).json({ error: error?.message || 'Erro ao buscar ideias com IA.' });
  }
});

// 4. API Route: Generate Captions and Hashtags
app.post('/api/generate-captions', async (req, res) => {
  try {
    const { topic, keyTakeaway } = req.body;
    const ai = getGenAI();

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Gere 3 opções de legendas envolventes para o Instagram sobre o tema: "${topic}".
Dica adicional/Key takeaway: "${keyTakeaway || 'Agregar valor imediato'}".
Também gere 15 hashtags estratégicas agrupadas (Amplas, Nicho e Específicas).
Responda em JSON.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  style: { type: Type.STRING, description: "ex: Direta, Storytelling, Educacional" },
                  captionText: { type: Type.STRING },
                },
                required: ['style', 'captionText'],
              },
            },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['options', 'hashtags'],
        },
      },
    });

    return res.json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    console.error('Error generating captions:', error);
    return res.status(500).json({ error: error?.message || 'Erro ao gerar legendas.' });
  }
});

// 5. API Route: Generate AI Slide Background Image
app.post('/api/generate-slide-image', async (req, res) => {
  try {
    const { prompt, title, niche } = req.body;
    const ai = getGenAI();

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Gere 3 a 5 palavras-chave em inglês para busca de imagem estética no Unsplash que represente o fundo do slide de Instagram:
Título do Slide: "${title || ''}"
Tema Geral: "${prompt || niche || 'modern aesthetic technology'}"

Retorne em JSON com a propriedade 'keywords'.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            keywords: { type: Type.STRING },
          },
          required: ['keywords'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const cleanKeywords = (parsed.keywords || title || prompt || 'aesthetic abstract background').replace(/[^a-zA-Z0-9 ]/g, '');
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent('high resolution aesthetic dark background photo, ' + cleanKeywords)}?width=1080&height=1440&nologo=true&seed=${Math.floor(Math.random() * 99999)}`;

    return res.json({ imageUrl: pollinationsUrl });
  } catch (error: any) {
    console.error('Error generating slide image:', error);
    return res.json({ imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80' });
  }
});

// 6. API Route: Regenerate Individual Slide Content with AI
app.post('/api/regenerate-slide', async (req, res) => {
  try {
    const { currentSlide, topicPrompt, niche, brand, language = 'pt-BR' } = req.body;
    if (!currentSlide) {
      return res.status(400).json({ error: 'Slide atual não fornecido.' });
    }

    const ai = getGenAI();
    const isSpanish = language === 'es-LA';

    const systemPrompt = isSpanish
      ? `Eres un especialista en copywriting para Instagram. Reescribe y perfecciona ÚNICAMENTE el siguiente slide de carrusel (Layout: ${currentSlide.layout}).
Hazlo más persuasivo, magnético y claro. Mantén el layout '${currentSlide.layout}'. Retorna EN ESPAÑOL LATINOAMERICANO en formato JSON.`
      : `Você é um especialista em copywriting para Instagram. Reescreva e aprimore ÚNICAMENTE o seguinte slide de carrossel (Layout: ${currentSlide.layout}).
Torne-o mais persuasivo, chamativo e direto ao ponto. Mantenha o layout '${currentSlide.layout}'. Retorne EM PORTUGUÊS DO BRASIL em formato JSON.`;

    const userPrompt = `Slide Atual para Reescrever:
Título Atual: "${currentSlide.title || ''}"
Subtítulo Atual: "${currentSlide.subtitle || ''}"
Corpo/Texto: "${currentSlide.body || ''}"
Tópicos/Bullets: ${JSON.stringify(currentSlide.bullets || [])}
Contexto do Carrossel/Tema Geral: "${topicPrompt || niche || ''}"
Nicho da Marca: "${niche || brand?.niche || 'Geral'}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            body: { type: Type.STRING },
            bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
            quoteAuthor: { type: Type.STRING },
            statNumber: { type: Type.STRING },
            statLabel: { type: Type.STRING },
            comparisonBefore: { type: Type.STRING },
            comparisonAfter: { type: Type.STRING },
            ctaText: { type: Type.STRING },
            badgeText: { type: Type.STRING },
          },
          required: ['title'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      ...currentSlide,
      title: parsed.title || currentSlide.title,
      subtitle: parsed.subtitle !== undefined ? parsed.subtitle : currentSlide.subtitle,
      body: parsed.body !== undefined ? parsed.body : currentSlide.body,
      bullets: parsed.bullets !== undefined ? parsed.bullets : currentSlide.bullets,
      quoteAuthor: parsed.quoteAuthor || currentSlide.quoteAuthor,
      statNumber: parsed.statNumber || currentSlide.statNumber,
      statLabel: parsed.statLabel || currentSlide.statLabel,
      comparisonBefore: parsed.comparisonBefore || currentSlide.comparisonBefore,
      comparisonAfter: parsed.comparisonAfter || currentSlide.comparisonAfter,
      ctaText: parsed.ctaText || currentSlide.ctaText,
      badgeText: parsed.badgeText || currentSlide.badgeText,
    });
  } catch (error: any) {
    console.error('Error regenerating slide:', error);
    return res.status(500).json({ error: error?.message || 'Erro ao reescrever o slide.' });
  }
});

// Start Express Server with Vite integration
async function startServer() {
  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Carrossel Studio AI running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
