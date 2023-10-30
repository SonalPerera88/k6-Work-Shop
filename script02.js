import { check, fail } from "k6";
import http from "k6/http"

export default function(){
    const url = "https://reqres.in/api/users";
    const reqBody = JSON.stringify({
        "name": "morpheus",
        "job": "leader"
    });
    const params = {
        headers:{"Content-Type":"application/json"}
    };
   const responce = http.post(url,reqBody,params);
   checkStatusCode(responce)
   
}

function checkStatusCode (response){
    if (!(check(response,{'response status code check':res=> res.status<400}))){
        fail(`api call ${response.url} failed with responce${response.body}`)
    }

}