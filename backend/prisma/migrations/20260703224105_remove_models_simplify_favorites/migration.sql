/*
  Warnings:

  - The primary key for the `favorites` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `recipeId` on the `favorites` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `favorites` table. All the data in the column will be lost.
  - The `id` column on the `favorites` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `ingredients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `instructions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recipe_ingredients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recipe_tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recipes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tags` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `recipe_id` to the `favorites` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `favorites` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `favorites` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "favorites" DROP CONSTRAINT "favorites_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "favorites" DROP CONSTRAINT "favorites_userId_fkey";

-- DropForeignKey
ALTER TABLE "instructions" DROP CONSTRAINT "instructions_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "recipe_ingredients" DROP CONSTRAINT "recipe_ingredients_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "recipe_ingredients" DROP CONSTRAINT "recipe_ingredients_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "recipe_tags" DROP CONSTRAINT "recipe_tags_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "recipe_tags" DROP CONSTRAINT "recipe_tags_tagId_fkey";

-- DropForeignKey
ALTER TABLE "recipes" DROP CONSTRAINT "recipes_authorId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_userId_fkey";

-- DropIndex
DROP INDEX "favorites_userId_recipeId_key";

-- AlterTable
ALTER TABLE "favorites" DROP CONSTRAINT "favorites_pkey",
DROP COLUMN "recipeId",
DROP COLUMN "userId",
ADD COLUMN     "cook_time" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "recipe_id" INTEGER NOT NULL,
ADD COLUMN     "servings" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "created_at" DROP NOT NULL,
ADD CONSTRAINT "favorites_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "refreshToken" TEXT;

-- DropTable
DROP TABLE "ingredients";

-- DropTable
DROP TABLE "instructions";

-- DropTable
DROP TABLE "recipe_ingredients";

-- DropTable
DROP TABLE "recipe_tags";

-- DropTable
DROP TABLE "recipes";

-- DropTable
DROP TABLE "reviews";

-- DropTable
DROP TABLE "tags";

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
