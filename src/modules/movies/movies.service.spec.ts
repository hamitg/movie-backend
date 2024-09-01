import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { PrismaService } from 'nestjs-prisma';
import { CreateMovieDto } from './dto/create-movie.dto';
import { TimeSlot } from '../../common/constants/time-slots.constants';

describe('MoviesService', () => {
  let service: MoviesService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService, PrismaService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    prismaService = module.get<PrismaService>(PrismaService);

    // Mock the Prisma service methods
    prismaService.movie.create = jest.fn();
    prismaService.session.createMany = jest.fn();
    prismaService.movie.findUnique = jest.fn();
    prismaService.movie.findMany = jest.fn();
    prismaService.movie.delete = jest.fn();
    prismaService.movie.createMany = jest.fn();
    prismaService.movie.deleteMany = jest.fn();
    prismaService.$transaction = jest.fn();
  });

  describe('create', () => {
    it('should create a movie with sessions', async () => {
      const createMovieDto: CreateMovieDto = {
        name: 'Test Movie',
        ageRestriction: 12,
        sessions: [
          { date: '2023-06-15', timeSlot: TimeSlot.SLOT_10_12, roomNumber: 1 },
          { date: '2023-06-16', timeSlot: TimeSlot.SLOT_12_14, roomNumber: 2 },
        ],
      };

      const createdMovie = {
        id: 1,
        name: createMovieDto.name,
        ageRestriction: createMovieDto.ageRestriction,
      };

      const createdSessions = [
        {
          id: 1,
          date: '2023-06-15',
          timeSlot: TimeSlot.SLOT_10_12,
          roomNumber: 1,
          movieId: 1,
        },
        {
          id: 2,
          date: '2023-06-16',
          timeSlot: TimeSlot.SLOT_12_14,
          roomNumber: 2,
          movieId: 1,
        },
      ];

      (prismaService.movie.create as jest.Mock).mockResolvedValue(createdMovie);
      (prismaService.session.createMany as jest.Mock).mockResolvedValue({
        count: 2,
      });
      (prismaService.movie.findUnique as jest.Mock).mockResolvedValue({
        ...createdMovie,
        sessions: createdSessions,
      });

      (prismaService.$transaction as jest.Mock).mockImplementation(
        async (fn) => {
          return await fn(prismaService);
        },
      );

      const result = await service.create(createMovieDto);

      expect(result).toEqual({
        ...createdMovie,
        sessions: createdSessions,
      });
      expect(prismaService.movie.create).toHaveBeenCalledWith({
        data: {
          name: createMovieDto.name,
          ageRestriction: createMovieDto.ageRestriction,
        },
      });
      expect(prismaService.session.createMany).toHaveBeenCalledWith({
        data: createMovieDto.sessions.map((session) => ({
          ...session,
          movieId: createdMovie.id,
        })),
      });
    });

    it('should throw an error when Prisma throws an unknown error', async () => {
      const createMovieDto: CreateMovieDto = {
        name: 'Test Movie',
        ageRestriction: 12,
        sessions: [],
      };

      const unknownError = new Error('Unknown error');
      (prismaService.$transaction as jest.Mock).mockImplementation(() => {
        throw unknownError;
      });

      await expect(service.create(createMovieDto)).rejects.toThrow(
        unknownError,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const mockMovies = [
        { id: 1, name: 'Movie 1', ageRestriction: 12, sessions: [] },
        { id: 2, name: 'Movie 2', ageRestriction: 18, sessions: [] },
      ];
      (prismaService.movie.findMany as jest.Mock).mockResolvedValue(mockMovies);

      const result = await service.findAll({});

      expect(result).toEqual(mockMovies);
      expect(prismaService.movie.findMany).toHaveBeenCalledWith({
        include: { sessions: true },
      });
    });

    it('should apply skip and take parameters', async () => {
      const params = { skip: 5, take: 10 };
      await service.findAll(params);

      expect(prismaService.movie.findMany).toHaveBeenCalledWith({
        ...params,
        include: { sessions: true },
      });
    });

    it('should apply cursor parameter', async () => {
      const params = { cursor: { id: 5 } };
      await service.findAll(params);

      expect(prismaService.movie.findMany).toHaveBeenCalledWith({
        ...params,
        include: { sessions: true },
      });
    });

    it('should apply where parameter', async () => {
      const params = { where: { name: { contains: 'Action' } } };
      await service.findAll(params);

      expect(prismaService.movie.findMany).toHaveBeenCalledWith({
        ...params,
        include: { sessions: true },
      });
    });

    it('should apply orderBy parameter', async () => {
      const params = { orderBy: { name: 'asc' as const } };

      await service.findAll(params);

      expect(prismaService.movie.findMany).toHaveBeenCalledWith({
        ...params,
        include: { sessions: true },
      });
    });

    it('should apply multiple parameters', async () => {
      const params = {
        skip: 5,
        take: 10,
        where: { ageRestriction: { gte: 18 } },
        orderBy: { name: 'desc' as const },
      };
      await service.findAll(params);

      expect(prismaService.movie.findMany).toHaveBeenCalledWith({
        ...params,
        include: { sessions: true },
      });
    });

    it('should return an empty array when no movies are found', async () => {
      (prismaService.movie.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.findAll({});

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return a movie when it exists', async () => {
      const mockMovie = {
        id: 1,
        name: 'Test Movie',
        ageRestriction: 12,
        sessions: [
          {
            id: 1,
            date: '2023-06-15',
            timeSlot: TimeSlot.SLOT_10_12,
            roomNumber: 1,
          },
          {
            id: 2,
            date: '2023-06-16',
            timeSlot: TimeSlot.SLOT_12_14,
            roomNumber: 2,
          },
        ],
      };

      (prismaService.movie.findUnique as jest.Mock).mockResolvedValue(
        mockMovie,
      );

      const result = await service.findById(1);

      expect(result).toEqual(mockMovie);
      expect(prismaService.movie.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { sessions: true },
      });
    });

    it('should throw an error when the database query fails', async () => {
      const error = new Error('Database error');
      (prismaService.movie.findUnique as jest.Mock).mockRejectedValue(error);

      await expect(service.findById(1)).rejects.toThrow('Database error');
      expect(prismaService.movie.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { sessions: true },
      });
    });

    it('should return a movie without sessions when it exists but has no sessions', async () => {
      const mockMovie = {
        id: 1,
        name: 'Test Movie',
        ageRestriction: 12,
        sessions: [],
      };

      (prismaService.movie.findUnique as jest.Mock).mockResolvedValue(
        mockMovie,
      );

      const result = await service.findById(1);

      expect(result).toEqual(mockMovie);
      expect(prismaService.movie.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { sessions: true },
      });
    });
  });

  describe('bulkRemove', () => {
    it('should remove multiple movies successfully', async () => {
      const movieIds = [1, 2, 3];
      const deletedCount = 3;

      (prismaService.movie.deleteMany as jest.Mock).mockResolvedValue({
        count: deletedCount,
      });

      const result = await service.bulkRemove(movieIds);

      expect(result).toEqual({ deletedCount });
      expect(prismaService.movie.deleteMany).toHaveBeenCalledWith({
        where: {
          id: { in: movieIds },
        },
      });
    });

    it('should return zero count when no movies are deleted', async () => {
      const movieIds = [999, 1000];
      const deletedCount = 0;

      (prismaService.movie.deleteMany as jest.Mock).mockResolvedValue({
        count: deletedCount,
      });

      const result = await service.bulkRemove(movieIds);

      expect(result).toEqual({ deletedCount });
      expect(prismaService.movie.deleteMany).toHaveBeenCalledWith({
        where: {
          id: { in: movieIds },
        },
      });
    });

    it('should handle empty array of movie ids', async () => {
      const movieIds: number[] = [];
      const deletedCount = 0;

      (prismaService.movie.deleteMany as jest.Mock).mockResolvedValue({
        count: deletedCount,
      });

      const result = await service.bulkRemove(movieIds);

      expect(result).toEqual({ deletedCount });
      expect(prismaService.movie.deleteMany).toHaveBeenCalledWith({
        where: {
          id: { in: movieIds },
        },
      });
    });
  });

  describe('bulkCreate', () => {
    it('should create multiple movies successfully', async () => {
      const createBulkMovieDtos: CreateMovieDto[] = [
        { name: 'Movie 1', ageRestriction: 12, sessions: [] },
        { name: 'Movie 2', ageRestriction: 18, sessions: [] },
      ];
      const createdCount = 2;

      (prismaService.movie.createMany as jest.Mock).mockResolvedValue({
        count: createdCount,
      });

      const result = await service.bulkCreate(createBulkMovieDtos);

      expect(result).toEqual({ createdCount });
      expect(prismaService.movie.createMany).toHaveBeenCalledWith({
        data: createBulkMovieDtos,
      });
    });

    it('should return zero count when no movies are created', async () => {
      const createBulkMovieDtos: CreateMovieDto[] = [];
      const createdCount = 0;

      (prismaService.movie.createMany as jest.Mock).mockResolvedValue({
        count: createdCount,
      });

      const result = await service.bulkCreate(createBulkMovieDtos);

      expect(result).toEqual({ createdCount });
      expect(prismaService.movie.createMany).toHaveBeenCalledWith({
        data: createBulkMovieDtos,
      });
    });

    it('should throw an error when the database operation fails', async () => {
      const createBulkMovieDtos: CreateMovieDto[] = [
        { name: 'Movie 1', ageRestriction: 12, sessions: [] },
        { name: 'Movie 2', ageRestriction: 18, sessions: [] },
      ];
      const error = new Error('Database error');

      (prismaService.movie.createMany as jest.Mock).mockRejectedValue(error);

      await expect(service.bulkCreate(createBulkMovieDtos)).rejects.toThrow(
        'Database error',
      );
    });

    it('should handle partial creation when some movies already exist', async () => {
      const createBulkMovieDtos: CreateMovieDto[] = [
        { name: 'Movie 1', ageRestriction: 12, sessions: [] },
        { name: 'Movie 2', ageRestriction: 18, sessions: [] },
      ];
      const createdCount = 1;

      (prismaService.movie.createMany as jest.Mock).mockResolvedValue({
        count: createdCount,
      });

      const result = await service.bulkCreate(createBulkMovieDtos);

      expect(result).toEqual({ createdCount });
      expect(prismaService.movie.createMany).toHaveBeenCalledWith({
        data: createBulkMovieDtos,
      });
    });
  });
});
