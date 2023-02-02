<template>
  <app-header></app-header>

  <main>
    <p class="panel">スプラトゥーン3 のガチャシミュレーターです</p>
    <img :src="CapsuleSystemImg" width="150" height="130" />
    <button @click="startCapsuleSystem">ガチャを引く</button>
    <div>
      <p>結果</p>
      <div class="flex wrap">
        <div v-for="(result, idx) in resultList" :key="`result-${idx}`" class="card">
          <p>{{ result.group }}</p>
        </div>
      </div>
    </div>
  </main>
  <app-footer></app-footer>
</template>

<script lang="ts">
import CapsuleSystemImg from '@src/assets/capsule-system.svg';
import AppFooter from '@src/components/layouts/AppFooter.vue';
import AppHeader from '@src/components/layouts/AppHeader.vue';
import { CapsuleSystem } from '@src/logic/CapsuleSystem';
import { CapsuleItem } from '@src/models/CapsuleModel.js';
import { Ref, defineComponent, ref } from 'vue';

export default defineComponent({
  components: {
    'app-header': AppHeader,
    'app-footer': AppFooter
  },
  setup() {
    const capsuleSystem: CapsuleSystem = new CapsuleSystem();
    let resultList: Ref<CapsuleItem[]> = ref([]);

    const startCapsuleSystem = async (): Promise<void> => {
      const capsuleItem: CapsuleItem = await capsuleSystem.print();
      resultList.value.push(capsuleItem);
    };
    return {
      startCapsuleSystem,
      resultList,
      CapsuleSystemImg
    };
  }
});
</script>

<style lang="sass"></style>
