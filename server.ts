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

// Fallback Generators for high reliability when Gemini API key is reported leaked or unavailable
function getFallbackBrand(url?: string, handle?: string) {
  const cleanHandle = handle ? (handle.startsWith('@') ? handle : `@${handle}`) : '@minhamarca';
  const rawName = handle ? handle.replace(/^@/, '') : (url ? url.replace(/https?:\/\/(www\.)?/, '').split('.')[0] : 'Minha Marca');
  const capitalizedName = rawName ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : 'Minha Marca';

  return {
    handle: cleanHandle,
    name: capitalizedName,
    avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
    primaryColor: '#6366f1',
    secondaryColor: '#a855f7',
    backgroundColor: '#0f172a',
    textColor: '#f8fafc',
    accentColor: '#ec4899',
    fontPairing: 'sans-modern',
    website: url || '',
    niche: 'Digital Marketing & Growth',
    tone: 'Profissional e Atrativo',
    tagline: 'Especialista em criar conteúdo de alto impacto no Instagram',
  };
}

function getFallbackCarousel(prompt: string, numSlides: number, isSpanish: boolean, brand?: any) {
  const cleanPrompt = prompt.trim() || (isSpanish ? 'Estrategia de Crecimiento' : 'Estratégia de Crescimento');
  const slideCount = Math.max(1, Math.min(10, numSlides || 5));
  const slides: any[] = [];

  for (let i = 0; i < slideCount; i++) {
    if (i === 0) {
      slides.push({
        id: `gen-slide-1-${Date.now()}`,
        layout: 'cover',
        title: isSpanish ? `El Guía Definitivo: ${cleanPrompt}` : `O Guia Definitivo: ${cleanPrompt}`,
        subtitle: isSpanish
          ? 'Descubre la estrategia paso a paso para dominar este tema y escalar tus resultados.'
          : 'Descubra o passo a passo prático para dominar esse tema e acelerar seus resultados.',
        badgeText: isSpanish ? 'PASO A PASO' : 'GUIA PRÁTICO',
        ctaText: '',
      });
    } else if (i === slideCount - 1 && slideCount > 1) {
      slides.push({
        id: `gen-slide-${i + 1}-${Date.now()}`,
        layout: 'cta',
        title: isSpanish ? '¿Te Sirvió este Contenido?' : 'Gostou Desse Conteúdo?',
        subtitle: isSpanish
          ? 'Guarda este post para consultar después y compártelo con tu equipo.'
          : 'Salve esta publicação para consultar mais tarde e compartilhe com seu time.',
        ctaText: isSpanish ? '¡Guarda y Síguenos! 📌' : 'Salve e Siga o Perfil! 📌',
        badgeText: isSpanish ? 'ACCIÓN' : 'PRÓXIMO PASSO',
      });
    } else {
      const stepNum = i;
      if (i % 3 === 1) {
        slides.push({
          id: `gen-slide-${i + 1}-${Date.now()}`,
          layout: 'checklist',
          title: isSpanish ? `0${stepNum}. Pilar Fundamental` : `0${stepNum}. Pilar Fundamental`,
          subtitle: isSpanish ? 'Los elementos esenciales que debes aplicar:' : 'Os elementos essenciais que você precisa aplicar:',
          bullets: isSpanish
            ? ['Foco claro en el objetivo principal', 'Ejecución constante con retroalimentación', 'Medición de métricas clave']
            : ['Foco claro no objetivo principal', 'Execução consistente com feedback', 'Análise de métricas chave de sucesso'],
          badgeText: `PASSO 0${stepNum}`,
        });
      } else if (i % 3 === 2) {
        slides.push({
          id: `gen-slide-${i + 1}-${Date.now()}`,
          layout: 'comparison',
          title: isSpanish ? 'Antes vs Después de Aplicar' : 'Antes vs Depois da Aplicação',
          comparisonBefore: isSpanish ? '❌ Sin estrategia: Errores frecuentes y bajo rendimiento.' : '❌ Sem estratégia: Erros frequentes e baixo engajamento.',
          comparisonAfter: isSpanish ? '✅ Con método: Claridad total, crecimiento y alta conversión.' : '✅ Com método: Clareza total, crescimento e alta conversão.',
          badgeText: isSpanish ? 'COMPARATIVA' : 'ANTES vs DEPOIS',
        });
      } else {
        slides.push({
          id: `gen-slide-${i + 1}-${Date.now()}`,
          layout: 'content',
          title: isSpanish ? `Clave #${stepNum}: Maximizar Impacto` : `Chave #${stepNum}: Maximizando o Impacto`,
          subtitle: isSpanish ? 'Cómo optimizar la ejecución:' : 'Como otimizar o seu fluxo de trabalho:',
          body: isSpanish
            ? 'Aplica estas técnicas directamente en tu rutina para ver resultados visibles en poco tiempo.'
            : 'Aplique estas técnicas diretamente no seu dia a dia para obter resultados visíveis em pouco tempo.',
          badgeText: `DICA 0${stepNum}`,
        });
      }
    }
  }

  const caption = isSpanish
    ? `🚀 ${cleanPrompt}\n\n¡Revisa todas las diapositivas del carrusel para aprender la estrategia completa paso a paso!\n\n📌 Guarda este post y comparte con alguien que necesite esta información.`
    : `🚀 ${cleanPrompt}\n\nConfira todos os slides do carrossel para aprender a estratégia completa passo a passo!\n\n📌 Salve este post para consultar depois e compartilhe com quem precisa saber disso.`;

  const caption2 = isSpanish
    ? `💡 ¿Cómo aplicar ${cleanPrompt} en tu día a día?\n\nAquí tienes un resumen práctico y probado en el mercado...\n\n👇 ¿Qué opina tu equipo al respecto? ¡Comenta abajo!`
    : `💡 Como aplicar ${cleanPrompt} no seu dia a dia?\n\nAqui está um resumo prático e validado no mercado...\n\n👇 Qual a sua opinião sobre esse tema? Deixe seu comentário abaixo!`;

  const hashtags = isSpanish
    ? ['#carruselinstagram', '#marketingdigital', '#estrategia', '#crecimiento', '#contenidodevalor']
    : ['#instagramcarousel', '#marketingdigital', '#estrategia', '#crescimento', '#conteudodevalor'];

  return {
    title: cleanPrompt,
    slides,
    caption,
    caption2,
    hashtags,
  };
}

function getFallbackIdeas(niche?: string) {
  const cleanNiche = niche || 'Geral & Negócios';
  return [
    {
      id: `idea-1-${Date.now()}`,
      title: `5 Erros Fatais em ${cleanNiche} (E como evitar)`,
      hook: 'Você pode estar cometendo esses erros sem perceber...',
      category: 'Erros Comuns',
      description: 'Um carrossel de alerta que atrai muita atenção e engajamento.',
      slidesCount: 5,
      tags: ['Alerta', 'Educativo', 'Alto Salvamento'],
    },
    {
      id: `idea-2-${Date.now()}`,
      title: `O Passo a Passo Definitivo para ${cleanNiche}`,
      hook: 'Guia completo do zero ao avançado em 5 slides.',
      category: 'Tutorial',
      description: 'Estrutura direta de como executar com perfeição.',
      slidesCount: 6,
      tags: ['Tutorial', 'Prático', 'Viral'],
    },
    {
      id: `idea-3-${Date.now()}`,
      title: `Mito vs Verdade sobre ${cleanNiche}`,
      hook: 'A verdade que ninguém te conta sobre este mercado!',
      category: 'Mito vs Verdade',
      description: 'Quebra de objeções e mitos do setor.',
      slidesCount: 5,
      tags: ['Debate', 'Autoridade', 'Engajamento'],
    },
    {
      id: `idea-4-${Date.now()}`,
      title: `Ferramentas Indispensáveis para ${cleanNiche}`,
      hook: 'As 4 ferramentas secretas que os especialistas usam.',
      category: 'Lista / Top 5',
      description: 'Recomendação valiosa de recursos úteis.',
      slidesCount: 5,
      tags: ['Ferramentas', 'Produtividade', 'Salvamentos'],
    },
  ];
}

function getFallbackCaptions(topic?: string) {
  const t = topic || 'sua publicação';
  return {
    options: [
      {
        style: 'Direta e Persuasiva',
        captionText: `🚀 Como dominar ${t}:\n\n1. Tenha clareza no seu objetivo principal.\n2. Mantenha consistência no processo.\n3. Meça seus resultados semanalmente.\n\n📌 Salve para não esquecer e compartilhe!`,
      },
      {
        style: 'Storytelling & Engajamento',
        captionText: `💡 Você já tentou aplicar ${t} e sentiu que algo faltava?\n\nA chave principal está na simplificação do processo...\n\n👇 Qual o seu maior desafio hoje nesse assunto? Conta pra gente nos comentários!`,
      },
      {
        style: 'Educacional & Lista',
        captionText: `📚 Guia rápido sobre ${t}:\n\n- Dica 01: Foque no fundamento principal.\n- Dica 02: Evite atalhos sem estratégia.\n- Dica 03: Teste constantemente com seu público.\n\n💬 Curtiu? Deixe seu feedback!`,
      },
    ],
    hashtags: ['#marketingdigital', '#conteudodevalor', '#estrategiadedados', '#crescimento', '#dicaspraticas'],
  };
}

function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

async function scrapeAndExtractTextFromUrl(urlStr: string): Promise<{
  scrapedSuccess: boolean;
  title?: string;
  author?: string;
  caption?: string;
  fullContent?: string;
  rawText: string;
}> {
  const trimmed = (urlStr || '').trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return { scrapedSuccess: false, rawText: trimmed };
  }

  let scrapedText = '';
  let title = '';
  let author = '';
  let caption = '';

  const isInstagram = /instagram\.com|instagr\.am/i.test(trimmed);

  if (isInstagram) {
    const match = trimmed.match(/\/(p|reel|tv)\/([A-Za-z0-9_-]+)/);
    const postId = match ? match[2] : null;

    if (postId) {
      // 1. Try ddinstagram.com (public mirror with opengraph meta tags)
      try {
        const ddRes = await fetch(`https://ddinstagram.com/p/${postId}`, {
          headers: {
            'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
            'Accept-Language': 'pt-BR,pt;q=0.9,es;q=0.8,en;q=0.7',
          },
        });
        if (ddRes.ok) {
          const html = await ddRes.text();
          const ogDesc = html.match(/<meta\s+(?:property|name)="(?:og:description|twitter:description)"\s+content="([^"]+)"/i) ||
                         html.match(/<meta\s+content="([^"]+)"\s+(?:property|name)="(?:og:description|twitter:description)"/i);
          if (ogDesc && ogDesc[1]) {
            caption = decodeHtmlEntities(ogDesc[1]).trim();
          }
          const ogTitle = html.match(/<meta\s+(?:property|name)="og:title"\s+content="([^"]+)"/i);
          if (ogTitle && ogTitle[1]) {
            author = decodeHtmlEntities(ogTitle[1]).replace(/on Instagram.*/i, '').trim();
          }
        }
      } catch (e: any) {
        console.warn('ddinstagram scraping attempt failed:', e?.message);
      }

      // 2. Try vxinstagram.com if caption is still empty
      if (!caption) {
        try {
          const vxRes = await fetch(`https://vxinstagram.com/p/${postId}`, {
            headers: {
              'User-Agent': 'TelegramBot (like TwitterBot)',
            },
          });
          if (vxRes.ok) {
            const html = await vxRes.text();
            const ogDesc = html.match(/<meta\s+(?:property|name)="(?:og:description|twitter:description)"\s+content="([^"]+)"/i);
            if (ogDesc && ogDesc[1]) {
              caption = decodeHtmlEntities(ogDesc[1]).trim();
            }
          }
        } catch (e: any) {
          console.warn('vxinstagram scraping attempt failed:', e?.message);
        }
      }

      // 3. Try Instagram embed/captioned if caption is still empty
      if (!caption) {
        try {
          const embedUrl = `https://www.instagram.com/p/${postId}/embed/captioned/`;
          const embedRes = await fetch(embedUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
              'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8',
            },
          });
          if (embedRes.ok) {
            const html = await embedRes.text();
            const captionMatch = html.match(/<div class="Caption"[^>]*>([\s\S]*?)<\/div>/i) ||
                                 html.match(/"caption":\s*"([^"]+)"/i);
            if (captionMatch && captionMatch[1]) {
              caption = decodeHtmlEntities(
                captionMatch[1]
                  .replace(/\\n/g, '\n')
                  .replace(/\\"/g, '"')
                  .replace(/<[^>]+>/g, ' ')
                  .trim()
              );
            }
            const authorMatch = html.match(/<a class="CaptionUsername"[^>]*>([\s\S]*?)<\/a>/i) ||
                                html.match(/"username":\s*"([^"]+)"/i);
            if (authorMatch && authorMatch[1] && !author) {
              author = authorMatch[1].replace(/<[^>]+>/g, '').trim();
            }
          }
        } catch (e: any) {
          console.warn('Instagram embed scraping failed:', e?.message);
        }
      }
    }

    // 4. Try Instagram oEmbed safely checking JSON content-type
    if (!caption) {
      try {
        const oembedUrl = `https://api.instagram.com/oembed/?url=${encodeURIComponent(trimmed)}`;
        const oembedRes = await fetch(oembedUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        });
        if (oembedRes.ok && oembedRes.headers.get('content-type')?.includes('application/json')) {
          const oembedData = await oembedRes.json();
          if (oembedData.title) {
            caption = decodeHtmlEntities(oembedData.title);
          }
          if (oembedData.author_name) {
            author = oembedData.author_name;
          }
        }
      } catch (e: any) {
        console.warn('Instagram oEmbed check failed safely:', e?.message);
      }
    }

    if (caption) {
      scrapedText = `[CONTEÚDO EXTRAÍDO DO POST DO INSTAGRAM]
${author ? `Autor: @${author}\n` : ''}Legenda Completa da Publicação:
${caption}`;
      return {
        scrapedSuccess: true,
        author,
        caption,
        rawText: scrapedText,
      };
    }
  }

  // General Web Page Scraping
  try {
    const pageRes = await fetch(trimmed, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      redirect: 'follow',
    });

    if (pageRes.ok) {
      const html = await pageRes.text();

      // Extract Title
      const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      if (titleMatch) title = decodeHtmlEntities(titleMatch[1].replace(/<[^>]+>/g, '').trim());

      // Extract OG / Meta Description
      const metaDescMatch = html.match(/<meta\s+(?:name|property)="(?:description|og:description)"\s+content="([^"]+)"/i) ||
                            html.match(/<meta\s+content="([^"]+)"\s+(?:name|property)="(?:description|og:description)"/i);
      if (metaDescMatch) caption = decodeHtmlEntities(metaDescMatch[1].trim());

      // Strip scripts, styles, header, footer, nav
      const cleanHtml = html
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<nav[\s\S]*?<\/nav>/gi, '')
        .replace(/<footer[\s\S]*?<\/footer>/gi, '')
        .replace(/<header[\s\S]*?<\/header>/gi, '');

      // Extract headings & paragraphs
      const textBlocks: string[] = [];
      const blockRegex = /<(h1|h2|h3|h4|p|li)[^>]*>([\s\S]*?)<\/\1>/gi;
      let m;
      while ((m = blockRegex.exec(cleanHtml)) !== null) {
        const text = decodeHtmlEntities(m[2].replace(/<[^>]+>/g, '').trim());
        if (text.length > 15 && !textBlocks.includes(text)) {
          textBlocks.push(text);
        }
      }

      const bodyContent = textBlocks.slice(0, 30).join('\n\n');

      scrapedText = `[CONTEÚDO EXTRAÍDO DA PÁGINA WEB]
URL: ${trimmed}
TÍTULO DA PÁGINA: ${title || 'Não especificado'}
DESCRIÇÃO/RESUMO: ${caption || 'Não especificada'}

CONTEÚDO PRINCIPAL DO ARTIGO/SITE:
${bodyContent || title || caption}`;

      if (bodyContent || title || caption) {
        return {
          scrapedSuccess: true,
          title,
          caption,
          fullContent: bodyContent,
          rawText: scrapedText,
        };
      }
    }
  } catch (err: any) {
    console.warn(`Scraping URL ${trimmed} failed:`, err?.message);
  }

  return { scrapedSuccess: false, rawText: trimmed };
}

function translatePtToEsLatAm(text: string): string {
  if (!text) return '';
  let str = text;

  const replacements: [RegExp, string][] = [
    [/\bcomo criar\b/gi, 'cómo crear'],
    [/\bpasso a passo\b/gi, 'paso a paso'],
    [/\bdicas para\b/gi, 'consejos para'],
    [/\bdica\b/gi, 'consejo'],
    [/\bdicas\b/gi, 'consejos'],
    [/\bveja como\b/gi, 'mira cómo'],
    [/\bsalve este post\b/gi, 'guarda este post'],
    [/\bsalve para ver depois\b/gi, 'guarda para ver después'],
    [/\bcompartilhe com\b/gi, 'comparte con'],
    [/\bcompartilhe\b/gi, 'comparte'],
    [/\bcurta e comente\b/gi, 'dale me gusta y comenta'],
    [/\bcurta\b/gi, 'dale me gusta'],
    [/\bcomente\b/gi, 'comenta'],
    [/\bsiga o perfil\b/gi, 'sigue el perfil'],
    [/\bsiga a página\b/gi, 'sigue la página'],
    [/\bvocê precisa\b/gi, 'necesitas'],
    [/\bvocê sabia\b/gi, '¿sabías que'],
    [/\bvocê pode\b/gi, 'puedes'],
    [/\bvocê quer\b/gi, '¿quieres'],
    [/\bvocê\b/gi, 'tú'],
    [/\bseu negócio\b/gi, 'tu negocio'],
    [/\bseus negócios\b/gi, 'tus negocios'],
    [/\bseu perfil\b/gi, 'tu perfil'],
    [/\bseu público\b/gi, 'tu audiencia'],
    [/\bseus resultados\b/gi, 'tus resultados'],
    [/\bseu\b/gi, 'tu'],
    [/\bsua\b/gi, 'tu'],
    [/\bseus\b/gi, 'tus'],
    [/\bsuas\b/gi, 'tus'],
    [/\bnosso\b/gi, 'nuestro'],
    [/\bnossa\b/gi, 'nuestra'],
    [/\bnossos\b/gi, 'nuestros'],
    [/\bnossas\b/gi, 'nuestras'],
    [/\bconteúdo de valor\b/gi, 'contenido de valor'],
    [/\bconteúdo\b/gi, 'contenido'],
    [/\bconteúdos\b/gi, 'contenidos'],
    [/\bestratégia\b/gi, 'estrategia'],
    [/\bestratégias\b/gi, 'estrategias'],
    [/\bcomunicação\b/gi, 'comunicación'],
    [/\bprodução\b/gi, 'producción'],
    [/\bpublicação\b/gi, 'publicación'],
    [/\bpublicações\b/gi, 'publicaciones'],
    [/\bengajamento\b/gi, 'interacción y engagement'],
    [/\balcance\b/gi, 'alcance'],
    [/\bseguidores\b/gi, 'seguidores'],
    [/\bvendas\b/gi, 'ventas'],
    [/\bvenda\b/gi, 'venta'],
    [/\bcrescimento\b/gi, 'crecimiento'],
    [/\batenção\b/gi, 'atención'],
    [/\binformação\b/gi, 'información'],
    [/\berros comuns\b/gi, 'errores comunes'],
    [/\berro\b/gi, 'error'],
    [/\berros\b/gi, 'errores'],
    [/\bsucesso\b/gi, 'éxito'],
    [/\bprincipais\b/gi, 'principales'],
    [/\bprincipal\b/gi, 'principal'],
    [/\bferramentas\b/gi, 'herramientas'],
    [/\bferramenta\b/gi, 'herramienta'],
    [/\bmelhores\b/gi, 'mejores'],
    [/\bmelhor\b/gi, 'mejor'],
    [/\bmaior\b/gi, 'mayor'],
    [/\bmaiores\b/gi, 'mayores'],
    [/\bhoje\b/gi, 'hoy'],
    [/\bagora\b/gi, 'ahora'],
    [/\bsempre\b/gi, 'siempre'],
    [/\bnunca\b/gi, 'nunca'],
    [/\btambém\b/gi, 'también'],
    [/\bmuito\b/gi, 'mucho'],
    [/\bmuitos\b/gi, 'muchos'],
    [/\bmuitas\b/gi, 'muchas'],
    [/\bmais\b/gi, 'más'],
    [/\bmenos\b/gi, 'menos'],
    [/\bnão\b/gi, 'no'],
    [/\bsim\b/gi, 'sí'],
    [/\bpara\b/gi, 'para'],
    [/\bcom\b/gi, 'con'],
    [/\bsem\b/gi, 'sin'],
    [/\bsobre\b/gi, 'sobre'],
    [/\bquando\b/gi, 'cuando'],
    [/\bonde\b/gi, 'dónde'],
    [/\bpor que\b/gi, 'por qué'],
    [/\bporque\b/gi, 'porque'],
    [/\bentão\b/gi, 'entonces'],
    [/\bmas\b/gi, 'pero'],
    [/\bou\b/gi, 'o'],
    [/\bque\b/gi, 'que'],
    [/\bisso\b/gi, 'esto'],
    [/\bisto\b/gi, 'esto'],
    [/\baquilo\b/gi, 'aquello'],
    [/\baudiência\b/gi, 'audiencia'],
    [/\bolha\b/gi, 'mira'],
    [/\bolhe\b/gi, 'mira'],
    [/\bentenda\b/gi, 'entiende'],
    [/\baprenda\b/gi, 'aprende'],
    [/\bconfira\b/gi, 'mira'],
    [/\bdescubra\b/gi, 'descubre'],
    [/\bveja\b/gi, 'mira'],
    [/\bsaiba\b/gi, 'conoce'],
    [/\bfaça\b/gi, 'haz'],
    [/\btenha\b/gi, 'ten'],
    [/\bseja\b/gi, 'sé'],
    [/\buse\b/gi, 'usa'],
    [/\butilize\b/gi, 'utiliza'],
  ];

  for (const [regex, replacement] of replacements) {
    str = str.replace(regex, replacement);
  }

  return str;
}

function getFallbackExtractTranslate(input: string) {
  const cleanRaw = (input || '').trim();
  const isUrl = /^https?:\/\//i.test(cleanRaw);
  let cleanText = cleanRaw;

  if (isUrl) {
    try {
      const urlObj = new URL(cleanRaw);
      const parts = urlObj.pathname.split('/').filter(Boolean);
      if (parts.length > 0) {
        cleanText = parts[parts.length - 1].replace(/[-_]/g, ' ');
      }
    } catch (e) {
      cleanText = cleanRaw;
    }
  }

  // Split into paragraphs / sections
  const sections = cleanText
    .split(/\n\s*\n|\n(?=[0-9]+\.|\u2022|\-|\*|Slide|SLIDE)/gi)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  const translatedSections = sections.map(s => translatePtToEsLatAm(s));

  if (translatedSections.length === 0) {
    translatedSections.push('Estrategia de Contenido Digital en Español LATAM');
  }

  const slides: any[] = [];

  // Slide 1: Cover
  const coverText = translatedSections[0];
  const coverLines = coverText.split('\n').filter(Boolean);
  const coverTitle = coverLines[0] || 'Estrategia de Contenido LATAM';
  const coverSubtitle = coverLines.slice(1).join(' ') || 'Traducción y adaptación al español latinoamericano nativo.';

  slides.push({
    id: `ext-1-${Date.now()}`,
    layout: 'cover',
    title: coverTitle.slice(0, 70),
    subtitle: coverSubtitle.slice(0, 120),
    badgeText: 'ESPAÑOL LATAM 🇲🇽',
  });

  // Middle Content Slides
  const middleSections = translatedSections.length > 1 ? translatedSections.slice(1) : [
    'Aplica estos consejos esenciales para optimizar tus resultados:',
    '• Define tu propuesta de valor única\n• Publica contenido relevante con consistencia\n• Interactúa activamente con tu audiencia',
  ];

  middleSections.forEach((sec, idx) => {
    const lines = sec.split('\n').map(l => l.trim()).filter(Boolean);
    const rawTitle = lines[0] || `Clave ${idx + 1}`;
    const bodyLines = lines.slice(1);

    const bullets = bodyLines
      .filter(l => l.startsWith('•') || l.startsWith('-') || l.startsWith('*') || /^[0-9]+\./.test(l))
      .map(l => l.replace(/^[\u2022\-\*\s0-9\.]+\s*/, ''));

    const normalBody = bodyLines
      .filter(l => !l.startsWith('•') && !l.startsWith('-') && !l.startsWith('*') && !/^[0-9]+\./.test(l))
      .join(' ');

    const layout = bullets.length >= 2 ? 'checklist' : 'content';

    slides.push({
      id: `ext-${idx + 2}-${Date.now()}`,
      layout,
      title: rawTitle.replace(/^[\u2022\-\*\s0-9\.]+\s*/, '').slice(0, 65),
      subtitle: normalBody ? normalBody.slice(0, 100) : 'Información extraída y traducida:',
      body: normalBody || (bullets.length === 0 ? 'Implementa esta estrategia en tu plan diario de redes.' : undefined),
      bullets: bullets.length > 0 ? bullets : undefined,
      badgeText: `PASO 0${idx + 1}`,
    });
  });

  // Slide Final: CTA
  slides.push({
    id: `ext-cta-${Date.now()}`,
    layout: 'cta',
    title: '¿Te Sirvió este Contenido?',
    subtitle: 'Guarda esta publicación para consultar más tarde y compártela con tu equipo.',
    ctaText: '¡Guarda y Síguenos para más! 📌',
    badgeText: 'ACCIÓN',
  });

  const fullCaptionText = translatedSections.join('\n\n');

  return {
    title: `[ES LATAM] ${coverTitle.slice(0, 40)}`,
    slides,
    caption: `🚀 ${coverTitle}\n\n${fullCaptionText}\n\n📌 ¡Guarda esta información para consultar más tarde y compártela con tu comunidad!`,
    hashtags: ['#espanollatam', '#carruselinstagram', '#estrategiadigital', '#contenidodevalor', '#marketinglatam'],
  };
}

// 1. API Route: Analyze Instagram / Website Brand Profile
app.post('/api/analyze-brand', async (req, res) => {
  const { url, handle } = req.body;
  if (!url && !handle) {
    return res.status(400).json({ error: 'Forneça um link de site ou usuário do Instagram.' });
  }

  let scrapedText = '';
  if (url) {
    const scraped = await scrapeAndExtractTextFromUrl(url);
    scrapedText = scraped.rawText;
  }

  try {
    const ai = getGenAI();
    const promptText = `Análise a marca/perfil com base nas seguintes informações fornecidas e raspadas da web:
Handle Instagram: ${handle || 'Não informado'}
URL / Website: ${url || 'Não informado'}
Texto Extraído / Conteúdo da URL:
${scrapedText || 'Nenhum texto extraído diretamente.'}

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
    console.warn('Gemini API call failed for analyze-brand, using fallback:', error?.message);
    return res.json(getFallbackBrand(url, handle));
  }
});

// 2. API Route: Generate Carousel from Prompt / Theme
app.post('/api/generate-carousel', async (req, res) => {
  const { prompt, niche, brand, slideCount = 5, language = 'pt-BR', useBrandData = false } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Descreva o tema do seu carrossel.' });
  }

  const isSpanish = language === 'es-LA';
  const numSlides = Math.max(1, Math.min(10, Number(slideCount) || 5));

  try {
    const ai = getGenAI();

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
    console.warn('Gemini API call failed for generate-carousel, using fallback generator:', error?.message);
    return res.json(getFallbackCarousel(prompt, numSlides, isSpanish, brand));
  }
});

// 3. API Route: Generate Trending Ideas for Niche
app.post('/api/generate-ideas', async (req, res) => {
  const { niche } = req.body;

  try {
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
    console.warn('Gemini API call failed for generate-ideas, using fallback:', error?.message);
    return res.json({ ideas: getFallbackIdeas(niche) });
  }
});

// 4. API Route: Generate Captions and Hashtags
app.post('/api/generate-captions', async (req, res) => {
  const { topic, keyTakeaway } = req.body;

  try {
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
    console.warn('Gemini API call failed for generate-captions, using fallback:', error?.message);
    return res.json(getFallbackCaptions(topic));
  }
});

// 5. API Route: Generate AI Slide Background Image
app.post('/api/generate-slide-image', async (req, res) => {
  const { prompt, title, niche } = req.body;

  try {
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
    console.warn('Gemini API call failed for generate-slide-image, using fallback:', error?.message);
    const fallbackKeywords = encodeURIComponent(title || prompt || 'abstract aesthetic dark');
    return res.json({ imageUrl: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80` });
  }
});

// 6. API Route: Regenerate Individual Slide Content with AI
app.post('/api/regenerate-slide', async (req, res) => {
  const { currentSlide, topicPrompt, niche, brand, language = 'pt-BR' } = req.body;
  if (!currentSlide) {
    return res.status(400).json({ error: 'Slide atual não fornecido.' });
  }

  const isSpanish = language === 'es-LA';

  try {
    const ai = getGenAI();

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
    console.warn('Gemini API call failed for regenerate-slide, using fallback:', error?.message);
    return res.json({
      ...currentSlide,
      title: isSpanish ? `✨ ${currentSlide.title || 'Título Optimizado'}` : `✨ ${currentSlide.title || 'Título Otimizado'}`,
      subtitle: isSpanish
        ? 'Aprende los métodos probados para potenciar tus resultados en Instagram.'
        : 'Aprenda os métodos validados para potencializar seus resultados no Instagram.',
      body: currentSlide.body
        ? (isSpanish ? `Estrategia mejorada: ${currentSlide.body}` : `Estratégia aprimorada: ${currentSlide.body}`)
        : (isSpanish ? 'Enfoque claro y directo en la entrega de alto valor.' : 'Foco claro e direto na entrega de alto valor.'),
    });
  }
});

// 7. API Route: Extract and Translate Publication to LatAm Spanish
app.post('/api/extract-translate-post', async (req, res) => {
  const { urlOrText } = req.body;
  if (!urlOrText) {
    return res.status(400).json({ error: 'Forneça o link ou os textos da publicação.' });
  }

  // 1. Scrape and extract real content from URL if input is an Instagram / website link
  const scrapedData = await scrapeAndExtractTextFromUrl(urlOrText);
  const contentToProcess = scrapedData.scrapedSuccess ? scrapedData.rawText : urlOrText;

  try {
    const ai = getGenAI();
    const promptText = `Eres un traductor nativo y estratega de contenido para Instagram en América Latina (Español LATAM Neutro / Mexicano / Colombiano).
Analiza y extrae el texto de la siguiente publicación (que incluye el texto real raspado de la página web o publicación de Instagram).
Estructura todos los slides, títulos, subtítulos, bullets, llamada a la acción (CTA), leyenda completa y hashtags para un carrusel 3:4.
TRADUCE Y ADAPTA TODO EL TEXTO AO ESPAÑOL LATINOAMERICANO NATIVO, persuasivo y de alta conversión.

Contenido Real Extraído para Traducir:
${contentToProcess}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
      config: {
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
                  layout: { type: Type.STRING },
                  title: { type: Type.STRING },
                  subtitle: { type: Type.STRING },
                  body: { type: Type.STRING },
                  bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
                  badgeText: { type: Type.STRING },
                  ctaText: { type: Type.STRING },
                },
                required: ['title', 'layout'],
              },
            },
            caption: { type: Type.STRING },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['title', 'slides', 'caption'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const slidesWithIds = (parsed.slides || []).map((s: any, idx: number) => ({
      ...s,
      id: `ext-slide-${idx + 1}-${Date.now()}`,
      layout: ['cover', 'content', 'checklist', 'comparison', 'stats', 'quote', 'cta'].includes(s.layout)
        ? s.layout
        : idx === 0
        ? 'cover'
        : idx === (parsed.slides.length - 1)
        ? 'cta'
        : 'content',
    }));

    return res.json({
      title: parsed.title || 'Carrossel em Espanhol LATAM',
      slides: slidesWithIds,
      caption: parsed.caption || '',
      hashtags: parsed.hashtags || ['#espanollatam', '#carruselinstagram', '#marketingdigital'],
    });
  } catch (error: any) {
    console.warn('Gemini API call failed for extract-translate-post, using fallback:', error?.message);
    return res.json(getFallbackExtractTranslate(contentToProcess));
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
