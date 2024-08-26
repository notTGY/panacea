import { text, integer, sqliteTable, primaryKey } from "drizzle-orm/sqlite-core"

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
})

