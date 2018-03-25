import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import CheckoutSummary from '../../components/Order/CheckoutSummary'
import ContactData from './ContactData'

class Checkout extends Component {
  // state = {
  //   ingredients: null,
  //   totalPrice: 0
  // }

  componentWillMount() {
    // const query = new URLSearchParams(this.props.location.search)
    // const ingredients = {}
    // let totalPrice = 0
    //
    // for (let param of query.entries()) {
    //   if (param[0] === 'price') {
    //     totalPrice = param[1]
    //   } else {
    //     ingredients[param[0]] = +param[1]
    //   }
    // }
    //
    // this.setState({ ingredients, totalPrice })
  }

  checkoutCancelledHandler = () => {
    this.props.history.goBack()
  }

  checkoutContinuedHandler = () => {
    this.props.history.replace('/checkout/contact-data')
  }

  render() {
    let summary = <Redirect to="/"/>

    if (this.props.ings) {
      const purchasedRedirect = this.props.purchased ? <Redirect to='/' /> : null

      summary = (
        <div>
          {purchasedRedirect}
          <CheckoutSummary
            ingredients={this.props.ings}
            checkoutCancelled={this.checkoutCancelledHandler}
            checkoutContinued={this.checkoutContinuedHandler} />
          <Route
            path={`${this.props.match.url}/contact-data`}
            component={ContactData}/>
        </div>
      )
    }
    return (
      summary
    )
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    totalPrice: state.burgerBuilder.totalPrice,
    purchased: state.order.purchased
  }
}

export default connect(mapStateToProps)(Checkout)

/*

render() {
  return (
    <div>
      <CheckoutSummary
        ingredients={this.props.ings}
        checkoutCancelled={this.checkoutCancelledHandler}
        checkoutContinued={this.checkoutContinuedHandler} />
      <Route
        path={`${this.props.match.url}/contact-data`}
        render={(props) => (
          <ContactData
            {...props}
            ingredients={this.props.ings}
            totalPrice={this.props.totalPrice} />
          )
        }/>
    </div>
  )
}

*/
