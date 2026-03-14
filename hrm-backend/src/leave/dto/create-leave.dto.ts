export class CreateLeaveDto {

  type: string;

  startDate: Date;

  endDate: Date;

  employeeId: number;

  reason?: string;

}

export class UpdateLeaveDto {

  status: string;

}