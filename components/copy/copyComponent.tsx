// @ts-nocheck
'use client';
import React, { useRef } from 'react';
import { TextArea, Button } from '@carbon/react';
import { Launch } from '@carbon/icons-react';

const PromptCopier = ({ prompt }) => {
  const textAreaRef = useRef(null);

  const abrirChatGPT = () => {
    window.open('https://chat.openai.com/', '_blank');
  };
  const copiarAlPortapapeles = () => {
    const textArea = textAreaRef.current;
    textArea.select();
    document.execCommand('copy');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>¿Te gustaría recibir recomendaciones personalizadas?</h1>
      <p>
        Copia el siguiente texto y pégalo en el chat de ChatGPT para recibir
        recomendaciones personalizadas:
      </p>
      <Button
        renderIcon={Launch}
        onClick={abrirChatGPT}
        kind="primary"
        style={{ marginBottom: '1rem', marginTop: '1rem' }}
      >
        Ir a ChatGPT
      </Button>
      <hr />
      <TextArea
        ref={textAreaRef}
        labelText="Texto/Prompt para ChatGPT"
        readOnly
        value={prompt}
        style={{ height: '200px' }} // Ajusta la altura según tus necesidades
      />
      <Button kind="primary" onClick={copiarAlPortapapeles}>
        Copiar
      </Button>
    </div>
  );
};

export default PromptCopier;
