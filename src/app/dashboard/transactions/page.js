"use client"
import { MakeTransactions } from '@/components/transactions/make-transactions'
import SearchForm from '@/components/transactions/search-form'
import React from 'react'

function page() {
  return (
    <>
    <SearchForm />
      <MakeTransactions />
      </>
  )
}

export default page