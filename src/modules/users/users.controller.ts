import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Body,
  Req,
  Delete,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserAccessGuard } from '../../common/guards/user-access.guard';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ROLES } from '../../common/constants/roles.constants';
import { Roles } from '../../common/decorators/roles.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { USERS } from '../../common/constants/swagger.constants';
import { AttendSessionResponseDto } from './dto/attend-session-response.dto';
import { WatchHistoryResponseDto } from './dto/watch-history-response.dto';
import { BuyTicketResponseDto } from './dto/buy-ticket-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BuyTicketReqDto } from './dto/buy-ticket-req.dto';
import { AttendSessionReqDto } from './dto/attend-session-req.dto';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(UserAccessGuard)
  @Post(':userId/attend-session')
  @ApiOperation(USERS.ATTEND_SESSION)
  @ApiParam({ name: 'userId', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Session attended successfully',
    type: AttendSessionReqDto,
  })
  async attendSession(
    @Req() request: RequestWithUser,
    @Body() attendSessionReqDto: AttendSessionReqDto,
  ): Promise<AttendSessionResponseDto> {
    const result = await this.usersService.attendSession({
      userId: request.user.userId,
      sessionId: attendSessionReqDto.sessionId,
    });
    return new AttendSessionResponseDto(result);
  }

  @UseGuards(UserAccessGuard)
  @Get(':userId/watch-history')
  @ApiOperation(USERS.GET_WATCH_HISTORY)
  @ApiParam({ name: 'userId', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'User watch history',
    type: WatchHistoryResponseDto,
  })
  async getWatchHistory(
    @Req() request: RequestWithUser,
  ): Promise<WatchHistoryResponseDto> {
    const history = await this.usersService.getWatchHistory({
      userId: request.user.userId,
    });
    return new WatchHistoryResponseDto(history);
  }

  @Post('buy-ticket')
  @ApiOperation(USERS.BUY_TICKET)
  @ApiBody({ type: BuyTicketReqDto })
  @ApiResponse({
    status: 201,
    description: 'Ticket bought successfully',
    type: BuyTicketResponseDto,
  })
  async buyTicket(
    @Body() buyTicketDto: BuyTicketReqDto,
    @Req() request: RequestWithUser,
  ): Promise<BuyTicketResponseDto> {
    const result = await this.usersService.buyTicket({
      userId: request.user.userId,
      sessionId: buyTicketDto.sessionId,
    });
    return new BuyTicketResponseDto(result);
  }

  @UseGuards(UserAccessGuard)
  @Get(':userId')
  @ApiOperation(USERS.GET_USER)
  @ApiParam({ name: 'userId', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'User details',
    type: UserResponseDto,
  })
  async getUser(@Param('userId') userId: string): Promise<UserResponseDto> {
    const user = await this.usersService.findById({ userId: +userId });
    return new UserResponseDto(user);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLES.MANAGER)
  @Post()
  @ApiOperation(USERS.CREATE_USER)
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.create(createUserDto);
    return new UserResponseDto(user);
  }

  @Delete(':userId')
  @UseGuards(RolesGuard)
  @Roles(ROLES.MANAGER)
  @ApiOperation(USERS.DELETE_USER)
  @ApiParam({ name: 'userId', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    type: UserResponseDto,
  })
  async deleteUser(@Param('userId') userId: string): Promise<UserResponseDto> {
    const user = await this.usersService.delete({ userId: +userId });
    return new UserResponseDto(user);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLES.MANAGER)
  @Patch(':userId')
  @ApiOperation(USERS.UPDATE_USER)
  @ApiParam({ name: 'userId', type: 'string' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.update({
      userId: +userId,
      ...updateUserDto,
    });
    return new UserResponseDto(user);
  }
}
