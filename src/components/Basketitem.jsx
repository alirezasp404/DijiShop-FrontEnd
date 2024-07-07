import React from 'react'

function BasketItem({ item, product }) {
  return (
    <div>
        {product.name} x {item.amount}
    </div>
  )
}

export default BasketItem