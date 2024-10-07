import axios from 'axios'
import React from 'react'


const axiosPublic =  axios.create({
    baseURL: 'http://localhost:8080/auth',
  })

const useAxiosPublic = () => {
  return axiosPublic
}

export default useAxiosPublic;