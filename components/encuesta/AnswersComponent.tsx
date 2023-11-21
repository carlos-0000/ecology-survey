import React, { useEffect, useState } from 'react';
// @ts-ignore
import { Button, Layer, Slider, Stack, TextArea, Tile } from '@carbon/react';
import { useSoftware } from '@/contexts';
import ResultTable from '@/components/resultTable/resultTable';
// @ts-ignore
import { durationSlow01 } from '@carbon/motion';

const fadeInRightClassNames = 'animate__animated animate__fadeInRight';
const fadeInLeftClassNames = 'animate__animated animate__fadeInLeft';
const fadeOutLeftClassNames = 'animate__animated animate__fadeOutLeft';
const fadeOutRightClassNames = 'animate__animated animate__fadeOutRight';
const animationDuration = Number(durationSlow01.slice(0, -2)); // 700ms like

export const AnswersComponent = () => {
  /*const { answers, updateAnswer, sliderValue, updateSliderValue } =
    useSoftware();*/
  const { answersEcology, updateAnswerEcology } = useSoftware();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(1);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);

  const [sectionClassNames, setSectionClassNames] = useState('');
  const [itemClassNames, setItemClassNames] = useState('');

  const currentSection = answersEcology.sections[currentSectionIndex];
  const currentItem = currentSection?.items[currentItemIndex];

  const changeItemSection = (prev = false) => {
    // Actualiza la respuesta en el contexto
    console.log('currentSection.id', currentSection.id);
    console.log('currentItem.id', currentItem.id);
    console.log('currentValue', currentValue);
    updateAnswerEcology(currentSection.id, currentItem.id, currentValue);

    if (prev) {
      const nextItemIndex = currentItemIndex - 1;
      const hasToChangeSection = nextItemIndex < 0;

      if (hasToChangeSection) {
        const nextSectionIndex = currentSectionIndex - 1;

        setSectionClassNames(fadeInRightClassNames);
        setTimeout(() => {
          setCurrentSectionIndex(nextSectionIndex);
          setSectionClassNames(fadeInLeftClassNames);
        }, animationDuration);

        setItemClassNames(fadeOutRightClassNames);
        setTimeout(() => {
          setCurrentItemIndex(
            answersEcology.sections[nextSectionIndex].items.length - 1,
          );
          setItemClassNames(fadeInLeftClassNames);
        }, animationDuration);
      } else {
        setItemClassNames(fadeOutRightClassNames);
        setTimeout(() => {
          setCurrentItemIndex(nextItemIndex);
          setItemClassNames(fadeInLeftClassNames);
        }, animationDuration);
      }
    } else {
      const hasToChangeSection =
        currentItemIndex + 1 >= currentSection.items.length;
      const nextItemIndex = currentItemIndex + 1;
      if (hasToChangeSection) {
        setSectionClassNames(fadeOutLeftClassNames);
        setTimeout(() => {
          setCurrentSectionIndex(currentSectionIndex + 1);
          setSectionClassNames(fadeInRightClassNames);
        }, animationDuration);
        setItemClassNames(fadeOutLeftClassNames);
        setTimeout(() => {
          setCurrentItemIndex(0);
          setItemClassNames(fadeInRightClassNames);
        }, animationDuration);
      } else {
        setItemClassNames(fadeOutLeftClassNames);
        setTimeout(() => {
          setCurrentItemIndex(nextItemIndex);
          setItemClassNames(fadeInRightClassNames);
        }, animationDuration);
      }
    }

    // Limpia los valores actuales para la siguiente pregunta
    setCurrentValue(0);
  };

  if (!currentItem) {
    return <ResultTable />;
  }

  return (
    <div
      style={{
        height: '100%',
        display: 'grid',
        gridTemplateRows: '1fr auto',
        gap: '1rem',
      }}
    >
      <div style={{ overflow: 'hidden' }}>
        <Tile style={{ padding: 0 }} className={sectionClassNames}>
          <Layer>
            <div style={{ padding: '1rem' }}>
              <Stack gap={3}>
                <small>
                  Sección {currentSection.id} de{' '}
                  {answersEcology.sections.length}
                </small>
                <h2 style={{ textTransform: 'capitalize' }}>
                  {currentSection.title.toLowerCase()}
                </h2>
                <p>{currentSection.description}</p>
              </Stack>
            </div>
            <Tile className={itemClassNames}>
              <Layer>
                <Stack gap={3}>
                  <small>
                    Pregunta {currentItem.id} de {currentSection.items.length}
                  </small>
                  <h3>{currentItem.title_item}</h3>
                  <p>{currentItem.description_item}</p>
                  <img
                    src="/img/ecologia/img-front-page.png"
                    style={{ width: '100%' }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      paddingBlock: '.75rem',
                      gap: '.5rem',
                      alignItems: 'center',
                    }}
                  >
                    {answersEcology.sections[currentSectionIndex].items[
                      currentItemIndex
                    ].options.map((option, index) => {
                      return (
                        <Button
                          key={index}
                          kind={'tertiary'}
                          style={{
                            width: '100%',
                            maxInlineSize: 'inherit',
                          }}
                          onClick={() => {
                            setCurrentValue(option.value);
                          }}
                        >
                          {option.label}
                        </Button>
                      );
                    })}
                  </div>
                </Stack>
              </Layer>
            </Tile>
          </Layer>
        </Tile>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '1rem',
          marginInline: '1rem',
          backgroundColor: 'white',
        }}
      >
        {/*<Button
          kind={'secondary'}
          onClick={() => changeItemSection(true)}
          disabled={currentSectionIndex === 0 && currentItemIndex === 0}
        >
          Anterior
        </Button>*/}
        <Button
          onClick={() => changeItemSection()}
          disabled={currentValue === 0}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};

export default AnswersComponent;
