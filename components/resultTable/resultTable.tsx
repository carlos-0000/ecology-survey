import React from 'react';
import { MeterChart } from '@carbon/charts-react';
import '@carbon/charts-react/styles.css';

import { AccordionTile } from '@/components';
import { MeterChartOptions, Statuses } from '@carbon/charts';
// @ts-ignore
import { Layer, Stack, Tile } from '@carbon/react';

const ResultTable = () => {
  const stackedBarData = [
    {
      group: 'Pésimo',
      value: 10,
    },
    // {
    //   group: 'Dataset 1',
    //   value: 56,
    // },
  ];

  const stackedBarOptions: MeterChartOptions = {
    title: 'Meter Chart - with statuses',

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

  return (
    <>
      <AccordionTile title={'Configurar parámetros'} isOpenProp={true}>
        <div /> {/*No entiendos xd*/}
        <Tile>
          <Stack gap={5}>
            <div>
              <MeterChart data={stackedBarData} options={stackedBarOptions} />
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Accusamus, saepe.
              </p>
            </div>
            <Layer>
              <Stack gap={5}>
                <Tile>
                  <MeterChart
                    data={stackedBarData}
                    options={stackedBarOptions}
                  />
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Adipisci atque consequatur distinctio dolorem, doloribus
                  </p>
                </Tile>
                <Tile>
                  <MeterChart
                    data={stackedBarData}
                    options={stackedBarOptions}
                  />
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Adipisci atque consequatur distinctio dolorem, doloribus
                  </p>
                </Tile>
                <Tile>
                  <MeterChart
                    data={stackedBarData}
                    options={stackedBarOptions}
                  />
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Adipisci atque consequatur distinctio dolorem, doloribus
                  </p>
                </Tile>
                <Tile>
                  <MeterChart
                    data={stackedBarData}
                    options={stackedBarOptions}
                  />
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Adipisci atque consequatur distinctio dolorem, doloribus
                  </p>
                </Tile>
              </Stack>
            </Layer>
          </Stack>
        </Tile>
      </AccordionTile>
    </>
  );
};

export default ResultTable;
