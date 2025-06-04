import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { deleteCardAttachmentAPI } from '~/apis'
// import { updateCardInBoard } from '~/redux/activeBoard/activeBoardSlice' // Import action từ activeBoardSlice

// Khởi tạo giá trị của một Slice trong redux
const initialState = {
  currentActiveCard: null,
  isShowModalActiveCard: false
}

// Khởi tạo một slice trong kho lưu trữ - redux store
export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  // Reducers: Nơi xử lý dữ liệu đồng bộ
  reducers: {
    // Lưu ý luôn là ở đây cần cặp ngoặc nhọn cho function trong reducer cho dù code bên trong chỉ có 1 dòng, đây là rule của Redux
    // https://redux-toolkit.js.org/usage/immer-reducers#mutating-and-returning-state
    showModalActiveCard: (state) => {
      state.isShowModalActiveCard = true
    },

    // Clear data và đóng modal ActiveCard
    clearAndHideCurrentActiveCard: (state) => {
      state.currentActiveCard = null
      state.isShowModalActiveCard = false
    },

    updateCurrentActiveCard: (state, action) => {
      const fullCard = action.payload // action.payload là chuẩn đặt tên nhận dữ liệu vào reducer, ở đây chúng ta gán nó ra một biến có nghĩa hơn
      // xử lý dữ liệu nếu cần thiết
      //...
      // Update lại dữ liệu currentActiveCard trong Redux
      state.currentActiveCard = fullCard
    }
  },
  // ExtraReducers: Xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    // Xử lý kết quả sau khi gọi API xóa attachment
    builder.addCase(deleteCardAttachment.fulfilled, (state, action) => {
      // action.payload là dữ liệu card sau khi đã xóa attachment từ backend
      state.currentActiveCard = action.payload;
      // Cập nhật card trong activeBoard state
      // updateCardInBoard(action.payload); // Gọi action để cập nhật board - Đã xóa dòng này
    });
  }
})

// Action creators are generated for each case reducer function
// Actions: Là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Để ý ở trên thì không thấy properties actions đâu cả, bởi vì những cái actions này đơn giản là được thằng redux tạo tự động theo tên của reducer nhé.
export const {
  clearAndHideCurrentActiveCard,
  updateCurrentActiveCard,
  showModalActiveCard
} = activeCardSlice.actions

// Selectors: Là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiveCard
}

export const selectIsShowModalActiveCard = (state) => {
  return state.activeCard.isShowModalActiveCard
}

// Cái file này tên là activeCardSlice NHƯNG chúng ta sẽ export một thứ tên là Reducer, mọi người lưu ý :D
// export default activeCardSlice.reducer
export const activeCardReducer = activeCardSlice.reducer

// Async Thunks (Xử lý các tác vụ bất đồng bộ với API)
export const deleteCardAttachment = createAsyncThunk(
  'activeCard/deleteCardAttachment',
  async ({ cardId, attachmentId }) => {
    const response = await deleteCardAttachmentAPI(cardId, attachmentId);
    return response; // Backend trả về card đã cập nhật
  }
);
