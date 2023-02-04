<template>
  <main>
    <app-header></app-header>
    <div class="panel flex align-center">
      <img :src="SquidImg" height="30" class="mr-8" />
      スプラトゥーン3 のガチャシミュレーターです。金カプセルが出ない人はストレス発散に使ってください。
      <img :src="OctpusImg" height="30" class="ml-8" />
    </div>

    <h2 class="my-16">オプション</h2>
    <div class="flex justify-start align-center my-16 form">
      <div class="form-select mr-16">
        <label for="capsule-season">シーズン</label>
        <select id="capsule-season" @change="changeSeason">
          <option
            v-for="(season, idx) in seasonList"
            :key="`season-${idx}`"
            :value="season"
            :selected="season === selectedSeason"
          >
            {{ season }}
          </option>
        </select>
      </div>

      <div class="form-checkbox ml-16">
        <input id="modal-state" type="checkbox" :checked="isModalState" @change="changeModalState" />
        <label for="modal-state">ガチャ演出</label>
      </div>
    </div>

    <div class="flex align-center">
      <p>総額:</p>
      <img :src="IkaCoinImg" height="20" class="mw-8" />
      <p>{{ paidCoin.toLocaleString() }}</p>
    </div>

    <h2 class="my-16">ガチャ</h2>
    <div class="capsule-system flex justify-center align-center my-8">
      <img :src="CapsuleSystemImg" />
      <button class="mw-16" @click="startCapsuleSystem">ガチャを引く</button>
    </div>

    <h2 class="my-16">結果</h2>

    <div class="capsule-classification">
      <h4>内訳</h4>
      <p class="">{{ capsuleClassification }}</p>
    </div>

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
import IkaCoinImg from '@src/assets/ika-coin.svg';
import OctpusImg from '@src/assets/octpus.svg';
import SquidImg from '@src/assets/squid.svg';
import AppFooter from '@src/components/layouts/AppFooter.vue';
import AppHeader from '@src/components/layouts/AppHeader.vue';
import { CapsuleSystem } from '@src/logic/CapsuleSystem';
import { CapsuleColor, CapsuleGroup, CapsuleItems, Season } from '@src/models/CapsuleModel';
import { Ref, computed, defineComponent, ref } from 'vue';

export default defineComponent({
  components: {
    'app-header': AppHeader,
    'app-footer': AppFooter
  },
  setup() {
    // capsule logic
    const capsuleSystem: CapsuleSystem = CapsuleSystem.getInstance();
    // view data
    const seasonList: Ref<string[]> = ref(capsuleSystem.getAllSeason);
    const selectedSeason: Ref<string> = ref(capsuleSystem.getSelectedSeason);
    const paidCoin: Ref<number> = ref(0);
    const counter: Ref<{
      total: number;
      gold: number;
      silver: number;
      bronze: number;
      red: number;
      violet: number;
      blue: number;
    }> = ref({
      total: 0,
      gold: 0,
      silver: 0,
      bronze: 0,
      red: 0,
      violet: 0,
      blue: 0
    });
    // modal data
    const isModalState: Ref<boolean> = ref(true);
    const groupModal: Ref<boolean> = ref(false);
    const modalCssStyle: Ref<string> = ref('');
    // capsule data
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
    const timerSec: number = 500;
    const capsuleEachPaidCoin: number = 30000;

    const startCapsuleSystem = async (): Promise<void> => {
      // extract group
      group.value = await capsuleSystem.extractGroup();
      item.value = await capsuleSystem.extractItem(group.value);
      paidCoin.value += capsuleEachPaidCoin;

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
            capsuleItemList.value.unshift(item.value);
            // increment count
            counter.value.total += 1;
            const capsuleColor: CapsuleColor = capsuleSystem.getCapsuleColor(group.value);
            counter.value[capsuleColor] += 1;
          }, timerSec + 750);
        }, timerSec + 500);
      } else {
        capsuleItemList.value.unshift(item.value);
        // increment count
        counter.value.total += 1;
        const capsuleColor: CapsuleColor = capsuleSystem.getCapsuleColor(group.value);
        counter.value[capsuleColor] += 1;
      }
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

    const capsuleClassification = computed((): string => {
      return `総試行数: ${counter.value.total}, 金: ${counter.value.gold}, 銀: ${counter.value.silver}, 銅: ${counter.value.bronze}, 赤: ${counter.value.red}, 紫: ${counter.value.violet}, 青: ${counter.value.blue}`;
    });
    return {
      // modal
      isModalState,
      groupModal,
      closeModal,
      itemModal,
      modalCssStyle,
      // view data
      seasonList,
      selectedSeason,
      paidCoin,
      capsuleClassification,
      // capsule master
      group,
      item,
      capsuleItemList,
      startCapsuleSystem,
      changeSeason,
      changeModalState,
      // assets
      CapsuleSystemImg,
      SquidImg,
      OctpusImg,
      IkaCoinImg
    };
  }
});
</script>

<style lang="sass"></style>
