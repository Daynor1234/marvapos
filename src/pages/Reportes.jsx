import { Download, Printer } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";
import { T } from "../theme";
import { PageHeader, Card, Btn } from "../components/ui";
import { DataTable } from "../components/ui";
import { chartMonthly, pieData, pieColors } from "../data";

const Reportes = ({tipo}) => {
  const titles = {'rep-ventas':'Ventas','rep-inventario':'Inventario','rep-pedidos':'Pedidos','rep-compras':'Compras','rep-ganancias':'Ganancias'};
  const title = `Reporte de ${titles[tipo]||''}`;
  const barKey = tipo==='rep-ganancias'?'c':tipo==='rep-compras'?'g':'v';
  const barColor = tipo==='rep-ganancias'?T.green:tipo==='rep-compras'?T.orange:T.primary;

  return (
    <div>
      <PageHeader title={title} subtitle="Análisis del período"
        action={
          <div style={{display:'flex',gap:8}}>
            <Btn icon={Download} variant="secondary" size="sm" onClick={()=>{
              const csv=chartMonthly.map(r=>`${r.m},${r.v},${r.g},${r.c}`).join('\n');
              const blob=new Blob(['Mes,Ventas,Gastos,Ganancias\n'+csv],{type:'text/csv'});
              const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${title}.csv`;a.click();
            }}>Exportar CSV</Btn>
            <Btn icon={Printer} variant="secondary" size="sm" onClick={()=>window.print()}>Imprimir</Btn>
          </div>
        }/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:12,marginBottom:16}}>
        {[{l:'Total',v:'Bs.9,200',t:'↑ 15%',g:true},{l:'Operaciones',v:'47',t:'↑ 8',g:true},{l:'Promedio',v:'Bs.195',t:'↓ 2%',g:false},{l:'Mejor Mes',v:'Diciembre',t:''}].map((s,i)=>(
          <Card key={i} style={{padding:16}}>
            <p style={{fontSize:11,color:T.muted,margin:'0 0 4px',fontWeight:600}}>{s.l}</p>
            <p style={{fontSize:19,fontWeight:900,color:T.text,margin:'0 0 4px'}}>{s.v}</p>
            {s.t&&<span style={{fontSize:11,color:s.g?T.green:T.red,fontWeight:700}}>{s.t}</span>}
          </Card>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:14,marginBottom:14}}>
        <Card>
          <h4 style={{margin:'0 0 14px',fontSize:14,fontWeight:800}}>{title} — Mensual</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartMonthly}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border}/>
              <XAxis dataKey="m" tick={{fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11}} axisLine={false} tickLine={false} width={40}/>
              <Tooltip contentStyle={{fontFamily:'inherit',fontSize:12}}/>
              <Bar dataKey={barKey} fill={barColor} radius={[5,5,0,0]} maxBarSize={36}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h4 style={{margin:'0 0 12px',fontSize:14,fontWeight:800}}>Distribución</h4>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={60} dataKey="value" paddingAngle={2}>
                {pieData.map((e,i)=><Cell key={i} fill={pieColors[i]}/>)}
              </Pie>
              <Tooltip contentStyle={{fontFamily:'inherit',fontSize:11}}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:'flex',flexWrap:'wrap',gap:'4px 10px'}}>
            {pieData.map((d,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:4,fontSize:11,color:T.muted}}>
                <span style={{width:7,height:7,borderRadius:'50%',background:pieColors[i],display:'inline-block'}}/>{d.name} {d.value}%
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card style={{padding:0,overflow:'hidden'}}>
        <div style={{padding:'12px 18px',borderBottom:`1px solid ${T.border}`}}>
          <h4 style={{margin:0,fontSize:14,fontWeight:800}}>Detalle Mensual</h4>
        </div>
        <DataTable showActions={false} columns={[
          {key:'m',label:'Mes'},{key:'v',label:'Ventas',render:v=>`Bs.${v.toLocaleString()}`},
          {key:'g',label:'Gastos',render:v=>`Bs.${v.toLocaleString()}`},{key:'c',label:'Ganancias',render:v=>`Bs.${v.toLocaleString()}`},
          {key:'c',label:'Margen',render:(_,r)=><span style={{color:T.green,fontWeight:700}}>{((r.c/r.v)*100).toFixed(1)}%</span>},
        ]} data={chartMonthly}/>
      </Card>
    </div>
  );
};

export default Reportes;
