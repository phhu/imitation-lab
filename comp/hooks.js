import React, { useState, useEffect } from 'react'

export const useAsyncHook = fn => (...args) => {

  const [result, setResult] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    //if (x !== "") {
    console.log("running effect",fn,args)
    fn(...args).then(res => {
      console.log("res",res)
      setLoading(false)
      setResult(res)        
    })
    //}
  }, [])

  return [result, loading]
}

