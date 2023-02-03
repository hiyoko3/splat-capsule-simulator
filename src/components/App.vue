<template>
  <app-header></app-header>

  <main>
    <p class="panel">スプラトゥーン3 のガチャシミュレーターです</p>
    <select @change="changeSeason">
      <option v-for="(season, idx) in seasonList" :key="`season-${idx}`" :value="season">{{ season }}</option>
    </select>
    <img :src="CapsuleSystemImg" width="150" height="130" />
    <button @click="startCapsuleSystem">ガチャを引く</button>
    <div>
      <p>結果</p>
      <p>{{ resultList }}</p>
      <div class="flex wrap">
        <div v-for="(result, idx) in resultList" :key="`result-${idx}`" class="card">
          <p>{{ result }}</p>
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
import { CapsuleGroup, CapsuleItem, Season } from '@src/models/CapsuleModel';
import { Ref, defineComponent, ref } from 'vue';

export default defineComponent({
  components: {
    'app-header': AppHeader,
    'app-footer': AppFooter
  },
  setup() {
    const capsuleSystem: CapsuleSystem = CapsuleSystem.getInstance();
    const seasonList: string[] = ['chilli', 'drizzle'];
    let resultList: Ref<CapsuleItem[]> = ref([]);

    const startCapsuleSystem = async (): Promise<void> => {
      const capsuleGroup: CapsuleGroup = await capsuleSystem.extractGroup();
      const capsuleItem: CapsuleItem[] = await capsuleSystem.extractItem(capsuleGroup);

      console.log(capsuleGroup, capsuleItem);
      // resultList.value.push(capsuleItem);
    };

    const changeSeason = (payload: Event): void => {
      const { target } = payload;

      if (target instanceof HTMLSelectElement) {
        capsuleSystem.setSeason(target.value as Season);
      }
    };
    return {
      seasonList,
      resultList,
      startCapsuleSystem,
      changeSeason,
      CapsuleSystemImg
    };
  }
});
</script>

<style lang="sass"></style>
