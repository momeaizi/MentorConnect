import { AxiosError } from 'axios';

export interface ErrorResponse {
  status?: string;
  message?: string;
  email?: string;
}


export const isAxiosError = (error: unknown): error is AxiosError<ErrorResponse> => {
  return (error as AxiosError)?.isAxiosError === true;
};
