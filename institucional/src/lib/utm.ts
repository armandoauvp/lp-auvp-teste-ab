/**
 * Marca um link de saída com a origem desta página.
 *
 * Todo produto e serviço da AUVP que a página institucional linka recebe
 * `utm_source=lp-auvp-escola`, para que um lead ou uma conversão gerada a
 * partir daqui seja atribuída à LP da escola. Vale para os produtos das
 * iniciativas, a AUVP Experience e o site dos ETFs.
 *
 * Endereços de terceiros (a notícia do prêmio, o CEIA, a embaixada) não
 * recebem o parâmetro: não há conversão nossa do outro lado.
 *
 * O parâmetro entra antes da âncora, que é onde a URL o espera:
 * `https://site/?utm_source=lp-auvp-escola#fundo`. Se o endereço já tiver
 * query, o parâmetro é somado a ela; se já tiver `utm_source`, fica como está.
 */
export const UTM_SOURCE = "lp-auvp-escola";

export function comUtm(href: string): string {
  const url = new URL(href);
  if (!url.searchParams.has("utm_source")) {
    url.searchParams.set("utm_source", UTM_SOURCE);
  }
  return url.toString();
}
