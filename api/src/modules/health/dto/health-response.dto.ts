import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({
    description: 'Health status',
    example: 'ok',
    enum: ['ok', 'degraded', 'error'],
  })
  status: string;

  @ApiProperty({
    description: 'Current server timestamp',
    example: '2025-01-01T00:00:00.000Z',
    format: 'date-time',
  })
  timestamp: string;

  @ApiProperty({
    description: 'JavaScript runtime',
    example: 'Bun',
  })
  runtime: string;

  @ApiProperty({
    description: 'Runtime version',
    example: 'v1.3.4',
  })
  version: string;
}
