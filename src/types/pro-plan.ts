// The /pro screen's plan; pending while the session loads
export type ProPlan = 'pending' | 'free' | 'pro';

export type ProRow = {
  feature: string;
  // Null: not included in that plan
  free: string | null;
  pro: string | null;
};
