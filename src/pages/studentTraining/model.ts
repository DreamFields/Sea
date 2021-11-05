import { message } from 'antd';
import { Effect } from '@umijs/preset-react';
import { getQuestionsList, getDiffcult } from './service';

export interface StateType {}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    getQuestionList: Effect;
  };
  reducers: {};

  subscriptions: {};
}

const Model = {
  namespace: 'listenTraining',

  state: {
    difficultList: {},
    questionList: [
      //   {
      //     "analysis": " ",
      //     "correct": "A",
      //     "info_text_content": {
      //         "A": 1,
      //         "B": 2,
      //         "C": 3,
      //         "D": 4,
      //         "question_info": "1+1=?"
      //     },
      //     "knowledge": " ",
      //     "pic_url": null,
      //     "question_id": 1,
      //     "question_status": 2,
      //     "sound_url": null,
      //     "student_answer": null
      // },
    ],
  },

  effects: {
    *getQuestionList({ payload: { chapter, difficult } }, { call, put }) {
      const question_list = yield call(getQuestionsList, {
        chapter,
        difficult,
      });
      console.log(question_list);

      if (question_list) {
        yield put({
          type: 'getList',
          payload: {
            questionList: question_list,
          },
        });
      } else {
        message.error('获取题目失败');
      }
    },

    *getDiffcultList({}, { call, put }) {
      console.log(123);

      const difficultList = yield call(getDiffcult);
      if (difficultList) {
        yield put({
          type: 'getDifficult',
          payload: {
            difficultList: difficultList,
          },
        });
      }
    },

    // *submitQuestion({ payload: { id, answer } },{ call, put }) {
    //   const response = yield call(submit,{ id, answer });
    //   console.log(response);

    //   if (response) {
    //     console.log(response);
    //   } else {
    //     message.error('提交题目失败');
    //   }
    // }
  },

  reducers: {
    getList(state, { payload: { questionList } }) {
      return {
        ...state,
        questionList,
      };
    },
    getDifficult(state, { payload: { difficultList } }) {
      return {
        ...state,
        difficultList,
      };
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        // if (pathname === '/listenTraining') {
        //   dispatch({
        //     type: 'getDiffcultList',
        //     payload: {},
        //   });
        // }
      });
    },
  },
};

export default Model;
