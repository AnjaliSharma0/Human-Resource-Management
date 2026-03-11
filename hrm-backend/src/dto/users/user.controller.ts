import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../../common/decorators/role.decorator';
import { RolesGaurd } from '../../common/guard/role.guard';
import { AuthGuard } from '@nestjs/passport';


@Controller('users')
// @UseGuards(RolesGaurd)
 @UseGuards(AuthGuard('jwt'), RolesGaurd)
export class UsersController {


  @Get('admin')
  @Roles('admin')
  getAdminData() {
    return "Only admin can see this";
  }

  @Get('employee')
  @Roles('employee')
  getEmployeeData() {
    return "Employee data";
  }
}