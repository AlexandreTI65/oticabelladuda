# Ótica BellaDuda — site React

Site demonstrativo feito com React + Vite, com catálogo, consultor de estilo, formulário de solicitação de exame, Instagram, WhatsApp, mapa e painel administrativo local.

## Requisitos
- Node.js LTS instalado
- VS Code

## Executar no VS Code
1. Extraia a pasta `otica-belladuda`.
2. Abra essa pasta no VS Code.
3. Abra **Terminal > Novo Terminal**.
4. Execute:

```bash
npm install
npm run dev
```

5. Abra no navegador o endereço local mostrado pelo Vite (normalmente `http://localhost:5173`).

Para verificar a versão de produção:

```bash
npm run build
npm run preview
```

## Dados configurados
- WhatsApp: +55 11 96342-1659
- Instagram: @oticabelladuda
- Endereço: Rua Paraguai, 238 — Taboão, Diadema - SP
- Desconto anunciado: 10% na primeira compra, sujeito às regras comerciais da ótica.

## Importante antes de publicar
Este projeto é um **protótipo funcional de frontend**, não um sistema pronto para produção:
- Os produtos de `src/products.js` são exemplos demonstrativos. Troque nome, preço, descrição e imagem por dados reais.
- O catálogo e as solicitações do formulário são salvos no `localStorage` do navegador. Não sincronizam entre dispositivos.
- O painel de demonstração abre com a senha `BellaDudaDemo2026!`. **Não publique assim.** A senha está no código e não é autenticação segura.
- Antes de publicar, conecte um backend como Supabase, configure autenticação real, políticas RLS e armazenamento de imagens. As solicitações de exame contêm dados pessoais e precisam de acesso restrito.
- O formulário abre o WhatsApp para a pessoa enviar a solicitação; o horário não é confirmado automaticamente.
- Confirme as condições da campanha de exame gratuito e da promoção antes de divulgar.
- As imagens externas de exemplo podem ser substituídas pelas fotos autorizadas da ótica.

## Onde editar
- Produtos demonstrativos: `src/products.js`
- WhatsApp, Instagram, endereço e mapa: início de `src/App.jsx`
- Estilo visual: `src/styles.css`
