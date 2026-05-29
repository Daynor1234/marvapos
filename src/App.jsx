import { useState, useEffect } from "react";
import { T } from "./theme";
import { API } from "./api";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import PageRouter from "./pages/PageRouter";
import Login from "./pages/Login";

export default function App() {
  const [user,        setUser]        = useState(null);
  const [page,        setPage]        = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile,    setIsMobile]    = useState(false);
  const [loading,     setLoading]     = useState(true);
  const [dbError,     setDbError]     = useState(null);
  const [cajaAbierta, setCajaAbierta] = useState(null);

  const [products,  setProducts]  = useState([]);
  const [sales,     setSales]     = useState([]);
  const [clients,   setClients]   = useState([]);
  const [orders,    setOrders]    = useState([]);
  const [providers, setProviders] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [cajaMov,   setCajaMov]   = useState([]);
  const [users,     setUsers]     = useState([]);
  const [cats,      setCats]      = useState([]);
  const [brands,    setBrands]    = useState([]);

  const cargarDatos = async () => {
    setLoading(true);
    setDbError(null);
    try {
      const [p,s,cl,o,pr,co,ca,u,ct,br] = await Promise.all([
        API.productos.getAll(),   API.ventas.getAll(),
        API.clientes.getAll(),    API.pedidos.getAll(),
        API.proveedores.getAll(), API.compras.getAll(),
        API.caja.getAll(),        API.usuarios.getAll(),
        API.categorias.getAll(),  API.marcas.getAll(),
      ]);
      setProducts(p); setSales(s); setClients(cl); setOrders(o);
      setProviders(pr); setPurchases(co); setCajaMov(ca);
      setUsers(u); setCats(ct); setBrands(br);

      // ── Detectar turno activo ──────────────────────────
      // Un turno está activo si existe una apertura cuyo id
      // NO tiene un registro de cierre con ese turno_id
      const aperturas = ca.filter(m => m.concepto === 'Apertura de caja');
      const cierres   = ca.filter(m => m.concepto === 'Cierre de caja');
      const turnoActivo = aperturas.find(ap =>
        !cierres.some(ci => ci.turno_id === ap.id)
      );
      setCajaAbierta(turnoActivo || null);

    } catch (err) {
      setDbError('No se puede conectar con el servidor. ¿Está WAMP iniciado?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const check = () => { const m=window.innerWidth<768; setIsMobile(m); setSidebarOpen(!m); };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap';
    document.head.appendChild(link);
    const style = document.createElement('style');
    style.textContent = `
      *{box-sizing:border-box;margin:0;padding:0;}
      html,body,#root{height:100%;width:100%;overflow:hidden;}
      body,input,button,select,textarea{font-family:'Outfit',sans-serif!important;}
      ::-webkit-scrollbar{width:5px;height:5px;}
      ::-webkit-scrollbar-track{background:#F3F4F6;}
      ::-webkit-scrollbar-thumb{background:#D1D5DB;border-radius:3px;}
      ::-webkit-scrollbar-thumb:hover{background:#9CA3AF;}
      @media print { .no-print{display:none!important;} body{background:white;} }
    `;
    document.head.appendChild(style);
  }, []);

  useEffect(() => { if (user) cargarDatos(); }, [user]);

  if (!user) return <Login onLogin={setUser}/>;

  if (loading) return (
    <div style={{height:'100vh',width:'100vw',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16,background:T.bg,fontFamily:"'Outfit',sans-serif"}}>
      <div style={{background:`linear-gradient(135deg,${T.primary},#A78BFA)`,width:56,height:56,borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <span style={{color:'#fff',fontWeight:900,fontSize:26}}>M</span>
      </div>
      <p style={{color:T.muted,fontSize:14,fontWeight:600}}>Cargando datos...</p>
    </div>
  );

  if (dbError) return (
    <div style={{height:'100vh',width:'100vw',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16,background:T.bg,fontFamily:"'Outfit',sans-serif"}}>
      <p style={{color:T.red,fontSize:15,fontWeight:700}}>⚠️ {dbError}</p>
      <button onClick={cargarDatos} style={{background:T.primary,color:'#fff',border:'none',borderRadius:9,padding:'10px 24px',cursor:'pointer',fontFamily:'inherit',fontSize:14,fontWeight:700}}>
        Reintentar
      </button>
    </div>
  );

  const db = {
    products, setProducts, sales, setSales,
    clients, setClients, orders, setOrders,
    providers, setProviders, purchases, setPurchases,
    cajaMov, setCajaMov, users, setUsers,
    cats, setCats, brands, setBrands,
    cajaAbierta, setCajaAbierta,
    recargar: cargarDatos,
    user, setUser,
  };

  return (
    <div style={{display:'flex',height:'100vh',width:'100vw',overflow:'hidden',fontFamily:"'Outfit',sans-serif",background:T.bg}}>
      <Sidebar page={page} setPage={setPage} open={sidebarOpen} setOpen={setSidebarOpen} mobile={isMobile} onLogout={()=>setUser(null)} cajaAbierta={cajaAbierta}/>
      <div style={{flex:1,display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden',minWidth:0}}>
        <Header open={sidebarOpen} setOpen={setSidebarOpen} mobile={isMobile} user={user} onLogout={()=>setUser(null)} cajaAbierta={cajaAbierta} setPage={setPage}/>
        <main style={{flex:1,overflowY:'auto',overflowX:'hidden',padding:isMobile?'14px 12px':'20px 22px',minHeight:0}}>
          <PageRouter page={page} setPage={setPage} db={db}/>
        </main>
      </div>
    </div>
  );
}