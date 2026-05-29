import { useState } from "react";
import { CheckCircle, Printer, Save, Lock, AlertTriangle, DollarSign, PlusCircle } from "lucide-react";
import { T, genId } from "../theme";
import { PageHeader, Card, FInput, Btn, Badge } from "../components/ui";
import { API } from "../api";

const fechaHoy     = () => new Date().toLocaleDateString('es-BO');
const fechaHoraHoy = () => new Date().toLocaleString('es-BO');

// ════════════════════════════════════════════════════════════
//  APERTURA DE CAJA
// ════════════════════════════════════════════════════════════
export const CajaApertura = ({ cajaMov, setCajaMov, cajaAbierta, setCajaAbierta, user }) => {
  const [monto,  setMonto]  = useState('');
  const [obs,    setObs]    = useState('');
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  // ── Caja ya abierta: mostrar estado del turno actual ─────
  if (cajaAbierta) {
    // Solo movimientos del turno actual
    const movsTurno  = cajaMov.filter(m => m.turno_id === cajaAbierta.id);
    const ingresos   = movsTurno.filter(m => m.tipo === 'Ingreso').reduce((s,m) => s + parseFloat(m.monto||0), 0);
    const egresos    = movsTurno.filter(m => m.tipo === 'Egreso' ).reduce((s,m) => s + parseFloat(m.monto||0), 0);
    const saldoActual = parseFloat(cajaAbierta.monto||0) + ingresos - egresos;

    return (
      <div>
        <PageHeader title="Apertura de Caja" subtitle="Estado del turno actual"/>
        <div style={{maxWidth:500}}>
          <Card style={{borderTop:`4px solid ${T.green}`}}>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
              <div style={{background:T.greenLight,borderRadius:'50%',width:48,height:48,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <CheckCircle size={24} color={T.green}/>
              </div>
              <div>
                <h3 style={{margin:0,fontSize:16,fontWeight:800,color:T.green}}>Caja Abierta ✓</h3>
                <p style={{margin:0,fontSize:12,color:T.muted}}>Turno: {cajaAbierta.id} · {cajaAbierta.fecha}</p>
              </div>
            </div>
            {[
              {l:'Monto inicial',    v:cajaAbierta.monto},
              {l:'Ingresos del turno', v:ingresos,  color:T.green},
              {l:'Egresos del turno',  v:egresos,   color:T.red},
              {l:'Saldo actual',     v:saldoActual, bold:true},
            ].map((r,i)=>(
              <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:`1px solid ${T.border}`}}>
                <span style={{fontSize:13,color:T.muted,fontWeight:r.bold?700:400}}>{r.l}</span>
                <span style={{fontSize:14,fontWeight:r.bold?900:600,color:r.color||T.text}}>
                  Bs.{parseFloat(r.v||0).toFixed(2)}
                </span>
              </div>
            ))}
            <p style={{fontSize:12,color:T.muted,marginTop:16,textAlign:'center'}}>
              Para finalizar el turno ve a <strong>Caja → Cierre</strong>
            </p>
          </Card>
        </div>
      </div>
    );
  }

  // ── Formulario de apertura ────────────────────────────────
  const handleOpen = async () => {
    const montoNum = parseFloat(monto||0);
    if (montoNum < 0) { setError('El monto no puede ser negativo'); return; }
    setSaving(true);
    setError('');
    try {
      const nuevaApertura = {
        id:       genId('M'),
        fecha:    fechaHoraHoy(),
        tipo:     'Ingreso',
        concepto: 'Apertura de caja',
        monto:    montoNum,
        saldo:    montoNum,
        turno_id: null, // la apertura no tiene turno_id, ella ES el turno
      };
      await API.caja.crear(nuevaApertura);
      setCajaMov(prev => [...prev, nuevaApertura]);
      setCajaAbierta(nuevaApertura); // activa globalmente
    } catch (err) {
      setError('Error al abrir caja: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Apertura de Caja" subtitle="Iniciar nuevo turno de ventas"/>
      <div style={{maxWidth:460}}>
        <Card>
          {error && (
            <div style={{background:T.redLight,color:T.red,borderRadius:8,padding:'10px 14px',fontSize:13,fontWeight:600,marginBottom:16,display:'flex',alignItems:'center',gap:8}}>
              <AlertTriangle size={14}/>{error}
            </div>
          )}
          <div style={{background:T.redLight,color:T.red,borderRadius:8,padding:'10px 14px',fontSize:13,fontWeight:600,marginBottom:16,display:'flex',alignItems:'center',gap:8}}>
            <Lock size={14}/> Caja cerrada — no se pueden realizar ventas hasta abrirla.
          </div>
          <FInput label="Fecha y Hora" value={fechaHoraHoy()}                  onChange={()=>{}} disabled/>
          <FInput label="Cajero"       value={user?.nombre||'Administrador'}    onChange={()=>{}} disabled/>
          <div style={{marginBottom:14}}>
            <label style={{fontSize:11,fontWeight:700,color:T.muted,display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em'}}>
              Monto Inicial (Bs.) — puede ser 0 <span style={{color:T.red}}>*</span>
            </label>
            <input type="number" value={monto} onChange={e=>setMonto(e.target.value)}
              placeholder="0.00" min="0"
              style={{width:'100%',padding:'10px 12px',border:`2px solid ${T.primary}`,borderRadius:8,fontFamily:'inherit',fontSize:26,fontWeight:900,color:T.primary,outline:'none'}}/>
          </div>
          <FInput label="Observaciones" value={obs} onChange={setObs} placeholder="Notas del turno…"/>
          <Btn icon={PlusCircle} onClick={handleOpen} disabled={saving}>
            {saving?'Abriendo...':'Abrir Caja'}
          </Btn>
        </Card>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
//  CIERRE DE CAJA
// ════════════════════════════════════════════════════════════
export const CierreCaja = ({ cajaMov, setCajaMov, sales, cajaAbierta, setCajaAbierta, user }) => {
  const [saving,  setSaving]  = useState(false);
  const [cerrada, setCerrada] = useState(false);
  const [error,   setError]   = useState('');
  const [resumen, setResumen] = useState(null);

  // ── Sin caja abierta ──────────────────────────────────────
  if (!cajaAbierta) {
    return (
      <div>
        <PageHeader title="Cierre de Caja" subtitle="Finalizar turno"/>
        <div style={{maxWidth:460}}>
          <Card style={{textAlign:'center',padding:40}}>
            <Lock size={40} color={T.muted} style={{marginBottom:12}}/>
            <h3 style={{color:T.muted,margin:'0 0 8px'}}>No hay caja abierta</h3>
            <p style={{color:T.muted,fontSize:13}}>
              Ve a <strong>Caja → Apertura</strong> para iniciar un turno.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  // ── Calcular solo con movimientos del turno actual ────────
  const turnoId       = cajaAbierta.id;
  const montoInicial  = parseFloat(cajaAbierta.monto||0);
  const movsTurno     = cajaMov.filter(m => m.turno_id === turnoId);
  const ingresos      = movsTurno.filter(m=>m.tipo==='Ingreso').reduce((s,m)=>s+parseFloat(m.monto||0),0);
  const egresos       = movsTurno.filter(m=>m.tipo==='Egreso' ).reduce((s,m)=>s+parseFloat(m.monto||0),0);
  const saldoEsperado = montoInicial + ingresos - egresos;

  // Ventas del turno actual (por fecha de apertura)
  const fechaApertura = cajaAbierta.fecha?.split(',')[0] || fechaHoy();
  const ventasTurno   = sales.filter(s => s.estado==='Completada' && s.fecha===fechaApertura);
  const totalVentas   = ventasTurno.reduce((s,v)=>s+parseFloat(v.total||0),0);
  const cantVentas    = ventasTurno.length;
  const ventasEfectivo= ventasTurno.filter(v=>v.metodo==='Efectivo').reduce((s,v)=>s+parseFloat(v.total||0),0);
  const ventasOtros   = ventasTurno.filter(v=>v.metodo!=='Efectivo').reduce((s,v)=>s+parseFloat(v.total||0),0);

  // ── Pantalla de cierre completado ─────────────────────────
  if (cerrada && resumen) {
    return (
      <div>
        <PageHeader title="Cierre de Caja" subtitle="Turno finalizado"/>
        <div style={{maxWidth:500}}>
          <Card style={{borderTop:`4px solid ${T.primary}`}}>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
              <div style={{background:T.primaryLight,borderRadius:'50%',width:48,height:48,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <Lock size={24} color={T.primary}/>
              </div>
              <div>
                <h3 style={{margin:0,fontSize:16,fontWeight:800,color:T.primary}}>¡Caja Cerrada!</h3>
                <p style={{margin:0,fontSize:12,color:T.muted}}>Turno {resumen.turnoId} finalizado</p>
              </div>
            </div>
            {[
              {l:'Monto inicial',       v:`Bs.${resumen.montoInicial.toFixed(2)}`},
              {l:'Total ventas',        v:`Bs.${resumen.totalVentas.toFixed(2)}`,  color:T.green},
              {l:'N° de ventas',        v:`${resumen.cantVentas} ventas`},
              {l:'Efectivo',            v:`Bs.${resumen.ventasEfectivo.toFixed(2)}`},
              {l:'Tarjeta/Transf.',     v:`Bs.${resumen.ventasOtros.toFixed(2)}`},
              {l:'Otros ingresos',      v:`Bs.${resumen.ingresos.toFixed(2)}`},
              {l:'Egresos',             v:`Bs.${resumen.egresos.toFixed(2)}`,      color:T.red},
              {l:'Saldo final en caja', v:`Bs.${resumen.saldoFinal.toFixed(2)}`,   color:T.primary, bold:true},
              {l:'Cajero',              v:resumen.cajero},
              {l:'Hora de cierre',      v:resumen.horaCierre},
            ].map((r,i)=>(
              <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:`1px solid ${T.border}`}}>
                <span style={{fontSize:12,color:T.muted,fontWeight:r.bold?700:400}}>{r.l}</span>
                <span style={{fontSize:13,fontWeight:r.bold?900:600,color:r.color||T.text}}>{r.v}</span>
              </div>
            ))}
            <div style={{marginTop:16,display:'flex',gap:10}}>
              <Btn icon={Printer} variant="secondary" onClick={()=>window.print()}>Imprimir Reporte</Btn>
            </div>
            <p style={{fontSize:12,color:T.muted,marginTop:12,textAlign:'center'}}>
              Para volver a vender, abre un nuevo turno desde <strong>Caja → Apertura</strong>
            </p>
          </Card>
        </div>
      </div>
    );
  }

  const handleClose = async () => {
    setSaving(true);
    setError('');
    try {
      const horaCierre = fechaHoraHoy();
      const cierreMovimiento = {
        id:       genId('M'),
        fecha:    horaCierre,
        tipo:     'Egreso',
        concepto: 'Cierre de caja',
        monto:    0,
        saldo:    saldoEsperado,
        turno_id: turnoId, // vinculado al turno que se cierra
      };
      await API.caja.crear(cierreMovimiento);
      setCajaMov(prev => [...prev, cierreMovimiento]);

      // Guardar resumen para mostrar
      setResumen({
        turnoId, montoInicial, totalVentas, cantVentas,
        ventasEfectivo, ventasOtros, ingresos, egresos,
        saldoFinal: saldoEsperado,
        cajero: user?.nombre||'Admin',
        horaCierre,
      });

      setCajaAbierta(null); // ← desactiva globalmente — bloquea ventas
      setCerrada(true);
    } catch (err) {
      setError('Error al cerrar caja: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Cierre de Caja" subtitle={`Turno: ${turnoId} · ${cajaAbierta.fecha}`}/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:16,maxWidth:800}}>
        <Card>
          <h4 style={{margin:'0 0 16px',fontSize:14,fontWeight:800,display:'flex',alignItems:'center',gap:6}}>
            <DollarSign size={15} color={T.primary}/> Resumen del Turno
          </h4>
          {[
            {l:'Monto inicial',          v:montoInicial},
            {l:'Ventas en efectivo',      v:ventasEfectivo,  color:T.green},
            {l:'Ventas tarjeta/transf.',  v:ventasOtros,     color:T.blue},
            {l:'Otros ingresos',          v:ingresos,        color:T.green},
            {l:'Egresos / gastos',        v:egresos,         color:T.red, neg:true},
            {l:'Saldo esperado en caja',  v:saldoEsperado,   bold:true},
          ].map((r,i,a)=>(
            <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',borderBottom:i<a.length-1?`1px solid ${T.border}`:'none'}}>
              <span style={{fontSize:13,color:T.muted,fontWeight:r.bold?700:400}}>{r.l}</span>
              <span style={{fontSize:13,fontWeight:r.bold?900:600,color:r.color||(r.bold?T.primary:T.text)}}>
                {r.neg?'-':''}Bs.{parseFloat(r.v||0).toFixed(2)}
              </span>
            </div>
          ))}
        </Card>

        <Card>
          <h4 style={{margin:'0 0 16px',fontSize:14,fontWeight:800}}>Ventas del Turno</h4>
          {[
            {l:'Total ventas',            v:`Bs.${totalVentas.toFixed(2)}`,    color:T.primary},
            {l:'N° de ventas',            v:`${cantVentas} ventas`},
            {l:'Efectivo',                v:`Bs.${ventasEfectivo.toFixed(2)}`},
            {l:'Tarjeta / Transferencia', v:`Bs.${ventasOtros.toFixed(2)}`},
            {l:'Cajero',                  v:user?.nombre||'Admin'},
            {l:'Apertura',                v:cajaAbierta.fecha},
          ].map((r,i)=>(
            <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',borderBottom:`1px solid ${T.border}`}}>
              <span style={{fontSize:13,color:T.muted}}>{r.l}</span>
              <span style={{fontSize:13,fontWeight:600,color:r.color||T.text}}>{r.v}</span>
            </div>
          ))}

          {error && (
            <div style={{background:T.redLight,color:T.red,borderRadius:8,padding:'10px',fontSize:13,fontWeight:600,margin:'12px 0',display:'flex',alignItems:'center',gap:8}}>
              <AlertTriangle size={14}/>{error}
            </div>
          )}

          <div style={{display:'flex',gap:10,marginTop:16}}>
            <Btn icon={Lock} onClick={handleClose} disabled={saving}>
              {saving?'Cerrando...':'Cerrar Caja'}
            </Btn>
            <Btn icon={Printer} variant="secondary" onClick={()=>window.print()}>Imprimir</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
//  CONFIGURACIÓN
// ════════════════════════════════════════════════════════════
export const Configuracion = () => {
  const [form, setForm] = useState({
    empresa:'Marva POS',nit:'',dir:'',tel:'',email:'',
    moneda:'BOB',impuesto:'13',boleta:'B001',factura:'F001'
  });
  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); setTimeout(()=>setSaved(false),2000); };
  const upd = k => v => setForm(p=>({...p,[k]:v}));

  return (
    <div>
      <PageHeader title="Configuración" subtitle="Ajustes del sistema"
        action={<div style={{display:'flex',gap:8,alignItems:'center'}}>
          {saved&&<Badge color="green">✓ Guardado</Badge>}
          <Btn icon={Save} onClick={save}>Guardar Todo</Btn>
        </div>}/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:16}}>
        <Card>
          <h4 style={{margin:'0 0 16px',fontSize:14,fontWeight:800}}>Datos de la Empresa</h4>
          <FInput label="Nombre de empresa" value={form.empresa}  onChange={upd('empresa')}/>
          <FInput label="NIT"               value={form.nit}      onChange={upd('nit')}/>
          <FInput label="Dirección"         value={form.dir}      onChange={upd('dir')}/>
          <FInput label="Teléfono"          value={form.tel}      onChange={upd('tel')}/>
          <FInput label="Email"             value={form.email}    onChange={upd('email')} type="email"/>
        </Card>
        <Card>
          <h4 style={{margin:'0 0 16px',fontSize:14,fontWeight:800}}>Sistema</h4>
          <FInput label="Moneda"           value={form.moneda}   onChange={upd('moneda')}   options={['BOB','USD']}/>
          <FInput label="Impuesto IT %"    value={form.impuesto} onChange={upd('impuesto')} type="number"/>
          <FInput label="Serie de Boleta"  value={form.boleta}   onChange={upd('boleta')}/>
          <FInput label="Serie de Factura" value={form.factura}  onChange={upd('factura')}/>
        </Card>
      </div>
    </div>
  );
};