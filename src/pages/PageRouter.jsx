import { Package } from "lucide-react";
import { T, sc } from "../theme";
import { CrudPage, Badge } from "../components/ui";
import Dashboard from "./Dashboard";
import NuevaVenta from "./NuevaVenta";
import Reportes from "./Reportes";
import { CajaApertura, CierreCaja, Configuracion } from "./Caja";
import { MiPerfil, Seguridad } from "./Perfil";

const PageRouter = ({page,setPage,db}) => {
  const {products,setProducts,sales,setSales,clients,setClients,orders,setOrders,
    providers,setProviders,purchases,setPurchases,cajaMov,setCajaMov,users,setUsers,cats,setCats,brands,setBrands,cajaAbierta,setCajaAbierta,user,setUser} = db;

  // ── Categorías dinámicas para el select de productos ────────
  const catOptions = cats.map(c => c.nombre);

  // ── Campos de productos ──────────────────────────────────────
  const productFields = [
    {key:'foto',label:'Imagen del producto',type:'image',full:true},
    {key:'nombre',label:'Nombre',required:true},
    {key:'cat',label:'Categoría',options:catOptions.length ? catOptions : ['Ropa deportiva','Calzados deportivos','Accesorios deportivos']},
    {key:'marca',label:'Marca'},
    {key:'talla',label:'Talla',options:['XS','S','M','L','XL','XXL','28','30','32','34','36','38','40','42','44']},
    {key:'color',label:'Color',options:['Blanco','Negro','Azul','Rojo','Verde','Gris','Marrón','Rosa','Amarillo','Naranja','Celeste','Morado']},
    {key:'stock',label:'Stock',type:'number',default:0},
    {key:'stockMin',label:'Stock Mínimo',type:'number',default:5},
    {key:'precio',label:'Precio Minorista (Bs.)',type:'number',default:0},
    {key:'precioMay',label:'Precio Mayorista (Bs.)',type:'number',default:0},
    {key:'estado',label:'Estado',options:['Activo','Inactivo']},
  ];
  const productCols = [
    {key:'foto',label:'',render:(v,row)=>v?<img src={v} alt={row.nombre} style={{width:38,height:38,objectFit:'cover',borderRadius:7,display:'block'}}/>:<div style={{width:38,height:38,background:T.primaryLight,borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center'}}><Package size={15} color={T.primary}/></div>},
    {key:'id',label:'Código'},{key:'nombre',label:'Producto'},{key:'cat',label:'Categoría'},{key:'marca',label:'Marca'},
    {key:'stock',label:'Stock',render:v=><span style={{color:v===0?T.red:v<=3?T.orange:T.green,fontWeight:700}}>{v}</span>},
    {key:'precio',label:'Precio',render:v=>`Bs.${parseFloat(v||0).toFixed(2)}`},
    {key:'estado',label:'Estado',render:v=><Badge color={sc(v)}>{v}</Badge>},
  ];
  const productViewFields = [
    {key:'foto',label:'Imagen',full:true,render:v=>v?<img src={v} style={{width:120,height:120,objectFit:'cover',borderRadius:10,display:'block',marginTop:4}}/>:<span style={{color:T.muted,fontSize:12}}>Sin imagen</span>},
    {key:'id',label:'Código'},{key:'nombre',label:'Nombre'},{key:'cat',label:'Categoría'},
    {key:'marca',label:'Marca'},{key:'talla',label:'Talla'},{key:'color',label:'Color'},
    {key:'stock',label:'Stock actual'},{key:'stockMin',label:'Stock mínimo'},
    {key:'precio',label:'Precio minorista',render:v=>`Bs.${parseFloat(v||0).toFixed(2)}`},
    {key:'precioMay',label:'Precio mayorista',render:v=>`Bs.${parseFloat(v||0).toFixed(2)}`},
    {key:'estado',label:'Estado',render:v=><Badge color={sc(v)}>{v}</Badge>},
  ];

  // ── Columnas y campos de ventas ──────────────────────────────
  const salesCols = [
    {key:'id',label:'#'},{key:'fecha',label:'Fecha'},{key:'cliente',label:'Cliente'},
    {key:'items',label:'Ítems'},{key:'total',label:'Total',render:v=>`Bs.${parseFloat(v||0).toFixed(2)}`},
    {key:'estado',label:'Estado',render:v=><Badge color={sc(v)}>{v}</Badge>},
    {key:'metodo',label:'Pago'},
  ];
  const salesFields = [
    {key:'cliente',label:'Cliente',required:true},
    {key:'fecha',label:'Fecha',type:'date'},
    {key:'items',label:'N° Ítems',type:'number',default:1},
    {key:'total',label:'Total (Bs.)',type:'number',default:0},
    {key:'metodo',label:'Método de pago',options:['Efectivo','Tarjeta','Transferencia','QR']},
    {key:'estado',label:'Estado',options:['Completada','Cotización','Devuelta','Anulada']},
    {key:'notas',label:'Notas',full:true},
  ];
  const cotizacionFields = [
    {key:'cliente',label:'Cliente',required:true},
    {key:'fecha',label:'Fecha',type:'date'},
    {key:'items',label:'N° Ítems',type:'number',default:1},
    {key:'total',label:'Total (Bs.)',type:'number',default:0},
    {key:'metodo',label:'Método de pago',options:['Efectivo','Tarjeta','Transferencia','QR']},
    {key:'notas',label:'Observaciones',full:true},
  ];
  const devolucionFields = [
    {key:'cliente',label:'Cliente',required:true},
    {key:'fecha',label:'Fecha',type:'date'},
    {key:'items',label:'N° Ítems',type:'number',default:1},
    {key:'total',label:'Total devuelto (Bs.)',type:'number',default:0},
    {key:'metodo',label:'Método devolución',options:['Efectivo','Tarjeta','Transferencia']},
    {key:'motivo',label:'Motivo de devolución',full:true},
  ];

  // ── Campos de pedidos ────────────────────────────────────────
  const orderFields = [
    {key:'cliente',label:'Cliente',required:true},
    {key:'fecha',label:'Fecha pedido',type:'date'},
    {key:'fechaEntrega',label:'Fecha entrega',type:'date'},
    {key:'items',label:'N° Ítems',type:'number',default:1},
    {key:'total',label:'Total (Bs.)',type:'number',default:0},
    {key:'estado',label:'Estado',options:['Pendiente','Entregado','Cancelado']},
    {key:'notas',label:'Notas',full:true},
  ];
  const orderCols = [
    {key:'id',label:'#'},{key:'fecha',label:'Fecha'},{key:'fechaEntrega',label:'Entrega'},
    {key:'cliente',label:'Cliente'},
    {key:'total',label:'Total',render:v=>`Bs.${parseFloat(v||0).toFixed(2)}`},
    {key:'estado',label:'Estado',render:v=><Badge color={sc(v)}>{v}</Badge>},
  ];
  const orderViewFields = orderFields.map(f=>({key:f.key,label:f.label}));

  // ── Campos de proveedores ────────────────────────────────────
  const providerFields = [
    {key:'nombre',label:'Empresa',required:true,full:true},
    {key:'ruc',label:'NIT'},{key:'contacto',label:'Contacto'},
    {key:'tel',label:'Teléfono'},{key:'email',label:'Email',type:'email'},
    {key:'dir',label:'Dirección',full:true},
    {key:'estado',label:'Estado',options:['Activo','Inactivo']},
  ];
  const providerCols = [
    {key:'id',label:'Código'},{key:'nombre',label:'Empresa'},{key:'ruc',label:'NIT'},
    {key:'contacto',label:'Contacto'},{key:'tel',label:'Teléfono'},
    {key:'estado',label:'Estado',render:v=><Badge color={sc(v)}>{v}</Badge>},
  ];

  // ── Campos de compras ────────────────────────────────────────
  const purchaseFields = [
    {key:'proveedor',label:'Proveedor',required:true,full:true},
    {key:'fecha',label:'Fecha',type:'date'},
    {key:'productos',label:'N° Productos',type:'number',default:1},
    {key:'cantidad',label:'Cantidad total',type:'number',default:0},
    {key:'total',label:'Total (Bs.)',type:'number',default:0},
    {key:'estado',label:'Estado',options:['Pendiente','Recibido']},
  ];
  const purchaseCols = [
    {key:'id',label:'#'},{key:'fecha',label:'Fecha'},{key:'proveedor',label:'Proveedor'},
    {key:'productos',label:'Productos'},{key:'cantidad',label:'Cantidad'},
    {key:'total',label:'Total',render:v=>`Bs.${parseFloat(v||0).toFixed(2)}`},
    {key:'estado',label:'Estado',render:v=><Badge color={sc(v)}>{v}</Badge>},
  ];
  const purchaseViewFields = purchaseFields.map(f=>({key:f.key,label:f.label}));

  // ── Campos de usuarios ───────────────────────────────────────
  const userFields = [
    {key:'nombre',label:'Nombre completo',required:true,full:true},
    {key:'email',label:'Email',type:'email',required:true},
    {key:'password',label:'Contraseña',type:'password'},
    {key:'rol',label:'Rol',options:['Administrador','Vendedor','Almacén','Cajero']},
    {key:'estado',label:'Estado',options:['Activo','Inactivo']},
  ];
  const userCols = [
    {key:'id',label:'ID'},{key:'nombre',label:'Nombre'},{key:'email',label:'Email'},
    {key:'rol',label:'Rol',render:v=><Badge color="purple">{v}</Badge>},
    {key:'estado',label:'Estado',render:v=><Badge color={sc(v)}>{v}</Badge>},
    {key:'ultimo',label:'Último acceso'},
  ];

  // ── Campos de categorías ─────────────────────────────────────
  const catFields = [
    {key:'nombre',label:'Nombre',required:true},
    {key:'descripcion',label:'Descripción',full:true},
    {key:'estado',label:'Estado',options:['Activo','Inactivo']},
  ];
  const catCols = [
    {key:'id',label:'ID'},{key:'nombre',label:'Nombre'},{key:'descripcion',label:'Descripción'},
    {key:'estado',label:'Estado',render:v=><Badge color={sc(v)}>{v}</Badge>},
  ];

  // ── Campos de marcas ─────────────────────────────────────────
  const brandFields = [
    {key:'nombre',label:'Nombre',required:true},
    {key:'pais',label:'País de origen'},
    {key:'estado',label:'Estado',options:['Activo','Inactivo']},
  ];
  const brandCols = [
    {key:'id',label:'ID'},{key:'nombre',label:'Marca'},{key:'pais',label:'País'},
    {key:'estado',label:'Estado',render:v=><Badge color={sc(v)}>{v}</Badge>},
  ];

  // ── Campos de caja ───────────────────────────────────────────
  const cajaCols = [
    {key:'id',label:'#'},{key:'fecha',label:'Fecha/Hora'},{key:'concepto',label:'Concepto'},
    {key:'tipo',label:'Tipo',render:v=><Badge color={v==='Ingreso'?'green':'red'}>{v}</Badge>},
    {key:'monto',label:'Monto',render:v=>`Bs.${parseFloat(v||0).toFixed(2)}`},
    {key:'saldo',label:'Saldo',render:v=>`Bs.${parseFloat(v||0).toFixed(2)}`},
  ];
  const cajaFields = [
    {key:'tipo',label:'Tipo',options:['Ingreso','Egreso']},
    {key:'concepto',label:'Concepto',required:true,full:true},
    {key:'monto',label:'Monto (Bs.)',type:'number',default:0},
  ];

  switch(page){
    case 'dashboard':
      return <Dashboard setPage={setPage} products={products} sales={sales} clients={clients} orders={orders}/>;

    case 'nueva-venta':
      return <NuevaVenta products={products} setProducts={setProducts} sales={sales} setSales={setSales} cats={cats} cajaAbierta={cajaAbierta} user={user}/>;

    // ── VENTAS ────────────────────────────────────────────────
    case 'listado-ventas':
      return <CrudPage tabla="ventas" title="Listado de Ventas" data={sales} setData={setSales}
        columns={salesCols} formFields={salesFields} addLabel="Nueva Venta" idPrefix="V"/>;

    case 'cotizaciones':
      return <CrudPage tabla="ventas" title="Cotizaciones" data={sales} setData={setSales}
        columns={salesCols} formFields={[...cotizacionFields,{key:'estado',label:'Estado',options:['Cotización'],default:'Cotización'}]}
        addLabel="Nueva Cotización" idPrefix="V"
        filterFn={r=>r.estado==='Cotización'}/>;

    case 'devoluciones':
      return <CrudPage tabla="ventas" title="Devoluciones" data={sales} setData={setSales}
        columns={salesCols} formFields={[...devolucionFields,{key:'estado',label:'Estado',options:['Devuelta'],default:'Devuelta'}]}
        addLabel="Registrar Devolución" idPrefix="V"
        filterFn={r=>r.estado==='Devuelta'}/>;

    case 'ventas-anuladas':
      return <CrudPage tabla="ventas" title="Ventas Anuladas" data={sales} setData={setSales}
        columns={salesCols} formFields={salesFields}
        filterFn={r=>r.estado==='Anulada'}/>;

    // ── PEDIDOS ───────────────────────────────────────────────
    case 'nuevo-pedido':
      return <CrudPage tabla="pedidos" title="Pedidos" data={orders} setData={setOrders}
        columns={orderCols} formFields={orderFields} viewFields={orderViewFields}
        addLabel="Crear Pedido" idPrefix="PD"/>;

    case 'pedidos-pendientes':
      return <CrudPage tabla="pedidos" title="Pedidos Pendientes" data={orders} setData={setOrders}
        columns={orderCols} formFields={orderFields} viewFields={orderViewFields}
        addLabel="Nuevo Pedido" idPrefix="PD" filterFn={r=>r.estado==='Pendiente'}/>;

    case 'pedidos-entregados':
      return <CrudPage tabla="pedidos" title="Pedidos Entregados" data={orders} setData={setOrders}
        columns={orderCols} formFields={orderFields} viewFields={orderViewFields}
        idPrefix="PD" filterFn={r=>r.estado==='Entregado'}/>;

    case 'pedidos-cancelados':
      return <CrudPage tabla="pedidos" title="Pedidos Cancelados" data={orders} setData={setOrders}
        columns={orderCols} formFields={orderFields} viewFields={orderViewFields}
        idPrefix="PD" filterFn={r=>r.estado==='Cancelado'}/>;

    // ── INVENTARIO ────────────────────────────────────────────
    case 'productos':
      return <CrudPage tabla="productos" title="Productos" subtitle="Gestión de inventario"
        data={products} setData={setProducts} columns={productCols}
        formFields={productFields} viewFields={productViewFields}
        addLabel="Nuevo Producto" idPrefix="P"/>;

    case 'categorias':
      return <CrudPage tabla="categorias" title="Categorías" data={cats} setData={setCats}
        columns={catCols} formFields={catFields} addLabel="Nueva Categoría" idPrefix="CAT"/>;

    case 'marcas':
      return <CrudPage tabla="marcas" title="Marcas" data={brands} setData={setBrands}
        columns={brandCols} formFields={brandFields} addLabel="Nueva Marca" idPrefix="M"/>;

    case 'tallas':
      return <CrudPage title="Tallas"
        data={['XS','S','M','L','XL','XXL','28','30','32','34','36','38','40','42','44'].map((t,i)=>({
          id:`T${String(i+1).padStart(2,'0')}`,talla:t,
          tipo:['28','30','32','34','36'].includes(t)?'Pantalón':isNaN(t)?'Ropa':'Calzado',estado:'Activo'
        }))}
        setData={()=>{}}
        columns={[{key:'id',label:'ID'},{key:'talla',label:'Talla'},{key:'tipo',label:'Tipo'},{key:'estado',label:'Estado',render:v=><Badge color={sc(v)}>{v}</Badge>}]}
        formFields={[{key:'talla',label:'Talla',required:true},{key:'tipo',label:'Tipo',options:['Ropa','Pantalón','Calzado']},{key:'estado',label:'Estado',options:['Activo','Inactivo']}]}
        addLabel="Nueva Talla" idPrefix="T"/>;

    case 'colores':
      return <CrudPage title="Colores"
        data={['Blanco','Negro','Azul','Rojo','Verde','Gris','Marrón','Rosa','Amarillo','Naranja','Celeste','Morado'].map((c,i)=>({
          id:`COL${String(i+1).padStart(2,'0')}`,nombre:c,estado:'Activo'
        }))}
        setData={()=>{}}
        columns={[{key:'id',label:'ID'},{key:'nombre',label:'Color'},{key:'estado',label:'Estado',render:v=><Badge color={sc(v)}>{v}</Badge>}]}
        formFields={[{key:'nombre',label:'Nombre del color',required:true},{key:'estado',label:'Estado',options:['Activo','Inactivo']}]}
        addLabel="Nuevo Color" idPrefix="COL"/>;

    case 'entradas':
      return <CrudPage title="Entradas de Productos"
        data={purchases.filter(p=>p.estado==='Recibido')}
        setData={()=>{}}
        columns={[{key:'id',label:'#'},{key:'fecha',label:'Fecha'},{key:'proveedor',label:'Proveedor'},{key:'productos',label:'Prods.'},{key:'cantidad',label:'Cant.'},{key:'total',label:'Costo',render:v=>`Bs.${parseFloat(v||0).toFixed(2)}`}]}
        formFields={[{key:'proveedor',label:'Proveedor',required:true},{key:'fecha',label:'Fecha',type:'date'},{key:'productos',label:'N° Productos',type:'number'},{key:'cantidad',label:'Cantidad',type:'number'},{key:'total',label:'Costo total',type:'number'}]}
        addLabel="Nueva Entrada" idPrefix="E"/>;

    case 'kardex':
      return <CrudPage title="Kardex" subtitle="Movimientos de inventario"
        data={[
          {id:'K001',fecha:'25/05/2026',producto:'Camiseta Básica',tipo:'Salida',cant:3,stock:45,motivo:'Venta V-0042'},
          {id:'K002',fecha:'24/05/2026',producto:'Pantalón Jeans',tipo:'Entrada',cant:10,stock:13,motivo:'Compra C001'},
        ]}
        setData={()=>{}}
        columns={[{key:'id',label:'#'},{key:'fecha',label:'Fecha'},{key:'producto',label:'Producto'},{key:'tipo',label:'Tipo',render:v=><Badge color={v==='Entrada'?'green':'orange'}>{v}</Badge>},{key:'cant',label:'Cant.'},{key:'stock',label:'Stock'},{key:'motivo',label:'Motivo'}]}
        formFields={[{key:'producto',label:'Producto',required:true},{key:'tipo',label:'Tipo',options:['Entrada','Salida']},{key:'cant',label:'Cantidad',type:'number'},{key:'motivo',label:'Motivo',full:true}]}
        addLabel="Registrar Movimiento" idPrefix="K"/>;

    case 'por-agotarse':
      return <CrudPage tabla="productos" title="Productos por Agotarse" subtitle="Stock ≤ stock mínimo"
        data={products.filter(p=>p.stock<=p.stockMin)} setData={setProducts}
        columns={productCols} formFields={productFields} viewFields={productViewFields} idPrefix="P"/>;

    // ── COMPRAS ───────────────────────────────────────────────
    case 'nueva-compra':
      return <CrudPage tabla="compras" title="Nueva Compra" data={purchases} setData={setPurchases}
        columns={purchaseCols} formFields={purchaseFields} viewFields={purchaseViewFields}
        addLabel="Registrar Compra" idPrefix="CP"/>;

    case 'historial-compras':
      return <CrudPage tabla="compras" title="Historial de Compras" data={purchases} setData={setPurchases}
        columns={purchaseCols} formFields={purchaseFields} viewFields={purchaseViewFields}
        addLabel="Nueva Compra" idPrefix="CP"/>;

    // ── CLIENTES ──────────────────────────────────────────────
    case 'cl-minoristas':
      return <CrudPage tabla="clientes" title="Clientes Minoristas" data={clients} setData={setClients}
        columns={clientCols} formFields={clientFields} viewFields={clientFields.map(f=>({key:f.key,label:f.label}))}
        addLabel="Nuevo Cliente" idPrefix="C" filterFn={r=>r.tipo==='Minorista'}/>;

    case 'cl-mayoristas':
      return <CrudPage tabla="clientes" title="Clientes Mayoristas" data={clients} setData={setClients}
        columns={clientCols} formFields={clientFields} viewFields={clientFields.map(f=>({key:f.key,label:f.label}))}
        addLabel="Nuevo Cliente" idPrefix="C" filterFn={r=>r.tipo==='Mayorista'}/>;

    // ── PROVEEDORES ───────────────────────────────────────────
    case 'proveedores':
      return <CrudPage tabla="proveedores" title="Proveedores" data={providers} setData={setProviders}
        columns={providerCols} formFields={providerFields} viewFields={providerFields.map(f=>({key:f.key,label:f.label}))}
        addLabel="Nuevo Proveedor" idPrefix="PR"/>;

    // ── CAJA ──────────────────────────────────────────────────
    case 'apertura-caja':
      return <CajaApertura cajaMov={cajaMov} setCajaMov={setCajaMov} cajaAbierta={cajaAbierta} setCajaAbierta={setCajaAbierta} user={user}/>;

    case 'cierre-caja':
      return <CierreCaja cajaMov={cajaMov} setCajaMov={setCajaMov} sales={sales} cajaAbierta={cajaAbierta} setCajaAbierta={setCajaAbierta} user={user}/>;

    case 'movimientos':
      return <CrudPage tabla="caja" title="Movimientos de Caja" data={cajaMov} setData={setCajaMov}
        columns={cajaCols} formFields={cajaFields}
        addLabel="Registrar Movimiento" idPrefix="M"/>;

    // ── REPORTES ──────────────────────────────────────────────
    case 'rep-ventas':
    case 'rep-inventario':
    case 'rep-pedidos':
    case 'rep-compras':
    case 'rep-ganancias':
      return <Reportes tipo={page}/>;

    // ── ADMINISTRACIÓN ────────────────────────────────────────
    case 'usuarios':
      return <CrudPage tabla="usuarios" title="Usuarios" data={users} setData={setUsers}
        columns={userCols} formFields={userFields} addLabel="Nuevo Usuario" idPrefix="U"/>;

    case 'roles':
      return <CrudPage title="Roles y Permisos"
        data={[
          {id:'R01',nombre:'Administrador',permisos:'Acceso total',usuarios:1,estado:'Activo'},
          {id:'R02',nombre:'Vendedor',permisos:'Ventas y consultas',usuarios:1,estado:'Activo'},
          {id:'R03',nombre:'Almacén',permisos:'Solo inventario',usuarios:1,estado:'Activo'},
          {id:'R04',nombre:'Cajero',permisos:'Caja y ventas',usuarios:1,estado:'Activo'},
        ]}
        setData={()=>{}}
        columns={[{key:'id',label:'ID'},{key:'nombre',label:'Rol'},{key:'permisos',label:'Permisos'},{key:'usuarios',label:'Usuarios'},{key:'estado',label:'Estado',render:v=><Badge color={sc(v)}>{v}</Badge>}]}
        formFields={[{key:'nombre',label:'Nombre del rol',required:true},{key:'permisos',label:'Descripción permisos',full:true},{key:'estado',label:'Estado',options:['Activo','Inactivo']}]}
        addLabel="Nuevo Rol" idPrefix="R"/>;

    case 'configuracion':
      return <Configuracion/>;

    case 'mi-perfil':
      return <MiPerfil user={user} setUser={setUser}/>;

    case 'seguridad':
      return <Seguridad user={user}/>;

    default:
      return <Dashboard setPage={setPage} products={products} sales={sales} clients={clients} orders={orders}/>;
  }
};

// clientCols helper usado arriba
const clientCols = [
  {key:'id',label:'Código'},{key:'nombre',label:'Nombre'},{key:'tel',label:'Teléfono'},
  {key:'email',label:'Email'},{key:'tipo',label:'Tipo',render:v=><Badge color={v==='Mayorista'?'blue':'purple'}>{v}</Badge>},
  {key:'estado',label:'Estado',render:v=><Badge color={sc(v)}>{v}</Badge>},
];
const clientFields = [
  {key:'nombre',label:'Nombre completo',required:true,full:true},
  {key:'ci',label:'CI / NIT'},{key:'tel',label:'Teléfono'},
  {key:'email',label:'Email',type:'email'},{key:'dir',label:'Dirección',full:true},
  {key:'tipo',label:'Tipo',options:['Minorista','Mayorista']},
  {key:'estado',label:'Estado',options:['Activo','Inactivo']},
];

export default PageRouter;