import api from '@/services2'
import handleError from '@/services2/utils/handleError'

export default async (userId: string) => {
  if (!userId) {
    return handleError({ message: 'User ID is required' })
  }
  const response = await api.get(`users/${userId}`)
  return response.data
}
