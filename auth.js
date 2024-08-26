import 'dotenv/config'
const BOT_TOKEN = process.env.BOT_TOKEN
import { createHmac, createHash } from "node:crypto";

// https://stackoverflow.com/a/77265267
export const verifyUser = (creds, loginType) => {
  if (loginType === 'jwt') {
    return verifyJWT(creds)
  }
  if (process.env.ENV === 'dev') {
    return process.env.DEV_USER
  }
  try {
    const q = new URLSearchParams(creds)
    const hash = q.get("hash")
    q.delete("hash")
    const v = Array.from(q.entries())
    v.sort(([aN], [bN]) => aN.localeCompare(bN))
    const data_check_string = v.map(([n, v]) => `${n}=${v}`).join("\n")

    let key = ''
    if (loginType === 'webapp') {
      const secret_key = createHmac("sha256", "WebAppData").update(BOT_TOKEN).digest()
      key = createHmac("sha256", secret_key)
        .update(data_check_string)
        .digest("hex")
    } else if (loginType === 'widget') {
      // https://gist.github.com/Pitasi/574cb19348141d7bf8de83a0555fd2dc
      const secret_key = createHash("sha256").update(BOT_TOKEN).digest()
      key = createHmac("sha256", secret_key)
        .update(data_check_string)
        .digest("hex")
    }
    if (key === hash) {
      let userId = null
      if (loginType === 'webapp') {
        userId = JSON.parse(q.get('user')).id.toString()
      } else if (loginType === 'widget') {
        userId = q.get('id')
      }
      return userId
    }
  } catch (e) {
    console.log(e)
  }
  return null
}

import jwt from 'jsonwebtoken'
const secret = process.env.JWT_SECRET

export const createJWT = (id) => {
  const token = jwt.sign({
    id,
  }, secret, {
    expiresIn: 60 * 60,
    notBefore: 0,
    issuer: 'YOUR APP NAME',
    subject: id,
    audience: 'YOUR APP NAME',
  })

  return token
}
const verifyJWT = (token) => {
  try {
    const decoded = jwt.verify(token, secret, {
      issuer: 'YOUR APP NAME',
      audience: 'YOUR APP NAME',
    })
    return decoded.id
  } catch (e) {
    return null
  }
}
