import { createAsyncThunk } from '@reduxjs/toolkit';

// Simulated API call
export const fetchUsers = createAsyncThunk(
  'counter/fetchCounter',
  async () => {
    const response = await fetch(`http://192.168.16.107:3000/api/r/get-all-user`,{
      method : "GET",
      credentials : "include"
    })
    const data = await response.json()
    return data;
  }
);
