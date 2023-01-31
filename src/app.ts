/* === Main Application bundle file === */
// Libraries
import '@src/assets/styles.scss';
import App from '@src/components/App.vue';
import { createApp } from 'vue';

const app = createApp(App);

app.mount('#app');

/* === Service Worker === */
// Checking support a `service worker`
if (
  'serviceWorker' in navigator &&
  (window.location.protocol === 'https:' || window.location.hostname === 'localhost')
) {
  // const registration = runtime.register()
} else {
  console.warn("This browser doesn't use a service worker");
}
