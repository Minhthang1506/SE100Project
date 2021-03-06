const countryInitialState = [],
    countryReducer = (state = countryInitialState, action) => {
        switch (action.type) {
            case "GET_DATA":
                return state;
            case "UPDATE_DATA_PROVINCE":
                return [...state, action.data];
            default:
                return state
        }
    }

export default countryReducer;