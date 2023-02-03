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
      <div class="flex wrap">
        <div v-for="(capsuleItem, idx) in capsuleItemList" :key="`capsuleItem-${idx}`" class="capsule-item">
          <p>{{ capsuleItem.item1.name }}</p>
        </div>
      </div>
    </div>

    <div v-if="groupModal || itemModal" class="overlay">
      <div v-if="groupModal" :class="`modal ${modalCssStyle}`">
        <div class="modal-content">
          <img :src="group.imgSrc" width="150" height="130" />
        </div>
      </div>

      <div v-if="itemModal" :class="`modal ${modalCssStyle}`">
        <div class="modal-content">
          <img :src="item.item1.imgSrc" width="150" height="130" />
          <p>{{ item.item1.name }}</p>
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
import { CapsuleGroup, CapsuleItems, Season } from '@src/models/CapsuleModel';
import { Ref, defineComponent, ref } from 'vue';

export default defineComponent({
  components: {
    'app-header': AppHeader,
    'app-footer': AppFooter
  },
  setup() {
    // capsule logic
    const capsuleSystem: CapsuleSystem = CapsuleSystem.getInstance();
    // data
    const seasonList: string[] = ['chilli', 'drizzle'];
    const groupModal: Ref<boolean> = ref(false);
    const modalCssStyle: Ref<string> = ref('');
    const itemModal: Ref<boolean> = ref(false);
    const group: Ref<CapsuleGroup> = ref({
      id: 0,
      name: '',
      weight: 0,
      imgSrc: ''
    });
    const item: Ref<CapsuleItems> = ref({
      isTitleItem: false,
      item1: {
        id: 0,
        name: '',
        cssStyle: '',
        imgSrc: ''
      },
      item2: null
    });
    const capsuleItemList: Ref<CapsuleItems[]> = ref([]);

    const startCapsuleSystem = async (): Promise<void> => {
      // extract group
      groupModal.value = true;
      modalCssStyle.value = 'popup';
      group.value = await capsuleSystem.extractGroup();
      item.value = await capsuleSystem.extractItem(group.value);

      setTimeout(() => {
        modalCssStyle.value = 'popout';
      }, 1500);

      setTimeout(() => {
        groupModal.value = false;
        itemModal.value = true;
        modalCssStyle.value = 'popup';
        setTimeout(() => {
          modalCssStyle.value = 'popout';
        }, 1500);

        setTimeout(() => {
          itemModal.value = false;
        }, 2000);
      }, 2000);

      console.log(group.value, item.value);
      capsuleItemList.value.push(item.value);
    };

    const closeModal = (): void => {
      groupModal.value = false;
    };

    const changeSeason = (payload: Event): void => {
      const { target } = payload;

      if (target instanceof HTMLSelectElement) {
        capsuleSystem.setSeason(target.value as Season);
      }
    };
    return {
      // modal
      groupModal,
      closeModal,
      itemModal,
      modalCssStyle,
      // capsule master
      seasonList,
      group,
      item,
      capsuleItemList,
      startCapsuleSystem,
      changeSeason,
      // assets
      CapsuleSystemImg
    };
  }
});
</script>

<style lang="sass"></style>
