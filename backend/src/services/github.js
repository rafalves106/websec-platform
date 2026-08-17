// Integração com GitHub via Octokit — cria repositório do módulo (se não existir)
// e sobe o desafio resolvido como commit, pra virar peça de portfólio.

const { Octokit } = require('octokit');

function getClient(userToken) {
  return new Octokit({ auth: userToken || process.env.GITHUB_TOKEN });
}

/**
 * Garante que existe um repositório para o módulo. Cria se não existir.
 */
async function ensureModuleRepo({ userToken, owner, moduleTitle, courseSlug }) {
  const octokit = getClient(userToken);
  const repoName = `${courseSlug}-${slugify(moduleTitle)}`;

  try {
    const { data } = await octokit.rest.repos.get({ owner, repo: repoName });
    return data;
  } catch (err) {
    if (err.status !== 404) throw err;
    const { data } = await octokit.rest.repos.createForAuthenticatedUser({
      name: repoName,
      description: `Estudos e desafios resolvidos: ${moduleTitle} — parte da trilha de Web Security`,
      auto_init: true,
      private: false,
    });
    return data;
  }
}

/**
 * Sobe (ou atualiza) um arquivo no repositório do módulo com a solução do desafio.
 */
async function commitChallengeSolution({ userToken, owner, repoName, filePath, content, message }) {
  const octokit = getClient(userToken);

  let sha;
  try {
    const { data } = await octokit.rest.repos.getContent({ owner, repo: repoName, path: filePath });
    sha = data.sha;
  } catch (err) {
    if (err.status !== 404) throw err;
  }

  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo: repoName,
    path: filePath,
    message: message || `Desafio resolvido: ${filePath}`,
    content: Buffer.from(content).toString('base64'),
    sha,
  });
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

module.exports = { ensureModuleRepo, commitChallengeSolution };
