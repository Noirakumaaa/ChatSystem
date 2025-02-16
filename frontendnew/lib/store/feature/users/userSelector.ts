import { RootState } from '@/lib/store/index';

export const selectUsers = (state: RootState) => state.users.allUsers;
export const selectCurrentUsers = (state: RootState) => state.users.currentUser;
export const selectUsersLoading = (state: RootState) => state.users.loading;
