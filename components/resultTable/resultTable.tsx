// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react';
import { MeterChart } from '@carbon/charts-react';
import '@carbon/charts-react/styles.css';

import { AccordionTile } from '@/components';

const ResultTable = () => {
  const stackedBarData = [
    {
      group: 'Dataset 1',
      value: 56,
    },
    {
      group: 'Dataset 1',
      value: 56,
    },
  ];

  const stackedBarOptions = {
    title: 'Meter Chart - with statuses',
    meter: {
      peak: 80,
      status: {
        ranges: [
          {
            range: [0, 50],
            status: 'success',
          },
          {
            range: [50, 60],
            status: 'warning',
          },
          {
            range: [60, 100],
            status: 'danger',
          },
        ],
      },
    },
    height: '100px',
  };

  return (
    <>
      <AccordionTile title={'Configurar parámetros'} isOpenProp={true}>
        <MeterChart data={stackedBarData} options={stackedBarOptions} />
      </AccordionTile>
    </>
  );
};

export default ResultTable;
