# Portal Radar de Maturidade Digital

Portal estático (HTML + CSS + JavaScript, sem build) baseado no wireframe interativo da Etapa 6.
Projeto de extensão – Sistemas de Informação (EAD), PUC Minas, em parceria com a ALL DADOS.

## Estrutura

| Arquivo | O que é |
|---|---|
| `index.html` | Estrutura da página (cabeçalho, rodapé, menu) |
| `css/style.css` | Visual, seguindo o wireframe |
| `js/app.js` | Páginas, filtros, gráficos, dicionário e download do CSV |
| `js/data.js` | Dados: TIC Empresas 2025 (B18, H1, H2, H9, H11) e totais agregados de chamados |
| `js/config.js` | **Ajustes simples**: data de atualização, e-mail, links do Power BI |
| `assets/` | Capturas das 3 abas do relatório do Power BI |

## Páginas (as cinco do wireframe)

Início · Painéis de mercado (Adoção tecnológica, Hipóteses × evidência, Explorador de mercados) ·
Demandas da ALL DADOS (Demandas e projetos de BI, Demandas × mercado) · Metodologia e dados · Sobre o projeto.
O endereço de cada uma é compartilhável (ex.: `.../#/demandas`).


## Dados e privacidade

- Nenhum dado identificável de cliente está no portal: só totais por ano, área e categoria.
- O CSV de demandas fica desabilitado até a ALL DADOS autorizar a divulgação de agregados.
- O CSV de indicadores públicos é gerado no navegador a partir de `js/data.js`.
