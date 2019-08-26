export interface IMenuItem {
  title: string,
  icon?: IMenuItemIcon,
  color?: string,
  active?: boolean,
  disabled?: boolean,
  groupTitle?: boolean,
  routing?: string,
  externalLink?: string,
  layout?: string;
  sub?: IMenuItemSub[],
  badge?: IMenuItemBadge
}

export interface IMenuItemIcon {
  class?: string,
  color?: string,
  bg?: string
}
export interface IMenuItemSub {
  title: string,
  icon?: string,
  color?: string,
  active?: boolean,
  disabled?: boolean,
  routing?: string,
  externalLink?: string,
  layout?: string;
  sub?: IMenuItemSub[]
}
export interface IMenuItemBadge {
  text?: string,
  color?: string,
  bg?: string
}
