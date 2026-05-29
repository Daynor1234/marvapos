// ── URL base de la API ───────────────────────────────────────
// Si tu WAMP corre en otro puerto, cámbialo aquí
const BASE = 'https://daynor.infinityfreeapp.com/api.php';


// ── Función interna para llamar a la API ─────────────────────
async function call(action, method = 'GET', body = null, extraParams = '') {
  const url = `${BASE}?action=${action}${extraParams}`;
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(url, options);
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || 'Error en la API');
  return data;
}

// ════════════════════════════════════════════════════════════
//  AUTH
// ════════════════════════════════════════════════════════════
export const login = (email, password) =>
  call('login', 'POST', { email, password });

// ════════════════════════════════════════════════════════════
//  CRUD GENÉRICO
//  Tablas: productos, clientes, ventas, pedidos,
//          proveedores, compras, caja, usuarios, categorias, marcas
// ════════════════════════════════════════════════════════════

/** Obtener todos los registros de una tabla */
export const getAll = (tabla) =>
  call(tabla, 'GET');

/** Crear un registro nuevo */
export const crear = (tabla, datos) =>
  call(tabla, 'POST', datos);

/** Actualizar un registro (debe incluir id) */
export const actualizar = (tabla, datos) =>
  call(tabla, 'PUT', datos);

/** Eliminar un registro por id */
export const eliminar = (tabla, id) =>
  call(tabla, 'DELETE', null, `&id=${id}`);

// ════════════════════════════════════════════════════════════
//  VENTA COMPLETA (descuenta stock automáticamente)
// ════════════════════════════════════════════════════════════
/**
 * @param {object} venta  - { id, fecha, cliente, items, total, estado, metodo }
 * @param {array}  items  - [{ id: 'P001', qty: 2 }, ...]
 */
export const registrarVenta = (venta, items) =>
  call('registrar-venta', 'POST', { venta, items });

// ════════════════════════════════════════════════════════════
//  HELPERS — accesos directos por módulo
// ════════════════════════════════════════════════════════════
export const API = {
  // Productos
  productos: {
    getAll:    ()      => getAll('productos'),
    crear:     (datos) => crear('productos', datos),
    actualizar:(datos) => actualizar('productos', datos),
    eliminar:  (id)    => eliminar('productos', id),
  },
  // Clientes
  clientes: {
    getAll:    ()      => getAll('clientes'),
    crear:     (datos) => crear('clientes', datos),
    actualizar:(datos) => actualizar('clientes', datos),
    eliminar:  (id)    => eliminar('clientes', id),
  },
  // Ventas
  ventas: {
    getAll:    ()              => getAll('ventas'),
    registrar: (venta, items) => registrarVenta(venta, items),
    eliminar:  (id)            => eliminar('ventas', id),
  },
  // Pedidos
  pedidos: {
    getAll:    ()      => getAll('pedidos'),
    crear:     (datos) => crear('pedidos', datos),
    actualizar:(datos) => actualizar('pedidos', datos),
    eliminar:  (id)    => eliminar('pedidos', id),
  },
  // Proveedores
  proveedores: {
    getAll:    ()      => getAll('proveedores'),
    crear:     (datos) => crear('proveedores', datos),
    actualizar:(datos) => actualizar('proveedores', datos),
    eliminar:  (id)    => eliminar('proveedores', id),
  },
  // Compras
  compras: {
    getAll:    ()      => getAll('compras'),
    crear:     (datos) => crear('compras', datos),
    actualizar:(datos) => actualizar('compras', datos),
    eliminar:  (id)    => eliminar('compras', id),
  },
  // Caja
  caja: {
    getAll:    ()      => getAll('caja'),
    crear:     (datos) => crear('caja', datos),
    eliminar:  (id)    => eliminar('caja', id),
  },
  // Usuarios
  usuarios: {
    getAll:    ()      => getAll('usuarios'),
    crear:     (datos) => crear('usuarios', datos),
    actualizar:(datos) => actualizar('usuarios', datos),
    eliminar:  (id)    => eliminar('usuarios', id),
  },
  // Categorías
  categorias: {
    getAll:    ()      => getAll('categorias'),
    crear:     (datos) => crear('categorias', datos),
    actualizar:(datos) => actualizar('categorias', datos),
    eliminar:  (id)    => eliminar('categorias', id),
  },
  // Marcas
  marcas: {
    getAll:    ()      => getAll('marcas'),
    crear:     (datos) => crear('marcas', datos),
    actualizar:(datos) => actualizar('marcas', datos),
    eliminar:  (id)    => eliminar('marcas', id),
  },
};