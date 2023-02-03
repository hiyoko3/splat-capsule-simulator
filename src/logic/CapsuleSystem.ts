import SeasonCapsuleGroup from '@src/assets/CapsuleGroup.json';
import SeasonCapsuleGroupItem from '@src/assets/CapsuleGroupItem.json';
import SeasonCapsuleItem from '@src/assets/CapsuleItem.json';
import { CapsuleGroup, CapsuleItem, CapsuleItems, Season, SeasonCapsule } from '@src/models/CapsuleModel';
import { CapsuleGroupItem } from './../models/CapsuleModel';

export class CapsuleSystem {
  // singleton pattern
  private static singleton: CapsuleSystem = new CapsuleSystem();
  // capsule item master data
  private seasonCapsule: SeasonCapsule = {
    chilli: {
      groups: [],
      groupItems: [],
      items: []
    },
    drizzle: {
      groups: [],
      groupItems: [],
      items: []
    }
  };
  //
  private allSeason: Season[] = ['chilli', 'drizzle'];
  // A season is selected by user.
  private selectedSeason: Season = 'drizzle';
  // season item
  private capsuleGroups: CapsuleGroup[];
  private capsuleGroupItems: CapsuleGroupItem[];
  private capsuleItems: CapsuleItem[];
  // 二つ名 groupId
  private plateLabelGroupId: number = 13;
  // ロッカーアイテム groupId
  private lockerIds: number[] = [9, 10];

  /**
   * create instance
   * @returns CapsuleSystem
   */
  static getInstance(): CapsuleSystem {
    if (CapsuleSystem.singleton == null) {
      CapsuleSystem.singleton = new CapsuleSystem();
    }

    return CapsuleSystem.singleton;
  }

  constructor() {
    this.allSeason.forEach((season: Season) => {
      this.seasonCapsule[season] = {
        groups: SeasonCapsuleGroup[season],
        groupItems: SeasonCapsuleGroupItem[season],
        items: SeasonCapsuleItem[season]
      };
    });

    // determine season
    this.capsuleGroups = this.seasonCapsule[this.selectedSeason].groups;
    this.capsuleGroupItems = this.seasonCapsule[this.selectedSeason].groupItems;
    this.capsuleItems = this.seasonCapsule[this.selectedSeason].items;
  }

  /**
   * Extract a capsule group
   * @returns Promise<CapsuleGroup>
   */
  async extractGroup(): Promise<CapsuleGroup> {
    if (this.capsuleGroups.length < 1) {
      throw new Error(`${this.selectedSeason} has not items.`);
    }

    // 加算されていく値
    let accumulatedVal: number = 0.0;
    // ガチャを押下した瞬間の値
    const userWeightVal: number = this.generateRandValue(1, 1000) / 1000;

    // extract a capsule group
    for (const capsuleGroup of this.capsuleGroups) {
      accumulatedVal += capsuleGroup.weight;

      // 値が加算値以下ならアイテムを返却
      if (userWeightVal < accumulatedVal) {
        return capsuleGroup;
      }
    }
    throw new Error('should not reach here');
  }

  /**
   * Extract a capsule item
   * @param group CapsuleGroup
   */
  async extractItem(group: CapsuleGroup): Promise<CapsuleItems> {
    const groupItem: CapsuleGroupItem | undefined = this.capsuleGroupItems.find(
      (groupItem: CapsuleGroupItem) => groupItem.groupId === group.id
    );

    if (groupItem === undefined) {
      throw new Error(`Not found capsule group item, group: ${group}`);
    }

    const randVal: number = this.generateRandValue(0, groupItem.itemIds_1.length - 1);
    const item1Id: number = groupItem.itemIds_1[randVal];

    const item1: CapsuleItem | undefined = this.capsuleItems.find(
      (capsuleItem: CapsuleItem) => capsuleItem.id === item1Id
    );

    if (item1 === undefined) {
      throw new Error(`Not found capsule item1, groupItemId: ${groupItem.groupId}, item1Id: ${item1Id}`);
    }

    const result: CapsuleItems = {
      group: group,
      item1: item1,
      item2: null
    };

    if (group.id === this.plateLabelGroupId) {
      const randVal: number = this.generateRandValue(0, groupItem.itemIds_2.length);
      const item2Id: number = groupItem.itemIds_2[randVal];

      const item2: CapsuleItem | undefined = this.capsuleItems.find(
        (capsuleItem: CapsuleItem) => capsuleItem.id === item2Id
      );

      if (item2 === undefined) {
        throw new Error(`Not found capsule item2, groupItem: ${groupItem}, item2Id: ${item2Id}`);
      }
      result.item2 = item2;
    } else if (this.lockerIds.includes(group.id)) {
      // remove item1Id
      const index: number = groupItem.itemIds_2.indexOf(item1Id);
      groupItem.itemIds_2.splice(index, 1);
      const item2Id: number = groupItem.itemIds_2[randVal];

      const item2: CapsuleItem | undefined = this.capsuleItems.find(
        (capsuleItem: CapsuleItem) => capsuleItem.id === item2Id
      );

      if (item2 === undefined) {
        throw new Error(`Not found capsule item2, groupItem: ${groupItem}, item2Id: ${item2Id}`);
      }
      result.item2 = item2;
    }
    return result;
  }

  /**
   * set the season
   * @param season Splat Season
   */
  async setSeason(season: Season): Promise<void> {
    this.capsuleGroups = this.seasonCapsule[season].groups;
    this.capsuleGroupItems = this.seasonCapsule[season].groupItems;
    this.capsuleItems = this.seasonCapsule[season].items;
    this.selectedSeason = season;
  }

  /**
   * generate rand value
   * @param min min number
   * @param max max number
   * @returns rand value
   */
  private generateRandValue(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
