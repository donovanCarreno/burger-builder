import React, { Component } from 'react'
import axios from '../../../axios-orders'
import { connect } from 'react-redux'

import classes from './ContactData.css'

import Button from '../../../components/UI/Button'
import Spinner from '../../../components/UI/Spinner'
import Input from '../../../components/UI/Input'

import withErrorHandler from '../../../hoc/withErrorHandler'
import * as actions from '../../../store/actions'

import { updateObject, checkValidity } from '../../../shared/utility'

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Name'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Street'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      zipCode: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'ZIP Code'
        },
        value: '',
        validation: {
          required: true,
          minLength: 5,
          maxLength: 5
        },
        valid: false,
        touched: false
      },
      country : {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Country'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Your E-Mail'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            { value: 'fastest', displayValue: 'Fastest' },
            { value: 'cheapest', displayValue: 'Cheapest' },
          ]
        },
        value: 'fastest',
        validation: {},
        valid: true
      }
    },
    formIsValid: false,
  }

  orderHandler = (e) => {
    e.preventDefault()
    const formData = {}
    for (let formElId in this.state.orderForm) {
      formData[formElId] = this.state.orderForm[formElId].value
    }

    const order = {
      ingredients: this.props.ings,
      price: this.props.totalPrice,
      orderData: formData,
      userId: this.props.userId
    }

    this.props.onOrderBurger(order, this.props.token)
  }

  // checkValidity(value, rules) {
  //   let isValid = true
  //
  //   if (rules.required) {
  //     isValid = value.trim() !== '' && isValid
  //   }
  //
  //   if(rules.minLength) {
  //     isValid = value.length >= rules.minLength && isValid
  //   }
  //
  //   if(rules.maxLength) {
  //     isValid = value.length <= rules.maxLength && isValid
  //   }
  //
  //   if (rules.isEmail) {
  //       const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  //       isValid = pattern.test(value) && isValid
  //   }
  //
  //   if (rules.isNumeric) {
  //       const pattern = /^\d+$/;
  //       isValid = pattern.test(value) && isValid
  //   }
  //
  //   return isValid
  // }

  inputChangedHandler = (e, id) => {
    // doesn't copy nested objects
    // const updatedOrderForm = {
    //   ...this.state.orderForm
    // }
    // need to copy nested objects
    // to update immutably
    // const updatedFormElement = {
    //   ...updatedOrderForm[id]
    // }

    const updatedFormElement = updateObject(this.state.orderForm[id], {
      value: e.target.value,
      valid: checkValidity(e.target.value, this.state.orderForm[id].validation),
      touched: true
    })

    const updatedOrderForm = updateObject(this.state.orderForm, {
      [id]: updatedFormElement
    })

    // updatedFormElement.value = e.target.value
    // updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation)
    // updatedFormElement.touched = true
    // updatedOrderForm[id] = updatedFormElement

    let formIsValid = true
    for (let inputId in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputId].valid && formIsValid
    }

    this.setState({ orderForm: updatedOrderForm, formIsValid })
  }

  render() {
    const formElementsArray = []

    for (let key in this.state.orderForm) {
      formElementsArray.push({
        id: key,
        config: this.state.orderForm[key]
      })
    }

    let form = (
      <form onSubmit={this.orderHandler}>
        { formElementsArray.map(formElement => (
          <Input
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched}
            changed={(e) => this.inputChangedHandler(e, formElement.id)} />
        ))}
        <Button btnType='Success' disabled={!this.state.formIsValid} clicked={this.orderHandler}>ORDER</Button>
      </form>
    )

    if (this.props.loading) {
      form = <Spinner />
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        { form }
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    totalPrice: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios))
