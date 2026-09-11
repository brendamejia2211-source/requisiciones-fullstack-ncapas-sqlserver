IF DB_ID(N'requisiciones') IS NULL
BEGIN
    CREATE DATABASE [requisiciones];
END
GO

USE [requisiciones];
GO

PRINT 'Base de datos requisiciones lista para Prisma.';
GO
