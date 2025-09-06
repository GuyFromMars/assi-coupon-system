import React from 'react'
import CouponGroup from './coupon-group'
import { Button } from '../ui/button'

function CouponGroupForm() {
  return (
     <div  className="flex justify-start w-full px-4 lg:px-6 space-x-2">
      <CouponGroup />
      <Button
            variant="outline"
          >
            Search
          </Button>
     </div>
  )
}

export default CouponGroupForm