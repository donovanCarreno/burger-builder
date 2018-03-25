import React from 'react'

import classes from './Burger.css'

import BurgerIngredient from './BurgerIngredient'

const Burger = (props) => {
  let transformedIngredients = Object.keys(props.ingredients)
    .map(key => {
      return [...Array(props.ingredients[key])].map((_, i) => {
        return <BurgerIngredient key={key + i} type={key} />
      })
    })
    .reduce((acc, cv) => {
      return acc.concat(cv)
    }, [])

  if (transformedIngredients.length === 0) {
    transformedIngredients = <p>Please start adding ingredients!</p>
  }

  return (
    <div className={classes.Burger}>
      <BurgerIngredient type='bread-top' />
      {transformedIngredients}
      <BurgerIngredient type='bread-bottom' />
    </div>
  )
}

export default Burger
