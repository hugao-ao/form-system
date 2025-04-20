import React from 'react';

export default function Home() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Sistema de Formulários Personalizados</h1>
      <p>Bem-vindo ao sistema de formulários personalizados.</p>
      <p>Este sistema permite:</p>
      <ul>
        <li>Gerar links únicos de formulários para pessoas diferentes</li>
        <li>Consultar formulários preenchidos</li>
        <li>Adicionar observações aos formulários</li>
        <li>Gerar PDF dos formulários</li>
        <li>Enviar formulários por email</li>
      </ul>
      <p>Para acessar o sistema, entre em contato com o administrador.</p>
    </div>
  );
}
