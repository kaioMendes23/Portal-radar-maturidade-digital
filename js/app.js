/* Radar de Maturidade Digital — portal estático (sem dependências).
   Estrutura: dados em js/data.js, ajustes em js/config.js. */
(function () {
  'use strict';
  var D = window.PORTAL_DATA, C = window.PORTAL_CONFIG || {};
  var IND = D.IND, DEM = D.DEM, REC = D.REC;
  var PBI = C.powerbi || {};

  /* ---------- utilidades ---------- */
  var nf = new Intl.NumberFormat('pt-BR');
  var num = function (x) { return nf.format(x); };
  var fmt1 = function (x) { return x.toFixed(1).replace('.', ',') + '%'; };
  var pp = function (x) { return (x >= 0 ? '+' : '−') + Math.abs(x).toFixed(1).replace('.', ',') + ' p.p.'; };
  var P = function (i, it, r) { return IND[i].itens[it].q[r] / IND[i].itens[it].b[r] * 100; };
  var opt = function (v, t, sel) { return '<option value="' + v + '"' + (String(sel) === String(v) ? ' selected' : '') + '>' + t + '</option>'; };

  var G = { porte: [1, 3], regiao: [4, 8], mercado: [9, 16] };
  var RECNAMES = { porte: 'Porte', regiao: 'Região', mercado: 'Mercado de atuação' };
  var BASE = {
    H9: 'Total de empresas (soma das respostas “Sim” e “Não”)',
    H1: 'Total de empresas (soma das respostas “Sim”, “Não” e “Não se aplica”)',
    H11: 'Total de empresas (soma das respostas do tipo de fonte)',
    H2: 'Empresas que fazem análise de big data (tabela H1, resposta “Sim”)',
    B18: 'Empresas que usaram a Internet (tabela B1, resposta “Sim”)'
  };
  var YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

  /* ---------- estado dos filtros ---------- */
  var S = { ind: 0, item: 0, rec: 'porte', exInd: 0, exItem: 0, exMerc: 14, ano: 'todos', status: 'todos', area: 'todos', q: '' };

  /* ---------- blocos reutilizáveis ---------- */
  function row(label, w, val, sub, cls) {
    return '<div class="brow"><span>' + label + '</span><div class="track"><div class="fill ' + (cls || '') + '" style="width:' + w + '"></div></div>' +
      '<span class="mono val">' + val + '</span>' + (sub ? '<span class="sub">' + sub + '</span>' : '') + '</div>';
  }
  function mk(q, b, label, totalPct) {
    if (q == null) return row(label, '0%', 'n/p', 'recorte não publicado nesta tabela');
    var p = q / b * 100;
    var d = totalPct == null ? '' : ' · ' + pp(p - totalPct) + ' em relação ao Brasil';
    return row(label, Math.max(p, 0.6).toFixed(1) + '%', fmt1(p), num(q) + ' de ' + num(b) + ' empresas' + d);
  }
  function pbiBlock(key, titulo, img, alt, legenda) {
    var url = PBI[key];
    var corpo = url
      ? '<div class="pbi-frame"><iframe title="' + titulo + '" src="' + url + '" allowfullscreen="true" loading="lazy"></iframe></div>'
      : '<img src="assets/' + img + '" alt="' + alt + '" loading="lazy">';
    var cap = url
      ? '<span>Relatório interativo do Power BI · ' + legenda + '</span><a href="' + url + '" target="_blank" rel="noopener">Abrir em nova aba ↗</a>'
      : '<span>Captura do relatório do Power BI · ' + legenda + '</span><span class="small">A versão interativa é a dos painéis acima.</span>';
    return '<section class="pbi" aria-labelledby="pbi-' + key + '"><h2 id="pbi-' + key + '">Relatório no Power BI</h2>' +
      '<p class="small" style="margin:0 0 10px">Mesma base de dados, vista no relatório usado pela equipe.</p>' +
      '<div class="pbi-box">' + corpo + '<div class="pbi-cap">' + cap + '</div></div></section>';
  }
  function tabs(items, active) {
    return '<nav class="tabs" aria-label="Seções da página">' + items.map(function (t) {
      return '<a href="#/' + t[0] + '"' + (t[0] === active ? ' aria-current="page"' : '') + '>' + t[1] + '</a>';
    }).join('') + '</nav>';
  }
  function como(titulo, blocos, limites, linkMetodo) {
    return '<aside class="aside" aria-label="' + titulo + '"><h3>' + titulo + '</h3>' + blocos.map(function (b) {
      return '<div class="eyebrow">' + b[0] + '</div><div>' + b[1] + '</div>';
    }).join('') + '<div class="eyebrow">Limitações</div><ul>' + limites.map(function (l) { return '<li>' + l + '</li>'; }).join('') + '</ul>' +
      (linkMetodo ? '<p style="margin:14px 0 0"><a href="#/metodologia">Metodologia completa →</a></p>' : '') + '</aside>';
  }

  /* ---------- páginas ---------- */
  function viewInicio() {
    var a = Math.round(P(0, 0, 3)), b = Math.round(P(0, 0, 1)), c = Math.round(P(0, 0, 14)), d = Math.round(P(0, 0, 13));
    var total = DEM.reduce(function (s, r) { return s + r[4]; }, 0);
    return '<section class="wrap page hero">' +
      '<div class="eyebrow">Projeto de extensão · Sistemas de Informação · PUC Minas + ALL DADOS</div>' +
      '<h1 tabindex="-1">Radar de Maturidade Digital para Serviços de BI</h1>' +
      '<p class="l">Como as empresas brasileiras adotam tecnologias de dados e o que os clientes de uma consultoria de BI procuram.</p>' +
      '<div class="cards">' +
        '<div class="card"><div><span class="tag tag-b">Dados públicos · TIC Empresas</span></div><h2>Painéis de mercado</h2>' +
        '<p>Adoção de tecnologias pelas empresas brasileiras, por porte, região e mercado de atuação, com dados da TIC Empresas 2025 (CETIC.br).</p>' +
        '<div class="mini" aria-hidden="true"><b style="height:' + P(0, 0, 1).toFixed(0) + '%"></b><b style="height:' + P(0, 0, 2).toFixed(0) + '%"></b><b style="height:' + P(0, 0, 3).toFixed(0) + '%"></b><span>IA por porte</span></div>' +
        '<div><a class="btn p" href="#/mercado">Ver painéis de mercado →</a></div></div>' +
        '<div class="card g"><div><span class="tag tag-g">Dados da ALL DADOS · agregados</span></div><h2>Demandas da ALL DADOS</h2>' +
        '<p>Problemas que levam os clientes à consultoria e serviços de BI mais pedidos, a partir do histórico de chamados, publicado só em totais.</p>' +
        '<div class="mini g" aria-hidden="true"><b style="height:90%"></b><b style="height:30%"></b><b style="height:18%"></b><b style="height:48%"></b><span>demandas por ano</span></div>' +
        '<div><a class="btn" href="#/demandas">Ver demandas →</a></div></div>' +
      '</div>' +
      '<div style="border-top:1px solid var(--ink);margin-top:48px;padding-top:24px"><h2 style="margin:0;font-size:24px">Destaques</h2><div class="stats">' +
        '<div class="stat"><span class="tag tag-b">TIC Empresas</span><div class="n">' + a + '% × ' + b + '%</div><p>das empresas grandes (250 ou mais pessoas) e das pequenas (10 a 49) usam inteligência artificial.</p><span class="src">Fonte: TIC Empresas 2025 · tabela H9</span></div>' +
        '<div class="stat"><span class="tag tag-b">TIC Empresas</span><div class="n">' + c + '% × ' + d + '%</div><p>usam IA em informação e comunicação e em alojamento e alimentação, respectivamente.</p><span class="src">Fonte: TIC Empresas 2025 · tabela H9</span></div>' +
        '<div class="stat"><span class="tag tag-g">ALL DADOS</span><div class="n">' + num(total) + '</div><p>demandas registradas no histórico da consultoria, de 11/2019 a 09/2026.</p><span class="src">Fonte: histórico de chamados · Sydle One</span></div>' +
      '</div></div></section>';
  }

  var MTABS = [['mercado', 'Adoção tecnológica'], ['mercado/hipoteses', 'Hipóteses × evidência'], ['mercado/explorador', 'Explorador de mercados']];

  function viewAdocao() {
    var ind = IND[S.ind], multi = ind.itens.length > 1;
    var idx = multi ? S.item : 0, incomplete = multi && idx < 0;
    var it = incomplete ? null : ind.itens[idx];
    var g = G[S.rec], rows = '', total = '';
    if (it) {
      var tp = it.q[0] / it.b[0] * 100;
      for (var i = g[0]; i <= g[1]; i++) rows += mk(it.q[i], it.b[i], REC[i], tp);
      total = mk(it.q[0], it.b[0], '<strong>Total Brasil</strong>').replace('class="fill "', 'class="fill lt"');
    }
    var avail = IND.map(function (x) {
      var ok = function (a, z) { return x.itens.every(function (y) { for (var r = a; r <= z; r++) if (y.q[r] == null) return false; return true; }) ? '✓' : '— parcial'; };
      return '<tr><td>' + x.nome + '</td><td>' + ok(1, 3) + '</td><td>' + ok(4, 8) + '</td><td>' + ok(9, 16) + '</td></tr>';
    }).join('');

    var chart = incomplete
      ? '<div class="dash" style="padding:40px 20px;text-align:center"><strong>Seleção incompleta</strong><p style="margin:6px 0 0;color:var(--muted)">Escolha um item do indicador para ver os percentuais. O portal não mostra zero quando falta seleção.</p></div>'
      : '<div class="chart-title"><strong style="font-size:15px">' + ind.nome + (multi ? ' — ' + it.item : '') + '</strong><span class="tag tag-b">' + RECNAMES[S.rec] + '</span></div>' + rows +
        '<div class="total-block">' + total + '</div>' +
        '<p class="small" style="margin:14px 0 0">Escala de 0% a 100%. Trocar o recorte troca as barras: porte mostra 3 faixas, região mostra 5 regiões e mercado de atuação mostra 8 mercados.</p>';

    return '<section class="wrap page"><span class="tag tag-b">Dados públicos · TIC Empresas</span><h1 class="h1" tabindex="-1">Painéis de mercado</h1>' +
      '<p class="lead">Adoção de tecnologias pelas empresas brasileiras, com dados da pesquisa TIC Empresas 2025 (CETIC.br).</p>' + tabs(MTABS, 'mercado') +
      '<div class="eyebrow">Pergunta que o painel responde</div><h2 class="q">Onde a adoção de tecnologias ligadas a dados é menor?</h2>' +
      '<div class="row"><div class="main-col"><div class="panel">' +
        '<div class="filters">' +
          '<div><label class="eyebrow" for="selInd">Indicador</label><select id="selInd" class="sel" data-s="ind">' + IND.map(function (x, i) { return opt(i, x.nome, S.ind); }).join('') + '</select></div>' +
          (multi ? '<div><label class="eyebrow" for="selItem">Item</label><select id="selItem" class="sel" data-s="item"><option value="-1"' + (S.item < 0 ? ' selected' : '') + '>Selecione um item…</option>' + ind.itens.map(function (x, i) { return opt(i, x.item, S.item); }).join('') + '</select></div>' : '') +
          '<div><span class="eyebrow" id="lblRec">Recorte (um por vez)</span><div role="group" aria-labelledby="lblRec" style="display:flex">' +
            ['porte', 'regiao', 'mercado'].map(function (k) { return '<button class="seg' + (S.rec === k ? ' on' : '') + '" data-rec="' + k + '" aria-pressed="' + (S.rec === k) + '">' + RECNAMES[k] + '</button>'; }).join('') +
          '</div></div>' +
        '</div>' +
        '<div class="panel-body" aria-live="polite">' + chart + '</div></div>' +
        '<div class="meta"><span><strong>Fonte:</strong> TIC Empresas 2025 · CETIC.br · publicada em 2026</span><span><strong>Atualizado em:</strong> ' + (C.atualizadoEm || '—') + '</span></div>' +
        '<div class="note"><strong>Nota de leitura</strong> — cada percentual refere-se às empresas do próprio grupo (por exemplo, empresas de 10 a 49 pessoas), não ao total do Brasil. Porte, região e mercado de atuação aparecem um de cada vez porque a pesquisa os publica separadamente. Percentuais de grupos diferentes não são somados.</div>' +
        '<div style="margin-top:28px"><h3 style="margin:0;font-size:18px">Onde este indicador é publicado</h3><div class="tscroll" style="margin-top:8px"><table style="min-width:520px"><thead><tr><th>Indicador</th><th>Porte</th><th>Região</th><th>Mercado de atuação</th></tr></thead><tbody>' + avail + '</tbody></table></div></div>' +
      '</div>' +
      como('Como ler este painel', [
        ['Fonte', 'TIC Empresas 2025 — CETIC.br'], ['Edição', '2025 (publicada em 2026)'],
        ['População de referência', 'Empresas com 10 ou mais pessoas ocupadas'],
        ['Base do percentual (denominador)', BASE[ind.cod]], ['Granularidade', 'Indicador × item × um recorte por vez']],
        ['Estimativas amostrais; a margem de erro não consta nas tabelas de totais.', 'Porte, região e mercado de atuação não são cruzados entre si.', 'Baixa adoção não comprova, por si só, necessidade de contratar BI.'], true) +
      '</div>' +
      pbiBlock('adocao', 'Adoção tecnológica — TIC Empresas 2025', 'pbi-adocao.png', 'Captura da aba Adoção tecnológica do relatório do Power BI: barras do percentual de empresas por região, comparado ao total nacional.', 'aba Adoção tecnológica') +
      '</section>';
  }

  function viewHipoteses() {
    var hips = [
      { n: 'Hipótese 1', st: 'Coerente', t: 'A adoção de IA cresce com o porte da empresa.', ev: fmt1(P(0, 0, 1)) + ' → ' + fmt1(P(0, 0, 2)) + ' → ' + fmt1(P(0, 0, 3)), d: 'Empresas de 10 a 49, de 50 a 249 e de 250 ou mais pessoas ocupadas.', s: 'TIC 2025 · H9 · recorte porte' },
      { n: 'Hipótese 2', st: 'Coerente', t: 'A adoção de IA varia muito entre mercados de atuação.', ev: fmt1(P(0, 0, 14)) + ' × ' + fmt1(P(0, 0, 13)), d: 'Informação e comunicação × alojamento e alimentação.', s: 'TIC 2025 · H9 · recorte mercado' },
      { n: 'Hipótese 3 (ilustrativa)', st: 'Ilustrativa', t: 'Empresas menores recorrem mais a fornecedores externos para analisar big data.', ev: fmt1(P(2, 1, 1)) + ' × ' + fmt1(P(2, 1, 3)), d: 'Porte de 10 a 49 × 250 ou mais, entre as empresas que fazem análise de big data.', s: 'TIC 2025 · H2 · base H1 (Sim)' }
    ];
    return '<section class="wrap page"><span class="tag tag-b">Dados públicos · TIC Empresas</span><h1 class="h1" tabindex="-1">Painéis de mercado</h1>' +
      '<p class="lead">Adoção de tecnologias pelas empresas brasileiras, com dados da pesquisa TIC Empresas 2025 (CETIC.br).</p>' + tabs(MTABS, 'mercado/hipoteses') +
      '<div class="eyebrow">Pergunta que o painel responde</div><h2 class="q" style="margin-bottom:8px">O que os dados públicos sustentam sobre cada hipótese do projeto?</h2>' +
      '<p style="color:var(--muted);max-width:760px;margin:0 0 20px">Cada hipótese é comparada a indicadores publicados. “Coerente” indica compatibilidade descritiva; não comprova causalidade nem demanda comercial.</p>' +
      '<div class="hips">' + hips.map(function (h) {
        return '<article class="hip"><div class="top-r"><span class="eyebrow">' + h.n + '</span><span class="tag tag-n">' + h.st + '</span></div><h3>' + h.t + '</h3><div class="ev">' + h.ev + '</div><div class="d">' + h.d + '</div><span class="src" style="align-self:flex-start">' + h.s + '</span></article>';
      }).join('') + '</div></section>';
  }

  function viewExplorador() {
    var ind = IND[S.exInd], multi = ind.itens.length > 1;
    var ii = multi ? Math.min(S.exItem, ind.itens.length - 1) : 0, it = ind.itens[ii];
    var pa = it.q[S.exMerc] / it.b[S.exMerc] * 100, pb = it.q[0] / it.b[0] * 100;
    return '<section class="wrap page"><span class="tag tag-b">Dados públicos · TIC Empresas</span><h1 class="h1" tabindex="-1">Painéis de mercado</h1>' +
      '<p class="lead">Adoção de tecnologias pelas empresas brasileiras, com dados da pesquisa TIC Empresas 2025 (CETIC.br).</p>' + tabs(MTABS, 'mercado/explorador') +
      '<div class="eyebrow">Pergunta que o painel responde</div><h2 class="q">Como um mercado de atuação se compara ao total do Brasil?</h2>' +
      '<div class="row"><div class="main-col panel">' +
        '<div class="filters">' +
          '<div><label class="eyebrow" for="exI">Indicador</label><select id="exI" class="sel" data-s="exInd">' + IND.map(function (x, i) { return opt(i, x.nome, S.exInd); }).join('') + '</select></div>' +
          (multi ? '<div><label class="eyebrow" for="exIt">Item</label><select id="exIt" class="sel" data-s="exItem">' + ind.itens.map(function (x, i) { return opt(i, x.item, ii); }).join('') + '</select></div>' : '') +
          '<div><label class="eyebrow" for="exM">Mercado de atuação</label><select id="exM" class="sel" data-s="exMerc">' + REC.slice(9).map(function (t, i) { return opt(i + 9, t, S.exMerc); }).join('') + '</select></div>' +
        '</div>' +
        '<div class="panel-body" aria-live="polite"><strong style="font-size:15px">' + ind.nome + (multi ? ' — ' + it.item : '') + '</strong>' +
          mk(it.q[S.exMerc], it.b[S.exMerc], '<strong>' + REC[S.exMerc] + '</strong>') +
          mk(it.q[0], it.b[0], '<strong>Total Brasil</strong>').replace('class="fill "', 'class="fill lt"') +
          '<div style="margin-top:16px;font-size:15px"><strong>Diferença: ' + pp(pa - pb) + '</strong> <span style="color:var(--muted)">· a margem de erro não consta nas tabelas de totais; a diferença não é apresentada como estatisticamente significativa.</span></div>' +
        '</div></div>' +
        '<aside class="aside"><h3>Como ler este painel</h3><div class="eyebrow">Base do percentual</div><div>' + BASE[ind.cod] + '</div>' +
        '<div class="eyebrow">Regra</div><div style="font-size:14px">Compara um mercado ao total para o mesmo indicador, a mesma edição e a mesma população de referência.</div></aside>' +
      '</div></section>';
  }

  var DTABS = [['demandas', 'Demandas e projetos de BI'], ['demandas/cruzamento', 'Demandas × mercado']];

  function viewDemandas() {
    var match = function (r, skipAno) { return (skipAno || S.ano === 'todos' || String(r[0]) === S.ano) && (S.status === 'todos' || r[2] === S.status) && (S.area === 'todos' || r[1] === S.area); };
    var k = DEM.filter(function (r) { return match(r, false); }).reduce(function (s, r) { return s + r[4]; }, 0);
    var yc = YEARS.map(function (y) { return DEM.filter(function (r) { return r[0] === y && match(r, true); }).reduce(function (s, r) { return s + r[4]; }, 0); });
    var ymax = Math.max.apply(null, yc.concat([1]));
    var years = YEARS.map(function (y, i) {
      var on = S.ano === 'todos' || S.ano === String(y);
      return '<div><span>' + yc[i] + '</span><i style="height:' + Math.max(yc[i] / ymax * 100, 1).toFixed(0) + '%;background:' + (on ? 'var(--green)' : 'var(--green-l)') + '"></i></div>';
    }).join('');
    var dores = [['Operacional', 661, '59,2%'], ['Analítica', 321, '28,7%'], ['Não classificado', 64, '5,7%'], ['Suporte', 48, '4,3%'], ['Governança', 23, '2,1%']]
      .map(function (d) { return row(d[0], (d[1] / 661 * 100).toFixed(0) + '%', d[1] + ' · ' + d[2], '', 'g'); }).join('');
    var servs = ['Relatório ou base de dados', 'Atualização ou correção de BI', 'Novo painel ou dashboard', 'Inclusão de escopo em BI', 'Suporte de TI', 'Análise e apresentação de resultados', 'Batimento e validação de dados', 'Outros']
      .map(function (s) { return '<span class="chip">' + s + '</span>'; }).join('');
    var sel = function (id, key, label, list) {
      return '<div><label class="eyebrow" for="' + id + '">' + label + '</label><select id="' + id + '" class="sel" data-s="' + key + '">' + list.map(function (o) { return opt(o[0], o[1], S[key]); }).join('') + '</select></div>';
    };
    return '<section class="wrap page"><span class="tag tag-g">Dados da ALL DADOS · agregados</span><h1 class="h1" tabindex="-1">Demandas da ALL DADOS</h1>' +
      '<p class="lead">Histórico de chamados da consultoria, registrado no Sydle One e publicado só em totais, sem identificar clientes.</p>' + tabs(DTABS, 'demandas') +
      '<div class="eyebrow">Pergunta que o painel responde</div><h2 class="q">Que problemas levam os clientes à consultoria, e quais serviços de BI eles pedem?</h2>' +
      '<div class="row"><div class="main-col panel">' +
        '<div class="filters">' +
          sel('fAno', 'ano', 'Período (ano)', [['todos', 'Todos (2019–2026)']].concat(YEARS.map(function (y) { return [String(y), String(y)]; }))) +
          sel('fSt', 'status', 'Status', [['todos', 'Todos'], ['Fechado', 'Fechado'], ['Aberto', 'Aberto']]) +
          sel('fAr', 'area', 'Área', [['todos', 'Todas'], ['MIS', 'MIS'], ['Suporte T.I.', 'Suporte T.I.'], ['Atendimento', 'Atendimento'], ['Comunicação', 'Comunicação']]) +
        '</div>' +
        '<div class="kpis" aria-live="polite"><div class="kpi"><div class="n">' + num(k) + '</div><div class="l">demandas no filtro</div></div>' +
          '<div class="kpi"><div class="n">76</div><div class="l">meses com registros</div></div>' +
          '<div class="kpi"><div class="n s">11/2019–09/2026</div><div class="l">período do histórico</div></div></div>' +
        '<div class="cols2"><div class="box"><strong>Demandas por ano</strong><div class="years" role="img" aria-label="Demandas por ano: ' + YEARS.map(function (y, i) { return y + ': ' + yc[i]; }).join('; ') + '">' + years + '</div>' +
          '<div class="years-l" aria-hidden="true">' + YEARS.map(function (y) { return '<span>' + y + '</span>'; }).join('') + '</div>' +
          '<div class="small" style="margin-top:8px">2019 contém só novembro e dezembro; 2026 vai até setembro.</div></div>' +
        '<div class="box"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><strong>Problemas recorrentes</strong><span class="tag tag-g">categoria de dor</span></div>' + dores +
          '<div class="small" style="margin-top:10px;font-size:13px">Total: 1.117 chamados. Contagens do histórico completo, como no relatório do Power BI; não mudam com os filtros.</div>' +
          '<div style="margin-top:14px"><strong>Serviços solicitados</strong> <span class="tag tag-g">categoria de serviço</span></div><div class="chips">' + servs + '</div>' +
          '<div class="small" style="margin-top:10px;font-size:13px">Cerca de 5% dos chamados ficam em “Outros” ou “Não classificado”.</div></div></div>' +
        '<div class="cols2"><div class="dash" style="flex:1 1 280px;padding:18px;text-align:center"><strong>Esforço por tipo de projeto</strong><div aria-hidden="true" style="margin:8px auto;width:26px;height:26px;border:2px solid var(--muted);border-radius:50%;font-weight:700;line-height:22px">i</div><p style="margin:0;font-size:14px;color:var(--muted)">Indisponível. A base atual não registra horas nem duração. A quantidade de chamados não é usada como esforço.</p></div></div>' +
      '</div>' +
      como('Como ler este painel', [
        ['Fonte', 'Histórico de chamados da ALL DADOS (Sydle One, planilha exportada pela ALL DADOS)'], ['Período', '11/2019 a 09/2026'],
        ['População', '1.117 chamados, após descartar 7 linhas em branco'], ['Granularidade', 'Uma linha por chamado; publicado só em totais por categoria e ano']],
        ['Clientes sem porte, setor ou região registrados.', 'Categorias de dor e de serviço propostas pela equipe a partir do assunto.', '99,9% dos chamados estão encerrados: a taxa de conclusão não é usada como indicador.', 'Reflete só quem procurou a consultoria.'], true) +
      '</div>' +
      '<div style="margin-top:36px"><h2 style="margin:0;font-size:24px">Como estes dados foram tratados</h2><div class="steps">' +
        '<div><div class="num">1</div><strong>Exportação</strong><p>A ALL DADOS exportou o histórico do Sydle One em planilha Excel (1.124 linhas), lida pelo ETL.</p></div>' +
        '<div><div class="num">2</div><strong>Tratamento</strong><p>Datas padronizadas, cliente anonimizado, assunto classificado em categorias e tipo de serviço padronizado.</p></div>' +
        '<div><div class="num">3</div><strong>Agregação</strong><p>Só totais por categoria e ano. Nomes de clientes, solicitantes e observações não são publicados.</p></div></div></div>' +
      pbiBlock('demandas', 'Demandas e projetos de BI — histórico ALL DADOS', 'pbi-demandas.png', 'Captura da aba Demandas e projetos de BI do relatório do Power BI: total de chamados, categorias de dor, categorias de serviço e evolução mensal.', 'aba Demandas e projetos de BI') +
      '</section>';
  }

  function viewCruzamento() {
    var temas = [
      ['Dados e analytics', 'Análises de big data: ' + fmt1(P(1, 0, 0)) + ' das empresas', 'Tabela H1 · base: total de empresas', '1.013 chamados'],
      ['Nuvem', 'E-mail em nuvem pago: ' + fmt1(P(3, 0, 0)) + ' das empresas', 'Tabela B18 · base: empresas com Internet (B1)', '0 chamados no período'],
      ['Inteligência artificial', 'Uso de IA: ' + fmt1(P(0, 0, 0)) + ' das empresas', 'Tabela H9 · base: total de empresas', '0 chamados no período'],
      ['Infraestrutura e suporte de TI', 'Sem indicador correspondente nas tabelas selecionadas', 'indisponível', '51 chamados'],
      ['Não classificado', '—', '', '53 chamados']
    ];
    return '<section class="wrap page"><span class="tag tag-g">Dados da ALL DADOS · agregados</span><h1 class="h1" tabindex="-1">Demandas da ALL DADOS</h1>' +
      '<p class="lead">Histórico de chamados da consultoria, registrado no Sydle One e publicado só em totais, sem identificar clientes.</p>' + tabs(DTABS, 'demandas/cruzamento') +
      '<div class="eyebrow">Pergunta que o painel responde</div><h2 class="q" style="margin-bottom:8px">Os temas que o mercado adota aparecem nas demandas da consultoria?</h2>' +
      '<p style="color:var(--muted);max-width:760px;margin:0 0 20px">Comparação temática (drill-across): cada fonte é consultada com seu próprio denominador e apresentada lado a lado, por tema. Os valores das duas fontes nunca são somados.</p>' +
      '<div class="tscroll"><table style="min-width:680px;border:1px solid var(--ink)"><thead><tr><th style="background:var(--blue-bg)">Tema</th><th style="background:var(--blue-bg)">Mercado · TIC Empresas 2025</th><th style="background:var(--green-bg)">Demandas · ALL DADOS</th></tr></thead><tbody>' +
        temas.map(function (t) { return '<tr><td><strong>' + t[0] + '</strong></td><td>' + t[1] + '<div class="small">' + t[2] + '</div></td><td>' + t[3] + '</td></tr>'; }).join('') + '</tbody></table></div>' +
      '<div class="note"><strong>Cobertura da comparação.</strong> Dos cinco temas, apenas Dados e analytics tem valores nas duas fontes. Inteligência artificial e Nuvem têm indicador na TIC Empresas, mas nenhum chamado no período; Infraestrutura e suporte de TI e Não classificado têm chamados, mas nenhum indicador correspondente. No relatório do Power BI, a comparação é feita para um indicador e um item por vez. <strong>Limites.</strong> Com os campos disponíveis, não é possível posicionar a carteira da ALL DADOS por porte, setor ou região, nem comprovar oportunidade comercial. A comparação mostra se um tema aparece nas duas fontes, sem avaliar a maturidade de um cliente específico.</div>' +
      pbiBlock('mercado', 'Demandas × mercado — ALL DADOS e TIC Empresas 2025', 'pbi-demandas-mercado.png', 'Captura da aba Demandas × mercado do relatório do Power BI: percentual de adoção por tema à esquerda e total de chamados por tema à direita.', 'aba Demandas × mercado') +
      '</section>';
  }

  var FLOW = [
    ['1', 'Extração', 'Lê os arquivos Excel e registra a origem.'], ['2', 'Staging', 'Guarda os dados recebidos e confere a estrutura.'],
    ['3', 'Transformação e validação', 'Limpa, padroniza categorias, anonimiza e valida regras.'], ['4', 'Carga das dimensões', 'Prepara as chaves e carrega as dimensões.'],
    ['5', 'Carga dos fatos', 'Carrega os registros e verifica as chaves.'], ['6', 'Verificação e registro', 'Compara contagens, registra erros e a execução.']
  ];
  var DICT = [
    ['fato_indicador_tic', 'sk_tempo', 'integer', 'Mês de referência da edição, no último mês do ano (ex.: 202512).'],
    ['fato_indicador_tic', 'sk_indicador', 'smallint', 'Indicador e item a que a linha se refere.'],
    ['fato_indicador_tic', 'sk_recorte', 'smallint', 'Categoria de recorte: total, porte, região ou mercado de atuação.'],
    ['fato_indicador_tic', 'sk_tema', 'smallint', 'Tema comum usado na comparação com os chamados.'],
    ['fato_indicador_tic', 'qtd_empresas', 'numeric', 'Quantidade estimada de empresas que responderam “Sim”.'],
    ['fato_indicador_tic', 'qtd_base', 'numeric', 'Quantidade de empresas na base do indicador (denominador).'],
    ['fato_indicador_tic', 'percentual', 'numeric', 'qtd_empresas ÷ qtd_base × 100. Medida não aditiva.'],
    ['fato_indicador_tic', 'tabela_origem', 'varchar', 'Tabela de origem no CETIC.br, para rastreabilidade.'],
    ['dim_indicador', 'cod_indicador', 'varchar', 'Código da tabela do indicador (B18, H1, H2, H9 ou H11).'],
    ['dim_indicador', 'item', 'varchar', 'Item do indicador; “-” quando não há itens.'],
    ['dim_indicador', 'nome_indicador', 'varchar', 'Enunciado do indicador selecionado.'],
    ['dim_indicador', 'base_indicador', 'varchar', 'Universo de empresas usado como denominador.'],
    ['dim_recorte', 'tipo_recorte', 'varchar', 'Total, porte, região ou mercado de atuação.'],
    ['dim_recorte', 'categoria', 'varchar', 'Categoria do recorte, como “Sudeste”.'],
    ['dim_tema', 'nome_tema', 'varchar', 'Dados e analytics, nuvem, inteligência artificial, infraestrutura e suporte de TI ou não classificado.'],
    ['dim_tempo', 'sk_tempo', 'integer', 'Chave do mês no formato AAAAMM.'],
    ['dim_tempo', 'mes_ano', 'char', 'Rótulo de mês e ano (AAAA-MM).']
  ];

  function dictRows() {
    var q = S.q.trim().toLowerCase();
    var l = DICT.filter(function (r) { return !q || r.join(' ').toLowerCase().indexOf(q) >= 0; });
    return { html: l.map(function (r) { return '<tr><td class="mono" style="font-size:12px">' + r[0] + '</td><td class="mono" style="font-size:12px">' + r[1] + '</td><td class="mono" style="font-size:12px">' + r[2] + '</td><td>' + r[3] + '</td></tr>'; }).join(''), n: l.length };
  }

  function viewMetodo() {
    var d = dictRows();
    return '<section class="wrap page"><span class="tag tag-n">Ambas as fontes</span><h1 class="h1" tabindex="-1">Metodologia e dados</h1>' +
      '<p class="lead" style="margin-bottom:28px">Fontes, integração, modelo dimensional, dicionário de dados, regras de interpretação e downloads.</p>' +
      '<h2 style="font-size:24px;margin:0 0 12px">Fontes de dados</h2><div class="src-cards">' +
        '<div class="src-card"><span class="tag tag-b">Dados públicos</span><h3>TIC Empresas 2025 (CETIC.br)</h3><p>Tabelas de totais com contagem de empresas por porte, região e mercado de atuação. Cinco tabelas selecionadas: B18, H1, H2, H9 e H11.</p></div>' +
        '<div class="src-card g"><span class="tag tag-g">Dados da ALL DADOS</span><h3>Histórico de chamados</h3><p>1.117 chamados de 11/2019 a 09/2026, exportados do Sydle One em planilha Excel. Somente agregados aprovados são publicados.</p></div></div>' +
      '<h2 class="sec">Integração e transformação</h2>' +
      '<ol class="flow">' + FLOW.map(function (f) { return '<li><div class="j">JOB ' + f[0] + '</div><strong>' + f[1] + '</strong><div class="d">' + f[2] + '</div></li>'; }).join('') + '</ol>' +
      '<p class="small" style="font-size:14px;margin:10px 0 0">Ferramenta: Python + pandas. Destino: PostgreSQL (schema dw). A TIC e os chamados não descrevem as mesmas empresas; a ligação entre os fatos é feita só pelas dimensões conformes dim_tempo e dim_tema.</p>' +
      '<p class="small" style="font-size:14px;margin:8px 0 0"><strong>Camada de visualização:</strong> o Power BI se conecta ao banco dw_alldados por três views de leitura (vw_pbi_tema, vw_pbi_tic e vw_pbi_chamados), com usuário de acesso somente leitura. As views não trazem número do chamado, código do cliente nem equipe solicitante.</p>' +
      '<h2 class="sec">Modelo dimensional (versão 2)</h2><div class="model">' +
        '<div class="m1"><span class="tag tag-b">Fato</span><strong>fato_indicador_tic</strong><span class="t">Grão: edição × indicador e item × recorte. Medidas: qtd_empresas, qtd_base, percentual.</span></div>' +
        '<div class="m2"><span class="tag tag-n">Dimensões conformes</span><strong>dim_tempo · dim_tema</strong><span class="t">Compartilhadas pelos dois fatos. Permitem o drill-across.</span></div>' +
        '<div class="m3"><span class="tag tag-g">Fato</span><strong>fato_chamado</strong><span class="t">Grão: um chamado. Medida: qtd_chamado (não mede esforço).</span></div></div>' +
      '<p class="small" style="font-size:14px;margin:10px 0 0">Dimensões da TIC: dim_indicador (com item) e dim_recorte. Dimensões dos chamados: dim_cliente (anonimizado), dim_tipo_servico, dim_status, dim_area e dim_dor_negocio.</p>' +
      '<h2 class="sec">Dicionário de dados</h2>' +
      '<label class="eyebrow" for="dq" style="display:block">Buscar por tabela, coluna ou descrição</label>' +
      '<input id="dq" class="search" type="search" value="' + S.q.replace(/"/g, '&quot;') + '" placeholder="ex.: percentual" data-q="1" autocomplete="off">' +
      '<div class="tscroll" style="margin-top:12px"><table style="min-width:720px"><thead><tr><th>Tabela</th><th>Coluna</th><th>Tipo</th><th>Descrição</th></tr></thead><tbody id="dictBody">' + d.html + '</tbody></table></div>' +
      '<div id="dictEmpty" class="dash" style="padding:18px;margin-top:10px;text-align:center"' + (d.n ? ' hidden' : '') + '>Nenhum campo encontrado para esta busca.</div>' +
      '<h2 class="sec">Downloads</h2><div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center">' +
        '<button class="btn p" id="dlCsv">Baixar indicadores públicos tratados (CSV)</button>' +
        '<button class="btn" disabled>Baixar demandas agregadas (CSV)</button></div>' +
      '<p class="small" style="font-size:14px;margin:8px 0 0">O CSV usa ponto e vírgula e vírgula decimal, para abrir direto no Excel em português. O CSV de demandas fica indisponível até a ALL DADOS autorizar a divulgação de agregados.</p>' +
      '<h2 class="sec">Regras de interpretação</h2><ul style="margin:0;padding-left:20px;max-width:820px">' +
        '<li>Percentuais de categorias diferentes não são somados; o total nacional vem da própria fonte.</li>' +
        '<li>Percentual = quantidade de empresas ÷ base do indicador. Em B18 a base é o total de B1 e em H2, o total de H1.</li>' +
        '<li>Ausência de dado nunca é exibida como zero; cada situação tem uma mensagem própria.</li>' +
        '<li>Baixa adoção tecnológica, isoladamente, não comprova necessidade de contratar BI.</li>' +
        '<li>Grupos pequenos de demandas seguem regra de divulgação a acordar com a parceira (hipótese inicial: menos de 5).</li></ul>' +
      '<h2 class="sec">Situações do painel</h2><div style="display:flex;flex-wrap:wrap;gap:16px">' +
        [['Seleção incompleta', 'Falta escolher indicador, item ou recorte. Pede a seleção; não mostra zero.'], ['Recorte não publicado', 'A tabela oficial não traz o recorte pedido. Mostra “n/p” e explica o motivo.'],
         ['Dado ainda não carregado', 'A carga do ETL ainda não rodou para este indicador ou período.'], ['Informação indisponível', 'A fonte não registra a informação (ex.: horas por demanda).']]
          .map(function (s) { return '<div class="dash" style="flex:1 1 220px;padding:16px"><strong>' + s[0] + '</strong><p style="margin:6px 0 0;font-size:14px;color:var(--muted)">' + s[1] + '</p></div>'; }).join('') + '</div>' +
      '</section>';
  }

  function viewSobre() {
    var team = ['Laura Magalhães Ferreira', 'Eduardo de Lyra', 'Eduardo Araújo', 'Kaio Mendes Araújo Ribeiro', 'Antônio Vicente da Cruz', 'Rafael Gomes Nascimento'];
    var contato = C.email
      ? '<h2 class="sec">Contato</h2><div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center"><a class="mono" style="border:1px solid var(--line);padding:10px 14px;background:var(--bg3);color:var(--ink)" href="mailto:' + C.email + '">' + C.email + '</a><button class="btn" id="copyMail">Copiar e-mail</button></div>'
      : '';
    return '<section class="wrap page"><h1 class="h1" style="margin-top:0" tabindex="-1">Sobre o projeto</h1>' +
      '<p class="lead" style="margin-bottom:28px">Projeto de extensão do curso de Sistemas de Informação (EAD), Eixo 4 – Aplicações para Sustentabilidade, PUC Minas.</p>' +
      '<div class="cols3">' +
        '<div><h2>Extensão</h2><p>Os estudantes sistematizam o histórico de demandas de uma consultoria de BI e o confrontam com indicadores públicos de maturidade digital, devolvendo à parceira um diagnóstico de mercado.</p></div>' +
        '<div><h2>Parceria</h2><p>A ALL DADOS, consultoria em Business Intelligence, fornece e contextualiza os dados internos e valida os resultados, em relação de cooperação com a equipe.</p></div>' +
        '<div><h2>ODS 9</h2><p>Indústria, inovação e infraestrutura: o projeto trata da adoção de tecnologias pelas empresas e das diferenças de maturidade digital.</p></div></div>' +
      '<h2 class="sec">Equipe</h2><div class="team">' + team.map(function (t) { return '<div><strong>' + t + '</strong></div>'; }).join('') + '</div>' +
      contato + '</section>';
  }

  /* ---------- roteamento ---------- */
  var ROUTES = {
    'inicio': [viewInicio, 'inicio'], 'mercado': [viewAdocao, 'mercado'], 'mercado/hipoteses': [viewHipoteses, 'mercado'], 'mercado/explorador': [viewExplorador, 'mercado'],
    'demandas': [viewDemandas, 'demandas'], 'demandas/cruzamento': [viewCruzamento, 'demandas'], 'metodologia': [viewMetodo, 'metodologia'], 'sobre': [viewSobre, 'sobre']
  };
  var NAV = [['inicio', 'Início'], ['mercado', 'Painéis de mercado'], ['demandas', 'Demandas da ALL DADOS'], ['metodologia', 'Metodologia e dados'], ['sobre', 'Sobre o projeto']];
  var TITLES = { inicio: 'Início', mercado: 'Painéis de mercado', demandas: 'Demandas da ALL DADOS', metodologia: 'Metodologia e dados', sobre: 'Sobre o projeto' };
  var main = document.getElementById('conteudo'), navEl = document.getElementById('nav'), menuBtn = document.getElementById('menuBtn');
  var current = '';

  function route() {
    var h = (location.hash || '#/inicio').replace(/^#\/?/, '') || 'inicio';
    if (!ROUTES[h]) h = 'inicio';
    var changed = h !== current; current = h;
    var group = ROUTES[h][1];
    navEl.innerHTML = NAV.map(function (n) { return '<a href="#/' + n[0] + '"' + (n[0] === group ? ' aria-current="page"' : '') + '>' + n[1] + '</a>'; }).join('');
    render(changed);
    document.title = TITLES[group] + ' · Radar de Maturidade Digital';
    if (changed) { window.scrollTo(0, 0); var h1 = main.querySelector('h1'); if (h1) h1.focus({ preventScroll: true }); }
    navEl.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false');
  }
  function render() {
    var a = document.activeElement, id = a && a.id, rec = a && a.getAttribute && a.getAttribute('data-rec');
    var ss = a && a.selectionStart, se = a && a.selectionEnd;
    main.innerHTML = ROUTES[current][0]();
    var el = id ? document.getElementById(id) : (rec ? main.querySelector('[data-rec="' + rec + '"]') : null);
    if (el && el !== document.activeElement && !(el.tagName === 'H1')) { el.focus({ preventScroll: true }); try { if (ss != null && el.setSelectionRange) el.setSelectionRange(ss, se); } catch (e) {} }
  }

  /* ---------- eventos ---------- */
  function csv() {
    var tipo = function (i) { return i === 0 ? 'Total' : i <= 3 ? 'Porte' : i <= 8 ? 'Região' : 'Mercado de atuação'; };
    var lines = ['indicador;item;tipo_recorte;categoria;qtd_empresas;qtd_base;percentual'];
    IND.forEach(function (x) { x.itens.forEach(function (it) { REC.forEach(function (r, i) {
      if (it.q[i] == null) return;
      lines.push([x.cod + ' - ' + x.nome.replace(/ \(.*\)$/, ''), it.item, tipo(i), r, it.q[i], it.b[i], (it.q[i] / it.b[i] * 100).toFixed(2).replace('.', ',')].join(';'));
    }); }); });
    var blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'indicadores_tic_empresas_2025.csv';
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  document.addEventListener('change', function (e) {
    var k = e.target.getAttribute && e.target.getAttribute('data-s'); if (!k) return;
    var v = e.target.value;
    if (k === 'ind') { S.ind = +v; S.item = 0; }
    else if (k === 'exInd') { S.exInd = +v; S.exItem = 0; }
    else if (k === 'item' || k === 'exItem' || k === 'exMerc') S[k] = +v;
    else S[k] = v;
    render();
  });
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('button, a'); if (!t) return;
    if (t.hasAttribute('data-rec')) { S.rec = t.getAttribute('data-rec'); render(); }
    else if (t.id === 'dlCsv') csv();
    else if (t.id === 'copyMail') {
      var done = function () { t.textContent = 'Copiado'; setTimeout(function () { t.textContent = 'Copiar e-mail'; }, 2000); };
      if (navigator.clipboard) navigator.clipboard.writeText(C.email).then(done, done); else done();
    }
  });
  document.addEventListener('input', function (e) {
    if (!e.target.hasAttribute || !e.target.hasAttribute('data-q')) return;
    S.q = e.target.value; var d = dictRows();   /* atualiza só a tabela, sem perder o foco do campo */
    document.getElementById('dictBody').innerHTML = d.html; document.getElementById('dictEmpty').hidden = d.n > 0;
  });
  menuBtn.addEventListener('click', function () { var o = navEl.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', String(o)); });
  window.addEventListener('hashchange', route);
  route();
})();
