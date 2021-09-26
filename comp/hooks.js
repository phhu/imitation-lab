import React, { useState, useEffect } from 'react'

export const useAsyncHook = fn => (...args) => {

  const [result, setResult] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    //if (x !== "") {
    console.log("running effect")
    fn(...args).then(res => {
      setLoading(false)
      console.log("res",res)
      setResult(res)        
    })
    //}
  }, args)

  return [result, loading]
}

