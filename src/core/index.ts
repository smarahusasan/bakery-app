
export const getLogger: (tag: string) => (...args: unknown[]) => void =
  tag => (...args) => console.log(tag, ...args);

export const baseUrl='localhost:3000';

const log=getLogger('api');

export interface ResponseProps<T>{
    data: T;
}

export function withLogs<T>(promise:Promise<ResponseProps<T>>,fnName:string):Promise<T>{
    log(`${fnName} - started`);
    return promise
        .then(res=>{
            log(`${fnName} - succeeded`);
            return Promise.resolve(res.data);
        })
        .catch(err=>{
            log(`${fnName} - failed`,err);
            return Promise.reject(err);
        });
}

export const config={
    headers:{
        'Content-Type':'application/json'
    }
}

export const authConfig=()=>({
    headers:{
        'Content-Type':'application/json',
        Authorization:`Bearer ${localStorage.getItem('token')}`
    }
});
