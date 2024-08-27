import http from "k6/http";
import { sleep } from "k6";
import { Trend, Rate, Counter } from "k6/metrics";
import { check, fail } from "k6";  


export  let Duration = new Trend("duration");
export  let FailRate = new Rate("fail_rate");
export  let SuccessRate = new Rate ("success_rate");
export  let Reqs = new Rate ("reqs");

export const options = { vus: 9, duration: "30s" };

export default function() {

  let url = 'https://homolog-hub.omniplat.io/v1/clients/qa/channels/site/freights';
  
  let payload = JSON.stringify(
    {
        
            "destinationZipcode": "01414010",
            "clientId": "qa",
            "channelId": "site",
            "groups": {
                "qatest": {
                    "items": {
                        "skuId-001": {
                            "quantity": 1,
                            "weight": 100,
                            "height": 200,
                            "length": 300,
                            "width": 10,
                            "price": 10
                            
                        },
                        "skuId-002": {
                            "quantity": 2,
                            "weight": 200,
                            "height": 100,
                            "length": 300,
                            "width": 20,
                            "price": 20
                           
                        }
                    }
                }
            }
        
    }
  );

  let params = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Basic cWE6NjdiNWE3M2EyM2EwZThiMmNlNTM3YjlkMWQyMzRiMGQ=",
    }
  };

  let res = http.post(url, payload, params);
  let checkRes = check(res, {
    "status is 200": (r) => r.status === 200
  });

  
  if (!checkRes) {
    fail("Request failed");
  }

  Duration.add(res.timings.duration);
  Reqs.add(1);
  FailRate.add(res.status !== 0 || res.status > 399);
  SuccessRate.add( res.status < 400);
  FailRate.add(!checkRes);
  SuccessRate.add(checkRes);

  sleep(Math.random() * 60);
}