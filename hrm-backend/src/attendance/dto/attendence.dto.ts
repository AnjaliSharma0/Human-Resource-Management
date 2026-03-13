import { IsNotEmpty, IsOptional } from 'class-validator';

// For punch-in (supports optional face/biometric verification)
export class PunchInDto {
  @IsNotEmpty()
  employeeId: number;

  @IsOptional()
  image?: string; // optional: Base64 image or face ID token
}

// For punch-out (resumes the last active session)
export class PunchOutDto {
  @IsNotEmpty()
  employeeId: number;
}

// Optional: for querying attendance (e.g., frontend request)
export class AttendanceQueryDto {
  @IsOptional()
  employeeId?: number; // if not provided, returns all records for admin
  @IsOptional()
  date?: string; // filter by specific date (YYYY-MM-DD)
}