import { eq, and, notInArray } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'

import { users } from './schema.js'
import { resolve } from 'path'

const dbPath = resolve('./db/sqlite.db')
const sqlite = new Database(dbPath)
const db = drizzle(sqlite)

export const createUser = async (id) => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1)

  if (user.length === 0) {
    await db.insert(users).values({
      id,
    })
  }
  return await getUser(id)
}

export const getUser = async (id) => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1)
  if (user.length === 0) {
    return null
  }
  return user[0]
}

export const updateUser = async (id, data) => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1)
  if (user.length === 0) {
    return null
  }

  const updateObj = {}
  const supported = [ ]
  for (const key in data) {
    if (supported.includes(key)) {
      const value = data[key]
      updateObj[key] = value
    }
  }
  if (updateObj === {}) {
    return new Error('Wrong updateUser params')
  }

  await db
    .update(users)
    .set(updateObj)
    .where(eq(users.id, id))
}

