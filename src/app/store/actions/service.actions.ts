import { Action } from '@ngrx/store';
import { IService } from '../../interfaces/service';

export const SET = '[Services] Set';
export const ADD = '[Services] Add';
export const EDIT = '[Services] Edit';
export const DELETE = '[Services] Delete';
export const OPEN_MODAL = '[Services] Open modal';
export const CLOSE_MODAL = '[Services] Close modal';

export class Set implements Action {
  readonly type = SET;

  constructor(public data: IService[]) {}
}

export class Add implements Action {
  readonly type = ADD;

  constructor(public data: IService) {}
}

export class Edit implements Action {
  readonly type = EDIT;

  constructor(public data: IService) {}
}

export class Delete implements Action {
  readonly type = DELETE;

  constructor(public id: string) {}
}

export class OpenModal implements Action {
  readonly type = OPEN_MODAL;
}

export class CloseModal implements Action {
  readonly type = CLOSE_MODAL;
}

export type All = Set | Add | Edit | Delete | OpenModal | CloseModal;
