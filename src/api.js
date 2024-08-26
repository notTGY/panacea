import axios from 'axios'

export const get = async () => {
  const res = await axios.post(`/api/`)
  return res.data
}
