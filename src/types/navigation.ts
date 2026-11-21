export type TabName = 'play' | 'archive' | 'profile';

export type TabItem = {
  name: TabName;
  href: `/${TabName}`;
  label: string;
};
