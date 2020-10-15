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
                <p>
                  Balneabilidade é a qualidade das águas destinadas à recreação
                  de contato primário, sendo este entendido como um contato
                  direto e prolongado com a água (natação, mergulho,
                  esqui-aquático, etc), onde a possibilidade de ingerir
                  quantidades apreciáveis de água é elevada.
                </p>
                <p>
                  Para sua avaliação é necessário o estabelecimento de critérios
                  objetivos. Estes critérios devem se basear em indicadores a
                  serem monitorados e seus valores confrontados com padrões pré
                  estabelecidos, para que se possa identificar se as condições
                  de balneabilidade em um determinado local são favoráveis ou
                  não; pode-se definir, inclusive, classes de balneabilidade
                  para melhor orientação dos usuários.
                </p>
                <p>
                  Fatores que influem na balneabilidade: O parâmetro indicador
                  básico para a classificação das praias quanto a sua
                  balneabilidade em termos sanitários é a densidade de
                  coliformes fecais. Diversos são os fatores que condicionam a
                  presença de esgotos nas praias: 
                  <ul>
                    <li> 
                      Existência de sistemas de
                      coleta e disposição dos despejos domésticos gerados nas
                      proximidades
                  </li>
                  <li> 
                    Existência de córregos afluindo ao mar 
                  </li>
                  <li>
                    Afluência turísica durante os períodos de temporada
                  </li> 
                  <li>
                    Fisiografia da praia
                  </li>
                  <li>
                    Ocorrência de chuvas
                  </li>
                  <li> 
                    Condições de maré
                  </li>
                  </ul>
                </p>
                <p>
                  Aspectos de saúde pública Corpos d’água contaminados por
                  esgoto doméstico ao atingirem as águas das praias podem expor
                  os banhistas a bactérias, vírus e protozoários. Crianças e
                  idosos, ou pessoas com baixa resistência, são as mais
                  suscetíveis a desenvolver doenças ou infecções após terem
                  nadado em águas contaminadas.
                </p>
                <p>
                  As doenças relacionadas ao banho, em geral, não são graves. A
                  doença mais comum associada à água poluída por esgoto é a
                  gastroenterite. Ela ocorre numa grande variedade de formas e
                  pode apresentar um ou mais dos seguintes sintomas: enjôo,
                  vômitos, dores de estômago, diarréia, dor de cabeça e febre.
                  Outras doenças menos graves incluem infecções de olhos,
                  ouvidos, nariz e garganta. Em locais muito contaminados os
                  banhistas podem estar expostos a doenças mais graves, como
                  disenteria, hepatite A, cólera e febre tifóide.
                </p>
                <p>
                  Cuidados que devem ser tomados Considerando-se as diversas
                  variáveis intervenientes na balneabilidade das praias e sua
                  relação com a possibilidade de riscos à saúde dos
                  freqüentadores, é recomendável: 
                  <ul>
                    <li>
                      Não tomar banho nas águas das praias que forem classificadas 
                      como Impróprias 
                    </li> 
                    <li>
                      Evitar o contato com os cursos d’água que afluem às praias 
                    </li>
                    <li>
                      Evitar o uso das praias que recebem corpos d’água cuja qualidade é
                      desconhecida; após a ocorrência de chuvas de maior intensidade
                    </li>
                    <li>
                      Evitar a ingestão de água do mar, com redobrada atenção para
                      com as crianças e idosos, que são mais sensíveis e menos
                      imunes do que os adultos. 
                    </li>
                    <li>
                      Não levar animais à praia
                    </li>
                    </ul>
                </p>
                <p>
                  Segundo a Companhia Ambiental do Estado de São Paulo (CETESB),
                  para uma praia ser considerada imprópria com base no nível de
                  unidades formadoras de colônia (UFC) de enterococcos, os
                  índices devem ser: superiores a 100 UFC/100ml em pelo menos 2
                  medições dentro de um período de 5 semanas; superiores a 400
                  UFC/100ml na última amostragem realizada.
                </p>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>

       <q-list>
        <q-expansion-item
          :group="$q.screen.width > 1000 ? 'a' : 'sobre_app'"
          label="Processo de Criação"
          class="bg-secondary text-justify"
          :default-opened="$q.screen.width > 1000"
          :style="
            $q.screen.width > 1000 ? 'font-size: 18px;' : 'font-size: 16px;'
          "
        >
          <q-card>
            <q-card-section>
              <div class="text-justify">
                <p>
                  O aplicativo foi elaborado utilizando as seguintes ferramentas e bibliotecas: 
                  Python, Quasar, Vue, Cordova e Anaconda e Flask.

                </p>
                <p>
                  A primeira etapa do projeto foi a captura dos dados presentes no dataset 
                  (inserir o link https://www.kaggle.com/amandalk/sp-beaches-water-quality/activity) 
                  disponibilizado pela usuária Amanda na plataforma Kaggle.

                </p>
                <p>
                  A segunda etapa do projeto foi o treinamento da rede neural em Python 
                  utilizando o modelo Seasonal Autoregressive Integrated Moving Average.

                </p>
                <p>
                  Após esta etapa foi realizada a criação de um webservice REST simples 
                  elaborado com a biblioteca Flask para disponibilizar as funcionalidades 
                  do modelo de predição. O código do webservice pode ser acessado através 
                  do link https://github.com/tymonsx/rest_balneabilidade

                </p>
                <p>
                  Este projeto foi realizado pela equipe de desenvolvimento do Departamento 
                  de Informática em Saúde - EPM - UNIFESP
                  <ul>
                    <li>
                        Antonio Carlos da Silva Junior: Analista de Tecnologia da Informação no Departamento de Informática em Saúde da UNIFESP.
                    </li>
                    <li>
                        Raphael Hendrigo de Souza Gonçalves: Analista de Tecnologia da Informação no Departamento de Informática em Saúde da UNIFESP.
                    </li>
                    <li>
                        Ivan Calixto Ribeiro: Técnico de Tecnologia da Informação no Departamento de Informática em Saúde da UNIFESP.  
                    </li>
                  </ul>

                </p>
                
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>

      <q-list>
        <q-expansion-item
          :group="$q.screen.width > 1000 ? 'a' : 'sobre_app'"
          label="Disclaimer"
          class="bg-secondary text-justify"
          :default-opened="$q.screen.width > 1000"
          :style="
            $q.screen.width > 1000 ? 'font-size: 18px;' : 'font-size: 16px;'
          "
        >
          <q-card>
            <q-card-section>
              <div class="text-justify">
                <p>
                  Este aplicativo determina a situação de balneabilidade das praias levando 
                  em conta somente a quantidade de unidades formadoras de colônia de enterococos 
                  por 100 ml de água (UFC/100ml). Podem haver divergências com relação a situação 
                  oficial emitida pela CETESB, que leva em conta diversos outros fatores. 
                  Este aplicativo não tem caráter oficial. A CETESB é o único órgão responsável 
                  por indicar a classificação oficial da balneabilidade das praias dentro do estado de São Paulo.


                </p>
               
                
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
