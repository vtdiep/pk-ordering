import { PrismaClient } from '@prisma/client';
import { MockProxy, mockDeep, mock } from 'jest-mock-extended';

export type Context = {
  prisma: PrismaClient;
};

export type MockContext = {
  prisma: MockProxy<PrismaClient>;
};

export const createMockContext = (): MockContext => ({
  prisma: mockDeep<PrismaClient>(),
});
