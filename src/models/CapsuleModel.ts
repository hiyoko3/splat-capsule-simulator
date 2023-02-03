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

export type CapsuleItems = {
  isTitleItem: boolean;
  item1: CapsuleItem;
  item2: CapsuleItem | null;
};

export type CapsuleItem = {
  id: number;
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
