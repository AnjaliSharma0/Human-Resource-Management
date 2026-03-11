import { Injectable } from "@nestjs/common"

@Injectable()
export class IntegrationService{

sendSlackNotification(message:string){

console.log("Slack message:",message)

}

pushPayroll(){

console.log("Push payroll to QuickBooks")

}

syncEPFO(){

console.log("Sync employee data with EPFO")

}

syncGovernment(){
    console.log('Sync govternment')
}

}