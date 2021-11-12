const ListRecieptDeleteInitialState = [],
    listRecieptDeleteReducer = (state = ListRecieptDeleteInitialState, action) => {
        switch (action.type) {
            case "ADD_MAHD_RECIEPT":
                return [...state, action.MAHD];
            case "DELETE_MAHD_RECIEPT":
                return state.filter((value) => value !== action.MAHD);
            case "RESET_MAHD_RECIEPT":
                return state = []
            default:
                return state
        }
    }

export default listRecieptDeleteReducer;