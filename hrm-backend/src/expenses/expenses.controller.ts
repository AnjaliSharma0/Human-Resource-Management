import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Headers,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ExpensesService } from "./expenses.service";
import { CreateExpenseDto } from "./dto/create-expense.dto";

@Controller("expenses")
export class ExpensesController {
  constructor(private service: ExpensesService) {}

  // ✅ CREATE EXPENSE (Employee / Manager)
  @Post()
  @UseInterceptors(FileInterceptor("receipt"))
  create(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
      @Headers("role") role: string

  ) {
    if (file) {
      body.receiptUrl = file.filename; // store filename
    }
    
    return this.service.create({
      ...body,
      amount: Number(body.amount),        // ✅ FIX
      employeeId: Number(body.employeeId),// ✅ FIX
      receiptUrl: file ? file.filename : undefined,
    });
  }

  // ✅ GET ALL (Admin = all, others = filtered in future)
  @Get()
  getAll() {
    return this.service.getAll();
  }

  // ✅ APPROVE (Manager / Admin)
  @Put("approve/:id")
  approve(
    @Param("id") id: number,
    @Headers("role") role: string
  ) {
    return this.service.approve(id, role);
  }

  // ✅ REJECT (Manager / Admin)
  @Put("reject/:id")
  reject(
    @Param("id") id: number,
    @Headers("role") role: string
  ) {
    return this.service.reject(id, role);
  }

  // ✅ DELETE (Admin only)
  @Delete(":id")
  delete(
    @Param("id") id: number,
    @Headers("role") role: string
  ) {
    if (role !== "admin") {
      throw new Error("Only admin can delete");
    }
    return this.service.delete(id);
  }
}