import * as ServiceActions from '../actions/service.actions';
import { IService } from '../../interfaces/service';

export type Action = ServiceActions.All;

// Reducer function
export function patientsReducer(data: IService[] = [], action: Action) {
  switch (action.type) {
    case ServiceActions.SET: {
      return action.data;
    }
    case ServiceActions.EDIT: {
      data.forEach((patient: IService, index) => {
        if (patient.id === action.data.id) {
          data[index] = action.data;
        }
      });

      return [...data];
    }
    case ServiceActions.ADD: {
      return [action.data, ...data];
    }
    case ServiceActions.DELETE: {
      const newData = data.filter((patient: IService) => {
        return patient.id !== action.id;
      });

      console.log(newData)
      return newData;
    }
    case ServiceActions.OPEN_MODAL: {
      return true;
    }
    case ServiceActions.CLOSE_MODAL: {
      return false;
    }
    default: {
      return data;
    }
  }
}
