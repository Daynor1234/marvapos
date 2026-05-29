import { Package, X, Trash2, AlertTriangle, CheckCircle, Eye, Edit2, Plus, Download, Printer, Save, Search } from "lucide-react";
import { useState } from "react";
import { T, genId } from "../theme";

export const Badge = ({color='gray',children}) => {
  const map = {green:{bg:T.greenLight,c:T.green},red:{bg:T.redLight,c:T.red},orange:{bg:T.orangeLight,c:T.orange},blue:{bg:T.blueLight,c:T.blue},purple:{bg:T.primaryLight,c:T.primary},gray:{bg:'#F3F4F6',c:'#374151'}};
  const s = map[color]||map.gray;
  return <span style={{background:s.bg,color:s.c,padding:'3px 10px',borderRadius:20,fontSize:11,fontWeight:700,display:'inline-block',whiteSpace:'nowrap'}}>{children}</span>;
};

export const Btn = ({icon:Icon,children,onClick,variant='primary',size='md',style:sx={},disabled=false}) => {
  const base = {cursor:disabled?'not-allowed':'pointer',opacity:disabled?0.6:1,fontFamily:'inherit',display:'inline-flex',alignItems:'center',gap:6,border:'none',transition:'all 0.15s',fontWeight:600};
  const variants = {
    primary:{background:T.primary,color:'#fff'},
    secondary:{background:T.white,color:T.text,border:`1px solid ${T.border}`},
    danger:{background:T.red,color:'#fff'},
    ghost:{background:'transparent',color:T.muted,border:'none'},
    success:{background:T.green,color:'#fff'},
  };
  const sizes = {sm:{padding:'6px 12px',fontSize:12,borderRadius:6},md:{padding:'8px 16px',fontSize:13,borderRadius:8}};
  const v = variants[variant]||variants.primary;
  const sz = sizes[size]||sizes.md;
  return (
    <button onClick={disabled?undefined:onClick} style={{...base,...v,...sz,...sx}}
      onMouseEnter={e=>{if(!disabled)e.currentTarget.style.opacity='0.82';}}
      onMouseLeave={e=>{if(!disabled)e.currentTarget.style.opacity='1';}}>
      {Icon&&<Icon size={size==='sm'?13:15}/>}{children}
    </button>
  );
};

export const Card = ({children,style:sx={}}) => (
  <div style={{background:T.white,borderRadius:12,padding:20,boxShadow:T.shadow,...sx}}>{children}</div>
);

export const FInput = ({label,value,onChange,placeholder,type='text',required=false,disabled=false,options=null}) => {
  const labelEl = label&&<label style={{fontSize:11,fontWeight:700,color:T.muted,display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em'}}>{label}{required&&<span style={{color:T.red}}> *</span>}</label>;
  if(type==='image') return (
    <div style={{marginBottom:14}}>
      {labelEl}
      <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
        <div style={{width:72,height:72,borderRadius:9,border:`2px dashed ${value?T.primary:T.border}`,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',background:T.bg,flexShrink:0}}>
          {value?<img src={value} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<Package size={22} color={T.muted}/>}
        </div>
        <div style={{flex:1}}>
          <input type="file" accept="image/*" onChange={e=>{
            const file=e.target.files[0];
            if(file){const r=new FileReader();r.onload=ev=>onChange(ev.target.result);r.readAsDataURL(file);}
          }} style={{width:'100%',padding:'7px 10px',border:`1px solid ${T.border}`,borderRadius:8,fontFamily:'inherit',fontSize:12,outline:'none',background:T.white,color:T.text,cursor:'pointer'}}/>
          {value&&<button onClick={()=>onChange('')} style={{marginTop:5,background:'none',border:'none',cursor:'pointer',color:T.red,fontSize:11,fontWeight:600,padding:0,display:'flex',alignItems:'center',gap:4}}><X size={11}/>Quitar imagen</button>}
          <p style={{fontSize:10,color:T.muted,margin:'4px 0 0'}}>JPG, PNG o WebP · Máx 2MB</p>
        </div>
      </div>
    </div>
  );
  return (
    <div style={{marginBottom:14}}>
      {labelEl}
      {options ? (
        <select value={value} onChange={e=>onChange(e.target.value)} disabled={disabled}
          style={{width:'100%',padding:'8px 12px',border:`1px solid ${T.border}`,borderRadius:8,fontFamily:'inherit',fontSize:13,outline:'none',background:disabled?T.bg:T.white,color:T.text}}>
          {options.map(o=><option key={o.value??o} value={o.value??o}>{o.label??o}</option>)}
        </select>
      ) : (
        <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
          style={{width:'100%',padding:'8px 12px',border:`1px solid ${T.border}`,borderRadius:8,fontFamily:'inherit',fontSize:13,outline:'none',background:disabled?T.bg:T.white,color:T.text}}/>
      )}
    </div>
  );
};

export const SInput = ({placeholder,value,onChange,icon:Icon,style:sx={}}) => (
  <div style={{position:'relative',...sx}}>
    {Icon&&<Icon size={14} style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:T.muted,pointerEvents:'none'}}/>}
    <input placeholder={placeholder} value={value} onChange={onChange}
      style={{width:'100%',padding:Icon?'8px 12px 8px 32px':'8px 12px',border:`1px solid ${T.border}`,borderRadius:8,fontFamily:'inherit',fontSize:13,outline:'none',background:T.white,color:T.text}}/>
  </div>
);

export const PageHeader = ({title,subtitle,action}) => (
  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20,flexWrap:'wrap',gap:10}}>
    <div>
      <h2 style={{fontSize:20,fontWeight:800,color:T.text,margin:0}}>{title}</h2>
      {subtitle&&<p style={{fontSize:13,color:T.muted,margin:'3px 0 0'}}>{subtitle}</p>}
    </div>
    {action&&<div>{action}</div>}
  </div>
);

export const Modal = ({open,onClose,title,children,width=480}) => {
  if(!open) return null;
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.45)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:16}} onClick={onClose}>
      <div style={{background:T.white,borderRadius:14,width:'100%',maxWidth:width,maxHeight:'90vh',overflowY:'auto',boxShadow:T.shadowMd}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:'18px 22px',borderBottom:`1px solid ${T.border}`,display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,background:T.white,zIndex:1}}>
          <h3 style={{margin:0,fontSize:16,fontWeight:800,color:T.text}}>{title}</h3>
          <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',color:T.muted,padding:4,display:'flex',borderRadius:6}}><X size={18}/></button>
        </div>
        <div style={{padding:'20px 22px'}}>{children}</div>
      </div>
    </div>
  );
};

export const Confirm = ({open,onClose,onConfirm,message='¿Eliminar este registro?'}) => (
  <Modal open={open} onClose={onClose} title="Confirmar acción" width={360}>
    <p style={{color:T.text,margin:'0 0 20px',fontSize:14}}>{message}</p>
    <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
      <Btn variant="secondary" onClick={onClose}>Cancelar</Btn>
      <Btn variant="danger" icon={Trash2} onClick={onConfirm}>Eliminar</Btn>
    </div>
  </Modal>
);

export const ViewModal = ({open,onClose,title,fields,data}) => (
  <Modal open={open} onClose={onClose} title={title} width={520}>
    {data&&(
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4px 16px'}}>
        {fields.map(f=>{
          const val = f.render?f.render(data[f.key],data):data[f.key]??'—';
          return (
            <div key={f.key} style={{padding:'8px 0',borderBottom:`1px solid ${T.bg}`,gridColumn:f.full?'1/-1':'auto'}}>
              <p style={{fontSize:10,fontWeight:700,color:T.muted,margin:'0 0 2px',textTransform:'uppercase'}}>{f.label}</p>
              <div style={{fontSize:13,color:T.text,margin:0,fontWeight:500}}>{val}</div>
            </div>
          );
        })}
      </div>
    )}
    <div style={{marginTop:16,display:'flex',justifyContent:'flex-end'}}><Btn variant="secondary" onClick={onClose}>Cerrar</Btn></div>
  </Modal>
);

export const DataTable = ({columns,data,onView,onEdit,onDelete,showActions=true}) => (
  <div style={{overflowX:'auto',WebkitOverflowScrolling:'touch'}}>
    <table style={{width:'100%',borderCollapse:'collapse',fontSize:13,minWidth:500}}>
      <thead>
        <tr style={{borderBottom:`2px solid ${T.border}`}}>
          {columns.map(c=>(
            <th key={c.key+c.label} style={{padding:'10px 12px',textAlign:'left',fontWeight:700,color:T.muted,whiteSpace:'nowrap',fontSize:11,textTransform:'uppercase',letterSpacing:'0.04em'}}>{c.label}</th>
          ))}
          {showActions&&<th style={{padding:'10px 12px',textAlign:'right',fontWeight:700,color:T.muted,fontSize:11,textTransform:'uppercase',letterSpacing:'0.04em'}}>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row,i)=>(
          <tr key={i} style={{borderBottom:`1px solid ${T.border}`}}
            onMouseEnter={e=>e.currentTarget.style.background='#F9FAFB'}
            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
            {columns.map((c,j)=>(
              <td key={j} style={{padding:'10px 12px',color:T.text,whiteSpace:'nowrap'}}>
                {c.render?c.render(row[c.key],row):String(row[c.key]??'')}
              </td>
            ))}
            {showActions&&<td style={{padding:'10px 12px',textAlign:'right'}}>
              <div style={{display:'flex',gap:4,justifyContent:'flex-end'}}>
                {onView&&<button onClick={()=>onView(row)} title="Ver" style={{background:T.blueLight,color:T.blue,border:'none',borderRadius:6,padding:'5px 7px',cursor:'pointer',display:'inline-flex',alignItems:'center'}}><Eye size={13}/></button>}
                {onEdit&&<button onClick={()=>onEdit(row)} title="Editar" style={{background:T.primaryLight,color:T.primary,border:'none',borderRadius:6,padding:'5px 7px',cursor:'pointer',display:'inline-flex',alignItems:'center'}}><Edit2 size={13}/></button>}
                {onDelete&&<button onClick={()=>onDelete(row)} title="Eliminar" style={{background:T.redLight,color:T.red,border:'none',borderRadius:6,padding:'5px 7px',cursor:'pointer',display:'inline-flex',alignItems:'center'}}><Trash2 size={13}/></button>}
              </div>
            </td>}
          </tr>
        ))}
      </tbody>
    </table>
    {data.length===0&&<div style={{textAlign:'center',padding:40,color:T.muted,fontSize:14}}>No hay registros disponibles</div>}
  </div>
);

export const CrudPage = ({title,subtitle,data=[],setData,columns=[],formFields=[],viewFields,addLabel,filterFn,idPrefix='ID',tabla}) => {
  const [search,  setSearch]  = useState('');
  const [modal,   setModal]   = useState(null);
  const [selected,setSelected]= useState(null);
  const [form,    setForm]    = useState({});
  const [toast,   setToast]   = useState(null);
  const [saving,  setSaving]  = useState(false);

  const showToast = (msg,type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const filtered = data.filter(r=>{
    const matchSearch = Object.values(r).some(v=>String(v).toLowerCase().includes(search.toLowerCase()));
    return filterFn ? filterFn(r) && matchSearch : matchSearch;
  });

  const openAdd    = () => { const ini={}; (formFields||[]).forEach(f=>{ini[f.key]=f.default??'';}); setForm(ini); setSelected(null); setModal('add'); };
  const openEdit   = row => { setForm({...row}); setSelected(row); setModal('edit'); };
  const openView   = row => { setSelected(row); setModal('view'); };
  const openDelete = row => { setSelected(row); setModal('delete'); };

  // ── GUARDAR (crear o editar) ─────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      if (modal === 'add') {
        const newId = genId(idPrefix);
        const newRecord = { ...form, id: newId };

        if (tabla) {
          // Con BD: enviar a la API
          const { crear } = await import('../api');
          await crear(tabla, newRecord);
        }
        // Actualizar estado local
        setData(prev => [newRecord, ...prev]);
        showToast('Registro creado exitosamente');

      } else {
        const updated = { ...form, id: selected.id };

        if (tabla) {
          const { actualizar } = await import('../api');
          await actualizar(tabla, updated);
        }
        setData(prev => prev.map(r => r.id === selected.id ? updated : r));
        showToast('Registro actualizado exitosamente');
      }
      setModal(null);
    } catch (err) {
      showToast('Error al guardar: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── ELIMINAR ─────────────────────────────────────────────
  const handleDelete = async () => {
    setSaving(true);
    try {
      if (tabla) {
        const { eliminar } = await import('../api');
        await eliminar(tabla, selected.id);
      }
      setData(prev => prev.filter(r => r.id !== selected.id));
      showToast('Registro eliminado', 'error');
      setModal(null);
    } catch (err) {
      showToast('Error al eliminar: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Toast */}
      {toast&&(
        <div style={{position:'fixed',top:16,right:16,zIndex:2000,background:toast.type==='error'?T.red:T.green,color:'#fff',padding:'10px 18px',borderRadius:10,fontSize:13,fontWeight:700,boxShadow:T.shadowMd,display:'flex',alignItems:'center',gap:8}}>
          {toast.type==='error'?<AlertTriangle size={15}/>:<CheckCircle size={15}/>}{toast.msg}
        </div>
      )}

      <PageHeader title={title} subtitle={subtitle||`${data.length} registros`}
        action={addLabel&&<Btn icon={Plus} onClick={openAdd}>{addLabel}</Btn>}/>

      <Card style={{padding:0,overflow:'hidden'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 18px',borderBottom:`1px solid ${T.border}`,gap:10,flexWrap:'wrap'}}>
          <SInput placeholder={`Buscar en ${title.toLowerCase()}…`} value={search} onChange={e=>setSearch(e.target.value)} icon={Search} style={{maxWidth:280,flex:1,minWidth:160}}/>
          <div style={{display:'flex',gap:7,flexShrink:0}}>
            <Btn icon={Download} variant="secondary" size="sm" onClick={()=>{
              const rows=filtered.map(r=>columns.map(c=>r[c.key]??'').join('\t')).join('\n');
              const heads=columns.map(c=>c.label).join('\t');
              const blob=new Blob([heads+'\n'+rows],{type:'text/plain'});
              const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${title}.txt`;a.click();
            }}>Exportar</Btn>
            <Btn icon={Printer} variant="secondary" size="sm" onClick={()=>window.print()}>Imprimir</Btn>
          </div>
        </div>
        <div style={{padding:'0 4px'}}>
          <DataTable columns={columns} data={filtered} onView={viewFields?openView:null} onEdit={openEdit} onDelete={openDelete}/>
        </div>
        <div style={{padding:'10px 18px',borderTop:`1px solid ${T.border}`,fontSize:12,color:T.muted}}>
          <span>{filtered.length} de {data.length} registros</span>
        </div>
      </Card>

      {/* Modal Agregar / Editar */}
      <Modal open={modal==='add'||modal==='edit'} onClose={()=>!saving&&setModal(null)}
        title={modal==='add'?`Nuevo registro`:`Editar registro`} width={540}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'0 16px'}}>
          {(formFields||[]).map(f=>(
            <div key={f.key} style={{gridColumn:f.full?'1/-1':'auto'}}>
              <FInput label={f.label} value={form[f.key]??''} onChange={v=>setForm(p=>({...p,[f.key]:v}))}
                placeholder={f.placeholder||f.label} type={f.type||'text'} required={f.required} options={f.options}/>
            </div>
          ))}
        </div>
        <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:8}}>
          <Btn variant="secondary" onClick={()=>setModal(null)} disabled={saving}>Cancelar</Btn>
          <Btn icon={Save} onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando...' : modal==='add' ? 'Guardar' : 'Actualizar'}
          </Btn>
        </div>
      </Modal>

      {/* Modal Ver */}
      {viewFields&&<ViewModal open={modal==='view'} onClose={()=>setModal(null)} title={`Detalle — ${selected?.id||''}`} fields={viewFields} data={selected}/>}

      {/* Modal Confirmar eliminar */}
      <Confirm open={modal==='delete'} onClose={()=>!saving&&setModal(null)} onConfirm={handleDelete}
        message={saving ? 'Eliminando...' : '¿Eliminar este registro? Esta acción no se puede deshacer.'}/>
    </div>
  );
};