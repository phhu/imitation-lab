import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux'

export const Declutter = ({ children }) => {
  const declutter = useSelector(s => s.declutter)
  return <span className={declutter ? 'hidden' : ''}>{children}</span>
}
