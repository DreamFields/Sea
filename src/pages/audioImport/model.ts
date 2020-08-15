import {Reducer, Effect, Subscription} from 'umi';
import { getRemoteList, deleteRecord, editRecord, getMainList} from './secvice';
import { message } from 'antd';

interface FleetType {
    namespace: 'fleets',
    state: {},
    reducers: {
        getList: Reducer;
    },
    effects: {
        getRemote: Effect;
        edit: Effect;
        // add: Effect;
        delete: Effect;
    },
    subscriptions: {
        setup: Subscription;
    }
}   


const fleet: FleetType = {
    namespace: 'fleets',
    state: {},
    //下面的这些里面都是一个个的函数

    //同步，只能通过reducer返回
    reducers: {
        getList(state, {payload}) {
            return payload;
            // return newState;
        },
    },
    //异步，不需要return
    effects: {
        //effects={put(推给Reducer), call(请求Service)}
        *getRemote(action, {put, call}) {
            const targetData = yield call(getRemoteList);
            const treeData = yield call(getMainList);
            const _payload = {targetData: targetData, treeData:treeData}
            // console.log(_payload);
            //yield put() //传递数据只能通过put给reducer
            yield put({
                type: 'getList',
                payload: _payload
            })
            },
        *edit({payload:{values}}, {put, call}){
            // console.log(values)
            const data = yield call(editRecord, {values });
            if(data){
                message.success('编辑成功.')
                yield put({
                    type: 'getRemote',
                });
            }
            else
                message.error('Edit Failed')
            },
        // *add({payload:{values}}, {put, call}){
        //     const data = yield call(addRecord, { values });
        //     console.log(data);
        //     if(data){
        //         message.success('Add Successfully.')
        //         yield put({
        //             type: 'getRemote',
        //         });
        //     }
        //     else
        //         message.error('Add Failed')
        // },
        *delete({payload:{ id }}, {put, call}){
            // alert('delete!')
            const data = yield call(deleteRecord, id);
            if(data){
                message.success('删除成功.')
                yield put({
                    type: 'getRemote',
                });
            }
            else
                message.error('Delete Failed')
        }
    },
    // 订阅
    subscriptions: {
        setup({ dispatch, history }) {
            //dispatch(action)
            // action = Object{
            //     type = '同步异步里的函数名',
            //     payload = {'要传递数据的汇总'}
            // }
            history.listen(({pathname}) => {
                if(pathname === '/audioImport') {
                    dispatch({
                        type: 'getRemote',
                    })
                }
            });
        }
    }   
};

export default fleet;