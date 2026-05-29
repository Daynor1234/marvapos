export const chartMonthly = [
  {m:'Ene',v:4200,g:2100,c:2100},{m:'Feb',v:3800,g:1900,c:1900},
  {m:'Mar',v:5200,g:2600,c:2600},{m:'Abr',v:4800,g:2400,c:2400},
  {m:'May',v:6300,g:3100,c:3200},{m:'Jun',v:5900,g:2900,c:3000},
  {m:'Jul',v:7200,g:3500,c:3700},{m:'Ago',v:6800,g:3200,c:3600},
  {m:'Sep',v:7500,g:3700,c:3800},{m:'Oct',v:8100,g:3900,c:4200},
  {m:'Nov',v:7800,g:3800,c:4000},{m:'Dic',v:9200,g:4400,c:4800},
];

export const pieData = [
  {name:'Ropa',value:65},{name:'Calzado',value:20},
  {name:'Accesorios',value:10},{name:'Otros',value:5}
];

export const pieColors = ['#7C3AED','#059669','#D97706','#2563EB'];

export const INIT_PRODUCTS = [
  {id:'P001',nombre:'Camiseta Básica',cat:'Ropa',marca:'Nike',talla:'M',color:'Blanco',stock:45,precio:25.00,precioMay:22.00,precioMin:25.00,stockMin:5,estado:'Activo',foto:''},
  {id:'P002',nombre:'Pantalón Jeans Slim',cat:'Ropa',marca:"Levi's",talla:'32',color:'Azul',stock:3,precio:89.90,precioMay:80.00,precioMin:89.90,stockMin:5,estado:'Activo',foto:''},
  {id:'P003',nombre:'Zapatillas Running',cat:'Calzado',marca:'Adidas',talla:'42',color:'Negro',stock:12,precio:150.00,precioMay:135.00,precioMin:150.00,stockMin:3,estado:'Activo',foto:''},
  {id:'P004',nombre:'Polo Manga Corta',cat:'Ropa',marca:'Lacoste',talla:'L',color:'Verde',stock:0,precio:65.00,precioMay:58.00,precioMin:65.00,stockMin:5,estado:'Inactivo',foto:''},
  {id:'P005',nombre:'Chaqueta de Cuero',cat:'Ropa',marca:'H&M',talla:'XL',color:'Marrón',stock:8,precio:220.00,precioMay:195.00,precioMin:220.00,stockMin:2,estado:'Activo',foto:''},
  {id:'P006',nombre:'Bermuda Sport',cat:'Ropa',marca:'Nike',talla:'M',color:'Gris',stock:2,precio:45.00,precioMay:38.00,precioMin:45.00,stockMin:5,estado:'Activo',foto:''},
  {id:'P007',nombre:'Vestido Floral',cat:'Ropa',marca:'Zara',talla:'S',color:'Rosa',stock:18,precio:75.00,precioMay:67.00,precioMin:75.00,stockMin:3,estado:'Activo',foto:''},
  {id:'P008',nombre:'Sneakers Casual',cat:'Calzado',marca:'Converse',talla:'40',color:'Blanco',stock:1,precio:110.00,precioMay:98.00,precioMin:110.00,stockMin:3,estado:'Activo',foto:''},
];

export const INIT_SALES = [
  {id:'V-0042',fecha:'25/05/2026',cliente:'Juan Pérez',items:3,total:285.00,estado:'Completada',metodo:'Efectivo'},
  {id:'V-0041',fecha:'25/05/2026',cliente:'María García',items:1,total:65.00,estado:'Completada',metodo:'Tarjeta'},
  {id:'V-0040',fecha:'24/05/2026',cliente:'Carlos López',items:5,total:520.00,estado:'Completada',metodo:'Transferencia'},
  {id:'V-0039',fecha:'24/05/2026',cliente:'Ana Martínez',items:2,total:175.00,estado:'Anulada',metodo:'Efectivo'},
  {id:'V-0038',fecha:'23/05/2026',cliente:'Luis Torres',items:4,total:360.00,estado:'Completada',metodo:'Tarjeta'},
  {id:'V-0037',fecha:'23/05/2026',cliente:'Rosa Flores',items:1,total:89.90,estado:'Completada',metodo:'Efectivo'},
];

export const INIT_CLIENTS = [
  {id:'C001',nombre:'Juan Pérez',ci:'1234567',tel:'987654321',email:'juan@gmail.com',dir:'Av. Principal 123',tipo:'Minorista',estado:'Activo',compras:15,total:1250.00},
  {id:'C002',nombre:'María García',ci:'2345678',tel:'912345678',email:'maria@gmail.com',dir:'Jr. Flores 456',tipo:'Mayorista',estado:'Activo',compras:8,total:5800.00},
  {id:'C003',nombre:'Carlos López',ci:'3456789',tel:'955512345',email:'carlos@gmail.com',dir:'Calle Lima 789',tipo:'Mayorista',estado:'Activo',compras:22,total:12500.00},
  {id:'C004',nombre:'Ana Martínez',ci:'4567890',tel:'944478901',email:'ana@gmail.com',dir:'Av. Sur 321',tipo:'Minorista',estado:'Activo',compras:6,total:480.00},
  {id:'C005',nombre:'Luis Torres',ci:'5678901',tel:'933389012',email:'luis@gmail.com',dir:'Jr. Norte 567',tipo:'Minorista',estado:'Activo',compras:11,total:920.00},
];

export const INIT_ORDERS = [
  {id:'PD-015',fecha:'25/05/2026',fechaEntrega:'28/05/2026',cliente:'Carlos López',items:2,total:345.00,estado:'Pendiente',notas:''},
  {id:'PD-014',fecha:'24/05/2026',fechaEntrega:'26/05/2026',cliente:'María García',items:1,total:150.00,estado:'Entregado',notas:''},
  {id:'PD-013',fecha:'23/05/2026',fechaEntrega:'25/05/2026',cliente:'Juan Pérez',items:3,total:175.00,estado:'Pendiente',notas:'Llamar antes'},
  {id:'PD-012',fecha:'22/05/2026',fechaEntrega:'24/05/2026',cliente:'Ana Martínez',items:1,total:75.00,estado:'Cancelado',notas:''},
  {id:'PD-011',fecha:'21/05/2026',fechaEntrega:'23/05/2026',cliente:'Luis Torres',items:2,total:220.00,estado:'Entregado',notas:''},
];

export const INIT_PROVIDERS = [
  {id:'PR001',nombre:'Distribuidora Lima SAC',ruc:'20123456789',contacto:'Jorge Ríos',tel:'999888777',email:'lima@dist.com',dir:'Av. Industrial 100',estado:'Activo'},
  {id:'PR002',nombre:'Importadora Textil SA',ruc:'20987654321',contacto:'Carmen Ruiz',tel:'998877665',email:'textil@imp.com',dir:'Jr. Comercio 250',estado:'Activo'},
  {id:'PR003',nombre:'Confecciones Sur EIRL',ruc:'20456789012',contacto:'Miguel Soto',tel:'997766554',email:'sur@conf.com',dir:'Calle Sur 400',estado:'Inactivo'},
];

export const INIT_PURCHASES = [
  {id:'CP-001',fecha:'20/05/2026',proveedor:'Distribuidora Lima SAC',productos:5,cantidad:50,total:2500.00,estado:'Recibido'},
  {id:'CP-002',fecha:'15/05/2026',proveedor:'Importadora Textil SA',productos:3,cantidad:30,total:5800.00,estado:'Recibido'},
  {id:'CP-003',fecha:'10/05/2026',proveedor:'Confecciones Sur EIRL',productos:4,cantidad:40,total:3200.00,estado:'Pendiente'},
];

export const INIT_CAJA = [
  {id:'M001',fecha:'25/05/2026 08:30',tipo:'Ingreso',concepto:'Apertura de caja',monto:500.00,saldo:500.00},
  {id:'M002',fecha:'25/05/2026 10:15',tipo:'Ingreso',concepto:'Venta V-0042',monto:285.00,saldo:785.00},
  {id:'M003',fecha:'25/05/2026 11:30',tipo:'Ingreso',concepto:'Venta V-0041',monto:65.00,saldo:850.00},
  {id:'M004',fecha:'25/05/2026 14:00',tipo:'Egreso',concepto:'Gastos de limpieza',monto:30.00,saldo:820.00},
];

export const INIT_USERS = [
  {id:'U001',nombre:'Admin Principal',email:'admin@marvapos.com',rol:'Administrador',estado:'Activo',ultimo:'25/05/2026'},
  {id:'U002',nombre:'Vendedor 1',email:'vend1@marvapos.com',rol:'Vendedor',estado:'Activo',ultimo:'25/05/2026'},
  {id:'U003',nombre:'Almacenero',email:'alm@marvapos.com',rol:'Almacén',estado:'Activo',ultimo:'24/05/2026'},
];

export const INIT_CATS_OLD = [
  {id:'CAT01',nombre:'Ropa',descripcion:'Prendas de vestir',productos:6,estado:'Activo'},
  {id:'CAT02',nombre:'Calzado',descripcion:'Zapatos y zapatillas',productos:2,estado:'Activo'},
  {id:'CAT03',nombre:'Accesorios',descripcion:'Complementos y accesorios',productos:0,estado:'Activo'},
];

export const INIT_BRANDS = [
  {id:'M01',nombre:'Nike',pais:'EE.UU',productos:3,estado:'Activo'},
  {id:'M02',nombre:"Levi's",pais:'EE.UU',productos:1,estado:'Activo'},
  {id:'M03',nombre:'Adidas',pais:'Alemania',productos:1,estado:'Activo'},
  {id:'M04',nombre:'H&M',pais:'Suecia',productos:1,estado:'Activo'},
  {id:'M05',nombre:'Zara',pais:'España',productos:1,estado:'Activo'},
];

export const MENU = [
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

export const INIT_CATS = [
  {id:'CAT01',nombre:'Calzados deportivos',   descripcion:'Calzado para deporte en general',     productos:0,estado:'Activo'},
  {id:'CAT02',nombre:'Tenis deportivos',       descripcion:'Zapatillas y tenis para deporte',     productos:0,estado:'Activo'},
  {id:'CAT03',nombre:'Cachos',                 descripcion:'Botines y cachos deportivos',         productos:0,estado:'Activo'},
  {id:'CAT04',nombre:'Ropa deportiva',         descripcion:'Ropa deportiva en general',           productos:0,estado:'Activo'},
  {id:'CAT05',nombre:'Poleras deportivas',     descripcion:'Camisetas y poleras deportivas',      productos:0,estado:'Activo'},
  {id:'CAT06',nombre:'Shorts deportivos',      descripcion:'Shorts y bermudas deportivas',        productos:0,estado:'Activo'},
  {id:'CAT07',nombre:'Buzos deportivos',       descripcion:'Buzos y conjuntos deportivos',        productos:0,estado:'Activo'},
  {id:'CAT08',nombre:'Chaquetas deportivas',   descripcion:'Chaquetas y cortavientos deportivos', productos:0,estado:'Activo'},
  {id:'CAT09',nombre:'Medias deportivas',      descripcion:'Medias y calcetines deportivos',      productos:0,estado:'Activo'},
  {id:'CAT10',nombre:'Accesorios deportivos',  descripcion:'Accesorios varios para deporte',      productos:0,estado:'Activo'},
  {id:'CAT11',nombre:'Balones deportivos',     descripcion:'Balones de fútbol, básquet, etc.',    productos:0,estado:'Activo'},
];