'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Column,
  Content,
  Grid,
  Header,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderName,
  Row,
  SkipToContent,
} from '@carbon/react';
import {
  Asleep,
  Light,
  Switcher,
  TableBuilt,
  ViewFilled,
} from '@carbon/icons-react'; // Importa el icono que desees utilizar
import { useTheme } from '@/contexts';

interface UIShellProps {
  content: React.ReactNode;
}

export const UIShell: React.FC<UIShellProps> = ({ content }) => {
  const { push } = useRouter();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'white' || theme === 'g10';
  // Invertir color de la imagen De logo Si el fondo es blanco

  useEffect(() => {
    console.log('theme', theme);
    if (theme) {
      document.documentElement.setAttribute('data-carbon-theme', theme);
    }
  }, [theme]);

  return (
    <>
      <Header aria-label="Calidad de Software">
        <SkipToContent />
        <HeaderName
          href="/"
          prefix=""
          onClick={(
            event: React.SyntheticEvent<HTMLAnchorElement, MouseEvent>,
          ) => {
            event.preventDefault();
            push('/');
          }}
        >
          <img
            src="/img/Escudo_de_la_Universidad_Surcolombiana.svg.png"
            alt="Logo universidad"
            style={{ width: '2.2rem', marginRight: '0.5rem' }}
          />
          Ecología
        </HeaderName>
      </Header>
      <Content
        id="main-content"
        style={{ height: 'calc(100dvh - 3rem)', padding: '0rem' }}
      >
        {content}
      </Content>
    </>
  );
};
