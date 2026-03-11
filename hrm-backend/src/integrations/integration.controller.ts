import { Body, Controller, Post } from "@nestjs/common"
import { IntegrationService } from "./integration.service"

@Controller("integrations")
export class IntegrationsController{

constructor(private service:IntegrationService){}

@Post("slack")
sendSlack(@Body() body){
return this.service.sendSlackNotification(body.message)
}

@Post("payroll-sync")
syncPayroll(){
return this.service.pushPayroll()
}

@Post("government-sync")
syncGov(){
return this.service.syncGovernment()
}

}