import { create } from 'zustand'

// creating authstroe hook 
export const useAuthStore = create((set)=> ({

    auth:{
        username:'',
        active:false
    },
    setUsername : (name) => set((state) => ({auth : {...state.auth, username : name}}))

})); 