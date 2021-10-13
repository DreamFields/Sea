interface IBaseAnswer {
  info_text_content: {
    question_info: string;
  } & Record<'A' | 'B' | 'C' | 'D', string>;
  question_id: number;
}

interface IRightAnswer extends IBaseAnswer {
  analysis: string;
  correct: string;
  knowledge: string;
}

interface IWrongAnswer extends IBaseAnswer {
  customer_answer: string;
}

export interface IQuestionListResp {
  not_judge_list: IBaseAnswer[];
  right_list: IRightAnswer[];
  wrong_list: IWrongAnswer[];
}

export enum QuestionType {
  NotJudge,
  Right,
  Wrong,
}

export type Question = (IRightAnswer | IWrongAnswer | IBaseAnswer) & {
  type: QuestionType;
  userAnswer?: string;
};

export type QuestionDetail = IBaseAnswer & {
  pic_url: string;
  question_type: any;
  score: any;
  sound_url: string;
};
