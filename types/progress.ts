export interface Measurement {
  date: Date;
  value: number;
}

export interface BodyProgress {
  arms: Measurement[];
  chest: Measurement[];
  thighs: Measurement[];
  waist: Measurement[];
  weight: Measurement[];
}