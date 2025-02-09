import React from 'react';

export const AdminContext = React.createContext();

export const initialState = {
  navigation:
    {
      currentCourse: {
        id: null,
      },
      currentLesson: {
        id: null,
      },
      currentQuestion: {
        id: null,
      },
    },
  pageHeader: 'Админка',
  table: {
    page: null,
    perpage: null
  },
  notification: {
    show: false,
    position: null,
    type: null,
    header: null,
    message: null
  }
};

export const resetState = (state) => state;

export const adminReducer = (state, action) => {
  switch (action.type) {
    case 'CHOSE_COURSE':
      return {
        ...state,
        navigation: {
          ...state.navigation,
          currentCourse: {
            id: action.payload.id,
          },
        }
      };
    case 'CHOSE_LESSON':
      return {
        ...state,
        navigation: {
          ...state.navigation,
          currentLesson: {
            id: action.payload.id,
          },
        }
      };
    case 'CHOSE_QUESTION':
      return {
        ...state,
        navigation: {
          ...state.navigation,
          currentQuestion: {
            id: action.payload.id,
          },
        }
      };
    case 'CHANGE_HEADER':
      return {
        ...state,
        pageHeader: action.payload
      };
    case 'UPDATE_TABLE':
      return {
        ...state,
        table: {
          pageIndex: action.payload.pageIndex,
          pageSize: action.payload.pageSize
        }
      };
    case 'SHOW_NOTIFICATION':
      return {
        ...state,
        notification: {
          show: true,
          position: action.payload.position,
          type: action.payload.type,
          header: action.payload.header,
          message: action.payload.message
        }
      };
    case 'HIDE_NOTIFICATION':
      return {
        ...state,
        notification: {
          show: false,
          position: null,
          type: null,
          header: null,
          message: null
        }
      };
    case 'RESET':
      return resetState(action.payload);
    default:
      return state;
  }
};