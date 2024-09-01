import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor(message?: string) {
    super(message || 'User not found', HttpStatus.NOT_FOUND);
  }
}

export class SessionNotFoundException extends HttpException {
  constructor(message?: string) {
    super(message || 'Session not found', HttpStatus.NOT_FOUND);
  }
}

export class TicketNotFoundException extends HttpException {
  constructor(message?: string) {
    super(message || 'Ticket not found', HttpStatus.NOT_FOUND);
  }
}

export class TicketAlreadyRedeemedException extends HttpException {
  constructor(message?: string) {
    super(message || 'Ticket already redeemed', HttpStatus.BAD_REQUEST);
  }
}

export class SessionIsFullException extends HttpException {
  constructor(message?: string) {
    super(message || 'Session is full', HttpStatus.BAD_REQUEST);
  }
}

export class UserExistException extends HttpException {
  constructor(message?: string) {
    super(message || 'This user already exists', HttpStatus.BAD_REQUEST);
  }
}

export class SessionHasPassedException extends HttpException {
  constructor(message?: string) {
    super(
      message || 'This session has already passed and cannot be attended',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class SessionNotTodayException extends HttpException {
  constructor(message?: string) {
    super(
      message || 'This session is not scheduled for today',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class InvalidDateForTicketException extends HttpException {
  constructor(message?: string) {
    super(
      message || 'Cannot buy ticket for past or current sessions',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class MovieNotFoundException extends HttpException {
  constructor(message?: string) {
    super(message || 'Movie not found', HttpStatus.NOT_FOUND);
  }
}

export class DuplicateSessionException extends HttpException {
  constructor(message?: string) {
    super(
      message ||
        'A session with the same date, time slot, and room number already exists',
      HttpStatus.CONFLICT,
    );
  }
}
