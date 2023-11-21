// @ts-nocheck
import React from 'react';
import { MeterChart } from '@carbon/charts-react';
import '@carbon/charts-react/styles.css';
import { Accordion, AccordionItem, Tile, Stack, Layer } from '@carbon/react';
import { useSoftware } from '@/contexts';
import { MeterChartOptions, Statuses } from '@carbon/charts';
import PromptCopier from '@/components/copy/copyComponent';

const ResultTable = () => {
  const { answersEcology, categoryEcology } = useSoftware();

  function calcularPromedioSecciones(answersEcology) {
    return answersEcology.sections.map((section) => {
      const totalValue = section.items.reduce(
        (acc, item) => acc + item.value,
        0,
      );
      const promedio =
        section.items.length > 0
          ? (totalValue / (section.items.length * 4)) * 100
          : 0;
      return {
        idSeccion: section.id,
        tituloSeccion: section.title,
        promedio,
      };
    });
  }

  function calcularPromedioPorCategoria(answersEcology, categoryEcology) {
    return answersEcology.sections.map((section) => {
      const promediosCategorias = categoryEcology.sections
        .find((cSection) => cSection.id === section.id)
        ?.categories.map((category) => {
          const preguntasCategoria = section.items.filter(
            (item) => item.id_category === category.id,
          );
          const totalValue = preguntasCategoria.reduce(
            (acc, item) => acc + item.value,
            0,
          );
          const promedio =
            preguntasCategoria.length > 0
              ? (totalValue / (preguntasCategoria.length * 4)) * 100
              : 0;
          return {
            idCategoria: category.id,
            tituloCategoria: category.title,
            promedio,
          };
        });
      return {
        idSeccion: section.id,
        tituloSeccion: section.title,
        promediosCategorias,
      };
    });
  }

  function agregarRecomendaciones(promediosPorCategoria, categoryEcology) {
    return promediosPorCategoria.map((section) => ({
      ...section,
      promediosCategorias: section.promediosCategorias.map((catPromedio) => {
        const categoria = categoryEcology.sections
          .find((cSection) => cSection.id === section.idSeccion)
          .categories.find(
            (category) => category.id === catPromedio.idCategoria,
          );

        const indiceRecomendacion = Math.min(
          Math.floor(catPromedio.promedio / 25),
          categoria.recommendations.length - 1,
        );
        const recomendacion = categoria.recommendations[indiceRecomendacion];

        //

        return {
          ...catPromedio,
          recomendacion,
        };
      }),
    }));
  }

  function obtenerDatosYRecomendaciones(answersEcology, categoryEcology) {
    // Primero, calcula el promedio total de cada sección
    const promediosSecciones = calcularPromedioSecciones(answersEcology);

    // Luego, calcula el promedio por categoría dentro de cada sección
    const promediosCategorias = calcularPromedioPorCategoria(
      answersEcology,
      categoryEcology,
    );

    // Finalmente, agrega las recomendaciones a cada categoría
    const seccionesConRecomendaciones = agregarRecomendaciones(
      promediosCategorias,
      categoryEcology,
    );

    // Combina los promedios de las secciones con sus respectivas categorías y recomendaciones
    return promediosSecciones.map((seccion) => {
      const categorias =
        seccionesConRecomendaciones.find(
          (s) => s.idSeccion === seccion.idSeccion,
        )?.promediosCategorias || [];
      return {
        ...seccion,
        promediosCategorias: categorias,
      };
    });
  }

  function generarTextoEncuesta(seccionesConDatos, answersEcology) {
    let texto =
      'Hola Chat GPT, acabo de contestar una encuesta y quiero que me ayudes con recomendaciones. Aquí están mis respuestas y los promedios obtenidos:\n\n';

    seccionesConDatos.forEach((seccion) => {
      texto += `En la sección "${seccion.tituloSeccion}", respondí lo siguiente:\n`;
      const respuestasSeccion =
        answersEcology.sections.find((s) => s.id === seccion.idSeccion)
          ?.items || [];

      respuestasSeccion.forEach((item) => {
        const respuestaElegida =
          item.options.find((option) => option.value === item.value)?.label ||
          'No respondida';
        texto += `- Pregunta "${item.title_item}": Respuesta elegida - "${respuestaElegida}".\n`;
      });

      texto += `\nEl promedio total para esta sección fue de ${seccion.promedio.toFixed(
        2,
      )}%. Y los promedios en las categorías fueron:\n`;
      seccion.promediosCategorias.forEach((cat) => {
        texto += `- Categoría "${
          cat.tituloCategoria
        }": Promedio - ${cat.promedio.toFixed(2)}%. Recomendación - "${
          cat.recomendacion
        }".\n`;
      });

      texto += '\n';
    });

    return texto;
  }

  // Suponiendo que tienes una función para obtener los datos y recomendaciones
  const seccionesConDatos = obtenerDatosYRecomendaciones(
    answersEcology,
    categoryEcology,
  );

  const textoPrompt = generarTextoEncuesta(seccionesConDatos, answersEcology);
  console.log(textoPrompt);

  const stackedBarOptions: MeterChartOptions = {
    toolbar: {
      enabled: false,
    },

    meter: {
      peak: 100,
      status: {
        ranges: [
          {
            range: [0, 25],
            status: Statuses.DANGER,
          },
          {
            range: [26, 50],
            status: Statuses.WARNING,
          },
          {
            range: [51, 75],
            status: Statuses.WARNING,
          },
          {
            range: [76, 100],
            status: Statuses.SUCCESS,
          },
        ],
      },
    },
    height: '100px',
  };

  const sectionRecommendations = [
    [
      'Tu puntuación indica que hay un amplio margen de mejora en tus hábitos de salud. Considera este resultado como un punto de partida para adoptar cambios progresivos y positivos en tu hidratación, consumo de frutas y verduras, reducción de alimentos procesados y control del azúcar. Pequeños pasos consistentes pueden llevar a grandes cambios.',
      'Tu puntuación muestra que estás tomando algunas decisiones saludables, pero todavía hay áreas importantes para mejorar. Continúa educándote sobre los beneficios de una dieta balanceada y haz ajustes graduales para mejorar tus hábitos alimenticios y de hidratación. Estás en el camino correcto, ¡sigue así!',
      'Has logrado una buena puntuación, lo que indica que tienes hábitos saludables establecidos. Sin embargo, siempre hay espacio para mejorar y optimizar tus elecciones de vida. Mantén tu enfoque en una dieta equilibrada y en una hidratación adecuada, y considera explorar nuevas formas de enriquecer aún más tu régimen de salud.',
      'Tu alta puntuación refleja un excelente compromiso con un estilo de vida saludable. Eres un ejemplo a seguir en cuanto a la hidratación adecuada, el consumo de frutas y verduras, y la limitación de alimentos procesados y azúcares. Continúa con tus excelentes prácticas y considera compartir tus estrategias y conocimientos para inspirar a otros.',
    ],
    [
      'Tu puntuación indica que hay muchas oportunidades para crecer en términos de sostenibilidad en tus elecciones alimenticias. Considera esta etapa como un punto de inicio para aprender más sobre el impacto ambiental de tus hábitos alimenticios y cómo puedes hacer cambios más sostenibles, como elegir productos locales o reducir el desperdicio de alimentos.',
      'Esta puntuación sugiere que estás tomando algunos pasos hacia un enfoque más sostenible en tu alimentación, pero aún hay espacio para mejorar. Explora más opciones como alimentos orgánicos, reducción de plásticos y apoyo a productores locales. Cada pequeña acción cuenta y contribuye a un futuro más sostenible.',
      'Has obtenido una puntuación sólida, lo que indica una conciencia significativa sobre la sostenibilidad en tus elecciones alimenticias. Mantén tu compromiso con prácticas como el apoyo a la agricultura sostenible y la reducción de residuos. Puedes seguir ampliando tu impacto explorando nuevas formas de contribuir a la sostenibilidad en tu comunidad y más allá.',
      'Tu alta puntuación demuestra un excelente compromiso con un estilo de vida sostenible. Tus elecciones alimenticias reflejan una fuerte consideración por el medio ambiente, desde la reducción del consumo de plástico hasta el apoyo a los productores locales. Continúa siendo un modelo a seguir e inspira a otros compartiendo tus conocimientos y prácticas sostenibles.',
    ],
  ];
  return (
    <div>
      <img
        src={'/img/womenn.png'}
        style={{
          width: '100%',
          objectPosition: 'center',
        }}
      />
      <div style={{ padding: '1rem' }}>
        <h1>Felicidades, has terminado la encuesta</h1>
        <p>
          Aquí puedes ver los resultados de tu encuesta y las recomendaciones
          correspondientes
        </p>
      </div>

      <Accordion>
        {seccionesConDatos.map((seccion, index) => (
          <AccordionItem
            title={seccion.tituloSeccion}
            key={seccion.idSeccion}
            open={true}
            style={{ paddingBottom: '1rem' }}
          >
            <div
              style={{
                padding: '1rem',
              }}
            >
              <h2 style={{ paddingBottom: '1rem', fontWeight: 'bold' }}>
                {seccion.tituloSeccion}
              </h2>
              <p style={{ paddingBottom: '1rem' }}>
                {
                  sectionRecommendations[index][
                    Math.min(
                      Math.floor(seccion.promedio / 26),
                      sectionRecommendations[index].length - 1,
                    )
                  ]
                }
              </p>
              <MeterChart
                data={[{ group: '', value: seccion.promedio }]}
                options={stackedBarOptions}
              />
            </div>
            <Tile>
              <Stack gap={4}>
                {seccion.promediosCategorias.map((catPromedio) => (
                  <Layer key={catPromedio.idCategoria}>
                    <Stack gap={5}>
                      <Tile key={catPromedio.idCategoria}>
                        <MeterChart
                          data={[
                            {
                              group: catPromedio.tituloCategoria,
                              value: catPromedio.promedio,
                            },
                          ]}
                          options={stackedBarOptions}
                        />
                        <p>{catPromedio.recomendacion}</p>
                      </Tile>
                    </Stack>
                  </Layer>
                ))}
              </Stack>
            </Tile>
          </AccordionItem>
        ))}
      </Accordion>
      <PromptCopier prompt={textoPrompt} />
    </div>
  );
};

export default ResultTable;
