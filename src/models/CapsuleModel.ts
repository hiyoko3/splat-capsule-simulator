export type CapsuleItem = {
  group: string;
  name: string;
  probability: number;
};

export type Season = 'chilli' | 'drizzle';

export type SeasonCapsule = {
  chilli: CapsuleItem[];
  drizzle: CapsuleItem[];
};
