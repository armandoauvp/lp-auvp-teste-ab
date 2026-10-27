/** Dobra de encerramento. */

export const closing = {
  eyebrow: "Próxima turma",
  /**
   * Contagem regressiva da dobra de encerramento.
   *
   * **`target` é um marcador provisório e precisa da data real.** Foi escolhido
   * para a contagem poder ser vista funcionando, não porque a turma abra nesse
   * dia. Formato ISO com fuso explícito: sem o `-03:00` o navegador interpreta
   * a data no fuso de quem acessa, e quem estiver fora do Brasil vê o prazo
   * errado.
   *
   * Precisa ser atualizado a cada turma. Se ficar para trás, ou se virar
   * `null`, a contagem simplesmente não é renderizada: a dobra continua de pé
   * sem ela. Nenhuma página institucional pode mostrar um prazo vencido, e
   * essa é a única proteção contra o esquecimento.
   */
  countdown: {
    /**
     * De onde vêm a data e o número da turma: o mesmo webhook que alimenta o
     * contador da LP da Escola. Ele devolve `proxima_turma` (data sem fuso,
     * lida como horário de Brasília) e `numero_turma`. Com ele no ar, as duas
     * páginas mostram a mesma turma sem ninguém precisar editar este arquivo.
     *
     * `target` e `turma`, abaixo, ficam como reserva para quando o webhook não
     * responder.
     */
    source:
      "https://n8n.prod.asupernova.com.br/webhook/f502121b-8208-431e-8e6b-c138831291fb" as
        string | null,
    target: "2026-10-30T19:00:00-03:00" as string | null,
    /**
     * Como a turma se chama: "126", "de outubro", "2026.2". Entra no meio do
     * rótulo, que fica "Inscrições para a turma 126 encerram em".
     *
     * **Também é um marcador vazio esperando o dado real**, como o `target`
     * logo acima, e os dois andam juntos: turma nova tem número novo e data
     * nova. Com `null`, o rótulo cai no genérico, "Inscrições encerram em",
     * que é o que está no ar hoje. Prazo sem dono é melhor do que prazo com o
     * nome errado.
     */
    turma: "62" as string | null,
  },
  title: "A formação começa por uma conversa honesta sobre o seu momento.",
  ctaLabel: "Faça sua Análise de Perfil",
  photo: {
    /** Arquivado em acervo/fotos/raul-sena-biblioteca.webp */
    src: null as string | null,
    brief: "estúdio com estantes de livros, plano aberto",
  },
} as const;
