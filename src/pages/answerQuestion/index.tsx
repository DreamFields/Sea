import React, { useState } from 'react';
import style from './style.less';
import { connect } from 'umi';

const Index = (props: any) => {
  const [questionState, setQuestionState] = useState([
    {
      question: '1+1',
      option: ['2', '3', '4', '5'],
      explain: '1+1=2',
      selected: 0,
    },
    {
      question: '1+2',
      option: ['2', '3', '4', '5'],
      explain: '1+2=3',
      selected: 0,
    },
    {
      question: '2+2',
      option: ['2', '3', '4', '5'],
      explain: '2+2=4',
      selected: 0,
    },
    {
      question: '1+4',
      option: ['2', '3', '4', '5'],
      explain: '1+4=5',
      selected: 0,
    },
  ]);
  const [id, setId] = useState(0);

  return (
    <div className={style.container}>
      <div>
        <h4>题目列表</h4>
        <div className={style.questionNameContainer}>
          {questionState.map((item, idx) => (
            <div
              key={idx}
              className={
                idx === id ? style.currentQuestion : style.otherQuestion
              }
              onClick={() => setId(idx)}
            >
              T{idx + 1}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4>问题</h4>
        <div>{questionState[id].question}</div>
        <h4>你的选择</h4>
        <div>
          {questionState[id].option.map((item, idx) => (
            <div key={idx}>
              <input
                type="radio"
                value={`${idx}`}
                name={`${id}`}
                id={`${idx}`}
                checked={questionState[id].selected === idx}
                onChange={(e) => {
                  questionState[id].selected = +e.target.value;
                  setQuestionState([...questionState]);
                }}
              />
              <label htmlFor={`${idx}`}>{item}</label>
            </div>
          ))}
        </div>
        <h4>题目解析</h4>
        <div>{questionState[id].explain}</div>
        {id !== 0 && (
          <div
            className={style.btn}
            onClick={() => {
              setId(id - 1);
            }}
          >
            上一题
          </div>
        )}
        {id !== questionState.length - 1 && (
          <div
            className={style.btn}
            onClick={() => {
              setId(id + 1);
            }}
          >
            下一题
          </div>
        )}
      </div>
    </div>
  );
};

function mapStateToProps(state: any) {
  return {};
}

export default connect(mapStateToProps)(Index);
