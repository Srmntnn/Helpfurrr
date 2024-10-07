import React, { useState, useEffect } from 'react'
import DogCards from './DogCards'

const PostingDogs = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchRequests = async () => {
    try {
      const response = await fetch('http://localhost:8080/dogs/requests/')
      if (!response.ok) {
        throw new Error('An error occurred')
      }
      const data = await response.json()
      setRequests(data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {

    fetchRequests()
  }, [])

  return (
    <div className='pet-container'>
      {loading ? (
        <p>Loading...</p>
      ) : (
        requests.length > 0 ? (
          requests.map((request, index) => (
            <DogCards key={request._id} dog={request} updateCards={fetchRequests} deleteBtnText={"Reject"} approveBtn={true}/>
          ))
        ) : (
          <p>No requests available</p>
        )
      )}
    </div>
  )
}

export default PostingDogs