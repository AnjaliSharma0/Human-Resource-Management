import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Param,
  Body,
  Get,
  Delete
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { EmployeeDocumentService } from "./employee-document.service";


@Controller("employees")
export class EmployeeDocumentController {

  constructor(private documentService: EmployeeDocumentService) {}

  @Post(":id/documents")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads/documents",
        filename: (req, file, callback) => {

          const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1e9);

          callback(null, uniqueName + extname(file.originalname));
        }
      })
    })
  )
  uploadDocument(
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body("documentName") documentName: string
  ) {

  if (!documentName) {
    documentName = file.originalname; // fallback
  }
  
    return this.documentService.upload(
      Number(id),
      documentName,
      file.path
    );
  }

  @Get(":id/documents")
  findEmployeeDocs(@Param("id") id: string) {

    return this.documentService.findEmployeeDocuments(Number(id));

  }

  @Delete("documents/:id")
  remove(@Param("id") id: string) {

    return this.documentService.remove(Number(id));

  }
}