// Integração com a Groq (api.groq.com) pra gerar o conteúdo de cada sessão diária.
// Apesar do nome das envs (GROK_*), é Groq — inferência rápida, formato compatível com OpenAI.

const GROK_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Gera o conteúdo de uma sessão diária: explicação, exemplo de código,
 * desafio prático e critério de sucesso — tudo formatado em JSON.
 *
 * @param {Object} params
 * @param {string} params.moduleTitle - ex: 'Injeção SQL'
 * @param {string} params.topic - ex: 'SQL Injection em login forms'
 * @param {string} params.analogy - ex: 'moto' | 'jdm' | 'violao'
 * @param {string} params.userLevel - ex: 'iniciante'
 */
async function generateDailySession({ moduleTitle, topic, analogy, userLevel }) {
  const systemPrompt = `Você é um instrutor de segurança de aplicações web e mobile.
Explique o conceito de forma curta e direta (máximo 3 parágrafos), usando uma analogia
com "${analogy}" para fixar o conceito. Depois dê um exemplo de código real (vulnerável
e a versão corrigida), e proponha um desafio prático que o aluno resolve em até 30 minutos.
Nível do aluno: ${userLevel}.

Responda APENAS em JSON, sem markdown, no formato:
{
  "title": "string",
  "explanation": "string com a analogia",
  "vulnerable_code": "string",
  "fixed_code": "string",
  "challenge": "string descrevendo o desafio prático",
  "success_criteria": "string descrevendo como saber que terminou"
}`;

  const response = await fetch(GROK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROK_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.GROK_MODEL || 'openai/gpt-oss-20b',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Módulo: ${moduleTitle}. Tópico de hoje: ${topic}.` },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`Erro na API do Grok: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  const raw = data.choices[0].message.content;

  try {
    return JSON.parse(raw);
  } catch {
    // fallback caso o modelo não retorne JSON limpo
    return { title: topic, explanation: raw, vulnerable_code: '', fixed_code: '', challenge: '', success_criteria: '' };
  }
}

module.exports = { generateDailySession };
