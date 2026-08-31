-- Prevent a client from saving the same professional more than once.
CREATE UNIQUE INDEX "Favorite_userId_targetUserId_key" ON "Favorite"("userId", "targetUserId");
