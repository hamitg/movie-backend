import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import {
  InvalidDateForTicketException,
  SessionHasPassedException,
  SessionIsFullException,
  SessionNotFoundException,
  SessionNotTodayException,
  TicketNotFoundException,
  UserNotFoundException,
} from '../../common/errors/custom-errors';
import { PRISMA_NOT_FOUND } from '../../common/constants/prisma-errors.constants';
import { PrismaService } from 'nestjs-prisma';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            ticket: {
              findFirst: jest.fn(),
              update: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
            },
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              delete: jest.fn(),
              update: jest.fn(),
            },
            session: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('attendSession', () => {
    const userId = 1;
    const sessionId = 1;

    it('should successfully mark a ticket as redeemed', async () => {
      const now = new Date();
      const ticket = {
        id: 1,
        userId,
        sessionId,
        isRedeemed: false,
        session: {
          id: sessionId,
          date: now.toISOString().split('T')[0],
          timeSlot: 'SLOT_22_00',
          movie: { name: 'Test Movie' },
        },
      };

      const updatedTicket = { ...ticket, isRedeemed: true };

      (prismaService.ticket.findFirst as jest.Mock).mockResolvedValue(ticket);
      (prismaService.ticket.update as jest.Mock).mockResolvedValue(
        updatedTicket,
      );

      const result = await service.attendSession({ userId, sessionId });

      expect(result).toEqual({
        id: 1,
        movieName: 'Test Movie',
        date: now.toISOString().split('T')[0],
        timeSlot: 5,
      });

      expect(prismaService.ticket.findFirst).toHaveBeenCalledWith({
        where: { userId, sessionId },
        include: { session: true },
      });

      expect(prismaService.ticket.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { isRedeemed: true },
        include: { session: { include: { movie: true } } },
      });
    });

    it('should throw TicketNotFoundException if ticket does not exist', async () => {
      (prismaService.ticket.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(
        service.attendSession({ userId, sessionId }),
      ).rejects.toThrow(TicketNotFoundException);
    });

    it('should throw SessionNotTodayException if session is not today', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const ticket = {
        id: 1,
        userId,
        sessionId,
        isRedeemed: false,
        session: {
          id: sessionId,
          date: tomorrow.toISOString().split('T')[0],
          timeSlot: 'SLOT_22_00',
        },
      };

      (prismaService.ticket.findFirst as jest.Mock).mockResolvedValue(ticket);

      await expect(
        service.attendSession({ userId, sessionId }),
      ).rejects.toThrow(SessionNotTodayException);
    });

    it('should throw SessionHasPassedException if session time has passed', async () => {
      const now = new Date();
      const ticket = {
        id: 1,
        userId,
        sessionId,
        isRedeemed: false,
        session: {
          id: sessionId,
          date: now.toISOString().split('T')[0],
          timeSlot: 'SLOT_22_00',
        },
      };

      (prismaService.ticket.findFirst as jest.Mock).mockResolvedValue(ticket);

      await expect(
        service.attendSession({ userId, sessionId }),
      ).rejects.toThrow(SessionHasPassedException);
    });
  });

  describe('getWatchHistory', () => {
    const userId = 1;

    it('should return watch history for a user', async () => {
      const user = { id: userId, username: 'testuser', age: 25, role: 1 };
      const watchHistory = [
        {
          id: 1,
          userId: userId,
          sessionId: 1,
          isRedeemed: true,
          session: {
            id: 1,
            date: '2023-05-01',
            timeSlot: 1,
            movie: { id: 1, name: 'Movie 1' },
          },
        },
        {
          id: 2,
          userId: userId,
          sessionId: 2,
          isRedeemed: true,
          session: {
            id: 2,
            date: '2023-05-15',
            timeSlot: 2,
            movie: { id: 2, name: 'Movie 2' },
          },
        },
      ];

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(user);
      (prismaService.ticket.findMany as jest.Mock).mockResolvedValue(
        watchHistory,
      );

      const result = await service.getWatchHistory({ userId });

      expect(result).toEqual([
        {
          id: 1,
          watchDate: '2023-05-01',
          movieName: 'Movie 1',
          movieId: 1,
        },
        {
          id: 2,
          watchDate: '2023-05-15',
          movieName: 'Movie 2',
          movieId: 2,
        },
      ]);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });

      expect(prismaService.ticket.findMany).toHaveBeenCalledWith({
        where: {
          userId: userId,
          isRedeemed: true,
        },
        include: {
          session: {
            include: {
              movie: true,
            },
          },
        },
        orderBy: {
          session: {
            date: 'desc',
          },
        },
      });
    });

    it('should return an empty array if user has no watch history', async () => {
      const user = { id: userId, username: 'testuser', age: 25, role: 1 };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(user);
      (prismaService.ticket.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.getWatchHistory({ userId });

      expect(result).toEqual([]);
    });

    it('should throw UserNotFoundException if user does not exist', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.getWatchHistory({ userId })).rejects.toThrow(
        new UserNotFoundException(),
      );

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });

  describe('buyTicket', () => {
    it('should successfully buy a ticket', async () => {
      const buyTicketDto = { userId: 1, sessionId: 1 };
      const session = {
        id: 1,
        date: '2025-05-20',
        timeSlot: 'SLOT_22_00',
        roomNumber: 1,
        movieId: 1,
        movie: { name: 'Test Movie', id: 1, ageRestriction: 12 },
      };
      const createdTicket = {
        id: 1,
        userId: 1,
        sessionId: 1,
        isRedeemed: false,
        session: session,
      };

      (prismaService.session.findUnique as jest.Mock).mockResolvedValue(
        session,
      );
      (prismaService.ticket.findFirst as jest.Mock).mockResolvedValue(null);
      (prismaService.ticket.create as jest.Mock).mockResolvedValue(
        createdTicket,
      );

      const result = await service.buyTicket(buyTicketDto);

      expect(result).toEqual({
        id: 1,
        movieName: 'Test Movie',
        date: '2025-05-20',
        timeSlot: 'SLOT_22_00',
      });
      expect(prismaService.session.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { movie: true },
      });
      expect(prismaService.ticket.findFirst).toHaveBeenCalledWith({
        where: { sessionId: 1 },
      });
      expect(prismaService.ticket.create).toHaveBeenCalledWith({
        data: {
          isRedeemed: false,
          session: {
            connect: { id: 1 },
          },
          user: {
            connect: { id: 1 },
          },
        },
        include: {
          session: {
            include: { movie: true },
          },
        },
      });
    });

    it('should throw SessionNotFoundException if session does not exist', async () => {
      const buyTicketDto = { userId: 1, sessionId: 999 };

      (prismaService.session.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.buyTicket(buyTicketDto)).rejects.toThrow(
        SessionNotFoundException,
      );
      expect(prismaService.session.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
        include: { movie: true },
      });
    });

    it('should throw InvalidDateForTicketException if session date is in the past', async () => {
      const buyTicketDto = { userId: 1, sessionId: 1 };
      const session = {
        id: 1,
        date: '2023-01-01',
        timeSlot: 'SLOT_22_00',
        roomNumber: 1,
        movieId: 1,
        movie: { name: 'Test Movie', id: 1, ageRestriction: 12 },
      };

      (prismaService.session.findUnique as jest.Mock).mockResolvedValue(
        session,
      );

      await expect(service.buyTicket(buyTicketDto)).rejects.toThrow(
        InvalidDateForTicketException,
      );
      expect(prismaService.session.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { movie: true },
      });
    });

    it('should throw SessionIsFullException if ticket already exists for the session', async () => {
      const buyTicketDto = { userId: 1, sessionId: 1 };
      const session = {
        id: 1,
        date: '2025-12-31',
        timeSlot: 'SLOT_10_12',
        roomNumber: 1,
        movieId: 1,
        movie: { name: 'Test Movie', id: 1, ageRestriction: 12 },
      };

      (prismaService.session.findUnique as jest.Mock).mockResolvedValue(
        session,
      );
      (prismaService.ticket.findFirst as jest.Mock).mockResolvedValue({
        id: 1,
      });

      await expect(service.buyTicket(buyTicketDto)).rejects.toThrow(
        SessionIsFullException,
      );
      expect(prismaService.session.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { movie: true },
      });
      expect(prismaService.ticket.findFirst).toHaveBeenCalledWith({
        where: { sessionId: 1 },
      });
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        username: 'testuser',
        password: 'password',
        age: 25,
        role: 1,
      };
      const createdUser = { id: 1, ...createUserDto };

      (prismaService.user.create as jest.Mock).mockResolvedValue(createdUser);

      const result = await service.create(createUserDto);
      expect(result).toEqual(createdUser);
    });
  });

  describe('findById', () => {
    it('should find a user by id', async () => {
      const userId = 1;
      const user = { id: userId, username: 'testuser', age: 25, role: 1 };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(user);

      const result = await service.findById({ userId });
      expect(result).toEqual(user);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should throw UserNotFoundException if user not found', async () => {
      const userId = 999;

      (prismaService.user.findUnique as jest.Mock).mockRejectedValue(
        new UserNotFoundException(),
      );

      await expect(service.findById({ userId })).rejects.toThrow(
        new UserNotFoundException(),
      );
    });
  });

  describe('findByUsername', () => {
    it('should return user data without password when user exists', async () => {
      const username = 'testuser';
      const user = {
        id: 1,
        username,
        password: 'hashedpassword',
        age: 25,
        role: 1,
      };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(user);

      const result = await service.findByUsername({ username });
      expect(result).toEqual(
        expect.objectContaining({
          id: user.id,
          username: user.username,
          age: user.age,
          role: user.role,
        }),
      );
      expect(result).not.toHaveProperty('password');
    });

    it('should return null when user does not exist', async () => {
      (prismaService.user.findUnique as jest.Mock).mockRejectedValue(
        new UserNotFoundException(),
      );

      await expect(
        service.findByUsername({ username: 'nonexistentuser' }),
      ).rejects.toThrow(new UserNotFoundException());
    });
  });

  describe('delete', () => {
    it('should return deleted user data', async () => {
      const userId = 1;
      const deletedUser = {
        id: userId,
        username: 'testuser',
        age: 25,
        role: 1,
      };

      (prismaService.user.delete as jest.Mock).mockResolvedValue(deletedUser);

      const result = await service.delete({ userId });

      expect(result).toEqual(deletedUser);
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should throw UserNotFoundException if user not found', async () => {
      const userId = 999;

      const error = new Error('User not found');
      error['code'] = PRISMA_NOT_FOUND;
      (prismaService.user.delete as jest.Mock).mockRejectedValue(
        new UserNotFoundException(),
      );

      await expect(service.delete({ userId })).rejects.toThrow(
        new UserNotFoundException(),
      );
    });
  });

  describe('update', () => {
    it('should update user data and return updated user', async () => {
      const userId = 1;
      const updateData = { age: 26, role: 2 };
      const updatedUser = { id: userId, username: 'testuser', ...updateData };

      (prismaService.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await service.update({ userId, ...updateData });
      expect(result).toEqual(updatedUser);
    });

    it('should only update allowed fields', async () => {
      const userId = 1;
      const updateData = { age: 26, role: 2 };

      await service.update({ userId, ...updateData });

      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { age: 26, role: 2 },
      });
    });

    it('should throw UserNotFoundException if user not found', async () => {
      const userId = 999;
      const updateData = { age: 26 };

      (prismaService.user.update as jest.Mock).mockRejectedValue(
        new UserNotFoundException(),
      );

      await expect(service.update({ userId, ...updateData })).rejects.toThrow(
        new UserNotFoundException(),
      );
    });
  });
});
