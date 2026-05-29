import { useState, useEffect } from "react";
import {
  LayoutDashboard, ShoppingBag, ClipboardList, Package, Truck,
  Users, Building2, DollarSign, BarChart3, Settings,
  ChevronRight, ChevronDown, User, LogOut, X
} from "lucide-react";
import { T } from "../theme";

const ICON_MAP = { LayoutDashboard, ShoppingBag, ClipboardList, Package, Truck, Users, Building2, DollarSign, BarChart3, Settings };

const MENU = [
  {id:'dashboard',label:'Principal',icon:'LayoutDashboard',page:'dashboard'},
  {id:'ventas',label:'Ventas',icon:'ShoppingBag',children:[
    {id:'nueva-venta',label:'Nueva venta',page:'nueva-venta'},
    {id:'listado-ventas',label:'Listado de ventas',page:'listado-ventas'},
    {id:'cotizaciones',label:'Cotizaciones',page:'cotizaciones'},
    {id:'devoluciones',label:'Devoluciones',page:'devoluciones'},
    {id:'ventas-anuladas',label:'Ventas anuladas',page:'ventas-anuladas'},
  ]},
  {id:'pedidos',label:'Pedidos',icon:'ClipboardList',children:[
    {id:'nuevo-pedido',label:'Nuevo pedido',page:'nuevo-pedido'},
    {id:'pedidos-pendientes',label:'Pendientes',page:'pedidos-pendientes'},
    {id:'pedidos-entregados',label:'Entregados',page:'pedidos-entregados'},
    {id:'pedidos-cancelados',label:'Cancelados',page:'pedidos-cancelados'},
  ]},
  {id:'inventario',label:'Inventario',icon:'Package',children:[
    {id:'productos',label:'Productos',page:'productos'},
    {id:'categorias',label:'Categorías',page:'categorias'},
    {id:'marcas',label:'Marcas',page:'marcas'},
    {id:'tallas',label:'Tallas',page:'tallas'},
    {id:'colores',label:'Colores',page:'colores'},
    {id:'entradas',label:'Entradas',page:'entradas'},
    {id:'kardex',label:'Kardex',page:'kardex'},
    {id:'por-agotarse',label:'Por agotarse',page:'por-agotarse'},
  ]},
  {id:'compras',label:'Compras',icon:'Truck',children:[
    {id:'nueva-compra',label:'Nueva compra',page:'nueva-compra'},
    {id:'historial-compras',label:'Historial',page:'historial-compras'},
  ]},
  {id:'clientes',label:'Clientes',icon:'Users',children:[
    {id:'cl-minoristas',label:'Minoristas',page:'cl-minoristas'},
    {id:'cl-mayoristas',label:'Mayoristas',page:'cl-mayoristas'},
  ]},
  {id:'proveedores',label:'Proveedores',icon:'Building2',page:'proveedores'},
  {id:'caja',label:'Caja',icon:'DollarSign',children:[
    {id:'apertura-caja',label:'Apertura',page:'apertura-caja'},
    {id:'cierre-caja',label:'Cierre',page:'cierre-caja'},
    {id:'movimientos',label:'Movimientos',page:'movimientos'},
  ]},
  {id:'reportes',label:'Reportes',icon:'BarChart3',children:[
    {id:'rep-ventas',label:'Ventas',page:'rep-ventas'},
    {id:'rep-inventario',label:'Inventario',page:'rep-inventario'},
    {id:'rep-pedidos',label:'Pedidos',page:'rep-pedidos'},
    {id:'rep-compras',label:'Compras',page:'rep-compras'},
    {id:'rep-ganancias',label:'Ganancias',page:'rep-ganancias'},
  ]},
  {id:'admin',label:'Administración',icon:'Settings',children:[
    {id:'usuarios',label:'Usuarios',page:'usuarios'},
    {id:'roles',label:'Roles',page:'roles'},
    {id:'configuracion',label:'Configuración',page:'configuracion'},
  ]},
];

const Sidebar = ({page,setPage,open,setOpen,mobile,onLogout}) => {
  const [exp,setExp] = useState({});
  const toggle = id => setExp(p=>({...p,[id]:!p[id]}));
  const active = item => item.page===page||(item.children&&item.children.some(c=>c.page===page));

  useEffect(()=>{
    MENU.forEach(item=>{
      if(item.children&&item.children.some(c=>c.page===page)){
        setExp(p=>({...p,[item.id]:true}));
      }
    });
  },[page]);

  const handleNav = (p) => { setPage(p); if(mobile) setOpen(false); };
  if(!open) return null;

  return (
    <>
      {mobile&&open&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',zIndex:98}} onClick={()=>setOpen(false)}/>}
      <div style={{
        width:242,minWidth:242,height:'100vh',background:T.white,borderRight:`1px solid ${T.border}`,
        display:'flex',flexDirection:'column',flexShrink:0,zIndex:99,
        ...(mobile?{position:'fixed',left:0,top:0,boxShadow:T.shadowMd}:{})
      }}>
        <div style={{padding:'16px 18px',borderBottom:`1px solid ${T.border}`,display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
          <div style={{background:`linear-gradient(135deg,${T.primary},#A78BFA)`,color:'#fff',borderRadius:9,width:34,height:34,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:17,flexShrink:0}}>M</div>
          <div style={{flex:1}}>
            <p style={{fontWeight:800,fontSize:15,color:T.text,margin:0}}>ActiveZone </p>
            <p style={{fontSize:10,color:T.muted,margin:0}}>Sistema dE Ventas ActiveZone</p>
          </div>
          {mobile&&<button onClick={()=>setOpen(false)} style={{background:'none',border:'none',cursor:'pointer',color:T.muted,padding:4}}><X size={18}/></button>}
        </div>
        <nav style={{flex:1,overflowY:'auto',padding:'10px 8px'}}>
          <p style={{fontSize:10,fontWeight:700,color:T.muted,padding:'4px 10px 8px',letterSpacing:'0.08em',textTransform:'uppercase'}}>Menú</p>
          {MENU.map(item=>{
            const Icon = ICON_MAP[item.icon];
            const isAct = active(item);
            if(!item.children){
              return (
                <button key={item.id} onClick={()=>handleNav(item.page)}
                  style={{width:'100%',display:'flex',alignItems:'center',gap:9,padding:'9px 12px',border:'none',borderRadius:8,background:isAct?T.primary:'transparent',color:isAct?'#fff':T.text,cursor:'pointer',fontFamily:'inherit',fontSize:13,fontWeight:isAct?700:500,marginBottom:1,textAlign:'left'}}
                  onMouseEnter={e=>{if(!isAct){e.currentTarget.style.background=T.primaryLight;e.currentTarget.style.color=T.primary;}}}
                  onMouseLeave={e=>{if(!isAct){e.currentTarget.style.background='transparent';e.currentTarget.style.color=T.text;}}}>
                  <Icon size={15}/><span>{item.label}</span>
                </button>
              );
            }
            return (
              <div key={item.id} style={{marginBottom:1}}>
                <button onClick={()=>toggle(item.id)}
                  style={{width:'100%',display:'flex',alignItems:'center',gap:9,padding:'9px 12px',border:'none',borderRadius:8,background:'transparent',color:isAct?T.primary:T.text,cursor:'pointer',fontFamily:'inherit',fontSize:13,fontWeight:isAct?700:500,textAlign:'left'}}
                  onMouseEnter={e=>{e.currentTarget.style.background=T.primaryLight;e.currentTarget.style.color=T.primary;}}
                  onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color=isAct?T.primary:T.text;}}>
                  <Icon size={15}/><span style={{flex:1}}>{item.label}</span>
                  {exp[item.id]?<ChevronDown size={13}/>:<ChevronRight size={13}/>}
                </button>
                {exp[item.id]&&(
                  <div style={{marginLeft:14,paddingLeft:10,borderLeft:`2px solid ${T.border}`,marginBottom:2}}>
                    {item.children.map(ch=>(
                      <button key={ch.id} onClick={()=>handleNav(ch.page)}
                        style={{width:'100%',display:'flex',alignItems:'center',padding:'7px 10px',border:'none',borderRadius:6,background:page===ch.page?T.primaryLight:'transparent',color:page===ch.page?T.primary:T.muted,cursor:'pointer',fontFamily:'inherit',fontSize:12,fontWeight:page===ch.page?700:400,textAlign:'left',marginBottom:1}}
                        onMouseEnter={e=>{if(page!==ch.page){e.currentTarget.style.background='#F3F4F6';e.currentTarget.style.color=T.text;}}}
                        onMouseLeave={e=>{if(page!==ch.page){e.currentTarget.style.background='transparent';e.currentTarget.style.color=T.muted;}}}>
                        {ch.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div style={{padding:'12px 14px',borderTop:`1px solid ${T.border}`,display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
          <div style={{width:32,height:32,borderRadius:'50%',background:`linear-gradient(135deg,${T.primary},#A78BFA)`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <User size={15} color="#fff"/>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <p style={{fontSize:13,fontWeight:700,color:T.text,margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>Admin</p>
            <p style={{fontSize:10,color:T.muted,margin:0}}>Administrador</p>
          </div>
          <LogOut size={15} color={T.muted} style={{cursor:'pointer',flexShrink:0}} onClick={onLogout}/>
        </div>
      </div>
    </>
  );
};

export default Sidebar;