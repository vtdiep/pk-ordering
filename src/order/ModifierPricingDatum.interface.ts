import { OptionPricingData } from './OptionPricingData.interface';

export type ModifierPricingDatum = {
  modifier: number;
  options: OptionPricingData[];
  price: number;
};
