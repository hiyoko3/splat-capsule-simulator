<template>
  <app-header></app-header>
  <main>
    <h3 v-if="isGoldMode" class="flex align-center">
      ※※※ ゴールドモード突入！！！！このモードプレートしか出ません ※※※
      <button @click="offGoldMode">解除</button>
    </h3>
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

    <h2 class="my-16">ガチャ</h2>
    <div class="capsule-system flex justify-center align-center my-8">
      <img :src="CapsuleSystemImg" />
      <div class="mw-16">
        <button class="my-8" @click="startCapsuleSystem(1)">ガチャを引く</button>
        <button class="my-8" @click="startCapsuleSystem(10)">ガチャを引く(10連)</button>
      </div>
    </div>

    <h2 class="my-16">結果</h2>

    <div class="my-8">
      <h4>総額</h4>
      <div class="my-8 flex align-center">
        <img :src="IkaCoinImg" height="20" class="mw-8" />
        <span>{{ paidCoin.toLocaleString() }}</span>
      </div>
    </div>

    <div class="my-8 capsule-classification">
      <h4>内訳</h4>
      <p class="my-8">{{ capsuleClassification }}</p>
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
      <div v-if="groupModal" class="modal">
        <div class="modal-content flex justify-center wrap">
          <div v-for="(groupImg, idx) in groupList" :key="`group-img-${idx}`" class="modal-flex">
            <img :src="groupImg.imgSrc" class="capsule-img" />
          </div>
        </div>
      </div>

      <div v-if="itemModal" class="modal">
        <div class="modal-content flex justify-center wrap">
          <div v-for="(item, idx) in itemList" :key="`item-${idx}`" class="modal-flex">
            <img :src="item.item1.imgSrc" class="item-img" alt="no-item-image" />
            <p>
              {{ item.item1.name }}
              <span v-if="item.item2">/&nbsp;{{ item.item2.name }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="random-gold-salmon" @click="onGoldMode">
      <img :src="GoldSalmonImg" />
    </div>
  </main>
  <app-footer></app-footer>
</template>

<script lang="ts">
import CapsuleSystemImg from '@src/assets/capsule-system.svg';
import GoldSalmonImg from '@src/assets/gold-salmon.svg';
import IkaCoinImg from '@src/assets/ika-coin.svg';
import OctpusImg from '@src/assets/octpus.svg';
import SquidImg from '@src/assets/squid.svg';
import AppFooter from '@src/components/layouts/AppFooter.vue';
import AppHeader from '@src/components/layouts/AppHeader.vue';
import { CapsuleSystem } from '@src/logic/CapsuleSystem';
import { CapsuleColor, CapsuleGroup, CapsuleItems, Season } from '@src/models/CapsuleModel';
import { Ref, computed, defineComponent, onMounted, ref } from 'vue';

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
    const isGoldMode: Ref<boolean> = ref(false);
    // modal data
    const isModalState: Ref<boolean> = ref(true);
    const groupModal: Ref<boolean> = ref(false);
    const itemModal: Ref<boolean> = ref(false);
    // capsule data
    const groupList: Ref<CapsuleGroup[]> = ref([]);
    const itemList: Ref<CapsuleItems[]> = ref([]);
    const capsuleItemList: Ref<CapsuleItems[]> = ref([]);

    // local variable
    const timerSec: number = 500;
    const capsuleEachPaidCoin: number = 30000;

    const startCapsuleSystem = async (times: number): Promise<void> => {
      console.log('times', times);
      // extract group
      for (let i = 0; i < times; i++) {
        const capsuleGroup: CapsuleGroup = await capsuleSystem.extractGroup();
        groupList.value.push(capsuleGroup);
        itemList.value.push(await capsuleSystem.extractItem(capsuleGroup));
        paidCoin.value += capsuleEachPaidCoin;
      }

      if (isModalState.value) {
        groupModal.value = true;

        setTimeout(() => {
          groupModal.value = false;
          itemModal.value = true;

          setTimeout(() => {
            itemModal.value = false;

            for (let i = 0; i < times; i++) {
              capsuleItemList.value.unshift(itemList.value[i]);
              // increment count
              counter.value.total += 1;
              const capsuleColor: CapsuleColor = capsuleSystem.getCapsuleColor(groupList.value[i]);
              counter.value[capsuleColor] += 1;
            }

            groupList.value = [];
            itemList.value = [];
          }, timerSec + 750);
        }, timerSec + 500);
      } else {
        for (let i = 0; i < times; i++) {
          capsuleItemList.value.unshift(itemList.value[i]);
          // increment count
          counter.value.total += 1;
          const capsuleColor: CapsuleColor = capsuleSystem.getCapsuleColor(groupList.value[i]);
          counter.value[capsuleColor] += 1;
        }

        groupList.value = [];
        itemList.value = [];
      }
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

    const onGoldMode = (): void => {
      isGoldMode.value = true;
      capsuleSystem.setGoldMode(true);
      document.body.classList.add('gold-mode');
    };

    const offGoldMode = (): void => {
      isGoldMode.value = false;
      capsuleSystem.setGoldMode(false);
      document.body.classList.remove('gold-mode');
    };

    // random print gold salmon
    onMounted(() => {
      const mainElm: HTMLElement = document.querySelector('main') as HTMLElement;
      const goldSalmon: HTMLElement = mainElm.querySelector('.random-gold-salmon') as HTMLElement;
      const salmonWidth = goldSalmon.clientWidth;
      const salmonHeight = goldSalmon.clientHeight;

      let salmonVisible = false;
      setInterval((): void => {
        if (isGoldMode.value) {
          if (salmonVisible) {
            goldSalmon.style.opacity = '0.0';
            salmonVisible = false;
          }
          return;
        }
        // move salmon
        const height = mainElm.clientHeight;
        const width = mainElm.clientWidth;

        const newPosX = capsuleSystem.generateRandValue(0, width - salmonWidth);
        const newPosY = capsuleSystem.generateRandValue(0, height - salmonHeight);

        goldSalmon.style.top = `${newPosY}px`;
        goldSalmon.style.left = `${newPosX}px`;
        // visible salmon
        goldSalmon.style.opacity = salmonVisible ? '0.0' : '1.0';
        salmonVisible = !salmonVisible;
      }, 1500);
    });

    return {
      // modal
      isModalState,
      groupModal,
      itemModal,
      // view data
      seasonList,
      selectedSeason,
      paidCoin,
      capsuleClassification,
      // capsule master
      groupList,
      itemList,
      capsuleItemList,
      startCapsuleSystem,
      changeSeason,
      changeModalState,
      // gold salmon mode
      isGoldMode,
      onGoldMode,
      offGoldMode,
      // assets
      CapsuleSystemImg,
      SquidImg,
      OctpusImg,
      IkaCoinImg,
      GoldSalmonImg
    };
  }
});
</script>

<style lang="sass"></style>
