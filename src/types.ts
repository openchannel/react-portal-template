import { Dispatch } from 'redux';
import { rootReducer } from './reducers';

export type RootState = ReturnType<typeof rootReducer>;
export type GetState = () => RootState;
export type TypedDispatch = Dispatch<any>;

export interface ErrorResponse {
  response: {
    data?: {
      code: string;
      status: number;
      message: string;
      errors?: {
        fields?: string;
        code?: string;
        message?: string;
      }[];
      'validation-errors'?: {
        field: string;
        message: string;
      }[];
    };
  };
}
