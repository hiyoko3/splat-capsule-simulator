/* === Main Application bundle file === */
// Libraries
import App from '@src/components/App.vue';
import { createApp } from 'vue';

// import assets
import '@src/assets/blue.svg';
import '@src/assets/bronze.svg';
import '@src/assets/gear-power-10.svg';
import '@src/assets/gold.svg';
import '@src/assets/no-image.svg';
import '@src/assets/object.svg';
import '@src/assets/plate-label.svg';
import '@src/assets/red.svg';
import '@src/assets/silver.svg';
import '@src/assets/sticker.svg';
import '@src/assets/styles.scss';
import '@src/assets/violet.svg';

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
