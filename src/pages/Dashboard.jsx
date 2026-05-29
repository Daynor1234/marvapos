import { ShoppingBag, Users, Package, ClipboardList, DollarSign, AlertTriangle, TrendingUp } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";
import { T } from "../theme";
import { Card } from "../components/ui";
import { chartMonthly, pieColors } from "../data";

const Dashboard = ({setPage, products, sales, clients, orders, cats}) => {

  // ── Fecha real del sistema ────────────────────────────────
  const hoy = new Date().toLocaleDateString('es-BO'); // ej: "26/5/2026"
  const hoyLabel = new Date().toLocaleDateString('es-BO', {day:'2-digit',month:'2-digit',year:'numeric'});

  // ── Cálculos reales ───────────────────────────────────────
  const todaySales   = sales.filter(s => s.fecha === hoy && s.estado === 'Completada');
  const totalHoy     = todaySales.reduce((s,v) => s + parseFloat(v.total||0), 0);
  const cantHoy      = todaySales.length;

  const lowStock     = products.filter(p => p.stock <= (p.stockMin||3) && p.estado === 'Activo');
  const pendingOrders = orders.filter(o => o.estado === 'Pendiente');

  // ── Ventas del mes actual para gráfico ────────────────────
  const mesActual = new Date().getMonth();
  const ventasPorMes = Array(12).fill(0);
  sales.filter(s => s.estado === 'Completada').forEach(s => {
    const partes = s.fecha?.split('/');
    if (partes && partes.length >= 3) {
      const mes = parseInt(partes[1]) - 1;
      if (!isNaN(mes) && mes >= 0 && mes < 12) {
        ventasPorMes[mes] += parseFloat(s.total||0);
      }
    }
  });
  const chartData = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'].map((m,i) => ({
    m, v: ventasPorMes[i] > 0 ? ventasPorMes[i] : chartMonthly[i]?.v || 0
  }));

  // ── Ventas por método de pago hoy ─────────────────────────
  const efectivoHoy     = todaySales.filter(s=>s.metodo==='Efectivo').reduce((s,v)=>s+parseFloat(v.total||0),0);
  const tarjetaHoy      = todaySales.filter(s=>s.metodo!=='Efectivo').reduce((s,v)=>s+parseFloat(v.total||0),0);

  // ── Categorías con conteo real ────────────────────────────
  const catConteo = {};
  products.forEach(p => { catConteo[p.cat] = (catConteo[p.cat]||0) + 1; });
  const pieData = Object.entries(catConteo).map(([name, value]) => ({ name, value }));
  const pieColorsUse = pieData.length > 0 ? pieColors : ['#7C3AED'];

  const stats = [
    {label:'Ventas hoy',    value:`Bs.${totalHoy.toFixed(0)}`, sub:`${cantHoy} ventas`,   icon:ShoppingBag, color:T.primary, bg:T.primaryLight, page:'listado-ventas'},
    {label:'Clientes',      value:clients.length,               sub:'registrados',          icon:Users,        color:T.green,   bg:T.greenLight,   page:'cl-minoristas'},
    {label:'Productos',     value:products.length,              sub:'en inventario',        icon:Package,      color:T.orange,  bg:T.orangeLight,  page:'productos'},
    {label:'Pedidos pend.', value:pendingOrders.length,         sub:'por entregar',         icon:ClipboardList,color:T.blue,    bg:T.blueLight,    page:'pedidos-pendientes'},
  ];

  const quick = [
    {l:'Nueva Venta', p:'nueva-venta',    icon:ShoppingBag, c:T.primary},
    {l:'Productos',   p:'productos',      icon:Package,     c:T.green},
    {l:'Clientes',    p:'cl-minoristas',  icon:Users,       c:T.orange},
    {l:'Caja',        p:'apertura-caja',  icon:DollarSign,  c:T.blue},
  ];

  return (
    <div>
      {/* Fila 1: Bienvenida + Estadísticas */}
      <div style={{display:'grid',gridTemplateColumns:'minmax(220px,280px) 1fr',gap:16,marginBottom:16}}>
        <Card style={{background:`linear-gradient(135deg,${T.primary} 0%,#A78BFA 100%)`,color:'#fff',display:'flex',flexDirection:'column',justifyContent:'space-between',minHeight:140,padding:22}}>
          <div>
            <p style={{opacity:.8,fontSize:13,marginBottom:4}}>Bienvenido 👋</p>
            <h2 style={{fontSize:15,fontWeight:800,margin:0}}>Panel Principal</h2>
            <p style={{fontSize:30,fontWeight:900,marginTop:8,marginBottom:0}}>Bs.{totalHoy.toFixed(2)}</p>
            <p style={{opacity:.75,fontSize:12,marginTop:2}}>Ventas del día · {cantHoy} ventas</p>
          </div>
          <button onClick={()=>setPage('rep-ventas')} style={{background:'rgba(255,255,255,0.22)',color:'#fff',border:'1px solid rgba(255,255,255,0.4)',borderRadius:8,padding:'7px 14px',cursor:'pointer',fontFamily:'inherit',fontWeight:700,fontSize:12,width:'fit-content',marginTop:10}}>
            Ver Resumen →
          </button>
        </Card>

        <Card>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
            <h3 style={{fontSize:15,fontWeight:800,margin:0}}>Estadísticas</h3>
            <span style={{fontSize:11,color:T.muted,background:T.bg,padding:'3px 8px',borderRadius:6}}>
              Hoy · {hoyLabel}
            </span>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(100px,1fr))',gap:10}}>
            {stats.map((s,i)=>{
              const Icon=s.icon;
              return (
                <button key={i} onClick={()=>setPage(s.page)}
                  style={{borderRadius:10,background:T.bg,padding:'14px 10px',textAlign:'center',border:'none',cursor:'pointer',transition:'all 0.15s'}}
                  onMouseEnter={e=>e.currentTarget.style.background=s.bg}
                  onMouseLeave={e=>e.currentTarget.style.background=T.bg}>
                  <div style={{background:s.bg,borderRadius:8,width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 8px'}}>
                    <Icon size={17} color={s.color}/>
                  </div>
                  <p style={{fontSize:18,fontWeight:900,color:T.text,margin:0}}>{s.value}</p>
                  <p style={{fontSize:11,color:T.muted,margin:'2px 0 0'}}>{s.label}</p>
                  <p style={{fontSize:10,color:s.color,margin:'1px 0 0',fontWeight:600}}>{s.sub}</p>
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Fila 2: Métricas + Gráfico */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 2fr',gap:16,marginBottom:16}}>
        <Card style={{padding:16}}>
          <p style={{fontSize:12,fontWeight:600,color:T.muted,margin:'0 0 2px'}}>Efectivo hoy</p>
          <p style={{fontSize:22,fontWeight:900,color:T.text,margin:0}}>Bs.{efectivoHoy.toFixed(0)}</p>
          <p style={{fontSize:10,color:T.green,margin:'2px 0 10px',fontWeight:600}}>
            {cantHoy > 0 ? `${todaySales.filter(s=>s.metodo==='Efectivo').length} ventas` : 'Sin ventas hoy'}
          </p>
          <ResponsiveContainer width="100%" height={50}>
            <AreaChart data={chartData.slice(-5)}>
              <defs><linearGradient id="go" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.orange} stopOpacity={0.3}/><stop offset="95%" stopColor={T.orange} stopOpacity={0}/></linearGradient></defs>
              <Area type="monotone" dataKey="v" stroke={T.orange} strokeWidth={2} fill="url(#go)" dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card style={{padding:16}}>
          <p style={{fontSize:12,fontWeight:600,color:T.muted,margin:'0 0 2px'}}>Tarjeta/Transf. hoy</p>
          <p style={{fontSize:22,fontWeight:900,color:T.text,margin:0}}>Bs.{tarjetaHoy.toFixed(0)}</p>
          <p style={{fontSize:10,color:T.primary,margin:'2px 0 10px',fontWeight:600}}>
            {cantHoy > 0 ? `${todaySales.filter(s=>s.metodo!=='Efectivo').length} ventas` : 'Sin ventas hoy'}
          </p>
          <ResponsiveContainer width="100%" height={50}>
            <AreaChart data={chartData.slice(-5)}>
              <defs><linearGradient id="gp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.primary} stopOpacity={0.3}/><stop offset="95%" stopColor={T.primary} stopOpacity={0}/></linearGradient></defs>
              <Area type="monotone" dataKey="v" stroke={T.primary} strokeWidth={2} fill="url(#gp)" dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <h4 style={{fontSize:14,fontWeight:800,margin:0}}>Ventas Mensuales</h4>
            <span style={{fontSize:11,color:T.muted}}>{new Date().getFullYear()}</span>
          </div>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border}/>
              <XAxis dataKey="m" tick={{fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10}} axisLine={false} tickLine={false} width={35}/>
              <Tooltip contentStyle={{fontFamily:'inherit',fontSize:11}} formatter={v=>`Bs.${v.toLocaleString()}`}/>
              <Bar dataKey="v" fill={T.primary} radius={[4,4,0,0]} maxBarSize={28}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Fila 3: Stock bajo + Categorías + Accesos rápidos */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16}}>
        <Card style={{padding:16}}>
          <h4 style={{fontSize:14,fontWeight:800,margin:'0 0 12px',display:'flex',alignItems:'center',gap:6,color:lowStock.length>0?T.orange:T.green}}>
            {lowStock.length>0?<AlertTriangle size={14}/>:<TrendingUp size={14}/>}
            {lowStock.length>0 ? `Stock Bajo (${lowStock.length})` : 'Stock OK'}
          </h4>
          {lowStock.length === 0 && (
            <p style={{fontSize:12,color:T.muted}}>Todos los productos tienen stock suficiente.</p>
          )}
          {lowStock.slice(0,5).map(p=>(
            <div key={p.id} style={{display:'flex',justifyContent:'space-between',marginBottom:6,fontSize:12,alignItems:'center'}}>
              <span style={{color:T.text,fontWeight:500,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:140}}>{p.nombre}</span>
              <span style={{color:p.stock===0?T.red:T.orange,fontWeight:700,flexShrink:0,marginLeft:8}}>{p.stock} ud.</span>
            </div>
          ))}
          {lowStock.length > 5 && <p style={{fontSize:11,color:T.muted,margin:'6px 0 0'}}>+{lowStock.length-5} más...</p>}
        </Card>

        <Card style={{padding:16}}>
          <h4 style={{fontSize:14,fontWeight:800,margin:'0 0 10px'}}>Por Categoría</h4>
          {pieData.length === 0 ? (
            <p style={{fontSize:12,color:T.muted}}>Sin productos registrados.</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={110}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={28} outerRadius={48} dataKey="value" paddingAngle={2}>
                    {pieData.map((_,i)=><Cell key={i} fill={pieColorsUse[i%pieColorsUse.length]}/>)}
                  </Pie>
                  <Tooltip contentStyle={{fontFamily:'inherit',fontSize:11}} formatter={(v,_,p)=>[`${v} productos`,p.payload.name]}/>
                </PieChart>
              </ResponsiveContainer>
              <div style={{display:'flex',flexWrap:'wrap',gap:'4px 10px',marginTop:4}}>
                {pieData.map((d,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:4,fontSize:10,color:T.muted}}>
                    <span style={{width:7,height:7,borderRadius:'50%',background:pieColorsUse[i%pieColorsUse.length],display:'inline-block',flexShrink:0}}/>
                    {d.name} ({d.value})
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>

        <Card style={{padding:16}}>
          <h4 style={{fontSize:14,fontWeight:800,margin:'0 0 10px'}}>Accesos Rápidos</h4>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            {quick.map((a,i)=>{
              const Icon=a.icon;
              return (
                <button key={i} onClick={()=>setPage(a.p)}
                  style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:9,padding:'12px 6px',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:6,transition:'all 0.15s',fontFamily:'inherit'}}
                  onMouseEnter={e=>{e.currentTarget.style.background=T.primaryLight;e.currentTarget.style.borderColor=T.primary;}}
                  onMouseLeave={e=>{e.currentTarget.style.background=T.bg;e.currentTarget.style.borderColor=T.border;}}>
                  <Icon size={18} color={a.c}/>
                  <span style={{fontSize:11,fontWeight:600,color:T.text}}>{a.l}</span>
                </button>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;