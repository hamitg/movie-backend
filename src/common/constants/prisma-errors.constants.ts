import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

export const PRISMA_UNIQUE_CONSTRAINT_VIOLATION = 'P2002';
export const PRISMA_NOT_FOUND = 'P2025';

export function getPrismaErrorMessage(
  error: PrismaClientKnownRequestError,
): string {
  switch (error.code) {
    case PRISMA_UNIQUE_CONSTRAINT_VIOLATION:
      return `${error.meta?.modelName} already exists`;
    case PRISMA_NOT_FOUND:
      return `${error.meta?.modelName} does not exist`;
    default:
      return 'An unknown error occurred';
  }
}

export function handlePrismaClientValidationError(
  error: unknown,
): string | null {
  if (error instanceof PrismaClientValidationError) {
    return 'Invalid query data';
  }
  return null;
}

export function handlePrismaError(error: unknown): { message: string } {
  if (error instanceof PrismaClientKnownRequestError) {
    return {
      message: getPrismaErrorMessage(error),
    };
  }

  const validationErrorMessage = handlePrismaClientValidationError(error);
  if (validationErrorMessage) {
    return {
      message: validationErrorMessage,
    };
  }

  return null;
}
