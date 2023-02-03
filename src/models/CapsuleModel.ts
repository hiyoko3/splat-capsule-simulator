export type CapsuleGroup = {
  id: number;
  name: string;
  weight: number;
  imgSrc: string;
};

export type CapsuleGroupItem = {
  groupId: number;
  itemIds_1: number[];
  itemIds_2: number[];
};

export type CapsuleItem = {
  itemId: number;
  name: string;
  cssStyle: string;
  imgSrc: string;
};

export type SeasonCapsule = {
  chilli: {
    groups: CapsuleGroup[];
    groupItems: CapsuleGroupItem[];
    items: CapsuleItem[];
  };
  drizzle: {
    groups: CapsuleGroup[];
    groupItems: CapsuleGroupItem[];
    items: CapsuleItem[];
  };
};

export type Season = 'chilli' | 'drizzle';
