import request, { extend } from 'umi-request';
import { message } from 'antd';
import axios from 'axios';

const errorHandler = function(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if(error.response.status > 400)
        message.error(error.data.message ? error.data.message:error.data);
    } else {
      // The request was made but no response was received or error occurs when setting up the request.
      message.error('Network Error');
    }
  
    //throw error; // If throw. The error will continue to be thrown.
  
    // return {some: 'data'}; If return, return the value as a return. If you don't write it is equivalent to return undefined, you can judge whether the response has a value when processing the result.
    // return {some: 'data'};
  };

  const extendRequest = extend({ errorHandler });


export const getRemoteList = async (params) => {
    return extendRequest('http://223.4.179.3:82/v1/datamanage/fleets', {
        method: 'get',
      })
        .then(function(response) {
            // console.log(response.data);
            return response.data; 
        })
        .catch(function(error) {
            return false;
        });
}

export const getMainList = async (params) => {
  return extendRequest('http://127.0.0.1:5000/v1/main/list', {
      method: 'get',
    })
      .then(function(response) {
          // console.log(response.data);
          return response.data; 
      })
      .catch(function(error) {
          return false;
      });
}

export const editRecord = async ({values}) => {
    return extendRequest('http://223.4.179.3:82/v1/datamanage/fleets', {
        method: 'put',
        data: values
      })
        .then(function(response) {
            return true; 
        })
        .catch(function(error) {
            return false;
        });
    // axios({
    //   url: 'http://223.4.179.3:82/v1/datamanage/fleets',
    //   method: 'PUT',
    //   data: values
    // }).then(res => {
    //   return true;
    // })
}

// export const addRecord = async ({values}) => {
//     return extendRequest(`http://public-api-v1.aspirantzhang.com/users/`, {
//         method: 'post',
//         data: values
//       })
//         .then(function(response) {
//             return true; 
//         })
//         .catch(function(error) {
//             return false;
//         });
// }

export const deleteRecord = async (id) => {
    return extendRequest(`http://223.4.179.3:82/v1/datamanage/fleets/${id}`, {
        method: 'delete',
      })
        .then(function(response) {
          return true; 
        })
        .catch(function(error) {
            return false;
        });
}

