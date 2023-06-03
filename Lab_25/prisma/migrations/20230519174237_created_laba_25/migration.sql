BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[commits] (
    [id] INT NOT NULL IDENTITY(1,1),
    [repoId] INT,
    [message] VARCHAR(255),
    CONSTRAINT [PK__commits__3213E83F1EB2D977] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[repos] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] VARCHAR(255),
    [authorId] INT NOT NULL,
    CONSTRAINT [PK__repos__3213E83FD3BF7094] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[users] (
    [id] INT NOT NULL IDENTITY(1,1),
    [username] VARCHAR(16) NOT NULL,
    [email] VARCHAR(255),
    [password] VARCHAR(32) NOT NULL,
    [role] VARCHAR(5) NOT NULL,
    CONSTRAINT [PK__users__3213E83F015F4238] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[commits] ADD CONSTRAINT [fk_commits_repos] FOREIGN KEY ([repoId]) REFERENCES [dbo].[repos]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[repos] ADD CONSTRAINT [fk_repos_users] FOREIGN KEY ([authorId]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
