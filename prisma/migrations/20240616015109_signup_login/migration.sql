/*
  Warnings:

  - A unique constraint covering the columns `[localUserId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_authorId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_topicId_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_userId_fkey";

-- DropForeignKey
ALTER TABLE "topics" DROP CONSTRAINT "topics_authorId_fkey";

-- DropForeignKey
ALTER TABLE "user_comment_likes" DROP CONSTRAINT "user_comment_likes_commentId_fkey";

-- DropForeignKey
ALTER TABLE "user_comment_likes" DROP CONSTRAINT "user_comment_likes_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_topic_likes" DROP CONSTRAINT "user_topic_likes_topicId_fkey";

-- DropForeignKey
ALTER TABLE "user_topic_likes" DROP CONSTRAINT "user_topic_likes_userId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "localUserId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_localUserId_key" ON "users"("localUserId");

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_topic_likes" ADD CONSTRAINT "user_topic_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_topic_likes" ADD CONSTRAINT "user_topic_likes_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_comment_likes" ADD CONSTRAINT "user_comment_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_comment_likes" ADD CONSTRAINT "user_comment_likes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "topics_lastCommentId_unique" RENAME TO "topics_lastCommentId_key";

-- RenameIndex
ALTER INDEX "users.email_unique" RENAME TO "users_email_key";

-- RenameIndex
ALTER INDEX "users.githubUserId_unique" RENAME TO "users_githubUserId_key";

-- RenameIndex
ALTER INDEX "users.username_unique" RENAME TO "users_username_key";
