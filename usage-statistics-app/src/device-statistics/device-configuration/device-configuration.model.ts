export interface ConfigOptions {
    category: string;
    value: string;
    key: string;
  }

export interface Configuration {
  className: string;
  avgMinMea: number;
  avgMaxMea: number | string;
  monthlyThreshold: number;
}
