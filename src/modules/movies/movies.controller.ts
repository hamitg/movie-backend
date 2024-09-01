import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ROLES } from '../../common/constants/roles.constants';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { CreateMovieDto } from './dto/create-movie.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { MOVIES } from '../../common/constants/swagger.constants';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GetMoviesResponseDto } from './dto/get-movies-response.dto';
import { GetMovieResponseDto } from './dto/get-movie-response.dto';
import { BulkCreateMoviesResponseDto } from './dto/bulk-create-movies-response.dto';
import { BulkDeleteMoviesResponseDto } from './dto/bulk-delete-movies-response.dto';
import { GetSessionsResponseDto } from './dto/get-sessions-response.dto';
import { BulkAddSessionsResponseDto } from './dto/bulk-add-sessions-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('movies')
@Controller('movies')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @Roles(ROLES.MANAGER)
  @ApiOperation(MOVIES.CREATE)
  @ApiBody({ type: CreateMovieDto })
  @ApiResponse({
    status: 201,
    description: 'The movie has been successfully created.',
    type: GetMovieResponseDto,
  })
  async create(
    @Body() createMovieDto: CreateMovieDto,
  ): Promise<GetMovieResponseDto> {
    const movie = await this.moviesService.create(createMovieDto);
    return new GetMovieResponseDto(movie);
  }

  @Get()
  @ApiOperation(MOVIES.FIND_ALL)
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({
    name: 'where',
    required: false,
    type: String,
    schema: {
      type: 'string',
      example: '{"name":{"contains":"Star Wars"}}',
    },
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    type: String,
    schema: {
      type: 'string',
      example: '{"name":"desc"}',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Return all movies',
    type: GetMoviesResponseDto,
  })
  async findAll(
    @Query()
    query: {
      skip?: string;
      take?: string;
      where?: string;
      orderBy?: string;
    },
  ): Promise<GetMoviesResponseDto> {
    const { skip, take, where, orderBy } = query;
    const movies = await this.moviesService.findAll({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      where: where ? JSON.parse(where) : undefined,
      orderBy: orderBy ? JSON.parse(orderBy) : undefined,
    });
    return new GetMoviesResponseDto(movies);
  }

  @Get(':id')
  @ApiOperation(MOVIES.FIND_ONE)
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Return the movie.',
    type: GetMovieResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<GetMovieResponseDto> {
    const movie = await this.moviesService.findById(+id);
    return new GetMovieResponseDto(movie);
  }

  @Put(':id')
  @Roles(ROLES.MANAGER)
  @ApiOperation(MOVIES.UPDATE)
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ type: UpdateMovieDto })
  @ApiResponse({
    status: 200,
    description: 'The movie has been successfully updated.',
    type: GetMovieResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<GetMovieResponseDto> {
    const movie = await this.moviesService.update(+id, updateMovieDto);
    return new GetMovieResponseDto(movie);
  }

  @Delete(':id')
  @Roles(ROLES.MANAGER)
  @ApiOperation(MOVIES.REMOVE)
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'The movie has been successfully deleted.',
    type: GetMovieResponseDto,
  })
  async remove(@Param('id') id: string): Promise<GetMovieResponseDto> {
    const movie = await this.moviesService.remove(+id);
    return new GetMovieResponseDto(movie);
  }

  @Post('bulk')
  @Roles(ROLES.MANAGER)
  @ApiOperation(MOVIES.BULK_CREATE)
  @ApiBody({ type: [CreateMovieDto] })
  @ApiResponse({
    status: 201,
    description: 'The movies have been successfully created.',
    type: BulkCreateMoviesResponseDto,
  })
  async bulkCreate(
    @Body() createBulkMoviesDtos: CreateMovieDto[],
  ): Promise<BulkCreateMoviesResponseDto> {
    const result = await this.moviesService.bulkCreate(createBulkMoviesDtos);
    return new BulkCreateMoviesResponseDto(result);
  }

  @Delete('bulk')
  @Roles(ROLES.MANAGER)
  @ApiOperation(MOVIES.BULK_REMOVE)
  @ApiBody({ type: [Number] })
  @ApiResponse({
    status: 200,
    description: 'The movies have been successfully deleted.',
    type: BulkDeleteMoviesResponseDto,
  })
  async bulkRemove(
    @Body() ids: number[],
  ): Promise<BulkDeleteMoviesResponseDto> {
    const result = await this.moviesService.bulkRemove(ids);
    return new BulkDeleteMoviesResponseDto(result);
  }

  @Post(':id/sessions')
  @Roles(ROLES.MANAGER)
  @ApiOperation(MOVIES.ADD_SESSION)
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ type: [CreateSessionDto] })
  @ApiResponse({
    status: 201,
    description: 'The sessions have been successfully added.',
    type: BulkAddSessionsResponseDto,
  })
  async bulkAddSessions(
    @Param('id') id: string,
    @Body() createSessionDto: CreateSessionDto[],
  ): Promise<BulkAddSessionsResponseDto> {
    const result = await this.moviesService.bulkAddSessions(
      +id,
      createSessionDto,
    );
    return new BulkAddSessionsResponseDto(result);
  }

  @Get(':id/sessions')
  @ApiOperation(MOVIES.GET_MOVIE_SESSIONS)
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Return all sessions for the movie.',
    type: GetSessionsResponseDto,
  })
  async getMovieSessions(
    @Param('id') id: string,
  ): Promise<GetSessionsResponseDto> {
    const sessions = await this.moviesService.getMovieSessions(+id);
    return new GetSessionsResponseDto(sessions);
  }
}
