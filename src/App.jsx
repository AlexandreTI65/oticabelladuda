import React, { useEffect, useMemo, useState } from 'react';
import {
  Menu, X, Glasses, Gift, MapPin, Instagram, Search, MessageCircle,
  CalendarDays, ArrowRight, CheckCircle2, ShieldCheck, Plus, Pencil, Trash2,
  ExternalLink, Sparkles, ChevronDown, Camera, CameraOff, RotateCcw, MoveVertical
} from 'lucide-react';
import { initialProducts } from './products.js';

const WHATSAPP = '5511963421659';
const INSTAGRAM_URL = 'https://www.instagram.com/oticabelladuda/';
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Rua+Paraguai%2C+238%2C+Tabo%C3%A3o%2C+Diadema%2C+SP';
const ADDRESS = 'Rua Paraguai, 238 — Taboão, Diadema - SP';
const STORAGE_KEY = 'belladuda_products_v1';
const REQUESTS_KEY = 'belladuda_exam_requests_v1';

const money = (n) => Number(n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const waLink = (message) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;

function loadProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialProducts;
  } catch {
    return initialProducts;
  }
}

function Header({ onAdmin }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    ['Início', '#inicio'], ['Catálogo', '#catalogo'], ['Provador virtual', '#provador'], ['Encontre seus óculos', '#consultor'],
    ['Exame gratuito', '#exame'], ['Localização', '#localizacao']
  ];
  return <>
    <div className="promo-strip">🎁 10% DE DESCONTO NA PRIMEIRA COMPRA · Consulte as condições</div>
    <header className="site-header">
      <a className="brand" href="#inicio" aria-label="Ótica BellaDuda - início">
        <img className="brand-logo" src="/images/logo-belladuda.png" alt="Ótica BellaDuda" />
      </a>
      <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu">{menuOpen ? <X/> : <Menu/>}</button>
      <nav className={menuOpen ? 'nav open' : 'nav'}>
        {links.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
        <a className="nav-cta" href={waLink('Olá! Gostaria de conhecer os produtos da Ótica BellaDuda.')} target="_blank" rel="noreferrer"><MessageCircle size={16}/> Fale conosco</a>
        <button className="admin-link" onClick={() => { setMenuOpen(false); onAdmin(); }}>Painel</button>
      </nav>
    </header>
  </>;
}

function ProductCard({ product }) {
  const msg = `Olá! Tenho interesse no produto "${product.name}" da Ótica BellaDuda. Preço anunciado: ${money(product.price)}. Poderiam me passar mais informações?`;
  return <article className="product-card">
    <div className="product-image-wrap">
      <img src={product.image} alt={product.name} loading="lazy" onError={(e) => { e.currentTarget.src = 'https://placehold.co/700x500/fff1f2/b51220?text=Oculos+BellaDuda'; }}/>
      {product.discountEligible && <span className="product-tag">10% na 1ª compra*</span>}
      {!product.available && <span className="unavailable-tag">Indisponível</span>}
    </div>
    <div className="product-info">
      <span className="product-category">{product.category}</span>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <div className="product-price">{money(product.price)}</div>
      <a className={`button button-red button-full ${!product.available ? 'disabled' : ''}`} href={product.available ? waLink(msg) : undefined} target="_blank" rel="noreferrer" aria-disabled={!product.available}>
        <MessageCircle size={17}/> {product.available ? 'Consultar no WhatsApp' : 'Indisponível'}
      </a>
    </div>
  </article>;
}

function StyleFinder({ products }) {
  const [style, setStyle] = useState('Moderno');
  const [face, setFace] = useState('Não sei dizer');
  const [budget, setBudget] = useState('Até R$ 300');
  const [showResults, setShowResults] = useState(false);
  const [category, setCategory] = useState('Todas');
  const maxPrice = budget === 'Até R$ 150' ? 150 : budget === 'Até R$ 300' ? 300 : budget === 'Até R$ 500' ? 500 : Infinity;
  const matches = useMemo(() => products.filter(p => p.available && p.price <= maxPrice &&
    (p.style === style || style === 'Não tenho preferência') &&
    (face === 'Não sei dizer' || !p.faceShapes?.length || p.faceShapes.includes(face)) &&
    (category === 'Todas' || p.category === category)
  ), [products, maxPrice, style, face, category]);

  return <section className="section finder-section" id="consultor">
    <div className="section-heading">
      <span className="eyebrow"><Sparkles size={15}/> CONSULTOR DE ESTILO</span>
      <h2>Encontre seus <span>óculos ideais</span></h2>
      <p>Responda a três perguntas rápidas e descubra armações do nosso catálogo que combinam com seu estilo e orçamento.</p>
    </div>
    <div className="finder-box">
      <div className="finder-step">
        <div className="step-title"><span className="step-number">1</span><h3>Qual estilo você prefere?</h3></div>
        <div className="style-options">
          {[
            ['Clássico e discreto', 'Uma escolha versátil para o dia a dia.'],
            ['Moderno', 'Linhas atuais e personalidade.'],
            ['Elegante', 'Detalhes delicados e sofisticados.'],
            ['Ousado e colorido', 'Cores e formatos que se destacam.'],
            ['Não tenho preferência', 'Quero explorar opções variadas.']
          ].map(([name, desc]) => <button key={name} className={`style-option ${style === name ? 'selected' : ''}`} onClick={() => { setStyle(name); setShowResults(false); }}>
            <span className="option-check">{style === name ? <CheckCircle2 size={19}/> : <span className="empty-circle"/>}</span>
            <span><strong>{name}</strong><small>{desc}</small></span>
          </button>)}
        </div>
      </div>
      <div className="finder-step">
        <div className="step-title"><span className="step-number">2</span><h3>Qual é o formato do seu rosto?</h3></div>
        <p className="muted">Se não souber, tudo bem — você ainda pode ver sugestões.</p>
        <div className="chip-options">
          {['Redondo', 'Oval', 'Quadrado', 'Coração', 'Não sei dizer'].map(v => <button key={v} onClick={() => { setFace(v); setShowResults(false); }} className={`chip ${face === v ? 'active' : ''}`}>{v}</button>)}
        </div>
      </div>
      <div className="finder-step">
        <div className="step-title"><span className="step-number">3</span><h3>Qual faixa de preço procura?</h3></div>
        <div className="chip-options">
          {['Até R$ 150', 'Até R$ 300', 'Até R$ 500', 'Acima de R$ 500'].map(v => <button key={v} onClick={() => { setBudget(v); setShowResults(false); }} className={`chip ${budget === v ? 'active' : ''}`}>{v}</button>)}
        </div>
      </div>
      <button className="button button-red finder-submit" onClick={() => setShowResults(true)}>Ver minhas sugestões <ArrowRight size={18}/></button>
      <p className="fine-print">As sugestões são de estilo e orçamento. Não substituem orientação profissional sobre lentes, visão ou ajuste da armação.</p>
    </div>
    {showResults && <div className="results-area">
      <div className="results-heading"><div><span className="eyebrow">SELEÇÃO PARA VOCÊ</span><h3>{matches.length ? 'Veja suas sugestões' : 'Vamos encontrar uma opção para você'}</h3></div><span className="results-count">{matches.length} {matches.length === 1 ? 'modelo' : 'modelos'}</span></div>
      <div className="results-filter"><label htmlFor="result-category">Categoria</label><select id="result-category" value={category} onChange={e => setCategory(e.target.value)}><option>Todas</option><option>Óculos de grau</option><option>Óculos de sol</option></select></div>
      {matches.length ? <div className="product-grid">{matches.slice(0, 4).map(p => <ProductCard key={p.id} product={p}/>)}</div> :
        <div className="empty-state"><Glasses size={35}/><p>Não encontramos um modelo com todos esses critérios. Tente outro estilo ou consulte nossa equipe.</p><a className="button button-red" href={waLink(`Olá! Quero ajuda para escolher óculos. Estilo: ${style}; formato do rosto: ${face}; orçamento: ${budget}.`)} target="_blank" rel="noreferrer"><MessageCircle size={17}/> Pedir ajuda pelo WhatsApp</a></div>}
    </div>}
  </section>;
}


function GlassesArtwork({ frame, size = 1 }) {
  const shapes = {
    'Clássica': <><rect x="18" y="35" width="76" height="49" rx="17"/><rect x="106" y="35" width="76" height="49" rx="17"/><path d="M94 47 Q100 42 106 47"/><path d="M18 43 L5 37 M182 43 L195 37"/></>,
    'Redonda': <><circle cx="57" cy="59" r="29"/><circle cx="143" cy="59" r="29"/><path d="M86 49 Q100 40 114 49 M28 38 L7 31 M172 38 L193 31"/></>,
    ' gatinho': <><path d="M17 39 L94 43 Q95 82 67 83 Q32 84 24 57 Z"/><path d="M183 39 L106 43 Q105 82 133 83 Q168 84 176 57 Z"/><path d="M94 48 Q100 43 106 48 M17 39 L3 22 M183 39 L197 22"/></>,
    'Aviador': <><path d="M16 34 Q50 25 91 39 L84 73 Q75 91 55 87 Q31 84 23 58 Z"/><path d="M184 34 Q150 25 109 39 L116 73 Q125 91 145 87 Q169 84 177 58 Z"/><path d="M91 41 Q100 34 109 41 M16 37 L4 31 M184 37 L196 31"/></>
  };
  return <svg className="tryon-glasses-svg" style={{ transform: `scale(${size})` }} viewBox="0 0 200 112" role="img" aria-label={`Modelo de armação ${frame}`}>
    <defs><linearGradient id="lensShine" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" stopOpacity=".28"/><stop offset="1" stopColor="#a9d9ef" stopOpacity=".12"/></linearGradient><linearGradient id="frameMetal"><stop stopColor="#3b2224"/><stop offset=".45" stopColor="#b51220"/><stop offset="1" stopColor="#351d20"/></linearGradient></defs>
    <g fill="url(#lensShine)" stroke="url(#frameMetal)" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">{shapes[frame] || shapes['Clássica']}</g>
    <path d="M32 44 L57 39 M120 44 L145 39" stroke="#fff" strokeWidth="2" opacity=".7" strokeLinecap="round"/>
  </svg>;
}

function VirtualTryOn() {
  const videoRef = React.useRef(null);
  const streamRef = React.useRef(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [frame, setFrame] = useState('Clássica');
  const [size, setSize] = useState(1);
  const [vertical, setVertical] = useState(43);
  const [angle, setAngle] = useState(-7);
  const stopCamera = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  };
  const startCamera = async () => {
    setCameraError('');
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Seu navegador não liberou o acesso à câmera. Abra o site em localhost ou HTTPS e tente novamente.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraOn(true);
    } catch {
      setCameraError('Não foi possível acessar a câmera. Verifique a permissão do navegador e feche outros aplicativos que estejam usando a câmera.');
    }
  };
  useEffect(() => () => { if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop()); }, []);
  return <section className="section tryon-section" id="provador">
    <div className="section-heading">
      <span className="eyebrow"><Camera size={15}/> EXPERIÊNCIA VIRTUAL</span>
      <h2>Experimente um novo <span>olhar</span></h2>
      <p>Veja uma armação ilustrativa sobre a imagem da câmera e explore modelos com uma apresentação em perspectiva 3D.</p>
    </div>
    <div className="tryon-layout">
      <div className="tryon-camera-card">
        <div className="tryon-card-heading"><div><span className="eyebrow">PROVADOR VIRTUAL</span><h3>Como fica em você?</h3></div><span className={`camera-status ${cameraOn ? 'on' : ''}`}>{cameraOn ? 'Câmera ativa' : 'Câmera desligada'}</span></div>
        <div className={`camera-stage ${cameraOn ? 'camera-live' : ''}`}>
          <video ref={videoRef} autoPlay playsInline muted className={cameraOn ? 'camera-video visible' : 'camera-video'} />
          {!cameraOn && <div className="camera-placeholder"><div className="placeholder-orbit"><Glasses size={62}/></div><strong>Seu provador começa aqui</strong><span>Ative a câmera para visualizar a armação ilustrativa.</span></div>}
          {cameraOn && <div className="camera-glasses-overlay" style={{ top: `${vertical}%` }}><GlassesArtwork frame={frame} size={size}/></div>}
          <span className="camera-hint">{cameraOn ? 'Ajuste o tamanho e a altura da armação' : 'A câmera só liga quando você autorizar'}</span>
        </div>
        <div className="tryon-controls">
          <label>Modelo de armação<select value={frame} onChange={e => setFrame(e.target.value)}><option>Clássica</option><option>Redonda</option><option>Aviador</option><option value=" gatinho">Gatinho</option></select></label>
          <label><span><Glasses size={15}/> Tamanho da armação</span><input type="range" min="0.7" max="1.35" step="0.05" value={size} onChange={e => setSize(Number(e.target.value))}/></label>
          <label><span><MoveVertical size={15}/> Altura da armação</span><input type="range" min="25" max="65" step="1" value={vertical} onChange={e => setVertical(Number(e.target.value))}/></label>
        </div>
        <div className="tryon-actions">{!cameraOn ? <button className="button button-red" onClick={startCamera}><Camera size={17}/> Ativar câmera</button> : <button className="button button-outline" onClick={stopCamera}><CameraOff size={17}/> Desligar câmera</button>}<button className="button button-outline" onClick={() => { setFrame('Clássica'); setSize(1); setVertical(43); setAngle(-7); }}><RotateCcw size={16}/> Reiniciar ajustes</button></div>
        {cameraError && <p className="tryon-error" role="alert">{cameraError}</p>}
        <p className="tryon-disclaimer">Demonstração visual: a armação é uma sobreposição ilustrativa ajustada manualmente, não acompanha automaticamente os movimentos do rosto e não representa medidas reais de encaixe. A imagem da câmera não é enviada nem gravada pelo site.</p>
      </div>
      <div className="tryon-model-column">
        <div className="model-viewer-card">
          <span className="eyebrow">VISUALIZAÇÃO 3D</span><h3>Explore o modelo</h3><p>Movimente o controle para mudar a perspectiva da armação.</p>
          <div className="glasses-3d-scene"><div className="glasses-3d-object" style={{ transform: `rotateY(${angle}deg) rotateX(8deg)` }}><div className="glasses-3d-shadow"/><GlassesArtwork frame={frame} size={1.15}/></div><span className="model-orbit orbit-one"/><span className="model-orbit orbit-two"/></div>
          <label className="angle-control"><span>Ângulo de visualização</span><input type="range" min="-35" max="35" step="1" value={angle} onChange={e => setAngle(Number(e.target.value))}/><span>{angle}°</span></label>
          <div className="model-chips">{['Clássica','Redonda','Aviador',' gatinho'].map(v => <button key={v} className={frame === v ? 'selected' : ''} onClick={() => setFrame(v)}>{v.trim() === 'gatinho' ? 'Gatinho' : v}</button>)}</div>
          <a className="button button-red button-full" href={waLink(`Olá! Quero conhecer armações no estilo ${frame.trim()} da Ótica BellaDuda. Vi o provador virtual no site.`)} target="_blank" rel="noreferrer"><MessageCircle size={17}/> Consultar este estilo no WhatsApp</a>
        </div>
        <div className="tryon-tip"><Sparkles size={19}/><div><strong>Gostou do modelo?</strong><p>Fale com nossa equipe para conferir opções disponíveis, cores e valores.</p></div></div>
      </div>
    </div>
  </section>;
}

function ExamSection() {
  const [form, setForm] = useState({ name: '', phone: '', date: '', time: '', notes: '' });
  const [notice, setNotice] = useState('');
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) { setNotice('Preencha seu nome e WhatsApp.'); return; }
    const request = { ...form, id: Date.now(), status: 'Pendente', createdAt: new Date().toISOString() };
    try {
      const current = JSON.parse(localStorage.getItem(REQUESTS_KEY) || '[]');
      localStorage.setItem(REQUESTS_KEY, JSON.stringify([request, ...current]));
    } catch {}
    const message = `Olá! Quero solicitar um agendamento para o exame gratuito.\nNome: ${form.name}\nMeu WhatsApp: ${form.phone}\nData preferida: ${form.date || 'A combinar'}\nHorário preferido: ${form.time || 'A combinar'}\nObservações: ${form.notes || 'Nenhuma'}\nSei que o horário depende de confirmação da equipe.`;
    setNotice('Solicitação preparada! Envie a mensagem pelo WhatsApp para continuar o atendimento.');
    window.open(waLink(message), '_blank', 'noopener,noreferrer');
    setForm({ name: '', phone: '', date: '', time: '', notes: '' });
  };
  return <section className="section exam-section" id="exame">
    <div className="exam-copy">
      <span className="eyebrow eyebrow-light"><Gift size={15}/> CAMPANHA ESPECIAL</span>
      <h2>Cuide do seu olhar com nosso <span>exame gratuito</span></h2>
      <p>Preencha o formulário com seus dados e a preferência de atendimento. Nossa equipe dará continuidade pelo WhatsApp para verificar a disponibilidade.</p>
      <ul className="check-list"><li><CheckCircle2/> Solicitação simples e rápida</li><li><CheckCircle2/> Confirmação pelo WhatsApp</li><li><CheckCircle2/> Atendimento sujeito à disponibilidade</li></ul>
      <p className="fine-print light">O envio do formulário não confirma automaticamente o agendamento. Consulte as condições da campanha e as informações do profissional responsável.</p>
    </div>
    <form className="exam-form" onSubmit={submit}>
      <h3>Solicite seu agendamento</h3>
      <label>Nome completo *<input name="name" value={form.name} onChange={update} required placeholder="Como podemos chamar você?"/></label>
      <label>Seu WhatsApp *<input name="phone" value={form.phone} onChange={update} required inputMode="tel" placeholder="(11) 99999-9999"/></label>
      <div className="form-row">
        <label>Data preferida<input type="date" name="date" min={new Date().toISOString().slice(0, 10)} value={form.date} onChange={update}/></label>
        <label>Horário preferido<select name="time" value={form.time} onChange={update}><option value="">A combinar</option><option>Manhã</option><option>Tarde</option><option>Noite</option></select></label>
      </div>
      <label>Observações (opcional)<textarea name="notes" value={form.notes} onChange={update} rows="3" placeholder="Escreva aqui, se necessário."/></label>
      <button className="button button-red button-full" type="submit"><CalendarDays size={17}/> Continuar pelo WhatsApp</button>
      {notice && <p className="form-notice" role="status">{notice}</p>}
      <small>Seus dados serão usados para dar continuidade à solicitação de atendimento.</small>
    </form>
  </section>;
}

function AdminPanel({ products, setProducts, onClose }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [requests, setRequests] = useState(() => {
    try { return JSON.parse(localStorage.getItem(REQUESTS_KEY) || '[]'); } catch { return []; }
  });
  const blank = { name: '', category: 'Óculos de grau', price: '', style: 'Moderno', faceShapes: ['Oval'], description: '', image: '', available: true, discountEligible: true };
  const [draft, setDraft] = useState(blank);

  // DEMONSTRAÇÃO: esta senha não protege um site publicado. Substitua por autenticação real (ex.: Supabase Auth).
  const login = (e) => {
    e.preventDefault();
    if (password === 'BellaDudaDemo2026!') { setAuthenticated(true); setError(''); }
    else setError('Senha incorreta para o modo de demonstração.');
  };
  const saveProduct = (e) => {
    e.preventDefault();
    const item = { ...draft, id: editing || `prod-${Date.now()}`, price: Number(draft.price), faceShapes: Array.isArray(draft.faceShapes) ? draft.faceShapes : [] };
    const next = editing ? products.map(p => p.id === editing ? item : p) : [item, ...products];
    setProducts(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setDraft(blank); setEditing(null);
  };
  const edit = (p) => { setEditing(p.id); setDraft({ ...p, price: String(p.price), faceShapes: p.faceShapes || [] }); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const remove = (id) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      const next = products.filter(p => p.id !== id);
      setProducts(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  };
  const updateRequest = (id, status) => {
    const next = requests.map(r => r.id === id ? { ...r, status } : r);
    setRequests(next); localStorage.setItem(REQUESTS_KEY, JSON.stringify(next));
  };
  if (!authenticated) return <div className="modal-backdrop" role="presentation"><div className="admin-modal"><button className="modal-close" onClick={onClose} aria-label="Fechar"><X/></button><div className="admin-icon"><ShieldCheck/></div><h2>Painel administrativo</h2><p>Entre para gerenciar o catálogo nesta demonstração local.</p><form onSubmit={login}><label>Senha de demonstração<input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" placeholder="Digite a senha" required/></label>{error && <p className="error-text">{error}</p>}<button className="button button-red button-full">Entrar</button></form><p className="security-warning">Demonstração local: senha embutida no código não é segura para produção. Configure autenticação real antes de publicar.</p></div></div>;
  return <div className="modal-backdrop admin-backdrop"><div className="admin-dashboard">
    <div className="admin-top"><div><span className="eyebrow">ÓTICA BELLADUDA</span><h2>Painel administrativo</h2></div><button className="icon-button" onClick={onClose} aria-label="Fechar painel"><X/></button></div>
    <div className="admin-tabs"><span>Produtos ({products.length})</span><span>Solicitações de exame ({requests.length})</span></div>
    <div className="admin-content">
      <section className="admin-card"><h3>{editing ? 'Editar produto' : 'Adicionar produto'}</h3><form onSubmit={saveProduct} className="admin-product-form">
        <label>Nome do produto<input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} required/></label>
        <div className="form-row"><label>Categoria<select value={draft.category} onChange={e => setDraft({ ...draft, category: e.target.value })}><option>Óculos de grau</option><option>Óculos de sol</option><option>Armações</option></select></label><label>Preço (R$)<input type="number" min="0" step="0.01" value={draft.price} onChange={e => setDraft({ ...draft, price: e.target.value })} required/></label></div>
        <label>URL da imagem<input type="url" value={draft.image} onChange={e => setDraft({ ...draft, image: e.target.value })} required placeholder="https://..."/></label>
        <label>Descrição<input value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} required/></label>
        <div className="form-row"><label>Estilo<select value={draft.style} onChange={e => setDraft({ ...draft, style: e.target.value })}>{['Clássico e discreto','Moderno','Elegante','Ousado e colorido'].map(s => <option key={s}>{s}</option>)}</select></label><label>Formatos de rosto<select value={(draft.faceShapes || []).join(',')} onChange={e => setDraft({ ...draft, faceShapes: e.target.value ? e.target.value.split(',') : [] })}><option value="Oval">Oval</option><option value="Redondo">Redondo</option><option value="Quadrado">Quadrado</option><option value="Coração">Coração</option><option value="Oval,Redondo,Quadrado,Coração">Todos</option></select></label></div>
        <label className="check-label"><input type="checkbox" checked={draft.available} onChange={e => setDraft({ ...draft, available: e.target.checked })}/> Disponível para consulta</label>
        <label className="check-label"><input type="checkbox" checked={draft.discountEligible} onChange={e => setDraft({ ...draft, discountEligible: e.target.checked })}/> Elegível ao desconto de primeira compra</label>
        <div className="button-row"><button className="button button-red" type="submit">{editing ? 'Salvar alterações' : <><Plus size={16}/> Adicionar produto</>}</button>{editing && <button className="button button-outline" type="button" onClick={() => { setEditing(null); setDraft(blank); }}>Cancelar</button>}</div>
      </form></section>
      <section className="admin-card"><h3>Produtos cadastrados</h3>{products.map(p => <div className="admin-product-row" key={p.id}><img src={p.image} alt=""/><div className="admin-product-name"><strong>{p.name}</strong><small>{money(p.price)} · {p.available ? 'Disponível' : 'Indisponível'}</small></div><button className="icon-button" onClick={() => edit(p)} title="Editar"><Pencil size={17}/></button><button className="icon-button danger" onClick={() => remove(p.id)} title="Excluir"><Trash2 size={17}/></button></div>)}</section>
      <section className="admin-card"><h3>Solicitações de exame</h3>{requests.length === 0 ? <p className="muted">Nenhuma solicitação salva neste navegador.</p> : requests.map(r => <div className="request-row" key={r.id}><div><strong>{r.name}</strong><small>{r.phone} · {r.date || 'Data a combinar'} · {r.time || 'Horário a combinar'}</small><small>Status: {r.status}</small></div><select value={r.status} onChange={e => updateRequest(r.id, e.target.value)}><option>Pendente</option><option>Confirmado</option><option>Concluído</option><option>Cancelado</option></select></div>)}</section>
    </div>
    <p className="security-warning">Os dados são salvos somente neste navegador. Este painel é um protótipo e não oferece autenticação segura nem sincronização entre dispositivos. Para publicar, conecte um backend e controle de acesso.</p>
  </div></div>;
}

function App() {
  const [products, setProducts] = useState(loadProducts);
  const [adminOpen, setAdminOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(products)); }, [products]);
  const catalogProducts = products.filter(p => p.available && (category === 'Todas' || p.category === category) && `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(search.toLowerCase()));
  return <>
    <Header onAdmin={() => setAdminOpen(true)}/>
    <main>
      <section className="hero" id="inicio">
        <div className="hero-content"><span className="eyebrow"><span className="red-dot"/> ÓTICA BELLADUDA · TABOÃO, DIADEMA</span><h1>Seu estilo merece<br/>um novo <span>olhar.</span></h1><p>Encontre armações que combinam com você, explore nosso catálogo e conte com atendimento próximo e personalizado.</p><div className="hero-actions"><a className="button button-red" href="#catalogo">Explorar catálogo <ArrowRight size={18}/></a><a className="button button-outline" href="#consultor"><Sparkles size={17}/> Encontre seus óculos</a></div><div className="hero-benefits"><span><CheckCircle2/> Atendimento próximo</span><span><Gift/> 10% na primeira compra*</span></div></div>
        <div className="hero-visual"><div className="hero-image-main"><img src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1100&q=85" alt="Óculos de armação moderna" /></div><div className="hero-floating-card"><span className="floating-icon"><Gift/></span><div><strong>Um presente para você</strong><small>10% de desconto na primeira compra*</small></div></div><div className="hero-decoration"/></div>
      </section>
      <section className="trust-row"><div><Glasses/><span><strong>Estilo para você</strong><small>Modelos variados</small></span></div><div><MessageCircle/><span><strong>Atendimento direto</strong><small>Fale pelo WhatsApp</small></span></div><div><MapPin/><span><strong>Perto de você</strong><small>Taboão, Diadema</small></span></div></section>
      <section className="section catalog-section" id="catalogo"><div className="section-heading section-heading-row"><div><span className="eyebrow">NOSSO CATÁLOGO</span><h2>Escolha seu próximo <span>favorito</span></h2><p>Explore os modelos e consulte disponibilidade e detalhes com nossa equipe.</p></div><a className="text-link" href={waLink('Olá! Gostaria de conhecer o catálogo completo da Ótica BellaDuda.')} target="_blank" rel="noreferrer">Pedir catálogo completo <ArrowRight size={17}/></a></div>
        <div className="catalog-controls"><div className="search-box"><Search size={18}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar armações..."/></div><div className="chip-options">{['Todas','Óculos de grau','Óculos de sol','Armações'].map(v => <button key={v} onClick={() => setCategory(v)} className={`chip ${category === v ? 'active' : ''}`}>{v}</button>)}</div></div>
        {catalogProducts.length ? <div className="product-grid">{catalogProducts.map(p => <ProductCard key={p.id} product={p}/>)}</div> : <div className="empty-state"><Search size={32}/><p>Nenhum produto encontrado. Experimente outro termo ou fale com a equipe.</p></div>}
        <p className="fine-print">*Desconto de 10% na primeira compra sujeito às condições da promoção. Confirme elegibilidade e preço final com a loja.</p>
      </section>
      <StyleFinder products={products}/>
      <VirtualTryOn/>
      <ExamSection/>
      <section className="section instagram-section"><div className="instagram-icon"><Instagram size={30}/></div><div><span className="eyebrow">ACOMPANHE NOVIDADES</span><h2>Inspiração também no <span>Instagram</span></h2><p>Veja novidades, modelos e conteúdos da Ótica BellaDuda.</p></div><a className="button button-outline" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">Seguir @oticabelladuda <ExternalLink size={16}/></a></section>
      <section className="location-section" id="localizacao"><div className="location-copy"><span className="eyebrow">VENHA NOS VISITAR</span><h2>Estamos perto de <span>você.</span></h2><p>Será um prazer receber você na Ótica BellaDuda.</p><div className="address-card"><span className="address-icon"><MapPin/></span><div><strong>Ótica BellaDuda</strong><p>{ADDRESS}</p></div></div><a className="button button-red" href={MAPS_URL} target="_blank" rel="noreferrer">Como chegar <ArrowRight size={18}/></a></div><div className="map-frame"><iframe title="Mapa da Ótica BellaDuda" src="https://maps.google.com/maps?q=Rua%20Paraguai%2C%20238%2C%20Tabo%C3%A3o%2C%20Diadema%2C%20SP&t=&z=15&ie=UTF8&iwloc=&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade"/><a href={MAPS_URL} target="_blank" rel="noreferrer" className="map-open"><MapPin size={16}/> Abrir no Google Maps</a></div></section>
      <section className="final-cta"><div><span className="eyebrow eyebrow-light">VAMOS ENCONTRAR SEU ESTILO?</span><h2>Seu próximo óculos<br/>pode estar aqui.</h2><p>Fale com nossa equipe e tire suas dúvidas.</p></div><a className="button button-white" href={waLink('Olá! Vim pelo site da Ótica BellaDuda e gostaria de atendimento.')} target="_blank" rel="noreferrer"><MessageCircle size={18}/> Conversar pelo WhatsApp</a></section>
    </main>
    <footer className="footer"><div className="footer-brand"><a className="brand brand-footer" href="#inicio"><img className="brand-logo brand-logo-footer" src="/images/logo-belladuda.png" alt="Ótica BellaDuda" /></a><p>Estilo, atendimento e cuidado em cada escolha.</p></div><div className="footer-links"><strong>Navegação</strong><a href="#catalogo">Catálogo</a><a href="#consultor">Encontre seus óculos</a><a href="#exame">Exame gratuito</a><a href="#localizacao">Localização</a></div><div className="footer-links"><strong>Contato</strong><a href={waLink('Olá! Gostaria de falar com a Ótica BellaDuda.')} target="_blank" rel="noreferrer">WhatsApp: (11) 96342-1659</a><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">@oticabelladuda</a><span>{ADDRESS}</span></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Ótica BellaDuda. Todos os direitos reservados.</span><span>Desenvolvido para uma experiência acessível e responsiva.</span></div></footer>
    <a className="floating-whatsapp" href={waLink('Olá! Vim pelo site da Ótica BellaDuda.')} target="_blank" rel="noreferrer" aria-label="Fale com a Ótica BellaDuda pelo WhatsApp"><MessageCircle size={25}/><span>Fale conosco</span></a>
    {adminOpen && <AdminPanel products={products} setProducts={setProducts} onClose={() => setAdminOpen(false)}/>}
  </>;
}

export default App;
