# 📊 FlatMoney - Gestor de Flat Airbnb

O **FlatMoney** é uma ferramenta especializada para proprietários e gestores de imóveis no Airbnb que buscam transparência e profissionalismo na gestão financeira. O aplicativo permite o acompanhamento detalhado de receitas e despesas, oferecendo uma visão clara do lucro líquido real sem complicações.

Com uma interface moderna e intuitiva, o FlatMoney transforma dados brutos em relatórios visuais e insights inteligentes através de Inteligência Artificial. Ideal para quem divide a gestão com sócios ou deseja manter um histórico organizado para tomadas de decisão baseadas em dados.

## 🚀 Instalação

Siga os passos abaixo para rodar o projeto localmente:

1.  **Clone o repositório ou baixe os arquivos.**
2.  No terminal, acesse a pasta do projeto e instale as dependências:
    ```bash
    npm install
    ```
3.  Crie um arquivo `.env` na raiz do projeto e adicione sua chave de API (veja a seção de Variáveis de Ambiente abaixo).
4.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
5.  Abra o navegador no endereço indicado (geralmente `http://localhost:5173`).

## 🏗️ Build para Produção

Para gerar a versão otimizada para o ar (produção):

```bash
npm run build
```
Os arquivos finais serão gerados na pasta `dist/`, prontos para serem servidos por qualquer servidor estático.

## ☁️ Deploy no Vercel

Este projeto está pronto para ser publicado no [Vercel](https://vercel.com/):

1.  Conecte seu repositório do GitHub à conta do Vercel.
2.  O Vercel detectará automaticamente as configurações do **Vite**.
3.  Certifique-se de configurar a Variável de Ambiente `API_KEY` (ou `VITE_GOOGLE_API_KEY`) no painel do projeto na Vercel.
4.  Clique em **Deploy**.

## 🔑 Variáveis de Ambiente

Para habilitar as funcionalidades de Inteligência Artificial (análise mensal), você precisará de uma chave da API do Google Gemini.

*   `VITE_GOOGLE_API_KEY`: Sua chave de API obtida no [Google AI Studio](https://aistudio.google.com/).
*   *Nota:* O app está configurado para ler tanto `API_KEY` quanto `VITE_GOOGLE_API_KEY` para facilitar a integração em diferentes plataformas de deploy.

## ✨ Características Principais

*   📈 **Dashboard Visual:** Gráficos de evolução mensal e distribuição de gastos.
*   💰 **Foco no Lucro Líquido:** Cálculos automáticos de taxa de administração e descontos.
*   📄 **PDF Profissional:** Geração de relatórios detalhados otimizados para impressão e compartilhamento.
*   🤖 **Insights com IA:** Análise automática de desempenho mensal via Google Gemini.
*   📱 **Responsivo:** Funciona perfeitamente em celulares, tablets e desktops.
*   💾 **Privacidade Local:** Seus dados são salvos no seu próprio navegador (LocalStorage).
*   📋 **Exportação:** Opção de download de histórico em formato CSV/Excel.

## 🛠️ Stack Tecnológico

*   **React 19** - UI Reativa e moderna.
*   **TypeScript** - Segurança e robustez no código.
*   **Tailwind CSS** - Estilização rápida e responsiva.
*   **Recharts** - Visualização de dados dinâmica.
*   **Vite** - Build tool ultra-rápida.
*   **Google Gemini API** - Inteligência Artificial para insights financeiros.

## 📄 Licença e Autor

Projeto desenvolvido para simplificar a vida do anfitrião Airbnb. 

**Autor:** Equipe FlatMoney
**Licença:** MIT - Livre para uso e modificação.

---
*Gerencie seu flat como uma empresa, com o FlatMoney.*