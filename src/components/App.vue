<template>
  <app-header></app-header>

  <main>
    <div class="panel">スプラトゥーン3 のガチャシミュレーターです</div>

    <div class="flex justify-start align-center my-16 form">
      <select class="form-select mr-8" @change="changeSeason">
        <option
          v-for="(season, idx) in seasonList"
          :key="`season-${idx}`"
          :value="season"
          :selected="season === selectedSeason"
        >
          {{ season }}
        </option>
      </select>

      <div class="form-checkbox mw-8">
        <input id="modal-state" type="checkbox" :checked="isModalState" @change="changeModalState" />
        <label for="modal-state">ガチャ演出</label>
      </div>
    </div>

    <div class="capsule-system flex justify-center align-center my-8">
      <img :src="CapsuleSystemImg" />
      <button class="mw-16" @click="startCapsuleSystem">ガチャを引く</button>
    </div>

    <h3>結果</h3>
    <div
      v-for="(capsuleItem, idx) in capsuleItemList"
      :key="`capsuleItem-${idx}`"
      class="capsule-item text-center flex justify-start align-center"
    >
      <div class="mw-16 text-center">
        <img :src="capsuleItem.item1.imgSrc" alt="no-image" />
      </div>
      <span class="capsule-group-label">{{ capsuleItem.group.name }}</span>
      <p>
        {{ capsuleItem.item1.name }}
        <span v-if="capsuleItem.item2">/&nbsp;{{ capsuleItem.item2.name }}</span>
      </p>
    </div>

    <div v-if="groupModal || itemModal" class="overlay">
      <div v-if="groupModal" :class="`modal ${modalCssStyle}`">
        <div class="modal-content">
          <img :src="group.imgSrc" class="capsule-img" />
        </div>
      </div>

      <div v-if="itemModal" :class="`modal ${modalCssStyle}`">
        <div class="modal-content">
          <img :src="item.item1.imgSrc" class="item-img" alt="no-item-image" />
          <p>
            {{ item.item1.name }}
            <span v-if="item.item2">/&nbsp;{{ item.item2.name }}</span>
          </p>
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
    const seasonList: Ref<string[]> = ref(capsuleSystem.getAllSeason);
    const selectedSeason: Ref<string> = ref(capsuleSystem.getSelectedSeason);
    const isModalState: Ref<boolean> = ref(true);
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
      group: group.value,
      item1: {
        id: 0,
        name: '',
        cssStyle: '',
        imgSrc: ''
      },
      item2: null
    });
    const capsuleItemList: Ref<CapsuleItems[]> = ref([]);

    // local variable
    const timerSec = 500;
    const startCapsuleSystem = async (): Promise<void> => {
      // extract group
      group.value = await capsuleSystem.extractGroup();
      item.value = await capsuleSystem.extractItem(group.value);

      if (isModalState.value) {
        groupModal.value = true;
        modalCssStyle.value = 'popup';

        setTimeout(() => {
          modalCssStyle.value = 'popout';
        }, timerSec);

        setTimeout(() => {
          groupModal.value = false;

          itemModal.value = true;
          modalCssStyle.value = 'popup';
          setTimeout(() => {
            modalCssStyle.value = 'popout';
          }, timerSec + 250);

          setTimeout(() => {
            itemModal.value = false;
          }, timerSec + 750);
        }, timerSec + 500);
      }

      capsuleItemList.value.unshift(item.value);
    };

    const closeModal = (): void => {
      groupModal.value = false;
    };

    const changeSeason = (payload: Event): void => {
      const target: EventTarget | null = payload.target;

      if (target instanceof HTMLSelectElement) {
        capsuleSystem.setSeason(target.value as Season);
      }
    };

    const changeModalState = (payload: Event): void => {
      const target: EventTarget | null = payload.target;
      if (target instanceof HTMLInputElement) {
        isModalState.value = target.checked;
      }
    };
    return {
      // modal
      isModalState,
      groupModal,
      closeModal,
      itemModal,
      modalCssStyle,
      // capsule master
      seasonList,
      selectedSeason,
      group,
      item,
      capsuleItemList,
      startCapsuleSystem,
      changeSeason,
      changeModalState,
      // assets
      CapsuleSystemImg
    };
  }
});
</script>

<style lang="sass"></style>
