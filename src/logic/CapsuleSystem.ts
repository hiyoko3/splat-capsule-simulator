import SplatCapsuleContents from '@src/assets/SplatCapsuleContents.json';
import { CapsuleItem, SeasonCapsule } from '@src/models/CapsuleModel';

export class CapsuleSystem {
  private static singleton: CapsuleSystem = new CapsuleSystem();
  private capsuleContents: SeasonCapsule;
  private seasonItems: CapsuleItem[];

  static getInstance(): CapsuleSystem {
    if (CapsuleSystem.singleton == null) {
      CapsuleSystem.singleton = new CapsuleSystem();
    }

    return CapsuleSystem.singleton;
  }

  constructor() {
    this.capsuleContents = SplatCapsuleContents as SeasonCapsule;
    this.seasonItems = this.capsuleContents['drizzle'];
  }

  async print(): Promise<CapsuleItem> {
    // 加算されていく値
    let accumulateValue: number = 0.0;
    const randVal: number = (Math.floor(Math.random() * 1000) + 1) / 1000;

    // seasonItems は昇順であることが必須
    console.log('accumulateValue', accumulateValue, 'randVal', randVal);
    for (const capsuleItem of this.seasonItems) {
      accumulateValue += capsuleItem.probability;
      // 乱数が加算値以下ならアイテムを返却
      if (randVal < accumulateValue) {
        console.log('result', capsuleItem);
        return capsuleItem;
      }
    }
    throw new Error('should not reach here');
  }
}