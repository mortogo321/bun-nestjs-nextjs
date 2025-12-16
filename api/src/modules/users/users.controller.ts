import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiExtraModels,
  ApiBearerAuth,
  ApiSecurity,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ErrorResponseDto, NotFoundResponseDto } from '../../common/dto/error-response.dto';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('api-key')
@ApiExtraModels(ErrorResponseDto, NotFoundResponseDto)
@ApiResponse({
  status: 401,
  description: 'Unauthorized - Missing or invalid authentication',
  schema: {
    type: 'object',
    properties: {
      statusCode: { type: 'number', example: 401 },
      message: { type: 'string', example: 'Authentication required. Provide either a valid JWT token (Bearer) or API key (X-API-Key header)' },
      error: { type: 'string', example: 'Unauthorized' },
    },
  },
})
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve a list of all registered users. Requires authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully',
    type: [User],
  })
  findAll(): User[] {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve a specific user by their unique identifier. Requires authentication.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique user identifier',
    example: '1702800000000',
  })
  @ApiResponse({
    status: 200,
    description: 'User found and returned successfully',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: NotFoundResponseDto,
  })
  findOne(@Param('id') id: string): User {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Create a new user with name and email. Requires authentication.',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User data to create',
    examples: {
      example1: {
        summary: 'Basic user',
        value: {
          name: 'John Doe',
          email: 'john@example.com',
        },
      },
      example2: {
        summary: 'Another user',
        value: {
          name: 'Jane Smith',
          email: 'jane@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error - invalid input data',
    type: ErrorResponseDto,
  })
  create(@Body() createUserDto: CreateUserDto): User {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update user by ID',
    description: 'Update an existing user\'s information. Requires authentication.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique user identifier',
    example: '1702800000000',
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'User data to update (partial)',
    examples: {
      updateName: {
        summary: 'Update name only',
        value: {
          name: 'John Updated',
        },
      },
      updateEmail: {
        summary: 'Update email only',
        value: {
          email: 'john.updated@example.com',
        },
      },
      updateBoth: {
        summary: 'Update both fields',
        value: {
          name: 'John Updated',
          email: 'john.updated@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error - invalid input data',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: NotFoundResponseDto,
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): User {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete user by ID',
    description: 'Permanently delete a user from the system. Requires authentication.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique user identifier',
    example: '1702800000000',
  })
  @ApiResponse({
    status: 204,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: NotFoundResponseDto,
  })
  remove(@Param('id') id: string): void {
    return this.usersService.remove(id);
  }
}
