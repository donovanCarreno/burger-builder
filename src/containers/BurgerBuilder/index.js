import React, { Component } from 'react'
import { connect } from 'react-redux'

import axios from '../../axios-orders'

import Aux from '../../hoc/Aux'
import withErrorHandler from '../../hoc/withErrorHandler'
import Burger from '../../components/Burger'
import BuildControls from '../../components/Burger/BuildControls'
import Modal from '../../components/UI/Modal'
import Spinner from '../../components/UI/Spinner'
import OrderSummary from '../../components/Burger/OrderSummary'

import * as actions from '../../store/actions'

export class BurgerBuilder extends Component {
  state = {
    purchasing: false
  }

  componentDidMount() {
    this.props.onInitIngredients()
  }

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .reduce((acc, cv) => {
        return acc + ingredients[cv]
      }, 0)

    return sum > 0
  }

  addIngredientHandler = (type) => {
    // const oldCount = this.state.ingredients[type]
    // const updatedCount = oldCount + 1
    // const updatedIngredients = {
    //   ...this.state.ingredients,
    // }
    // updatedIngredients[type] = updatedCount
    // const priceAddition = INGREDIENT_PRICES[type]
    // const oldPrice = this.state.totalPrice
    // const newPrice = oldPrice + priceAddition
    //
    // this.setState({ totalPrice: newPrice, ingredients: updatedIngredients })
    // this.updatePurchaseState(updatedIngredients)
  }

  removeIngredientHandler = (type) => {
    // const oldCount = this.state.ingredients[type]
    //
    // if (oldCount <= 0) {
    //   return
    // }
    //
    // const updatedCount = oldCount - 1
    // const updatedIngredients = {
    //   ...this.state.ingredients,
    // }
    // updatedIngredients[type] = updatedCount
    // const priceDeduction = INGREDIENT_PRICES[type]
    // const oldPrice = this.state.totalPrice
    // const newPrice = oldPrice - priceDeduction
    //
    // this.setState({ totalPrice: newPrice, ingredients: updatedIngredients })
    // this.updatePurchaseState(updatedIngredients)
  }

  purchaseHandler = () => {
    if (this.props.isAuthenticated) {
      this.setState({ purchasing: true })
    } else {
      this.props.onSetAuthRedirectPath('/checkout')
      this.props.history.push('/auth')
    }
  }

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false })
  }

  purchaseContinueHandler = () => {
    // const queryParams = []
    //
    // for (let i in this.state.ingredients) {
    //   queryParams.push(`${encodeURIComponent(i)}=${encodeURIComponent(this.state.ingredients[i])}`)
    // }
    // queryParams.push(`price=${this.state.totalPrice}`)
    //
    // const queryString = queryParams.join('&')
    // this.props.history.push({
    //   pathname: '/checkout',
    //   search: `?${queryString}`
    // })
    this.props.onInitPurchase()
    this.props.history.push('/checkout')
  }

  render() {
    const disabledInfo = {
      ...this.props.ings
    }

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0
    }

    let orderSummary = null

    let burger = this.props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />

    if (this.props.ings) {
      burger = (
        <Aux>
          <Burger ingredients={this.props.ings} />
          <BuildControls
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoved}
            disabled={disabledInfo}
            price={this.props.totalPrice}
            purchaseable={this.updatePurchaseState(this.props.ings)}
            ordered={this.purchaseHandler}
            isAuth={this.props.isAuthenticated}
          />
        </Aux>
      )

      orderSummary = (
        <OrderSummary
          ingredients={this.props.ings}
          purchaseCancelled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
          price={this.props.totalPrice}
        />
      )
    }

    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          { orderSummary }
        </Modal>
        { burger }
      </Aux>
    )
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    totalPrice: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingredientName) => dispatch(actions.addIngredient(ingredientName)),
    onIngredientRemoved: (ingredientName) => dispatch(actions.removeIngredient(ingredientName)),
    onInitIngredients: () => dispatch(actions.initIngredients()),
    onInitPurchase: () => dispatch(actions.purchaseInit()),
    onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios))
