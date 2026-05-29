export const T = {
  primary: '#7C3AED', primaryHover: '#6D28D9', primaryLight: '#EDE9FE',
  green: '#059669', greenLight: '#D1FAE5',
  orange: '#D97706', orangeLight: '#FEF3C7',
  red: '#DC2626', redLight: '#FEE2E2',
  blue: '#2563EB', blueLight: '#DBEAFE',
  text: '#111827', muted: '#6B7280', border: '#E5E7EB',
  bg: '#F4F5F7', white: '#FFFFFF',
  shadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
  shadowMd: '0 4px 16px rgba(0,0,0,0.10)',
};

export const sc = s => {
  if(['Completada','Activo','Entregado','Recibido'].includes(s)) return 'green';
  if(['Anulada','Inactivo','Cancelado'].includes(s)) return 'red';
  if(['Pendiente','Cotización','Devuelta'].includes(s)) return 'orange';
  return 'purple';
};

export const genId = prefix => `${prefix}${String(Math.floor(Math.random()*9000)+1000)}`;
