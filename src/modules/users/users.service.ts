import { Injectable } from '@nestjs/common';
import {
  TIME_SLOT_RANGES,
  TimeSlot,
} from '../../common/constants/time-slots.constants';
import { getDateFromSession } from '../../common/utils/movies.utils';
import * as bcrypt from 'bcrypt';
import {
  InvalidDateForTicketException,
  SessionHasPassedException,
  SessionIsFullException,
  SessionNotFoundException,
  SessionNotTodayException,
  TicketAlreadyRedeemedException,
  TicketNotFoundException,
  UserNotFoundException,
} from '../../common/errors/custom-errors';

import { CreateUserDto } from './dto/create-user.dto';
import { AttendSessionDto } from './dto/attend-session.dto';
import { FindByIdDto } from './dto/find-by-user-id.dto';
import { FindByUsernameDto } from './dto/find-by-username.dto';
import { GetWatchHistoryDto } from './dto/get-watch-history.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { UpdateUserWithIdDto } from './dto/update-user-with-id.dto';
import { PRISMA_NOT_FOUND } from '../../common/constants/prisma-errors.constants';
import { PrismaService } from 'nestjs-prisma';
import { BuyTicketDto } from './dto/buy-ticket.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async attendSession(data: AttendSessionDto) {
    const ticket = await this.prisma.ticket.findFirst({
      where: { userId: data.userId, sessionId: data.sessionId },
      include: { session: true },
    });

    if (!ticket) {
      throw new TicketNotFoundException();
    }

    if (ticket.isRedeemed) {
      throw new TicketAlreadyRedeemedException();
    }

    const now = new Date();
    const sessionDate = getDateFromSession(ticket.session);

    if (sessionDate <= now) {
      throw new SessionHasPassedException();
    }

    if (sessionDate.toDateString() !== now.toDateString()) {
      throw new SessionNotTodayException();
    }

    const updatedTicket = await this.prisma.ticket.update({
      where: { id: ticket.id },
      data: { isRedeemed: true },
      include: { session: { include: { movie: true } } },
    });

    return {
      id: updatedTicket.id,
      movieName: updatedTicket.session.movie.name,
      date: updatedTicket.session.date,
      timeSlot: TIME_SLOT_RANGES[updatedTicket.session.timeSlot as TimeSlot],
    };
  }

  async getWatchHistory(data: GetWatchHistoryDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    const watchHistory = await this.prisma.ticket.findMany({
      where: {
        userId: data.userId,
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

    return watchHistory.map((ticket) => ({
      id: ticket.id,
      watchDate: ticket.session.date,
      movieName: ticket.session.movie.name,
      movieId: ticket.session.movie.id,
    }));
  }

  async buyTicket(data: BuyTicketDto) {
    const session = await this.prisma.session.findUnique({
      where: { id: data.sessionId },
      include: { movie: true },
    });

    if (!session) {
      throw new SessionNotFoundException();
    }

    const sessionDate = getDateFromSession(session);
    const now = new Date();

    if (sessionDate <= now) {
      throw new InvalidDateForTicketException();
    }

    const soldTicket = await this.prisma.ticket.findFirst({
      where: {
        sessionId: session.id,
      },
    });

    if (soldTicket) {
      throw new SessionIsFullException();
    }

    const ticket = await this.prisma.ticket.create({
      data: {
        isRedeemed: false,
        session: {
          connect: { id: data.sessionId },
        },
        user: {
          connect: { id: data.userId },
        },
      },
      include: {
        session: {
          include: {
            movie: true,
          },
        },
      },
    });

    return {
      id: ticket.id,
      movieName: ticket.session.movie.name,
      date: ticket.session.date,
      timeSlot: ticket.session.timeSlot,
    };
  }

  async create(data: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async findById(data: FindByIdDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
  }

  async findByUsernameWithPassword(data: FindByUsernameDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: data.username },
    });

    return user;
  }

  async findByUsername(data: FindByUsernameDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: data.username },
    });

    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
  }

  async delete(data: DeleteUserDto) {
    try {
      const deletedUser = await this.prisma.user.delete({
        where: { id: data.userId },
      });
      return deletedUser;
    } catch (error) {
      if (error.code === PRISMA_NOT_FOUND) {
        throw new UserNotFoundException();
      }
      throw error;
    }
  }

  async update(data: UpdateUserWithIdDto) {
    const { userId, ...updateData } = data;
    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }
}
