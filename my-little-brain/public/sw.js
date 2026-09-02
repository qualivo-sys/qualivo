/* Service worker de My Little Brain: recibe los avisos push y abre la app al tocarlos. */

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (evento) => evento.waitUntil(self.clients.claim()));

self.addEventListener('push', (evento) => {
  let datos = { titulo: 'My Little Brain', cuerpo: 'Tienes algo pendiente.', url: '/app' };
  try {
    datos = { ...datos, ...evento.data.json() };
  } catch (_) {
    if (evento.data) datos.cuerpo = evento.data.text();
  }
  evento.waitUntil(
    self.registration.showNotification(datos.titulo, {
      body: datos.cuerpo,
      icon: '/icono-192.png',
      badge: '/icono-192.png',
      tag: datos.tag || 'mlb',
      renotify: true,
      data: { url: datos.url },
    }),
  );
});

self.addEventListener('notificationclick', (evento) => {
  evento.notification.close();
  const url = (evento.notification.data && evento.notification.data.url) || '/app';
  evento.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((ventanas) => {
      for (const ventana of ventanas) {
        if ('focus' in ventana) {
          ventana.navigate(url);
          return ventana.focus();
        }
      }
      return self.clients.openWindow(url);
    }),
  );
});
