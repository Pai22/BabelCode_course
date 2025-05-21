import { useState, useEffect } from 'react'
import axios from 'axios'

export default function useFetch(url) {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const { data } = await axios.get(url)
      setData(data)
      setIsLoading(false)
    }
    fetchData()
  }, [url])

  return {
    data,
    isLoading
  }
}
