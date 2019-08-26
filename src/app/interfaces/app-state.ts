import { IPageData } from './page-data';
import { IAppSettings } from './settings';
import { IService } from './service';

export interface IAppState {
  pageData: IPageData;
  appSettings: IAppSettings,
  services: IService[]
}
