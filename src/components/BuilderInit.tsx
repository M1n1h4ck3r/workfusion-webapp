'use client'
import { useEffect } from 'react'
import { builder } from '@builder.io/react'

export default function BuilderInit() {
  useEffect(() => {
    builder.init('a7f8ba6652ba4e18a7ee198779409d44')
  }, [])
  
  return null
}