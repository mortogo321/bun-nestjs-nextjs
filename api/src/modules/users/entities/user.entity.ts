import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({
    description: 'Unique user identifier',
    example: '1702800000000',
  })
  id: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    minLength: 2,
  })
  name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john@example.com',
    format: 'email',
  })
  email: string;

  @ApiProperty({
    description: 'Timestamp when user was created',
    example: '2025-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
}
