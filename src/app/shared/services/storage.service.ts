/*
  https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
*/
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService<T> {
  setSession(key: string, data: T): void {
    try {
      const serializedData = JSON.stringify(data);
      sessionStorage.setItem(key, serializedData);
    } catch (error) {
      console.error(`Error storing data for key ${key}: ${error}`);
    }
  }

  getSession(key: string): T {
    const serializedData = sessionStorage.getItem(key);

    if (serializedData) {
      try {
        return JSON.parse(serializedData);
      } catch (error) {
        console.error(`Error retrieving data for key ${key}: ${error}`);
      }
    }

    return null as T;
  }

  removeSession(key: string): void {
    sessionStorage.removeItem(key);
  }

  setLocal(key: string, data: T): void {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
    } catch (error) {
      console.error(`Error storing data for key ${key}: ${error}`);
    }
  }

  getLocal(key: string): T {
    const serializedData = localStorage.getItem(key);

    if (serializedData) {
      try {
        return JSON.parse(serializedData);
      } catch (error) {
        console.error(`Error retrieving data for key ${key}: ${error}`);
      }
    }

    return null as T;
  }

  removeLocal(key: string): void {
    localStorage.removeItem(key);
  }
}
