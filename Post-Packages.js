import http from "k6/http";
import { sleep } from "k6";
import { Trend, Rate, Counter } from "k6/metrics";
import { check, fail } from "k6";  


export  let Duration = new Trend("duration");
export  let FailRate = new Rate("fail_rate");
export  let SuccessRate = new Rate ("success_rate");
export  let Reqs = new Rate ("reqs");

export const options = { vus: 1, duration: "10s" };

export default function() {

  let url = 'https://homolog-packages.omniplat.io/v2//clients/qa/channels/site/packages';
  
  let payload = JSON.stringify(
    {
        "zip": "01414010",
        
        "clientId": "qa",
        "channelId": "site",
       
        "types": {
            "pickup": [
                            "locationId-001",
                            "locationId-002",
                            "locationId-003",
                            "locationId-004",
                            "locationId-005"
            ],
            "shipment": {
               "methodeId-001": {
                    "locations": [
                        [
                            "locationId-001",
                            "locationId-002",
                            "locationId-003",
                            "locationId-004",
                            "locationId-005"
    
                        ]
                    ],
                    
                    "usePool": true
                }
            },
            "lockers": [
                "CliqueRetire",
                "LockerCo"
            ]
        },
        "items": [
            {
                "skuId": "skuId-001",
                "quantity": 2,
                "height": 100,
                "length": 200,
                "width": 300,
                "stockType": "PHYSICAL"
            }
            
        ]
        
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

  sleep(1);
}