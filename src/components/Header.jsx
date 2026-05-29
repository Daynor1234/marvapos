import { useState, useEffect, useRef } from "react";
import { Bell, User, Settings, Shield, LogOut, AlertTriangle, CheckCircle, Package, ChevronLeft, Menu } from "lucide-react";
import { T } from "../theme";
import { Badge } from "./ui";

const Header = ({open, setOpen, mobile, user, onLogout, setPage, cajaAbierta}) => {
  const [showNotif, setShowNotif] = useState(false);
  const [showUser,  setShowUser]  = useState(false);
  const notifRef = useRef(null);
  const userRef  = useRef(null);

  useEffect(() => {
    const handler = e => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (userRef.current  && !userRef.current.contains(e.target))  setShowUser(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const notifs = [
    {icon:AlertTriangle, color:T.orange, msg:'Hay productos con stock bajo', time:'Ahora'},
    {icon:CheckCircle,   color:T.green,  msg:'Sistema conectado correctamente', time:'Al iniciar'},
    {icon:Package,       color:T.blue,   msg:'Revisa el inventario actualizado', time:'Hoy'},
  ];

  const menuOpciones = [
    {icon:User,    label:'Mi perfil',     page:'mi-perfil',    danger:false},
    {icon:Shield,  label:'Seguridad',     page:'seguridad',    danger:false},
    {icon:Settings,label:'Configuración', page:'configuracion',danger:false},
    {icon:LogOut,  label:'Cerrar sesión', page:null,           danger:true},
  ];

  const handleMenuClick = (opcion) => {
    setShowUser(false);
    if (opcion.danger && onLogout) { onLogout(); return; }
    if (opcion.page && setPage) setPage(opcion.page);
  };

  return (
    <header style={{height:56,background:T.white,borderBottom:`1px solid ${T.border}`,display:'flex',alignItems:'center',padding:'0 16px',gap:12,flexShrink:0,position:'relative',zIndex:50}}>
      <button onClick={()=>setOpen(p=>!p)}
        style={{background:'none',border:'none',cursor:'pointer',padding:7,borderRadius:7,color:T.muted,display:'flex',alignItems:'center'}}
        onMouseEnter={e=>e.currentTarget.style.background=T.bg}
        onMouseLeave={e=>e.currentTarget.style.background='none'}>
        {open&&!mobile ? <ChevronLeft size={19}/> : <Menu size={19}/>}
      </button>

      {/* Indicador de caja */}
      {cajaAbierta ? (
        <div style={{display:'flex',alignItems:'center',gap:6,background:T.greenLight,padding:'4px 10px',borderRadius:20,fontSize:11,fontWeight:700,color:T.green}}>
          <span style={{width:7,height:7,borderRadius:'50%',background:T.green,display:'inline-block'}}/>
          Caja abierta
        </div>
      ) : (
        <div onClick={()=>setPage&&setPage('apertura-caja')}
          style={{display:'flex',alignItems:'center',gap:6,background:T.redLight,padding:'4px 10px',borderRadius:20,fontSize:11,fontWeight:700,color:T.red,cursor:'pointer'}}>
          <span style={{width:7,height:7,borderRadius:'50%',background:T.red,display:'inline-block'}}/>
          Caja cerrada
        </div>
      )}

      <div style={{flex:1}}/>

      {/* Notificaciones */}
      <div ref={notifRef} style={{position:'relative'}}>
        <button onClick={()=>{setShowNotif(p=>!p); setShowUser(false);}}
          style={{background:showNotif?T.bg:'none',border:'none',cursor:'pointer',padding:7,borderRadius:7,color:T.muted,display:'flex',alignItems:'center',position:'relative'}}
          onMouseEnter={e=>e.currentTarget.style.background=T.bg}
          onMouseLeave={e=>{if(!showNotif)e.currentTarget.style.background='none';}}>
          <Bell size={18}/>
          <span style={{position:'absolute',top:5,right:5,background:T.red,borderRadius:'50%',width:7,height:7,display:'block'}}/>
        </button>
        {showNotif && (
          <div style={{position:'absolute',top:'calc(100% + 8px)',right:0,width:300,background:T.white,border:`1px solid ${T.border}`,borderRadius:12,boxShadow:T.shadowMd,zIndex:200}}>
            <div style={{padding:'12px 16px',borderBottom:`1px solid ${T.border}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <h4 style={{margin:0,fontSize:14,fontWeight:800}}>Notificaciones</h4>
              <Badge color="red">{notifs.length}</Badge>
            </div>
            {notifs.map((n,i) => {
              const Icon = n.icon;
              return (
                <div key={i} style={{padding:'10px 16px',borderBottom:i<notifs.length-1?`1px solid ${T.border}`:'none',display:'flex',gap:10,alignItems:'flex-start'}}
                  onMouseEnter={e=>e.currentTarget.style.background=T.bg}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <div style={{width:30,height:30,borderRadius:8,background:n.color+'22',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <Icon size={13} color={n.color}/>
                  </div>
                  <div>
                    <p style={{fontSize:12,fontWeight:600,color:T.text,margin:'0 0 2px'}}>{n.msg}</p>
                    <p style={{fontSize:10,color:T.muted,margin:0}}>{n.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Menú usuario */}
      <div ref={userRef} style={{position:'relative'}}>
        <div onClick={()=>{setShowUser(p=>!p); setShowNotif(false);}}
          style={{width:34,height:34,borderRadius:'50%',background:`linear-gradient(135deg,${T.primary},#A78BFA)`,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',border:showUser?`2px solid ${T.primary}`:'2px solid transparent',transition:'border 0.15s'}}>
          <User size={15} color="#fff"/>
        </div>
        {showUser && (
          <div style={{position:'absolute',top:'calc(100% + 8px)',right:0,width:230,background:T.white,border:`1px solid ${T.border}`,borderRadius:12,boxShadow:T.shadowMd,zIndex:200}}>
            {/* Info usuario */}
            <div style={{padding:'14px 16px',borderBottom:`1px solid ${T.border}`,display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:40,height:40,borderRadius:'50%',background:`linear-gradient(135deg,${T.primary},#A78BFA)`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <User size={17} color="#fff"/>
              </div>
              <div style={{minWidth:0}}>
                <p style={{fontSize:13,fontWeight:800,color:T.text,margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.nombre||'Admin'}</p>
                <p style={{fontSize:10,color:T.muted,margin:'1px 0 0',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.email||''}</p>
                <span style={{fontSize:10,background:T.primaryLight,color:T.primary,borderRadius:4,padding:'1px 6px',fontWeight:700}}>{user?.rol||'Administrador'}</span>
              </div>
            </div>
            {/* Opciones */}
            {menuOpciones.map((op, i) => {
              const Icon = op.icon;
              return (
                <button key={i} onClick={()=>handleMenuClick(op)}
                  style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'10px 16px',border:'none',background:'transparent',cursor:'pointer',fontFamily:'inherit',fontSize:13,color:op.danger?T.red:T.text,fontWeight:500,textAlign:'left',borderTop:op.danger?`1px solid ${T.border}`:'none'}}
                  onMouseEnter={e=>e.currentTarget.style.background=op.danger?T.redLight:T.bg}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <Icon size={14}/>{op.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;