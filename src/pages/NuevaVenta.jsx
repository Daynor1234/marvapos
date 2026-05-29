import { useState } from "react";
import { Package, Search, CheckCircle, Trash2, User, Printer, ChevronLeft } from "lucide-react";
import { T, genId } from "../theme";
import { PageHeader, SInput, Btn } from "../components/ui";
import { registrarVenta } from "../api";

// ── Categorías deportivas ────────────────────────────────────
const CATS = [
  { id: 'todos',      label: 'Todos',               emoji: '🛍️',  color: '#7C3AED', bg: '#EDE9FE' },
  { id: 'tenis',      label: 'Tenis deportivos',    emoji: '👟',  color: '#2563EB', bg: '#DBEAFE' },
  { id: 'cachos',     label: 'Cachos',              emoji: '⚽',  color: '#DC2626', bg: '#FEE2E2' },
  { id: 'poleras',    label: 'Poleras deportivas',  emoji: '👕',  color: '#059669', bg: '#D1FAE5' },
  { id: 'shorts',     label: 'Shorts deportivos',   emoji: '🩳',  color: '#D97706', bg: '#FEF3C7' },
  { id: 'buzos',      label: 'Buzos deportivos',    emoji: '🧤',  color: '#0891B2', bg: '#CFFAFE' },
  { id: 'chaquetas',  label: 'Chaquetas deportivas',emoji: '🧥',  color: '#4F46E5', bg: '#E0E7FF' },
  { id: 'medias',     label: 'Medias deportivas',   emoji: '🧦',  color: '#BE185D', bg: '#FCE7F3' },
  { id: 'accesorios', label: 'Accesorios deportivos',emoji: '🎒', color: '#B45309', bg: '#FEF3C7' },
  { id: 'balones',    label: 'Balones deportivos',  emoji: '🏈',  color: '#15803D', bg: '#DCFCE7' },
];

// Mapa de categoría BD → id de CATS
const catMatch = (cat = '', catId) => {
  if (catId === 'todos') return true;
  const c = cat.toLowerCase();
  const map = {
    tenis:      ['tenis'],
    cachos:     ['cacho', 'cachos'],
    poleras:    ['polera', 'camiseta', 'polo'],
    shorts:     ['short', 'bermuda'],
    buzos:      ['buzo', 'pants'],
    chaquetas:  ['chaqueta', 'jacket'],
    medias:     ['media', 'calceta'],
    accesorios: ['accesorio'],
    balones:    ['balon', 'balón', 'pelota'],
  };
  return (map[catId] || []).some(k => c.includes(k));
};

// ── Impresión de factura ─────────────────────────────────────
const imprimirFactura = (venta, items) => {
  const lineas = (items || []).map(item =>
    `<div style="margin-bottom:6px">
      <p style="margin:0;font-weight:600">${item.nombre}</p>
      <div style="display:flex;justify-content:space-between;font-size:11px">
        <span>${item.qty} x Bs.${parseFloat(item.precio).toFixed(2)}</span>
        <span><b>Bs.${(item.qty * item.precio).toFixed(2)}</b></span>
      </div>
    </div>`
  ).join('');
  const sub  = parseFloat(venta.subtotal || venta.total || 0);
  const desc = parseFloat(venta.descuento || 0);
  const imp  = parseFloat(venta.impuesto || sub * 0.13 || 0);
  const tot  = parseFloat(venta.total || 0);
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
    <style>
      body{font-family:'Courier New',monospace;font-size:12px;width:80mm;margin:0 auto;padding:10px;color:#000}
      .center{text-align:center} .sep{border-top:1px dashed #000;margin:6px 0;padding-top:6px}
      .row{display:flex;justify-content:space-between;margin-bottom:3px}
      .total{font-weight:900;font-size:15px}
    </style></head><body>
    <div class="center">
      <p style="font-weight:900;font-size:16px;margin:0">MARVA POS</p>
      <p style="margin:2px 0">Cochabamba, Bolivia</p>
      <p style="margin:2px 0;font-weight:700">FACTURA</p>
      <p style="margin:2px 0">Nro: ${venta.id}</p>
      <p style="margin:2px 0;font-size:11px">${venta.fecha} ${new Date().toLocaleTimeString('es-BO')}</p>
    </div>
    <div class="sep">
      <p style="margin:2px 0">Cliente: <b>${venta.cliente || 'Consumidor Final'}</b></p>
      <p style="margin:2px 0">Método: ${venta.metodo || 'Efectivo'}</p>
    </div>
    <div class="sep">
      <div class="row" style="font-weight:700"><span>PRODUCTO</span><span>SUBTOTAL</span></div>
      ${lineas}
    </div>
    <div class="sep">
      <div class="row"><span>Subtotal:</span><span>Bs.${sub.toFixed(2)}</span></div>
      ${desc > 0 ? `<div class="row" style="color:red"><span>Descuento:</span><span>-Bs.${desc.toFixed(2)}</span></div>` : ''}
      <div class="row"><span>IT 13%:</span><span>Bs.${imp.toFixed(2)}</span></div>
      <div class="row total"><span>TOTAL:</span><span>Bs.${tot.toFixed(2)}</span></div>
    </div>
    <div class="sep center">
      <p style="margin:2px 0">¡Gracias por su compra!</p>
      <p style="margin:2px 0">Conserve su factura</p>
    </div>
    <script>window.onload=()=>{window.print();setTimeout(()=>window.close(),500)}</script>
    </body></html>`;
  const w = window.open('', '_blank', 'width=400,height=600');
  if (w) { w.document.write(html); w.document.close(); }
};

const NuevaVenta = ({ products, setProducts, sales, setSales, cajaAbierta, user }) => {
  const [search,      setSearch]      = useState('');
  const [catActiva,   setCatActiva]   = useState('todos');
  const [vistaPreCat, setVistaPreCat] = useState(true);
  const [cart,        setCart]        = useState([]);
  const [discount,    setDiscount]    = useState(0);
  const [payment,     setPayment]     = useState('Efectivo');
  const [clientName,  setClientName]  = useState('');
  const [success,     setSuccess]     = useState(null);
  const [saving,      setSaving]      = useState(false);
  const [facturaData, setFacturaData] = useState(null);

  const available = products.filter(p =>
    p.stock > 0 && p.estado === 'Activo' &&
    catMatch(p.cat, catActiva) &&
    (search === '' || p.nombre.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()))
  );

  const addToCart = p => setCart(prev => {
    const ex = prev.find(c => c.id === p.id);
    if (ex) return prev.map(c => c.id === p.id ? { ...c, qty: Math.min(c.qty + 1, p.stock) } : c);
    return [...prev, { ...p, precio: parseFloat(p.precio || 0), qty: 1 }];
  });
  const removeFromCart = id => setCart(prev => prev.filter(c => c.id !== id));
  const updateQty = (id, qty) => setCart(prev => qty < 1 ? prev.filter(c => c.id !== id) : prev.map(c => c.id === id ? { ...c, qty } : c));

  const subtotal = cart.reduce((s, c) => s + parseFloat(c.precio || 0) * (c.qty || 0), 0);
  const discPct  = parseFloat(discount) || 0;
  const discAmt  = subtotal * (discPct / 100);
  const impuesto = (subtotal - discAmt) * 0.13;
  const total    = subtotal - discAmt;

  const handleSell = async () => {
    if (cart.length === 0) return;
    if (!cajaAbierta) { alert('⚠️ Debes abrir la caja antes de realizar ventas.'); return; }
    setSaving(true);
    const fecha = new Date().toLocaleDateString('es-BO');
    const id    = genId('V');
    const ventaData = {
      id, fecha,
      cliente:   clientName || 'Cliente general',
      items:     cart.reduce((s, c) => s + c.qty, 0),
      subtotal, descuento: discAmt, impuesto, total,
      estado:   'Completada',
      metodo:    payment,
    };
    try {
      const ventaBD = { id, fecha, cliente: ventaData.cliente, items: ventaData.items, total, estado: 'Completada', metodo: payment };
      await registrarVenta(ventaBD, cart.map(c => ({ id: c.id, qty: c.qty })));
      setSales(prev => [{ id, fecha, cliente: ventaData.cliente, items: ventaData.items, total, estado: 'Completada', metodo: payment }, ...prev]);
      setProducts(prev => prev.map(p => { const ci = cart.find(c => c.id === p.id); return ci ? { ...p, stock: p.stock - ci.qty } : p; }));
      setFacturaData({ venta: ventaData, items: [...cart] });
      setSuccess(ventaData);
      setCart([]);
    } catch (err) {
      alert('Error al registrar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => { if (facturaData) imprimirFactura(facturaData.venta, facturaData.items); };

  // ── Pantalla de éxito ─────────────────────────────────────
  if (success) {
    const itms = facturaData?.items || [];
    const tot  = parseFloat(success.total || 0);
    const sub  = parseFloat(success.subtotal || tot);
    const desc = parseFloat(success.descuento || 0);
    const imp  = parseFloat(success.impuesto || tot * 0.13);
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'30px 16px', gap:16 }}>
        <div style={{ background:T.greenLight, borderRadius:'50%', width:72, height:72, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <CheckCircle size={36} color={T.green} />
        </div>
        <h2 style={{ color:T.text, margin:0, fontWeight:800 }}>¡Venta registrada!</h2>
        <p style={{ color:T.muted, margin:0 }}>
          {success.id} · <strong style={{ color:T.text }}>Bs.{tot.toFixed(2)}</strong> · {success.metodo}
        </p>
        <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
          <Btn icon={Printer} onClick={handlePrint}>Imprimir Factura</Btn>
          <Btn variant="secondary" onClick={() => { setSuccess(null); setFacturaData(null); setDiscount(0); setClientName(''); }}>
            Nueva Venta
          </Btn>
        </div>
        <div style={{ background:'#fff', border:`1px solid ${T.border}`, borderRadius:12, padding:20, maxWidth:340, width:'100%', fontFamily:"'Courier New',monospace", fontSize:12 }}>
          <div style={{ textAlign:'center', borderBottom:`1px dashed ${T.border}`, paddingBottom:8, marginBottom:8 }}>
            <p style={{ fontWeight:900, fontSize:14, margin:0 }}>MARVA POS</p>
            <p style={{ margin:'2px 0', color:T.muted }}>FACTURA · Nro: {success.id}</p>
            <p style={{ margin:'2px 0', color:T.muted, fontSize:11 }}>{success.fecha}</p>
          </div>
          <p style={{ margin:'2px 0' }}>Cliente: <strong>{success.cliente}</strong></p>
          <p style={{ margin:'2px 0 8px' }}>Método: {success.metodo}</p>
          <div style={{ borderTop:`1px dashed ${T.border}`, paddingTop:8, marginBottom:8 }}>
            {itms.map((item, i) => (
              <div key={i} style={{ marginBottom:4 }}>
                <p style={{ margin:0, fontWeight:600 }}>{item.nombre}</p>
                <div style={{ display:'flex', justifyContent:'space-between', color:T.muted, fontSize:11 }}>
                  <span>{item.qty} × Bs.{parseFloat(item.precio || 0).toFixed(2)}</span>
                  <span style={{ color:T.text, fontWeight:700 }}>Bs.{(item.qty * parseFloat(item.precio || 0)).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop:`1px dashed ${T.border}`, paddingTop:8 }}>
            <div style={{ display:'flex', justifyContent:'space-between', color:T.muted, fontSize:11, marginBottom:3 }}><span>Subtotal:</span><span>Bs.{sub.toFixed(2)}</span></div>
            {desc > 0 && <div style={{ display:'flex', justifyContent:'space-between', color:T.red, fontSize:11, marginBottom:3 }}><span>Descuento:</span><span>-Bs.{desc.toFixed(2)}</span></div>}
            <div style={{ display:'flex', justifyContent:'space-between', color:T.muted, fontSize:11, marginBottom:3 }}><span>IT 13%:</span><span>Bs.{imp.toFixed(2)}</span></div>
            <div style={{ display:'flex', justifyContent:'space-between', fontWeight:900, fontSize:15, marginTop:6, color:T.primary }}><span>TOTAL:</span><span>Bs.{tot.toFixed(2)}</span></div>
          </div>
          <p style={{ textAlign:'center', color:T.muted, fontSize:11, marginTop:10 }}>¡Gracias por su compra!</p>
        </div>
      </div>
    );
  }

  // ── Alerta caja cerrada ───────────────────────────────────
  if (!cajaAbierta) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'60vh', gap:16 }}>
      <div style={{ background:T.orangeLight, borderRadius:'50%', width:80, height:80, display:'flex', alignItems:'center', justifyContent:'center', fontSize:36 }}>🔒</div>
      <h2 style={{ color:T.text, margin:0, fontWeight:800 }}>Caja cerrada</h2>
      <p style={{ color:T.muted, margin:0, textAlign:'center', maxWidth:320 }}>
        Debes abrir la caja antes de realizar ventas. Ve a <strong>Caja → Apertura</strong>.
      </p>
    </div>
  );

  // ── Vista 1: Selector de categorías ──────────────────────
  if (vistaPreCat) return (
    <div>
      <PageHeader title="Nueva Venta" subtitle="Selecciona una categoría para comenzar" />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:14 }}>
        {CATS.map(cat => (
          <button key={cat.id} onClick={() => { setCatActiva(cat.id); setVistaPreCat(false); }}
            style={{ background:T.white, border:`2px solid ${T.border}`, borderRadius:14, padding:'20px 12px', cursor:'pointer', textAlign:'center', transition:'all 0.18s', fontFamily:'inherit', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color; e.currentTarget.style.background = cat.bg; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.10)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = T.white; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; }}>
            <div style={{ width:52, height:52, borderRadius:14, background:cat.bg, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', border:`1.5px solid ${cat.color}33`, fontSize:26 }}>
              {cat.emoji}
            </div>
            <p style={{ fontSize:12, fontWeight:700, color:T.text, margin:0, lineHeight:1.3 }}>{cat.label}</p>
          </button>
        ))}
      </div>
    </div>
  );

  // ── Vista 2: POS con productos ────────────────────────────
  const catInfo = CATS.find(c => c.id === catActiva);
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <button onClick={() => setVistaPreCat(true)} style={{ background:'none', border:`1px solid ${T.border}`, borderRadius:8, padding:'6px 12px', cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontSize:13, color:T.muted, fontFamily:'inherit' }}>
          <ChevronLeft size={15} /> Categorías
        </button>
        {catInfo && (
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:34, height:34, borderRadius:9, background:catInfo.bg, display:'flex', alignItems:'center', justifyContent:'center', border:`1.5px solid ${catInfo.color}33`, fontSize:20 }}>
              {catInfo.emoji}
            </div>
            <h2 style={{ margin:0, fontSize:16, fontWeight:800, color:T.text }}>{catInfo.label}</h2>
          </div>
        )}
      </div>

      {/* Layout: productos a la izquierda, carrito a la derecha */}
      <div style={{ display:'flex', flexDirection:'row', gap:14, alignItems:'flex-start' }}>
        {/* Productos — ocupa el espacio disponible */}
        <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:10 }}>
          <SInput placeholder="Buscar producto…" value={search} onChange={e => setSearch(e.target.value)} icon={Search} />
          {/* Tabs rápidos */}
          <div style={{ display:'flex', gap:6, overflowX:'auto', paddingBottom:4 }}>
            {CATS.map(c => (
              <button key={c.id} onClick={() => setCatActiva(c.id)}
                style={{ flexShrink:0, padding:'5px 12px', borderRadius:20, border:`1px solid ${catActiva === c.id ? T.primary : T.border}`, background:catActiva === c.id ? T.primary : '#fff', color:catActiva === c.id ? '#fff' : T.muted, cursor:'pointer', fontSize:11, fontFamily:'inherit', fontWeight:600, display:'flex', alignItems:'center', gap:5 }}>
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
          <div style={{ background:T.white, borderRadius:12, padding:14, boxShadow:T.shadow, overflowY:'auto', maxHeight:'calc(100vh - 220px)' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))', gap:10 }}>
              {available.map(p => (
                <button key={p.id} onClick={() => addToCart(p)}
                  style={{ background:T.bg, border:`1px solid ${T.border}`, borderRadius:10, padding:10, cursor:'pointer', textAlign:'left', transition:'all 0.15s', fontFamily:'inherit' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = T.primary; e.currentTarget.style.background = T.primaryLight; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = T.bg; }}>
                  <div style={{ background:T.primaryLight, borderRadius:7, height:60, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:8, overflow:'hidden' }}>
                    {p.foto ? <img src={p.foto} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt={p.nombre} /> : <Package size={20} color={T.primary} />}
                  </div>
                  <p style={{ fontSize:11, fontWeight:700, color:T.text, margin:'0 0 2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.nombre}</p>
                  <p style={{ fontSize:10, color:T.muted, margin:'0 0 4px' }}>{p.marca}</p>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:12, fontWeight:800, color:T.primary }}>Bs.{parseFloat(p.precio).toFixed(2)}</span>
                    <span style={{ fontSize:10, color:p.stock <= 3 ? T.orange : T.muted }}>×{p.stock}</span>
                  </div>
                </button>
              ))}
              {available.length === 0 && <div style={{ gridColumn:'1/-1', textAlign:'center', padding:40, color:T.muted, fontSize:13 }}>Sin productos en esta categoría</div>}
            </div>
          </div>
        </div>

        {/* Carrito — ancho fijo a la derecha */}
        <div style={{ width:300, flexShrink:0, background:T.white, borderRadius:12, boxShadow:T.shadow, display:'flex', flexDirection:'column', position:'sticky', top:0 }}>
          <div style={{ padding:'12px 16px', borderBottom:`1px solid ${T.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <h3 style={{ margin:0, fontSize:14, fontWeight:800 }}>Carrito</h3>
            <span style={{ background:T.primaryLight, color:T.primary, borderRadius:20, padding:'2px 10px', fontSize:11, fontWeight:700 }}>{cart.reduce((s, c) => s + c.qty, 0)} items</span>
          </div>
          <div style={{ padding:'8px 14px', borderBottom:`1px solid ${T.border}` }}>
            <SInput placeholder="Cliente (opcional)" value={clientName} onChange={e => setClientName(e.target.value)} icon={User} />
          </div>
          {/* Lista de items con scroll si crece mucho */}
          <div style={{ overflowY:'auto', maxHeight:260, padding:'8px 14px' }}>
            {cart.length === 0 && <div style={{ textAlign:'center', padding:'20px 0', color:T.muted, fontSize:13 }}>El carrito está vacío</div>}
            {cart.map(item => (
              <div key={item.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 0', borderBottom:`1px solid ${T.border}` }}>
                <div style={{ background:T.primaryLight, borderRadius:6, width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, overflow:'hidden' }}>
                  {item.foto ? <img src={item.foto} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt={item.nombre} /> : <Package size={13} color={T.primary} />}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:11, fontWeight:700, margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.nombre}</p>
                  <p style={{ fontSize:10, color:T.muted, margin:'1px 0 0' }}>Bs.{parseFloat(item.precio).toFixed(2)} c/u</p>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:3 }}>
                  <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ width:22, height:22, border:`1px solid ${T.border}`, borderRadius:4, cursor:'pointer', background:T.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>−</button>
                  <span style={{ width:24, textAlign:'center', fontSize:12, fontWeight:700 }}>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ width:22, height:22, border:`1px solid ${T.border}`, borderRadius:4, cursor:'pointer', background:T.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>+</button>
                </div>
                <div style={{ textAlign:'right', minWidth:54 }}>
                  <p style={{ fontSize:12, fontWeight:800, color:T.text, margin:0 }}>Bs.{(item.precio * item.qty).toFixed(2)}</p>
                  <button onClick={() => removeFromCart(item.id)} style={{ background:'none', border:'none', cursor:'pointer', color:T.red, padding:0, display:'flex', alignItems:'center', justifyContent:'flex-end', width:'100%' }}><Trash2 size={11} /></button>
                </div>
              </div>
            ))}
          </div>
          {/* Totales y pago */}
          <div style={{ padding:'12px 14px', borderTop:`1px solid ${T.border}`, background:'#FAFAFA', borderRadius:'0 0 12px 12px' }}>
            {[['Subtotal', `Bs.${subtotal.toFixed(2)}`], ['IT 13%', `Bs.${impuesto.toFixed(2)}`]].map(([l, v], i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:T.muted, marginBottom:4 }}>
                <span>{l}</span><span style={{ color:T.text, fontWeight:600 }}>{v}</span>
              </div>
            ))}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:12, marginBottom:8 }}>
              <span style={{ color:T.muted }}>Descuento %</span>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <input type="number" value={discount} onChange={e => setDiscount(e.target.value === '' ? 0 : Math.min(100, Math.max(0, Number(e.target.value))))}
                  style={{ width:46, padding:'3px 6px', border:`1px solid ${T.border}`, borderRadius:5, fontSize:12, textAlign:'center', fontFamily:'inherit', outline:'none' }} />
                {discAmt > 0 && <span style={{ fontSize:11, color:T.red }}>-Bs.{discAmt.toFixed(2)}</span>}
              </div>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:17, fontWeight:900, padding:'8px 0 10px', borderTop:`1px solid ${T.border}` }}>
              <span>TOTAL</span><span style={{ color:T.primary }}>Bs.{total.toFixed(2)}</span>
            </div>
            <div style={{ display:'flex', gap:6, marginBottom:10 }}>
              {['Efectivo', 'Tarjeta', 'Transferencia'].map(m => (
                <button key={m} onClick={() => setPayment(m)} style={{ flex:1, padding:'7px 4px', borderRadius:8, border:`1.5px solid ${payment === m ? T.primary : T.border}`, background:payment === m ? T.primaryLight : '#fff', color:payment === m ? T.primary : T.muted, cursor:'pointer', fontSize:11, fontFamily:'inherit', fontWeight:700 }}>
                  {m}
                </button>
              ))}
            </div>
            <button onClick={handleSell} disabled={cart.length === 0 || saving}
              style={{ width:'100%', background:cart.length === 0 ? T.border : T.primary, color:'#fff', border:'none', borderRadius:10, padding:'12px', cursor:cart.length === 0 ? 'not-allowed' : 'pointer', fontFamily:'inherit', fontSize:15, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}
              onMouseEnter={e => { if (cart.length > 0) e.currentTarget.style.background = T.primaryHover; }}
              onMouseLeave={e => { if (cart.length > 0) e.currentTarget.style.background = T.primary; }}>
              <CheckCircle size={17} />{saving ? 'Registrando...' : 'Registrar Venta'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NuevaVenta;