import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  PRISMA_NOT_FOUND,
  PRISMA_UNIQUE_CONSTRAINT_VIOLATION,
} from '../../common/constants/prisma-errors.constants';
import {
  DuplicateSessionException,
  MovieNotFoundException,
} from '../../common/errors/custom-errors';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { CreateMovieDto } from './dto/create-movie.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateMovieDto) {
    return this.prisma.$transaction(async (prisma) => {
      const { sessions, ...movieData } = data;

      const movie = await prisma.movie.create({
        data: movieData,
      });

      if (sessions && sessions.length > 0) {
        await prisma.session.createMany({
          data: sessions.map((session) => ({
            ...session,
            movieId: movie.id,
          })),
        });
      }

      return prisma.movie.findUnique({
        where: { id: movie.id },
        include: { sessions: true },
      });
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.MovieWhereUniqueInput;
    where?: Prisma.MovieWhereInput;
    orderBy?: Prisma.MovieOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.movie.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: { sessions: true },
    });
  }

  async findById(id: number) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      include: { sessions: true },
    });

    return movie;
  }

  async update(movieId: number, data: UpdateMovieDto) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const { sessions, ...movieData } = data;

        const updatedMovie = await prisma.movie.update({
          where: { id: movieId },
          data: {
            ...movieData,
            sessions:
              sessions && sessions.length > 0
                ? {
                    upsert: sessions.map((session) => {
                      if ('id' in session) {
                        return {
                          where: { id: session.id },
                          update: {
                            date: session.date,
                            timeSlot: session.timeSlot,
                            roomNumber: session.roomNumber,
                            movieId: movieId,
                          },
                          create: {
                            date: session.date,
                            timeSlot: session.timeSlot,
                            roomNumber: session.roomNumber,
                            movieId: movieId,
                          },
                        };
                      } else {
                        return {
                          where: { id: -1 },
                          create: {
                            date: session.date,
                            timeSlot: session.timeSlot,
                            roomNumber: session.roomNumber,
                            movieId: movieId,
                          },
                          update: {},
                        };
                      }
                    }),
                  }
                : undefined,
          },
          include: { sessions: true },
        });

        return updatedMovie;
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PRISMA_NOT_FOUND) {
          throw new MovieNotFoundException();
        }
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.movie.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PRISMA_NOT_FOUND) {
          throw new MovieNotFoundException();
        }
      }
      throw error;
    }
  }

  async bulkAddSessions(movieId: number, data: CreateSessionDto[]) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      throw new MovieNotFoundException();
    }
    try {
      const addedSessions = await this.prisma.session.createMany({
        data: data.map((session) => ({
          ...session,
          movieId: movieId,
        })),
      });
      return { addedCount: addedSessions.count };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PRISMA_UNIQUE_CONSTRAINT_VIOLATION
      ) {
        throw new DuplicateSessionException();
      }
      throw error;
    }
  }

  async getMovieSessions(movieId: number) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
      include: {
        sessions: {
          orderBy: {
            date: 'asc',
          },
        },
      },
    });

    if (!movie) {
      throw new MovieNotFoundException();
    }

    return movie.sessions;
  }

  async bulkCreate(createBulkMovieDtos: CreateMovieDto[]) {
    const createdMovies = await this.prisma.movie.createMany({
      data: createBulkMovieDtos,
    });
    return { createdCount: createdMovies.count };
  }

  async bulkRemove(ids: number[]) {
    const deletedMovies = await this.prisma.movie.deleteMany({
      where: {
        id: { in: ids },
      },
    });
    return { deletedCount: deletedMovies.count };
  }
}
