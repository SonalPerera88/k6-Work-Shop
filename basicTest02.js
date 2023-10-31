import http from "k6/http"
import { check, fail } from "k6"
import { Trend } from "k6/metrics"

const trend1 = new Trend('trend_for_method1')
const trend2 = new Trend('trend_for_method2')
const trend3 = new Trend('trend_for_method3')
const trend4 = new Trend('trend_for_method4')

export const options = {
    scenarios:{
        sc_1:{//using fro creation of the data
            executor:'shared-iterations',
            vus: 2,
            iterations: 10,
            maxDuration: '30s',//need to te duration if it did not over within 30s this iterations should be killed
            exec:'testMethod1'
        },
        sc_2:{
            executor: 'per-vu-iterations',
            vus: 5,
            iterations: 3, //hit 20 times will hit  1 vu all to gether 200 times will hit you
            maxDuration: '30s',
            exec:'testMethod2'

         },
        sc_3:{
            executor: 'constant-vus',
            vus: 2,
            duration: '3s',
            exec:'testMethod3'

        },
        sc_4:{
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                    { duration: '5s', target: 10 },
                    { duration: '20s', target: 10 },
                    { duration: '5s', target: 0 },
                    ],
            gracefulRampDown: '10s',// stop the scenario
            exec:'testMethod4'

        }
        
    },
    discardResponseBodies: true,
    thresholds:{
        trend_for_method1:['p(95)<15'],
        trend_for_method2:['p(95)<10'],
        trend_for_method3:['p(95)<30'],
        trend_for_method4:['p(95)<40'],
    }

}

export function testMethod1(){

   const response =  http.get('https://reqres.in/api/users?page=2')
   trend1.add(response.timings.duration)
   checkStatusCode (response)

}

export function testMethod2(){
    const url = "https://reqres.in/api/users";
    const reqBody = JSON.stringify({
        "name": "morpheus",
        "job": "leader"
    });
    const params = {
        headers:{"Content-Type":"application/json"}
    };
   const responce = http.post(url,reqBody,params);
   trend2.add(response.timings.duration)
   checkStatusCode(responce)
    
}
export function testMethod3(){

    const url = "https://reqres.in/api/users/2"
    const reqBody = JSON.stringify({
        "name": "morpheus",
        "job": "zion resident"
    })
    const params = {
        headers:{
            "Content-Type":"application/json"
        }
    }

    const response = http.put(url,reqBody,params)
    trend3.add(response.timings.duration)
    checkStatusCode(response)
    
}
export function testMethod4(){
    const response =  http.get('https://reqres.in/api/unknown/2')
    trend4.add(response.timings.duration)

   checkStatusCode (response)
}

function checkStatusCode (response){
    if (!(check(response,{'response status code check':res=> res.status<400}))){
        fail(`api call ${response.url} failed with responce${response.body}`)
    }

}