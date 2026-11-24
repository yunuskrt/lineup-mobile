// The slice of the Expo app config that names the store pages
export type StoreConfig = {
  ios?: { appStoreUrl?: string };
  android?: { playStoreUrl?: string };
};

export type StoreLink = {
  // Where the latest version is, said whether or not it links
  line: string;
  // Null: no store page yet, so no Update button
  url: string | null;
};
