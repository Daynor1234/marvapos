import { useState } from "react";
import { User, Save, Key, Shield, CheckCircle, AlertTriangle } from "lucide-react";
import { T } from "../theme";
import { PageHeader, Card, FInput, Btn, Badge } from "../components/ui";
import { API } from "../api";

// ════════════════════════════════════════════════════════════
//  MI PERFIL
// ════════════════════════════════════════════════════════════
export const MiPerfil = ({ user, setUser }) => {
  const [form,   setForm]   = useState({ nombre: user?.nombre||'', email: user?.email||'', rol: user?.rol||'' });
  const [saving, setSaving] = useState(false);
  const [toast,  setToast]  = useState(null);

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),2500); };
  const upd = k => v => setForm(p=>({...p,[k]:v}));

  const handleSave = async () => {
    if (!form.nombre || !form.email) { showToast('Nombre y email son obligatorios','error'); return; }
    setSaving(true);
    try {
      // Solo actualizamos nombre y email, no el rol ni la contraseña
      await API.usuarios.actualizar({ id: user.id, nombre: form.nombre, email: form.email });
      setUser(prev => ({ ...prev, nombre: form.nombre, email: form.email }));
      showToast('Perfil actualizado correctamente');
    } catch (err) {
      showToast('Error al guardar: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {toast && (
        <div style={{position:'fixed',top:16,right:16,zIndex:2000,background:toast.type==='error'?T.red:T.green,color:'#fff',padding:'10px 18px',borderRadius:10,fontSize:13,fontWeight:700,boxShadow:'0 4px 16px rgba(0,0,0,0.15)',display:'flex',alignItems:'center',gap:8}}>
          {toast.type==='error'?<AlertTriangle size={15}/>:<CheckCircle size={15}/>}{toast.msg}
        </div>
      )}
      <PageHeader title="Mi Perfil" subtitle="Información de tu cuenta"
        action={<Btn icon={Save} onClick={handleSave} disabled={saving}>{saving?'Guardando...':'Guardar cambios'}</Btn>}/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:16,maxWidth:700}}>
        <Card>
          {/* Avatar */}
          <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:24,paddingBottom:20,borderBottom:`1px solid ${T.border}`}}>
            <div style={{width:72,height:72,borderRadius:'50%',background:`linear-gradient(135deg,${T.primary},#A78BFA)`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <User size={32} color="#fff"/>
            </div>
            <div>
              <p style={{fontSize:16,fontWeight:800,color:T.text,margin:0}}>{form.nombre}</p>
              <p style={{fontSize:12,color:T.muted,margin:'2px 0 6px'}}>{form.email}</p>
              <Badge color="purple">{user?.rol||'Administrador'}</Badge>
            </div>
          </div>
          <FInput label="Nombre completo" value={form.nombre} onChange={upd('nombre')} required/>
          <FInput label="Correo electrónico" value={form.email} onChange={upd('email')} type="email" required/>
          <FInput label="Rol" value={form.rol} onChange={()=>{}} disabled/>
        </Card>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
//  SEGURIDAD — cambio de contraseña
// ════════════════════════════════════════════════════════════
export const Seguridad = ({ user }) => {
  const [form,   setForm]   = useState({ actual:'', nueva:'', confirmar:'' });
  const [saving, setSaving] = useState(false);
  const [toast,  setToast]  = useState(null);

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };
  const upd = k => v => setForm(p=>({...p,[k]:v}));

  const handleSave = async () => {
    if (!form.actual)          { showToast('Ingresa tu contraseña actual','error'); return; }
    if (!form.nueva)           { showToast('Ingresa la nueva contraseña','error'); return; }
    if (form.nueva.length < 4) { showToast('La contraseña debe tener al menos 4 caracteres','error'); return; }
    if (form.nueva !== form.confirmar) { showToast('Las contraseñas no coinciden','error'); return; }

    setSaving(true);
    try {
      // Verificar contraseña actual primero
      const { login } = await import('../api');
      const res = await login(user.email, form.actual);
      if (!res.ok) { showToast('La contraseña actual es incorrecta','error'); setSaving(false); return; }

      // Actualizar contraseña
      await API.usuarios.actualizar({ id: user.id, password: form.nueva });
      setForm({ actual:'', nueva:'', confirmar:'' });
      showToast('Contraseña actualizada correctamente');
    } catch (err) {
      showToast('Error: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {toast && (
        <div style={{position:'fixed',top:16,right:16,zIndex:2000,background:toast.type==='error'?T.red:T.green,color:'#fff',padding:'10px 18px',borderRadius:10,fontSize:13,fontWeight:700,boxShadow:'0 4px 16px rgba(0,0,0,0.15)',display:'flex',alignItems:'center',gap:8}}>
          {toast.type==='error'?<AlertTriangle size={15}/>:<CheckCircle size={15}/>}{toast.msg}
        </div>
      )}
      <PageHeader title="Seguridad" subtitle="Cambiar contraseña"/>
      <div style={{maxWidth:420}}>
        <Card>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20,paddingBottom:16,borderBottom:`1px solid ${T.border}`}}>
            <div style={{background:T.primaryLight,borderRadius:10,width:42,height:42,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <Shield size={20} color={T.primary}/>
            </div>
            <div>
              <p style={{fontSize:14,fontWeight:700,color:T.text,margin:0}}>Cambiar contraseña</p>
              <p style={{fontSize:12,color:T.muted,margin:0}}>Usuario: {user?.email}</p>
            </div>
          </div>
          <FInput label="Contraseña actual"    value={form.actual}    onChange={upd('actual')}    type="password" required/>
          <FInput label="Nueva contraseña"     value={form.nueva}     onChange={upd('nueva')}     type="password" required/>
          <FInput label="Confirmar contraseña" value={form.confirmar} onChange={upd('confirmar')} type="password" required/>

          <div style={{background:T.bg,borderRadius:8,padding:'10px 14px',marginBottom:16,fontSize:12,color:T.muted}}>
            <p style={{margin:'0 0 4px',fontWeight:600,color:T.text}}>Requisitos:</p>
            <p style={{margin:'2px 0'}}>· Mínimo 4 caracteres</p>
            <p style={{margin:'2px 0'}}>· No uses datos personales obvios</p>
          </div>

          <Btn icon={Key} onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando...' : 'Actualizar contraseña'}
          </Btn>
        </Card>
      </div>
    </div>
  );
};