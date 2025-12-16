import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthResponseDto } from './dto/health-response.dto';
import { Public } from '../auth';

@ApiTags('health')
@Controller('health')
@Public() // Health check should be accessible without authentication
export class HealthController {
  @Get()
  @ApiOperation({
    summary: 'Health check endpoint',
    description: 'Check the health status of the API service (public endpoint)',
  })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy and running',
    type: HealthResponseDto,
  })
  check(): HealthResponseDto {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      runtime: 'Bun',
      version: process.version,
    };
  }
}
