

// faq.controller.ts
import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { FaqService } from './faq.service';

@Controller('helpdesk/faqs')
export class FaqController {
  constructor(private faqService: FaqService) {}

  @Get()
  getAll() {
    return this.faqService.getAll();
  }

  @Post()
  create(@Body() body: { question: string; answer: string }) {
    return this.faqService.create(body.question, body.answer);
  }
  @Delete(':id')
remove(@Param('id') id: string) {
  return this.faqService.remove(+id);
}
}