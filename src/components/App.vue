<template>
  <div>
    <app-header></app-header>

    <div>
      <p>test</p>
      <p>テスト</p>
    </div>
    <app-footer></app-footer>
  </div>
</template>

<script lang="ts">
import AppFooter from '@src/components/layouts/AppFooter.vue';
import AppHeader from '@src/components/layouts/AppHeader.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    'app-header': AppHeader,
    'app-footer': AppFooter
  },
  setup() {
    return {};
  }
});
</script>

<style lang="sass"></style>
