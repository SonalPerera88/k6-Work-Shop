import { check, fail } from "k6"
import http from "k6/http"

export default function(){

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
    checkStatusCode(response)

}

function checkStatusCode(response){

   if(!(check(response,{"response status code check":res => res.status <400}))) {

    fail(`api call ${response.url} failed with ${response.body}`)
   }
}