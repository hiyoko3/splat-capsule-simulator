<template>
  <div>
    <app-header></app-header>

    <div>
      <p>test</p>
      <p>テスト</p>
      <img :src="CapsuleSystemImg" width="50" height="30" />
      <button @click="startCapsuleSystem">ガチャ</button>
      <div>
        <p>結果</p>
        <p v-for="(result, idx) in resultList" :key="`result-${idx}`">{{ result }}</p>
      </div>
    </div>
    <app-footer></app-footer>
  </div>
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
    let resultList: Ref<unknown[]> = ref([]);

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
