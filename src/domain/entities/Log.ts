// src/domain/entities/Log.ts
export class Log {
    constructor(
      public type: string,
      public userId: string,
      public message: string,
      public timestamp: Date,
      public createdAt: Date = new Date(),  // Adicionando createdAt
    ) {}
  }
  