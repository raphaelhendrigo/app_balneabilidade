<template>
  <q-page class="flex flex-center">
    <div class="text-h5 text-primary q-ma-sm">Sobre o Aplicativo</div>
    <div style="width: 100%; padding-bottom: 135%;">
      <q-list>
        <q-expansion-item
          :group="$q.screen.width > 1000 ? 'a' : 'sobre_app'"
          label="O que é Balneabilidade ?"
          class="bg-secondary text-justify"
          :default-opened="$q.screen.width > 1000"
          :style="
            $q.screen.width > 1000 ? 'font-size: 18px;' : 'font-size: 16px;'
          "
        >
          <q-card>
            <q-card-section>
              <div class="text-justify">
                <ul>
                  <li>
                    Balneabilidade é a qualidade das águas destinadas à
                    recreação de contato primário, sendo este entendido como um
                    contato direto e prolongado com a água (natação, mergulho,
                    esqui-aquático, etc), onde a possibilidade de ingerir
                    quantidades apreciáveis de água é elevada.
                  </li>
                  <li>
                    Para sua avaliação é necessário o estabelecimento de
                    critérios objetivos. Estes critérios devem se basear em
                    indicadores a serem monitorados e seus valores confrontados
                    com padrões pré estabelecidos, para que se possa identificar
                    se as condições de balneabilidade em um determinado local
                    são favoráveis ou não; pode-se definir, inclusive, classes
                    de balneabilidade para melhor orientação dos usuários.
                  </li>
                  <li>
                    Fatores que influem na balneabilidade: O parâmetro indicador
                    básico para a classificação das praias quanto a sua
                    balneabilidade em termos sanitários é a densidade de
                    coliformes fecais. Diversos são os fatores que condicionam a
                    presença de esgotos nas praias: * Existência de sistemas de
                    coleta e disposição dos despejos domésticos gerados nas
                    proximidades * Existência de córregos afluindo ao mar *
                    Afluência turísica durante os períodos de temporada *
                    Fisiografia da praia * Ocorrência de chuvas * Condições de
                    maré
                  </li>
                  <li>
                    Aspectos de saúde pública Corpos d’água contaminados por
                    esgoto doméstico ao atingirem as águas das praias podem
                    expor os banhistas a bactérias, vírus e protozoários.
                    Crianças e idosos, ou pessoas com baixa resistência, são as
                    mais suscetíveis a desenvolver doenças ou infecções após
                    terem nadado em águas contaminadas.
                  </li>
                  <li>
                    As doenças relacionadas ao banho, em geral, não são graves.
                    A doença mais comum associada à água poluída por esgoto é a
                    gastroenterite. Ela ocorre numa grande variedade de formas e
                    pode apresentar um ou mais dos seguintes sintomas: enjôo,
                    vômitos, dores de estômago, diarréia, dor de cabeça e febre.
                    Outras doenças menos graves incluem infecções de olhos,
                    ouvidos, nariz e garganta. Em locais muito contaminados os
                    banhistas podem estar expostos a doenças mais graves, como
                    disenteria, hepatite A, cólera e febre tifóide.
                  </li>
                  <li>
                    Cuidados que devem ser tomados Considerando-se as diversas
                    variáveis intervenientes na balneabilidade das praias e sua
                    relação com a possibilidade de riscos à saúde dos
                    freqüentadores, é recomendável: * Não tomar banho nas águas
                    das praias que forem classificadas como Impróprias * Evitar
                    o contato com os cursos d’água que afluem às praias * Evitar
                    o uso das praias que recebem corpos d’água cuja qualidade é
                    desconhecida; após a ocorrência de chuvas de maior
                    intensidade * Evitar a ingestão de água do mar, com
                    redobrada atenção para com as crianças e idosos, que são
                    mais sensíveis e menos imunes do que os adultos * Não levar
                    animais à praia
                  </li>
                </ul>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "Sobre_Balneabilidade",

  data() {
    return {
      slide: 1
    };
  }
};
</script>
