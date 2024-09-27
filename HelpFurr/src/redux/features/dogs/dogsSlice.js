import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    dogs: [],
    selectedDogs: 0,
    
}

const dogsSlice = createSlice({
    name: 'dogs',
    initialState,
    reducers:{
        adoptDog: (state, action) => {
            const isExist = state.dogs.find((dogs) => dogs._id === action.payload._id);
            if(!isExist) {
                state.dogs.find({
                    ...action.payload, quantity: 1
                })
            } else {
                console.log()
            }
            state.selectedDogs = setSelectedDogs(state)
        }
    }
})

export const setSelectedDogs = (state) => state.dogs.reduce((total, dogs) => {
    return Number( total + dogs.quantity)
})